/**
 * Patrones de sueño y cronotipos.
 */

export const SLEEP_PATTERNS = {
  // Cronotipos
  chronotypes: [
    {
      name: 'Lechuza nocturna',
      hours: { sleep: '00:00', wake: '08:00' },
      peak_energy: ['10:00-12:00', '16:00-18:00'],
      advice: 'Tu cuerpo rinde más en la tarde. No fuerces madrugar.',
    },
    {
      name: 'Gorrión matutino',
      hours: { sleep: '22:00', wake: '06:00' },
      peak_energy: ['06:00-08:00', '14:00-16:00'],
      advice: 'Aprovecha las mañanas para tareas difíciles.',
    },
    {
      name: 'Intermedio',
      hours: { sleep: '23:30', wake: '07:00' },
      peak_energy: ['08:00-10:00', '16:00-18:00'],
      advice: 'Rutina equilibrada. Mantén horarios consistentes.',
    },
  ],

  // Errores comunes de sueño
  common_errors: [
    {
      name: 'Pantallas antes de dormir',
      why: 'La luz azul suprime melatonina (hormona del sueño)',
      fix: 'Dejar pantallas 1 hora antes. Si no puedes, usar filtro de luz azul.',
    },
    {
      name: 'Café tarde',
      why: 'La cafeína permanece 6-8 horas en el cuerpo',
      fix: 'No tomar café después de las 2pm.',
    },
    {
      name: 'Horarios irregulares',
      why: 'Tu reloj biológico se desregula',
      fix: 'Dormir y levantarse a la misma hora, incluso fines de semana.',
    },
    {
      name: 'Comida pesada antes de dormir',
      why: 'Digerir interfiere con el sueño profundo',
      fix: 'Cenar 2-3 horas antes de acostarse.',
    },
    {
      name: 'Ejercicio intenso cerca de dormir',
      why: 'Aumenta cortisol y temperatura',
      fix: 'Ejercicio ligero o estiramientos si es de noche.',
    },
    {
      name: 'Ambiente inadecuado',
      why: 'Temperatura, ruido y luz afectan calidad',
      fix: 'Dormir a 18-20°C, en completa oscuridad y silencio.',
    },
  ],

  // Rutina de 30 minutos antes de dormir
  bedtime_routine: [
    { minute: '0-5', activity: 'Apagar pantallas', detail: 'Celular, TV, computadora' },
    { minute: '5-10', activity: 'Infusión relajante', detail: 'Camomila, valeriana o té de tilo' },
    { minute: '10-20', activity: 'Estiramientos suaves', detail: 'Yoga o estiramientos de cuello y espalda' },
    { minute: '20-25', activity: 'Respiración profunda', detail: 'Inhalar 4s, retener 4s, exhalar 6s (5 ciclos)' },
    { minute: '25-30', activity: 'Relajación progresiva', detail: 'Relajar músculos de pies a cabeza' },
  ],

  // Técnicas de relajación
  relaxation_techniques: [
    {
      name: 'Respiración 4-7-8',
      steps: 'Inhalar 4s, retener 7s, exhalar 8s',
      effect: 'Activa sistema parasimpático, reduce ansiedad',
    },
    {
      name: 'Escaneo corporal',
      steps: 'Relajar cada grupo muscular conscientemente',
      effect: 'Reduce tensión acumulada',
    },
    {
      name: 'Visualización guiada',
      steps: 'Imaginar un lugar tranquilo y seguro',
      effect: 'Reduce estrés y prepara para dormir',
    },
  ],
};

export default SLEEP_PATTERNS;
