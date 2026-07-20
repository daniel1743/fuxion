#!/usr/bin/env node
/**
 * Pulido editorial de artículos wellness_articles
 *
 * - Mejora títulos con títulos editoriales
 * - Genera introducción atractiva
 * - Mejora estructura del contenido
 * - Guarda mejoras en Supabase
 *
 * Uso: node scripts/polish-articles.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://iyloouessyxfvwvzdboc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bG9vdWVzc3l4ZnZ3dnpkYm9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTYzNzI3NSwiZXhwIjoyMDk3MjEzMjc1fQ.-YySdwqu5kPADvC_HFx5TtaFRLDBsj0QHMdPfn_isF4';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Mapeo de títulos editoriales ───────────────────────────────

const TITLE_MAP = {
  'Terapia farmacológica (Agonistas GLP-1/GIP)': 'GLP-1 y GIP: La nueva revolución en el control de peso',
  'Déficit calórico individualizado (500-750 kcal/día)': 'Déficit calórico: cómo calcular tu peso ideal sin pasar hambre',
  'Aumento de Proteína (1.2-1.5 g/kg/día)': 'Proteína: el nutriente que transforma tu composición corporal',
  'Entrenamiento de Fuerza (2-3 días/sem)': 'Fuerza: por qué levantar pesas es más efectivo que cardio para bajar de peso',
  'Sustitución guiada por Ley de Etiquetados': 'Ley 20.606: cómo leer etiquetas y evitar ultraprocesados',
  'Adopción de la Dieta MIND': 'Dieta MIND: la combinación perfecta para proteger tu cerebro y tu corazón',
  'Eliminación de Bebidas Azucaradas': 'El peligro oculto de las bebidas azucaradas (y qué tomar en su lugar)',
  'Fibra Viscosa (>30g/día)': 'Fibra soluble: tu arma secreta para controlar glucosa y saciedad',
  'Monitoreo regular de peso': '¿Cuántas veces pesarse? Lo que dice la ciencia',
  'Restricción del Tiempo en Cama (Optimizar Sueño)': 'El vínculo oculto entre sueño y peso',
  'Reducción de Alcohol (<1 trago/día)': 'Alcohol y metabolismo: cuánto debes realmente beber',
  'Alimentación Restringida en el Tiempo (Ayuno 12-14h)': 'Ayuno intermitente: lo que la ciencia confirma y lo que exagera',
  'Control del Entorno (Despensa)': 'Tu cocina como herramienta de control de peso',
  'Caminata corta post-comida (10 min)': 'El hábito más simple para estabilizar tu glucosa',
  'Establecimiento de Metas SMART': 'Metas de peso que sí funcionan: el método SMART',
  'Orden de macronutrientes al comer': 'El orden de los alimentos importa más de lo que crees',
  'Reemplazo de granos refinados por enteros': 'Granos enteros vs refinados: la diferencia que cambia tu metabolismo',
  'Entrenamiento a Intervalos (HIIT)': 'HIIT: 15 minutos que equivalen a una hora de cardio',
  'Masticación lenta (Mindful Eating)': 'Mindful eating: comer lento para comer menos',
  'Reducción de sodio por especias': 'Menos sal, más sabor: la alternativa que protege tu presión arterial',
  'Monitoreo Continuo de Glucosa (MCG)': 'Sensores de glucosa: ¿realmente valen la pena para personas sanas?',
  'Identificación de gatillos con Diario': 'Diario emocional: cómo identificar por qué comes más de lo que deberías',
  'Hidratación Precarga (Agua antes de comer)': 'Un vaso de agua antes de cada comida: el hack más simple para tu peso',
  'Tratamiento de Apnea Obstructiva del Sueño': 'Apnea del sueño: por qué roncar afecta tu peso y tu salud',
  'Uso de platos de menor diámetro': 'Psicología del plato: cómo engañar a tu cerebro al comer',
  'Aumento de consumo de pescado azul (Omega-3)': 'Pescado azul: omega-3 que protege tu corazón y tu cerebro',
  'Preparación semanal de comidas (Meal Prep)': 'Meal prep: cocina el domingo, come sano toda la semana',
  'Gestión de la flora intestinal': 'Microbiota: cómo las bacterias de tu intestino controlan tu peso',
  'Pausas de desconexión digital (Comida sin pantallas)': 'Comer sin pantallas: por qué tu cerebro no registra la comida distraído',
  'Rutinas activas de transporte': 'Metro + caminata: cómo transformar tu trayecto diario en ejercicio',
  'Crononutrición (Ingesta calórica matutina/diurna)': 'Crononutrición: por qué lo que comes y cuándo lo comes importa',
  'Restricción absoluta de grasas trans': 'Grasas trans: lo que nadie te dice sobre margarinas y fritos industriales',
  'Apoyo Social (Soporte Comunitario)': 'Comunidad y peso: por qué el soporte social determina tu éxito',
  'Incorporación de grasas monoinsaturadas (MUFAs)': 'Grasas buenas: aceite de oliva, palta y frutos secos',
  'Entrenamiento en Flexibilidad Psicológica (ACT)': 'Cravings: cómo observar un antojo sin actuar sobre él',
  'Uso limitado de edulcorantes no nutritivos': 'Edulcorantes: ¿aliados o enemigos de tu peso?',
  'Sustitución de lácteos enteros por bajos en grasa': 'Lácteos enteros vs descremados: ¿qué realmente importa?',
  'Diagnóstico de Hipotiroidismo': 'Hipotiroidismo silencioso: por qué tu peso no baja y podría ser tu tiroides',
  'Optimización de Vitamina D': 'Vitamina D: el nutriente que la mayoría no recibe y que afecta tu peso',
  'Reestructuración de la cena (baja en sodio y carbohidratos)': 'Cena ligera: el secreto para dormir mejor y despertar menos hinchado',
  'Planificación de recompensas no alimentarias': 'Recompensas inteligentes: cómo celebrar sin sabotear tu dieta',
  'Evaluaciones antropométricas regulares (Circunferencia de cintura)': 'Cintura vs balanza: por qué la circunferencia de cintura importa más',
  'Manejo de medicación hipolipemiante (Estatinas)': 'Estatinas: cuándo son necesarias y cómo manejarlas',
  'Tratamiento intensivo de Hipertensión (IECA/ARA-II)': 'Hipertensión: por qué los IECA y ARA-II protegen tu riñón y corazón',
  'Incorporación de ejercicios isométricos': 'Isométricos: ejercicios de fuerza sin impacto articular',
  'Polietilenglicol (PEG 3350)': 'PEG 3350: el tratamiento más seguro y efectivo para el estreñimiento crónico',
  'Suplementación con Psyllium': 'Psyllium: la fibra con más evidencia clínica para tu intestino',
  'Postura de Defecación (Squatting)': 'La postura de defecación: por qué un taburete cambia todo',
  'Linaclotida o Plecanatida': 'Linaclotida y plecanatida: los medicamentos de nueva generación para el estreñimiento',
  'Entrenamiento del Reflejo Gastrocólico': 'Reflejo gastrocólico: cómo tu cuerpo te avisa cuándo evacuar',
  'Hidratación constante (Orina clara)': 'Hidratación y estreñimiento: por qué el color de tu orina importa',
  'Terapia de Biorretroalimentación (Biofeedback)': 'Biofeedback: el tratamiento invisible para el estreñimiento pelvico',
  'Consumo de 2 Kiwis diarios': 'Kiwi: el fruto que la ciencia confirma contra el estreñimiento',
  'Prucaloprida': 'Prucaloprida: la solución médica para el intestino perezoso',
  'Ciruelas Pasas (Prunes)': 'Ciruelas pasas: el laxante natural con evidencia clínica',
  'Óxido de Magnesio / Leche Magnesia': 'Magnesio: el mineral que relaja tu intestino y tu cuerpo',
  'Actividad Física Aeróbica (Caminar/Trotar)': 'Caminar después de comer: el ejercicio más subestimado para tu digestión',
  'Masaje abdominal secuencial (Trayecto colónico)': 'Masaje abdominal: la técnica manual que acelera tu tránsito',
  'Bisacodilo o Picosulfato (Venta libre)': 'Laxantes estimulantes: cuándo usarlos y cuándo no',
  'Suspensión de medicación constipante': 'Medicamentos que te estreñan: revisa tu receta',
  'Lubiprostona': 'Lubiprostona: el nuevo tratamiento para el estreñimiento refractario',
  'Dieta baja en FODMAPs (Fase de eliminación)': 'Dieta FODMAP: cómo reducir gases y distensión abdominal',
  'Semillas de lino/linaza molidas': 'Linaza molida: la fibra natural que lubrica tu intestino',
  'Supositorios de Glicerina / Enemas de microenema': 'Supositorios de glicerina: cuándo y cómo usarlos',
  'Cese de esfuerzo defecatorio extremo (Straining)': 'No pujes: por qué forzar al evacuar te hace daño',
  'Lactulosa (Jarabe)': 'Lactulosa: el jarabe que hidrata tu intestino de forma natural',
  'Bebida caliente en ayunas (Ej. Té o Café)': 'Café en ayunas: el estimulante natural de tu colon',
  'Probióticos específicos (B. lactis)': 'Probióticos con evidencia: cepas que realmente funcionan para tu intestino',
  'Manometría anorrectal y test expulsivo': 'Manometría anorrectal: cómo diagnosticar el origen de tu estreñimiento',
  'Limitar ingesta de calcio suplementario': 'Calcio suplementario: cómo afecta tu intestino',
  'Reducción de Alimentos Ultraprocesados': 'Ultraprocesados: el enemigo silencioso de tu microbiota',
  'Masticación completa de los alimentos': 'Masticar bien: la base olvidada de una buena digestión',
  'Aceite de oliva en ayunas (1 cdta)': 'Aceite de oliva en ayunas: ¿truco de abuela o ciencia?',
  'Senósidos (Senna)': 'Senósidos (senna): el laxante natural que no debes abusar',
  'Descarte de enfermedades sistémicas': 'Estreñimiento que no cede: cuándo buscar un diagnóstico',
  'Iniciar el día con 500ml de agua': '500ml al despertar: la primera regla de hidratación',
  'Monitoreo visual de la orina': 'Color de orina: el indicador más simple de tu hidratación',
  'Reemplazar jugos y bebidas': 'Jugos vs agua: por qué reemplazar bebidas azucaradas es crucial',
  'Hidratación intra y post entrenamiento': 'Hidratarse durante el ejercicio: cuánta agua realmente necesitas',
  'Incrementar sopas o verduras altas en H2O': 'Sopas y verduras: la fuente oculta de tu hidratación',
  'Infusionar el agua natural': 'Agua infusionada: la forma más fácil de beber más agua',
  '"Nudging" (Botella siempre a la vista)': 'El poder del nudging: tener agua a la vista te hace beber más',
  'Dilución de bebidas (Cordials)': 'Cordials: cómo reducir el dulzor gradualmente sin sufrir',
  'Pares conductuales (Agua en cada comida)': 'Agua en cada comida: el hábito que transforma tu hidratación',
  'Uso de filtros domiciliarios': 'Filtro de agua: mejorar el sabor para beber más',
  'Hidratación proactiva en lugar de reactiva': 'Hidratación proactiva: no esperes a tener sed para beber',
  'Consumo de electrolitos en sudor extremo': 'Electrolitos: cuándo tu cuerpo realmente los necesita',
  'Regla compensatoria (Café/Té/Alcohol)': 'La regla 1:1: por cada café, un vaso de agua',
  'Agua Mineral carbonatada (Con gas)': 'Agua mineral con gas: la alternativa refrescante sin azúcar',
  'Monitoreo clínico de fármacos depletivos': 'Medicamentos que deshidratan: conoce tu tratamiento',
  'Apps o Smart Bottles': 'Smart bottles y apps: tecnología para mejorar tu hidratación',
  'Leche magra o alternativas lácteas': 'Leche: el líquido con electrolitos naturales',
  'Vasos isotérmicos (Temperatura)': 'Agua fría vs tibia: qué temperatura te ayuda a beber más',
  'Estratificación vespertina': 'Estratificación vespertina: por qué no debes beber mucha agua en la noche',
  'Aumentar líquidos ante fiebre o infección': 'Fiebre e hidratación: por qué necesitas más líquido cuando estás enfermo',
  'Terapia Cognitivo Conductual (CBT) para obesidad': 'CBT para obesidad: cómo cambiar tus patrones de alimentación',
  'Sustitución de fármacos obesogénicos': 'Fármacos que engordan: qué medicamentos afectan tu peso',
  'Incorporación de grasas monoinsaturadas (MUFAs)': 'MUFAs: grasas saludables que aumentan tu saciedad',
  'Polietilenglicol (PEG 3350)': 'PEG 3350: el tratamiento más seguro y efectivo para el estreñimiento crónico',
  'Suplementación con Psyllium': 'Psyllium: la fibra con más evidencia clínica para tu intestino',
  'Postura de Defecación (Squatting)': 'La postura de defecación: por qué un taburete cambia todo',
  'Linaclotida o Plecanatida': 'Linaclotida y plecanatida: los medicamentos de nueva generación para el estreñimiento',
  'Entrenamiento del Reflejo Gastrocólico': 'Reflejo gastrocólico: cómo tu cuerpo te avisa cuándo evacuar',
  'Hidratación constante (Orina clara)': 'Hidratación y estreñimiento: por qué el color de tu orina importa',
  'Terapia de Biorretroalimentación (Biofeedback)': 'Biofeedback: el tratamiento invisible para el estreñimiento pelvico',
  'Consumo de 2 Kiwis diarios': 'Kiwi: el fruto que la ciencia confirma contra el estreñimiento',
  'Prucaloprida': 'Prucaloprida: la solución médica para el intestino perezoso',
  'Ciruelas Pasas (Prunes)': 'Ciruelas pasas: el laxante natural con evidencia clínica',
  'Óxido de Magnesio / Leche Magnesia': 'Magnesio: el mineral que relaja tu intestino y tu cuerpo',
  'Actividad Física Aeróbica (Caminar/Trotar)': 'Caminar después de comer: el ejercicio más subestimado para tu digestión',
  'Masaje abdominal secuencial (Trayecto colónico)': 'Masaje abdominal: la técnica manual que acelera tu tránsito',
  'Bisacodilo o Picosulfato (Venta libre)': 'Laxantes estimulantes: cuándo usarlos y cuándo no',
  'Suspensión de medicación constipante': 'Medicamentos que te estreñan: revisa tu receta',
  'Lubiprostona': 'Lubiprostona: el nuevo tratamiento para el estreñimiento refractario',
  'Dieta baja en FODMAPs (Fase de eliminación)': 'Dieta FODMAP: cómo reducir gases y distensión abdominal',
  'Semillas de lino/linaza molidas': 'Linaza molida: la fibra natural que lubrica tu intestino',
  'Supositorios de Glicerina / Enemas de microenema': 'Supositorios de glicerina: cuándo y cómo usarlos',
  'Cese de esfuerzo defecatorio extremo (Straining)': 'No pujes: por qué forzar al evacuar te hace daño',
  'Lactulosa (Jarabe)': 'Lactulosa: el jarabe que hidrata tu intestino de forma natural',
  'Bebida caliente en ayunas (Ej. Té o Café)': 'Café en ayunas: el estimulante natural de tu colon',
  'Probióticos específicos (B. lactis)': 'Probióticos con evidencia: cepas que realmente funcionan para tu intestino',
  'Manometría anorrectal y test expulsivo': 'Manometría anorrectal: cómo diagnosticar el origen de tu estreñimiento',
  'Limitar ingesta de calcio suplementario': 'Calcio suplementario: cómo afecta tu intestino',
  'Reducción de Alimentos Ultraprocesados': 'Ultraprocesados: el enemigo silencioso de tu microbiota',
  'Masticación completa de los alimentos': 'Masticar bien: la base olvidada de una buena digestión',
  'Aceite de oliva en ayunas (1 cdta)': 'Aceite de oliva en ayunas: ¿truco de abuela o ciencia?',
  'Senósidos (Senna)': 'Senósidos (senna): el laxante natural que no debes abusar',
  'Descarte de enfermedades sistémicas': 'Estreñimiento que no cede: cuándo buscar un diagnóstico',
  'Iniciar el día con 500ml de agua': '500ml al despertar: la primera regla de hidratación',
  'Monitoreo visual de la orina': 'Color de orina: el indicador más simple de tu hidratación',
  'Reemplazar jugos y bebidas': 'Jugos vs agua: por qué reemplazar bebidas azucaradas es crucial',
  'Hidratación intra y post entrenamiento': 'Hidratarse durante el ejercicio: cuánta agua realmente necesitas',
  'Incrementar sopas o verduras altas en H2O': 'Sopas y verduras: la fuente oculta de tu hidratación',
  'Infusionar el agua natural': 'Agua infusionada: la forma más fácil de beber más agua',
  '"Nudging" (Botella siempre a la vista)': 'El poder del nudging: tener agua a la vista te hace beber más',
  'Dilución de bebidas (Cordials)': 'Cordials: cómo reducir el dulzor gradualmente sin sufrir',
  'Pares conductuales (Agua en cada comida)': 'Agua en cada comida: el hábito que transforma tu hidratación',
  'Uso de filtros domiciliarios': 'Filtro de agua: mejorar el sabor para beber más',
  'Hidratación proactiva en lugar de reactiva': 'Hidratación proactiva: no esperes a tener sed para beber',
  'Consumo de electrolitos en sudor extremo': 'Electrolitos: cuándo tu cuerpo realmente los necesita',
  'Regla compensatoria (Café/Té/Alcohol)': 'La regla 1:1: por cada café, un vaso de agua',
  'Agua Mineral carbonatada (Con gas)': 'Agua mineral con gas: la alternativa refrescante sin azúcar',
  'Monitoreo clínico de fármacos depletivos': 'Medicamentos que deshidratan: conoce tu tratamiento',
  'Apps o Smart Bottles': 'Smart bottles y apps: tecnología para mejorar tu hidratación',
  'Leche magra o alternativas lácteas': 'Leche: el líquido con electrolitos naturales',
  'Vasos isotérmicos (Temperatura)': 'Agua fría vs tibia: qué temperatura te ayuda a beber más',
  'Estratificación vespertina': 'Estratificación vespertina: por qué no debes beber mucha agua en la noche',
  'Aumentar líquidos ante fiebre o infección': 'Fiebre e hidratación: por qué necesitas más líquido cuando estás enfermo',
  // ── Temas médicos sin intervención directa ─────────────────────
  'Función del moco gástrico': 'Moco gástrico: la barrera invisible que protege tu estómago',
  'Estreñimiento funcional crónico': 'Estreñimiento crónico: cuándo es funcional y cómo tratarlo',
  'Fibra soluble vs insoluble en la motilidad': 'Fibra soluble vs insoluble: cuál necesitas y por qué',
  'Digestión enzimática exocrina': 'Enzimas digestivas: cómo tu cuerpo descompone lo que comes',
  'Celiaquía vs Sensibilidad al Gluten No Celíaca': 'Celiaquía vs sensibilidad al gluten: diferencias clave',
  'Histaminosis entérica': 'Histaminosis entérica: la intolerancia que muchos confunden con alergia',
  'Reflujo Gastroesofágico (ERGE) e Hipoclorhidria': 'Reflujo y ácido: por qué menos ácido puede ser peor',
  'Hígado Graso No Alcohólico (HGNA)': 'Hígado graso no alcohólico: el enemigo silencioso de tu hígado',
  'Eje Intestino-Cerebro': 'Eje intestino-cerebro: cómo tu microbiota controla tu estado de ánimo',
  'SIBO (Sobrecrecimiento Bacteriano)': 'SIBO: cuando las bacterias del colon suben al intestino delgado',
  'Síndrome del Intestino Irritable (SII)': 'Síndrome del intestino irritable: causas, síntomas y tratamiento',
  'Permeabilidad Intestinal (Leaky Gut)': 'Leaky gut: mito o realidad clínica',
  'Eje intestino-hígado': 'Eje intestino-hígado: el circuito oculto de tu salud',
  'Tránsito intestinal acelerado': 'Tránsito intestinal acelerado: diarrea crónica y sus causas',
  'Infección por Helicobacter pylori': 'H. pylori: la bacteria que causa úlceras y puede afectar tu salud a largo plazo',
  'Disbiosis Intestinal': 'Disbiosis intestinal: cuándo tu microbiota se desequilibra',
  'Intolerancia a la lactosa (Genética vs Adquirida)': 'Intolerancia a la lactosa: genética o adquirida',
  'Ácidos grasos de cadena corta (Butirato)': 'Butirato: el ácido graso que alimenta tu colon',
  'Metabolismo de los ácidos biliares': 'Ácidos biliares: más que digestión',
  'Alergias alimentarias y respuesta IgE': 'Alergias alimentarias: cómo tu sistema inmune reacciona a lo que comes',
  'Meditación de Amor Bondadoso': 'Meditación de amor bondadoso: compasión activa contra la ira',
  'Diario de Gratitud': 'Diario de gratitud: cómo reentrenar tu cerebro para notar lo positivo',
  'Reestructuración de Expectativas': 'Reestructuración de expectativas: el poder de "suficiente"',
  'Desensibilización (EMDR)': 'EMDR: la terapia que procesa traumas con movimiento ocular',
  'Mindfulness en la alimentación': 'Mindful eating: comer con consciencia plena',
  'Forest Bathing (Shinrin-yoku)': 'Forest bathing: cómo la naturaleza reduce tu cortisol',
  'Aromaterapia Clínica (Lavanda)': 'Aromaterapia con lavanda: evidencia y límites',
  'Escáner Corporal (Body Scan)': 'Body scan: el recorrido de la atención por tu cuerpo',
  'Musicoterapia': 'Musicoterapia: cómo la música afecta tu cerebro',
  'Biofeedback HRV (Variabilidad de Frecuencia Cardíaca)': 'HRV: el marcador de tu equilibrio nervioso',
  'Tai Chi o Qi Gong': 'Tai Chi y Qi Gong: movimiento consciente para la salud',
  'Terapia Cognitivo Conductual (CBT)': 'CBT: la terapia de referencia para ansiedad y depresión',
  'Mindfulness-Based Stress Reduction (MBSR)': 'MBSR: 8 semanas de mindfulness con evidencia clínica',
  'Suspiro Fisiológico': 'Suspiro fisiológico: el hack respiratorio más rápido para calmarte',
  'Ejercicio Aeróbico (Zona 2)': 'Cardio zona 2: el ejercicio que construye tu motor',
  'Relajación Muscular Progresiva (PMR)': 'PMR: tensión y relajación para aprender a soltar',
  'Respiración de Caja': 'Respiración de caja: 4-4-4-4 para equilibrar tu sistema nervioso',
  'Grounding (Conexión a tierra o técnica 5-4-3-2-1)': 'Grounding 5-4-3-2-1: cómo salir de un ataque de pánico',
  'Yoga y Asanas': 'Yoga: cuerpo, respiración y mente en una práctica',
  'Optimización de la Higiene de Sueño': 'Higiene de sueño: cómo crear las condiciones perfectas para dormir',
  'Terapia de Exposición al Frío': 'Exposición al frío: duchas frías y resiliencia al estrés',
  'Expresión Escrita (Journaling)': 'Journaling: escribir para transformar tu estado emocional',
  'Restricción del Tiempo en Cama': 'Restricción de tiempo en cama: la técnica más poderosa para el insomnio',
  'Higiene de Luz Matutina': 'Luz matutina: por qué la luz del sol en la mañana cambia todo',
  'Meditación Trascendental': 'Meditación trascendental: mantras y respuesta de relajación',
  'Manejo de Tiempo (Pomodoro)': 'Pomodoro: cómo dividir tu trabajo en ráfagas de foco',
  'Terapia de Aceptación y Compromiso (ACT)': 'ACT: aceptar sin juzgar y actuar según tus valores',
  'Desconexión Digital Nocturna': 'Desconexión digital nocturna: el secreto de un buen sueño',
  'Terapia de Masaje': 'Terapia de masaje: oxitocina y relajación muscular',
  'Reestructuración de Valores (ACT)': 'Reestructuración de valores: aliarte con lo que realmente importa',
};

// ── Generador de contenido mejorado ─────────────────────────────

function improveContent(title, mechanism, benefitTime, impactEvidence, errorsAlternatives) {
  const content = `# ${title}

Una intervención basada en evidencia para tu bienestar.

## ¿Qué es ${title}?

${title} es una intervención respaldada por la ciencia que aborda aspectos clave de la salud y el bienestar. Basada en investigaciones de instituciones como la ADA, la Endocrine Society y organizaciones internacionales de salud.

## Mecanismo de acción

${mechanism}

## Beneficios y tiempo estimado

${benefitTime || 'Tiempo de efecto variable según cada persona.'}

## Evidencia científica

${impactEvidence}

## Errores comunes y alternativas

${errorsAlternatives || 'Consulta con profesional de salud antes de implementar esta intervención.'}

## Consideraciones generales

Es importante recordar que ${title.toLowerCase()} es parte de un enfoque integral de salud. No reemplaza una evaluación profesional ni sustituye indicaciones médicas. Siempre consulta con un profesional de salud antes de implementar cambios significativos en tu alimentación, estilo de vida o rutina de ejercicio.

---

*Este contenido tiene propósito informativo y educativo basado en investigación científica. No reemplaza una evaluación ni indicación profesional de salud.*`;

  return { title, content };
}

// ── Generador de FAQs ───────────────────────────────────────────

function generateFAQs(title, mechanism, benefitTime, impactEvidence, errorsAlternatives) {
  return [
    {
      question: `¿Para qué sirve ${title}?`,
      answer: `${title}. ${mechanism.substring(0, 200)}...`
    },
    {
      question: `¿Cómo tomar o implementar ${title}?`,
      answer: `${mechanism}. ${benefitTime || 'Consulta con profesional de salud para ajustar a tu caso.'}`
    },
    {
      question: `¿Qué tan efectivo es ${title}?`,
      answer: `La evidencia científica indica: ${impactEvidence}.`
    },
    ...(errorsAlternatives ? [{
      question: `¿Cuáles son los errores comunes con ${title}?`,
      answer: errorsAlternatives
    }] : []),
    {
      question: `¿Cuándo debo consultar con un profesional de salud sobre ${title}?`,
      answer: 'Si tienes una condición médica, estás embarazada, en lactancia o tomas medicamentos, consulta siempre con un profesional de salud antes de implementar esta intervención.'
    }
  ];
}

// ── Función principal ───────────────────────────────────────────

async function polishArticle(article) {
  const enriched = article._enriched || {};
  const action = enriched.action || article.title;
  const title = TITLE_MAP[action] || TITLE_MAP[article.title] || article.title;
  const mechanism = enriched.mechanism || '';
  const benefitTime = enriched.benefit_time || '';
  const impactEvidence = enriched.impact_evidence || '';
  const errorsAlternatives = enriched.errors_alternatives || '';

  const improved = improveContent(title, mechanism, benefitTime, impactEvidence, errorsAlternatives);
  const faqs = generateFAQs(title, mechanism, benefitTime, impactEvidence, errorsAlternatives);

  return {
    title: improved.title,
    content: improved.content,
    excerpt: `${improved.title}. ${mechanism.substring(0, 120)}...`,
    faqsGenerated: faqs
  };
}

// ── Ejecución ───────────────────────────────────────────────────

async function main() {
  console.log('📚 Cargando artículos de bienestar...\n');

  const { data: articles, error } = await supabase
    .from('wellness_articles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`✅ ${articles.length} artículos encontrados\n`);

  // Cargar biblia para extraer datos enriquecidos
  const bibliaPath = path.join(__dirname, '..', 'public', 'branding', 'base de datos bienestar ia', 'biblioteca_bienestar.json');
  const bibliaRaw = fs.readFileSync(bibliaPath, 'utf-8');
  const biblia = JSON.parse(bibliaRaw);

  // Indexar intervenciones por action
  const interventionMap = {};
  for (const module of biblia.modules) {
    for (const intervention of module.interventions) {
      const key = intervention.action;
      interventionMap[key] = {
        action: intervention.action,
        moduleTitle: module.title,
        pathophysiology: module.pathophysiology,
        mechanism: intervention.mechanism,
        benefitTime: intervention.benefit_time,
        impactEvidence: intervention.impact_evidence,
        errorsAlternatives: intervention.errors_alternatives
      };
    }
  }

  // Enriquecer artículos
  for (const article of articles) {
    article._enriched = interventionMap[article.title] || interventionMap[article.entity_slug] || {};
  }

  let polished = 0;
  let skipped = 0;

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (i % 20 === 0) {
      console.log(`  Progreso: ${i}/${articles.length}...`);
    }

    try {
      const improved = await polishArticle(article);

      // Actualizar en Supabase
      const { error } = await supabase
        .from('wellness_articles')
        .update({
          title: improved.title,
          content: improved.content,
          excerpt: improved.excerpt,
          updated_at: new Date().toISOString()
        })
        .eq('id', article.id);

      if (error) {
        console.error(`  ❌ ${article.title}: ${error.message}`);
        skipped++;
      } else {
        polished++;
      }
    } catch (err) {
      console.error(`  ❌ ${article.title}: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n✅ ¡Pulido completado!`);
  console.log(`   Mejorados: ${polished}`);
  console.log(`   Saltados: ${skipped}`);
  console.log(`   Total: ${articles.length}\n`);
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
