import { createHash, randomUUID } from 'node:crypto';

export function assertJsonCompatible(value, path = '$', seen = new WeakSet()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError(`${path}: número no admitido por JSON.`);
    return;
  }
  if (typeof value !== 'object') throw new TypeError(`${path}: valor no admitido por JSON.`);
  if (seen.has(value)) throw new TypeError(`${path}: estructura cíclica no admitida por JSON.`);
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== Array.prototype && prototype !== null) {
    throw new TypeError(`${path}: prototipo no admitido por JSON.`);
  }
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertJsonCompatible(item, `${path}[${index}]`, seen));
  } else {
    for (const key of Object.keys(value)) {
      if (['__proto__', 'prototype', 'constructor'].includes(key)) {
        throw new TypeError(`${path}.${key}: clave no admitida por JSON seguro.`);
      }
      assertJsonCompatible(value[key], `${path}.${key}`, seen);
    }
  }
  seen.delete(value);
}

export function normalizeLineEndings(value) {
  if (typeof value === 'string') return value.replace(/\r\n?/g, '\n');
  if (Array.isArray(value)) return value.map(normalizeLineEndings);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, normalizeLineEndings(value[key])])
    );
  }
  return value;
}

export function stableStringify(value, space = 0) {
  assertJsonCompatible(value);
  return JSON.stringify(normalizeLineEndings(value), null, space);
}

export function sha256(value) {
  const input = typeof value === 'string' ? value : stableStringify(value);
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

export function sourceHash(record) {
  return sha256(stableStringify(record));
}

export function contentId(prefix, value) {
  return `${prefix}-${sha256(value).slice(0, 24)}`;
}

export function runId() {
  return `run-${randomUUID()}`;
}
