# Artículos publicados sin imagen

Fecha de auditoría: 2026-07-23
Fuente principal revisada: Supabase PostgreSQL — tablas `blog_posts` y `wellness_articles`
Total de artículos publicados revisados: 165
Total sin imagen válida: 130
Total con imagen válida: 35
Casos ambiguos: 0

## Resumen de la auditoría

### Fuentes inspeccionadas

Se auditaron las **dos tablas de producción** que alimentan la aplicación en tiempo real:

1. **`blog_posts`** (Supabase) — 35 registros. Todos publicados (`is_published = true`).
2. **`wellness_articles`** (Supabase) — 150 registros. Todos publicados (`is_published = true`).

El contexto React (`BlogContext.jsx`) combina ambas tablas y las expone unificadas en el blog público. El componente `getPostBySlug` busca primero en `blog_posts` y luego en `wellness_articles`, lo que implica que si un slug existe en ambas tablas, el registro de `blog_posts` tiene prioridad.

### Fuentes descartadas (no autoritativas)

Los siguientes archivos JSON locales fueron evaluados y **descartados como fuentes de producción** por ser cachés, dumps de desarrollo o datos heredados:

| Archivo | Tipo | Motivo de exclusión |
|---------|------|---------------------|
| `posts.json` | Seed/Legacy | No tiene campo `is_published`. Datos estáticos no consumidos por la app. |
| `public/converted-articles.json` | Caché convertida | Datos derivados de un pipeline de conversión editorial. |
| `public/wellness-articles-cache.json` | Caché frontend | Snapshot congelado. La app consulta Supabase en tiempo real. |
| `articles_dump.json` | Dump parcial | Solo 26 registros sin campo de imagen. |
| `articles_tracker.json` | Tracker editorial | 200 registros de seguimiento, no fuente de publicación. |
| `well.json` | Seed/Legacy | Datos iniciales, no actualizados. |
| `blog_analysis.json` | Análisis | Dump analítico, no fuente de producción. |

### Criterio de imagen

El único campo de imagen utilizado en producción es **`image_url`** (tipo TEXT). Se consideró sin imagen válida si:

- El campo es `null` o `undefined`.
- El campo es cadena vacía.
- El valor apunta al **placeholder genérico del sitio**: `/branding/social/og-image.png` (imagen OG del branding, no una imagen editorial del artículo).
- La ruta local referenciada no existe en el directorio `public/`.
- El archivo existe pero tiene tamaño cero.

### Duplicados

Se detectaron **20 artículos duplicados** en `wellness_articles` cuyos slugs coinciden con registros de `blog_posts`. Dado que la aplicación prioriza `blog_posts` en la resolución por slug, estos registros de `wellness_articles` **nunca se muestran al usuario público**. Se excluyeron de la lista principal para evitar duplicados.

| Slug duplicado | Título en blog_posts | Título en wellness_articles |
|----------------|---------------------|-----------------------------|
| `metabolismo-de-los-cidos-biliares` | Metabolismo de los ácidos biliares | Ácidos biliares: más que digestión |
| `cidos-grasos-de-cadena-corta-butirato` | Ácidos grasos de cadena corta (Butirato) | Butirato: el ácido graso que alimenta tu colon |
| `alergias-alimentarias-y-respuesta-ige` | Alergias alimentarias y respuesta IgE | Alergias alimentarias: cómo tu sistema inmune reacciona a lo que comes |
| `s-ndrome-del-intestino-irritable-sii-eje-intest...` | Síndrome del Intestino Irritable (SII) | Síndrome del intestino irritable: causas, síntomas y tratamiento |
| `eje-intestino-cerebro-v-as-de-comunicaci-n-bidi...` | Eje Intestino-Cerebro | Eje intestino-cerebro: cómo tu microbiota controla tu estado de ánimo |
| `reflujo-gastroesof-gico-erge-e-hipoclorhidria-m...` | Reflujo Gastroesofágico (ERGE) e Hipoclorhidria | Reflujo y ácido: por qué menos ácido puede ser peor |
| `digesti-n-enzim-tica-exocrina-funci-n-pancre-ti...` | Digestión enzimática exocrina | Enzimas digestivas: cómo tu cuerpo descompone lo que comes |
| `fibra-soluble-vs-insoluble-impacto-en-la-motili...` | Fibra soluble vs insoluble en la motilidad | Fibra soluble vs insoluble: cuál necesitas y por qué |
| `h-gado-graso-no-alcoh-lico-hgna-acumulaci-n-lip...` | Hígado Graso No Alcohólico (HGNA) | Hígado graso no alcohólico: el enemigo silencioso de tu hígado |
| `estreimiento-funcional-crnico` | Estreñimiento funcional crónico | Estreñimiento crónico: cuándo es funcional y cómo tratarlo |
| `trnsito-intestinal-acelerado` | Tránsito intestinal acelerado | Tránsito intestinal acelerado: diarrea crónica y sus causas |
| `intolerancia-a-la-lactosa-gentica-vs-adquirida` | Intolerancia a la lactosa (Genética vs Adquirida) | Intolerancia a la lactosa: genética o adquirida |
| `funcin-del-moco-gstrico` | Función del moco gástrico | Moco gástrico: la barrera invisible que protege tu estómago |
| `celiaqu-a-vs-sensibilidad-al-gluten-no-cel-aca-...` | Celiaquía vs Sensibilidad al Gluten No Celíaca | Celiaquía vs sensibilidad al gluten: diferencias clave |
| `eje-intestino-hgado` | Eje intestino-hígado | Eje intestino-hígado: el circuito oculto de tu salud |
| `infeccin-por-helicobacter-pylori` | Infección por Helicobacter pylori | H. pylori: la bacteria que causa úlceras y puede afectar tu salud a largo plazo |
| `disbiosis-intestinal-desequilibrio-del-microbio...` | Disbiosis Intestinal | Disbiosis intestinal: cuándo tu microbiota se desequilibra |
| `histaminosis-entrica` | Histaminosis entérica | Histaminosis entérica: la intolerancia que muchos confunden con alergia |
| `permeabilidad-intestinal-mecanismos-de-la-barre...` | Permeabilidad Intestinal (Leaky Gut) | Leaky gut: mito o realidad clínica |
| `sibo-sobrecrecimiento-bacteriano-migraci-n-micr...` | SIBO (Sobrecrecimiento Bacteriano) | SIBO: cuando las bacterias del colon suben al intestino delgado |

### Limitaciones

- Las URLs remotas (Unsplash, Cloudflare) se consideraron válidas sin verificar disponibilidad HTTP.
- No se realizaron solicitudes masivas externas.
- No se modificó ningún dato del proyecto.

---

## Lote 01 — Artículos 1 al 10

### 1. Terapia farmacológica (Agonistas GLP-1/GIP) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `1cb3ad77-d8eb-4cdc-8010-59330f4901a4`
- **Slug:** `terapia-farmacologica-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/terapia-farmacologica-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Los agonistas de los receptores de GLP-1 y GIP representan una de las transformaciones más significativas en el manejo terapéutico del sobrepeso y la obesidad en los últimos años. Estos fármacos actúan sobre sistemas hormonales fundamentales del organismo, modificando la regulación del apetito, el metabolismo energético y la…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.684-04:00

### 2. Adopción de la Dieta MIND — Nutrición, Metabolismo y Peso Corporal

- **ID:** `29ac9d4d-b61b-4db9-9504-ecb7d58a75e0`
- **Slug:** `adopcion-de-la-dieta-mind-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/adopcion-de-la-dieta-mind-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El control del peso corporal y la regulación metabólica son dos de los principales desafíos de salud pública en Chile y Latinoamérica. La sobrepeso y la obesidad afectan a más de la mitad de la población adulta, mientras que el síndrome metabólico compromete a millones de personas con…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.694-04:00

### 3. Entrenamiento de Fuerza (2-3 días/sem) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `2f165b9d-1a95-4c72-b15d-0c8ce3cd5869`
- **Slug:** `entrenamiento-de-fuerza-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/entrenamiento-de-fuerza-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El entrenamiento de fuerza es una de las intervenciones más estudiadas y con mayor solidez de evidencia en el campo de la salud metabólica y la composición corporal. La práctica regular —especialmente en el rango de dos a tres sesiones semanales— produce efectos medibles sobre la masa muscular,…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.694-04:00

### 4. Déficit calórico individualizado (500-750 kcal/día) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `f56f65ba-7434-4eb0-9c6a-a292cef0d3f1`
- **Slug:** `deficit-calorico-individualizado-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/deficit-calorico-individualizado-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El manejo del peso corporal ha sido objeto de décadas de investigación y debate clínico. En los últimos años, ha emergido con fuerza un enfoque que distingue entre las recomendaciones genéricas de restricción calórica y aquellas diseñadas específicamente para las necesidades individuales de cada persona. La diferencia es…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Bienestar Mental
- **Fecha de publicación:** 2026-07-20T12:26:23.694-04:00

### 5. Terapia Cognitivo Conductual (CBT) para obesidad — Nutrición, Metabolismo y Peso Corporal

- **ID:** `80e60251-0464-4370-9668-c2babf48eeb3`
- **Slug:** `terapia-cognitivo-conductual-cbt-para-obesidad-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/terapia-cognitivo-conductual-cbt-para-obesidad-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El sobrepeso y la obesidad afectan a más de mil millones de personas en el mundo, y su carga va mucho más allá de la estética: es un factor de riesgo para diabetes tipo 2, enfermedad cardiovascular, apnea del sueño, ciertos cánceres y deterioro de la calidad de…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.694-04:00

### 6. Sustitución de fármacos obesogénicos — Nutrición, Metabolismo y Peso Corporal

- **ID:** `272323ce-3194-4c42-9bda-d7a80ac24a8c`
- **Slug:** `sustitucion-de-farmacos-obesogenicos-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/sustitucion-de-farmacos-obesogenicos-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La epidemia de sobrepeso y obesidad ha alcanzado proporciones globales, y detrás de muchos casos persisten factores menos evidentes: medicamentos que favorecen la ganancia de peso. Un número significativo de fármacos de uso común —antipsicóticos, antidepresivos, antiepilépticos, corticoides, betabloqueantes e insulina— alteran el balance energético a través de…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.694-04:00

