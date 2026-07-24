# Auditoría editorial y SEO de 10 artículos de salud y bienestar

**Fecha:** 23 de julio de 2026  
**Universo:** 185 artículos publicados en `public/wellness-articles-cache.json`  
**Muestra:** 10 artículos seleccionados mediante barajado pseudoaleatorio reproducible  
**Semilla:** `20260723` (algoritmo Mulberry32)  
**Objetivo:** determinar no solo si los textos pueden posicionar, sino si informan, orientan y protegen de verdad al lector.

## Conclusión ejecutiva

La muestra no alcanza todavía un estándar editorial confiable para una plataforma YMYL (salud). El promedio estimado es:

| Dimensión | Promedio | Lectura |
|---|---:|---|
| Calidad editorial y utilidad | **44/100** | Insuficiente |
| SEO/AEO | **60/100** | Base aprovechable, ejecución débil |
| Seguridad y rigor YMYL | **52/100** | Riesgo alto por inconsistencias |
| Confianza global | **45/100** | No apta para escalar sin control editorial |

La conclusión no es que “todo sea contenido SEO vacío”. Hay información útil en varios textos y uno de ellos —“Eje intestino-hígado”— muestra una arquitectura editorial prometedora. Sin embargo, el patrón dominante en la muestra es el de producción programática: títulos construidos con la misma fórmula, secciones idénticas, alusiones genéricas a instituciones, ausencia de referencias verificables y afirmaciones fisiológicas demasiado seguras. El resultado parece diseñado primero para cubrir palabras clave y después para ayudar.

De los 10 artículos:

- **1 puede mantenerse publicado con correcciones moderadas.**
- **2 necesitan revisión sustancial antes de considerarse sólidos.**
- **3 requieren reescritura completa.**
- **4 deberían despublicarse de inmediato hasta corregirse**, por estar vacíos o por poder inducir decisiones sanitarias equivocadas.

No es posible conocer la intención interna del autor o del sistema. Por ello, este informe no acusa mala fe. Clasifica señales observables: utilidad original, precisión, verificabilidad, seguridad, profundidad práctica y huellas de automatización SEO.

## Método y criterios

Cada artículo fue evaluado en tres escalas de 0 a 100:

### Calidad editorial y ayuda real

- Responde claramente a la necesidad del lector.
- Explica sin inflar la certeza.
- Entrega acciones concretas, contextualizadas y realistas.
- Distingue evidencia fuerte, moderada, preliminar y opinión.
- Aporta algo que no se obtiene con una definición genérica.
- Evita relleno, repetición y lenguaje de plantilla.

### SEO y capacidad de descubrimiento

- Título e intención de búsqueda alineados.
- Respuesta temprana y arquitectura escaneable.
- Cobertura semántica natural.
- Encabezados útiles, no meramente repetitivos.
- Meta descripción, categoría, enlaces y FAQ coherentes.
- Potencial de satisfacer la consulta, no solo de captar el clic.

### Seguridad y rigor YMYL

- Afirmaciones médicas verificables y correctamente matizadas.
- Fuentes primarias o guías identificables.
- Dosis y recomendaciones con contexto.
- Señales de alarma correctas.
- Separación clara entre educación, diagnóstico y tratamiento.
- Ausencia de mecanismos inventados, causalidad exagerada o indicaciones que puedan desplazar atención profesional.

### Escala de veredicto

| Puntuación | Interpretación |
|---:|---|
| 85–100 | Excelente; publicable con control rutinario |
| 70–84 | Bueno; correcciones menores o moderadas |
| 55–69 | Débil; revisión sustancial |
| 35–54 | Deficiente; reescritura |
| 0–34 | No publicable |

## Resultado comparativo

