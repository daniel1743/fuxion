import fs from 'node:fs/promises';
import path from 'node:path';
import { InvalidSourceError, UnsafePathError } from './errors.js';
import { isWithin, secureRoot } from './safe-path.js';

export class LocalJsonArticleSource {
  constructor({ allowedRoots }) {
    if (!allowedRoots?.length) throw new UnsafePathError('NO_ALLOWED_ROOT', 'Falta un directorio local permitido.');
    this.allowedRoots = allowedRoots.map((root) => path.resolve(root));
    this.records = [];
  }

  async resolveSafe(input) {
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(input)) {
      throw new UnsafePathError('URL_INPUT_REJECTED', 'Solo se aceptan rutas locales.');
    }
    const target = await fs.realpath(path.resolve(input)).catch(() => path.resolve(input));
    const realRoots = await Promise.all(this.allowedRoots.map((root) => secureRoot(root)));
    if (!realRoots.some((root) => isWithin(root, target))) {
      throw new UnsafePathError('PATH_OUTSIDE_ALLOWED_ROOT', 'La ruta está fuera del directorio permitido.');
    }
    return target;
  }

  async readFromFile(input) {
    const target = await this.resolveSafe(input);
    let parsed;
    try {
      parsed = JSON.parse(await fs.readFile(target, 'utf8'));
    } catch (cause) {
      throw new InvalidSourceError('INVALID_LOCAL_JSON', 'No se pudo leer el JSON local.', { cause });
    }
    const records = Array.isArray(parsed) ? parsed : Array.isArray(parsed.articles) ? parsed.articles : [parsed];
    if (!records.length || records.some((item) => !item || typeof item !== 'object' || Array.isArray(item))) {
      throw new InvalidSourceError('INVALID_RECORD_COLLECTION', 'La fuente no contiene registros válidos.');
    }
    this.records = structuredClone(records);
    return structuredClone(records);
  }

  async readByIds(ids) {
    const wanted = new Set(ids.map(String));
    return structuredClone(this.records.filter((record) => wanted.has(String(record.article_id ?? record.id))));
  }

  async readBySlugs(slugs) {
    const wanted = new Set(slugs);
    return structuredClone(this.records.filter((record) => wanted.has(record.slug)));
  }

  async listAvailable() {
    return this.records.map((record) => String(record.article_id ?? record.id ?? record.slug ?? 'unknown'));
  }
}
