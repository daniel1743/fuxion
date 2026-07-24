import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import tls from 'node:tls';
import dns from 'node:dns';
import dgram from 'node:dgram';
import childProcess from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { LocalJsonArticleSource } from '../../src/modules/editor-ia/slice1/local-source.js';
import { processLocalRecords } from '../../src/modules/editor-ia/slice1/pipeline.js';

const fixturesRoot = fileURLToPath(new URL('../../src/modules/editor-ia/tests/fixtures/', import.meta.url));
const fixtureNames = [
  'articulo-markdown-valido.json',
  'articulo-html-valido.json',
  'wellness-article-realista.json',
  'blog-post-realista.json',
  'markdown-roto.json',
  'faq-schema-inconsistente.json',
  'campos-desconocidos.json',
  'contenido-adversarial.json',
];

async function temp() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'editorial-slice1-integration-'));
}

async function loadFixtures() {
  return Promise.all(fixtureNames.map(async (name) => JSON.parse(await fs.readFile(path.join(fixturesRoot, name), 'utf8'))));
}

test('flujo completo procesa fixtures seguros y bloquea el octavo inconsistente sin red', async () => {
  const originalFetch = globalThis.fetch;
  const originalHttpRequest = http.request;
  const originalHttpsRequest = https.request;
  const guarded = [
    [http, 'get'], [https, 'get'], [net, 'connect'], [net, 'createConnection'],
    [tls, 'connect'], [dns, 'lookup'], [dns, 'resolve'], [dgram, 'createSocket'],
    [childProcess, 'exec'], [childProcess, 'execFile'], [childProcess, 'spawn'], [childProcess, 'fork'],
  ];
  const originals = guarded.map(([owner, key]) => [owner, key, owner[key]]);
  let networkCalls = 0;
  const blocked = () => {
    networkCalls += 1;
    throw new Error('NETWORK_FORBIDDEN');
  };
  globalThis.fetch = blocked;
  http.request = blocked;
  https.request = blocked;
  for (const [owner, key] of guarded) owner[key] = blocked;

  try {
    const root = await temp();
    const allRecords = await loadFixtures();
    const records = allRecords.filter((record) => record.article_id !== 'fixture-faq-mismatch');
    const manifest = await processLocalRecords({
      records,
      inputPath: path.join(fixturesRoot, 'synthetic-collection'),
      outputDir: root,
      sourceType: 'fixture',
      pipelineVersion: 'slice1-integration',
    });
    assert.equal(manifest.status, 'completed');
    assert.equal(manifest.article_ids.length, 7);
    assert.equal(manifest.snapshots.length, 7);
    assert.equal(networkCalls, 0);
    const restores = await fs.readdir(path.join(root, 'restores'));
    assert.equal(restores.length, 7);
    for (const record of allRecords) {
      const current = JSON.parse(JSON.stringify(record));
      assert.deepEqual(current, record);
    }

    const blocked = await processLocalRecords({
      records: allRecords.filter((record) => record.article_id === 'fixture-faq-mismatch'),
      inputPath: path.join(fixturesRoot, 'faq-schema-inconsistente.json'),
      outputDir: path.join(root, 'blocked-case'),
      sourceType: 'fixture',
    });
    assert.equal(blocked.status, 'blocked');
    assert.equal(networkCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
    http.request = originalHttpRequest;
    https.request = originalHttpsRequest;
    for (const [owner, key, original] of originals) owner[key] = original;
  }
});

test('reejecución reutiliza snapshots y no duplica artefactos completados', async () => {
  const root = await temp();
  const records = (await loadFixtures()).slice(0, 2);
  const first = await processLocalRecords({ records, inputPath: 'fixture', outputDir: root, pipelineVersion: 'idempotent-v1' });
  const snapshotFilesBefore = await fs.readdir(path.join(root, 'snapshots'));
  const second = await processLocalRecords({ records, inputPath: 'fixture', outputDir: root, pipelineVersion: 'idempotent-v1' });
  const snapshotFilesAfter = await fs.readdir(path.join(root, 'snapshots'));
  assert.equal(first.status, 'completed');
  assert.equal(second.status, 'completed');
  assert.deepEqual(snapshotFilesAfter, snapshotFilesBefore);
});

test('interrupción después del snapshot permite reanudar', async () => {
  const root = await temp();
  const records = (await loadFixtures()).slice(0, 1);
  const interrupted = await processLocalRecords({
    records,
    inputPath: 'fixture',
    outputDir: root,
    pipelineVersion: 'resume-v1',
    stopAfterSnapshot: true,
  });
  assert.equal(interrupted.status, 'snapshotted');
  const resumed = await processLocalRecords({
    records,
    inputPath: 'fixture',
    outputDir: root,
    pipelineVersion: 'resume-v1',
  });
  assert.equal(resumed.status, 'completed');
});

test('error de normalización conserva snapshot y run no termina completed', async () => {
  const root = await temp();
  const record = {
    source_table: 'local_export',
    source_schema_version: 'fixture-1',
    article_id: 'bad-schema',
    slug: 'bad-schema',
    status: 'draft',
    title: 'No serializable',
    content: 'texto',
  };
  const manifest = await processLocalRecords({
    records: [record],
    inputPath: 'fixture',
    outputDir: root,
    normalizer() {
      throw new Error('NORMALIZATION_TEST_FAILURE');
    },
  });
  assert.equal(manifest.status, 'blocked');
  assert.notEqual(manifest.status, 'completed');
  const preserved = await fs.readdir(path.join(root, 'artifacts'));
  assert.equal(preserved.length, 1);
  assert.match(preserved[0], /^source-/);
});

test('fuente local rechaza URL, rutas externas y no modifica fixture', async () => {
  const source = new LocalJsonArticleSource({ allowedRoots: [fixturesRoot] });
  await assert.rejects(source.readFromFile('https://example.com/article.json'), /locales/i);
  await assert.rejects(source.readFromFile(path.join(fixturesRoot, '..', '..', '..', 'package.json')), /fuera/i);
  const target = path.join(fixturesRoot, fixtureNames[0]);
  const before = await fs.readFile(target, 'utf8');
  await source.readFromFile(target);
  assert.ok((await source.listAvailable()).includes('fixture-markdown'));
  assert.equal((await source.readByIds(['fixture-markdown'])).length, 1);
  assert.equal((await source.readBySlugs(['habito-sintetico-markdown'])).length, 1);
  const after = await fs.readFile(target, 'utf8');
  assert.equal(after, before);
});

test('fuente local acepta colección articles y rechaza JSON inválido', async () => {
  const root = await temp();
  const source = new LocalJsonArticleSource({ allowedRoots: [root] });
  const collection = path.join(root, 'collection.json');
  await fs.writeFile(collection, JSON.stringify({ articles: (await loadFixtures()).slice(0, 2) }));
  assert.equal((await source.readFromFile(collection)).length, 2);
  const invalid = path.join(root, 'invalid.json');
  await fs.writeFile(invalid, '{');
  await assert.rejects(source.readFromFile(invalid), /JSON local/i);
  assert.throws(() => new LocalJsonArticleSource({ allowedRoots: [] }), /directorio/i);
});

test('núcleo Slice 1 no importa Supabase, proveedores ni WordPress', async () => {
  const sourceFiles = (await fs.readdir(fileURLToPath(new URL('../../src/modules/editor-ia/slice1/', import.meta.url))))
    .filter((name) => name.endsWith('.js'));
  for (const name of sourceFiles) {
    const content = await fs.readFile(fileURLToPath(new URL(`../../src/modules/editor-ia/slice1/${name}`, import.meta.url)), 'utf8');
    assert.doesNotMatch(content, /@supabase\/supabase-js|oneprovider|anthropic|deepseek|gemini|qwen|wp-json|wordpress|node:(?:http|https|net|tls|dns|dgram|child_process)/i, name);
    assert.doesNotMatch(content, /dotenv|process\.env/i, name);
  }
});
