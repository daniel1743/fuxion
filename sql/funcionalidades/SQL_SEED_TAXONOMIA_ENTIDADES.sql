-- ============================================================
-- ENTIDAD SEO EDITORIAL COMPLETA — Bienestar en Claro v3
-- Ejecutar TODO JUNTAMENTE en Supabase SQL Editor
-- Contiene: taxonomy, entities, relations, enriched_articles
-- ============================================================

-- =============================================
-- 1. TABLA TAXONOMY (requerido por las demás)
-- =============================================
CREATE TABLE IF NOT EXISTS taxonomy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  level INTEGER NOT NULL CHECK (level IN (1, 2)),
  parent_id UUID REFERENCES taxonomy(id),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_taxonomy_slug ON taxonomy(slug);
CREATE INDEX IF NOT EXISTS idx_taxonomy_parent ON taxonomy(parent_id);

-- =============================================
-- 2. TABLA ENTITIES
-- =============================================
CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('condition','symptom','product','ingredient','study','habit','organ','nutrient','vitamin','mineral','compound','test')),
  synonyms TEXT[],
  aliases TEXT[],
  medical_terms TEXT[],
  popular_terms TEXT[],
  scientific_terms TEXT[],
  parent_id UUID REFERENCES entities(id),
  taxonomy_node_ids UUID[],
  taxonomy_nodes UUID[],
  searchable_text TEXT,
  confidence NUMERIC(3,2) DEFAULT 0.5,
  evidence_level TEXT DEFAULT 'medium' CHECK (evidence_level IN ('high','medium','low','speculative')),
  properties JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(type);
CREATE INDEX IF NOT EXISTS idx_entities_taxonomys ON entities USING gin(taxonomy_node_ids);

-- =============================================
-- 3. TABLA RELATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_entity UUID NOT NULL REFERENCES entities(id),
  to_entity UUID NOT NULL REFERENCES entities(id),
  type TEXT NOT NULL,
  strength NUMERIC(3,2) DEFAULT 0.5,
  evidence_level TEXT DEFAULT 'medium' CHECK (evidence_level IN ('high','medium','low','speculative')),
  editorial_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_relations_from ON relations(from_entity);
CREATE INDEX IF NOT EXISTS idx_relations_to ON relations(to_entity);
CREATE INDEX IF NOT EXISTS idx_relations_type ON relations(type);

