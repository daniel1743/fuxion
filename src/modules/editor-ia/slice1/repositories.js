import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { ArtifactWriteError, SnapshotIntegrityError, SnapshotWriteError, UnsafePathError } from './errors.js';
import { contentId, sha256, sourceHash, stableStringify } from './stable-json.js';
import { assertSchema } from './schemas.js';
import { assertSafeId, secureRoot, secureTarget } from './safe-path.js';

export function snapshotDigest(snapshot) {
  const { snapshot_hash: _ignored, ...content } = snapshot;
  return sha256(stableStringify(content));
}

export async function atomicCreate(target, content) {
  await fs.mkdir(path.dirname(target), { recursive: true });
  const temporary = path.join(path.dirname(target), `.${path.basename(target)}.${randomUUID()}.tmp`);
  let handle;
  try {
    handle = await fs.open(temporary, 'wx');
    await handle.writeFile(content, 'utf8');
    await handle.sync();
    await handle.close();
    handle = null;
    await fs.link(temporary, target);
  } finally {
    await handle?.close().catch(() => {});
    await fs.rm(temporary, { force: true });
  }
}

export async function atomicReplace(target, content) {
  await fs.mkdir(path.dirname(target), { recursive: true });
  const temporary = path.join(path.dirname(target), `.${path.basename(target)}.${randomUUID()}.tmp`);
  let handle;
  try {
    handle = await fs.open(temporary, 'wx');
    await handle.writeFile(content, 'utf8');
    await handle.sync();
    await handle.close();
    handle = null;
    await fs.rename(temporary, target);
  } finally {
    await handle?.close().catch(() => {});
    await fs.rm(temporary, { force: true });
  }
}

export class LocalArtifactRepository {
  constructor(root) {
    this.root = path.resolve(root);
  }

  async pathFor(artifactId) {
    assertSafeId(artifactId, 'artifact_id');
    return (await secureTarget(this.root, `${artifactId}.json`, {
      create: true,
      rejectPublicPath: true,
    })).target;
  }

  async writeAtomic({ artifact_id, article_id, artifact_type, payload, created_at = new Date().toISOString() }) {
    const serialized = `${stableStringify(payload, 2)}\n`;
    const target = await this.pathFor(artifact_id);
    try {
      await atomicCreate(target, serialized);
    } catch (cause) {
      throw new ArtifactWriteError('ARTIFACT_WRITE_FAILED', 'No se pudo crear el artefacto sin sobrescribir.', { cause });
    }
    return {
      artifact_id,
      article_id,
      artifact_type,
      path: path.relative(this.root, target).replaceAll('\\', '/'),
      sha256: sha256(serialized),
      created_at,
    };
  }

  async read(artifactId) {
    return JSON.parse(await fs.readFile(await this.pathFor(artifactId), 'utf8'));
  }

  async exists(artifactId) {
    try {
      await fs.access(await this.pathFor(artifactId));
      return true;
    } catch {
      return false;
    }
  }

  async verifyHash(artifactId, expectedHash) {
    const content = await fs.readFile(await this.pathFor(artifactId), 'utf8');
    return expectedHash ? sha256(content) === expectedHash : true;
  }

  async hash(artifactId) {
    return sha256(await fs.readFile(await this.pathFor(artifactId), 'utf8'));
  }

  async referenceFor({ artifact_id, article_id, artifact_type, created_at }) {
    return {
      artifact_id,
      article_id,
      artifact_type,
      path: `${artifact_id}.json`,
      sha256: await this.hash(artifact_id),
      created_at,
    };
  }

  async verifyPayload(artifactId, payload) {
    const expected = `${stableStringify(payload, 2)}\n`;
    const actual = await fs.readFile(await this.pathFor(artifactId), 'utf8');
    return actual === expected;
  }
}

export class LocalSnapshotRepository {
  constructor(root) {
    this.artifacts = new LocalArtifactRepository(root);
  }

  async create(snapshot) {
    snapshot.snapshot_hash = snapshotDigest(snapshot);
    await assertSchema(snapshot, 'article-snapshot.schema.json');
    const existing = await this.findByArticleAndHash(
      snapshot.article_id,
      snapshot.source_hash,
      snapshot.pipeline_version
    );
    if (existing) {
      if (!(await this.verify(existing.snapshot_id))) {
        throw new SnapshotIntegrityError('EXISTING_SNAPSHOT_CORRUPT', 'El snapshot existente no es íntegro.');
      }
      return existing;
    }

    try {
      await this.artifacts.writeAtomic({
        artifact_id: snapshot.snapshot_id,
        article_id: snapshot.article_id,
        artifact_type: 'snapshot',
        payload: snapshot,
        created_at: snapshot.created_at,
      });
    } catch (cause) {
      throw new SnapshotWriteError('SNAPSHOT_WRITE_FAILED', 'No se pudo crear el snapshot.', { cause });
    }
    if (!(await this.verify(snapshot.snapshot_id))) {
      throw new SnapshotIntegrityError('SNAPSHOT_VERIFY_FAILED', 'El snapshot no conserva el hash fuente.');
    }
    return snapshot;
  }

  async get(snapshotId) {
    const snapshot = await this.artifacts.read(snapshotId);
    await assertSchema(snapshot, 'article-snapshot.schema.json');
    return snapshot;
  }

  async findByArticleAndHash(articleId, hash, pipelineVersion) {
    const snapshotId = contentId('snapshot', `${articleId}\0${hash}\0${pipelineVersion}`);
    return (await this.artifacts.exists(snapshotId)) ? this.get(snapshotId) : null;
  }

  async verify(snapshotId) {
    try {
      const snapshot = await this.get(snapshotId);
      return sourceHash(snapshot.original_record) === snapshot.source_hash
        && snapshotDigest(snapshot) === snapshot.snapshot_hash;
    } catch {
      return false;
    }
  }

  async artifactHash(snapshotId) {
    return this.artifacts.hash(snapshotId);
  }
}

const auditWriteQueues = new Map();

export class LocalAppendOnlyAuditRepository {
  constructor(root) {
    this.root = path.resolve(root);
  }

  async append(event) {
    const runId = String(event.run_id || '');
    assertSafeId(runId, 'run_id');
    const queueKey = `${this.root}\0${runId}`;
    const operation = (auditWriteQueues.get(queueKey) || Promise.resolve()).then(async () => {
      const { target } = await secureTarget(this.root, `${runId}.jsonl`, {
        create: true,
        rejectPublicPath: true,
      });
      await fs.appendFile(target, `${stableStringify(event)}\n`, { encoding: 'utf8' });
    });
    const queued = operation.catch(() => {});
    auditWriteQueues.set(queueKey, queued);
    await operation;
    if (auditWriteQueues.get(queueKey) === queued) auditWriteQueues.delete(queueKey);
  }

  async listByRun(runId) {
    assertSafeId(runId, 'run_id');
    try {
      const { target } = await secureTarget(this.root, `${runId}.jsonl`, {
        create: true,
        rejectPublicPath: true,
      });
      const text = await fs.readFile(target, 'utf8');
      return text.trim().split('\n').filter(Boolean).map(JSON.parse);
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  async listByArticle(articleId) {
    const realRoot = await secureRoot(this.root, { create: true, rejectPublicPath: true });
    const files = await fs.readdir(realRoot).catch(() => []);
    const events = [];
    for (const file of files.filter((name) => name.endsWith('.jsonl'))) {
      const text = await fs.readFile(path.join(realRoot, file), 'utf8');
      events.push(...text.trim().split('\n').filter(Boolean).map(JSON.parse));
    }
    return events.filter((event) => event.article_id === articleId);
  }
}
