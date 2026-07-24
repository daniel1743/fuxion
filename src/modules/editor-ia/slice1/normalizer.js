import { UnsupportedSourceSchemaError } from './errors.js';

const KNOWN_FIELDS = new Set([
  'id', 'article_id', 'source_table', 'source_schema_version', 'slug', 'url', 'status',
  'is_published', 'title', 'subtitle', 'excerpt', 'summary', 'content', 'body', 'content_html',
  'author', 'author_name', 'reviewer', 'reviewed_by', 'category', 'tags', 'language',
  'published_at', 'created_at', 'updated_at', 'reviewed_at', 'faq', 'faqs', 'faq_schema',
  'references', 'bibliography', 'products', 'related_products', 'json_ld', 'schema',
  'table_of_contents', 'toc', 'health_notice', 'disclaimer', 'seo_title', 'meta_title',
  'meta_description', 'canonical_url', 'keywords', 'reading_time', 'read_time'
]);

function issue(code, severity, field, message, original_fragment, recoverable = true) {
  return { code, severity, field, message, original_fragment, recoverable };
}

function arrayValue(value, field, issues) {
  if (value == null || value === '') return [];
  if (Array.isArray(value)) return structuredClone(value);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
      issues.push(issue('UNPARSED_CONTENT', 'WARNING', field, 'El JSON no contiene un array.', value));
      return [];
    } catch {
      return value.split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean);
    }
  }
  issues.push(issue('UNPARSED_CONTENT', 'WARNING', field, 'Formato no interpretado; se preservó en origen.', value));
  return [];
}

