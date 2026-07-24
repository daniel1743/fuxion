import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { sourceHash } from '../../src/modules/editor-ia/slice1/stable-json.js';
import { structuralDiff } from '../../src/modules/editor-ia/slice1/diff.js';
import { processLocalRecords } from '../../src/modules/editor-ia/slice1/pipeline.js';
import {
  LocalAppendOnlyAuditRepository,
  LocalArtifactRepository,
  LocalSnapshotRepository,
  snapshotDigest,
} from '../../src/modules/editor-ia/slice1/repositories.js';
import { restoreSnapshot } from '../../src/modules/editor-ia/slice1/restore.js';
import { normalizeArticle } from '../../src/modules/editor-ia/slice1/normalizer.js';
import { contentId } from '../../src/modules/editor-ia/slice1/stable-json.js';
import { assertSchema } from '../../src/modules/editor-ia/slice1/schemas.js';

const base = {
  source_table: 'local_export',
  source_schema_version: 'test-1',
  article_id: 'audit-record',
  slug: 'audit-record',
  status: 'draft',
  title: 'Fixture',
  content: '# Fixture\n\nContenido.',
};

async function temporary() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'slice11-regression-'));
}

function snapshotFor(record, version = 'audit-v1') {
  const hash = sourceHash(record);
  const snapshot = {
    snapshot_id: contentId('snapshot', `${record.article_id}\0${hash}\0${version}`),
    article_id: record.article_id,
    source_table: record.source_table,
    source_record_id: record.article_id,
    source_hash: hash,
    source_schema_version: record.source_schema_version,
    pipeline_version: version,
    created_at: '2026-07-23T00:00:00.000Z',
    original_record: structuredClone(record),
    canonical_article: normalizeArticle(record),
    artifact_paths: [],
  };
  snapshot.snapshot_hash = snapshotDigest(snapshot);
  return snapshot;
}

test('S1-005 rechaza valores que JSON omitiría o confundiría', () => {
  assert.throws(() => sourceHash({ ...base, hidden: undefined }), /JSON|admitido/i);
  assert.throws(() => sourceHash({ ...base, number: Number.NaN }), /JSON|admitido/i);
  assert.throws(() => sourceHash({ ...base, number: Infinity }), /JSON|admitido/i);
  assert.throws(() => sourceHash({ ...base, value: 1n }), /JSON|admitido/i);
  assert.notEqual(sourceHash({ ...base, value: 0 }), sourceHash({ ...base, value: false }));
  assert.notEqual(sourceHash({ ...base, value: null }), sourceHash({ ...base, value: '' }));
});

test('S1-006 diff representa objetos y arrays vacíos', () => {
  assert.ok(structuralDiff({}, { added: {} }).some((item) => item.field === '$.added'));
  assert.ok(structuralDiff({}, { added: [] }).some((item) => item.field === '$.added'));
  assert.ok(structuralDiff({ removed: {} }, {}).some((item) => item.field === '$.removed'));
});

test('S1-003 una incidencia BLOCKER impide completed', async () => {
  const root = await temporary();
  const manifest = await processLocalRecords({
    records: [{
      ...base,
      faq: [{ question: 'Visible', answer: 'A' }],
      faq_schema: [{ question: 'Distinta', answer: 'B' }],
    }],
    inputPath: 'fixture',
    outputDir: root,
  });
  assert.equal(manifest.status, 'blocked');
  assert.ok(manifest.errors.some((item) => item.code === 'NORMALIZATION_BLOCKED'));
});

test('S1-004 manipular canonical o metadata invalida snapshot', async () => {
  const root = await temporary();
  const repository = new LocalSnapshotRepository(root);
  const snapshot = snapshotFor(base);
  await repository.create(snapshot);
  const target = path.join(root, `${snapshot.snapshot_id}.json`);
  const value = JSON.parse(await fs.readFile(target, 'utf8'));
  value.canonical_article.editorial.title = 'Manipulado';
  await fs.writeFile(target, JSON.stringify(value));
  assert.equal(await repository.verify(snapshot.snapshot_id), false);
});

test('S1-008 snapshot schema rechaza canonical vacío', async () => {
  const snapshot = snapshotFor(base);
  snapshot.canonical_article = {};
  snapshot.snapshot_hash = snapshotDigest(snapshot);
  await assert.rejects(assertSchema(snapshot, 'article-snapshot.schema.json'));
});

test('S1-001 restore rechaza IDs con traversal', async () => {
  const root = await temporary();
  const snapshot = { ...snapshotFor(base), snapshot_id: '../escaped' };
  await assert.rejects(restoreSnapshot(snapshot, path.join(root, 'restores')), /ruta|identificador|segur/i);
  await assert.rejects(restoreSnapshot({ ...snapshot, snapshot_id: 'C:\\escape' }, path.join(root, 'restores')), /ruta|identificador|segur/i);
});

test('S1-002 repositorio rechaza raíz que es symlink', async (t) => {
  const root = await temporary();
  const target = path.join(root, 'outside');
  const link = path.join(root, 'innocent');
  await fs.mkdir(target);
  try {
    await fs.symlink(target, link, process.platform === 'win32' ? 'junction' : 'dir');
  } catch (error) {
    if (['EPERM', 'EACCES'].includes(error.code)) return t.skip('El entorno no permite symlinks.');
    throw error;
  }
  const repository = new LocalArtifactRepository(link);
  await assert.rejects(
    repository.writeAtomic({ artifact_id: 'probe', article_id: 'a', artifact_type: 'test', payload: {} }),
    /symlink|junction|segur|raíz/i
  );
});

