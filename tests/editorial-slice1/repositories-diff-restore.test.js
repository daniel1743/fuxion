import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { LocalArtifactRepository, LocalSnapshotRepository, snapshotDigest } from '../../src/modules/editor-ia/slice1/repositories.js';
import { normalizeArticle } from '../../src/modules/editor-ia/slice1/normalizer.js';
import { contentId, sourceHash } from '../../src/modules/editor-ia/slice1/stable-json.js';
import { createDiff, diffToMarkdown } from '../../src/modules/editor-ia/slice1/diff.js';
import { restoreSnapshot } from '../../src/modules/editor-ia/slice1/restore.js';

async function temp() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'editorial-slice1-'));
}

function record() {
  return {
    source_table: 'local_export',
    source_schema_version: 'test-1',
    article_id: 'article-1',
    slug: 'slug-original',
    status: 'draft',
    title: 'Título',
    content: '# Título\n\nOriginal',
  };
}

function snapshotFor(value, pipelineVersion = 'slice1-test') {
  const hash = sourceHash(value);
  const id = contentId('snapshot', `${value.article_id}\0${hash}\0${pipelineVersion}`);
  const snapshot = {
    snapshot_id: id,
    article_id: value.article_id,
    source_table: value.source_table,
    source_record_id: value.article_id,
    source_hash: hash,
    source_schema_version: value.source_schema_version,
    pipeline_version: pipelineVersion,
    created_at: '2026-07-23T00:00:00.000Z',
    original_record: structuredClone(value),
    canonical_article: normalizeArticle(value),
    artifact_paths: [],
  };
  snapshot.snapshot_hash = snapshotDigest(snapshot);
  return snapshot;
}

test('artifact repository escribe atómicamente y no sobrescribe', async () => {
  const root = await temp();
  const repository = new LocalArtifactRepository(root);
  const artifact = { artifact_id: 'artifact-1', article_id: 'article-1', artifact_type: 'test', payload: { ok: true } };
  const reference = await repository.writeAtomic(artifact);
  assert.equal(await repository.verifyHash('artifact-1', reference.sha256), true);
  await assert.rejects(repository.writeAtomic(artifact), /sobrescribir/i);
});

test('snapshot se verifica y la misma identidad es idempotente', async () => {
  const root = await temp();
  const repository = new LocalSnapshotRepository(root);
  const snapshot = snapshotFor(record());
  const first = await repository.create(snapshot);
  const second = await repository.create(snapshot);
  assert.equal(first.snapshot_id, second.snapshot_id);
  assert.equal(await repository.verify(snapshot.snapshot_id), true);
  assert.deepEqual(await repository.get(snapshot.snapshot_id), snapshot);
});

test('snapshot corrupto y manipulado bloquean verificación/restauración', async () => {
  const root = await temp();
  const repository = new LocalSnapshotRepository(path.join(root, 'snapshots'));
  const snapshot = snapshotFor(record());
  await repository.create(snapshot);
  const target = path.join(root, 'snapshots', `${snapshot.snapshot_id}.json`);
  const corrupted = JSON.parse(await fs.readFile(target, 'utf8'));
  corrupted.original_record.content += ' alterado';
  await fs.writeFile(target, JSON.stringify(corrupted));
  assert.equal(await repository.verify(snapshot.snapshot_id), false);
  await assert.rejects(restoreSnapshot(corrupted, path.join(root, 'restore')), /modificado/i);
});

test('restauración conserva el hash exacto y no sobrescribe', async () => {
  const root = await temp();
  const snapshot = snapshotFor(record());
  const restored = await restoreSnapshot(snapshot, root);
  assert.equal(restored.source_hash, snapshot.source_hash);
  assert.equal(restored.verified, true);
  await assert.rejects(restoreSnapshot(snapshot, root), /sobrescribir/i);
});

test('diff no reporta cambios inexistentes', () => {
  const canonical = normalizeArticle(record());
  const diff = createDiff({ articleId: 'article-1', snapshotId: 'snapshot-1', before: canonical, after: structuredClone(canonical) });
  assert.equal(diff.changed, false);
  assert.deepEqual(diff.structural, []);
  assert.deepEqual(diff.textual, []);
});

test('diff detecta campos, slug y estado como blockers y genera Markdown coherente', () => {
  const before = normalizeArticle(record());
  const after = structuredClone(before);
  after.identity.slug = 'slug-nuevo';
  after.identity.status = 'published';
  after.editorial.body += '\nNueva línea';
  const diff = createDiff({ articleId: 'article-1', snapshotId: 'snapshot-1', before, after });
  assert.ok(diff.blockers.includes('SLUG_CHANGED'));
  assert.ok(diff.blockers.includes('PUBLICATION_STATUS_CHANGED'));
  assert.ok(diff.textual.length > 0);
  const markdown = diffToMarkdown(diff);
  assert.match(markdown, /SLUG_CHANGED/);
  assert.match(markdown, /PUBLICATION_STATUS_CHANGED/);
});

test('repositorio rechaza escritura dentro de public', async () => {
  const repository = new LocalArtifactRepository(path.join(process.cwd(), 'public', 'unsafe'));
  await assert.rejects(
    repository.writeAtomic({ artifact_id: 'unsafe', article_id: 'a', artifact_type: 'test', payload: {} }),
    /public/i
  );
});
