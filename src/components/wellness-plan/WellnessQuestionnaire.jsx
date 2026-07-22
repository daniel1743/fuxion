import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { useWellnessTwin } from '@/context/WellnessTwinContext';
import {
  getNextQuestion,
  completeQuestion,
} from '@/lib/engine/questionRouter';
import {
  QUESTIONS,
  QUESTION_ORDER,
  QUESTION_GROUPS,
  getQuestionById,
} from '@/lib/engine/questionTree';
import { recognizeAnswer } from '@/lib/engine/microRecognition';

/* ── Animations ────────────────────────────────────────────────────── */

const spring = { type: 'spring', stiffness: 360, damping: 32, mass: 0.9 };

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 56 : -56, opacity: 0 }),
};

/* ── Helpers ───────────────────────────────────────────────────────── */

function getCategory(field) {
  const map = {
    activityLevel: 'activity',
    sleepHours: 'sleep',
    sleepQuality: 'sleep_quality',
    waterLiters: 'water',
    fruitVegServings: 'fruit_veg',
    ultraprocessedPerWeek: 'ultraprocessed',
    bristolType: 'bristol',
    bowelFrequency: 'bowel_frequency',
    bloating: 'bloating',
    stressLevel: 'stress',
    moodLevel: 'mood',
    sunExposure: 'sun_exposure',
    smokes: 'smoking',
    alcoholPerWeek: 'alcohol',
    coffeePerDay: 'coffee',
    goal: 'goal',
  };
  return map[field] || 'general';
}

function getFieldId(field) {
  return field.replace(/([A-Z])/g, '_$1').toLowerCase();
}

function formatValue(field, value) {
  if (value == null) return '';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'number') return String(value);
  return String(value);
}

function getGroupProgress(completedIds) {
  const groupCounts = {};
  QUESTION_ORDER.forEach((id) => {
    const q = getQuestionById(id);
    if (q) {
      groupCounts[q.stepGroup] = (groupCounts[q.stepGroup] || 0) + 1;
    }
  });

  const groupCompleted = {};
  completedIds.forEach((id) => {
    const q = getQuestionById(id);
    if (q) {
      groupCompleted[q.stepGroup] = (groupCompleted[q.stepGroup] || 0) + 1;
    }
  });

  return Object.entries(groupCounts).map(([groupId, total]) => ({
    id: groupId,
    label: QUESTION_GROUPS.find((g) => g.id === groupId)?.label || groupId,
    done: groupCompleted[groupId] || 0,
    total,
  }));
}

/* ── Input Components ──────────────────────────────────────────────── */

function Field({ label, hint, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      {children}
      {hint && <p className="text-xs leading-5 text-gray-500">{hint}</p>}
    </div>
  );
}

function TextInput({ label, hint, value, onChange, placeholder }) {
  return (
    <Field label={label} hint={hint}>
      <input
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-gray-200 bg-white/80 px-4 text-base text-gray-900 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/12"
      />
    </Field>
  );
}

function TextareaInput({ label, hint, value, onChange, placeholder }) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-y rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-base text-gray-900 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/12"
      />
    </Field>
  );
}

function RangeInput({ label, value, min, max, onChange, lowLabel, highLabel }) {
  const resolved = value ?? Math.round((min + max) / 2);
  return (
    <Field label={label}>
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">{lowLabel}</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
            {resolved}
          </span>
          <span className="text-xs font-medium text-gray-500">{highLabel}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={resolved}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-emerald-600"
        />
      </div>
    </Field>
  );
}

function ChoiceGrid({ label, hint, value, options, onChange }) {
  return (
    <Field label={label} hint={hint}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <motion.button
              key={String(option.value)}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              onClick={() => onChange(option.value)}
              className={`min-h-[72px] rounded-2xl border p-4 text-left transition-all ${
                selected
                  ? 'border-emerald-500 bg-emerald-50 shadow-[0_14px_32px_rgba(16,185,129,0.14)]'
                  : 'border-gray-200 bg-white/75 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/40'
              }`}
            >
              <span className={`block text-sm font-bold ${selected ? 'text-emerald-800' : 'text-gray-900'}`}>
                {option.title}
              </span>
              <span className="mt-1 block text-xs leading-5 text-gray-500">{option.desc}</span>
            </motion.button>
          );
        })}
      </div>
    </Field>
  );
}