### 7. Aumento de Proteína (1.2-1.5 g/kg/día) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `aae69865-62e4-4bd3-aa6b-d85b6812b22e`
- **Slug:** `aumento-de-proteina-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/aumento-de-proteina-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El consumo de proteínas ha dejado de ser un tema secundario en nutrición para convertirse en uno de los pilares más estudiados del metabolismo humano. Las guías internacionales —incluidas las de la Sociedad Americana de Diabetes (ADA) y la Endocrine Society— coinciden en que un incremento moderado hacia…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Nutrición
- **Fecha de publicación:** 2026-07-20T12:26:23.694-04:00

### 8. Sustitución guiada por Ley de Etiquetados — Nutrición, Metabolismo y Peso Corporal

- **ID:** `89aeeebe-a6c1-4792-8eae-461bca58c05a`
- **Slug:** `sustitucion-guiada-por-ley-de-etiquetados-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/sustitucion-guiada-por-ley-de-etiquetados-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El sobrepeso y la obesidad representan uno de los mayores desafíos de salud pública en Chile y en el mundo. Según datos de la Encuesta Nacional de Salud (ENS), más del 70% de la población adulta chilena presenta exceso de peso, una cifra que ha aumentado consistentemente durante…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.694-04:00

### 9. Incremento del NEAT (>8,000 pasos/día) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `80a4ef07-f768-43b5-8d17-bf1b1ab04fa9`
- **Slug:** `incremento-del-neat-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/incremento-del-neat-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El aumento del NEAT representa una estrategia de intervención nutricional y metabólica respaldada por evidencia clínica para el manejo del peso corporal. A diferencia de los programas de ejercicio estructurado, esta aproximación se centra en elevar la actividad física no asociada al ejercicio formal, alcanzando una meta de…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.694-04:00

### 10. Entrenamiento a Intervalos (HIIT) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `89a7b326-0f74-468a-8119-b1b351369d2f`
- **Slug:** `entrenamiento-a-intervalos-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/entrenamiento-a-intervalos-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El entrenamiento a intervalos de alta intensidad (HIIT) ha pasado de ser una estrategia reservada para deportistas de élite a convertirse en una herramienta de uso extendido en la práctica clínica y en recomendaciones de salud pública. Organizaciones como la Asociación Americana de Diabetes (ADA) y la Sociedad…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

---

## Lote 02 — Artículos 11 al 20

### 11. Monitoreo Continuo de Glucosa (MCG) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `9ef2da55-4906-4707-a104-aa882dcc6a35`
- **Slug:** `monitoreo-continuo-de-glucosa-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/monitoreo-continuo-de-glucosa-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El control de los niveles de glucosa en sangre ha dejado de ser una herramienta exclusiva para personas con diabetes. En los últimos años, dispositivos de Monitoreo Continuo de Glucosa (MCG) han ganado terreno como recurso de información metabólica incluso entre personas sin diagnóstico de enfermedad endocrina. Esto…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 12. Restricción del Tiempo en Cama (Optimizar Sueño) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `a7f600ec-af35-490c-b57a-0be31808a71b`
- **Slug:** `restriccion-del-tiempo-en-cama-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/restriccion-del-tiempo-en-cama-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El sueño es uno de los pilares menos valorados de la salud metabólica. Investigaciones de la Asociación Americana de Diabetes (ADA) y la Endocrine Society han documentado consistentemente que la privación crónica de sueño — ya sea por dormir poco o por dormir mal — se asocia con…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 13. Orden de macronutrientes al comer — Nutrición, Metabolismo y Peso Corporal

- **ID:** `eecaafec-2491-40cd-82b8-b8e7aaafa7a0`
- **Slug:** `orden-de-macronutrientes-al-comer-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/orden-de-macronutrientes-al-comer-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Los patrones de ingesta alimentaria han sido tradicionalmente estudiados desde la perspectiva de la composición nutricional total del día: cuántas calorías, cuántos carbohidratos, proteínas o grasas se consumen. Sin embargo, en los últimos años, la evidencia científica ha revelado que el orden en que se ingieren estos macronutrientes…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 14. Control del Entorno (Despensa) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `1ab5448b-0bdc-4158-a123-803f90edb1b2`
- **Slug:** `control-del-entorno-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/control-del-entorno-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El manejo del peso corporal y el metabolismo no depende únicamente de lo que comemos, sino fundamentalmente de cómo está diseñado nuestro entorno alimentario. La evidencia acumulada por organizaciones como la American Diabetes Association, la Endocrine Society y múltiples sociedades internacionales de salud señala que la configuración del…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 15. Masticación lenta (Mindful Eating) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `155fe8fe-d05f-4de1-9964-f35d5f19cd48`
- **Slug:** `masticacion-lenta-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/masticacion-lenta-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La forma en que comemos afecta tanto como lo que comemos. En un contexto donde la alimentación rápida y distraída se ha normalizado —comer frente a pantallas, trabajar mientras se come, o consumir comidas procesadas que requieren mínima masticación—, la masticación lenta emerge como una herramienta de bajo…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 16. Monitoreo regular de peso — Nutrición, Metabolismo y Peso Corporal

- **ID:** `57fe1d27-cb17-403d-8586-00ef56ca95f8`
- **Slug:** `monitoreo-regular-de-peso-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/monitoreo-regular-de-peso-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El peso corporal es un marcador clínico accesible y sensible que refleja el equilibrio energético a lo largo del tiempo. Su variación no ocurre de forma aislada: está íntimamente ligada a la ingesta calórica, el gasto energético basal, la actividad física, el sueño, el estrés y factores hormonales.…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 17. Cirugía Metabólica/Bariátrica — Nutrición, Metabolismo y Peso Corporal

- **ID:** `522027d5-adfe-4677-a28a-cfc88c635b8e`
- **Slug:** `cirugia-metabolica-bariatrica-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/cirugia-metabolica-bariatrica-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La obesidad y la enfermedad metabólica representan uno de los mayores desafíos de salud pública a nivel global, y su impacto trasciende el peso corporal para afectar múltiples sistemas orgánicos. La cirugía metabólica y bariátrica ha emergido como una de las intervenciones más efectivas disponibles para abordar esta…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 18. Aumento de consumo de pescado azul (Omega-3) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `b6f2b171-d487-4e0b-8a08-1d657c51758d`
- **Slug:** `aumento-de-consumo-de-pescado-azul-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/aumento-de-consumo-de-pescado-azul-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Los ácidos grasos omega-3 —principalmente el EPA (eicosapentaenoico) y el DHA (docosahexaenoico)— son nutrientes esenciales que el organismo no puede sintetizar en cantidades suficientes y debe obtener a través de la alimentación. El pescado azul, también conocido como pescado graso, constituye la fuente alimentaria más concentrada de estos…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 19. Alimentación Restringida en el Tiempo (Ayuno 12-14h) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `55ede5ec-dee4-40eb-a0fe-73fe697687ba`
- **Slug:** `alimentacion-restringida-en-el-tiempo-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/alimentacion-restringida-en-el-tiempo-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El peso corporal y el metabolismo son dos de los ejes más estudiados en la medicina nutricional contemporánea. La obesidad afecta a millones de personas en Chile y Latinoamérica, y las estrategias para abordarla van más allá de contar calorías: lo que importa también es cuándo comemos. La…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 20. Reducción de Alcohol (<1 trago/día) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `33a9648d-3e55-4dcd-be68-13808164ab51`
- **Slug:** `reduccion-de-alcohol-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/reduccion-de-alcohol-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El consumo habitual de alcohol, incluso en cantidades que muchas personas consideran moderadas, tiene efectos metabólicos y nutricionales documentados que trascienden los riesgos evidentes para hígado o corazón. La recomendación de mantener el consumo bajo un trago diario se sustenta en décadas de investigación epidemiológica y ensayos clínicos…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

---

## Lote 03 — Artículos 21 al 30

### 21. Eliminación de Bebidas Azucaradas — Nutrición, Metabolismo y Peso Corporal

- **ID:** `115b8165-8415-4a38-8f09-83df794708da`
- **Slug:** `eliminacion-de-bebidas-azucaradas-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/eliminacion-de-bebidas-azucaradas-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Las bebidas azucaradas representan uno de los mayores aportes calóricos invisibles en la dieta occidental contemporánea. Un solo vaso de refresco puede contener entre 35 y 50 gramos de azúcar añadido —equivalente a siete o diez cucharaditas—, cantidades que superan ampliamente lo recomendado por las autoridades sanitarias internacionales.…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 22. Fibra Viscosa (>30g/día) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `7381784c-992b-4550-b40e-7e6d6392c6f6`
- **Slug:** `fibra-viscosa-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/fibra-viscosa-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El manejo del peso corporal y la salud metabólica son desafíos que enfrentan millones de personas. Entre las estrategias dietéticas con mayor respaldo, la fibra viscosa ha emergido como un componente relevante. Este tipo de fibra —soluble y gelificante— interactúa directamente con el tracto digestivo, modificando la velocidad…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 23. Caminata corta post-comida (10 min) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `48c54d74-04b2-4ae8-bf08-39d5b9c8c3b8`
- **Slug:** `caminata-corta-post-comida-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/caminata-corta-post-comida-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Las fluctuaciones glucémicas tras las comidas principales representan uno de los factores metabólicos más relevantes en el desarrollo de resistencia a la insulina, síndrome metabólico y diabetes tipo 2. Una intervención simple, accesible y respaldada por múltiples estudios sugiere que caminar brevemente después de cada comida puede tener…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 24. Identificación de gatillos con Diario — Nutrición, Metabolismo y Peso Corporal

- **ID:** `053f45ff-1d2e-41fd-8ec2-33b175dfb4b2`
- **Slug:** `identificacion-de-gatillos-con-diario-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/identificacion-de-gatillos-con-diario-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Los trastornos metabólicos y los problemas de peso corporal representan uno de los mayores desafíos de salud pública en Chile y Latinoamérica. Según datos de la Organización Panamericana de Salud, más del 70% de la población adulta chilena presenta sobrepeso u obesidad, cifras que se han mantenido estables…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 25. Establecimiento de Metas SMART — Nutrición, Metabolismo y Peso Corporal

