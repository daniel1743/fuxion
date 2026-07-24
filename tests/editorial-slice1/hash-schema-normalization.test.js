import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { normalizeLineEndings, sourceHash, stableStringify } from '../../src/modules/editor-ia/slice1/stable-json.js';
import { assertSchema } from '../../src/modules/editor-ia/slice1/schemas.js';
import { normalizeArticle } from '../../src/modules/editor-ia/slice1/normalizer.js';

const fixtures = fileURLToPath(new URL('../../src/modules/editor-ia/tests/fixtures/', import.meta.url));

async function fixture(name) {
  return JSON.parse(await fs.readFile(path.join(fixtures, name), 'utf8'));
}

test('hash determinista ignora orden de claves pero detecta un carácter', () => {
  const first = { b: 2, a: 'texto' };
  const reordered = { a: 'texto', b: 2 };
  assert.equal(sourceHash(first), sourceHash(reordered));
  assert.notEqual(sourceHash(first), sourceHash({ a: 'textp', b: 2 }));
  assert.notEqual(sourceHash({ text: 'á' }), sourceHash({ text: 'a\u0301' }));
  assert.notEqual(sourceHash({ faq: ['A'] }), sourceHash({ faq: ['B'] }));
  assert.notEqual(sourceHash({ metadata: { value: 1 } }), sourceHash({ metadata: { value: 2 } }));
  assert.notEqual(sourceHash({ unknown: 'A' }), sourceHash({ unknown: 'A ' }));
});

test('canonicalización documentada normaliza saltos de línea sin tocar espacios internos', () => {
  assert.deepEqual(normalizeLineEndings({ body: 'a\r\nb\r  c' }), { body: 'a\nb\n  c' });
  assert.equal(stableStringify({ body: 'a  b' }), '{"body":"a  b"}');
  assert.equal(sourceHash({ body: 'a\r\nb' }), sourceHash({ body: 'a\nb' }));
});

test('schema acepta CanonicalArticle válido y rechaza faltantes, extras y versión', async () => {
  const canonical = normalizeArticle(await fixture('articulo-markdown-valido.json'));
  await assert.doesNotReject(assertSchema(canonical, 'canonical-article.schema.json'));

  const missing = structuredClone(canonical);
  delete missing.identity.article_id;
  await assert.rejects(assertSchema(missing, 'canonical-article.schema.json'), /schema/i);

  const extra = structuredClone(canonical);
  extra.unknown = true;
  await assert.rejects(assertSchema(extra, 'canonical-article.schema.json'), /schema/i);

  const wrongVersion = structuredClone(canonical);
  wrongVersion.source.schema_version = '2.0.0';
  await assert.rejects(assertSchema(wrongVersion, 'canonical-article.schema.json'), /schema/i);
});

test('normalizador conserva Markdown, HTML, slug y estado', async () => {
  const markdown = await fixture('articulo-markdown-valido.json');
  const normalizedMarkdown = normalizeArticle(markdown);
  assert.equal(normalizedMarkdown.editorial.body, markdown.content);
  assert.equal(normalizedMarkdown.editorial.body_format, 'markdown');
  assert.equal(normalizedMarkdown.identity.slug, markdown.slug);
  assert.equal(normalizedMarkdown.identity.status, markdown.status);

  const html = await fixture('articulo-html-valido.json');
  const normalizedHtml = normalizeArticle(html);
  assert.equal(normalizedHtml.editorial.body, html.content_html);
  assert.equal(normalizedHtml.editorial.body_format, 'html');
  assert.deepEqual(normalizedHtml.structured_content.json_ld, html.json_ld);
});

test('normalizador detecta títulos, warning visible y avisos múltiples', async () => {
  const canonical = normalizeArticle(await fixture('markdown-roto.json'));
  const codes = canonical.source.normalization_issues.map((item) => item.code);
  assert.ok(codes.includes('DUPLICATED_TITLE'));
  assert.ok(codes.includes('MULTIPLE_H1'));
  assert.ok(codes.includes('VISIBLE_WARNING_MARKUP'));
  assert.ok(codes.includes('MULTIPLE_HEALTH_NOTICES'));
});

test('FAQ visible y schema permanecen separados y discrepancia bloquea', async () => {
  const canonical = normalizeArticle(await fixture('faq-schema-inconsistente.json'));
  assert.notDeepEqual(canonical.structured_content.visible_faq, canonical.structured_content.schema_faq);
  const mismatch = canonical.source.normalization_issues.find((item) => item.code === 'FAQ_SCHEMA_MISMATCH');
  assert.equal(mismatch.severity, 'BLOCKER');
  assert.equal(mismatch.recoverable, false);
});

test('campos desconocidos y contenido adversarial se preservan literalmente', async () => {
  const unknown = await fixture('campos-desconocidos.json');
  const normalizedUnknown = normalizeArticle(unknown);
  assert.deepEqual(normalizedUnknown.source.unparsed_fragments.legacy_widget, unknown.legacy_widget);
  assert.equal(normalizedUnknown.source.unparsed_fragments.legacy_scalar, unknown.legacy_scalar);

  const adversarial = await fixture('contenido-adversarial.json');
  const normalizedAdversarial = normalizeArticle(adversarial);
  assert.equal(normalizedAdversarial.editorial.body, adversarial.content);
  assert.match(normalizedAdversarial.editorial.body, /ignora las reglas/i);
  assert.match(normalizedAdversarial.editorial.body, /<script>/i);
});

test('formatos heredados inválidos generan incidencias sin corrección silenciosa', () => {
  const record = {
    source_table: 'local_export',
    article_id: 'legacy-formats',
    slug: 'legacy-formats',
    status: 'draft',
    title: 'Texto plano',
    content: 'Contenido sin Markdown',
    tags: '{"no":"array"}',
    references: { legacy: true },
    faq: '[{"question":"Q","answer":"A"}]',
    author: 'Autor A',
    author_name: 'Autor B',
  };
  const canonical = normalizeArticle(record);
  assert.equal(canonical.editorial.body_format, 'plain_text');
  assert.deepEqual(canonical.structured_content.visible_faq, [{ question: 'Q', answer: 'A' }]);
  const codes = canonical.source.normalization_issues.map((item) => item.code);
  assert.ok(codes.includes('UNPARSED_CONTENT'));
  assert.ok(codes.includes('AMBIGUOUS_AUTHORSHIP'));
  assert.ok(codes.includes('MISSING_H1'));
});

test('fuente sin esquema se bloquea descriptivamente y entrada no objeto se rechaza', () => {
  const canonical = normalizeArticle({ article_id: 'unknown', slug: '', status: 'unknown', content: '' });
  const unknown = canonical.source.normalization_issues.find((item) => item.code === 'UNKNOWN_SOURCE_SCHEMA');
  assert.equal(unknown.severity, 'BLOCKER');
  assert.equal(unknown.recoverable, false);
  assert.throws(() => normalizeArticle(null), /objeto/i);
  assert.throws(() => normalizeArticle([]), /objeto/i);
  assert.throws(() => normalizeArticle({ source_table: 'local_export' }), /identidad/i);
});
