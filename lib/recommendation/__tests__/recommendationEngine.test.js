/**
 * Pruebas Automáticas del Product Recommendation Engine (PRE)
 *
 * Verifica que las recomendaciones del PRE sean correctas según
 * las reglas de negocio definidas.
 *
 * Ejecutar con: node lib/recommendation/__tests__/recommendationEngine.test.js
 */

import { generateRecommendation, processRecommendation } from '../recommendationEngine.js';
import { evaluateRules, getBestRecommendation } from '../recommendationRules.js';
import { validateRecommendation } from '../recommendationValidator.js';

// ===================================================================
// CASOS DE PRUEBA
// ===================================================================
const TEST_CASES = [
  // Caso 1: Estreñimiento → PRUNEX 1
  {
    name: 'Caso 1: Estreñimiento',
    input: 'Tengo estreñimiento',
    expected: 'PRUNEX 1',
    description: 'El usuario tiene estreñimiento'
  },
  // Caso 2: Gases → PRUNEX 1
  {
    name: 'Caso 2: Gases',
    input: 'Tengo gases',
    expected: 'PRUNEX 1',
    description: 'El usuario tiene gases'
  },
  // Caso 3: Heces compactadas → PRUNEX 1
  {
    name: 'Caso 3: Heces compactadas',
    input: 'Tengo heces compactadas',
    expected: 'PRUNEX 1',
    description: 'El usuario tiene heces compactadas'
  },
  // Caso 4: Hígado graso → REXET
  {
    name: 'Caso 4: Hígado graso',
    input: 'Tengo hígado graso',
    expected: 'REXET',
    description: 'El usuario tiene hígado graso'
  },
  // Caso 5: Microbiota → FLORA LIV
  {
    name: 'Caso 5: Microbiota',
    input: 'Quiero cuidar mi microbiota',
    expected: 'FLORA LIV',
    description: 'El usuario quiere cuidar su microbiota'
  },
  // Caso 6: Bajar de peso → THERMO T3
  {
    name: 'Caso 6: Bajar de peso',
    input: 'Quiero bajar de peso',
    expected: 'THERMO T3',
    description: 'El usuario quiere bajar de peso'
  },
  // Caso 7: Carbohidratos → NOCARB-T
  {
    name: 'Caso 7: Carbohidratos',
    input: 'Consumo muchos carbohidratos',
    expected: 'NOCARB-T',
    description: 'El usuario consume muchos carbohidratos'
  },
  // Caso 8: Cansancio → VITAENERGÍA
  {
    name: 'Caso 8: Cansancio',
    input: 'Estoy muy cansado',
    expected: 'VITAENERGÍA',
    description: 'El usuario está cansado'
  },
  // Caso 9: Antioxidantes → VITA XTRA T+
  {
    name: 'Caso 9: Antioxidantes',
    input: 'Necesito antioxidantes',
    expected: 'VITA XTRA T+',
    description: 'El usuario necesita antioxidantes'
  },
  // Caso 10: Gases + Hígado graso → PRUNEX 1 (combinación)
  {
    name: 'Caso 10: Gases + Hígado graso',
    input: 'Tengo gases y también hígado graso',
    expected: 'PRUNEX 1',
    description: 'El usuario tiene gases e hígado graso (combinación)'
  },
  // Caso 11: Colesterol → ALPHA BALANCE
  {
    name: 'Caso 11: Colesterol',
    input: 'Tengo el colesterol alto',
    expected: 'ALPHA BALANCE',
    description: 'El usuario tiene colesterol alto'
  },
  // Caso 12: Gastritis → FLORA LIV
  {
    name: 'Caso 12: Gastritis',
    input: 'Tengo gastritis',
    expected: 'FLORA LIV',
    description: 'El usuario tiene gastritis'
  },
  // Caso 13: Concentración → ON
  {
    name: 'Caso 13: Concentración',
    input: 'Necesito concentrarme mejor',
    expected: 'ON',
    description: 'El usuario necesita concentración'
  },
  // Caso 14: Estrés → NO STRESS
  {
    name: 'Caso 14: Estrés',
    input: 'Estoy muy estresado',
    expected: 'NO STRESS',
    description: 'El usuario está estresado'
  },
  // Caso 15: Articulaciones → GOLDEN FLX
  {
    name: 'Caso 15: Articulaciones',
    input: 'Me duelen las articulaciones',
    expected: 'GOLDEN FLX',
    description: 'El usuario tiene dolor articular'
  },
  // Caso 16: Piel → BEAUTY-IN
  {
    name: 'Caso 16: Piel',
    input: 'Quiero cuidar mi piel',
    expected: 'BEAUTY-IN',
    description: 'El usuario quiere cuidar su piel'
  },
  // Caso 17: Defensas → VERA+
  {
    name: 'Caso 17: Defensas',
    input: 'Quiero subir mis defensas',
    expected: 'VERA+',
    description: 'El usuario quiere subir sus defensas'
  },
  // Caso 18: Digestión lenta → PRUNEX 1
  {
    name: 'Caso 18: Digestión lenta',
    input: 'Tengo digestión lenta',
    expected: 'PRUNEX 1',
    description: 'El usuario tiene digestión lenta'
  },
  // Caso 19: Hinchazón → PRUNEX 1
  {
    name: 'Caso 19: Hinchazón',
    input: 'Me siento hinchado después de comer',
    expected: 'PRUNEX 1',
    description: 'El usuario tiene hinchazón abdominal'
  },
  // Caso 20: Detox hepático → REXET
  {
    name: 'Caso 20: Detox hepático',
    input: 'Quiero hacer un detox hepático',
    expected: 'REXET',
    description: 'El usuario quiere detox hepático'
  }
];