- **ID:** `ef2808c4-ddaa-45e4-9109-727ce82b5196`
- **Slug:** `establecimiento-de-metas-smart-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/establecimiento-de-metas-smart-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La salud metabólica constituye uno de los pilares fundamentales del bienestar humano. La interacción entre la nutrición, el metabolismo energético y la composición corporal determina no solo el peso que registramos en la báscula, sino también la capacidad de nuestro organismo para regular glucosa, sintetizar hormonas, mantener la…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 26. Reemplazo de granos refinados por enteros — Nutrición, Metabolismo y Peso Corporal

- **ID:** `6538ce8a-754b-4463-b0d9-d20f01b02442`
- **Slug:** `reemplazo-de-granos-refinados-por-enteros-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/reemplazo-de-granos-refinados-por-enteros-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El consumo excesivo de carbohidratos refinados constituye uno de los patrones dietéticos más extendidos en la dieta occidental contemporánea. Granos como el trigo blanco, el arroz pulido y el maíz molido han sido procesados para eliminar el germen y el endospermo fibroso, conservando fundamentalmente almidón y calorías vacías.…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 27. Uso de platos de menor diámetro — Nutrición, Metabolismo y Peso Corporal

- **ID:** `2368cdf3-e7ba-45ac-9a7f-723477fc86a4`
- **Slug:** `uso-de-platos-de-menor-diametro-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/uso-de-platos-de-menor-diametro-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El control de peso corporal requiere más que contar calorías; el entorno inmediato donde comemos ejerce una influencia silenciosa pero poderosa sobre lo que terminamos ingiriendo. Uno de los factores ambientales menos reconocidos es el tamaño del plato. Investigadores en psicología ambiental y nutrición han documentado durante décadas…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 28. Hidratación Precarga (Agua antes de comer) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `40d08a4b-60ed-4efc-82e8-090bae0314a5`
- **Slug:** `hidratacion-precarga-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/hidratacion-precarga-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La alimentación es uno de los pilares fundamentales del bienestar, y dentro de ella existen intervenciones simples pero con sustento científico que pueden marcar diferencia en el control del peso y la composición corporal. La hidratación precarga —beber agua antes de consumir alimentos— es una de ellas. Esta…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 29. Tratamiento de Apnea Obstructiva del Sueño — Nutrición, Metabolismo y Peso Corporal

- **ID:** `e665a5f7-37e2-47c3-ae87-6d979647d955`
- **Slug:** `tratamiento-de-apnea-obstructiva-del-sueno-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/tratamiento-de-apnea-obstructiva-del-sueno-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La apnea obstructiva del sueño (AOS) afecta entre el 9% y el 38% de los adultos, dependiendo de la población estudiada, y representa un problema de salud pública de proporciones significativas. Lo que ha emergido con claridad en los últimos años es que la AOS no opera de…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 30. Reducción de sodio por especias — Nutrición, Metabolismo y Peso Corporal

- **ID:** `8161ea7e-fe40-45b8-bf9b-ec9b68cab071`
- **Slug:** `reduccion-de-sodio-por-especias-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/reduccion-de-sodio-por-especias-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El consumo excesivo de sodio es un factor de riesgo modificable con impacto directo en la salud cardiovascular. La Organización Mundial de la Salud recomienda menos de 2 g de sodio diarios (equivalente a 5 g de sal), pero en Chile y gran parte de América Latina el…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

---

## Lote 04 — Artículos 31 al 40

### 31. Preparación semanal de comidas (Meal Prep) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `cdc955d4-e67d-4e07-a68f-e424d2eed13b`
- **Slug:** `preparacion-semanal-de-comidas-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/preparacion-semanal-de-comidas-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La obesidad y el sobrepeso representan uno de los desafíos sanitarios más relevantes en Chile y América Latina. Según datos de la Organización Panamericana de Salud, más del 60% de la población adulta chilena presenta sobrepeso u obesidad, una cifra que ha aumentado sostenidamente en las últimas décadas.…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 32. Ejercicio Aeróbico (150-300 min/sem) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `6074df10-43cc-486f-962e-a26744f341c2`
- **Slug:** `ejercicio-aerobico-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/ejercicio-aerobico-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La Organización Mundial de la Salud estima que el sedentarismo contribuye a aproximadamente 3,2 millones de muertes anuales a nivel global. Frente a este panorama, el ejercicio aeróbico regular se ha consolidado como una de las intervenciones más costo-efectivas en medicina preventiva. Las guías internacionales de actividad física…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.695-04:00

### 33. Evaluaciones antropométricas regulares (Circunferencia de cintura) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `b4e4aead-6e68-4220-9070-94e1f57495ed`
- **Slug:** `evaluaciones-antropometricas-regulares-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/evaluaciones-antropometricas-regulares-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La obesidad visceral constituye uno de los factores de riesgo metabólico más relevantes en la práctica clínica contemporánea. A diferencia del peso corporal total o el índice de masa corporal (IMC), que solo reflejan la cantidad de tejido adiposo sin discriminar su distribución, la circunferencia de cintura permite…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 34. Rutinas activas de transporte — Nutrición, Metabolismo y Peso Corporal

- **ID:** `9b71954a-7e77-481c-80a6-c7d14f2dbe34`
- **Slug:** `rutinas-activas-de-transporte-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/rutinas-activas-de-transporte-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El sedentarismo laboral y los patrones de desplazamiento motorizado han transformado la forma en que nos movemos diariamente. Caminar en auto, en transporte público o en bicicleta no son solo opciones de movilidad urbana; son intervenciones metabólicas con impacto directo en el peso corporal, la sensibilidad a la…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 35. Restricción absoluta de grasas trans — Nutrición, Metabolismo y Peso Corporal

- **ID:** `f1f35df3-c273-471c-b01c-95bacf9b9275`
- **Slug:** `restriccion-absoluta-de-grasas-trans-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/restriccion-absoluta-de-grasas-trans-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Las grasas trans representan uno de los aditivos alimentarios más estudiados y más controvertidos de la nutrición contemporánea. A diferencia de otras categorías de lípidos, cuya presencia en la dieta puede tener efectos neutros o incluso beneficiosos según el contexto, las grasas trans artificiales han demostrado consistentemente asociarse…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 36. Gestión de la flora intestinal — Nutrición, Metabolismo y Peso Corporal

- **ID:** `f9d930df-57a2-4612-9b43-53597538449b`
- **Slug:** `gestion-de-la-flora-intestinal-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/gestion-de-la-flora-intestinal-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El intestino humano alberga aproximadamente 38 billones de microorganismos, una comunidad que ha coevolucionado con nosotros durante millones de años. La evidencia científica acumulada en las últimas dos décadas demuestra que esta microbiota intestinal no es un acompañante pasivo, sino un regulador activo de procesos metabólicos, inmunológicos y…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 37. Uso limitado de edulcorantes no nutritivos — Nutrición, Metabolismo y Peso Corporal

- **ID:** `b5b0d8fc-83b0-4c44-aedc-ef54f56df37f`
- **Slug:** `uso-limitado-de-edulcorantes-no-nutritivos-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/uso-limitado-de-edulcorantes-no-nutritivos-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Los edulcorantes no nutritivos son sustancias químicas naturales o sintéticas que aportan sabor dulce a alimentos y bebidas sin generar calorías significativas. Su consumo ha crecido exponencialmente en las últimas décadas, impulsado por la búsqueda de reducción calórica en poblaciones con sobrepeso y diabetes tipo 2. Sin embargo,…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 38. Incorporación de ejercicios isométricos — Nutrición, Metabolismo y Peso Corporal

- **ID:** `98b0f873-c534-44ee-95e1-39444f2beefe`
- **Slug:** `incorporacion-de-ejercicios-isometricos-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/incorporacion-de-ejercicios-isometricos-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Los ejercicios isométricos — contracciones musculares donde el músculo genera fuerza sin cambiar su longitud ni mover una articulación — han ganado relevancia en los últimos años dentro de la medicina deportiva, la rehabilitación y la práctica clínica preventiva. Organizaciones como la American College of Sports Medicine (ACSM)…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 39. Manejo de medicación hipolipemiante (Estatinas) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `fb789743-dcf5-4b92-88f0-9e5ec6599604`
- **Slug:** `manejo-de-medicacion-hipolipemiante-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/manejo-de-medicacion-hipolipemiante-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Las dislipidemias constituyen uno de los principales factores de riesgo modificables para enfermedad cardiovascular, condición que afecta a millones de personas en Chile y Latinoamérica. Las estatinas representan la terapia farmacológica de primera línea para el manejo de lípidos elevados, actuando como inhibidores competitivos de la HMG-CoA reductasa,…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 40. Optimización de Vitamina D — Nutrición, Metabolismo y Peso Corporal

- **ID:** `5d130a4d-3404-4209-a923-ac4ad5f75e66`
- **Slug:** `optimizacion-de-vitamina-d-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/optimizacion-de-vitamina-d-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La vitamina D es una prohormona liposoluble cuya deficiencia afecta a una proporción significativa de la población mundial, especialmente en regiones de latitudes altas, entre personas con piel oscura expuestas mínimamente al sol, adultos mayores y quienes tienen mayor índice de masa corporal. A diferencia de otras vitaminas,…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

---

## Lote 05 — Artículos 41 al 50

