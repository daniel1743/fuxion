import fs from 'node:fs/promises';
import path from 'node:path';
import { RestoreIntegrityError, SnapshotIntegrityError, UnsafePathError } from './errors.js';
import { sourceHash, stableStringify } from './stable-json.js';
import { assertSafeId, secureTarget } from './safe-path.js';
import { atomicCreate, snapshotDigest } from './repositories.js';
import { assertSchema } from './schemas.js';

export async function restoreSnapshot(snapshot, outputRoot) {
  assertSafeId(snapshot?.snapshot_id, 'snapshot_id');
  await assertSchema(snapshot, 'article-snapshot.schema.json');
  if (sourceHash(snapshot.original_record) !== snapshot.source_hash) {
    throw new SnapshotIntegrityError('SNAPSHOT_TAMPERED', 'El snapshot fue modificado.');
  }
  if (snapshotDigest(snapshot) !== snapshot.snapshot_hash) {
    throw new SnapshotIntegrityError('SNAPSHOT_TAMPERED', 'La integridad completa del snapshot no coincide.');
  }
  const { target } = await secureTarget(
    outputRoot,
    `${snapshot.snapshot_id}.restored.json`,
    { create: true, rejectPublicPath: true }
  );
  try {
    await atomicCreate(target, `${stableStringify(snapshot.original_record, 2)}\n`);
  } catch (cause) {
    throw new RestoreIntegrityError('RESTORE_WRITE_FAILED', 'No se pudo crear la restauración sin sobrescribir.', { cause });
  }
  const restored = JSON.parse(await fs.readFile(target, 'utf8'));
  const restoredHash = sourceHash(restored);
  if (restoredHash !== snapshot.source_hash) {
    throw new RestoreIntegrityError('RESTORE_HASH_MISMATCH', 'La restauración no coincide exactamente con el original.');
  }
  return { path: target, source_hash: restoredHash, verified: true };
}