| # | Artículo | Editorial | SEO | YMYL | ¿Ayuda de verdad? | Veredicto |
|---:|---|---:|---:|---:|---|---|
| 1 | Reducción de alcohol (<1 trago/día) | 45 | 62 | 47 | Parcialmente | Reescritura |
| 2 | Prucaloprida | 56 | 59 | 34 | Sí, pero puede inducir errores | Despublicar hasta corregir |
| 3 | Comida sin pantallas | 62 | 66 | 72 | Sí, con sobrepromesas | Revisión sustancial |
| 4 | Grounding / 5-4-3-2-1 | 43 | 59 | 51 | Parcialmente | Reescritura |
| 5 | Reflujo y ácido | 25 | 67 | 18 | Puede desinformar | Despublicar hasta corregir |
| 6 | Histaminosis entérica | 40 | 62 | 37 | Mezcla ayuda y desinformación | Despublicar hasta corregir |
| 7 | “Infusionar” el agua natural | 29 | 57 | 39 | Poco; medicaliza beber agua | Reescritura |
| 8 | Control del entorno/despensa | 59 | 63 | 74 | Sí | Revisión sustancial |
| 9 | Sustituir lácteos enteros | 4 | 31 | 68 | No | Retirar por contenido vacío |
| 10 | Eje intestino-hígado | 78 | 77 | 84 | Sí | Mantener y corregir |

---

## 1. Reducción de alcohol (<1 trago/día)

**Veredicto:** tiene una intención útil, pero presenta como demostrados resultados y mecanismos que no documenta. La pieza se acerca más a un artículo SEO plausible que a educación sanitaria verificable.

### Lo que sí aporta

- Define una bebida estándar y advierte correctamente sobre embarazo, interacciones y abstinencia.
- Reconoce que el riesgo aumenta con el consumo y que no existe un nivel sin riesgo.
- Ofrece sustituciones y estrategias conductuales aplicables.
- La sección de señales de alarma es útil.

### Problemas de fondo

- El propio título normaliza “menos de un trago al día” como objetivo general. La formulación más honesta sería: **cuanto menos, menor riesgo; no beber es la opción de menor riesgo**.
- Atribuye a ensayos clínicos pérdidas de **1,5 a 4 kg en 4–8 semanas** y descensos de triglicéridos “hasta 30%”, pero no identifica ninguno. Son cifras muy específicas sin trazabilidad.
- Afirma que el hígado “suspende” la oxidación de grasas y carbohidratos y que reducir alcohol “normaliza” leptina, grelina y cortisol. Son simplificaciones mecanicistas presentadas como certezas clínicas.
- “Desintoxicación leve del hígado” y “detoxificación natural” introducen el lenguaje comercial que la plataforma dice evitar.
- La afirmación atribuida a *New England Journal of Medicine* sobre restricción y mortalidad no incluye estudio, población ni diseño; podría ser una referencia fabricada o una interpretación inversa de estudios observacionales.
- No hay bibliografía, enlaces, DOI, autores ni año.

### Intención percibida

**Híbrida, con predominio SEO.** El contenido puede ayudar a una persona que quiere reducir alcohol, pero las cifras llamativas, el esquema genérico y las autoridades nombradas sin referencias parecen colocadas para proyectar credibilidad y cubrir entidades semánticas.

### Cómo convertirlo en un artículo valioso

1. Cambiar el foco desde “<1 trago/día” hacia reducción de riesgo y opciones para beber menos.
2. Separar riesgo de cáncer, riesgo cardiovascular, peso y dependencia.
3. Sustituir todas las cifras sin fuente por resultados de estudios identificados o eliminarlas.
4. Incluir una guía práctica de 7–14 días, un registro de consumo y recursos clínicos para dependencia.
5. Explicar que una bebida estándar varía por país.

---

## 2. Prucaloprida

**Veredicto:** es informativo en apariencia, pero por tratarse de un medicamento de prescripción los errores y omisiones elevan mucho el riesgo.

### Lo que sí aporta

- Identifica la indicación general: estreñimiento crónico idiopático.
- Explica el agonismo 5-HT4 y resume efectos adversos frecuentes.
- Desaconseja usar el fármaco sin descartar causas secundarias.
- Incluye señales de alarma digestiva.

### Problemas clínicos y editoriales

