import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, CheckmarkBadge01Icon, Mail01Icon, UserIcon, SmartPhone01Icon, Target01Icon, RulerIcon, WeightScaleIcon } from '@hugeicons/core-free-icons';
import { BRANDING } from '@/branding/branding';

const GOALS = [
  'Pérdida de Peso',
  'Aumento de Masa Muscular',
  'Más Energía',
  'Mejorar Digestión',
  'Bienestar General'
];

const WaitlistModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    weight: '',
    height: '',
    goal: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoalSelect = (goal) => {
    setFormData(prev => ({ ...prev, goal }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.goal) {
      setError('Por favor, completa los campos obligatorios (Nombre, Correo y Objetivo).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Hubo un problema al procesar tu solicitud.');
      }

      setIsSuccess(true);
      // Auto close after 5 seconds
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', weight: '', height: '', goal: '' });
      }, 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center px-4 sm:px-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={!isSubmitting ? onClose : undefined}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-surface-elevated rounded-3xl shadow-2xl overflow-hidden z-content"
          >
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-br from-emerald-600 to-emerald-800 overflow-hidden flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-no-repeat bg-center opacity-10 bg-[length:150%]" 
                style={{ backgroundImage: `url('${BRANDING.logos.isotype}')` }} 
              />
              <button 
                onClick={onClose}
                disabled={isSubmitting}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors disabled:opacity-50"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-white relative z-10 text-center px-6">
                Tu Plan Personalizado
              </h2>
            </div>

            {isSuccess ? (
              <div className="p-8 flex flex-col items-center justify-center text-center min-h-[350px]">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6"
                >
                  <HugeiconsIcon icon={CheckmarkBadge01Icon} className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Reserva Exitosa!</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Estás en la lista de espera premium. Te hemos notificado internamente y nos pondremos en contacto contigo pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
                  Déjanos tus datos para asegurar tu cupo premium (solo 100 disponibles) y diseñar tu plan perfecto.
                </p>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nombre Completo *</label>
                    <div className="relative">
                      <HugeiconsIcon icon={UserIcon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                        placeholder="Ej. María Pérez"
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico *</label>
                      <div className="relative">
                        <HugeiconsIcon icon={Mail01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">WhatsApp (Opcional)</label>
                      <div className="relative">
                        <HugeiconsIcon icon={SmartPhone01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                          placeholder="+56 9..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Goals */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <HugeiconsIcon icon={Target01Icon} className="inline w-4 h-4 mr-1 text-gray-400" />
                      Objetivo Principal *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {GOALS.map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => handleGoalSelect(g)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            formData.goal === g 
                              ? 'bg-emerald-600 text-white shadow-md' 
                              : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Physical Data Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Peso (kg)</label>
                      <div className="relative">
                        <HugeiconsIcon icon={WeightScaleIcon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="number"
                          step="0.1" 
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                          placeholder="Ej. 70.5"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Altura (cm)</label>
                      <div className="relative">
                        <HugeiconsIcon icon={RulerIcon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="number"
                          step="1" 
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                          placeholder="Ej. 175"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-70 disabled:scale-100 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Reservar mi cupo premium'
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WaitlistModal;
