/**
 * Recommendation Validator
 *
 * Valida que las recomendaciones del PRE sean correctas antes de
 * enviarlas al Prompt Builder.
 *
 * Reglas de validación:
 * 1. El producto principal debe coincidir con su especialidad
 * 2. No se pueden recomendar productos en la lista de "a evitar"
 * 3. Los productos secundarios deben ser compatibles con el principal
 * 4. No puede haber duplicados
 */

import { getProductSpecialty, getProductsToAvoid, getSpecialtyComplementary } from './productPriority.js';

// ===================================================================
// FUNCIONES DE VALIDACIÓN
// ===================================================================

/**
 * Valida que un producto sea apropiado para una condición/objetivo
 */
export const validateProductForCondition = (productName, condition) => {
  if (!productName || !condition) {
    return { valido: false, razon: 'Faltan parámetros de validación' };
  }

  const normalizedCondition = condition.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const specialties = getProductSpecialty(productName);

  // Verificar si la condición está en la especialidad del producto
  const match = specialties.some(specialty => {
    const normalizedSpecialty = specialty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalizedCondition.includes(normalizedSpecialty) || normalizedSpecialty.includes(normalizedCondition);
  });

  if (!match) {
    return {
      valido: false,
      razon: `El producto ${productName} no tiene "${condition}" como especialidad principal. Sus especialidades son: ${specialties.join(', ')}`
    };
  }

  return { valido: true, razon: null };
};

/**
 * Valida que no se estén recomendando productos prohibidos juntos
 */
export const validateNoConflicts = (productoPrincipal, productosSecundarios = []) => {
  const productsToAvoid = getProductsToAvoid(productoPrincipal);

  for (const secundario of productosSecundarios) {
    if (productsToAvoid.includes(secundario.toUpperCase().trim())) {
      return {
        valido: false,
        razon: `El producto ${secundario} está en la lista de productos a evitar para ${productoPrincipal}`
      };
    }
  }

  return { valido: true, razon: null };
};

/**
 * Valida que no haya productos duplicados
 */
export const validateNoDuplicates = (productoPrincipal, productosSecundarios = [], productosComplementarios = []) => {
  const allProducts = [productoPrincipal, ...productosSecundarios, ...productosComplementarios];
  const uniqueProducts = new Set(allProducts.map(p => p.toUpperCase().trim()));

  if (uniqueProducts.size !== allProducts.length) {
    return {
      valido: false,
      razon: 'Hay productos duplicados en la recomendación'
    };
  }

  return { valido: true, razon: null };
};

/**
 * Validación completa de una recomendación
 */
export const validateRecommendation = (recommendation, userMessage) => {
  if (!recommendation) {
    return {
      valido: false,
      errores: ['No hay recomendación que validar'],
      advertencias: []
    };
  }

  const errores = [];
  const advertencias = [];
  const { productoPrincipal, productosSecundarios = [], productosComplementarios = [], productosAEVitar = [] } = recommendation;

  // 1. Validar que el producto principal existe
  if (!productoPrincipal) {
    errores.push('No se especificó un producto principal');
    return { valido: false, errores, advertencias };
  }

  // 2. Validar que el producto principal tiene especialidades definidas
  const specialties = getProductSpecialty(productoPrincipal);
  if (specialties.length === 0) {
    advertencias.push(`El producto ${productoPrincipal} no tiene especialidades definidas en el catálogo`);
  }

  // 3. Validar conflictos
  const conflictCheck = validateNoConflicts(productoPrincipal, productosSecundarios);
  if (!conflictCheck.valido) {
    errores.push(conflictCheck.razon);
  }

  // 4. Validar duplicados
  const duplicateCheck = validateNoDuplicates(productoPrincipal, productosSecundarios, productosComplementarios);
  if (!duplicateCheck.valido) {
    errores.push(duplicateCheck.razon);
  }

  // 5. Validar que los productos a evitar no estén en la recomendación
  for (const evitar of productosAEVitar) {
    if (productosSecundarios.includes(evitar) || productosComplementarios.includes(evitar)) {
      errores.push(`El producto ${evitar} está marcado como "a evitar" pero aparece en la recomendación`);
    }
  }

  return {
    valido: errores.length === 0,
    errores,
    advertencias
  };
};

/**
 * Genera un reporte de validación legible
 */
export const generateValidationReport = (recommendation, userMessage) => {
  const validation = validateRecommendation(recommendation, userMessage);

  if (validation.valido) {
    return `✅ Recomendación válida: ${recommendation.productoPrincipal}` +
      (recommendation.productosSecundarios?.length ? ` + ${recommendation.productosSecundarios.join(', ')}` : '') +
      (validation.advertencias.length ? `\n⚠️ Advertencias: ${validation.advertencias.join(', ')}` : '');
  }

  return `❌ Recomendación INVÁLIDA:\n${validation.errores.join('\n')}` +
    (validation.advertencias.length ? `\n⚠️ Advertencias: ${validation.advertencias.join('\n')}` : '');
};

export default {
  validateProductForCondition,
  validateNoConflicts,
  validateNoDuplicates,
  validateRecommendation,
  generateValidationReport
};
