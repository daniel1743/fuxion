-- Migration: Populate categories for all 200 articles by domain
-- Generated: 2026-07-21
-- Purpose: 160 articles were missing categories (ids 41-200).
-- This script assigns categories based on each article's domain.
-- Uses slug matching (safe since slugs are unique).
-- Run against Supabase SQL Editor.

BEGIN;

-- ============================================================
-- DOMINIO 2 (ids 41-80): Salud Metabolica, Nutricion Celular, Obesidad
-- ============================================================

UPDATE public.wellness_articles SET category = 'Metabolismo'
WHERE slug IN (
  'flexibilidad-metabolica',
  'ayuno-intermitente',
  'cetosis-fisiologica-dieta-keto',
  'adaptacion-metabolica-tumba-metabolica',
  'grasa-parda-bat-y-termogenesis',
  'ciclo-de-krebs-para-mortales',
  'biogenesis-mitocondrial'
);

UPDATE public.wellness_articles SET category = 'Diabetes'
WHERE slug IN (
  'resistencia-a-la-insulina',
  'indice-y-carga-glucemica',
  'hipoglucemia-reactiva'
);

UPDATE public.wellness_articles SET category = 'Pérdida de Peso'
WHERE slug IN (
  'adaptacion-metabolica-tumba-metabolica',
  'tejido-adiposo-visceral-vs-subcutaneo',
  'adiccion-a-ultraprocesados',
  'hipertrofia-adipocitaria',
  'lipolisis-y-movilizacion-de-acidos-grasos'
);

UPDATE public.wellness_articles SET category = 'Sobrepeso'
WHERE slug IN (
  'tejido-adiposo-visceral-vs-subcutaneo',
  'hipertrofia-adipocitaria'
);

UPDATE public.wellness_articles SET category = 'Salud Cardiovascular'
WHERE slug IN (
  'dislipidemia-hdl-ldl-vldl',
  'colesterol-exogeno-vs-endogeno'
);

UPDATE public.wellness_articles SET category = 'Inflamación'
WHERE slug IN (
  'glucotoxicidad-y-estrés-oxidativo',
  'glicacion-age-y-envejecimiento-vascular'
);

UPDATE public.wellness_articles SET category = 'Nutrición'
WHERE slug IN (
  'sarcopenia-y-requerimientos-de-leucina',
  'nutrigenomica-elemental',
  'crononutricion',
  'proteinas-sericas-y-albúmina',
  'micronutricion-biodisponibilidad-del-magnesio',
  'metabolismo-del-calcio-y-d3',
  'antioxidantes-endogenos-glutation',
  'vitaminas-liposolubles',
  'vitaminas-del-complejo-b-y-metilacion',
  'folato-vs-acido-folico-sintetico',
  'metabolismo-basal-tmb',
  'neat-termogenesis-por-actividad-no-asociada-al-ejercicio',
  'microbioma-y-extraccion-calorica',
  'dietas-hiperproteicas-y-funcion-renal',
  'hidratacion-intra-vs-extracelular'
);

UPDATE public.wellness_articles SET category = 'Metabolismo'
WHERE slug IN (
  'leptina-y-resistencia-leptinica',
  'grelina-y-ritmos-del-hambre',
  'vias-mtor-y-crecimiento-celular',
  'termogenesis-inducida-por-la-dieta',
  'metabolismo-de-la-fructosa-hepatica',
  'microbioma-y-extraccion-calorica'
);

-- ============================================================
-- DOMINIO 3 (ids 81-120): Neurobiología, Sueño, Estrés, Salud Mental
-- ============================================================

