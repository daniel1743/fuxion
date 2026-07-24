import fs from 'node:fs/promises';
import path from 'node:path';
import { contentId, runId, sourceHash, stableStringify } from './stable-json.js';
import { assertSchema } from './schemas.js';
import { normalizeArticle } from './normalizer.js';
import { createDiff, diffToMarkdown } from './diff.js';
import { restoreSnapshot } from './restore.js';
import {
  atomicCreate,
  atomicReplace,
  LocalAppendOnlyAuditRepository,
  LocalArtifactRepository,
  LocalSnapshotRepository,
} from './repositories.js';
import { ArtifactWriteError, NormalizationError, SnapshotIntegrityError } from './errors.js';
import { assertSafeId, secureRoot, secureTarget } from './safe-path.js';

export const PIPELINE_VERSION = 'slice1-1.0.0';

function event(run_id, article_id, type, details = {}) {
  return {
    event_id: contentId('event', `${run_id}\0${article_id}\0${type}\0${Date.now()}\0${Math.random()}`),
    run_id,
    article_id,
    type,
    created_at: new Date().toISOString(),
    details,
  };
}

export async function processLocalRecords({
  records,
  inputPath,
  outputDir,
  sourceType = 'fixture',
  pipelineVersion = PIPELINE_VERSION,
  stopAfterSnapshot = false,
  normalizer = normalizeArticle,
  resumeRunId = null,
}) {
  const root = await secureRoot(outputDir, { create: true, rejectPublicPath: true });
  const id = resumeRunId ? assertSafeId(resumeRunId, 'run_id') : runId();
  const started = new Date().toISOString();
  const artifacts = new LocalArtifactRepository(path.join(root, 'artifacts'));
  const snapshots = new LocalSnapshotRepository(path.join(root, 'snapshots'));
  const audit = new LocalAppendOnlyAuditRepository(path.join(root, 'events'));
  const freshManifest = {
    run_id: id,
    pipeline_version: pipelineVersion,
    started_at: started,
    completed_at: null,
    status: 'created',
    dry_run: true,
    network_enabled: false,
    source_type: sourceType,
    input_paths: [inputPath],
    article_ids: [],
    snapshots: [],
    artifacts: [],
    errors: [],
    warnings: [],
    environment_summary: {
      runtime: `node-${process.versions.node}`,
      network: false,
      external_services: false,
    },
  };
  const runDirectory = await secureRoot(path.join(root, 'runs'), { create: true, rejectPublicPath: true });
  const runPath = (await secureTarget(runDirectory, `${id}.json`, {
    create: true,
    rejectPublicPath: true,
  })).target;
  let manifest = freshManifest;
  let priorEvents = [];
  if (resumeRunId) {
    manifest = JSON.parse(await fs.readFile(runPath, 'utf8'));
    await assertSchema(manifest, 'run-manifest.schema.json');
    if (manifest.pipeline_version !== pipelineVersion || manifest.status !== 'snapshotted') {
      throw new SnapshotIntegrityError('RUN_NOT_RESUMABLE', 'El run no está en un estado reanudable o cambió de versión.');
    }
    manifest.completed_at = null;
    priorEvents = await audit.listByRun(id);
  } else {
    await audit.append(event(id, null, 'RUN_CREATED'));
  }

  const hasEvent = (articleId, type) => priorEvents.some(
    (item) => item.article_id === articleId && item.type === type
  );
  const addUnique = (collection, reference) => {
    const index = collection.findIndex((item) => item.artifact_id === reference.artifact_id);
    if (index >= 0) collection[index] = reference;
    else collection.push(reference);
  };

  try {
    for (const record of records) {
      const articleId = String(record?.article_id ?? record?.id ?? record?.slug ?? '');
      if (!articleId) throw new Error('Source identity missing');
      const hash = sourceHash(record);
      if (!manifest.article_ids.includes(articleId)) manifest.article_ids.push(articleId);
      const sourceArtifactId = contentId('source', `${articleId}\0${hash}\0${pipelineVersion}`);
      const sourceDescriptor = {
        artifact_id: sourceArtifactId,
        article_id: articleId,
        artifact_type: 'immutable-source',
        payload: record,
      };
      let sourceRef;
      if (await artifacts.exists(sourceArtifactId)) {
        if (!(await artifacts.verifyPayload(sourceArtifactId, record))) {
          throw new ArtifactWriteError('EXISTING_SOURCE_CORRUPT', 'La fuente inmutable existente no coincide.');
        }
        sourceRef = await artifacts.referenceFor({ ...sourceDescriptor, created_at: started });
      } else {
        sourceRef = await artifacts.writeAtomic({
          artifact_id: sourceArtifactId,
          article_id: articleId,
          artifact_type: 'immutable-source',
          payload: record,
        });
      }
      addUnique(manifest.artifacts, sourceRef);
      if (!hasEvent(articleId, 'SOURCE_LOADED')) {
        await audit.append(event(id, articleId, 'SOURCE_LOADED', { source_hash: hash }));
      }

      const canonical = normalizer(record);
      await assertSchema(canonical, 'canonical-article.schema.json');
      const blockers = canonical.source.normalization_issues.filter((item) => item.severity === 'BLOCKER');
      if (blockers.length) {
        throw new NormalizationError('NORMALIZATION_BLOCKED', 'La normalización produjo incidencias bloqueantes.', {
          context: { article_id: articleId, issue_codes: blockers.map((item) => item.code) },
        });
      }
      const snapshotId = contentId('snapshot', `${articleId}\0${hash}\0${pipelineVersion}`);
      const existing = await snapshots.findByArticleAndHash(articleId, hash, pipelineVersion);
      const snapshot = existing || {
        snapshot_id: snapshotId,
        article_id: articleId,
        source_table: canonical.identity.source_table,
        source_record_id: canonical.identity.source_record_id,
        source_hash: hash,
        source_schema_version: String(record.source_schema_version ?? 'legacy-local-1'),
        pipeline_version: pipelineVersion,
        created_at: new Date().toISOString(),
        original_record: structuredClone(record),
        canonical_article: canonical,
        artifact_paths: [],
      };
      const stored = await snapshots.create(snapshot);
      if (!(await snapshots.verify(stored.snapshot_id))) throw new Error('Snapshot verification failed');
      const snapshotRef = {
        artifact_id: stored.snapshot_id,
        article_id: articleId,
        artifact_type: 'snapshot',
        path: `snapshots/${stored.snapshot_id}.json`,
        sha256: await snapshots.artifactHash(stored.snapshot_id),
        created_at: stored.created_at,
      };
      addUnique(manifest.snapshots, snapshotRef);
      if (!hasEvent(articleId, 'SNAPSHOT_CREATED') && !hasEvent(articleId, 'SNAPSHOT_REUSED')) {
        await audit.append(event(id, articleId, existing ? 'SNAPSHOT_REUSED' : 'SNAPSHOT_CREATED', { source_hash: hash }));
      }
      if (!hasEvent(articleId, 'SNAPSHOT_VERIFIED')) {
        await audit.append(event(id, articleId, 'SNAPSHOT_VERIFIED'));
      }
      if (stopAfterSnapshot) {
        manifest.status = 'snapshotted';
        continue;
      }

      const canonicalId = contentId('canonical', `${articleId}\0${hash}\0${pipelineVersion}`);
      let canonicalRef;
      if (await artifacts.exists(canonicalId)) {
        if (!(await artifacts.verifyPayload(canonicalId, canonical))) {
          throw new ArtifactWriteError('EXISTING_CANONICAL_CORRUPT', 'El artefacto canónico existente no coincide.');
        }
        canonicalRef = await artifacts.referenceFor({
          artifact_id: canonicalId,
          article_id: articleId,
          artifact_type: 'canonical',
          created_at: stored.created_at,
        });
      } else {
        canonicalRef = await artifacts.writeAtomic({
            artifact_id: canonicalId,
            article_id: articleId,
            artifact_type: 'canonical',
            payload: canonical,
          });
      }
      addUnique(manifest.artifacts, canonicalRef);
      if (!hasEvent(articleId, 'NORMALIZATION_COMPLETED')) {
        await audit.append(event(id, articleId, 'NORMALIZATION_COMPLETED', {
          issue_codes: canonical.source.normalization_issues.map((item) => item.code),
        }));
      }

      const diff = createDiff({
        articleId,
        snapshotId,
        before: canonical,
        after: canonical,
        beforeHash: hash,
        afterHash: hash,
      });
      const diffId = contentId('diff', `${snapshotId}\0${stableStringify(diff)}`);
      let diffRef;
      if (await artifacts.exists(diffId)) {
        if (!(await artifacts.verifyPayload(diffId, diff))) {
          throw new ArtifactWriteError('EXISTING_DIFF_CORRUPT', 'El diff existente no coincide.');
        }
        diffRef = await artifacts.referenceFor({
          artifact_id: diffId,
          article_id: articleId,
          artifact_type: 'diff-json',
          created_at: stored.created_at,
        });
      } else {
        diffRef = await artifacts.writeAtomic({ artifact_id: diffId, article_id: articleId, artifact_type: 'diff-json', payload: diff });
      }
      addUnique(manifest.artifacts, diffRef);
      const diffDirectory = await secureRoot(path.join(root, 'diffs'), { create: true, rejectPublicPath: true });
      const markdownPath = (await secureTarget(diffDirectory, `${diffId}.md`, {
        create: true,
        rejectPublicPath: true,
      })).target;
      const markdown = diffToMarkdown(diff);
      try {
        await atomicCreate(markdownPath, markdown);
      } catch (error) {
        if (error.code !== 'EEXIST') throw error;
        if (await fs.readFile(markdownPath, 'utf8') !== markdown) {
          throw new ArtifactWriteError('EXISTING_DIFF_MARKDOWN_CORRUPT', 'El diff Markdown existente no coincide.');
        }
      }
      if (!hasEvent(articleId, 'DIFF_GENERATED')) {
        await audit.append(event(id, articleId, 'DIFF_GENERATED', { blockers: diff.blockers }));
      }

      const restore = await restoreSnapshot(stored, path.join(root, 'restores')).catch(async (error) => {
        if (error.code !== 'RESTORE_WRITE_FAILED') throw error;
        const restorePath = path.join(root, 'restores', `${stored.snapshot_id}.restored.json`);
        const restored = JSON.parse(await fs.readFile(restorePath, 'utf8'));
        if (sourceHash(restored) !== stored.source_hash) throw error;
        return { path: restorePath, source_hash: stored.source_hash, verified: true };
      });
      if (!hasEvent(articleId, 'RESTORE_VERIFIED')) {
        await audit.append(event(id, articleId, 'RESTORE_VERIFIED', { source_hash: restore.source_hash }));
      }
    }
    manifest.status = stopAfterSnapshot ? 'snapshotted' : 'completed';
    manifest.completed_at = new Date().toISOString();
    if (!stopAfterSnapshot && !priorEvents.some((item) => item.type === 'RUN_COMPLETED')) {
      await audit.append(event(id, null, 'RUN_COMPLETED'));
    }
  } catch (error) {
    manifest.status = 'blocked';
    manifest.completed_at = new Date().toISOString();
    manifest.errors.push({ code: error.code || 'UNEXPECTED_ERROR', message: error.message });
    await audit.append(event(id, null, 'RUN_BLOCKED', { code: error.code || 'UNEXPECTED_ERROR' }));
  }
  await assertSchema(manifest, 'run-manifest.schema.json');
  const serializedManifest = `${stableStringify(manifest, 2)}\n`;
  if (resumeRunId) await atomicReplace(runPath, serializedManifest);
  else await atomicCreate(runPath, serializedManifest);
  return manifest;
}
