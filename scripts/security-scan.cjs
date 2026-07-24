#!/usr/bin/env node
/**
 * Escaneo local mínimo y sin dependencias.
 * Detecta valores con forma de secreto; nunca imprime el valor encontrado.
 */

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const maxFileBytes = 2 * 1024 * 1024;
const excluded = new Set([
  'scripts/security-scan.cjs',
]);

const patterns = [
  {
    id: 'JWT_LITERAL',
    regex: /\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\b/g,
  },
  {
    id: 'SECRET_ASSIGNMENT_LITERAL',
    regex: /\b(?:SUPABASE_SERVICE_ROLE_KEY|WP_APP_PASSWORD|ANTHROPIC_API_KEY|ONEPROVIDER_API_KEY|GEMINI_API_KEY|DEEPSEEK_API_KEY|QWEN_API_KEY|BFL_API_KEY)\s*[:=]\s*['"][^'"\r\n]{12,}['"]/g,
  },
  {
    id: 'BEARER_LITERAL',
    regex: /\bAuthorization\s*:\s*['"]Bearer\s+[A-Za-z0-9._~+/-]{16,}['"]/gi,
  },
  {
    id: 'BASIC_AUTH_LITERAL',
    regex: /\bAuthorization\s*:\s*['"]Basic\s+[A-Za-z0-9+/=]{16,}['"]/gi,
  },
  {
    id: 'CREDENTIALS_IN_URL',
    regex: /\bhttps?:\/\/[^/\s:@]+:[^/\s@]+@[^/\s]+/gi,
  },
];

function listFiles() {
  const output = execFileSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    { cwd: root, encoding: 'utf8' }
  );
  return output.split('\0').filter(Boolean);
}

function isTextFile(buffer) {
  const sample = buffer.subarray(0, Math.min(buffer.length, 8000));
  return !sample.includes(0);
}

function lineNumberAt(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

const findings = [];
for (const relativePath of listFiles()) {
  const normalized = relativePath.replaceAll('\\', '/');
  if (excluded.has(normalized)) continue;

  const absolutePath = path.join(root, relativePath);
  let stat;
  try {
    stat = fs.statSync(absolutePath);
  } catch {
    continue;
  }
  if (!stat.isFile() || stat.size > maxFileBytes) continue;

  const buffer = fs.readFileSync(absolutePath);
  if (!isTextFile(buffer)) continue;
  const text = buffer.toString('utf8');

  for (const pattern of patterns) {
    pattern.regex.lastIndex = 0;
    for (const match of text.matchAll(pattern.regex)) {
      findings.push({
        path: normalized,
        line: lineNumberAt(text, match.index),
        type: pattern.id,
      });
    }
  }
}

if (findings.length > 0) {
  console.error(`Escaneo fallido: ${findings.length} posible(s) secreto(s).`);
  for (const finding of findings) {
    console.error(`${finding.path}:${finding.line} [${finding.type}]`);
  }
  process.exit(1);
}

console.log('Escaneo completado: no se detectaron valores con forma de secreto.');
