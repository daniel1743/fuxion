import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, ArrowLeft01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { useWellnessTwin } from '@/context/WellnessTwinContext';

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

const stepGuidance = [
  {
    label: 'Base del informe',
    message: 'Esto es importante porque edad, sexo, peso y altura cambian los cálculos de energía, proteína e hidratación. Con esta base evitamos recomendaciones genéricas.',
  },
  {
    label: 'Lectura metabólica',
    message: 'Este bloque nos ayuda a estimar tu punto de partida corporal. No buscamos juzgar un número: buscamos entender qué palancas pueden darte más resultado.',
  },
  {
    label: 'Impacto semanal',
    message: 'Aquí vemos si tu cuerpo recibe suficiente movimiento real. Pequeñas caminatas pueden cambiar mucho el control de glucosa, energía y recuperación.',
  },
  {
    label: 'Recuperación',
    message: 'El sueño altera apetito, ánimo, concentración y respuesta al entrenamiento. Por eso el informe no trata el descanso como un dato secundario.',
  },
  {
    label: 'Combustible diario',
    message: 'Con agua, vegetales y ultraprocesados podemos detectar si tu plan necesita primero ordenar lo básico antes de recomendar estrategias más avanzadas.',
  },
  {
    label: 'Señales digestivas',
    message: 'Tu digestión entrega pistas sobre hidratación, fibra, estrés y microbiota. Esta sección ayuda a que el informe no sea solo peso y calorías.',
  },
  {
    label: 'Carga mental',
    message: 'Estrés y ánimo pueden explicar por qué un plan falla aunque la persona tenga motivación. Esta información ayuda a recomendar hábitos posibles, no perfectos.',
  },
  {
    label: 'Prioridad final',
    message: 'Este cierre define banderas preventivas y objetivo principal. Con esto ordenamos tus 3 microhábitos por impacto, seguridad y facilidad de cumplimiento.',
  },
];

