import { QUESTIONS, QUESTION_ORDER } from './questionTree';

const QUESTION_MAP = new Map();
QUESTION_ORDER.forEach((id, idx) => QUESTION_MAP.set(id, idx));

export function evaluateCondition(condition, answers) {
  const { field, operator, value } = condition;
  const answerVal = answers[field];

  if (answerVal === undefined) return false;

  switch (operator) {
    case '<':  return Number(answerVal) < Number(value);
    case '>':  return Number(answerVal) > Number(value);
    case '<=': return Number(answerVal) <= Number(value);
    case '>=': return Number(answerVal) >= Number(value);
    case '===': return answerVal === value;
    case '!==': return answerVal !== value;
    case 'in':  return Array.isArray(value) && value.includes(answerVal);
    default: return false;
  }
}

/**
 * Determina la siguiente pregunta del cuestionario adaptativo.
 *
 * Recorre las preguntas en orden, salta las ya respondidas,
 * evalúa condiciones de visibilidad y respeta reglas de salto.
 *
 * @param {Object} answers — respuestas acumuladas
 * @param {string[]} completedIds — IDs de preguntas ya respondidas
 * @returns {{ question: Object, skipped?: string[] } | null}
 */
export function getNextQuestion(answers, completedIds = []) {
  const completed = new Set(completedIds);
  const skipped = [];

  for (let i = 0; i < QUESTION_ORDER.length; i++) {
    const id = QUESTION_ORDER[i];

    // Si ya respondió esta pregunta, pasar a la siguiente
    if (completed.has(id)) continue;

    const question = QUESTIONS.find((q) => q.id === id);
    if (!question) continue;

    // Evaluar condiciones de visibilidad
    if (question.conditions) {
      const visible = question.conditions.every((cond) => evaluateCondition(cond, answers));
      if (!visible) continue;
    }

    // Evaluar skipIf (ya sabemos la respuesta por otras preguntas)
    if (question.skipIf) {
      const shouldSkip = question.skipIf(answers);
      if (shouldSkip) {
        skipped.push({
          id: question.id,
          field: question.field,
          reason: question.skipReason || 'Omitida por contexto previo',
        });
        continue;
      }
    }

    // Encontrar la siguiente pregunta después de saltos
    let nextIdx = i + 1;
    while (nextIdx < QUESTION_ORDER.length) {
      const nextId = QUESTION_ORDER[nextIdx];
      const nextQ = QUESTIONS.find((q) => q.id === nextId);

      if (completed.has(nextId)) {
        nextIdx++;
        continue;
      }

      if (nextQ && nextQ.skipIf && nextQ.skipIf(answers)) {
        skipped.push({
          id: nextQ.id,
          field: nextQ.field,
          reason: nextQ.skipReason || 'Omitida por contexto previo',
        });
        nextIdx++;
        continue;
      }

      break;
    }

    if (nextIdx < QUESTION_ORDER.length) {
      const nextId = QUESTION_ORDER[nextIdx];
      const nextQuestion = QUESTIONS.find((q) => q.id === nextId);

      if (nextQuestion && !completed.has(nextId)) {
        return { question: nextQuestion, skipped: skipped.length ? skipped : undefined };
      }
    }

    // Llegó al final — todas las preguntas están respondidas
    return null;
  }

  return null;
}

/**
 * Marca una pregunta como completada y avanza al siguiente.
 * @param {string} questionId
 * @param {any} answer
 * @param {Object} answers
 * @param {string[]} completedIds
 * @returns {{ answers: Object, completedIds: string[] }}
 */
export function completeQuestion(questionId, answer, answers, completedIds) {
  const newAnswers = { ...answers, [questionId.replace('q_', '')]: answer };
  const newCompleted = [...completedIds, questionId];
  return { answers: newAnswers, completedIds: newCompleted };
}

/**
 * Verifica si el cuestionario está completo.
 */
export function isComplete(completedIds) {
  const required = QUESTIONS.filter((q) => q.required);
  return required.every((q) => completedIds.includes(q.id));
}

/**
 * Obtiene cuántas preguntas faltan por responder.
 */
export function getRemainingCount(completedIds) {
  return QUESTION_ORDER.length - completedIds.length;
}
