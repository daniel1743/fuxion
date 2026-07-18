import { generateDigitalTwin } from '../src/lib/engine/DigitalTwinEngine.js';

// Personas de prueba extremas e intensivas
const testPersonas = [
  {
    name: "Persona 1: Sedentario y Estresado",
    answers: {
      weight: 105, height: 170, age: 45, gender: 'male',
      activityLevel: 'sedentary', exerciseMinutesPerWeek: 0, dailySteps: 2000, sedentaryHours: 12,
      sleepHours: 5, sleepQuality: 2, awakeningsPerNight: 4, screensBeforeBed: true,
      waterLiters: 0.5, fruitVegServings: 1, ultraprocessedPerWeek: 10,
      bristolType: 1, bowelFrequency: 'few_per_week', bloating: 'always',
      stressLevel: 9, moodLevel: 2, sunExposure: 'none',
      smokes: true, alcoholPerWeek: 8, coffeePerDay: 5, goal: 'lose'
    }
  },
  {
    name: "Persona 2: Atleta Deshidratado (Cuidado Falso Positivo)",
    answers: {
      weight: 80, height: 180, age: 28, gender: 'male',
      activityLevel: 'vigorous', exerciseMinutesPerWeek: 400, dailySteps: 15000, sedentaryHours: 4,
      sleepHours: 8, sleepQuality: 4, awakeningsPerNight: 0, screensBeforeBed: false,
      waterLiters: 1.0, // Muy bajo para atleta
      fruitVegServings: 5, ultraprocessedPerWeek: 1,
      bristolType: 4, bowelFrequency: 'daily', bloating: 'never',
      stressLevel: 3, moodLevel: 4, sunExposure: 'plenty',
      smokes: false, alcoholPerWeek: 2, coffeePerDay: 1, goal: 'gain'
    }
  },
  {
    name: "Persona 3: Promedio pero con mala digestión",
    answers: {
      weight: 65, height: 165, age: 35, gender: 'female',
      activityLevel: 'light', exerciseMinutesPerWeek: 90, dailySteps: 6000, sedentaryHours: 8,
      sleepHours: 7, sleepQuality: 3, awakeningsPerNight: 1, screensBeforeBed: true,
      waterLiters: 1.5, fruitVegServings: 2, ultraprocessedPerWeek: 3,
      bristolType: 6, // Diarrea leve
      bowelFrequency: 'multiple_daily', bloating: 'often',
      stressLevel: 6, moodLevel: 3, sunExposure: 'some',
      smokes: false, alcoholPerWeek: 4, coffeePerDay: 3, goal: 'maintain'
    }
  },
  {
    name: "Persona 4: Edge Case (Valores Extremos / Faltantes)",
    answers: {
      weight: 45, height: 150, age: 18, gender: 'female',
      activityLevel: 'extreme',
      // Faltan datos a propósito para ver cómo responde el motor
      goal: 'lose'
    }
  }
];

console.log("🚀 INICIANDO PRUEBAS INTENSIVAS DEL MOTOR (Fase 1)\\n");

testPersonas.forEach((persona, index) => {
  console.log(`=======================================================`);
  console.log(`🧪 TEST #${index + 1}: ${persona.name}`);
  console.log(`=======================================================`);
  
  try {
    const twin = generateDigitalTwin(persona.answers);
    const { biometrics, iib } = twin.twin_state;
    
    console.log(`[BIOMETRÍA]`);
    console.log(`  - IMC: ${biometrics.bmi} (${biometrics.bmiClass})`);
    console.log(`  - Calorías (TDEE): ${biometrics.tdee} kcal`);
    console.log(`  - Proteína sugerida: ${biometrics.protein} g`);
    console.log(`  - Agua sugerida: ${biometrics.waterL} L`);
    
    console.log(`\\n[PUNTAJE INTEGRAL]`);
    console.log(`  - IIB Score: ${iib.score}/100 (${iib.level})`);
    
    console.log(`\\n[RECOMENDACIONES PRIORIZADAS]`);
    twin.recommendations.forEach((rec, rIdx) => {
      console.log(`  ${rIdx + 1}. [${rec.domain.toUpperCase()}] ${rec.action} (Peso: ${rec.finalScore})`);
    });

    if (twin.recommendations.length === 0) {
      console.log(`  ⚠️ No se generaron recomendaciones.`);
    }

    console.log(`\\n✅ Test superado sin crasheos.\\n`);
  } catch (error) {
    console.error(`\\n❌ ERROR FATAL en Test #${index + 1}:`, error.message);
    console.error(error.stack);
  }
});