- Omite la advertencia de la ficha de FDA sobre **ideación y conducta suicida y aparición o empeoramiento de depresión**. En cambio, dedica espacio a microbiota y probióticos, temas secundarios y mucho menos establecidos.
- La dosis de 1 mg se atribuye a “mayores de 65 años o insuficiencia renal moderada a grave”. La ficha vigente de FDA relaciona el ajuste con insuficiencia renal grave; no establece automáticamente 1 mg solo por edad.
- Describe un “doble mecanismo —proquinético y secretor—” como explicación de eficacia. La caracterización regulatoria principal es agonismo 5-HT4 y estimulación de la motilidad colónica; no debe equipararse sin fuente a un secretagogo.
- Recomienda combinaciones con polietilenglicol y probióticos como si fueran “sinergias” estudiadas, sin citar evidencia ni aclarar que no son una pauta universal.
- Sostiene que no debe suspenderse abruptamente y que la interrupción debe ser gradual. Esto se presenta como instrucción médica sin fuente.
- Proporciona una pauta de agua rígida de 1,5–2 L sin contextualizar enfermedad renal, cardíaca, clima, dieta y otras fuentes de agua.
- No cita la guía conjunta AGA/ACG ni la ficha técnica del medicamento.

### Intención percibida

**Informativa, pero producida con plantilla SEO y sin revisión farmacológica.** No parece una pieza puramente vacía; el problema es que su tono de autoridad excede el control de calidad real.

### Acción recomendada

Despublicar hasta que un médico o farmacéutico revise cada instrucción. La versión nueva debe basarse en la ficha regulatoria vigente, la guía AGA/ACG, contraindicaciones, ajuste renal, advertencia de salud mental y decisión compartida. Debe eliminar recomendaciones de combinación no sustentadas.

---

## 3. Pausas de desconexión digital durante la comida

**Veredicto:** uno de los textos más útiles de la muestra, pero exagera el mecanismo y la fuerza del efecto.

### Lo que funciona

- Resuelve una necesidad cotidiana con acciones de bajo costo.
- Reconoce que no es un tratamiento aislado para perder peso.
- Las instrucciones son claras, progresivas y no punitivas.
- Advierte sobre trastornos de la conducta alimentaria.

### Lo que reduce su calidad

- Presenta como mecanismo probado que las señales vagales “necesitan ser procesadas conscientemente” para detener la ingesta. La regulación del apetito es mucho más compleja y no depende de ese umbral narrado.
- Vincula pantallas, estrés crónico, cortisol, grasa visceral e insulina en una cadena causal demasiado amplia.
- “La sensación de plenitud completa llega aproximadamente 20 minutos después” se usa como regla universal, aunque la saciedad no funciona con un temporizador fijo.
- El consejo de detenerse al “80%” no está definido ni adaptado a personas con dificultades interoceptivas o antecedentes de restricción.
- Afirma respaldo de ADA y Endocrine Society sin indicar documento.
- No contiene referencias, tabla comparativa ni resumen AEO pese a exigirlos la biblia editorial.

### Intención percibida

**Principalmente útil, con optimización SEO excesiva.** Aquí sí existe una intervención aplicable. El valor está en la guía conductual, no en las afirmaciones metabólicas.

### Mejora prioritaria

Reducir la promesa a: “comer sin distracciones puede ayudar a prestar atención a la experiencia y, en algunos estudios, reduce modestamente la ingesta inmediata o posterior”. Añadir evidencia experimental, límites, adaptaciones familiares y una minihoja de práctica de siete días.

---

## 4. Grounding: conexión a tierra o técnica 5-4-3-2-1

**Veredicto:** unir dos prácticas diferentes bajo un mismo término perjudica al lector y da legitimidad indebida a la teoría de transferencia de electrones.

### Lo que sí ayuda

- La técnica sensorial 5-4-3-2-1 es simple, de bajo costo y puede servir como herramienta breve de orientación al presente.
- El artículo reconoce que la evidencia es limitada y que no reemplaza atención profesional.
- Incluye señales para buscar ayuda en ansiedad, depresión y crisis.

### Problemas importantes

- Mezcla una técnica psicológica de anclaje sensorial con “earthing” o caminar descalzo para transferir electrones. Comparten nombre, pero no base teórica ni evidencia.
- Dice que ambas activan el parasimpático y reducen marcadores inflamatorios. Esa afirmación causal no está sustentada.
- Recomienda 20 minutos de contacto físico con tierra, a pesar de reconocer que no existe dosis establecida.
- La mención a ADA y Endocrine Society es especialmente impropia: el propio texto admite que el “material original” las mencionaba, pero no presenta ninguna guía de esas entidades sobre grounding.
- No explica cuándo una técnica de anclaje puede no bastar, cómo usarla durante pánico o disociación ni qué hacer si aumenta el malestar.

