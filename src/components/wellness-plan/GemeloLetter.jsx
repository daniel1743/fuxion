/**
 * GemeloLetter
 *
 * Genera una carta personal escrita específicamente para el usuario.
 * No es un resumen genérico: es una interpretación real de los datos.
 *
 * El tono es de un especialista que te conoce, no un formulario.
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

function getProfilePattern(answers, twinData) {
  const { twin_state } = twinData;
  const domains = twin_state?.iib?.domains || {};
  const weakest = Object.entries(domains)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2);
  const strongest = Object.entries(domains)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);
  const spread = strongest[0]?.[1] - weakest[0]?.[1] || 0;
  const avg = Object.values(domains).reduce((a, b) => a + b, 0) / Object.keys(domains).length;

  if (spread >= 35) return 'desbalanceado';
  if (avg >= 75) return 'solido';
  return 'en_construccion';
}

function getPrimarySignal(answers, twinData) {
  const { twin_state } = twinData;
  const domains = twin_state?.iib?.domains || {};

  const signals = [];

  // Sleep is usually the #1 signal
  if ((answers.sleepHours || 7) < 6.5) {
    signals.push({
      domain: 'sueno',
      strength: (6.5 - (answers.sleepHours || 7)) * 20,
      message: `dormís ${answers.sleepHours} horas`,
      impact: 'esa es probablemente la razón principal de tu fatiga'
    });
  }

  // Stress
  if ((answers.stressLevel || 5) >= 7) {
    signals.push({
      domain: 'estres',
      strength: (answers.stressLevel - 7) * 15,
      message: `tu estrés está en ${answers.stressLevel}/10`,
      impact: 'eso está afectando tu digestión y tu sueño'
    });
  }

  // Water
  if ((answers.waterLiters || 0) < 1.5) {
    signals.push({
      domain: 'hidratacion',
      strength: (1.5 - (answers.waterLiters || 0)) * 40,
      message: `bebés ${answers.waterLiters} litros de agua`,
      impact: 'tu cuerpo necesita más hidratación para funcionar bien'
    });
  }

  // Bristol
  if ((answers.bristolType || 4) <= 2) {
    signals.push({
      domain: 'digestion',
      strength: 30,
      message: 'tu tránsito intestinal está lento',
      impact: 'probablemente es por falta de agua y fibra'
    });
  }

  // Sedentary
  if ((answers.sedentaryHours || 0) >= 8) {
    signals.push({
      domain: 'actividad',
      strength: (answers.sedentaryHours - 8) * 10,
      message: 'pasás muchas horas sentado',
      impact: 'eso afecta tu metabolismo más de lo que pensás'
    });
  }

  // Smoking
  if (answers.smokes) {
    signals.push({
      domain: 'habitos',
      strength: 50,
      message: 'fumás',
      impact: 'eso está frenando tu recuperación y tu energía'
    });
  }

  // Alcohol
  if ((answers.alcoholPerWeek || 0) >= 5) {
    signals.push({
      domain: 'habitos',
      strength: (answers.alcoholPerWeek - 5) * 8,
      message: 'bebés alcohol frecuentemente',
      impact: 'eso está afectando tu sueño profundo'
    });
  }

  signals.sort((a, b) => b.strength - a.strength);
  return signals.slice(0, 3);
}

function getStrongSignals(answers, twinData) {
  const { twin_state } = twinData;
  const domains = twin_state?.iib?.domains || {};

  const strong = [];

  if ((domains.nutrition || 0) >= 65) {
    strong.push({
      domain: 'nutricion',
      score: domains.nutrition,
      message: 'tenés una buena base nutricional'
    });
  }

  if ((domains.activity || 0) >= 65) {
    strong.push({
      domain: 'actividad',
      score: domains.activity,
      message: 'tu nivel de actividad es sólido'
    });
  }

  if ((domains.sleep || 0) >= 65) {
    strong.push({
      domain: 'sueno',
      score: domains.sleep,
      message: 'tu sueño está en un nivel decente'
    });
  }

  if ((domains.mental || 0) >= 65) {
    strong.push({
      domain: 'estres',
      score: domains.mental,
      message: 'manejás bien tu estrés'
    });
  }

  if ((domains.digestion || 0) >= 65) {
    strong.push({
      domain: 'digestion',
      score: domains.digestion,
      message: 'tu digestión funciona bien'
    });
  }

  return strong.slice(0, 2);
}

export default function GemeloLetter({ twinData, answers }) {
  const letter = useMemo(() => {
    if (!twinData || !answers?.name) return null;

    const name = answers.name;
    const score = twinData?.twin_state?.iib?.score || 0;
    const level = twinData?.twin_state?.iib?.level || 'Moderado';
    const goal = answers.goal || 'bienestar general';
    const pattern = getProfilePattern(answers, twinData);
    const primary = getPrimarySignal(answers, twinData);
    const strong = getStrongSignals(answers, twinData);

    const patternText = {
      desbalanceado: 'tenés áreas muy fuertes y otras que necesitan atención prioritaria',
      solido: 'tenés una base bastante sólida y ahora toca afinar detalles',
      en_construccion: 'estás construyendo tu base y eso es exactamente lo que hay que hacer'
    };

    const primaryText = primary.length > 0
      ? primary.map(p => `${p.message}. ${p.impact}.`).join(' ')
      : 'no detecté señales urgentes, pero hay espacio para mejorar';

    const strongText = strong.length > 0
      ? strong.map(s => `${s.message} (${Math.round(s.score)})`).join('. ')
      : 'todavía no detecté áreas particularmente fuertes';

    const goalText = {
      lose: 'control de peso',
      gain: 'ganancia muscular',
      energy: 'energía y vitalidad',
      digestion: 'salud digestiva',
      stress: 'descanso y estrés',
      maintain: 'mantener y optimizar salud',
      general: 'bienestar general'
    }[goal] || 'bienestar general';

    return {
      greeting: `Hola, ${name}.`,
      body: `Acabo de terminar de analizar tu evaluación. Voy a ser directo: ${patternText[pattern]}. ${strongText}. ${primaryText}`,
      insight: `Tu objetivo es ${goalText}, y la lectura de tu perfil sugiere que el camino más rápido es empezar por lo que tiene más impacto y menos fricción.`,
      closing: `Voy a armarte un informe para que veas exactamente qué hacer. No es un resumen genérico: es tu lectura.`,
    };
  }, [twinData, answers]);

  if (!letter) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, #052e2b, #0f766e)',
        color: 'white',
        borderRadius: 20,
        padding: '28px 24px',
        marginBottom: 32,
        boxShadow: '0 18px 50px rgba(15,118,110,0.22)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle pattern overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 560 }}>
        <p style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          color: '#6ee7b7',
          marginBottom: 16,
        }}>
          Tu lectura personalizada
        </p>

        <p style={{
          fontSize: '1.15rem',
          fontWeight: 600,
          color: 'white',
          marginBottom: 16,
          lineHeight: 1.5,
        }}>
          {letter.greeting}
        </p>

        <p style={{
          fontSize: '0.95rem',
          color: '#d1fae5',
          lineHeight: 1.7,
          marginBottom: 14,
        }}>
          {letter.body}
        </p>

        <p style={{
          fontSize: '0.95rem',
          color: '#d1fae5',
          lineHeight: 1.7,
          marginBottom: 14,
        }}>
          {letter.insight}
        </p>

        <p style={{
          fontSize: '0.95rem',
          color: '#6ee7b7',
          fontStyle: 'italic',
          lineHeight: 1.7,
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          {letter.closing}
        </p>
      </div>
    </motion.section>
  );
}