// ===================================================================
// EJECUTOR DE PRUEBAS
// ===================================================================
let passed = 0;
let failed = 0;
const failures = [];

console.log('='.repeat(70));
console.log('🧪 PRUEBAS DEL PRODUCT RECOMMENDATION ENGINE (PRE)');
console.log('='.repeat(70));
console.log('');

for (const testCase of TEST_CASES) {
  process.stdout.write(`  ${testCase.name}: `);

  try {
    // Ejecutar el PRE
    const recommendation = generateRecommendation(testCase.input);

    if (!recommendation) {
      console.log('❌');
      failed++;
      failures.push({
        ...testCase,
        error: `No se generó recomendación. Esperado: ${testCase.expected}`
      });
      continue;
    }

    // Validar la recomendación
    const validation = validateRecommendation(recommendation, testCase.input);

    // Verificar que el producto principal sea el esperado
    if (recommendation.productoPrincipal === testCase.expected) {
      if (validation.valido) {
        console.log('✅');
        passed++;
      } else {
        console.log('⚠️ (recomendación correcta pero validación con advertencias)');
        passed++;
        console.log(`     Advertencias: ${validation.advertencias.join(', ')}`);
      }
    } else {
      console.log('❌');
      failed++;
      failures.push({
        ...testCase,
        error: `Esperado: ${testCase.expected}, Recibido: ${recommendation.productoPrincipal}`,
        received: recommendation.productoPrincipal
      });
    }

    // Mostrar detalles de la recomendación
    if (recommendation.productosSecundarios?.length > 0) {
      console.log(`     Secundarios: ${recommendation.productosSecundarios.join(', ')}`);
    }
    if (recommendation.productosComplementarios?.length > 0) {
      console.log(`     Complementarios: ${recommendation.productosComplementarios.join(', ')}`);
    }
    if (recommendation.productosAEVitar?.length > 0) {
      console.log(`     Evitar: ${recommendation.productosAEVitar.join(', ')}`);
    }

  } catch (error) {
    console.log('❌ (error)');
    failed++;
    failures.push({
      ...testCase,
      error: `Error: ${error.message}`
    });
  }
}

// ===================================================================
// REPORTE FINAL
// ===================================================================
console.log('');
console.log('='.repeat(70));
console.log('📊 REPORTE FINAL');
console.log('='.repeat(70));
console.log(`  Total: ${TEST_CASES.length}`);
console.log(`  ✅ Pasadas: ${passed}`);
console.log(`  ❌ Falladas: ${failed}`);
console.log(`  🎯 Precisión: ${((passed / TEST_CASES.length) * 100).toFixed(1)}%`);
console.log('');

if (failures.length > 0) {
  console.log('❌ CASOS FALLIDOS:');
  console.log('-'.repeat(70));
  for (const failure of failures) {
    console.log(`  ${failure.name}`);
    console.log(`    Input: "${failure.input}"`);
    console.log(`    Esperado: ${failure.expected}`);
    console.log(`    Error: ${failure.error}`);
    console.log('');
  }
}

// ===================================================================
// VALIDACIÓN ADICIONAL: Verificar que NO haya recomendaciones incorrectas
// ===================================================================
console.log('='.repeat(70));
console.log('🔍 VALIDACIÓN DE ESPECIALIDADES');
console.log('='.repeat(70));

// Verificar que VITA XTRA T+ nunca sea recomendado para hígado graso
const higadoGrasoTest = generateRecommendation('Tengo hígado graso');
if (higadoGrasoTest?.productosAEVitar?.includes('VITA XTRA T+')) {
  console.log('✅ VITA XTRA T+ está correctamente marcado como "a evitar" para hígado graso');
} else {
  console.log('⚠️ VITA XTRA T+ no está marcado como "a evitar" para hígado graso');
}

// Verificar que REXET sea el principal para hígado graso
if (higadoGrasoTest?.productoPrincipal === 'REXET') {
  console.log('✅ REXET es correctamente el producto principal para hígado graso');
} else {
  console.log(`❌ REXET debería ser el principal para hígado graso, pero se obtuvo: ${higadoGrasoTest?.productoPrincipal}`);
}

console.log('');
console.log('='.repeat(70));

// Salir con código de error si hay fallos
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 TODAS LAS PRUEBAS PASARON');
  process.exit(0);
}