UPDATE public.wellness_articles SET category = 'Bienestar Mental'
WHERE slug IN (
  'dopamina-y-sistemas-de-recompensa',
  'neuroplasticidad-en-la-edad-adulta',
  'serotonina-eje-cerebro-enterico',
  'gaba-y-neurotransmisores-inhibidores',
  'red-neuronal-por-defecto-dmn-y-rumiacion',
  'neurofisiologia-del-flow-state',
  'neurobiologia-de-los-habitos-ganglios-basales',
  'ansiedad-funcional-vs-trastorno-generalizado',
  'neurogenesis-en-el-hipocampo',
  'reserva-cognitiva-y-prevencion-de-demencias',
  'fatiga-por-toma-de-decisiones',
  'efecto-placebo-y-nocebo-fisiologia',
  'regulacion-emocional-top-down',
  'consolidacion-de-la-memoria-durante-el-sueno',
  'endocannabinoides-y-ejercicio-el-verdadero-runner-s-high'
);

UPDATE public.wellness_articles SET category = 'Estrés y Ansiedad'
WHERE slug IN (
  'fisiologia-del-estrés-eje-hpa',
  'niebla-mental-brain-fog-y-neuroinflamacion',
  'oxitocina-y-resiliencia-al-estrés',
  'trauma-y-memoria-somatica',
  'ansiedad-funcional-vs-trastorno-generalizado',
  'tono-vagal-y-variabilidad-cardiaca-hrv'
);

UPDATE public.wellness_articles SET category = 'Sueño y Descanso'
WHERE slug IN (
  'arquitectura-del-sueno',
  'insomnio-de-conciliacion-vs-mantenimiento',
  'apnea-obstructiva-del-sueno-fisiopatologia',
  'jet-lag-social',
  'temperatura-central-y-sueno',
  'ritmos-circadianos-y-nucleo-supraquiasmatico',
  'consolidacion-de-la-memoria-durante-el-sueno'
);

UPDATE public.wellness_articles SET category = 'Salud Cardiovascular'
WHERE slug IN (
  'tono-vagal-y-variabilidad-cardiaca-hrv'
);

UPDATE public.wellness_articles SET category = 'Salud Digestiva'
WHERE slug IN (
  'serotonina-eje-cerebro-enterico'
);

UPDATE public.wellness_articles SET category = 'Metabolismo'
WHERE slug IN (
  'ejercicio-y-bdnf-factor-neurotrofico'
);

UPDATE public.wellness_articles SET category = 'Nutrición'
WHERE slug IN (
  'nutrientes-nootropicos-l-teanina-creatina'
);

UPDATE public.wellness_articles SET category = 'Bienestar'
WHERE slug IN (
  'neurobiologia-de-los-habitos-ganglios-basales',
  'efecto-placebo-y-nocebo-fisiologia',
  'ritmos-ultradianos-de-enfoque'
);

UPDATE public.wellness_articles SET category = 'Salud Hormonal'
WHERE slug IN (
  'oxitocina-y-resiliencia-al-estrés'
);

UPDATE public.wellness_articles SET category = 'Inflamación'
WHERE slug IN (
  'niebla-mental-brain-fog-y-neuroinflamacion',
  'celulas-gliales-y-astrocitos'
);

UPDATE public.wellness_articles SET category = 'Motivación'
WHERE slug IN (
  'neurobiologia-de-los-habitos-ganglios-basales'
);

-- ============================================================
-- DOMINIO 4 (ids 121-160): Endocrinología, Salud Femenina, Inmunidad, Longevidad
-- ============================================================

UPDATE public.wellness_articles SET category = 'Salud Hormonal'
WHERE slug IN (
  'transicion-menopausica',
  'disfuncion-tiroidea-subclinica',
  'sindrome-de-ovario-poliquistico-pcos-fenotipos',
  'dominancia-estrogenica-y-metabolismo-hepatico-de-hormonas',
  'amenorrea-hipotalamica',
  'dismenorrea-y-prostaglandinas',
  'testosterona-libre-en-hombres-y-mujeres',
  'andropausia-deficiencia-de-androgenos',
  'suprarrenales-dhea',
  'eje-intestino-piel-acne-hormonal',
  'melasma-y-sensibilidad-melanocitica',
  'caida-del-cabello-androgenetica-vs-efluvio',
  'dinamica-del-colageno-dermico-y-fotoenvejecimiento',
  'termorregulacion-periferica-femenina',
  'funciones-de-la-progesterona-cerebral',
  'anticonceptivos-hormonales-impacto-metabolico',
  'ciclo-menstrual-como-signo-vital',
  'disruptores-endocrinos-en-el-entorno-xenoestrogenos'
);