export default function WellnessQuestionnaire({ onComplete }) {
  const { answers, setAnswers, currentStep, setCurrentStep, totalSteps, submitEvaluation } = useWellnessTwin();
  const [direction, setDirection] = useState(1);

  const getNextValidStep = (current, dir) => {
    let next = current + dir;
    
    // Lógica Adaptativa:
    // Aquí puedes definir saltos de pasos completos si el usuario no los necesita.
    // Ejemplo: Si no tiene problemas digestivos reportados previamente, saltar paso 5.
    // if (next === 5 && answers.ultraprocessedPerWeek === 0) return next + dir;
    
    return next;
  };

  const handleNext = () => {
    const nextStep = getNextValidStep(currentStep, 1);
    if (nextStep < totalSteps) {
      setDirection(1);
      setCurrentStep(nextStep);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    const prevStep = getNextValidStep(currentStep, -1);
    if (prevStep >= 0) {
      setDirection(-1);
      setCurrentStep(prevStep);
    }
  };

  const handleFinish = async () => {
    await submitEvaluation(answers);
    if (onComplete) {
      onComplete();
    }
  };

  const handleChange = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    if (currentStep === 0) {
      return answers.name && answers.age && answers.gender;
    }
    if (currentStep === 1) {
      return answers.weight && answers.height;
    }
    return true; // other steps optional or have defaults
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      padding: '32px',
      position: 'relative'
    },
    progressBarContainer: {
      width: '100%',
      height: '8px',
      background: '#e5e7eb',
      borderRadius: '4px',
      marginBottom: '24px',
      overflow: 'hidden'
    },
    progressBar: {
      height: '100%',
      background: '#22c55e',
      transition: 'width 0.3s ease'
    },
    stepTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '24px',
      color: '#111827'
    },
    label: {
      fontWeight: '600',
      marginBottom: '6px',
      display: 'block',
      color: '#374151'
    },
    input: {
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '10px 14px',
      width: '100%',
      fontSize: '16px',
      marginBottom: '16px',
      boxSizing: 'border-box',
      outline: 'none'
    },
    select: {
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '10px 14px',
      width: '100%',
      fontSize: '16px',
      marginBottom: '16px',
      background: 'white',
      boxSizing: 'border-box',
      outline: 'none'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '32px'
    },
    btnNext: {
      background: '#22c55e',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    btnPrev: {
      background: 'transparent',
      color: '#22c55e',
      border: '2px solid #22c55e',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    disabledBtn: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    radioGroup: {
      display: 'flex',
      gap: '12px',
      marginBottom: '16px',
      flexWrap: 'wrap'
    },
    radioLabel: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '8px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      transition: 'all 0.2s'
    },
    guidanceCard: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      background: 'linear-gradient(135deg, #f0fdf4, #ecfeff)',
      border: '1px solid #bbf7d0',
      borderRadius: '14px',
      padding: '14px 16px',
      marginBottom: '22px'
    },
    guidanceBadge: {
      width: '28px',
      height: '28px',
      borderRadius: '999px',
      background: '#22c55e',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      flexShrink: 0,
      fontSize: '14px'
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h2 style={styles.stepTitle}>Datos Personales</h2>
            <label style={styles.label}>Nombre completo</label>
            <input
              type="text"
              style={styles.input}
              value={answers.name || ''}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Tu nombre"
            />
            <label style={styles.label}>Edad</label>
            <input
              type="number"
              style={styles.input}
              value={answers.age || ''}
              onChange={e => handleChange('age', Number(e.target.value))}
              placeholder="Años"
            />
            <label style={styles.label}>Género</label>
            <select
              style={styles.select}
              value={answers.gender || ''}
              onChange={e => handleChange('gender', e.target.value)}
            >
              <option value="">Selecciona...</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 style={styles.stepTitle}>Antropometría</h2>
            <label style={styles.label}>Peso (kg)</label>
            <input
              type="number"
              style={styles.input}
              value={answers.weight || ''}
              onChange={e => handleChange('weight', Number(e.target.value))}
              placeholder="Ej. 70"
            />
            <label style={styles.label}>Altura (cm)</label>
            <input
              type="number"
              style={styles.input}
              value={answers.height || ''}
              onChange={e => handleChange('height', Number(e.target.value))}
              placeholder="Ej. 175"
            />
            <label style={styles.label}>Circunferencia de cintura (cm) - Opcional</label>
            <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>Mide a la altura del ombligo, sin apretar.</p>
            <input
              type="number"
              style={styles.input}
              value={answers.waistCm || ''}
              onChange={e => handleChange('waistCm', Number(e.target.value))}
              placeholder="Ej. 85"
            />
          </div>
        );
      case 2:
        return (
          <div>
            <h2 style={styles.stepTitle}>Actividad Física</h2>
            <label style={styles.label}>Nivel de actividad</label>
            <select
              style={styles.select}
              value={answers.activityLevel || ''}
              onChange={e => handleChange('activityLevel', e.target.value)}
            >
              <option value="">Selecciona...</option>
              <option value="sedentary">Sedentario (poco o nada de ejercicio)</option>
              <option value="light">Ligero (ejercicio 1-3 días a la semana)</option>
              <option value="moderate">Moderado (ejercicio 3-5 días a la semana)</option>
              <option value="vigorous">Vigoroso (ejercicio 6-7 días a la semana)</option>
              <option value="extreme">Extremo (ejercicio muy intenso, atleta)</option>
            </select>
            <label style={styles.label}>Minutos de ejercicio por semana</label>
            <input
              type="number"
              style={styles.input}
              value={answers.exerciseMinutesPerWeek || ''}
              onChange={e => handleChange('exerciseMinutesPerWeek', Number(e.target.value))}
            />
            <label style={styles.label}>Pasos diarios aproximados</label>
            <input
              type="number"
              style={styles.input}
              value={answers.dailySteps || ''}
              onChange={e => handleChange('dailySteps', Number(e.target.value))}
            />
            <label style={styles.label}>Horas sentado al día</label>
            <input
              type="number"
              style={styles.input}
              value={answers.sedentaryHours || ''}
              onChange={e => handleChange('sedentaryHours', Number(e.target.value))}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <h2 style={styles.stepTitle}>Sueño y Descanso</h2>
            <label style={styles.label}>Horas de sueño por noche</label>
            <input
              type="number"
              min="1"
              max="14"
              style={styles.input}
              value={answers.sleepHours || ''}
              onChange={e => handleChange('sleepHours', Number(e.target.value))}
            />
            <label style={styles.label}>Calidad del sueño</label>
            <div style={styles.radioGroup}>
              {[{v: 1, e: '😫', l: 'Muy mala'}, {v: 2, e: '😕', l: 'Mala'}, {v: 3, e: '😐', l: 'Regular'}, {v: 4, e: '🙂', l: 'Buena'}, {v: 5, e: '😴', l: 'Excelente'}].map(opt => (
                <motion.div 
                  key={opt.v}
                  onClick={() => handleChange('sleepQuality', opt.v)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{...styles.radioLabel, borderColor: answers.sleepQuality === opt.v ? '#22c55e' : '#d1d5db', background: answers.sleepQuality === opt.v ? '#f0fdf4' : 'transparent'}}
                >
                  <span style={{fontSize: '24px'}}>{opt.e}</span>
                  <span style={{fontSize: '12px'}}>{opt.l}</span>
                </motion.div>
              ))}
            </div>
            <label style={styles.label}>Despertares por noche</label>
            <input
              type="number"
              min="0"
              max="10"
              style={styles.input}
              value={answers.awakeningsPerNight ?? 0}
              onChange={e => handleChange('awakeningsPerNight', Number(e.target.value))}
            />
            <label style={styles.label}>Uso de pantallas antes de dormir</label>
            <select
              style={styles.select}
              value={answers.screensBeforeBed !== undefined ? String(answers.screensBeforeBed) : ''}
              onChange={e => handleChange('screensBeforeBed', e.target.value === 'true')}
            >
              <option value="">Selecciona...</option>
              <option value="true">Sí, siempre o casi siempre</option>
              <option value="false">No, las evito</option>
            </select>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 style={styles.stepTitle}>Nutrición e Hidratación</h2>
            <label style={styles.label}>Litros de agua al día</label>
            <input
              type="number"
              step="0.5"
              style={styles.input}
              value={answers.waterLiters || ''}
              onChange={e => handleChange('waterLiters', Number(e.target.value))}
            />
            <label style={styles.label}>Porciones de frutas/verduras al día</label>
            <input
              type="number"
              min="0"
              max="10"
              style={styles.input}
              value={answers.fruitVegServings ?? 0}
              onChange={e => handleChange('fruitVegServings', Number(e.target.value))}
            />
            <label style={styles.label}>Ultraprocesados por semana (comidas)</label>
            <input
              type="number"
              min="0"
              max="14"
              style={styles.input}
              value={answers.ultraprocessedPerWeek ?? 0}
              onChange={e => handleChange('ultraprocessedPerWeek', Number(e.target.value))}
            />
          </div>
        );
      case 5:
        return (
          <div>
            <h2 style={styles.stepTitle}>Salud Digestiva</h2>
            <label style={styles.label}>Tipo de heces (Escala de Bristol)</label>
            <select
              style={styles.select}
              value={answers.bristolType || ''}
              onChange={e => handleChange('bristolType', Number(e.target.value))}
            >
              <option value="">Selecciona un tipo...</option>
              <option value="1">Tipo 1 — Trozos duros separados</option>
              <option value="2">Tipo 2 — En forma de salchicha pero grumosa</option>
              <option value="3">Tipo 3 — Con forma de salchicha con grietas</option>
              <option value="4">Tipo 4 — Suave y lisa como una serpiente (ideal)</option>
              <option value="5">Tipo 5 — Trozos blandos con bordes definidos</option>
              <option value="6">Tipo 6 — Trozos blandos y pastosos</option>
              <option value="7">Tipo 7 — Completamente líquida</option>
            </select>
            <label style={styles.label}>Frecuencia intestinal</label>
            <select
              style={styles.select}
              value={answers.bowelFrequency || ''}
              onChange={e => handleChange('bowelFrequency', e.target.value)}
            >
              <option value="">Selecciona...</option>
              <option value="multiple_daily">Varias veces al día</option>
              <option value="daily">Una vez al día</option>
              <option value="few_per_week">Pocas veces por semana</option>
              <option value="less">Menos frecuente</option>
            </select>
            <label style={styles.label}>Sensación de hinchazón (inflamación)</label>
            <select
              style={styles.select}
              value={answers.bloating || ''}
              onChange={e => handleChange('bloating', e.target.value)}
            >
              <option value="">Selecciona...</option>
              <option value="never">Nunca</option>
              <option value="sometimes">A veces</option>
              <option value="often">Frecuentemente</option>
              <option value="always">Siempre</option>
            </select>
          </div>
        );
      case 6:
        return (
          <div>
            <h2 style={styles.stepTitle}>Salud Mental</h2>
            <label style={styles.label}>Nivel de estrés (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              style={{...styles.input, padding: '0', background: `linear-gradient(90deg, #22c55e, #eab308, #ef4444)`}}
              value={answers.stressLevel || 5}
              onChange={e => handleChange('stressLevel', Number(e.target.value))}
            />
            <div style={{textAlign: 'center', fontWeight: 'bold', marginBottom: '16px'}}>{answers.stressLevel || 5}</div>
            
            <label style={styles.label}>Estado de ánimo general</label>
            <select
              style={styles.select}
              value={answers.moodLevel || ''}
              onChange={e => handleChange('moodLevel', Number(e.target.value))}
            >
              <option value="">Selecciona...</option>
              <option value="1">Muy malo</option>
              <option value="2">Malo</option>
              <option value="3">Regular</option>
              <option value="4">Bueno</option>
              <option value="5">Excelente</option>
            </select>
            <label style={styles.label}>Exposición al sol diaria</label>
            <select
              style={styles.select}
              value={answers.sunExposure || ''}
              onChange={e => handleChange('sunExposure', e.target.value)}
            >
              <option value="">Selecciona...</option>
              <option value="none">Poca o nula</option>
              <option value="some">Moderada (10-30 min)</option>
              <option value="plenty">Abundante (más de 30 min)</option>
            </select>
          </div>
        );
      case 7:
        return (
          <div>
            <h2 style={styles.stepTitle}>Hábitos y Prevención</h2>
            <label style={styles.label}>¿Fumas?</label>
            <select
              style={styles.select}
              value={answers.smokes !== undefined ? String(answers.smokes) : ''}
              onChange={e => handleChange('smokes', e.target.value === 'true')}
            >
              <option value="">Selecciona...</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
            <label style={styles.label}>Copas de alcohol por semana</label>
            <input
              type="number"
              min="0"
              max="21"
              style={styles.input}
              value={answers.alcoholPerWeek ?? 0}
              onChange={e => handleChange('alcoholPerWeek', Number(e.target.value))}
            />
            <label style={styles.label}>Tazas de café al día</label>
            <input
              type="number"
              min="0"
              max="10"
              style={styles.input}
              value={answers.coffeePerDay ?? 0}
              onChange={e => handleChange('coffeePerDay', Number(e.target.value))}
            />
            <label style={styles.label}>Tu objetivo principal</label>
            <select
              style={styles.select}
              value={answers.goal || ''}
              onChange={e => handleChange('goal', e.target.value)}
            >
              <option value="">Selecciona...</option>
              <option value="lose">Perder peso</option>
              <option value="maintain">Mantener peso y mejorar salud</option>
              <option value="gain">Ganar masa muscular</option>
            </select>
            <label style={styles.label}>Condiciones médicas conocidas (Opcional)</label>
            <textarea
              style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
              value={answers.knownConditions || ''}
              onChange={e => handleChange('knownConditions', e.target.value)}
              placeholder="Ej. Hipertensión, asma..."
            />
          </div>
        );
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  const valid = isStepValid();
  const guidance = stepGuidance[currentStep];

  return (
    <div style={styles.container}>
      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBar, width: `${progressPercentage}%` }} />
      </div>
      
      <div style={{ position: 'relative', overflow: 'visible', minHeight: '400px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            style={{ width: '100%' }}
          >
            {guidance && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                style={styles.guidanceCard}
              >
                <div style={styles.guidanceBadge}>i</div>
                <div>
                  <p style={{
                    margin: '0 0 4px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: '#15803d',
                    textTransform: 'uppercase'
                  }}>
                    {guidance.label}
                  </p>
                  <p style={{ margin: 0, color: '#365314', fontSize: '0.88rem', lineHeight: 1.55 }}>
                    {guidance.message}
                  </p>
                </div>
              </motion.div>
            )}
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={styles.buttonContainer}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ ...styles.btnPrev, visibility: currentStep === 0 ? 'hidden' : 'visible' }}
          onClick={handlePrev}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} /> Anterior
        </motion.button>
        
        <motion.button
          whileHover={valid ? { scale: 1.05, boxShadow: '0 4px 12px rgba(34,197,94,0.3)' } : {}}
          whileTap={valid ? { scale: 0.95 } : {}}
          style={{ ...styles.btnNext, ...( !valid ? styles.disabledBtn : {} ) }}
          onClick={handleNext}
          disabled={!valid}
        >
          {currentStep === totalSteps - 1 ? (
            <>Finalizar Evaluación <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} /></>
          ) : (
            <>Siguiente <HugeiconsIcon icon={ArrowRight01Icon} size={20} /></>
          )}
        </motion.button>
      </div>
    </div>
  );
}
