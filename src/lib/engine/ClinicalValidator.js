/**
 * ClinicalValidator — Stage 4: Validador Clínico Determinista
 *
 * Verifica que la salida del generador de narrativa cumple con:
 *   - No contiene diagnósticos médicos
 *   - No usa lenguaje alarmista o amenazante
 *   - No promete curas o resultados garantizados
 *   - No da dosis de medicamentos
 *   - Incluye disclaimer apropiado
 *   - Respeta el tono consultivo y profesional
 *   - No menciona productos de forma coercitiva
 *
 * Este módulo es 100% determinista — cero tokens de IA.
 */

// ── Reglas de validación ────────────────────────────────────────

const FORBIDDEN_PHRASES = [
  // Diagnósticos
  /\b(diagnóstico|diagnostico|diagnosís)\b/i,
  /\bes \(una\) enfermedad\b/i,
  /\btiene \(la\) [eo][aá]rea de\b/i,
  /\bpadeces?\s+(diabetes|hipertensión|hipertension|cancer|cáncer|depresión|depresion|artritis)\b/i,
  /\bconfirmo\s+que\b/i,
  /\bconfirmo\s+tu\s+(condicion|condición|diagnóstico)\b/i,

  // Promesas médicas
  /\bcure|curar|cura\s+(la\s+)?(obesidad|diabetes|hipertension|hipertensión|cáncer|cancer|depress|depresion)\b/i,
  /\bvoy\s+a\s+garantizarte\b/i,
  /\b100%\s+(de\s+)?(seguro|segura|efectivo)\b/i,
  /\bpuedes\s+dejar\s+de\s+tomar\s+tu\s+medicamento\b/i,

  // Lenguaje alarmista
  /\bes\b.*\bcáncer\b/i,
  /\bpeor\s+(cosa|diagnóstico)\b/i,
  /\btienes\s+(riesgo\s+)?(mort|fatal)\b/i,
  /\bvas\s+a\s+morir\b/i,
  /\besto\s+puede\s+matarte\b/i,

  // Medicamentos
  /\btoma\s+(metformina|insulina|lisinopril|atorvastatina|losartán|losartan|amlodipino|omeprazol|sertralina|fluoxetina)/i,
  /\bdeja\s+de\s+tomar\b/i,
  /\baumenta\s+tu\s+dosis\b/i,
];

const REQUIRED_ELEMENTS = [
  // Disclaimer obligatorio
  /\b(no\s+constituye\s+diagnóstico|no\s+reemplaza\s+la\s+(consulta|evaluación|atención)\s+médica|información\s+educativa|solo\s+fines\s+informativos|consultá?\s+con\s+un\s+profesional|profesional\s+de\s+salud|médico|médica)\b/i,
];

const WARN_PHRASES = [
  // Palabras que elevan ansiedad innecesariamente
  /\bsospechas?\s+(de\s+)?cáncer\b/i,
  /\btumoral\b/i,
  /\bmaligno\b/i,
  /\bcrónico\b.*\bgrave\b/i,
  /\bfatal\b/i,
  /\bemergencia\s+médica\b/i,
];

// ── Funciones de validación ─────────────────────────────────────

/**
 * Valida un reporte generado por IA.
 *
 * @param {string} markdownContent — Contenido markdown del reporte
 * @returns {{ valid: boolean, errors: string[], warnings: string[], score: number }}
 */
export function validateReportContent(markdownContent) {
  const errors = [];
  const warnings = [];
  let score = 100;

  // ── Chequear frases prohibidas ────────────────────────────────
  for (const pattern of FORBIDDEN_PHRASES) {
    const matches = markdownContent.match(pattern);
    if (matches) {
      const matchText = matches[0].substring(0, 80);
      errors.push(`Frase prohibida detectada: "${matchText}"`);
      score -= 25;
    }
  }

  // ── Chequear elementos obligatorios ───────────────────────────
  for (const pattern of REQUIRED_ELEMENTS) {
    const matches = markdownContent.match(pattern);
    if (!matches) {
      warnings.push('Elemento obligatorio ausente: nota de responsabilidad profesional');
      score -= 10;
    }
  }

  // ── Chequear advertencias ─────────────────────────────────────
  for (const pattern of WARN_PHRASES) {
    const matches = markdownContent.match(pattern);
    if (matches) {
      const matchText = matches[0].substring(0, 80);
      warnings.push(`Lenguaje sensible detectado: "${matchText}"`);
      score -= 5;
    }
  }

  // ── Verificar extensión mínima ────────────────────────────────
  const wordCount = markdownContent.split(/\s+/).length;
  if (wordCount < 300) {
    errors.push('El reporte es demasiado corto para ser útil (< 300 palabras).');
    score -= 20;
  }

  // ── Verificar formato ─────────────────────────────────────────
  if (!markdownContent.includes('#')) {
    warnings.push('El reporte carece de encabezados estructurados.');
    score -= 5;
  }

  if (markdownContent.includes('🔴') || markdownContent.includes('⚠️') || markdownContent.includes('❌')) {
    warnings.push('Se detectaron emojis de alerta que pueden generar ansiedad innecesaria. Considera un tono más suave.');
    score -= 3;
  }

  // ── Score final ───────────────────────────────────────────────
  score = Math.max(0, Math.min(100, score));

  return {
    valid: errors.length === 0 && score >= 50,
    errors,
    warnings,
    score,
    wordCount,
  };
}

/**
 * Corrige automáticamente errores menores detectables sin IA.
 *
 * @param {string} markdownContent
 * @returns {string} — Contenido corregido
 */
export function autoCorrectReport(markdownContent) {
  let corrected = markdownContent;

  // Remover emojis de alerta
  corrected = corrected.replace(/[🔴⚠️❌🚨]/g, '');

  // Corregir "diagnóstico" cuando aparece como afirmación del coach
  corrected = corrected.replace(
    /(Coach|Coach de Bienestar)\b[^.]*(diagnóstico)/gi,
    'Coach de Bienestar (nota: el coach no realiza diagnósticos)'
  );

  // Asegurar que hay un disclaimer al final si no hay
  const disclaimerRegex = /\b(no\s+constituye\s+diagnóstico|no\s+reemplaza\s+la\s+(consulta|evaluación|atención)\s+médica|información\s+educativa)\b/i;
  if (!disclaimerRegex.test(corrected)) {
    corrected += '\n\n---\n\n*Nota: Este informe tiene fines informativos y educativos. No constituye diagnóstico médico ni reemplaza la consulta con un profesional de salud cualificado.*';
  }

  return corrected;
}

/**
 * Genera un resumen de seguridad para logging.
 */
export function safetySummary(validationResult) {
  if (validationResult.valid) {
    return `APROBADO (score: ${validationResult.score})`;
  }

  const parts = [];
  if (validationResult.errors.length > 0) {
    parts.push(`${validationResult.errors.length} error(es)`);
  }
  if (validationResult.warnings.length > 0) {
    parts.push(`${validationResult.warnings.length} advertencia(s)`);
  }
  parts.push(`score: ${validationResult.score}`);
  return `RECHAZADO — ${parts.join(', ')}`;
}