test('S1-002 fuente local rechaza allowedRoot enlazado', async (t) => {
  const root = await temporary();
  const target = path.join(root, 'real-source');
  const link = path.join(root, 'source-link');
  await fs.mkdir(target);
  await fs.writeFile(path.join(target, 'record.json'), JSON.stringify(base));
  try {
    await fs.symlink(target, link, process.platform === 'win32' ? 'junction' : 'dir');
  } catch (error) {
    if (['EPERM', 'EACCES'].includes(error.code)) return t.skip('El entorno no permite symlinks.');
    throw error;
  }
  const { LocalJsonArticleSource } = await import('../../src/modules/editor-ia/slice1/local-source.js');
  const source = new LocalJsonArticleSource({ allowedRoots: [link] });
  await assert.rejects(source.readFromFile(path.join(link, 'record.json')), /symlink|junction|raíz/i);
});

test('S1-009 artefacto canónico corrupto bloquea reejecución', async () => {
  const root = await temporary();
  const first = await processLocalRecords({ records: [base], inputPath: 'fixture', outputDir: root, pipelineVersion: 'reuse-v1' });
  assert.equal(first.status, 'completed');
  const canonical = first.artifacts.find((item) => item.artifact_type === 'canonical');
  await fs.writeFile(path.join(root, 'artifacts', `${canonical.artifact_id}.json`), '{"corrupt":true}\n');
  const second = await processLocalRecords({ records: [base], inputPath: 'fixture', outputDir: root, pipelineVersion: 'reuse-v1' });
  assert.equal(second.status, 'blocked');
});

test('S1-009 fuente inmutable corrupta bloquea reejecución', async () => {
  const root = await temporary();
  const first = await processLocalRecords({ records: [base], inputPath: 'fixture', outputDir: root, pipelineVersion: 'source-reuse-v1' });
  const source = first.artifacts.find((item) => item.artifact_type === 'immutable-source');
  await fs.writeFile(path.join(root, 'artifacts', `${source.artifact_id}.json`), '{"corrupt":true}\n');
  const second = await processLocalRecords({ records: [base], inputPath: 'fixture', outputDir: root, pipelineVersion: 'source-reuse-v1' });
  assert.equal(second.status, 'blocked');
  assert.ok(second.errors.some((item) => item.code === 'EXISTING_SOURCE_CORRUPT'));
});

test('hash o versión nuevos conservan snapshots anteriores', async () => {
  const root = await temporary();
  const first = await processLocalRecords({ records: [base], inputPath: 'fixture', outputDir: root, pipelineVersion: 'version-1' });
  const changed = { ...base, content: `${base.content}\nCambio` };
  const second = await processLocalRecords({ records: [changed], inputPath: 'fixture', outputDir: root, pipelineVersion: 'version-1' });
  const third = await processLocalRecords({ records: [base], inputPath: 'fixture', outputDir: root, pipelineVersion: 'version-2' });
  assert.equal(first.status, 'completed');
  assert.equal(second.status, 'completed');
  assert.equal(third.status, 'completed');
  assert.equal((await fs.readdir(path.join(root, 'snapshots'))).length, 3);
});

test('S1-007 reanudación conserva run_id y no duplica RUN_CREATED', async () => {
  const root = await temporary();
  const interrupted = await processLocalRecords({
    records: [base],
    inputPath: 'fixture',
    outputDir: root,
    pipelineVersion: 'resume-real-v1',
    stopAfterSnapshot: true,
  });
  const resumed = await processLocalRecords({
    records: [base],
    inputPath: 'fixture',
    outputDir: root,
    pipelineVersion: 'resume-real-v1',
    resumeRunId: interrupted.run_id,
  });
  assert.equal(resumed.run_id, interrupted.run_id);
  assert.equal(resumed.status, 'completed');
  const events = (await fs.readFile(path.join(root, 'events', `${resumed.run_id}.jsonl`), 'utf8'))
    .trim().split('\n').map(JSON.parse);
  assert.equal(events.filter((item) => item.type === 'RUN_CREATED').length, 1);
});

test('S1-008 escrituras concurrentes desde dos repositorios no pierden eventos', async () => {
  const root = await temporary();
  const eventsRoot = path.join(root, 'events');
  const first = new LocalAppendOnlyAuditRepository(eventsRoot);
  const second = new LocalAppendOnlyAuditRepository(eventsRoot);
  const runId = 'run_concurrent_1';
  await Promise.all(Array.from({ length: 40 }, (_, index) => {
    const repository = index % 2 === 0 ? first : second;
    return repository.append({
      event_id: `event_${index}`,
      run_id: runId,
      article_id: 'audit-record',
      type: 'TEST_EVENT',
      sequence: index,
    });
  }));
  const events = await first.listByRun(runId);
  assert.equal(events.length, 40);
  assert.equal(new Set(events.map((event) => event.event_id)).size, 40);
});