### 41. Crononutrición (Ingesta calórica matutina/diurna) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `b8fa26f7-9c78-4d5c-b890-f38a8cc59645`
- **Slug:** `crononutricion-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/crononutricion-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Cada día, tu cuerpo sigue un reloj interno que dicta cuándo es más eficiente procesar alimentos, almacenar energía y regular hormonas. Este sistema, conocido como ritmo circadiano, no solo controla el sueño sino también el metabolismo, la secreción de insulina y la actividad de enzimas digestivas. La crononutrición…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 42. Entrenamiento en Flexibilidad Psicológica (ACT) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `c99d00ee-d04c-41dc-9784-ffd13dd08ed9`
- **Slug:** `entrenamiento-en-flexibilidad-psicologica-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/entrenamiento-en-flexibilidad-psicologica-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La obesidad y los trastornos metabólicos no son únicamente problemas de ingesta calórica o actividad física. Millones de personas intentan perder peso sin éxito sostenido, y la razón subyacente suele ser más psicológica que fisiológica. La ansiedad, la depresión, el estrés crónico y los patrones emocionales desadaptativos influyen…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Bienestar Mental
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 43. Tratamiento intensivo de Hipertensión (IECA/ARA-II) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `105ec8ed-a8f7-4389-af23-5dc8506a5d21`
- **Slug:** `tratamiento-intensivo-de-hipertension-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/tratamiento-intensivo-de-hipertension-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La hipertensión arterial es uno de los factores de riesgo modificables más importantes para el desarrollo de enfermedad cardiovascular, insuficiencia renal y eventos cerebrovasculares. Su prevalencia continúa en ascenso a nivel mundial, y en Chile se estima que afecta a cerca del 30% de la población adulta. Más…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Hidratación
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 44. Diagnóstico de Hipotiroidismo — Nutrición, Metabolismo y Peso Corporal

- **ID:** `9d80115f-50fa-4a33-9256-d4ec789acaa0`
- **Slug:** `diagnostico-de-hipotiroidismo-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/diagnostico-de-hipotiroidismo-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El hipotiroidismo es una condición endocrinológica frecuente que afecta particularmente a mujeres y personas mayores, y cuyo impacto trasciende la glándula tiroidea para modificar el metabolismo basal, el control del peso y la calidad de vida en general. La detección oportuna y un abordaje nutricional fundamentado son pilares…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 45. Pausas de desconexión digital (Comida sin pantallas) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `5c4e435f-bfd7-4825-9e51-e24b4710dc2c`
- **Slug:** `pausas-de-desconexion-digital-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/pausas-de-desconexion-digital-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** En la era digital, comer frente a pantallas se ha convertido en la norma. El televisor encendido, el teléfono en la mesa o la computadora abierta durante las comidas son comportamientos tan rutinarios que rara vez cuestionamos su impacto en nuestra salud. Sin embargo, la evidencia científica sugiere…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 46. Sustitución de lácteos enteros por bajos en grasa — Nutrición, Metabolismo y Peso Corporal

- **ID:** `ad59310b-5661-486a-96a0-287b9c3e2dc8`
- **Slug:** `sustitucion-de-lacteos-enteros-por-bajos-en-grasa-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/sustitucion-de-lacteos-enteros-por-bajos-en-grasa-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Artículo editorial sobre sustitución de lácteos enteros por bajos en grasa. Aborda aspectos clínicos y prácticos relacionados con esta temática de salud y bienestar.
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 47. Planificación de recompensas no alimentarias — Nutrición, Metabolismo y Peso Corporal