### Intención percibida

**SEO temático con utilidad parcial.** La unión de dos conceptos parece motivada por capturar búsquedas bajo la misma palabra. La técnica 5-4-3-2-1 merece un artículo independiente; “earthing” debería tratarse en una pieza crítica de evidencia.

### Acción recomendada

Dividir el artículo. Mantener una guía prudente sobre anclaje sensorial y crear, si se desea, un artículo separado: “Earthing: qué se ha estudiado y por qué la evidencia no permite prometer beneficios fisiológicos”.

---

## 5. Reflujo y ácido: por qué menos ácido puede ser peor

**Veredicto:** es el artículo de mayor riesgo de la muestra. La tesis central es atractiva para SEO y contraria al marco de las guías clínicas.

### Riesgos concretos

- Presenta la hipoclorhidria como causa subestimada de reflujo y afirma que menor acidez debilita el esfínter esofágico inferior. No aporta evidencia y desplaza el mecanismo central reconocido de la ERGE: el reflujo de contenido gástrico por alteraciones de la barrera antirreflujo, relajaciones transitorias, hernia hiatal y otros factores.
- Sugiere que los inhibidores de bomba de protones pueden empeorar el reflujo por baja acidez. Este encuadre puede motivar a un lector a abandonar un tratamiento eficaz.
- Afirma que la baja acidez retrasa el vaciamiento y genera fermentación en intestino delgado, gases y mayor reflujo como una cadena establecida. La causalidad está muy sobredimensionada.
- Cita a ADA y Endocrine Society para fisiología del reflujo. No son las entidades clínicas de referencia para ERGE y no identifica documentos.
- Propone la **prueba de Schilling** como prueba de hipoclorhidria. Esa prueba histórica evaluaba absorción de vitamina B12 y no es la prueba estándar descrita para diagnosticar baja acidez gástrica.
- Habla de “restaurar la acidez adecuada” sin decir en qué consiste, con qué evidencia ni bajo qué indicación. Esto deja abierta la puerta a prácticas como betaína HCl o vinagre.

### Lo rescatable

- Recomienda no suspender antiácidos abruptamente.
- Incluye varias señales de alarma correctas.
- Elevar la cabecera y evitar acostarse tras comer son medidas razonables, aunque deben citarse y expresarse según contexto.

### Intención percibida

**Predominio SEO/click-through.** El título crea una paradoja fuerte y diferenciadora, pero el “information gain” es aparente: gana novedad sacrificando precisión clínica.

### Acción recomendada

Despublicar. Reemplazar por “Reflujo: no siempre es exceso de ácido, pero reducir ácido sí puede aliviar y cicatrizar”. Basar el texto en la guía ACG, distinguir reflujo fisiológico, ERGE, hipersensibilidad al reflujo, dispepsia y síntomas refractarios; explicar cuándo se estudia con endoscopia o monitorización de pH.

---

## 6. Histaminosis entérica

**Veredicto:** aborda un tema real y controvertido, pero transforma hipótesis en fisiología establecida y puede confundir una reacción potencialmente grave con una intolerancia.

### Lo que aporta

- Reconoce la falta de criterios diagnósticos estandarizados.
- Desaconseja dietas restrictivas prolongadas y automedicación.
- Menciona diagnósticos diferenciales y síntomas de alarma.

### Errores o afirmaciones de alto riesgo

- “Las células enterocromafines secretan aproximadamente un 90% de la histamina corporal” parece confundir histamina con **serotonina**, de la cual gran parte sí se produce en el tracto gastrointestinal.
- Presenta la “producción bacteriana excesiva” como causa general de histaminosis entérica sin establecer la calidad de evidencia.
- La frase “la histaminosis no responde a ese protocolo y no tiene el mismo riesgo de anafilaxia” puede ser interpretada por un lector como permiso para no usar adrenalina ante síntomas respiratorios o circulatorios. Una persona no puede diferenciar con seguridad ambos cuadros durante una reacción aguda.
- Recomienda suplementos DAO y cepas probióticas concretas pese a reconocer evidencia variable. La especificidad comercial supera la certeza disponible.
- Las listas universales de alimentos “ricos” o “liberadores” de histamina son variables y discutidas; deben presentarse como herramienta temporal de evaluación, no como taxonomía cerrada.
- No hay referencias clínicas ni guía de diagnóstico por exclusión.

