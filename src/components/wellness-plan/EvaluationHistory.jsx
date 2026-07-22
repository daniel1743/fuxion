/**
 * EvaluationHistory
 *
 * Muestra el historial de evaluaciones del usuario con comparaciones
 * visuales entre la última y la anterior.
 *
 * Cada evaluación muestra:
 * - IIB anterior vs actual
 * - Cambios por dominio
 * - Fecha de evaluación
 * - Botón para descargar el informe de esa evaluación
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

function DomainChange({ label, current, previous }) {
  const diff = current - previous;
  const pct = ((diff / Math.max(previous, 1)) * 100).toFixed(1);
  const isPositive = diff > 0;
  const isNegative = diff < 0;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid #f3f4f6',
    }}>
      <span style={{ color: '#374151', fontSize: '0.84rem', fontWeight: 600 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#6b7280', fontSize: '0.78rem' }}>
          {previous} → {current}
        </span>
        <span style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: isPositive ? '#16a34a' : isNegative ? '#dc2626' : '#6b7280',
        }}>
          {isPositive ? `+${pct}%` : isNegative ? `${pct}%` : '—'}
        </span>
      </div>
    </div>
  );
}

function EvaluationCard({ evaluation, index }) {
  const { twin_state, raw_answers } = evaluation;
  const iib = twin_state?.iib || {};
  const domains = iib.domains || {};
  const date = new Date(evaluation.created_at).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        background: 'white',
        borderRadius: 16,
        padding: 20,
        border: '1px solid #e5e7eb',
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase' }}>
          Evaluación #{index + 1}
        </span>
        <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{date}</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        marginBottom: 12,
      }}>
        <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 10, textAlign: 'center' }}>
          <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>IIB</span>
          <strong style={{ display: 'block', color: '#166534', fontSize: '1.2rem', marginTop: 2 }}>
            {iib.score || '--'}
          </strong>
        </div>
        <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 10, textAlign: 'center' }}>
          <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Nivel</span>
          <strong style={{ display: 'block', color: '#166534', fontSize: '0.85rem', marginTop: 2 }}>
            {iib.level || '--'}
          </strong>
        </div>
        <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 10, textAlign: 'center' }}>
          <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Dominios</span>
          <strong style={{ display: 'block', color: '#166534', fontSize: '0.85rem', marginTop: 2 }}>
            {Object.keys(domains).length}
          </strong>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>
          Dominios
        </span>
        {Object.entries(domains).map(([key, score]) => (
          <div key={key} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '4px 0',
          }}>
            <span style={{ fontSize: '0.8rem', color: '#374151' }}>{key}</span>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{Math.round(score)}/100</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function EvaluationHistory() {
  const { user, isAuthenticated } = useAuth();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    (async () => {
      try {
        // Buscar evaluaciones por twin_id (usamos wellness_evaluations)
        const { data: twins } = await supabase
          .from('wellness_twins')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!twins?.[0]) {
          setEvaluations([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('wellness_evaluations')
          .select('*')
          .eq('twin_id', twins[0].id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setEvaluations(data || []);
      } catch (err) {
        console.error('Error loading evaluation history:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) return null;
  if (loading) return null;
  if (evaluations.length === 0) return null;

  const latest = evaluations[0];
  const previous = evaluations[1];

  const domains = latest?.twin_state?.iib?.domains || {};
  const prevDomains = previous?.twin_state?.iib?.domains || {};
  const hasComparison = Object.keys(prevDomains).length > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.8, duration: 0.5 }}
      style={{
        background: 'white',
        borderRadius: 20,
        padding: '24px 22px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        marginBottom: 24,
        border: '1px solid #e2e8f0',
      }}
    >
      <h3 style={{
        margin: '0 0 16px',
        color: '#0f172a',
        fontSize: '1rem',
        fontWeight: 800,
      }}>
        Historial de evaluaciones
      </h3>

      {hasComparison && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <p style={{
            margin: '0 0 10px',
            color: '#166534',
            fontSize: '0.84rem',
            fontWeight: 700,
          }}>
            Comparación con tu última evaluación
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            marginBottom: 12,
          }}>
            <div style={{ background: 'white', borderRadius: 10, padding: 10, textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>IIB</span>
              <strong style={{ display: 'block', color: '#166534', fontSize: '1.2rem', marginTop: 2 }}>
                {latest.twin_state?.iib?.score}
              </strong>
            </div>
            <div style={{ background: 'white', borderRadius: 10, padding: 10, textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Anterior</span>
              <strong style={{ display: 'block', color: '#166534', fontSize: '1.2rem', marginTop: 2 }}>
                {previous.twin_state?.iib?.score}
              </strong>
            </div>
            <div style={{ background: 'white', borderRadius: 10, padding: 10, textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Cambio</span>
              <strong style={{ display: 'block', fontSize: '1.2rem', marginTop: 2, color:
                (latest.twin_state?.iib?.score || 0) - (previous.twin_state?.iib?.score || 0) >= 0 ? '#16a34a' : '#dc2626'
              }}>
                {((latest.twin_state?.iib?.score || 0) - (previous.twin_state?.iib?.score || 0)) >= 0 ? '+' : ''}
                {(latest.twin_state?.iib?.score || 0) - (previous.twin_state?.iib?.score || 0)}
              </strong>
            </div>
          </div>

          <div>
            {Object.entries(domains).map(([key]) => {
              const curr = domains[key] || 0;
              const prev = prevDomains[key] || 0;
              return <DomainChange key={key} label={key} current={curr} previous={prev} />;
            })}
          </div>
        </motion.div>
      )}

      <div>
        {evaluations.map((evalItem, index) => (
          <EvaluationCard key={evalItem.id} evaluation={evalItem} index={index} />
        ))}
      </div>

      <p style={{
        fontSize: '0.72rem',
        color: '#9ca3af',
        marginTop: 12,
        textAlign: 'center',
      }}>
        Máximo 2 evaluaciones por mes calendario
      </p>
    </motion.section>
  );
}
