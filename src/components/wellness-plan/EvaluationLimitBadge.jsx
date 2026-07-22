/**
 * EvaluationLimitBadge
 *
 * Muestra cuántas evaluaciones quedan y el mensaje correspondiente.
 * Se usa en el landing y en el dashboard.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { canEvaluate, getLimitReachedMessage } from '@/services/evaluationLimitService';
import { useAuth } from '@/context/AuthContext';

export default function EvaluationLimitBadge({ userId, compact = false }) {
  const { isAuthenticated } = useAuth();
  const [limitInfo, setLimitInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const info = await canEvaluate(userId);
      setLimitInfo(info);
      setLoading(false);
    })();
  }, [userId]);

  if (loading || !limitInfo) return null;
  if (limitInfo.canEvaluate && !compact) return null;

  const msg = getLimitReachedMessage(limitInfo.remaining);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontSize: '0.72rem',
          color: limitInfo.remaining === 0 ? '#ef4444' : '#6b7280',
          fontWeight: 700,
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        {msg.message}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: limitInfo.remaining === 0 ? '#fef2f2' : '#f0fdf4',
        border: `1px solid ${limitInfo.remaining === 0 ? '#fecaca' : '#bbf7d0'}`,
        borderRadius: 16,
        padding: '16px 20px',
        marginTop: 24,
      }}
    >
      <p style={{ margin: '0 0 8px', fontWeight: 800, fontSize: '0.9rem', color: limitInfo.remaining === 0 ? '#991b1b' : '#166534' }}>
        {msg.title}
      </p>
      <p style={{ margin: 0, fontSize: '0.84rem', color: limitInfo.remaining === 0 ? '#b91c1c' : '#15803d', lineHeight: 1.5 }}>
        {msg.message}
      </p>
    </motion.div>
  );
}