### Intención percibida

**Educativa en propósito, SEO en ejecución.** Intenta advertir sobre incertidumbre, pero el texto rellena esa incertidumbre con mecanismos y recomendaciones demasiado específicos.

### Acción recomendada

Despublicar hasta corregir el error fisiológico y la orientación sobre anafilaxia. Reconstruir alrededor de tres preguntas: qué se sabe, qué no se puede diagnosticar con certeza y cómo hacer una eliminación/reintroducción segura con nutricionista o alergólogo.

---

## 7. “Infusionar el agua natural”

**Veredicto:** crea una intervención que no existe como concepto clínico consolidado y medicaliza una conducta ordinaria.

### Señales de contenido construido para SEO

- El término “infusionar” se redefine artificialmente para unir hidratación clínica, termorregulación y “nutrición celular”.
- La explicación reconoce que no hay ensayos sobre la intervención, pero continúa dando dosis, tiempos y mecanismos como si el protocolo estuviera validado.
- Se mencionan ADA y Endocrine Society sin que esas entidades respalden la intervención nombrada.

### Problemas de precisión

- Afirma que un adulto pierde **2–3 litros diarios solo por vías insensibles**, más 1–2 litros de orina. Esa suma no representa a un adulto promedio en condiciones normales.
- Dice que el 80% del agua ingerida se absorbe en las primeras dos horas y que beber grandes cantidades hace que pase al colon sin absorberse. Son afirmaciones específicas sin fuente y fisiológicamente engañosas.
- “La sed es un indicador tardío” se presenta como verdad general. En adultos sanos, sed y consumo con comidas suelen mantener adecuadamente el balance diario.
- Prescribe 150–250 ml cada 15–20 minutos durante ejercicio moderado sin considerar peso, sudoración, duración, clima o riesgo de hiponatremia.
- Usa color de orina y frecuencia cada 2–4 horas como reglas universales, sin explicar sus limitaciones.
- Habla de mejor piel, función renal y menor riesgo de cálculos en semanas como beneficios generales sin cuantificar ni diferenciar población.

### Lo rescatable

- Advierte sobre exceso de agua, hiponatremia y condiciones renales/cardíacas.
- Explica que las necesidades varían por clima, actividad y salud.

### Intención percibida

**Principalmente SEO.** Hay mucho lenguaje fisiológico, pero poco valor incremental. Un artículo breve titulado “Cómo hidratarse sin reglas rígidas” ayudaría más.

### Acción recomendada

Reescritura completa. Eliminar “infusionar”, abandonar cifras universales y centrar el artículo en sed, comidas, actividad, calor, enfermedad y señales de deshidratación/hiponatremia.

---

## 8. Control del entorno y organización de la despensa

**Veredicto:** útil y aplicable, aunque inflado con lenguaje metabólico y cifras sin fuentes.

### Fortalezas

- Ofrece seis acciones concretas que una persona puede probar.
- Reduce la dependencia de “fuerza de voluntad” y trata el ambiente como parte de la conducta.
- Reconoce límites y recomienda personalización en diabetes, enfermedad renal y trastornos alimentarios.
- No intenta vender una cura o un suplemento.

### Debilidades

- Afirma que el control de la despensa es una estrategia “de primera línea en protocolos clínicos” y una de las intervenciones “más efectivas”, pero no identifica protocolos.
- Atribuye a estudios controlados un aumento de 20–30% en elecciones nutritivas sin referencia.
- Conecta organización, glucosa estable, menos picos de insulina, menor almacenamiento de grasa visceral e inflamación en una cadena causal excesiva.
- “Recipientes opacos” y “estantes altos” pueden ser trucos razonables, pero no son equivalentes a resultados metabólicos clínicos.
- No contempla presupuesto, acceso alimentario, hogares compartidos, niños o personas en recuperación de un trastorno alimentario.