UPDATE public.wellness_articles SET category = 'Inmunidad'
WHERE slug IN (
  'inflamacion-de-bajo-grado',
  'autoinmunidad-mimetismo-molecular',
  'inmunidad-innata-vs-adaptativa',
  'sistema-linfatico-periferico',
  'mastocitos-e-intolerancia-a-la-histamina',
  'vitamina-d-como-pro-hormona-inmunomoduladora',
  'carga-viral-y-reactivacion-de-pathogenos-latentes-veb',
  'respuesta-de-histocompatibilidad-hla'
);

UPDATE public.wellness_articles SET category = 'Sistema Inmunitario'
WHERE slug IN (
  'autoinmunidad-mimetismo-molecular',
  'inmunidad-innata-vs-adaptativa',
  'respuesta-de-histocompatibilidad-hla'
);

UPDATE public.wellness_articles SET category = 'Metabolismo'
WHERE slug IN (
  'senescencia-celular-celulas-zombis',
  'vias-sirtuinas-y-nad-en-el-envejecimiento',
  'epigenetica-metilacion-del-adn',
  'hormesis-y-estrés-adaptativo',
  'terapia-de-exposicion-al-frio-calor-extremo',
  'longitud-de-los-telomeros',
  'celulas-madre-adultas-endogenas',
  'biomarcadores-de-edad-biologica-vs-cronologica'
);

UPDATE public.wellness_articles SET category = 'Salud Cardiovascular'
WHERE slug IN (
  'osteoporosis-y-dinamica-de-osteoblastos-osteoclastos'
);

UPDATE public.wellness_articles SET category = 'Nutrición'
WHERE slug IN (
  'vitamina-d-como-pro-hormona-inmunomoduladora'
);

UPDATE public.wellness_articles SET category = 'Estrés y Ansiedad'
WHERE slug IN (
  'prolactina-en-el-estrés'
);

UPDATE public.wellness_articles SET category = 'Salud del Hígado'
WHERE slug IN (
  'dominancia-estrogenica-y-metabolismo-hepatico-de-hormonas'
);

UPDATE public.wellness_articles SET category = 'Sobrepeso'
WHERE slug IN (
  'sindrome-de-ovario-poliquistico-pcos-fenotipos'
);

UPDATE public.wellness_articles SET category = 'Bienestar Mental'
WHERE slug IN (
  'autoinmunidad-mimetismo-molecular',
  'senescencia-celular-celulas-zombis'
);

UPDATE public.wellness_articles SET category = 'Salud Digestiva'
WHERE slug IN (
  'eje-intestino-piel-acne-hormonal'
);

-- ============================================================
-- DOMINIO 5 (ids 161-200): Cardiovascular, Ejercicio, Biomecánica, Sistémico
-- ============================================================

UPDATE public.wellness_articles SET category = 'Salud Cardiovascular'
WHERE slug IN (
  'endotelio-vascular-y-oxido-nitrico',
  'hipertension-esencial-eje-renina-angiotensina',
  'rigidez-arterial-y-presion-de-pulso',
  'placa-de-ateroma-vulnerabilidad-vs-estabilidad',
  'funcion-de-las-lipoproteinas-apob-y-apoa1',
  'fibrilacion-auricular-y-arritmias-basicas',
  'insuficiencia-venosa-y-valvulas-de-retorno',
  'microcirculacion-capilar-periferica',
  'vo2-max-como-predictor-de-mortalidad',
  'adaptaciones-del-ventriculo-izquierdo-al-deporte',
  'reclutamiento-de-unidades-motoras-fibras-lentas-vs-rapidas',
  'tendinopatias-y-carga-mecanica-progresiva',
  'coagulacion-y-funcion-plaquetaria',
  'interacciones-farmacologicas-a-nivel-del-citocromo-p450',
  'rosacea-y-reactividad-de-los-vasos-sanguineos-dermicos'
);