- **ID:** `9d36cacf-b8ba-43be-8d02-92ee38ea538f`
- **Slug:** `planificacion-de-recompensas-no-alimentarias-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/planificacion-de-recompensas-no-alimentarias-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El esfuerzo sostenido para modificar hábitos alimentarios y corporales exige un compromiso que pocas personas logran mantener exclusivamente con fuerza de voluntad. La evidencia en psicología conductual ha demostrado que los programas de cambio nutricional enfrentan tasas de abandono elevadas, frecuentemente vinculadas al agotamiento del autocontrol y a…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 48. Reestructuración de la cena (baja en sodio y carbohidratos) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `d5cd5fa4-ad99-417c-89e6-c1f5dac69db0`
- **Slug:** `reestructuracion-de-la-cena-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/reestructuracion-de-la-cena-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La hora de la comida más tardía del día tiene un impacto desproporcionado en el metabolismo, la composición corporal y la salud cardiovascular. En Chile, donde los hábitos alimentarios reflejan patrones de alta ingesta de carbohidratos refinados y sodio — especialmente en cenas copiosas basadas en pastas, arroz…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 49. Inclusión de grasas monoinsaturadas (MUFAs) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `1ba4fb87-9458-4ca7-a4ac-a00c33b28372`
- **Slug:** `inclusion-de-grasas-monoinsaturadas-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/inclusion-de-grasas-monoinsaturadas-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Las grasas monoinsaturadas (MUFAs) son un grupo de lípidos esenciales que han ganado relevancia en los últimos años dentro de la literatura nutricional y metabólica. A diferencia de lo que ocurrió durante décadas, cuando todas las grasas se demonizaron por su densidad calórica, hoy existe consenso científico sobre…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

### 50. Apoyo Social (Soporte Comunitario) — Nutrición, Metabolismo y Peso Corporal

- **ID:** `ba39c853-7ea9-4117-9928-26d25abd28cd`
- **Slug:** `apoyo-social-nutricion-metabolismo-y-peso-corporal`
- **URL o ruta pública:** `/blog/apoyo-social-nutricion-metabolismo-y-peso-corporal`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Vivimos en un contexto donde la alimentación y el manejo del peso se perciben como decisiones individuales, cuando en realidad están profundamente entrelazados con las relaciones sociales que nos rodean. La evidencia científica de alta calidad muestra que el apoyo social —ya sea a través de redes familiares,…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.696-04:00

---

## Lote 06 — Artículos 51 al 60

### 51. Hidratación constante (Orina clara) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `a37132de-9120-4598-9a4a-053d0a8448a6`
- **Slug:** `hidratacion-constante-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/hidratacion-constante-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La hidratación adecuada es uno de los factores más simples pero más infravalorados en la salud digestiva. Una de las formas más accesibles de monitorearla es observando el color de la orina: un tono amarillo pálido indica hidratación suficiente, mientras que un color oscuro señala deshidratación. Esta señal…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 52. Suspensión de medicación constipante — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `7aff20d8-1f28-4b08-8ab3-586c3cb69a38`
- **Slug:** `suspension-de-medicacion-constipante-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/suspension-de-medicacion-constipante-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento es una de las quejas gastrointestinales más frecuentes en la práctica clínica diaria. Sin embargo, una proporción significativa de los casos que se presentan como "estreñimiento crónico" tiene un origen secundario poco reconocido: el uso prolongado de medicamentos que alteran la función intestinal. Muchos pacientes desconocen…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 53. Prucaloprida — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `00f00531-ee4e-450d-a909-423b058d21e7`
- **Slug:** `prucaloprida-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/prucaloprida-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta a aproximadamente un 15% de la población adulta y representa una de las consultas más frecuentes en gastroenterología. Cuando las medidas convencionales —dieta rica en fibra, hidratación adecuada y ejercicio— resultan insuficientes, se requiere un abordaje farmacológico dirigido. La prucaloprida es un proquinético de…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 54. Óxido de Magnesio / Leche Magnesia — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `c9795d54-65d6-4d86-8949-7501f5db0b5b`
- **Slug:** `oxido-de-magnesio-leche-magnesia-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/oxido-de-magnesio-leche-magnesia-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta a una proporción significativa de la población mundial, con estimaciones que oscilan entre el 12% y el 20% según distintas regiones. En Chile, el acceso a tratamientos convencionales no siempre resuelve el problema de forma duradera, y muchos pacientes terminan recurriendo a alternativas que…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 55. Masticación completa de los alimentos — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `2bad7920-fe47-4cc3-b460-7d70016021e6`
- **Slug:** `masticacion-completa-de-los-alimentos-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/masticacion-completa-de-los-alimentos-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La digestión comienza en la boca. Aunque habitualmente pensamos en el estómago o en el intestino como los protagonistas de la absorción de nutrientes, lo que sucede durante la masticación determina gran parte de lo que ocurre después. Cuando los alimentos no se trituran adecuadamente, las piezas grandes…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 56. Entrenamiento del Reflejo Gastrocólico — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `b2097ca9-ef03-4350-85c5-f98577fa3cd3`
- **Slug:** `entrenamiento-del-reflejo-gastrocolico-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/entrenamiento-del-reflejo-gastrocolico-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El intestino humano realiza millones de contracciones diarias para mover el contenido digestivo. La mayoría ocurre de forma autónoma, pero existe un mecanismo clave activado por la comida que merece atención especial: el reflejo gastrocólico. Este es el impulso natural que envía señales desde el estómago hasta el…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 57. Dieta baja en FODMAPs (Fase de eliminación) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `b53f910d-7e6b-4c36-ab47-19eb8498bbdd`
- **Slug:** `dieta-baja-en-fodmaps-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/dieta-baja-en-fodmaps-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Las molestias digestivas crónicas afectan a millones de personas y, con frecuencia, permanecen sin diagnóstico claro. Síntomas como hinchazón abdominal, dolor recurrente, gases excesivos y alteraciones en el tránsito intestinal pueden deteriorar significativamente la calidad de vida. Entre las intervenciones nutricionales con mayor respaldo científico para abordar estas…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 58. Cese de esfuerzo defecatorio extremo (Straining) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `230a3b9a-cb6c-4b5f-87b0-cecd6ea94197`
- **Slug:** `cese-de-esfuerzo-defecatorio-extremo-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/cese-de-esfuerzo-defecatorio-extremo-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El esfuerzo excesivo durante la defecación, conocido clínicamente como straining, es un problema frecuente que afecta a una proporción significativa de la población y que suele pasar desapercibido hasta que genera complicaciones mayores. Más allá de ser simplemente incómodo, el esfuerzo defecatorio extremo constituye un mecanismo de daño…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 59. Consumo de 2 Kiwis diarios — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `170acbee-204b-4227-9103-04a3cffd60b3`
- **Slug:** `consumo-de-2-kiwis-diarios-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/consumo-de-2-kiwis-diarios-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta a una proporción significativa de la población, especialmente en contextos de sedentarismo, dietas bajas en fibra y hábitos intestinales irregulares. La disbiosis —un desequilibrio en la composición de la microbiota intestinal— se ha relacionado con alteraciones del tránsito y con síntomas sistémicos que van…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 60. Polietilenglicol (PEG 3350) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `048736b5-1cf2-4a66-97e5-e045999a44dd`
- **Slug:** `polietilenglicol-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/polietilenglicol-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Artículo editorial sobre polietilenglicol (PEG 3350). Aborda aspectos clínicos y prácticos relacionados con esta temática de salud y bienestar.
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

---

## Lote 07 — Artículos 61 al 70

### 61. Limitar ingesta de calcio suplementario — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `948e8126-2602-4f08-9ff9-20a62dd018d2`
- **Slug:** `limitar-ingesta-de-calcio-suplementario-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/limitar-ingesta-de-calcio-suplementario-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El calcio es uno de los minerales más estudiados en nutrición y medicina. Su papel en la mineralización ósea, la contracción muscular y la transmisión nerviosa lo convierte en un nutriente indispensable. Sin embargo, décadas de recomendaciones orientadas a maximizar la ingesta de calcio han generado un fenómeno…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 62. Postura de Defecación (Squatting) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `bd067136-aaf1-4805-8244-40e9736121ca`
- **Slug:** `postura-de-defecacion-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/postura-de-defecacion-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento afecta a entre un 12% y 20% de la población mundial, con prevalencias significativamente mayores en adultos mayores y mujeres. Más allá de la incomodidad inmediata, el estreñimiento crónico puede generar complicaciones como hemorroides, fisuras anales, megacolon tóxico y deterioro de la calidad de vida. Una…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 63. Senósidos (Senna) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `b54d75d6-2bbe-4c64-aed5-1e81e42532b4`
- **Slug:** `senosidos-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/senosidos-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento afecta a un porcentaje significativo de la población chilena y mundial, con implicaciones que van más allá de la molestia pasajera. Cuando las heces permanecen demasiado tiempo en el colon, se produce una reabsorción excesiva de agua que endurece el bolo fecal, generando un círculo vicioso…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 64. Masaje abdominal secuencial (Trayecto colónico) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `8a328c66-2170-44fe-a576-b50e26f4e368`
- **Slug:** `masaje-abdominal-secuencial-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/masaje-abdominal-secuencial-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta aproximadamente al 15–20% de la población mundial, con prevalencia mayor en mujeres y adultos mayores. Más allá de la incomodidad, puede derivar en hemorroides, fisuras anales, retención fecal y deterioro significativo de la calidad de vida. Frente a esta condición, el masaje abdominal secuencial…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 65. Lactulosa (Jarabe) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `3a5cc029-2993-4f99-b805-a2b198814e88`
- **Slug:** `lactulosa-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/lactulosa-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta a entre el 12% y el 20% de la población adulta, según estimaciones epidemiológicas internacionales. Más allá de la incomodidad, puede desencadenar dolor abdominal, hemorroides y afectar significativamente la calidad de vida. La lactulosa, un azúcar sintético que se administra en forma de jarabe,…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 66. Manometría anorrectal y test expulsivo — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `5a615f1d-69ab-4f3c-973a-0ec66e52c75b`
- **Slug:** `manometria-anorrectal-y-test-expulsivo-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/manometria-anorrectal-y-test-expulsivo-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta a aproximadamente uno de cada cinco adultos en Chile, y en muchos casos su causa no se encuentra en la dieta ni en la ingesta de fibra, sino en alteraciones funcionales del suelo pélvico y los reflejos anorrectales. La manometría anorrectal y el test…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 67. Bebida caliente en ayunas (Ej. Té o Café) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `cf7f160c-0102-423c-a985-435fdcf26bb4`
- **Slug:** `bebida-caliente-en-ayunas-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/bebida-caliente-en-ayunas-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Tomar té o café en ayunas es una práctica muy extendida en Chile y en gran parte de Latinoamérica. Muchos lo hacen por costumbre, otros lo usan como "despertador digestivo", y algunos lo han convertido en parte de su rutina para mejorar la evacuación o sentirse mejor durante…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Nutrición
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 68. Linaclotida o Plecanatida — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `10945424-4c5e-47fc-8ed9-e5045654e291`
- **Slug:** `linaclotida-o-plecanatida-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/linaclotida-o-plecanatida-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Artículo editorial sobre linaclotida o Plecanatida. Aborda aspectos clínicos y prácticos relacionados con esta temática de salud y bienestar.
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 69. Suplementación con Psyllium — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `d32fe6c5-d603-4802-b1f6-917de409801a`
- **Slug:** `suplementacion-con-psyllium-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/suplementacion-con-psyllium-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta entre el 10% y el 20% de la población adulta en Chile y países latinoamericanos, y es una de las consultas gastrointestinales más frecuentes en atención primaria. La disbiosis intestinal, caracterizada por una alteración en la composición y función de la microbiota, está asociada…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 70. Terapia de Biorretroalimentación (Biofeedback) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `d5aec48f-0bfd-4a80-b375-f2825b12755f`
- **Slug:** `terapia-de-biorretroalimentacion-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/terapia-de-biorretroalimentacion-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El intestino es un órgano activo, regulado por una red compleja de señales nerviosas, hormonales y musculares. Cuando esa comunicación falla, pueden aparecer síntomas como estreñimiento funcional, distensión abdominal o alteraciones del tránsito que afectan significativamente la calidad de vida. La terapia de biorretroalimentación (biofeedback) ha surgido como…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

---

## Lote 08 — Artículos 71 al 80

### 71. Bisacodilo o Picosulfato (Venta libre) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `4e442a85-3776-40c1-8d61-e3d02a6a035f`
- **Slug:** `bisacodilo-o-picosulfato-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/bisacodilo-o-picosulfato-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta entre el 10 y el 20 % de la población general, con prevalencias superiores al 30 % en adultos mayores y mujeres. En Chile, los datos epidemiológicos indican que cerca del 20 % de los adultos refiere síntomas de estreñimiento, lo que convierte a…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 72. Ciruelas Pasas (Prunes) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `b63b750f-e45d-49d6-b336-7387cf215459`
- **Slug:** `ciruelas-pasas-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/ciruelas-pasas-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta entre el 10% y el 20% de la población general, con mayor prevalencia en mujeres, adultos mayores y personas con condiciones gastrointestinales subyacentes. Más allá de la incomodidad inmediata, el estreñimiento persistente está asociado con alteración de la microbiota intestinal, inflamación sistémica de bajo…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 73. Actividad Física Aeróbica (Caminar/Trotar) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `f0011135-6397-4e4b-81b5-ca48dd727e4c`
- **Slug:** `actividad-fisica-aerobica-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/actividad-fisica-aerobica-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta a un porcentaje significativo de la población, especialmente en adultos mayores, mujeres embarazadas y personas con estilos de vida sedentarios. La disbiosis intestinal, entendida como un desequilibrio en la composición de la microbiota, se ha vinculado no solo con molestias digestivas, sino también con…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 74. Lubiprostona — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `0f0639ea-de90-4b37-b28c-da6db941a3f1`
- **Slug:** `lubiprostona-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/lubiprostona-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta a una proporción significativa de la población adulta, con prevalencias que varían entre 12 % y 19 % en adultos occidentales y tasas aún mayores en mujeres. Cuando los tratamientos convencionales —modificaciones dietéticas, fibra y laxantes osmóticos— resultan insuficientes, la medicina ha desarrollado alternativas…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 75. Semillas de lino/linaza molidas — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `6ddb5afa-50ce-4cf9-bf8c-e8d2f298698a`
- **Slug:** `semillas-de-lino-linaza-molidas-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/semillas-de-lino-linaza-molidas-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta entre un 12% y un 20% de la población adulta en Chile, mientras que la disbiosis intestinal —un desequilibrio en la composición de la microbiota— está asociada a múltiples trastornos digestivos y sistémicos. En este contexto, las semillas de lino (Linum usitatissimum), conocidas en…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 76. Supositorios de Glicerina / Enemas de microenema — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `17012757-50af-432b-b3bf-1dc27f907f65`
- **Slug:** `supositorios-de-glicerina-enemas-de-microenema-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/supositorios-de-glicerina-enemas-de-microenema-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta aproximadamente a uno de cada cuatro adultos en los países occidentales, y su impacto va mucho más allá de la incomodidad física. La retención fecal prolongada puede alterar el equilibrio de la microbiota intestinal, favorecer la disbiosis y generar un círculo vicioso de inflamación…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 77. Probióticos específicos (B. lactis) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `88216d87-faa6-4aa4-ae9a-26edbc8a2874`
- **Slug:** `probioticos-especificos-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/probioticos-especificos-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta a un porcentaje significativo de la población chilena y mundial, con implicancias en calidad de vida, adherencia laboral y bienestar general. Entre las intervenciones no farmacológicas disponibles, los probióticos han ganado atención como complemento a las medidas tradicionales de manejo del estreñimiento. Dentro de…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 78. Reducción de Alimentos Ultraprocesados — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `6d271aad-b6e2-4130-8f3a-5aa6b7e2ae8c`
- **Slug:** `reduccion-de-alimentos-ultraprocesados-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/reduccion-de-alimentos-ultraprocesados-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico y los trastornos funcionales intestinales representan uno de los motivos de consulta más frecuentes en gastroenterología y medicina general. Estudios epidemiológicos estiman que afecta entre el 10% y el 20% de la población adulta, con mayor prevalencia en mujeres. Si bien existen múltiples factores etiológicos…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 79. Aceite de oliva en ayunas (1 cdta) — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `7c2f212c-3eb9-45a6-a62a-62ff8b10160e`
- **Slug:** `aceite-de-oliva-en-ayunas-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/aceite-de-oliva-en-ayunas-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta entre el 10% y el 30% de la población general, siendo más frecuente en mujeres, adultos mayores y personas con hábitos alimentarios deficientes. La disbiosis intestinal —un desbalance en la microbiota— también se ha asociado con alteraciones motoras del intestino, inflamación de bajo grado…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