### Intención percibida

**Ayuda real con envoltorio SEO.** La intervención es genuinamente útil; el artículo ganaría confianza si eliminara dos tercios de la grandilocuencia metabólica.

### Mejora prioritaria

Convertirlo en una guía práctica por perfiles: presupuesto limitado, hogar compartido, poco tiempo y planificación semanal. Añadir una lista de compra flexible y explicar que “saludable” no exige esconder ni moralizar alimentos.

---

## 9. Sustitución de lácteos enteros por bajos en grasa

**Veredicto:** contenido vacío. No responde la pregunta, no entrega evidencia y no debe estar publicado.

### Evidencia observable

- Solo contiene aproximadamente **202 palabras**.
- Las secciones “Mecanismo de acción” y “Evidencia científica” están vacías.
- Repite el título completo dentro de una frase genérica.
- Nombra ADA, Endocrine Society y “organizaciones internacionales” sin estudio o recomendación.
- No explica para quién podría ser útil, qué nutriente cambia, qué producto elegir ni qué matices existen entre leche, yogur, queso, saciedad y patrón dietario.

### Intención percibida

**Página programática creada para cobertura SEO.** En la muestra es el caso más claro de publicación sin valor editorial.

### Acción recomendada

Retirar inmediatamente. No basta con “completar párrafos”: la pregunta debe reformularse. Una pieza valiosa compararía lácteos enteros y reducidos en grasa dentro del patrón dietario, calidad del alimento, azúcares añadidos, preferencias, riesgo cardiovascular y sustitución nutricional.

---

## 10. Eje intestino-hígado

**Veredicto:** es el mejor artículo de la muestra y el único que se acerca al estándar declarado por la propia biblia editorial.

### Fortalezas

- Resumen inicial claro.
- Autor, fecha de revisión y tiempo de lectura visibles.
- Buena analogía, tabla comparativa, mitos, señales de alarma y FAQ.
- Distingue estudios observacionales y modelos animales.
- Evita prometer que probióticos “curan” el hígado graso.
- Incluye referencias con DOI/PMID verificables para tres trabajos.

### Correcciones necesarias

- La referencia “OMS. Enfermedad del hígado graso no alcohólico: datos epidemiológicos y recomendaciones. 2025” no incluye URL, autores, identificador ni un título verificable. Debe verificarse o retirarse.
- Las referencias se presentan como texto, pero no como enlaces clicables.
- Usa EHGNA/NAFLD; conviene explicar la nomenclatura actual **MASLD** (enfermedad hepática esteatósica asociada a disfunción metabólica), conservando el término anterior para búsquedas y comprensión.
- La afirmación de 25% de prevalencia debe actualizarse y citarse con alcance geográfico y fecha.
- “Fragmentos de proteínas mal digeridas” que cruzan la barrera es una formulación imprecisa y propensa a narrativas de “intestino permeable”.
- El CTA recomienda un artículo cuyo enlace no está implementado.
- Hay dos disclaimers consecutivos; la redundancia transmite ansiedad legal, no más seguridad.
- La categoría almacenada está dañada: contiene varios dominios concatenados y termina en “Funciona”.

### Intención percibida

**Principalmente educativa, bien optimizada para SEO.** Este es el modelo que la plataforma debería mejorar y replicar: posicionar porque satisface la consulta, no porque repite entidades.

---

## Hallazgos transversales de plataforma

Estos problemas no pertenecen a un solo redactor; surgen del sistema de publicación y enriquecimiento.

### 1. La estructura promete ciencia, pero no entrega trazabilidad

Nueve de los diez textos carecen de referencias enlazadas. Las frases “estudios muestran”, “la literatura indica”, “organizaciones reconocen” y “la evidencia es sólida” aparecen como sustitutos de citar. En salud, nombrar ADA, Endocrine Society, OMS, *JAMA* o *NEJM* sin documento concreto no aumenta E-E-A-T: lo reduce.

**Regla propuesta:** ninguna afirmación cuantitativa, dosis, plazo clínico o recomendación farmacológica se publica sin cita directa y revisión humana.

### 2. Las FAQ automáticas están contaminadas

Los campos `enriched.generatedFaqs` repiten bancos completos de preguntas que no pertenecen al artículo. En la muestra:

- El artículo sobre alcohol recibe FAQ sobre polietilenglicol, psyllium, linaclotida, GLP-1/GIP y postura para defecar.
- El artículo de grounding recibe FAQ sobre hidratación, estreñimiento y déficit calórico.
- El artículo sobre agua recibe preguntas de terapia cognitivo-conductual y fármacos para perder peso.

Aunque la página React actual parece extraer FAQ del cuerpo y no mostrar directamente ese campo, los datos contaminados existen y el script de enriquecimiento puede utilizarlos para schema o salidas estáticas. Esto es un riesgo SEO grave: schema irrelevante o engañoso.

**Acción:** desactivar `generateFaqsFromBible` hasta que la selección se haga por intención, entidad central y umbral de similitud. Limitar a 3–5 preguntas exclusivas del artículo.

### 3. Los productos relacionados crean conflicto editorial

El enriquecimiento asigna productos por coincidencia de palabras. Ejemplos:

- Alcohol → REXET, THERMO T3, NOCARB-T, PRUNEX y NUTRADAY.
- Reflujo → FLORA LIV y NO STRESS.
- Eje intestino-hígado → REXET, FLORA LIV y NUTRADAY.

El algoritmo exige apenas dos coincidencias y el motivo mostrado usa términos predefinidos, no evidencia de que el producto sea apropiado. En una plataforma que vende suplementos, esto puede convertir educación sanitaria en embudo comercial y debilitar la percepción de imparcialidad.

**Acción:** separar editorial y comercio. Todo módulo de producto debe llevar etiqueta visible, criterios de inclusión, revisión de seguridad y explicación de que la relación temática no demuestra beneficio.

### 4. Categorías incorrectas

La muestra contiene errores obvios:

- Reducción de alcohol e hidratación aparecen como “Ejercicio”.
- Grounding y control de despensa aparecen como “Salud Digestiva”.
- Eje intestino-hígado almacena una categoría concatenada y truncada.

Esto perjudica navegación, enlazado interno, autoridad temática y confianza.

### 5. Metadescripciones pobres

Varios registros usan `Título. ...` como meta descripción. Otros copian un excerpt con caracteres de Markdown y lo cortan a mitad de frase. Eso desaprovecha el resultado de búsqueda y parece generado automáticamente.

### 6. Plantilla monótona y rastros de producción masiva

Nueve textos repiten casi exactamente:

1. Introducción.
2. “¿Qué es [título completo]?”
3. “¿Cómo funciona?”
4. “Beneficios y tiempo esperado”.
5. “Evidencia científica”.
6. Recomendaciones.
7. Errores.
8. Cuándo consultar.
9. Conclusión.

Una arquitectura coherente es positiva; repetir incluso el título largo y sus dominios dentro de subtítulos produce texto antinatural. La estructura debe responder a la consulta, no a una plantilla única.

### 7. El Markdown no se renderiza como contenido editorial

`WellnessArticlePage.jsx` divide el contenido por bloques y coloca cada bloque dentro de `<p>` con `whitespace-pre-wrap`. Por tanto, encabezados `#`, tablas `|...|`, negritas y avisos Markdown pueden mostrarse como texto literal. Esto destruye jerarquía, escaneabilidad, accesibilidad y la intención editorial de tablas/FAQ.

**Acción:** renderizar Markdown sanitizado con componentes semánticos para `h2`, `h3`, `table`, listas, enlaces y blockquotes. Garantizar un solo `h1` en la página, porque el título de la interfaz ya lo aporta.

### 8. Autoría y revisión insuficientes

Solo uno de los diez registros de la muestra expone `author` en el cache. La mayoría de los textos no identifica revisor clínico, credenciales verificables ni política editorial. “Investigador periodístico y educador científico” describe un rol, pero no acredita revisión médica.

**Acción:** distinguir claramente autor, revisor médico, fecha de revisión, conflicto de interés y método de actualización.

### 9. El disclaimer no corrige información insegura

Una advertencia final no neutraliza una dosis incorrecta, una prueba obsoleta o una causalidad inventada. Debe ser la última barrera, no el sustituto de revisión.

## Prioridad de intervención