UPDATE public.wellness_articles SET category = 'Metabolismo'
WHERE slug IN (
  'dinapenia-y-perdida-de-fuerza-en-adultos-mayores',
  'tejido-fascial-y-tensegridad-del-cuerpo',
  'cartilago-hialino-y-liquido-sinovial-artrosis',
  'sistema-endocannabinoide-receptores-cb1-y-cb2',
  'sudoriferas-ecrinas-vs-apocrinas'
);

UPDATE public.wellness_articles SET category = 'Nutrición'
WHERE slug IN (
  'fisiologia-de-la-sed-y-osmorregulacion',
  'filtracion-glomerular-y-funcion-renal-basica',
  'equilibrio-acido-base-fisiologico-el-mito-de-las-dietas-alcalinas',
  'metabolismo-del-hierro-y-almacenamiento-ferritina',
  'cilios-respiratorios-y-aclaramiento-mucociliar'
);

UPDATE public.wellness_articles SET category = 'Bienestar'
WHERE slug IN (
  'ergonomia-moderna-y-postura',
  'fisiologia-del-estiramiento-muscular-husos-neuromusculares'
);

UPDATE public.wellness_articles SET category = 'Inflamación'
WHERE slug IN (
  'cartilago-hialino-y-liquido-sinovial-artrosis'
);

UPDATE public.wellness_articles SET category = 'Salud Hormonal'
WHERE slug IN (
  'vo2-max-como-predictor-de-mortalidad',
  'sebaceas'
);

UPDATE public.wellness_articles SET category = 'Microbiota'
WHERE slug IN (
  'microbioma-de-la-piel-y-ph-acido'
);

UPDATE public.wellness_articles SET category = 'Salud Digestiva'
WHERE slug IN (
  'desintoxicacion-hepatica-real-fase-i-ii-iii-desmitificando-dietas-detox'
);

UPDATE public.wellness_articles SET category = 'Salud del Hígado'
WHERE slug IN (
  'interacciones-farmacologicas-a-nivel-del-citocromo-p450'
);

UPDATE public.wellness_articles SET category = 'Bienestar Mental'
WHERE slug IN (
  'salud-ocular-pelicula-lagrimal-y-degeneracion-macular',
  'fisiologia-auditiva-presbiacusia-y-tinnitus',
  'mecanorreceptores-de-la-piel-tacto-y-presion',
  'fisiologia-del-olfato-y-gusto',
  'plasticidad-somatosensorial-en-la-edad-adulta'
);

UPDATE public.wellness_articles SET category = 'Inmunidad'
WHERE slug IN (
  'coagulacion-y-funcion-plaquetaria'
);

UPDATE public.wellness_articles SET category = 'Sistema Inmunitario'
WHERE slug IN (
  'hematopoyesis-y-glóbulos-rojos'
);

UPDATE public.wellness_articles SET category = 'Estrés y Ansiedad'
WHERE slug IN (
  'asma-y-broncoconstriccion'
);

UPDATE public.wellness_articles SET category = 'Metabolismo'
WHERE slug IN (
  'fisiologia-de-la-fiebre'
);

-- ============================================================
-- FIX: Correct articles misclassified in Dom 1
-- ============================================================

UPDATE public.wellness_articles SET category = 'Salud Digestiva'
WHERE slug IN (
  'digestion-enzimatica-exocrina-funcion-pancreatica-y-descomposicion-de-macronutrientes',
  'ritmos-circadianos-del-tracto-digestivo',
  'masticacion-y-fase-cefalica-de-la-digestion'
);

-- ============================================================
-- Verify results
-- ============================================================
SELECT category, COUNT(*) as cnt FROM public.wellness_articles GROUP BY category ORDER BY cnt DESC;

COMMIT;
