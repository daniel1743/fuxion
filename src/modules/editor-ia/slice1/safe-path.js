import fs from 'node:fs/promises';
import path from 'node:path';
import { UnsafePathError } from './errors.js';

export function assertSafeId(value, label = 'identificador') {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9._-]{0,127}$/i.test(value)) {
    throw new UnsafePathError('UNSAFE_IDENTIFIER', `${label} inválido o inseguro.`);
  }
  return value;
}

export function isWithin(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function rejectSymlinkChain(target) {
  const resolved = path.resolve(target);
  const parsed = path.parse(resolved);
  const parts = resolved.slice(parsed.root.length).split(path.sep).filter(Boolean);
  let current = parsed.root;
  for (const part of parts) {
    current = path.join(current, part);
    try {
      const stat = await fs.lstat(current);
      if (stat.isSymbolicLink()) {
        throw new UnsafePathError('SYMLINK_REJECTED', 'La ruta contiene un symlink o junction.');
      }
    } catch (error) {
      if (error.code === 'ENOENT') break;
      throw error;
    }
  }
}

function rejectPublic(realPath) {
  if (realPath.split(path.sep).some((part) => part.toLowerCase() === 'public')) {
    throw new UnsafePathError('PUBLIC_PATH_REJECTED', 'No se permite acceder dentro de public/.');
  }
}

export async function secureRoot(root, { create = false, rejectPublicPath = false } = {}) {
  const resolved = path.resolve(root);
  await rejectSymlinkChain(resolved);
  if (create) await fs.mkdir(resolved, { recursive: true });
  const real = await fs.realpath(resolved);
  if (real !== resolved) {
    throw new UnsafePathError('ROOT_ALIAS_REJECTED', 'La raíz no coincide con su ruta real.');
  }
  if (rejectPublicPath) rejectPublic(real);
  return real;
}

export async function secureTarget(root, fileName, options = {}) {
  const realRoot = await secureRoot(root, options);
  const target = path.join(realRoot, fileName);
  if (!isWithin(realRoot, target)) {
    throw new UnsafePathError('PATH_TRAVERSAL_REJECTED', 'La ruta sale de la raíz autorizada.');
  }
  try {
    const stat = await fs.lstat(target);
    if (stat.isSymbolicLink()) {
      throw new UnsafePathError('TARGET_SYMLINK_REJECTED', 'El destino es un symlink.');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return { root: realRoot, target };
}