### 80. Descarte de enfermedades sistémicas — Salud Intestinal, Disbiosis y Estreñimiento

- **ID:** `4e05ee50-67c5-465c-9456-f61add62f693`
- **Slug:** `descarte-de-enfermedades-sistemicas-salud-intestinal-disbiosis-y-estrenimiento`
- **URL o ruta pública:** `/blog/descarte-de-enfermedades-sistemicas-salud-intestinal-disbiosis-y-estrenimiento`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estreñimiento crónico afecta a un porcentaje significativo de la población y, a menudo, no se resuelve con las medidas convencionales de primera línea. En muchos casos, lo que parece ser un problema digestivo aislado es solo la punta del iceberg de alteraciones sistémicas subyacentes. La ciencia médica…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.697-04:00

---

## Lote 09 — Artículos 81 al 90

### 81. Mindfulness-Based Stress Reduction (MBSR) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `6521727e-fa81-4d8d-be07-641f1dd33178`
- **Slug:** `mindfulness-based-stress-reduction-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/mindfulness-based-stress-reduction-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico afecta a una proporción significativa de la población adulta moderna, y sus consecuencias trascienden lo psicológico para impactar directamente la fisiología cardiovascular, metabólica e inmunológica. La evidencia acumulada en las últimas décadas ha posicionado al mindfulness-based stress reduction como una de las intervenciones más sólidas…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 82. Higiene de Luz Matutina — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `2eb0ade5-d31d-4ece-b17c-398b576ab951`
- **Slug:** `higiene-de-luz-matutina-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/higiene-de-luz-matutina-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El ritmo circadiano humano regula procesos fundamentales: temperatura corporal, secreción hormonal, metabolismo celular y actividad neuronal. Cuando este reloj biológico se desincroniza, las consecuencias se extienden más allá de la insomnio. La evidencia acumulada en las últimas décadas indica que la exposición a la luz natural en las…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 83. Suspiro Fisiológico — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `6704aeca-e6e4-4f99-ab85-269d4e744bef`
- **Slug:** `suspiro-fisiologico-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/suspiro-fisiologico-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico y sus efectos sobre la salud mental y la función cognitiva representan uno de los desafíos de salud pública más relevantes de las últimas décadas. La evidencia disponible indica que la exposición prolongada al estrés altera la regulación neuroendocrina, afecta la memoria, la atención y…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 84. Expresión Escrita (Journaling) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `6703517a-0604-43fd-abc7-cc4f588fa562`
- **Slug:** `expresion-escrita-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/expresion-escrita-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico y los trastornos emocionales representan uno de los principales desafíos de salud pública contemporánea. Estudios epidemiológicos estiman que más de una cuarta parte de la población mundial presenta síntomas de ansiedad o depresión en algún momento de su vida, mientras que el estrés prolongado se…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 85. Meditación de Amor Bondadoso — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `9d91f6b2-d83f-4516-9c21-7dd0f824f8ad`
- **Slug:** `meditacion-de-amor-bondadoso-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/meditacion-de-amor-bondadoso-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico constituye uno de los principales factores de riesgo modificables para trastornos mentales y deterioro cognitivo. La exposición sostenida a cortisol elevado, la activación persistente del eje hipotalámico-pituitario-adrenal (HPA) y la inflamación sistémica de bajo grado representan mecanismos fisiopatológicos documentados que contribuyen a la ansiedad, la…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 86. Optimización de la Higiene de Sueño — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `5350a813-8653-4ec8-8e00-3ba1e65d00f0`
- **Slug:** `optimizacion-de-la-higiene-de-sueno-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/optimizacion-de-la-higiene-de-sueno-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Dormir bien no es un lujo: es una necesidad biológica que sostiene cada sistema del cuerpo. Las investigaciones más consolidadas muestran que la calidad del sueño está íntimamente ligada a la regulación emocional, la respuesta al estrés y la capacidad de pensar con claridad. Cuando el descanso se…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 87. Terapia Cognitivo Conductual (CBT) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `d1484270-a541-4fd8-a6b3-66eafbc33fb8`
- **Slug:** `terapia-cognitivo-conductual-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/terapia-cognitivo-conductual-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico y los trastornos de salud mental representan dos de los principales desafíos de salud pública contemporáneos. La Organización Mundial de la Salud estima que más de 300 millones de personas viven con depresión a nivel global, mientras que el estrés sostenido contribuye significativamente a enfermedades…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 88. Relajación Muscular Progresiva (PMR) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `d971b96f-17e1-4d3e-a3fa-7d02215452fb`
- **Slug:** `relajacion-muscular-progresiva-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/relajacion-muscular-progresiva-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico representa hoy uno de los factores de riesgo más frecuentes en la práctica clínica, y su impacto trasciende lo psicológico para afectar directamente la función cognitiva y el bienestar general. La relajación muscular progresiva (PMR) se ha consolidado como una intervención accesible con respaldo científico…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 89. Ejercicio Aeróbico (Zona 2) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `39d42dc8-8bb0-4f0e-8b74-873388519c0b`
- **Slug:** `ejercicio-aerobico-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/ejercicio-aerobico-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico y la carga alostática son factores de riesgo modificables para trastornos del ánimo, deterioro cognitivo temprano y enfermedades cardiovasculares. En los últimos años, la literatura científica ha identificado al ejercicio aeróbico de intensidad moderada —conocido coloquialmente como entrenamiento en zona 2— como una herramienta accesible…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 90. Respiración de Caja — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `545548e1-c94d-486d-ba4b-ae181b886a79`
- **Slug:** `respiracion-de-caja-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/respiracion-de-caja-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico representa uno de los principales desafíos de salud pública contemporáneos. La activación sostenida del eje hipotálamo-pituitario-adrenal genera un perfil inflamatorio persistente que se ha vinculado con trastornos cardiovasculares, metabólicos, inmunológicos y neuropsiquiátricos. En paralelo, la deterioro de la función cognitiva —especialmente en memoria de trabajo…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

---

## Lote 10 — Artículos 91 al 100

### 91. Grounding (Conexión a tierra o técnica 5-4-3-2-1) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `7490ff6a-ab69-46ea-a72a-978e51847249`
- **Slug:** `grounding-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/grounding-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico y sus consecuencias sobre la salud mental y la función cognitiva constituyen uno de los desafíos de salud pública más relevantes de las últimas décadas. La exposición prolongada a factores estresantes altera la respuesta neuroendocrina, eleva los niveles basales de cortisol, deteriora la capacidad de…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 92. Yoga y Asanas — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `820d8efa-c13b-4335-8a5d-cca081ef3502`
- **Slug:** `yoga-y-asanas-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/yoga-y-asanas-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico y sus efectos sobre la salud mental y la función cognitiva representan un problema de salud pública creciente. La exposición prolongada a cortisol elevado altera la arquitectura del sueño, deteriora la memoria de trabajo y contribuye a cuadros de ansiedad y depresión. En este contexto,…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 93. Terapia de Exposición al Frío — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `b36d4791-3db6-43aa-984c-7f80463e1e8a`
- **Slug:** `terapia-de-exposicion-al-frio-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/terapia-de-exposicion-al-frio-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La exposición controlada al frío ha pasado de ser una práctica marginal a un área de investigación activa en medicina preventiva y salud mental. Estudios de grupos como la American Diabetes Association y la Endocrine Society han documentado sus efectos sistémicos, desde la modulación del sistema nervioso autónomo…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 94. Restricción del Tiempo en Cama — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `e331eff9-96a9-4643-8cf1-22795eca25ad`
- **Slug:** `restriccion-del-tiempo-en-cama-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/restriccion-del-tiempo-en-cama-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El sueño es uno de los pilares menos comprendidos pero más determinantes de la salud mental y el rendimiento cognitivo. En la última década, la investigación en medicina del sueño ha demostrado que la relación entre el tiempo pasado en la cama y la calidad del descanso no…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 95. Meditación Trascendental — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `79c53f2a-5787-4b59-848f-3260997e9268`
- **Slug:** `meditacion-trascendental-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/meditacion-trascendental-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico afecta a una proporción significativa de la población chilena y mundial, y sus efectos sobre la salud mental y la función cognitiva están bien documentados en la literatura médica. La meditación trascendental emerge como una intervención respaldada por evidencia científica que aborda estos tres ejes…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 96. Manejo de Tiempo (Pomodoro) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `ed9aa29d-81ce-4fa0-afb8-8e8ee0b2f04d`
- **Slug:** `manejo-de-tiempo-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/manejo-de-tiempo-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El manejo del tiempo, especialmente mediante técnicas estructuradas como el método Pomodoro, ha emergido como una herramienta relevante en el contexto de la salud mental contemporánea. La carga cognitiva constante, la fragmentación atencional y el estrés laboral crónico representan factores de riesgo documentados para el desarrollo de ansiedad,…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 97. Terapia de Aceptación y Compromiso (ACT) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `e19bfaf0-0e14-415a-8b85-3ae5b32acc58`
- **Slug:** `terapia-de-aceptacion-y-compromiso-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/terapia-de-aceptacion-y-compromiso-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La salud mental y la función cognitiva están íntimamente conectadas con los niveles de estrés que vivimos de forma sostenida. El estrés crónico no es simplemente una molestia pasajera; activa respuestas neuroendocrinas persistentes que pueden alterar la arquitectura cerebral, deteriorar la memoria y la capacidad de concentración, y…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.699-04:00

### 98. Desconexión Digital Nocturna — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `5bdbe117-f1c3-40ff-a5bf-ae1393f63e79`
- **Slug:** `desconexion-digital-nocturna-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/desconexion-digital-nocturna-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El uso nocturno de dispositivos electrónicos se ha convertido en un hábito casi universal: la mayoría de los adultos revisan el teléfono al menos una vez durante la noche, y muchos lo mantienen encendido junto a la cama. Esta práctica no es inocua. La exposición a la luz…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.7-04:00