-- =============================================
-- 4. TABLA ENRICHED_ARTICLES
-- =============================================
CREATE TABLE IF NOT EXISTS enriched_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id TEXT NOT NULL,
  detected_entities UUID[],
  primary_taxonomy_node UUID REFERENCES taxonomy(id),
  semantic_keywords TEXT[],
  faqs JSONB,
  related_products UUID[],
  seo_schema JSONB,
  enrichment_score NUMERIC(3,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','error')),
  metrics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enriched_article_entities ON enriched_articles USING gin(detected_entities);
CREATE INDEX IF NOT EXISTS idx_enriched_article_status ON enriched_articles(status);

-- =============================================
-- 5. INSERT TAXONOMY — NIVEL 1: DOMINIOS (9)
-- =============================================
INSERT INTO taxonomy (name, slug, level, parent_id, description) VALUES
  ('Nutrición y Metabolismo', 'nutricion-y-metabolismo', 1, NULL, 'Macronutrientes, micronutrientes, metabolismo energético y control de peso'),
  ('Salud Digestiva', 'salud-digestiva', 1, NULL, 'Tracto digestivo, microbiota intestinal, hígado y sistema biliar'),
  ('Bienestar Cardiovascular', 'bienestar-cardiovascular', 1, NULL, 'Presión arterial, colesterol, circulación y prevención cardiovascular'),
  ('Salud Mental y Emocional', 'salud-mental-y-emocional', 1, NULL, 'Estrés, ansiedad, sueño, cognición y estado de ánimo'),
  ('Sistema Inmune', 'sistema-inmune', 1, NULL, 'Defensa inmunológica, inflamación y respuesta alérgica'),
  ('Salud Hormonal', 'salud-hormonal', 1, NULL, 'Eje hipotalámico-hipofisario, hormonas sexuales, tiroideas y del estrés'),
  ('Bienestar Físico y Deportivo', 'bienestar-fisico-y-deportivo', 1, NULL, 'Rendimiento atlético, recuperación muscular y longevidad funcional'),
  ('Salud Sexual y Reproductiva', 'salud-sexual-y-reproductiva', 1, NULL, 'Salud femenina, masculina y fertilidad'),
  ('Envejecimiento Saludable', 'envejecimiento-saludable', 1, NULL, 'Anti-edad, longevidad y calidad de vida');

-- =============================================
-- 6. INSERT TAXONOMY — NIVEL 2: SISTEMAS (30)
-- =============================================
INSERT INTO taxonomy (name, slug, level, parent_id, description) VALUES
  ('Macronutrientes', 'macronutrientes', 2, (SELECT id FROM taxonomy WHERE slug='nutricion-y-metabolismo'), 'Carbohidratos, proteínas y grasas'),
  ('Micronutrientes', 'micronutrientes', 2, (SELECT id FROM taxonomy WHERE slug='nutricion-y-metabolismo'), 'Vitaminas y minerales esenciales'),
  ('Metabolismo Energético', 'metabolismo-energetico', 2, (SELECT id FROM taxonomy WHERE slug='nutricion-y-metabolismo'), 'Producción y uso de energía celular'),
  ('Control de Peso', 'control-de-peso', 2, (SELECT id FROM taxonomy WHERE slug='nutricion-y-metabolismo'), 'Obesidad, resistencia a la insulina y manejo del peso'),
  ('Tracto Digestivo Superior', 'tracto-digestivo-superior', 2, (SELECT id FROM taxonomy WHERE slug='salud-digestiva'), 'Esófago, estómago y duodeno'),
  ('Microbiota Intestinal', 'microbiota-intestinal', 2, (SELECT id FROM taxonomy WHERE slug='salud-digestiva'), 'Flora intestinal, bacterias beneficiosas y equilibrio microbiano'),
  ('Tracto Digestivo Inferior', 'tracto-digestivo-inferior', 2, (SELECT id FROM taxonomy WHERE slug='salud-digestiva'), 'Colon, recto y tránsito intestinal'),
  ('Hígado y Sistema Biliar', 'higado-y-sistema-biliar', 2, (SELECT id FROM taxonomy WHERE slug='salud-digestiva'), 'Función hepática, bilis y desintoxicación'),
  ('Presión Arterial', 'presion-arterial', 2, (SELECT id FROM taxonomy WHERE slug='bienestar-cardiovascular'), 'Hipertensión, hipotensión y regulación'),
  ('Colesterol y Lípidos', 'colesterol-y-lipidos', 2, (SELECT id FROM taxonomy WHERE slug='bienestar-cardiovascular'), 'LDL, HDL, triglicéridos y aterosclerosis'),
  ('Circulación Sanguínea', 'circulacion-sanguinea', 2, (SELECT id FROM taxonomy WHERE slug='bienestar-cardiovascular'), 'Flujo sanguíneo y microcirculación'),
  ('Prevención Cardiovascular', 'prevencion-cardiovascular', 2, (SELECT id FROM taxonomy WHERE slug='bienestar-cardiovascular'), 'Factores de riesgo y prevención'),
  ('Estrés y Ansiedad', 'estres-y-ansiedad', 2, (SELECT id FROM taxonomy WHERE slug='salud-mental-y-emocional'), 'Estrés crónico, ansiedad y respuesta al estrés'),
  ('Sueño y Descanso', 'sueno-y-descanso', 2, (SELECT id FROM taxonomy WHERE slug='salud-mental-y-emocional'), 'Insomnio, higiene del sueño y arquitectura del sueño'),
  ('Cognición y Memoria', 'cognicion-y-memoria', 2, (SELECT id FROM taxonomy WHERE slug='salud-mental-y-emocional'), 'Memoria, concentración y función cognitiva'),
  ('Estado de Ánimo', 'estado-de-animo', 2, (SELECT id FROM taxonomy WHERE slug='salud-mental-y-emocional'), 'Depresión, depresión leve, eutimia y trastornos del ánimo'),
  ('Defensa Inmunológica', 'defensa-inmunologica', 2, (SELECT id FROM taxonomy WHERE slug='sistema-inmune'), 'Inmunidad innata y adaptativa'),
  ('Inflamación', 'inflamacion', 2, (SELECT id FROM taxonomy WHERE slug='sistema-inmune'), 'Inflamación crónica, aguda y respuesta inflamatoria'),
  ('Respuesta Alérgica', 'respuesta-alergica', 2, (SELECT id FROM taxonomy WHERE slug='sistema-inmune'), 'Alergias, intolerancias y respuesta inmune'),
  ('Eje Hipotalámico-Hipofisario', 'eje-hipotalamico-hipofisario', 2, (SELECT id FROM taxonomy WHERE slug='salud-hormonal'), 'Hipotálamo, hipófisis y regulación hormonal central'),
  ('Hormonas Sexuales', 'hormonas-sexuales', 2, (SELECT id FROM taxonomy WHERE slug='salud-hormonal'), 'Estrógenos, progesterona, testosterona'),
  ('Hormonas Tiroideas', 'hormonas-tiroideas', 2, (SELECT id FROM taxonomy WHERE slug='salud-hormonal'), 'TSH, T3, T4 y función tiroidea'),
  ('Hormonas del Estrés', 'hormonas-del-estres', 2, (SELECT id FROM taxonomy WHERE slug='salud-hormonal'), 'Cortisol, adrenalina y respuesta al estrés'),
  ('Rendimiento Atlético', 'rendimiento-atletico', 2, (SELECT id FROM taxonomy WHERE slug='bienestar-fisico-y-deportivo'), 'Performance, VO2 máx y resistencia'),
  ('Recuperación Muscular', 'recuperacion-muscular', 2, (SELECT id FROM taxonomy WHERE slug='bienestar-fisico-y-deportivo'), 'Regeneración muscular y recuperación post-ejercicio'),
  ('Longevidad Funcional', 'longevidad-funcional', 2, (SELECT id FROM taxonomy WHERE slug='bienestar-fisico-y-deportivo'), 'Envejecimiento saludable y función física'),
  ('Salud Femenina Integral', 'salud-femenina-integral', 2, (SELECT id FROM taxonomy WHERE slug='salud-sexual-y-reproductiva'), 'Ciclo menstrual, menopausia, perimenopausia'),
  ('Salud Masculina Integral', 'salud-masculina-integral', 2, (SELECT id FROM taxonomy WHERE slug='salud-sexual-y-reproductiva'), 'Salud prostática, testosterona y función sexual'),
  ('Fertilidad', 'fertilidad', 2, (SELECT id FROM taxonomy WHERE slug='salud-sexual-y-reproductiva'), 'Fertilidad masculina y femenina'),
  ('Vitalidad y Energía', 'vitalidad-y-energia', 2, (SELECT id FROM taxonomy WHERE slug='envejecimiento-saludable'), 'Energía celular, fatiga y vitalidad'),
  ('Salud Articular', 'salud-articular', 2, (SELECT id FROM taxonomy WHERE slug='envejecimiento-saludable'), 'Articulaciones, cartílago y movilidad'),
  ('Prevención Cognitiva', 'prevencion-cognitiva', 2, (SELECT id FROM taxonomy WHERE slug='envejecimiento-saludable'), 'Demencia, Alzheimer y deterioro cognitivo');

-- =============================================
-- 7. INSERT ENTIDADES (45+)
-- =============================================
INSERT INTO entities (name, type, synonyms, aliases, medical_terms, popular_terms, scientific_terms, evidence_level) VALUES
  ('Cirrosis Hepática', 'condition', ARRAY['cirrosis','cirrosis del hígado','cirrosis hepática'], ARRAY['cirrosis','cirrosis hepática'], ARRAY['cirrhosis','cirrhosis hepatis'], ARRAY['cirrosis','cirrosis del hígado','hígado cirrótico'], ARRAY['Hepatic cirrhosis','Liver cirrhosis'], 'high'),
  ('Hígado Graso No Alcohólico', 'condition', ARRAY['hígado graso','hígado graso no alcohólico','NAFLD','esteatosis hepática'], ARRAY['hígado graso','NAFLD','esteatosis'], ARRAY['non-alcoholic fatty liver disease','NAFLD','hepatic steatosis'], ARRAY['hígado graso','hígado graso no alcohólico','hígado graso en jóvenes'], ARRAY['Non-alcoholic fatty liver disease','NAFLD','Hepatic steatosis'], 'high'),
  ('Estreñimiento Crónico', 'condition', ARRAY['estreñimiento','estreñimiento crónico','constipación crónica'], ARRAY['estreñimiento','constipación'], ARRAY['chronic constipation','functional constipation'], ARRAY['estreñimiento','no ir al baño','estreñimiento crónico'], ARRAY['Chronic constipation','Functional constipation'], 'high'),
  ('Síndrome del Intestino Irritable', 'condition', ARRAY['síndrome del intestino irritable','SII','colon irritable'], ARRAY['colon irritable','SII','intestino irritable'], ARRAY['irritable bowel syndrome','IBS'], ARRAY['colon irritable','SII','intestino irritable','colon espástico'], ARRAY['Irritable bowel syndrome','IBS'], 'high'),
  ('Disbiosis Intestinal', 'condition', ARRAY['disbiosis','disbiosis intestinal','desequilibrio de la microbiota'], ARRAY['disbiosis','desequilibrio microbiano'], ARRAY['intestinal dysbiosis','gut dysbiosis'], ARRAY['disbiosis','microbiota alterada','flora alterada'], ARRAY['Intestinal dysbiosis','Gut dysbiosis'], 'high'),
  ('Obesidad', 'condition', ARRAY['obesidad','obesidad mórbida','obesidad grado III'], ARRAY['obesidad','obesidad mórbida'], ARRAY['obesity','morbid obesity'], ARRAY['sobrepeso','obesidad','obesidad mórbida'], ARRAY['Obesity','Morbid obesity'], 'high'),
  ('Insomnio', 'condition', ARRAY['insomnio','insomnio crónico','trastorno del sueño'], ARRAY['insomnio','insomnio crónico','trastorno del sueño'], ARRAY['insomnia','chronic insomnia','sleep disorder'], ARRAY['insomnio','no dormir','insomnio crónico'], ARRAY['Insomnia','Chronic insomnia'], 'high'),
  ('Ansiedad', 'condition', ARRAY['ansiedad','ansiedad generalizada','trastorno de ansiedad'], ARRAY['ansiedad','ansiedad generalizada','trastorno de ansiedad'], ARRAY['anxiety','generalized anxiety disorder','GAD'], ARRAY['ansiedad','nervios','ansiedad generalizada','nerviosismo'], ARRAY['Anxiety','Generalized anxiety disorder'], 'high'),
  ('Hipertensión Arterial', 'condition', ARRAY['hipertensión','hipertensión arterial','tensión alta','presión alta'], ARRAY['tensión alta','presión alta','hipertensión','HTA'], ARRAY['hypertension','arterial hypertension'], ARRAY['tensión alta','presión alta','hipertensión','HTA'], ARRAY['Hypertension','Arterial hypertension'], 'high'),
  ('Colesterol Alto', 'condition', ARRAY['colesterol alto','hipercolesterolemia','lípidos altos'], ARRAY['colesterol alto','lípidos altos','hipercolesterolemia'], ARRAY['hypercholesterolemia','elevated cholesterol'], ARRAY['colesterol alto','lípidos altos','colesterol elevado'], ARRAY['Hypercholesterolemia','Elevated cholesterol'], 'high'),
  ('Depresión Leve', 'condition', ARRAY['depresión leve','depresión moderada','depresión clínica'], ARRAY['depresión','depresión leve','depresión moderada'], ARRAY['mild depression','moderate depression','clinical depression'], ARRAY['depresión','tristeza','depresión leve'], ARRAY['Mild depression','Moderate depression'], 'high'),
  ('Menopausia', 'condition', ARRAY['menopausia','perimenopausia','climaterio','sop'], ARRAY['menopausia','perimenopausia','climaterio','SOP'], ARRAY['menopause','perimenopause','climacterium'], ARRAY['menopausia','climaterio','cambio'], ARRAY['Menopause','Perimenopause'], 'high'),
  ('Reflujo Gastroesofágico', 'condition', ARRAY['reflujo gastroesofágico','ERGE','reflujo ácido','reflujo gástrico'], ARRAY['reflujo','reflujo gástrico','ERGE','reflujo ácido'], ARRAY['gastroesophageal reflux disease','GERD'], ARRAY['reflujo','reflujo ácido','reflujo gástrico','acidez'], ARRAY['Gastroesophageal reflux disease','GERD'], 'high'),
  ('Hinchazón Abdominal', 'symptom', ARRAY['hinchazón abdominal','hinchazón','gases','meteorismo','hinchazón del vientre'], ARRAY['hinchazón','gases','meteorismo','inflamación abdominal'], ARRAY['abdominal distension','bloating','flatulence'], ARRAY['hinchazón','gases','meteorismo'], ARRAY['Abdominal distension','Bloating','Flatulence'], 'medium'),
  ('Fatiga Crónica', 'symptom', ARRAY['fatiga crónica','cansancio crónico','fatiga persistente'], ARRAY['fatiga crónica','cansancio crónico','fatiga persistente','cansancio extremo'], ARRAY['chronic fatigue','persistent fatigue'], ARRAY['fatiga crónica','cansancio crónico','fatiga'], ARRAY['Chronic fatigue','Persistent fatigue'], 'high'),
  ('Ictericia', 'symptom', ARRAY['ictericia','ictericia hepática','ictericia del hígado'], ARRAY['ictericia','ictericia hepática','piel amarilla'], ARRAY['icterus','hepatic jaundice'], ARRAY['ictericia','piel amarilla','ojos amarillos'], ARRAY['Icterus','Hepatic jaundice'], 'high'),
  ('Flora Liv', 'product', ARRAY['flora liv','floraliv','probióticos flora liv','flora liv fuxion'], ARRAY['flora liv','floraliv','probióticos flora liv'], ARRAY['probiotics flora liv','gut flora supplement'], ARRAY['flora liv','floraliv','probióticos flora liv'], ARRAY['probióticos flora liv','flora liv'], 'high'),
  ('Prunex 1', 'product', ARRAY['prunex 1','prunex','prunex 1 fuxion','té prunex'], ARRAY['prunex 1','prunex','prunex 1 fuxion'], ARRAY['prunex tea','prunex 1'], ARRAY['prunex 1','prunex','prunex 1 fuxion','té prunex'], ARRAY['prunex 1','prunex'], 'high'),
  ('Rexet', 'product', ARRAY['rexet','rexet fuxion','rexet hígado','rexet desintoxicación'], ARRAY['rexet','rexet fuxion','rexet hígado','rexet desintoxicación'], ARRAY['liver support supplement','hepatic support'], ARRAY['rexet','rexet fuxion','rexet hígado'], ARRAY['rexet','rexet fuxion'], 'high'),
  ('Liquid Fiber', 'product', ARRAY['liquid fiber','líquido fibra','fibra líquida'], ARRAY['liquid fiber','líquido fibra','fibra líquida'], ARRAY['liquid fiber supplement'], ARRAY['liquid fiber','líquido fibra','fibra líquida'], ARRAY['Liquid fiber supplement'], 'high'),
  ('Thermo T3', 'product', ARRAY['thermo t3','termo t3','thermo-t3','thermo t3 fuxion','quemador de grasa'], ARRAY['thermo t3','termo t3','thermo-t3','thermo t3 fuxion'], ARRAY['thermogenic beverage','fat burner beverage'], ARRAY['thermo t3','termo t3','quemador de grasa'], ARRAY['thermo t3','termo t3'], 'high'),
  ('Psyllium', 'ingredient', ARRAY['psyllium','psyllium husk','plantago ovata','cascarilla de plantago'], ARRAY['psyllium','psyllium husk','cascarilla de plantago'], ARRAY['Plantago ovata','psyllium husk'], ARRAY['psyllium','cascarilla de plantago'], ARRAY['psyllium','psyllium husk'], 'high'),
  ('Beta-Glucanos', 'ingredient', ARRAY['beta-glucanos','beta-glucano','β-glucanos','beta glucanos'], ARRAY['beta-glucanos','beta-glucano','β-glucanos'], ARRAY['beta-glucans','beta-glucan'], ARRAY['beta-glucanos','beta-glucano','β-glucanos'], ARRAY['beta-glucanos','beta-glucano'], 'high'),
  ('Curcumina', 'ingredient', ARRAY['curcumina','cúrcuma','curcumin','turmeric'], ARRAY['curcumina','cúrcuma','curcumin'], ARRAY['curcumin','turmeric'], ARRAY['curcumina','cúrcuma','curcumin'], ARRAY['curcumina','cúrcuma'], 'high'),
  ('Omega-3', 'ingredient', ARRAY['omega-3','omega 3','omega 3','ácidos grasos omega 3','EPA','DHA'], ARRAY['omega-3','omega 3','EPA','DHA'], ARRAY['omega-3 fatty acids','EPA','DHA'], ARRAY['omega-3','omega 3','EPA','DHA'], ARRAY['Omega-3 fatty acids','EPA','DHA'], 'high'),
  ('Vitamina D', 'ingredient', ARRAY['vitamina d','vitamina D','colecalciferol','vitamina D3'], ARRAY['vitamina d','vitamina D','colecalciferol','vitamina D3'], ARRAY['vitamin D','cholecalciferol'], ARRAY['vitamina d','vitamina D','colecalciferol'], ARRAY['vitamina d','vitamina D'], 'high'),
  ('Magnesio', 'ingredient', ARRAY['magnesio','magnesium','mg','magnesio orgánico'], ARRAY['magnesio','magnesium','mg'], ARRAY['magnesium'], ARRAY['magnesio','magnesium','mg'], ARRAY['magnesio','magnesium'], 'high'),
  ('Probióticos', 'ingredient', ARRAY['probióticos','probióticos','probioticos','bacterias beneficiosas','flora intestinal'], ARRAY['probióticos','probióticos','bacterias beneficiosas','flora intestinal'], ARRAY['probiotics','beneficial bacteria'], ARRAY['probióticos','probióticos','bacterias beneficiosas','flora intestinal'], ARRAY['probióticos','probióticos'], 'high'),
  ('Probiótico B. lactis', 'ingredient', ARRAY['b. lactis','bifidobacterium lactis','bl-04'], ARRAY['b. lactis','bifidobacterium lactis','bl-04'], ARRAY['bifidobacterium lactis','B. lactis'], ARRAY['b. lactis','bifidobacterium lactis','bl-04'], ARRAY['b. lactis','bifidobacterium lactis'], 'high'),
  ('Caminata Post-Comida', 'habit', ARRAY['caminata post-comida','caminar después de comer','caminar 10 minutos','caminata corta'], ARRAY['caminata post-comida','caminar después de comer','caminar 10 minutos'], ARRAY['post-meal walking','postprandial walking'], ARRAY['caminata post-comida','caminar después de comer'], ARRAY['caminata post-comida','caminar después de comer'], 'medium'),
  ('Hidratación Constante', 'habit', ARRAY['hidratación constante','beber agua','hidratarse','consumo de agua'], ARRAY['hidratación constante','beber agua','hidratarse'], ARRAY['constant hydration','water consumption'], ARRAY['hidratación constante','beber agua','hidratarse'], ARRAY['hidratación constante','beber agua'], 'high'),
  ('Masticación Lenta', 'habit', ARRAY['masticación lenta','comer despacio','mindful eating','alimentación consciente'], ARRAY['masticación lenta','comer despacio','mindful eating'], ARRAY['slow chewing','mindful eating'], ARRAY['masticación lenta','comer despacio','mindful eating'], ARRAY['masticación lenta','comer despacio'], 'medium'),
  ('Hígado', 'organ', ARRAY['hígado','hepático','hígado','hígado humano'], ARRAY['hígado','hepático','hígado','hígado humano'], ARRAY['liver','hepatic organ'], ARRAY['hígado','hepático','hígado'], ARRAY['hígado','hepático'], 'high'),
  ('Intestino Delgado', 'organ', ARRAY['intestino delgado','intestino tenue','duodeno','yeyuno','íleon'], ARRAY['intestino delgado','intestino tenue','duodeno','yeyuno','íleon'], ARRAY['small intestine','duodenum','jejunum','ileum'], ARRAY['intestino delgado','intestino tenue','duodeno'], ARRAY['intestino delgado','intestino tenue'], 'high'),
  ('Colon', 'organ', ARRAY['colon','colon grueso','intestino grueso'], ARRAY['colon','colon grueso','intestino grueso'], ARRAY['colon','large intestine'], ARRAY['colon','colon grueso','intestino grueso'], ARRAY['colon','colon grueso'], 'high'),
  ('Microbiota Intestinal', 'organ', ARRAY['microbiota intestinal','flora intestinal','microbioma intestinal'], ARRAY['microbiota intestinal','flora intestinal','microbioma intestinal'], ARRAY['intestinal microbiota','gut flora','intestinal microbiome'], ARRAY['microbiota intestinal','flora intestinal','microbioma intestinal'], ARRAY['microbiota intestinal','flora intestinal'], 'high'),
  ('Guía ADA 2026', 'study', ARRAY['guía ada 2026','standards of care diabetes','estandares de cuidado diabetes'], ARRAY['guía ada 2026','standards of care diabetes'], ARRAY['Standards of Care in Diabetes 2026'], ARRAY['guía ada 2026','estandares de cuidado diabetes'], ARRAY['Standards of Care in Diabetes 2026'], 'high'),
  ('Guía ESPEN 2024', 'study', ARRAY['guía espen 2024','guía nutrición geriátrica','espennutricion'], ARRAY['guía espen 2024','guía nutrición geriátrica'], ARRAY['ESPEN clinical nutrition geriatrics'], ARRAY['guía espen 2024','guía nutrición geriátrica'], ARRAY['ESPEN clinical nutrition geriatrics'], 'high'),
  ('Guía AHA 2021', 'study', ARRAY['guía aha 2021','guía prevención cardiovascular','aha prevención'], ARRAY['guía aha 2021','guía prevención cardiovascular'], ARRAY['AHA/ACC guidelines cardiovascular prevention 2021'], ARRAY['guía aha 2021','guía prevención cardiovascular'], ARRAY['AHA/ACC guidelines cardiovascular prevention 2021'], 'high'),
  ('Guía AGA 2023', 'study', ARRAY['guía aga 2023','guía estreñimiento','aga estreñimiento'], ARRAY['guía aga 2023','guía estreñimiento'], ARRAY['AGA clinical practice guideline constipation 2023'], ARRAY['guía aga 2023','guía estreñimiento'], ARRAY['AGA clinical practice guideline constipation 2023'], 'high'),
  ('Fibra Soluble', 'nutrient', ARRAY['fibra soluble','fibra solvable','fibra soluble alimentaria'], ARRAY['fibra soluble','fibra solvable','fibra soluble alimentaria'], ARRAY['soluble dietary fiber'], ARRAY['fibra soluble','fibra solvable','fibra soluble alimentaria'], ARRAY['fibra soluble','fibra solvable'], 'high'),
  ('Fibra Insoluble', 'nutrient', ARRAY['fibra insoluble','fibra insoluble alimentaria'], ARRAY['fibra insoluble','fibra insoluble alimentaria'], ARRAY['insoluble dietary fiber'], ARRAY['fibra insoluble','fibra insoluble alimentaria'], ARRAY['fibra insoluble','fibra insoluble'], 'high'),
  ('Polietilenglicol 3350', 'compound', ARRAY['peg 3350','polietilenglicol 3350','peg','macrogol'], ARRAY['peg 3350','polietilenglicol 3350','peg','macrogol'], ARRAY['polyethylene glycol 3350','macrogol 3350'], ARRAY['peg 3350','polietilenglicol 3350'], ARRAY['peg 3350','polietilenglicol 3350'], 'high'),
  ('Control de Peso', 'condition', ARRAY['control de peso','manejo del peso','obesidad control'], ARRAY['control de peso','manejo del peso'], ARRAY['weight management','obesity management'], ARRAY['control de peso','manejo del peso'], ARRAY['Weight management','Obesity management'], 'high'),
  ('Prevención Cardiovascular', 'condition', ARRAY['prevención cardiovascular','prevencion cardiovascular','prevención cardiaca'], ARRAY['prevención cardiovascular','prevención cardiaca'], ARRAY['cardiovascular prevention'], ARRAY['prevención cardiovascular','prevención cardiaca'], ARRAY['Cardiovascular prevention'], 'high'),
  ('Tracto Digestivo Inferior', 'organ', ARRAY['tracto digestivo inferior','colon grueso','intestino grueso','recto'], ARRAY['tracto digestivo inferior','colon grueso','intestino grueso','recto'], ARRAY['lower digestive tract','large intestine'], ARRAY['tracto digestivo inferior','colon grueso','intestino grueso'], ARRAY['tracto digestivo inferior','colon grueso'], 'high'),
  ('Prevención Cognitiva', 'condition', ARRAY['prevención cognitiva','prevención demencia','prevención alzheimer'], ARRAY['prevención cognitiva','prevención demencia','prevención alzheimer'], ARRAY['cognitive prevention','dementia prevention','alzheimer prevention'], ARRAY['prevención cognitiva','prevención demencia','prevención alzheimer'], ARRAY['Cognitive prevention','Dementia prevention'], 'high'),
  ('Longevidad Funcional', 'condition', ARRAY['longevidad funcional','longevidad','envejecimiento saludable'], ARRAY['longevidad funcional','longevidad','envejecimiento saludable'], ARRAY['functional longevity','healthy aging'], ARRAY['longevidad funcional','longevidad','envejecimiento saludable'], ARRAY['Functional longevity','Healthy aging'], 'high'),
  ('Vitalidad y Energía', 'condition', ARRAY['vitalidad y energía','vitalidad','energía celular'], ARRAY['vitalidad y energía','vitalidad','energía celular'], ARRAY['vitality and energy','cellular energy'], ARRAY['vitalidad y energía','vitalidad','energía celular'], ARRAY['vitalidad y energía','vitalidad'], 'high'),
  ('Recuperación Muscular', 'condition', ARRAY['recuperación muscular','recuperacion muscular','recuperación post ejercicio'], ARRAY['recuperación muscular','recuperación post ejercicio'], ARRAY['muscle recovery','post exercise recovery'], ARRAY['recuperación muscular','recuperación post ejercicio'], ARRAY['Muscle recovery'], 'high'),
  ('Rendimiento Atlético', 'condition', ARRAY['rendimiento atlético','rendimiento deportivo','performance atlético'], ARRAY['rendimiento atlético','rendimiento deportivo'], ARRAY['athletic performance'], ARRAY['rendimiento atlético','rendimiento deportivo'], ARRAY['Athletic performance'], 'high'),
  ('Fertilidad', 'condition', ARRAY['fertilidad','infertilidad','fecundidad'], ARRAY['fertilidad','infertilidad','fecundidad'], ARRAY['fertility','fecundity'], ARRAY['fertilidad','infertilidad'], ARRAY['Fertility','Infertility'], 'high'),
  ('Hormonas Sexuales', 'condition', ARRAY['hormonas sexuales','balance hormonal','desequilibrio hormonal'], ARRAY['hormonas sexuales','balance hormonal'], ARRAY['sex hormones','hormonal balance'], ARRAY['hormonas sexuales','balance hormonal'], ARRAY['Sex hormones','Hormonal balance'], 'high'),
  ('Inflamación', 'condition', ARRAY['inflamación','inflamación crónica','inflamación aguda'], ARRAY['inflamación','inflamación crónica','inflamación aguda'], ARRAY['inflammation','chronic inflammation','acute inflammation'], ARRAY['inflamación','inflamación crónica'], ARRAY['Inflammation','Chronic inflammation'], 'high');

-- =============================================
-- 8. INSERT RELATIONS (33)
-- =============================================
INSERT INTO relations (from_entity, to_entity, type, strength, evidence_level, editorial_note) VALUES
  ((SELECT id FROM entities WHERE name='Cirrosis Hepática'), (SELECT id FROM entities WHERE name='Hígado'), 'partOf', 1.0, 'high', 'Cirrosis es una condición del hígado'),
  ((SELECT id FROM entities WHERE name='Cirrosis Hepática'), (SELECT id FROM entities WHERE name='Hígado Graso No Alcohólico'), 'relatedTo', 0.85, 'high', 'El hígado graso puede progresar a cirrosis'),
  ((SELECT id FROM entities WHERE name='Hígado Graso No Alcohólico'), (SELECT id FROM entities WHERE name='Hígado'), 'partOf', 1.0, 'high', 'Hígado graso es una condición del hígado'),
  ((SELECT id FROM entities WHERE name='Estreñimiento Crónico'), (SELECT id FROM entities WHERE name='Colon'), 'symptomOf', 0.9, 'high', 'El estreñimiento afecta el colon'),
  ((SELECT id FROM entities WHERE name='Estreñimiento Crónico'), (SELECT id FROM entities WHERE name='Fibra Soluble'), 'treats', 0.75, 'high', 'La fibra soluble ayuda al estreñimiento'),
  ((SELECT id FROM entities WHERE name='Estreñimiento Crónico'), (SELECT id FROM entities WHERE name='Psyllium'), 'treats', 0.8, 'high', 'El psyllium es tratamiento de primera línea'),
  ((SELECT id FROM entities WHERE name='Prunex 1'), (SELECT id FROM entities WHERE name='Estreñimiento Crónico'), 'contains', 0.7, 'high', 'Prunex 1 es tratamiento para estreñimiento'),
  ((SELECT id FROM entities WHERE name='Estreñimiento Crónico'), (SELECT id FROM entities WHERE name='Hinchazón Abdominal'), 'hasSymptom', 0.7, 'high', 'El estreñimiento causa hinchazón abdominal'),
  ((SELECT id FROM entities WHERE name='Hígado Graso No Alcohólico'), (SELECT id FROM entities WHERE name='Rexet'), 'treats', 0.65, 'medium', 'Rexet es apoyo para el hígado'),
  ((SELECT id FROM entities WHERE name='Hígado Graso No Alcohólico'), (SELECT id FROM entities WHERE name='Omega-3'), 'treats', 0.7, 'high', 'El omega-3 ayuda en el hígado graso'),
  ((SELECT id FROM entities WHERE name='Hígado Graso No Alcohólico'), (SELECT id FROM entities WHERE name='Curcumina'), 'treats', 0.65, 'medium', 'La curcumina tiene efectos hepatoprotectores'),
  ((SELECT id FROM entities WHERE name='Flora Liv'), (SELECT id FROM entities WHERE name='Microbiota Intestinal'), 'contains', 0.85, 'high', 'Flora Liv apoya la microbiota intestinal'),
  ((SELECT id FROM entities WHERE name='Probióticos'), (SELECT id FROM entities WHERE name='Microbiota Intestinal'), 'contains', 0.9, 'high', 'Los probióticos contienen bacterias beneficiosas'),
  ((SELECT id FROM entities WHERE name='Disbiosis Intestinal'), (SELECT id FROM entities WHERE name='Microbiota Intestinal'), 'relatedTo', 0.95, 'high', 'La disbiosis es un desequilibrio de la microbiota'),
  ((SELECT id FROM entities WHERE name='Probiótico B. lactis'), (SELECT id FROM entities WHERE name='Microbiota Intestinal'), 'contains', 0.8, 'high', 'B. lactis es un probiótico específico'),
  ((SELECT id FROM entities WHERE name='Microbiota Intestinal'), (SELECT id FROM entities WHERE name='Colon'), 'partOf', 0.9, 'high', 'La microbiota intestinal está en el colon'),
  ((SELECT id FROM entities WHERE name='Microbiota Intestinal'), (SELECT id FROM entities WHERE name='Fibra Soluble'), 'treats', 0.75, 'high', 'La fibra soluble alimenta la microbiota'),
  ((SELECT id FROM entities WHERE name='Síndrome del Intestino Irritable'), (SELECT id FROM entities WHERE name='Microbiota Intestinal'), 'relatedTo', 0.8, 'high', 'El SII está relacionado con la microbiota intestinal'),
  ((SELECT id FROM entities WHERE name='Obesidad'), (SELECT id FROM entities WHERE name='Control de Peso'), 'relatedTo', 0.9, 'high', 'La obesidad requiere control de peso'),
  ((SELECT id FROM entities WHERE name='Obesidad'), (SELECT id FROM entities WHERE name='Thermo T3'), 'treats', 0.5, 'medium', 'Thermo T3 es apoyo para control de peso'),
  ((SELECT id FROM entities WHERE name='Insomnio'), (SELECT id FROM entities WHERE name='Vitamina D'), 'treats', 0.3, 'low', 'La vitamina D puede ayudar con el sueño'),
  ((SELECT id FROM entities WHERE name='Ansiedad'), (SELECT id FROM entities WHERE name='Magnesio'), 'treats', 0.6, 'medium', 'El magnesio tiene efectos calmantes'),
  ((SELECT id FROM entities WHERE name='Ansiedad'), (SELECT id FROM entities WHERE name='Beta-Glucanos'), 'relatedTo', 0.3, 'low', 'Los beta-glucanos pueden apoyar el sistema inmune'),
  ((SELECT id FROM entities WHERE name='Hipertensión Arterial'), (SELECT id FROM entities WHERE name='Omega-3'), 'treats', 0.7, 'high', 'El omega-3 ayuda con la presión arterial'),
  ((SELECT id FROM entities WHERE name='Hipertensión Arterial'), (SELECT id FROM entities WHERE name='Colesterol Alto'), 'relatedTo', 0.85, 'high', 'Hipertensión y colesterol alto están relacionados'),
  ((SELECT id FROM entities WHERE name='Colesterol Alto'), (SELECT id FROM entities WHERE name='Omega-3'), 'treats', 0.75, 'high', 'El omega-3 reduce el colesterol'),
  ((SELECT id FROM entities WHERE name='Colesterol Alto'), (SELECT id FROM entities WHERE name='Fibra Soluble'), 'treats', 0.7, 'high', 'La fibra soluble ayuda a reducir el colesterol'),
  ((SELECT id FROM entities WHERE name='Colesterol Alto'), (SELECT id FROM entities WHERE name='Curcumina'), 'treats', 0.5, 'medium', 'La curcumina tiene efectos sobre el colesterol'),
  ((SELECT id FROM entities WHERE name='Colesterol Alto'), (SELECT id FROM entities WHERE name='Hígado Graso No Alcohólico'), 'relatedTo', 0.7, 'high', 'Colesterol alto y hígado graso están relacionados'),
  ((SELECT id FROM entities WHERE name='Menopausia'), (SELECT id FROM entities WHERE name='Flora Liv'), 'treats', 0.4, 'low', 'Flora Liv puede apoyar la salud durante la menopausia'),
  ((SELECT id FROM entities WHERE name='Menopausia'), (SELECT id FROM entities WHERE name='Omega-3'), 'treats', 0.5, 'medium', 'El omega-3 puede ayudar en la menopausia'),
  ((SELECT id FROM entities WHERE name='Reflujo Gastroesofágico'), (SELECT id FROM entities WHERE name='Síndrome del Intestino Irritable'), 'relatedTo', 0.6, 'medium', 'Reflujo y SII pueden estar relacionados'),
  ((SELECT id FROM entities WHERE name='Reflujo Gastroesofágico'), (SELECT id FROM entities WHERE name='Fibra Soluble'), 'treats', 0.4, 'medium', 'La fibra soluble puede ayudar con el reflujo');

-- =============================================
-- 9. INSERT ARTÍCULOS ENRIQUECIDOS (4 ejemplos)
-- =============================================
INSERT INTO enriched_articles (article_id, detected_entities, primary_taxonomy_node, semantic_keywords, faqs, related_products, status)
VALUES
  ('cirrosis-hepatica',
    ARRAY[
      (SELECT id FROM entities WHERE name='Cirrosis Hepática'),
      (SELECT id FROM entities WHERE name='Hígado'),
      (SELECT id FROM entities WHERE name='Hígado Graso No Alcohólico')
    ],
    (SELECT id FROM taxonomy WHERE slug='higado-y-sistema-biliar'),
    ARRAY['cirrosis','hígado','fibrosis','hepático','ictericia','toxicidad'],
    '[{"question":"¿Qué es la cirrosis hepática?","answer":"Es la etapa avanzada de fibrosis del hígado donde el tejido sano es reemplazado por tejido cicatricial."},{"question":"¿Cuáles son los síntomas de la cirrosis hepática?","answer":"Los síntomas incluyen fatiga, ictericia, hinchazón abdominal y confusión mental."}]',
    ARRAY[(SELECT id FROM entities WHERE name='Rexet')],
    'completed'),
  ('higado-graso-no-alcoholico',
    ARRAY[
      (SELECT id FROM entities WHERE name='Hígado Graso No Alcohólico'),
      (SELECT id FROM entities WHERE name='Hígado'),
      (SELECT id FROM entities WHERE name='Omega-3')
    ],
    (SELECT id FROM taxonomy WHERE slug='higado-y-sistema-biliar'),
    ARRAY['hígado graso','NAFLD','esteatosis','omega-3','curcumina'],
    '[{"question":"¿Qué es el hígado graso no alcohólico?","answer":"Es la acumulación de grasa en el hígado no relacionada con el consumo de alcohol."},{"question":"¿Cómo se trata el hígado graso?","answer":"El tratamiento incluye cambios de estilo de vida, omega-3 y apoyo con productos hepáticos."}]',
    ARRAY[(SELECT id FROM entities WHERE name='Rexet'), (SELECT id FROM entities WHERE name='Omega-3')],
    'completed'),
  ('estrenimiento-cronico-tratamiento',
    ARRAY[
      (SELECT id FROM entities WHERE name='Estreñimiento Crónico'),
      (SELECT id FROM entities WHERE name='Colon'),
      (SELECT id FROM entities WHERE name='Psyllium'),
      (SELECT id FROM entities WHERE name='Fibra Soluble')
    ],
    (SELECT id FROM taxonomy WHERE slug='tracto-digestivo-inferior'),
    ARRAY['estreñimiento','colon','psyllium','fibra','tránsito intestinal'],
    '[{"question":"¿Qué es el estreñimiento crónico?","answer":"Es la dificultad persistente para evacuar, generalmente menos de 3 deposiciones por semana."},{"question":"¿Qué productos ayudan con el estreñimiento?","answer":"El psyllium y los productos con fibra soluble como Prunex 1 son efectivos."}]',
    ARRAY[(SELECT id FROM entities WHERE name='Prunex 1'), (SELECT id FROM entities WHERE name='Psyllium')],
    'completed'),
  ('microbiota-intestinal-bienestar',
    ARRAY[
      (SELECT id FROM entities WHERE name='Microbiota Intestinal'),
      (SELECT id FROM entities WHERE name='Probióticos'),
      (SELECT id FROM entities WHERE name='Flora Liv'),
      (SELECT id FROM entities WHERE name='Disbiosis Intestinal')
    ],
    (SELECT id FROM taxonomy WHERE slug='microbiota-intestinal'),
    ARRAY['microbiota','probióticos','flora intestinal','disbiosis','equilibrio'],
    '[{"question":"¿Qué es la microbiota intestinal?","answer":"Son los billones de bacterias beneficiosas que viven en nuestro intestino."},{"question":"¿Qué es la disbiosis?","answer":"Es el desequilibrio de la microbiota intestinal que puede causar múltiples problemas de salud."}]',
    ARRAY[(SELECT id FROM entities WHERE name='Flora Liv'), (SELECT id FROM entities WHERE name='Probióticos')],
    'completed');
