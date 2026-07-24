import { sha256, stableStringify } from './stable-json.js';

function flatten(value, prefix = '$', output = new Map()) {
  if (value && typeof value === 'object') {
    if (Array.isArray(value)) {
      output.set(prefix, { container: 'array', length: value.length });
      value.forEach((item, index) => flatten(item, `${prefix}[${index}]`, output));
    } else {
      output.set(prefix, { container: 'object', keys: Object.keys(value).sort() });
      for (const key of Object.keys(value).sort()) flatten(value[key], `${prefix}.${key}`, output);
    }
  } else {
    output.set(prefix, value);
  }
  return output;
}

export function textualDiff(before = '', after = '') {
  const left = String(before).replace(/\r\n?/g, '\n').split('\n');
  const right = String(after).replace(/\r\n?/g, '\n').split('\n');
  const max = Math.max(left.length, right.length);
  const changes = [];
  for (let index = 0; index < max; index += 1) {
    if (left[index] === right[index]) continue;
    changes.push({
      line: index + 1,
      removed: left[index] ?? null,
      added: right[index] ?? null,
    });
  }
  return changes;
}

export function structuralDiff(before, after) {
  const left = flatten(before);
  const right = flatten(after);
  const paths = [...new Set([...left.keys(), ...right.keys()])].sort();
  const changes = [];
  for (const field of paths) {
    const hasBefore = left.has(field);
    const hasAfter = right.has(field);
    if (hasBefore && hasAfter && stableStringify(left.get(field)) === stableStringify(right.get(field))) continue;
    const type = !hasBefore ? 'added' : !hasAfter ? 'removed' : 'modified';
    const blocker = field === '$.identity.slug' || field === '$.slug'
      ? 'SLUG_CHANGED'
      : field === '$.identity.status' || field === '$.status' || field === '$.is_published'
        ? 'PUBLICATION_STATUS_CHANGED'
        : null;
    changes.push({
      field,
      type,
      before: hasBefore ? left.get(field) : null,
      after: hasAfter ? right.get(field) : null,
      blocker,
    });
  }
  return changes;
}

export function createDiff({ articleId, snapshotId, before, after, beforeHash, afterHash }) {
  const structural = structuralDiff(before, after);
  const textual = textualDiff(
    before?.editorial?.body ?? before?.body ?? before?.content ?? '',
    after?.editorial?.body ?? after?.body ?? after?.content ?? ''
  );
  return {
    schema_version: '1.0.0',
    article_id: articleId,
    snapshot_id: snapshotId,
    before_hash: beforeHash ?? sha256(before),
    after_hash: afterHash ?? sha256(after),
    changed: structural.length > 0 || textual.length > 0,
    blockers: [...new Set(structural.map((change) => change.blocker).filter(Boolean))],
    structural,
    textual,
  };
}

export function diffToMarkdown(diff) {
  const lines = [
    `# Diff: ${diff.article_id}`,
    '',
    `- Snapshot: \`${diff.snapshot_id}\``,
    `- Hash anterior: \`${diff.before_hash}\``,
    `- Hash posterior: \`${diff.after_hash}\``,
    `- Cambios: ${diff.changed ? 'sí' : 'no'}`,
    `- Bloqueos: ${diff.blockers.length ? diff.blockers.join(', ') : 'ninguno'}`,
    '',
    '## Cambios estructurales',
    '',
  ];
  if (!diff.structural.length) lines.push('Sin cambios.');
  for (const change of diff.structural) {
    lines.push(`- **${change.type}** \`${change.field}\`${change.blocker ? ` — BLOCKER: ${change.blocker}` : ''}`);
  }
  lines.push('', '## Cambios textuales', '');
  if (!diff.textual.length) lines.push('Sin cambios.');
  for (const change of diff.textual) {
    lines.push(`- Línea ${change.line}: eliminada=${JSON.stringify(change.removed)}, añadida=${JSON.stringify(change.added)}`);
  }
  return `${lines.join('\n')}\n`;
}
