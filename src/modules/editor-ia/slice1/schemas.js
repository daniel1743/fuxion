import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { SchemaValidationError } from './errors.js';

const schemaRoot = fileURLToPath(new URL('../core/schemas/', import.meta.url));

export async function loadSchema(name) {
  return JSON.parse(await fs.readFile(new URL(`../core/schemas/${name}`, import.meta.url), 'utf8'));
}

async function resolveReferences(schema) {
  if (Array.isArray(schema)) return Promise.all(schema.map(resolveReferences));
  if (!schema || typeof schema !== 'object') return schema;
  if (typeof schema.$ref === 'string') {
    if (schema.$ref.startsWith('#')) {
      throw new SchemaValidationError('LOCAL_REF_UNSUPPORTED', 'Referencia local no soportada por los schemas de Slice 1.');
    }
    const referenced = await loadSchema(schema.$ref);
    return resolveReferences(referenced);
  }
  const entries = await Promise.all(
    Object.entries(schema).map(async ([key, value]) => [key, await resolveReferences(value)])
  );
  return Object.fromEntries(entries);
}

function matchesType(value, type) {
  if (type === 'null') return value === null;
  if (type === 'array') return Array.isArray(value);
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (type === 'integer') return Number.isInteger(value);
  return typeof value === type;
}

export function validateAgainstSchema(value, schema, path = '$') {
  const errors = [];
  const types = Array.isArray(schema.type) ? schema.type : schema.type ? [schema.type] : [];
  if (types.length && !types.some((type) => matchesType(value, type))) {
    return [`${path}: tipo inválido`];
  }
  if (schema.const !== undefined && value !== schema.const) errors.push(`${path}: valor constante inválido`);
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}: valor fuera del enum`);
  if (typeof value === 'string') {
    if (schema.minLength && value.length < schema.minLength) errors.push(`${path}: texto demasiado corto`);
    if (schema.pattern && !(new RegExp(schema.pattern).test(value))) errors.push(`${path}: patrón inválido`);
  }
  if (Array.isArray(value) && schema.items) {
    value.forEach((item, index) => errors.push(...validateAgainstSchema(item, schema.items, `${path}[${index}]`)));
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const required of schema.required || []) {
      if (!(required in value)) errors.push(`${path}.${required}: requerido`);
    }
    if (schema.additionalProperties === false && schema.properties) {
      for (const key of Object.keys(value)) {
        if (!(key in schema.properties)) errors.push(`${path}.${key}: propiedad desconocida`);
      }
    }
    for (const [key, child] of Object.entries(schema.properties || {})) {
      if (key in value) errors.push(...validateAgainstSchema(value[key], child, `${path}.${key}`));
    }
  }
  return errors;
}

export async function assertSchema(value, schemaName) {
  const schema = await resolveReferences(await loadSchema(schemaName));
  const errors = validateAgainstSchema(value, schema);
  if (errors.length) {
    throw new SchemaValidationError('SCHEMA_VALIDATION_FAILED', 'El artefacto no cumple su schema.', {
      context: { schema: schemaName, errors },
    });
  }
  return value;
}

export { schemaRoot };