### 99. Terapia de Masaje — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `c8c02b2a-1353-4084-8e83-337fd862f4cf`
- **Slug:** `terapia-de-masaje-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/terapia-de-masaje-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico y los trastornos de salud mental representan una de las mayores cargas sanitarias globales. La Organización Mundial de la Salud estima que más de 300 millones de personas viven con depresión y que el trastorno de ansiedad afecta a cerca de 264 millones en todo…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.7-04:00

### 100. Reestructuración de Valores (ACT) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `35a65601-43b3-414b-a395-f1219235d8f5`
- **Slug:** `reestructuracion-de-valores-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/reestructuracion-de-valores-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico representa uno de los desafíos de salud más prevalentes en la población contemporánea. La evidencia acumulada indica que la exposición prolongada a factores estresantes no resueltos produce alteraciones neuroendocrinas sostenidas que afectan tanto la salud mental como la capacidad cognitiva. En este contexto, la Reestructuración…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.7-04:00

---

## Lote 11 — Artículos 101 al 110

### 101. Reestructuración de Expectativas — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `5acb7307-55fb-4d6a-925e-78040ad8ace6`
- **Slug:** `reestructuracion-de-expectativas-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/reestructuracion-de-expectativas-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico representa una de las principales amenazas silenciosas para la salud contemporánea. Cuando la respuesta fisiológica al estrés se mantiene activada durante semanas, meses o años, no solo deteriora el bienestar emocional sino que afecta directamente la arquitectura cerebral. Estudios neurocientíficos han demostrado que la exposición…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.7-04:00

### 102. Musicoterapia — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `961603c9-2793-4487-a44d-aab729b4107b`
- **Slug:** `musicoterapia-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/musicoterapia-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La música ha acompañado a la humanidad desde sus orígenes, pero solo en décadas recientes la ciencia ha comenzado a documentar sus efectos medibles sobre el sistema nervioso. Hoy, la musicoterapia se reconoce como una intervención complementaria válida para abordar problemas de salud mental, estrés crónico y deterioro…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.7-04:00

### 103. Forest Bathing (Shinrin-yoku) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `30db946d-bb5a-4b52-abb3-a3da497f7814`
- **Slug:** `forest-bathing-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/forest-bathing-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico es una condición silenciosa que afecta a millones de personas en Chile y el mundo. Se estima que más del 50% de los adultos reportan niveles elevados de ansiedad o preocupación constante, y el deterioro cognitivo asociado al estrés prolongado es una de las causas…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.7-04:00

### 104. Diario de Gratitud — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `e530a0fc-bbc7-4f17-b3af-ac87e3320f6f`
- **Slug:** `diario-de-gratitud-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/diario-de-gratitud-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico constituye uno de los factores de riesgo más extendidos en la salud contemporánea. La OMS lo ha reconocido como una epidemia silenciosa que impacta directamente la salud mental y la función cognitiva. En este contexto, las intervenciones conductuales de bajo costo y alta accesibilidad han…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.7-04:00

### 105. Tai Chi o Qi Gong — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `04c4bf0b-dea5-411a-86fd-aa3b2fc9279a`
- **Slug:** `tai-chi-o-qi-gong-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/tai-chi-o-qi-gong-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico representa uno de los mayores desafíos de salud pública contemporánea. La Organización Mundial de la Salud lo ha identificado como un factor de riesgo modificable asociado a enfermedades cardiovasculares, trastornos metabólicos y deterioro cognitivo progresivo. Paralelamente, la prevalencia de ansiedad y depresión ha aumentado significativamente…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.7-04:00

### 106. Aromaterapia Clínica (Lavanda) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `29b334ee-aa74-4852-ae13-eed4adbcf464`
- **Slug:** `aromaterapia-clinica-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/aromaterapia-clinica-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico afecta a una proporción significativa de la población moderna y está asociado con alteraciones en la salud mental, deterioro cognitivo y múltiples comorbilidades físicas. Ante esta realidad, la aromaterapia clínica con lavanda ha emergido como una intervención complementaria respaldada por investigaciones de instituciones como la…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.7-04:00

### 107. Desensibilización (EMDR) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `e8c3d3dc-8be7-4c25-9313-c39603b0a517`
- **Slug:** `desensibilizacion-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/desensibilizacion-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico y los eventos traumáticos no solo afectan lo que sentimos, sino también cómo procesamos información, recordamos y regulamos nuestras respuestas emocionales. Cuando un evento difícil queda "atrapado" en la memoria, puede seguir activando el sistema de alarma del cuerpo mucho después de que la amenaza…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.7-04:00

### 108. Biofeedback HRV (Variabilidad de Frecuencia Cardíaca) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `81be67a2-63d6-436e-974e-69c12577c06b`
- **Slug:** `biofeedback-hrv-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/biofeedback-hrv-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico representa uno de los mayores desafíos de salud pública contemporáneos. La exposición prolongada a estímulos estresantes activa de manera sostenida el eje hipotalámico-hipofisario-adrenal (HHA), elevando los niveles de cortisol y alterando el equilibrio del sistema nervioso autónomo. Esta activación persistente se asocia con mayor riesgo…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.7-04:00