/* ── Recognition Banner ────────────────────────────────────────────── */

function RecognitionBanner({ message, severity, question }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.1 }}
      className={`relative overflow-hidden rounded-3xl border p-5 ${
        severity === 'warning'
          ? 'border-amber-200 bg-amber-50/80'
          : severity === 'positive'
            ? 'border-emerald-200 bg-emerald-50/80'
            : 'border-slate-200 bg-white/80'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {severity === 'warning' ? (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 text-sm font-bold">!</span>
          ) : severity === 'positive' ? (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 text-lg">✓</span>
          ) : (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm">💡</span>
          )}
        </div>
        <div>
          <p className={`text-sm leading-6 ${
            severity === 'warning' ? 'text-amber-800' :
            severity === 'positive' ? 'text-emerald-800' : 'text-slate-700'
          }`}>
            {message}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {question?.label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Question Card ─────────────────────────────────────────────────── */

function QuestionCard({ question, answer, onChange, onConfirm }) {
  const renderInput = () => {
    switch (question.type) {
      case 'choice':
        return (
          <ChoiceGrid
            label={question.label}
            hint={question.hint}
            value={answer}
            options={question.options}
            onChange={onChange}
          />
        );
      case 'range':
        return (
          <RangeInput
            label={question.label}
            value={answer}
            min={question.min}
            max={question.max}
            lowLabel={question.lowLabel}
            highLabel={question.highLabel}
            onChange={onChange}
          />
        );
      case 'textarea':
        return (
          <TextareaInput
            label={question.label}
            hint={question.hint}
            value={answer}
            onChange={onChange}
            placeholder={question.placeholder}
          />
        );
      default:
        return (
          <TextInput
            label={question.label}
            hint={question.hint}
            value={answer}
            onChange={onChange}
            placeholder={question.placeholder}
          />
        );
    }
  };

  return (
    <motion.div
      key={question.id}
      custom={1}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={spring}
      className="w-full space-y-5"
    >
      {renderInput()}
    </motion.div>
  );
}

/* ── Main Component ────────────────────────────────────────────────── */

export default function WellnessQuestionnaire({ onComplete }) {
  const {
    answers,
    setAnswers,
    currentQuestionId,
    setCurrentQuestionId,
    completedQuestions: contextCompletedQuestions,
    setCompletedQuestions,
    submitEvaluation,
  } = useWellnessTwin();
  const completedQuestions = Array.isArray(contextCompletedQuestions) ? contextCompletedQuestions : [];

  const [direction, setDirection] = useState(1);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [lastRecognition, setLastRecognition] = useState(null);
  const [skippedQuestions, setSkippedQuestions] = useState([]);

  // Initialize first question on mount
  useEffect(() => {
    if (!currentQuestionId) {
      const next = getNextQuestion(answers, completedQuestions);
      if (next) {
        setCurrentQuestionId(next.question.id);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentQuestion = useMemo(
    () => getQuestionById(currentQuestionId),
    [currentQuestionId]
  );

  const currentAnswer = currentQuestion
    ? answers[currentQuestion.field]
    : undefined;

  const progress = useMemo(
    () => Math.round((completedQuestions.length / QUESTION_ORDER.length) * 100),
    [completedQuestions.length]
  );

  const groupProgress = useMemo(
    () => getGroupProgress(completedQuestions),
    [completedQuestions]
  );

  const handleAnswer = useCallback(
    (field, value) => {
      setAnswers((prev) => ({ ...prev, [field]: value }));
      if (currentQuestion) {
        setLastRecognition(recognizeAnswer(getCategory(field), value, currentAnswer));
      }
    },
    [setAnswers, currentQuestion, currentAnswer]
  );

  const handleConfirm = useCallback(async () => {
    if (!currentQuestion) return;

    // Validate required
    if (currentQuestion.required && currentAnswer === undefined || currentAnswer === '') {
      return;
    }

    // Mark as completed
    const { answers: newAnswers, completedIds } = completeQuestion(
      currentQuestion.id,
      currentAnswer,
      answers,
      completedQuestions
    );

    setAnswers(newAnswers);
    setCompletedQuestions(completedIds);

    // Get next question
    const next = getNextQuestion(newAnswers, completedIds);
    if (next) {
      setDirection(1);
      setLastAnswer(currentAnswer);
      setCurrentQuestionId(next.question.id);
      setSkippedQuestions(next.skipped || []);
    } else {
      // Done! Submit
      setLastAnswer(currentAnswer);
      setLastRecognition(recognizeAnswer(getCategory(currentQuestion.field), currentAnswer));

      await submitEvaluation(newAnswers);
      onComplete?.();
    }
  }, [
    currentQuestion,
    currentAnswer,
    answers,
    completedQuestions,
    setAnswers,
    setCompletedQuestions,
    setCurrentQuestionId,
    submitEvaluation,
    onComplete,
  ]);

  const handleBack = useCallback(() => {
    if (completedQuestions.length === 0) return;

    const lastId = completedQuestions[completedQuestions.length - 1];
    const beforeLast = completedQuestions[completedQuestions.length - 2];

    if (beforeLast) {
      setDirection(-1);
      setCurrentQuestionId(beforeLast);
    }
  }, [completedQuestions, setCurrentQuestionId]);

  // ── Render ────────────────────────────────────────────────────────

  if (!currentQuestion) {
    return (
      <div className="mx-auto w-full max-w-2xl px-0 pb-28 sm:pb-4">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur md:p-8"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-emerald-50 to-transparent" />
          <div className="relative">
            <div className="text-center py-8">
              <span className="inline-block mb-4 text-5xl">✓</span>
              <h2 className="text-2xl font-bold text-gray-950">Cuestionario completado</h2>
              <p className="mt-2 text-sm text-gray-500">
                {completedQuestions.length} de {QUESTION_ORDER.length} preguntas respondidas.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-0 pb-28 sm:pb-4">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur md:p-8"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-emerald-50 to-transparent" />
        <div className="relative">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                {completedQuestions.length} de {QUESTION_ORDER.length} preguntas
              </span>
              <span className="text-xs font-semibold text-gray-500">{progress}% completado</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={spring}
              />
            </div>
            {/* Group dots */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto py-1">
              {groupProgress.map(({ id, label, done, total }) => (
                <div
                  key={id}
                  className="group relative shrink-0"
                  title={label}
                >
                  <div
                    className={`h-1.5 w-8 rounded-full ${
                      done >= total ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  />
                  <span className="absolute left-1/2 -translate-x-1/2 top-3 whitespace-nowrap rounded bg-gray-900/80 px-2 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recognition banner (shown before next question) */}
          {lastAnswer !== null && lastRecognition && currentQuestionId && (
            <div className="mb-5">
              <RecognitionBanner
                message={lastRecognition.text}
                severity={lastRecognition.severity}
                question={getQuestionById(
                  QUESTION_ORDER.find(
                    (id) => id.replace('q_', '') === Object.keys(answers).find((k) => answers[k] === lastAnswer)
                  )
                )}
              />
            </div>
          )}

          {/* Skipped questions indicator */}
          {skippedQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 flex flex-wrap gap-2"
            >
              {skippedQuestions.map((sk) => (
                <span
                  key={sk.id}
                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-500"
                >
                  <span className="text-gray-400">⏭</span>
                  {sk.reason}
                </span>
              ))}
            </motion.div>
          )}

          {/* Question */}
          <div className="relative min-h-[300px] overflow-visible">
            <AnimatePresence mode="wait" custom={direction}>
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                answer={currentAnswer}
                onChange={(e) => handleAnswer(currentQuestion.field, e.target.value)}
                onConfirm={handleConfirm}
              />
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* Bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-emerald-100 bg-white/92 px-4 py-3 shadow-[0_-18px_40px_rgba(15,23,42,0.10)] backdrop-blur sm:static sm:mt-5 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            className="flex min-h-[48px] items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 text-sm font-bold text-emerald-700 shadow-sm disabled:invisible"
            onClick={handleBack}
            disabled={completedQuestions.length === 0}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            Anterior
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            className={`flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-white shadow-[0_16px_32px_rgba(16,185,129,0.22)] transition-all sm:flex-none ${
              currentQuestion.required && currentAnswer === undefined
                ? 'bg-gray-300 shadow-none'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600'
            }`}
            onClick={handleConfirm}
            disabled={currentQuestion.required && currentAnswer === undefined}
          >
            {currentQuestion.type === 'choice' ? (
              <>
                Siguiente <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
              </>
            ) : currentQuestion.type === 'textarea' ? (
              <>
                Continuar <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
              </>
            ) : (
              <>
                Confirmar <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