function detectFormat(body) {
  if (!body) return 'unknown';
  if (/<(?:p|h[1-6]|div|ul|ol|article)\b/i.test(body)) return 'html';
  if (/^#{1,6}\s|\[[^\]]+\]\([^)]+\)|^\s*[-*]\s/m.test(body)) return 'markdown';
  return 'plain_text';
}

function faqFromBody(body, format) {
  if (format !== 'markdown') return [];
  const section = body.match(/^##\s+(?:Preguntas frecuentes|FAQ)\s*$([\s\S]*)/im)?.[1] || '';
  const pairs = [];
  const regex = /^(?:###\s+|\*\*)([^*\n?]+\??)(?:\*\*)?\s*\n+([\s\S]*?)(?=^(?:###\s+|\*\*)|\z)/gm;
  for (const match of section.matchAll(regex)) {
    pairs.push({ question: match[1].trim(), answer: match[2].trim() });
  }
  return pairs;
}

function faqFromJsonLd(jsonLd) {
  const result = [];
  for (const node of jsonLd) {
    if (node && node['@type'] === 'FAQPage' && Array.isArray(node.mainEntity)) {
      result.push(...node.mainEntity);
    }
  }
  return result;
}

function normalizedFaqText(value) {
  return JSON.stringify(value).toLowerCase().replace(/\s+/g, ' ').replace(/[^a-záéíóúñ0-9 ]/gi, '');
}

export function normalizeArticle(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    throw new UnsupportedSourceSchemaError('UNKNOWN_SOURCE_SCHEMA', 'El registro fuente no es un objeto.');
  }
  const issues = [];
  const sourceTable = ['wellness_articles', 'blog_posts', 'local_export'].includes(record.source_table)
    ? record.source_table
    : 'local_export';
  if (!record.source_table) {
    issues.push(issue('UNKNOWN_SOURCE_SCHEMA', 'BLOCKER', 'source_table', 'No se declaró el esquema fuente.', null, false));
  }

  const id = String(record.article_id ?? record.id ?? record.slug ?? '');
  if (!id) throw new UnsupportedSourceSchemaError('MISSING_ARTICLE_ID', 'No existe identidad mínima.');
  const bodyRaw = record.body ?? record.content ?? record.content_html ?? '';
  const body = typeof bodyRaw === 'string' ? bodyRaw : JSON.stringify(bodyRaw);
  if (typeof bodyRaw !== 'string') {
    issues.push(issue('UNPARSED_CONTENT', 'WARNING', 'body', 'El cuerpo no era texto; se preservó serializado.', bodyRaw));
  }
  const format = detectFormat(body);
  const jsonLd = arrayValue(record.json_ld ?? record.schema, 'json_ld', issues);
  const explicitFaq = arrayValue(record.faq ?? record.faqs, 'visible_faq', issues);
  const visibleFaq = explicitFaq.length ? explicitFaq : faqFromBody(body, format);
  const schemaFaq = [
    ...arrayValue(record.faq_schema, 'schema_faq', issues),
    ...faqFromJsonLd(jsonLd),
  ];

  if (schemaFaq.length && normalizedFaqText(schemaFaq) !== normalizedFaqText(visibleFaq)) {
    issues.push(issue('FAQ_SCHEMA_MISMATCH', 'BLOCKER', 'structured_content', 'FAQ schema no coincide con FAQ visible.', { visibleFaq, schemaFaq }, false));
  }
  if (/\[!WARNING\]/i.test(body)) {
    issues.push(issue('VISIBLE_WARNING_MARKUP', 'WARNING', 'body', 'Marcador [!WARNING] visible detectado.', '[!WARNING]'));
  }
  const headings = [...body.matchAll(/^#\s+(.+)$/gm)].map((match) => match[1].trim());
  if (headings.length > 1 || (headings[0] && record.title && headings[0].toLowerCase() === String(record.title).toLowerCase())) {
    issues.push(issue('DUPLICATED_TITLE', 'WARNING', 'body', 'Título H1 duplicado o múltiple.', headings));
  }
  if (headings.length === 0) issues.push(issue('MISSING_H1', 'INFO', 'body', 'No se detectó H1 en el cuerpo.', null));
  if (headings.length > 1) issues.push(issue('MULTIPLE_H1', 'WARNING', 'body', 'Se detectaron múltiples H1.', headings));

  const notices = [];
  const explicitNotices = arrayValue(record.health_notice ?? record.disclaimer, 'health_notice', issues);
  notices.push(...explicitNotices.map(String));
  const inlineNotices = body.match(/(?:aviso|descargo)[^\n]{10,}/gi) || [];
  notices.push(...inlineNotices);
  if (notices.length > 1) {
    issues.push(issue('MULTIPLE_HEALTH_NOTICES', 'WARNING', 'health_notice', 'Se detectaron múltiples avisos de salud.', notices));
  }
  if (record.author && record.author_name && normalizedFaqText(record.author) !== normalizedFaqText(record.author_name)) {
    issues.push(issue('AMBIGUOUS_AUTHORSHIP', 'WARNING', 'author', 'Existen campos de autoría contradictorios.', { author: record.author, author_name: record.author_name }));
  }

  const unparsed = Object.fromEntries(
    Object.entries(record).filter(([key]) => !KNOWN_FIELDS.has(key)).map(([key, value]) => [key, structuredClone(value)])
  );
  if (Object.keys(unparsed).length) {
    issues.push(issue('UNPARSED_CONTENT', 'WARNING', 'source', 'Campos desconocidos preservados.', Object.keys(unparsed)));
  }

  const status = String(record.status ?? (record.is_published === true ? 'published' : record.is_published === false ? 'draft' : 'unknown'));
  return {
    identity: {
      article_id: id,
      source_table: sourceTable,
      source_record_id: String(record.id ?? id),
      slug: String(record.slug ?? ''),
      url: record.url == null ? null : String(record.url),
      status,
    },
    editorial: {
      title: String(record.title ?? ''),
      subtitle: record.subtitle == null ? null : String(record.subtitle),
      excerpt: record.excerpt == null && record.summary == null ? null : String(record.excerpt ?? record.summary),
      body,
      body_format: format,
      author: structuredClone(record.author ?? record.author_name ?? null),
      reviewer: structuredClone(record.reviewer ?? record.reviewed_by ?? null),
      category: record.category == null ? null : String(record.category),
      tags: arrayValue(record.tags, 'tags', issues).map(String),
      language: String(record.language ?? 'es'),
    },
    dates: {
      published_at: record.published_at ?? record.created_at ?? null,
      updated_at: record.updated_at ?? null,
      reviewed_at: record.reviewed_at ?? null,
    },
    structured_content: {
      visible_faq: visibleFaq,
      schema_faq: schemaFaq,
      references: arrayValue(record.references ?? record.bibliography, 'references', issues),
      products: arrayValue(record.products ?? record.related_products, 'products', issues),
      json_ld: jsonLd,
      table_of_contents: arrayValue(record.table_of_contents ?? record.toc, 'table_of_contents', issues),
      health_notice: notices,
    },
    seo: {
      seo_title: record.seo_title == null && record.meta_title == null ? null : String(record.seo_title ?? record.meta_title),
      meta_description: record.meta_description == null ? null : String(record.meta_description),
      canonical_url: record.canonical_url == null ? null : String(record.canonical_url),
      keywords: arrayValue(record.keywords, 'keywords', issues).map(String),
    },
    source: {
      raw_record: structuredClone(record),
      unparsed_fragments: unparsed,
      normalization_issues: issues,
      schema_version: '1.0.0',
    },
  };
}