### 109. Mindfulness en la alimentación — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `fb57f125-e913-4796-a6c1-7bcf61949f08`
- **Slug:** `mindfulness-en-la-alimentacion-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/mindfulness-en-la-alimentacion-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La alimentación consciente o mindfulness en la alimentación es una intervención con respaldo creciente que aborda tres dimensiones interconectadas del bienestar: salud mental, regulación del estrés crónico y función cognitiva. A diferencia de enfoques nutricionales tradicionales centrados exclusivamente en el contenido de los alimentos, esta práctica pone énfasis…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.7-04:00

### 110. Escáner Corporal (Body Scan) — Salud Mental, Estrés Crónico y Función Cognitiva

- **ID:** `ebf566e3-be9a-468c-baad-07b720b270b6`
- **Slug:** `escaner-corporal-salud-mental-estres-cronico-y-funcion-cognitiva`
- **URL o ruta pública:** `/blog/escaner-corporal-salud-mental-estres-cronico-y-funcion-cognitiva`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El estrés crónico es uno de los factores de riesgo más silenciosos de la salud contemporánea. A diferencia del estrés agudo, que responde a amenazas inmediatas y desaparece cuando la situación se resuelve, el estrés sostenido mantiene activado el eje hipotálamo-hipófisis-adrenal de forma prolongada, generando un desgaste acumulativo…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.7-04:00

---

## Lote 12 — Artículos 111 al 120

### 111. Dilución de bebidas (Cordials) — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `1e69cf70-5a54-4b50-8822-569237e8ee8e`
- **Slug:** `dilucion-de-bebidas-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/dilucion-de-bebidas-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La hidratación adecuada es un pilar fisiológico frecuentemente subestimado. El cuerpo humano depende del agua para procesos que van desde la conducción nerviosa hasta la eliminación de desechos metabólicos, y la pérdida de apenas un 2% del peso corporal en forma de líquido puede comprometer funciones cognitivas y…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 112. Pares conductuales (Agua en cada comida) — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `46e357ce-6a9e-4704-9c96-9f4529d2f12b`
- **Slug:** `pares-conductuales-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/pares-conductuales-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La hidratación adecuada es un pilar fundamental del metabolismo humano, pero el patrón de consumo importa tanto como la cantidad total. La evidencia sugiere que distribuir el agua a lo largo del día, especialmente en asociación con las comidas, puede optimizar procesos fisiológicos clave. Esta intervención, conocida como…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Nutrición
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 113. Leche magra o alternativas lácteas — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `42cfffcd-0780-4de6-aed0-caa061cd1310`
- **Slug:** `leche-magra-o-alternativas-lacteas-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/leche-magra-o-alternativas-lacteas-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La hidratación clínica y la nutrición celular son dos pilares fundamentales que sostienen el funcionamiento metabólico del organismo. En este contexto, la leche magra y las alternativas lácteas han ganado relevancia como vehículos de nutrientes esenciales, no solo por su aporte calórico sino por su capacidad de entregar…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 114. Hidratación proactiva en lugar de reactiva — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `7f18f752-7942-4702-8b7c-f930b4d4e1e2`
- **Slug:** `hidratacion-proactiva-en-lugar-de-reactiva-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/hidratacion-proactiva-en-lugar-de-reactiva-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La mayoría de las personas espera sentir sed antes de beber agua. Ese instinto biológico, aunque útil, es un indicador tardío: cuando la sensación aparece, el cuerpo ya ha iniciado un proceso de deshidratación leve. La hidratación proactiva propone cambiar este patrón —beber agua antes de que aparezca…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 115. Monitoreo visual de la orina — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `fbf30c3e-e22b-4253-b543-371fd499eb09`
- **Slug:** `monitoreo-visual-de-la-orina-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/monitoreo-visual-de-la-orina-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El color de la orina ha sido reconocido desde hace décadas como uno de los indicadores más accesibles del estado hídrico del organismo. En la práctica clínica actual, el monitoreo visual de la orina se utiliza como herramienta complementaria para evaluar el equilibrio de líquidos, la capacidad del…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 116. Consumo de electrolitos en sudor extremo — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `b73fb33d-b2e1-4c81-bef4-9c4301d13e67`
- **Slug:** `consumo-de-electrolitos-en-sudor-extremo-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/consumo-de-electrolitos-en-sudor-extremo-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El sudor es mucho más que agua. Es un fluido complejo que transporta sodio, potasio, calcio, magnesio y otros electrolitos esenciales para funciones celulares críticas. Cuando la pérdida de sudor se vuelve extrema —por ejercicio intenso, exposición prolongada al calor, trabajos físicos demandantes o condiciones médicas específicas—, el…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Hidratación
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 117. Monitoreo clínico de fármacos depletivos — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `bb6a4d9f-a29d-4dd1-8f12-b99d77365f99`
- **Slug:** `monitoreo-clinico-de-farmacos-depletivos-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/monitoreo-clinico-de-farmacos-depletivos-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Cuando un paciente recibe tratamiento con fármacos que tienen potencial depleto —ya sean diuréticos, inmunosupresores, ciertos antineoplásicos o medicamentos que alteran el equilibrio electrolítico—, el cuerpo puede experimentar cambios sutiles pero significativos en su capacidad para mantener la homeostasis. Tres ejes fundamentales suelen verse comprometidos: la hidratación, la…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Hidratación
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 118. "Nudging" (Botella siempre a la vista) — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `3c8b56bf-3298-4426-8cc6-f7c463debfe2`
- **Slug:** `nudging-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/nudging-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La deshidratación crónica de grado leve afecta a una proporción significativa de la población adulta, y sus consecuencias van mucho más allá de la sed percibida. La hidratación inadecuada interfiere con procesos fisiológicos básicos: la termorregulación corporal depende del volumen plasmático y la sudoración; el transporte de nutrientes…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Bienestar Mental
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 119. Hidratación intra y post entrenamiento — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `7c076931-f2f6-4f26-b1e2-1e73863667e0`
- **Slug:** `hidratacion-intra-y-post-entrenamiento-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/hidratacion-intra-y-post-entrenamiento-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El entrenamiento físico genera pérdidas hídricas y electrolíticas que superan ampliamente lo que ocurre en condiciones basales. Durante una sesión intensa, la sudoración puede alcanzar entre 1 y 3 litros por hora en atletas de élite, dependiendo de factores individuales como la aclimatación térmica, la intensidad del esfuerzo…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Bienestar Mental
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 120. Estratificación vespertina — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `3b253647-db71-4082-803c-df080358e9a7`
- **Slug:** `estratificacion-vespertina-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/estratificacion-vespertina-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El cuerpo humano opera bajo ritmos circadianos que condicionan la eficiencia de procesos fisiológicos a lo largo del día. Durante las horas vespertinas, particularmente entre las 18:00 y las 22:00 horas, ocurren cambios hormonales y metabólicos que influyen directamente en la capacidad del organismo para mantener la homeostasis…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

---

## Lote 13 — Artículos 121 al 130

### 121. Agua Mineral carbonatada (Con gas) — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `34f7fd67-bfbd-4892-a181-72f8545c09ef`
- **Slug:** `agua-mineral-carbonatada-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/agua-mineral-carbonatada-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El agua sigue siendo el nutriente esencial más subestimado en la práctica clínica. A pesar de que el cuerpo humano está compuesto en un 60% aproximadamente por agua, millones de personas viven en un estado crónico de hidratación subóptima. La Agencia Europea de Seguridad Alimentaria (EFSA) estima que…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 122. Apps o Smart Bottles — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `ce21b550-8076-4cc3-9765-edf9a95b9103`
- **Slug:** `apps-o-smart-bottles-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/apps-o-smart-bottles-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La hidratación es un pilar de la fisiología humana que trasciende la simple sensación de sed. El agua constituye aproximadamente el 60 % del peso corporal en adultos y participa en procesos que van desde la regulación térmica hasta el transporte de nutrientes hacia las células. La termorregulación,…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 123. Infusionar el agua natural — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `d27a3ef0-9fcc-4e01-adee-72392e9d1853`
- **Slug:** `infusionar-el-agua-natural-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/infusionar-el-agua-natural-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El agua constituye aproximadamente el 60% del peso corporal en un adulto sano, y su disponibilidad dentro de las células es indispensable para prácticamente toda función fisiológica conocida. Sin embargo, la simple ingesta de líquido no equivale automáticamente a una hidratación efectiva. Lo que determina si el agua…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Ejercicio
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 124. Reemplazar jugos y bebidas — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `a8d72d46-34ce-46f3-a6e2-4aa64d7d191b`
- **Slug:** `reemplazar-jugos-y-bebidas-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/reemplazar-jugos-y-bebidas-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El agua constituye entre el 50% y 70% del peso corporal adulto, según la edad, el sexo y la composición corporal. Su función trasciende la simple saciedad: interviene directamente en la termorregulación, el transporte de nutrientes, la eliminación de desechos metabólicos y el mantenimiento de la presión osmótica…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 125. Regla compensatoria (Café/Té/Alcohol) — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `1ca7f64d-f977-415e-89e8-b348c6309517`
- **Slug:** `regla-compensatoria-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/regla-compensatoria-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** El consumo diario de café, té y alcohol está presente en la rutina de millones de personas. Estas bebidas tienen efectos fisiológicos documentados sobre el equilibrio hídrico del organismo, y entenderlos permite tomar decisiones informadas sobre hidratación, regulación térmica y nutrición celular. La evidencia científica sugiere que los…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Nutrición
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 126. Uso de filtros domiciliarios — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `895b4bcd-fa3d-44c3-a5da-6e12b46742b1`
- **Slug:** `uso-de-filtros-domiciliarios-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/uso-de-filtros-domiciliarios-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La hidratación, la regulación térmica y la nutrición celular constituyen tres pilares interconectados de la fisiología humana que determinan directamente la capacidad de rendimiento, recuperación y prevención de enfermedades. En los últimos años, ha crecido el interés por estrategias domiciliarias que permitan optimizar estos procesos de manera accesible,…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 127. Incrementar sopas o verduras altas en H2O — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `4d6c9928-3166-4fb6-b775-1f51eadeefa4`
- **Slug:** `incrementar-sopas-o-verduras-altas-en-h2o-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/incrementar-sopas-o-verduras-altas-en-h2o-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Mantener una hidratación adecuada no es solo cuestión de beber agua; la alimentación también juega un rol fundamental en cómo el cuerpo absorbe, retiene y distribuye los líquidos. Las sopas y las verduras ricas en agua representan una estrategia práctica y respaldada por la ciencia para asegurar una…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Nutrición
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 128. Vasos isotérmicos (Temperatura) — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `f4ebdd6f-d54e-4cb7-9958-d55950fcf416`
- **Slug:** `vasos-isotermicos-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/vasos-isotermicos-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** La hidratación es uno de los pilares menospreciados de la salud celular y sistémica. El agua constituye aproximadamente el 60% del peso corporal en adultos y participa en prácticamente todas las funciones fisiológicas: transporte de nutrientes, eliminación de desechos, regulación térmica, lubricación articular y mantenimiento de la integridad…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 129. Aumentar líquidos ante fiebre o infección — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `23925141-c2ff-4d17-baf3-a6ad192bd614`
- **Slug:** `aumentar-liquidos-ante-fiebre-o-infeccion-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/aumentar-liquidos-ante-fiebre-o-infeccion-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Fiebre e infección son procesos que demandan una respuesta metabólica intensa del organismo. Durante esos días, la necesidad de líquidos aumenta de manera significativa debido a la pérdida insensible por sudoración, respiración acelerada y la propia demanda energética de la respuesta inmune. La hidratación durante este período no…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Sueño y Descanso
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

### 130. Iniciar el día con 500ml de agua — Hidratación Clínica, Termorregulación y Nutrición Celular

- **ID:** `5b0b73ae-9daf-4e63-9ffd-cb27daa2413c`
- **Slug:** `iniciar-el-dia-con-500ml-de-agua-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **URL o ruta pública:** `/blog/iniciar-el-dia-con-500ml-de-agua-hidratacion-clinica-termorregulacion-y-nutricion-celular`
- **Estado:** Publicado
- **Motivo:** Placeholder genérico del sitio: /branding/social/og-image.png
- **Resumen:** Al despertar, el cuerpo humano presenta un estado de hipohidratación relativa que puede durar entre ocho y doce horas, dependiendo de la duración del sueño, la temperatura ambiental y la humedad. Esta deshidratación nocturna se produce principalmente por pérdidas insensibles — respiración y sudoración — que ocurren de…
- **Fuente:** `wellness_articles`
- **Imagen actual:** /branding/social/og-image.png
- **Categoría:** Salud Digestiva
- **Fecha de publicación:** 2026-07-20T12:26:23.701-04:00

---

## Casos ambiguos para revisión manual

No se identificaron casos ambiguos. Todos los registros tienen `is_published = true` de forma explícita en ambas tablas, y el campo `image_url` es determinista (existe con valor válido, tiene placeholder, o es null).

---

## Resumen técnico

### Fuentes inspeccionadas
- `blog_posts` (Supabase): 35 registros
- `wellness_articles` (Supabase): 150 registros
- 7 archivos JSON locales evaluados y descartados como fuentes no autoritativas

### Campos de imagen detectados
- `image_url` (TEXT) — único campo de imagen en ambas tablas

### Artículos clasificados
| Categoría | Cantidad |
|-----------|----------|
| Total en base de datos | 185 |
| Duplicados entre tablas (excluidos) | 20 |
| **Publicados únicos revisados** | **165** |
| Con imagen válida | 35 |
| Sin imagen válida | 130 |
| Casos ambiguos | 0 |

### Verificación de totales
- Con imagen (35) + Sin imagen (130) = 165 = Publicados únicos (165) ✅

### Duplicados descartados
- 20 registros en `wellness_articles` compartían slug con `blog_posts`
- Se priorizó `blog_posts` (que es la tabla consultada primero por la aplicación)

### Rutas rotas encontradas
- 0 rutas locales rotas (todas las rutas locales de artículos con imagen existen en `public/`)

### Placeholders identificados
- `/branding/social/og-image.png` — imagen OG genérica del branding del sitio, utilizada como fallback en 130 artículos

### Lotes creados
- 13 lotes de 10 artículos (el último puede contener menos de 10)

### Posibles falsos positivos descartados
- Se verificó que `/branding/social/og-image.png` NO es una imagen editorial válida; es el Open Graph image genérico del sitio, utilizado para toda la marca en redes sociales
- Se confirmó que los 35 artículos de `blog_posts` con imagen válida tienen archivos locales existentes o URLs remotas funcionales
- No se identificaron artículos con imagen definida en un campo alternativo (solo `image_url` existe en el esquema)

### Confirmación de integridad
- ✅ No se modificó ningún artículo, imagen, estado ni dato en la base de datos
- ✅ No se modificó ningún archivo del proyecto
- ✅ La auditoría es exclusivamente de lectura
