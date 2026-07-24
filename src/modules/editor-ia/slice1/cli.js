#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { LocalJsonArticleSource } from './local-source.js';
import { LocalSnapshotRepository } from './repositories.js';
import { processLocalRecords } from './pipeline.js';
import { restoreSnapshot } from './restore.js';

function argsToObject(argv) {
  const result = { command: argv[0] || 'process' };
  for (let index = 1; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith('--')) throw new Error(`Argumento no permitido: ${item}`);
    const key = item.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) result[key] = true;
    else {
      result[key] = value;
      index += 1;
    }
  }
  return result;
}

function printSafety() {
  console.log('dry_run=true network=false external_services=false');
}

async function main() {
  const args = argsToObject(process.argv.slice(2));
  printSafety();
  const cwd = process.cwd();
  const outputDir = path.resolve(args['output-dir'] || path.join(cwd, '.editorial-pipeline'));

  if (args.command === 'process') {
    if (!args.input) throw new Error('Falta --input <ruta local>.');
    const input = path.resolve(args.input);
    const source = new LocalJsonArticleSource({ allowedRoots: [path.dirname(input)] });
    let records = await source.readFromFile(input);
    if (args['article-id']) records = records.filter((record) => String(record.article_id ?? record.id) === args['article-id']);
    if (args.slug) records = records.filter((record) => record.slug === args.slug);
    const manifest = await processLocalRecords({
      records,
      inputPath: input,
      outputDir,
      pipelineVersion: args['pipeline-version'] || undefined,
      resumeRunId: args.run || null,
    });
    console.log(JSON.stringify({ run_id: manifest.run_id, status: manifest.status, articles: manifest.article_ids.length }));
    if (manifest.status === 'blocked') process.exitCode = 1;
    return;
  }

  if (args.command === 'verify') {
    if (!args.run) throw new Error('Falta --run <run_id>.');
    const manifestPath = path.join(outputDir, 'runs', `${args.run}.json`);
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    const repository = new LocalSnapshotRepository(path.join(outputDir, 'snapshots'));
    const checks = await Promise.all(manifest.snapshots.map((item) => repository.verify(item.artifact_id)));
    console.log(JSON.stringify({ run_id: args.run, verified: checks.every(Boolean), snapshots: checks.length }));
    if (!checks.every(Boolean)) process.exitCode = 1;
    return;
  }

  if (args.command === 'restore') {
    if (!args.snapshot) throw new Error('Falta --snapshot <snapshot_id>.');
    const repository = new LocalSnapshotRepository(path.join(outputDir, 'snapshots'));
    const snapshot = await repository.get(args.snapshot);
    const restored = await restoreSnapshot(snapshot, path.join(outputDir, 'restores-manual'));
    console.log(JSON.stringify({ snapshot_id: args.snapshot, verified: restored.verified }));
    return;
  }

  throw new Error('Comando permitido: process, verify o restore.');
}

main().catch((error) => {
  console.error(`Slice 1 bloqueado: ${error.code || 'ERROR'}`);
  process.exitCode = 1;
});