### En las próximas 24–48 horas

1. Despublicar temporalmente “Reflujo y ácido”, “Prucaloprida”, “Histaminosis entérica” y el placeholder de lácteos.
2. Desactivar las FAQ programáticas contaminadas y cualquier schema construido con ellas.
3. Ocultar recomendaciones de productos en artículos clínicos hasta revisar el sistema.
4. Corregir el renderizado Markdown.

### En la primera semana

1. Revisar los 185 artículos automáticamente para detectar:
   - secciones vacías;
   - ausencia de referencias;
   - dosis y unidades;
   - cifras, porcentajes y plazos sin cita;
   - menciones genéricas de instituciones;
   - categorías inválidas;
   - frases absolutas y lenguaje detox;
   - FAQ no relacionadas;
   - productos añadidos por coincidencia débil.
2. Crear niveles de riesgo:
   - **Nivel A:** hábitos generales de bajo riesgo.
   - **Nivel B:** síntomas y condiciones.
   - **Nivel C:** medicamentos, diagnósticos, embarazo, salud mental y urgencias.
3. Exigir revisión humana cualificada para nivel C.

### En 30 días

1. Adoptar una ficha editorial por artículo con pregunta principal, lector, decisión que puede tomar, evidencia, incertidumbre y daño potencial.
2. Crear formatos distintos: guía práctica, explicación de condición, medicamento, mito/evidencia y comparativa.
3. Medir éxito editorial además de tráfico:
   - finalización de lectura;
   - utilidad declarada;
   - comprensión de señales de alarma;
   - clics a fuentes;
   - correcciones posteriores;
   - proporción de artículos con revisión vigente.
4. Reescribir por lotes pequeños y someter cada lote a auditoría editorial, no solo a validación automática.

## Estándar mínimo de publicación propuesto

Un artículo no debería publicarse si falla cualquiera de estos puntos:

- Responde la pregunta principal en los primeros 120–150 palabras.
- Incluye al menos 3 fuentes directamente enlazadas y pertinentes; para medicamentos, además la ficha regulatoria.
- Cada cifra, dosis o plazo puede rastrearse.
- Explica qué evidencia existe y qué no se sabe.
- No recomienda iniciar, ajustar o suspender fármacos.
- Señales de alarma específicas y proporcionadas.
- La guía práctica se puede ejecutar sin comprar un producto.
- La categoría, meta descripción, FAQ y enlaces son coherentes.
- Un humano revisó precisión, legibilidad y posible daño.
- La página renderiza correctamente títulos, tablas, listas y referencias.

## Dictamen final

La plataforma tiene una buena ambición editorial y un artículo que demuestra que puede producir contenido valioso. Sin embargo, la muestra revela una distancia grande entre la biblia declarada y el contenido publicado. El principal problema no es “falta de SEO”: es **exceso de apariencia científica sin trazabilidad suficiente**.

Posicionar estos textos tal como están puede aumentar visitas, pero también amplificar errores y erosionar la confianza. La vía correcta no es abandonar SEO; es subordinarlo a utilidad, evidencia y seguridad. Un buen artículo de salud posiciona porque aclara una decisión, reconoce límites, enlaza evidencia y protege al lector. Esa debe ser la unidad mínima de calidad de Bienestar en Claro.

## Fuentes externas usadas para contraste

- Organización Mundial de la Salud. *Alcohol* (ficha informativa; riesgo y ausencia de consumo libre de riesgo).
- U.S. Food and Drug Administration. *Motegrity (prucalopride), prescribing information*, revisión 2025.
- American College of Gastroenterology. *Clinical Guideline for the Diagnosis and Management of Gastroesophageal Reflux Disease*.
- American Gastroenterological Association / American College of Gastroenterology. *Clinical Practice Guideline: Pharmacological Management of Chronic Idiopathic Constipation*.
- Comas-Basté et al. *Histamine Intolerance: The Current State of the Art*. Biomolecules, 2020.
- National Academies. *Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate*.
- World Health Organization. *Saturated fatty acid and trans-fatty acid intake for adults and children*, 2023.
- Robinson et al. *Eating attentively: a systematic review and meta-analysis of the effect of food intake memory and awareness on eating*. AJCN, 2013.
