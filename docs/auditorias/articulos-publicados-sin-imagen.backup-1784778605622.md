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
| `s-ndrome-del-intestino-irritable-sii-eje-intestino...` | Síndrome del Intestino Irritable (SII) | Síndrome del intestino irritable: causas, síntomas y tratamiento |
| `eje-intestino-cerebro-v-as-de-comunicaci-n-bidirec...` | Eje Intestino-Cerebro | Eje intestino-cerebro: cómo tu microbiota controla tu estado de ánimo |
| `reflujo-gastroesof-gico-erge-e-hipoclorhidria-meca...` | Reflujo Gastroesofágico (ERGE) e Hipoclorhidria | Reflujo y ácido: por qué menos ácido puede ser peor |
| `digesti-n-enzim-tica-exocrina-funci-n-pancre-tica-...` | Digestión enzimática exocrina | Enzimas digestivas: cómo tu cuerpo descompone lo que comes |
| `fibra-soluble-vs-insoluble-impacto-en-la-motilidad...` | Fibra soluble vs insoluble en la motilidad | Fibra soluble vs insoluble: cuál necesitas y por qué |
| `h-gado-graso-no-alcoh-lico-hgna-acumulaci-n-lip-di...` | Hígado Graso No Alcohólico (HGNA) | Hígado graso no alcohólico: el enemigo silencioso de tu hígado |
| `estreimiento-funcional-crnico` | Estreñimiento funcional crónico | Estreñimiento crónico: cuándo es funcional y cómo tratarlo |
| `trnsito-intestinal-acelerado` | Tránsito intestinal acelerado | Tránsito intestinal acelerado: diarrea crónica y sus causas |
| `intolerancia-a-la-lactosa-gentica-vs-adquirida` | Intolerancia a la lactosa (Genética vs Adquirida) | Intolerancia a la lactosa: genética o adquirida |
| `funcin-del-moco-gstrico` | Función del moco gástrico | Moco gástrico: la barrera invisible que protege tu estómago |
| `celiaqu-a-vs-sensibilidad-al-gluten-no-cel-aca-mec...` | Celiaquía vs Sensibilidad al Gluten No Celíaca | Celiaquía vs sensibilidad al gluten: diferencias clave |
| `eje-intestino-hgado` | Eje intestino-hígado | Eje intestino-hígado: el circuito oculto de tu salud |
| `infeccin-por-helicobacter-pylori` | Infección por Helicobacter pylori | H. pylori: la bacteria que causa úlceras y puede afectar tu salud a largo plazo |
| `disbiosis-intestinal-desequilibrio-del-microbioma-...` | Disbiosis Intestinal | Disbiosis intestinal: cuándo tu microbiota se desequilibra |
| `histaminosis-entrica` | Histaminosis entérica | Histaminosis entérica: la intolerancia que muchos confunden con alergia |
| `permeabilidad-intestinal-mecanismos-de-la-barrera-...` | Permeabilidad Intestinal (Leaky Gut) | Leaky gut: mito o realidad clínica |
| `sibo-sobrecrecimiento-bacteriano-migraci-n-microbi...` | SIBO (Sobrecrecimiento Bacteriano) | SIBO: cuando las bacterias del colon suben al intestino delgado |

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
- **Resumen:** Artículo sobre terapia farmacológica (agonistas glp-1/gip) — nutrición, metabolismo y peso corporal. Terapia farmacológica (Agonistas GLP-1/GIP) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre adopción de la dieta mind — nutrición, metabolismo y peso corporal. Adopción de la Dieta MIND — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre entrenamiento de fuerza (2-3 días/sem) — nutrición, metabolismo y peso corporal. Entrenamiento de Fuerza (2-3 días/sem) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre déficit calórico individualizado (500-750 kcal/día) — nutrición, metabolismo y peso corporal. Déficit calórico individualizado (500-750 kcal/día) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre terapia cognitivo conductual (cbt) para obesidad — nutrición, metabolismo y peso corporal. Terapia Cognitivo Conductual (CBT) para obesidad — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre sustitución de fármacos obesogénicos — nutrición, metabolismo y peso corporal. Sustitución de fármacos obesogénicos — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre aumento de proteína (1.2-1.5 g/kg/día) — nutrición, metabolismo y peso corporal. Aumento de Proteína (1.2-1.5 g/kg/día) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre sustitución guiada por ley de etiquetados — nutrición, metabolismo y peso corporal. Sustitución guiada por Ley de Etiquetados — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre incremento del neat (>8,000 pasos/día) — nutrición, metabolismo y peso corporal. Incremento del NEAT (>8,000 pasos/día) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre entrenamiento a intervalos (hiit) — nutrición, metabolismo y peso corporal. Entrenamiento a Intervalos (HIIT) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre monitoreo continuo de glucosa (mcg) — nutrición, metabolismo y peso corporal. Monitoreo Continuo de Glucosa (MCG) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre restricción del tiempo en cama (optimizar sueño) — nutrición, metabolismo y peso corporal. Restricción del Tiempo en Cama (Optimizar Sueño) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre orden de macronutrientes al comer — nutrición, metabolismo y peso corporal. Orden de macronutrientes al comer — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre control del entorno (despensa) — nutrición, metabolismo y peso corporal. Control del Entorno (Despensa) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre masticación lenta (mindful eating) — nutrición, metabolismo y peso corporal. Masticación lenta (Mindful Eating) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre monitoreo regular de peso — nutrición, metabolismo y peso corporal. Monitoreo regular de peso — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre cirugía metabólica/bariátrica — nutrición, metabolismo y peso corporal. Cirugía Metabólica/Bariátrica — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre aumento de consumo de pescado azul (omega-3) — nutrición, metabolismo y peso corporal. Aumento de consumo de pescado azul (Omega-3) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre alimentación restringida en el tiempo (ayuno 12-14h) — nutrición, metabolismo y peso corporal. Alimentación Restringida en el Tiempo (Ayuno 12-14h) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre reducción de alcohol (<1 trago/día) — nutrición, metabolismo y peso corporal. Reducción de Alcohol (<1 trago/día) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre eliminación de bebidas azucaradas — nutrición, metabolismo y peso corporal. Eliminación de Bebidas Azucaradas — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre fibra viscosa (>30g/día) — nutrición, metabolismo y peso corporal. Fibra Viscosa (>30g/día) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre caminata corta post-comida (10 min) — nutrición, metabolismo y peso corporal. Caminata corta post-comida (10 min) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre identificación de gatillos con diario — nutrición, metabolismo y peso corporal. Identificación de gatillos con Diario — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre establecimiento de metas smart — nutrición, metabolismo y peso corporal. Establecimiento de Metas SMART — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre reemplazo de granos refinados por enteros — nutrición, metabolismo y peso corporal. Reemplazo de granos refinados por enteros — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre uso de platos de menor diámetro — nutrición, metabolismo y peso corporal. Uso de platos de menor diámetro — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre hidratación precarga (agua antes de comer) — nutrición, metabolismo y peso corporal. Hidratación Precarga (Agua antes de comer) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre tratamiento de apnea obstructiva del sueño — nutrición, metabolismo y peso corporal. Tratamiento de Apnea Obstructiva del Sueño — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre reducción de sodio por especias — nutrición, metabolismo y peso corporal. Reducción de sodio por especias — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre preparación semanal de comidas (meal prep) — nutrición, metabolismo y peso corporal. Preparación semanal de comidas (Meal Prep) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre ejercicio aeróbico (150-300 min/sem) — nutrición, metabolismo y peso corporal. Ejercicio Aeróbico (150-300 min/sem) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre evaluaciones antropométricas regulares (circunferencia de cintura) — nutrición, metabolismo y peso corporal. Evaluaciones antropométricas regulares (Circunferencia de cintura) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre rutinas activas de transporte — nutrición, metabolismo y peso corporal. Rutinas activas de transporte — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre restricción absoluta de grasas trans — nutrición, metabolismo y peso corporal. Restricción absoluta de grasas trans — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre gestión de la flora intestinal — nutrición, metabolismo y peso corporal. Gestión de la flora intestinal — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre uso limitado de edulcorantes no nutritivos — nutrición, metabolismo y peso corporal. Uso limitado de edulcorantes no nutritivos — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre incorporación de ejercicios isométricos — nutrición, metabolismo y peso corporal. Incorporación de ejercicios isométricos — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre manejo de medicación hipolipemiante (estatinas) — nutrición, metabolismo y peso corporal. Manejo de medicación hipolipemiante (Estatinas) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre optimización de vitamina d — nutrición, metabolismo y peso corporal. Optimización de Vitamina D — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre crononutrición (ingesta calórica matutina/diurna) — nutrición, metabolismo y peso corporal. Crononutrición (Ingesta calórica matutina/diurna) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre entrenamiento en flexibilidad psicológica (act) — nutrición, metabolismo y peso corporal. Entrenamiento en Flexibilidad Psicológica (ACT) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre tratamiento intensivo de hipertensión (ieca/ara-ii) — nutrición, metabolismo y peso corporal. Tratamiento intensivo de Hipertensión (IECA/ARA-II) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre diagnóstico de hipotiroidismo — nutrición, metabolismo y peso corporal. Diagnóstico de Hipotiroidismo — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre pausas de desconexión digital (comida sin pantallas) — nutrición, metabolismo y peso corporal. Pausas de desconexión digital (Comida sin pantallas) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre sustitución de lácteos enteros por bajos en grasa — nutrición, metabolismo y peso corporal. Sustitución de lácteos enteros por bajos en grasa — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre planificación de recompensas no alimentarias — nutrición, metabolismo y peso corporal. Planificación de recompensas no alimentarias — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre reestructuración de la cena (baja en sodio y carbohidratos) — nutrición, metabolismo y peso corporal. Reestructuración de la cena (baja en sodio y carbohidratos) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre inclusión de grasas monoinsaturadas (mufas) — nutrición, metabolismo y peso corporal. Inclusión de grasas monoinsaturadas (MUFAs) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre apoyo social (soporte comunitario) — nutrición, metabolismo y peso corporal. Apoyo Social (Soporte Comunitario) — Nutrición, Metabolismo y Peso Corporal. ...
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
- **Resumen:** Artículo sobre hidratación constante (orina clara) — salud intestinal, disbiosis y estreñimiento. Hidratación constante (Orina clara) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre suspensión de medicación constipante — salud intestinal, disbiosis y estreñimiento. Suspensión de medicación constipante — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre prucaloprida — salud intestinal, disbiosis y estreñimiento. Prucaloprida — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre óxido de magnesio / leche magnesia — salud intestinal, disbiosis y estreñimiento. Óxido de Magnesio / Leche Magnesia — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre masticación completa de los alimentos — salud intestinal, disbiosis y estreñimiento. Masticación completa de los alimentos — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre entrenamiento del reflejo gastrocólico — salud intestinal, disbiosis y estreñimiento. Entrenamiento del Reflejo Gastrocólico — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre dieta baja en fodmaps (fase de eliminación) — salud intestinal, disbiosis y estreñimiento. Dieta baja en FODMAPs (Fase de eliminación) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre cese de esfuerzo defecatorio extremo (straining) — salud intestinal, disbiosis y estreñimiento. Cese de esfuerzo defecatorio extremo (Straining) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre consumo de 2 kiwis diarios — salud intestinal, disbiosis y estreñimiento. Consumo de 2 Kiwis diarios — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre polietilenglicol (peg 3350) — salud intestinal, disbiosis y estreñimiento. Polietilenglicol (PEG 3350) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre limitar ingesta de calcio suplementario — salud intestinal, disbiosis y estreñimiento. Limitar ingesta de calcio suplementario — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre postura de defecación (squatting) — salud intestinal, disbiosis y estreñimiento. Postura de Defecación (Squatting) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre senósidos (senna) — salud intestinal, disbiosis y estreñimiento. Senósidos (Senna) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre masaje abdominal secuencial (trayecto colónico) — salud intestinal, disbiosis y estreñimiento. Masaje abdominal secuencial (Trayecto colónico) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre lactulosa (jarabe) — salud intestinal, disbiosis y estreñimiento. Lactulosa (Jarabe) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre manometría anorrectal y test expulsivo — salud intestinal, disbiosis y estreñimiento. Manometría anorrectal y test expulsivo — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre bebida caliente en ayunas (ej. té o café) — salud intestinal, disbiosis y estreñimiento. Bebida caliente en ayunas (Ej. Té o Café) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre linaclotida o plecanatida — salud intestinal, disbiosis y estreñimiento. Linaclotida o Plecanatida — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre suplementación con psyllium — salud intestinal, disbiosis y estreñimiento. Suplementación con Psyllium — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre terapia de biorretroalimentación (biofeedback) — salud intestinal, disbiosis y estreñimiento. Terapia de Biorretroalimentación (Biofeedback) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre bisacodilo o picosulfato (venta libre) — salud intestinal, disbiosis y estreñimiento. Bisacodilo o Picosulfato (Venta libre) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre ciruelas pasas (prunes) — salud intestinal, disbiosis y estreñimiento. Ciruelas Pasas (Prunes) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre actividad física aeróbica (caminar/trotar) — salud intestinal, disbiosis y estreñimiento. Actividad Física Aeróbica (Caminar/Trotar) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre lubiprostona — salud intestinal, disbiosis y estreñimiento. Lubiprostona — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre semillas de lino/linaza molidas — salud intestinal, disbiosis y estreñimiento. Semillas de lino/linaza molidas — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre supositorios de glicerina / enemas de microenema — salud intestinal, disbiosis y estreñimiento. Supositorios de Glicerina / Enemas de microenema — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre probióticos específicos (b. lactis) — salud intestinal, disbiosis y estreñimiento. Probióticos específicos (B. lactis) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre reducción de alimentos ultraprocesados — salud intestinal, disbiosis y estreñimiento. Reducción de Alimentos Ultraprocesados — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre aceite de oliva en ayunas (1 cdta) — salud intestinal, disbiosis y estreñimiento. Aceite de oliva en ayunas (1 cdta) — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre descarte de enfermedades sistémicas — salud intestinal, disbiosis y estreñimiento. Descarte de enfermedades sistémicas — Salud Intestinal, Disbiosis y Estreñimiento. ...
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
- **Resumen:** Artículo sobre mindfulness-based stress reduction (mbsr) — salud mental, estrés crónico y función cognitiva. Mindfulness-Based Stress Reduction (MBSR) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre higiene de luz matutina — salud mental, estrés crónico y función cognitiva. Higiene de Luz Matutina — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre suspiro fisiológico — salud mental, estrés crónico y función cognitiva. Suspiro Fisiológico — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre expresión escrita (journaling) — salud mental, estrés crónico y función cognitiva. Expresión Escrita (Journaling) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre meditación de amor bondadoso — salud mental, estrés crónico y función cognitiva. Meditación de Amor Bondadoso — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre optimización de la higiene de sueño — salud mental, estrés crónico y función cognitiva. Optimización de la Higiene de Sueño — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre terapia cognitivo conductual (cbt) — salud mental, estrés crónico y función cognitiva. Terapia Cognitivo Conductual (CBT) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre relajación muscular progresiva (pmr) — salud mental, estrés crónico y función cognitiva. Relajación Muscular Progresiva (PMR) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre ejercicio aeróbico (zona 2) — salud mental, estrés crónico y función cognitiva. Ejercicio Aeróbico (Zona 2) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre respiración de caja — salud mental, estrés crónico y función cognitiva. Respiración de Caja — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre grounding (conexión a tierra o técnica 5-4-3-2-1) — salud mental, estrés crónico y función cognitiva. Grounding (Conexión a tierra o técnica 5-4-3-2-1) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre yoga y asanas — salud mental, estrés crónico y función cognitiva. Yoga y Asanas — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre terapia de exposición al frío — salud mental, estrés crónico y función cognitiva. Terapia de Exposición al Frío — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre restricción del tiempo en cama — salud mental, estrés crónico y función cognitiva. Restricción del Tiempo en Cama — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre meditación trascendental — salud mental, estrés crónico y función cognitiva. Meditación Trascendental — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre manejo de tiempo (pomodoro) — salud mental, estrés crónico y función cognitiva. Manejo de Tiempo (Pomodoro) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre terapia de aceptación y compromiso (act) — salud mental, estrés crónico y función cognitiva. Terapia de Aceptación y Compromiso (ACT) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre desconexión digital nocturna — salud mental, estrés crónico y función cognitiva. Desconexión Digital Nocturna — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre terapia de masaje — salud mental, estrés crónico y función cognitiva. Terapia de Masaje — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre reestructuración de valores (act) — salud mental, estrés crónico y función cognitiva. Reestructuración de Valores (ACT) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre reestructuración de expectativas — salud mental, estrés crónico y función cognitiva. Reestructuración de Expectativas — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre musicoterapia — salud mental, estrés crónico y función cognitiva. Musicoterapia — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre forest bathing (shinrin-yoku) — salud mental, estrés crónico y función cognitiva. Forest Bathing (Shinrin-yoku) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre diario de gratitud — salud mental, estrés crónico y función cognitiva. Diario de Gratitud — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre tai chi o qi gong — salud mental, estrés crónico y función cognitiva. Tai Chi o Qi Gong — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre aromaterapia clínica (lavanda) — salud mental, estrés crónico y función cognitiva. Aromaterapia Clínica (Lavanda) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre desensibilización (emdr) — salud mental, estrés crónico y función cognitiva. Desensibilización (EMDR) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre biofeedback hrv (variabilidad de frecuencia cardíaca) — salud mental, estrés crónico y función cognitiva. Biofeedback HRV (Variabilidad de Frecuencia Cardíaca) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre mindfulness en la alimentación — salud mental, estrés crónico y función cognitiva. Mindfulness en la alimentación — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre escáner corporal (body scan) — salud mental, estrés crónico y función cognitiva. Escáner Corporal (Body Scan) — Salud Mental, Estrés Crónico y Función Cognitiva. ...
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
- **Resumen:** Artículo sobre dilución de bebidas (cordials) — hidratación clínica, termorregulación y nutrición celular. Dilución de bebidas (Cordials) — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre pares conductuales (agua en cada comida) — hidratación clínica, termorregulación y nutrición celular. Pares conductuales (Agua en cada comida) — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre leche magra o alternativas lácteas — hidratación clínica, termorregulación y nutrición celular. Leche magra o alternativas lácteas — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre hidratación proactiva en lugar de reactiva — hidratación clínica, termorregulación y nutrición celular. Hidratación proactiva en lugar de reactiva — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre monitoreo visual de la orina — hidratación clínica, termorregulación y nutrición celular. Monitoreo visual de la orina — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre consumo de electrolitos en sudor extremo — hidratación clínica, termorregulación y nutrición celular. Consumo de electrolitos en sudor extremo — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre monitoreo clínico de fármacos depletivos — hidratación clínica, termorregulación y nutrición celular. Monitoreo clínico de fármacos depletivos — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre "nudging" (botella siempre a la vista) — hidratación clínica, termorregulación y nutrición celular. "Nudging" (Botella siempre a la vista) — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre hidratación intra y post entrenamiento — hidratación clínica, termorregulación y nutrición celular. Hidratación intra y post entrenamiento — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre estratificación vespertina — hidratación clínica, termorregulación y nutrición celular. Estratificación vespertina — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre agua mineral carbonatada (con gas) — hidratación clínica, termorregulación y nutrición celular. Agua Mineral carbonatada (Con gas) — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre apps o smart bottles — hidratación clínica, termorregulación y nutrición celular. Apps o Smart Bottles — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre infusionar el agua natural — hidratación clínica, termorregulación y nutrición celular. Infusionar el agua natural — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre reemplazar jugos y bebidas — hidratación clínica, termorregulación y nutrición celular. Reemplazar jugos y bebidas — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre regla compensatoria (café/té/alcohol) — hidratación clínica, termorregulación y nutrición celular. Regla compensatoria (Café/Té/Alcohol) — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre uso de filtros domiciliarios — hidratación clínica, termorregulación y nutrición celular. Uso de filtros domiciliarios — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre incrementar sopas o verduras altas en h2o — hidratación clínica, termorregulación y nutrición celular. Incrementar sopas o verduras altas en H2O — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre vasos isotérmicos (temperatura) — hidratación clínica, termorregulación y nutrición celular. Vasos isotérmicos (Temperatura) — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre aumentar líquidos ante fiebre o infección — hidratación clínica, termorregulación y nutrición celular. Aumentar líquidos ante fiebre o infección — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- **Resumen:** Artículo sobre iniciar el día con 500ml de agua — hidratación clínica, termorregulación y nutrición celular. Iniciar el día con 500ml de agua — Hidratación Clínica, Termorregulación y Nutrición Celular. ...
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
- 0 duplicados tenían imagen válida en `blog_posts`
- 20 duplicados carecían de imagen en ambas versiones

### Rutas rotas encontradas
- 0 rutas locales rotas (todas las rutas locales de artículos con imagen existen en `public/`)

### Placeholders identificados
- `/branding/social/og-image.png` — imagen OG genérica del branding del sitio, utilizada como fallback en 130 artículos

### Lotes creados
- 13 lotes de 10 artículos (el último puede contener menos de 10)

### Confirmación de integridad
- ✅ No se modificó ningún artículo, imagen, estado ni dato en la base de datos
- ✅ No se modificó ningún archivo del proyecto
- ✅ La auditoría es exclusivamente de lectura
