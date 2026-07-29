process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or key in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const slug = 'cirrosis-hepatica-que-es-senales-y-que-hacer-sin-panico';

const content = `# Primeros síntomas de cirrosis hepática: cómo reconocer las señales sin entrar en pánico

**Autor:** Daniel Falcón, Investigador Periodístico y Educador Científico
**Revisión editorial:** Julio de 2026
**Tiempo estimado de lectura:** 12 min

![Ilustración médica del hígado y señales tempranas de cirrosis hepática](/images/cirrosis%20hepatica%20nuevo%20articulo.png)

> **Lo más importante**
> * La cirrosis hepática es una enfermedad crónica en la que el hígado reemplaza progresivamente tejido sano por cicatrices o fibrosis.
> * En fases iniciales puede no producir síntomas durante años; cuando aparecen, suelen ser inespecíficos, como cansancio, debilidad, pérdida de apetito o baja de peso sin explicación.
> * Detectarla temprano permite tratar la causa, ralentizar la progresión y reducir el riesgo de complicaciones graves.
> * Vómitos con sangre, heces negras, confusión intensa, fiebre con abdomen hinchado o dificultad para despertar requieren atención médica urgente.

---

## La respuesta rápida

Si buscas una respuesta directa: la cirrosis hepática puede avanzar en silencio y no siempre causa dolor. Los primeros síntomas, cuando existen, suelen ser cansancio persistente, debilidad, pérdida de apetito, pérdida de peso involuntaria, náuseas, malestar general o molestias leves en la parte superior derecha del abdomen.

Estos síntomas no significan automáticamente que tengas cirrosis. Pero si persisten, si tienes factores de riesgo o si aparecen señales como piel amarilla, hinchazón abdominal, sangrado fácil o confusión, conviene consultar con un profesional sanitario.

Este artículo tiene fines informativos y no sustituye la valoración de un médico. Si presentas síntomas preocupantes o antecedentes de enfermedad hepática, busca atención profesional.

---

## En un vistazo

| Pregunta | Respuesta |
| :--- | :--- |
| ¿La cirrosis tiene cura? | El tejido cicatrizado avanzado generalmente no vuelve a ser normal, pero tratar la causa puede frenar la enfermedad y evitar complicaciones. |
| ¿Siempre produce dolor? | No. Muchas personas no sienten dolor durante años. |
| ¿Puede aparecer sin beber alcohol? | Sí. También puede deberse a enfermedad hepática metabólica, hepatitis virales, enfermedades autoinmunes, biliares o hereditarias. |
| ¿Es una urgencia médica? | Las complicaciones como vómitos con sangre, heces negras, confusión o abdomen muy hinchado requieren atención urgente. |

---

## Qué es la cirrosis hepática

El hígado filtra sustancias de la sangre, produce proteínas esenciales, participa en la digestión de las grasas, almacena nutrientes y regula numerosos procesos metabólicos. Cuando sufre daño repetido durante años, intenta repararse formando tejido cicatricial.

El problema aparece cuando esa cicatrización se acumula y altera la arquitectura normal del órgano. Con el tiempo disminuye el tejido sano, aumenta la fibrosis, la sangre circula con más dificultad y el hígado pierde capacidad para cumplir sus funciones. A ese estado se le llama cirrosis hepática.

La cirrosis no aparece de un día para otro. Habitualmente representa una etapa avanzada de enfermedades hepáticas que han evolucionado durante mucho tiempo.

---

## Cuáles son los primeros síntomas de cirrosis

Uno de los aspectos más importantes es que muchas personas no tienen síntomas al inicio. El hígado puede mantener una función suficiente incluso cuando ya existe daño.

Cuando aparecen síntomas tempranos, suelen ser poco específicos:

- Cansancio persistente.
- Debilidad.
- Pérdida de apetito.
- Pérdida de peso involuntaria.
- Sensación de malestar general.
- Náuseas ocasionales.
- Molestias leves en la parte superior derecha del abdomen.
- Dificultad para concentrarse.
- Sensación de llenura rápida.

Por sí solos, estos síntomas pueden tener muchas causas. La clave es consultar cuando son persistentes, progresivos o aparecen en una persona con factores de riesgo hepático.

---

## Síntomas avanzados y señales que no debes ignorar

A medida que el daño hepático progresa pueden aparecer signos más visibles:

- Piel y ojos amarillos, conocido como ictericia.
- Picazón intensa.
- Abdomen hinchado por acumulación de líquido, llamada ascitis.
- Hinchazón en piernas y tobillos.
- Aparición fácil de hematomas.
- Sangrado de nariz o encías.
- Pequeños vasos visibles en forma de araña sobre la piel.
- Enrojecimiento de las palmas de las manos.
- Pérdida de masa muscular.
- Orina oscura o heces muy pálidas.
- Somnolencia, cambios de memoria o confusión.

Estos signos pueden indicar que el hígado está funcionando peor o que existen complicaciones. Requieren evaluación médica.

---

## Cuándo acudir inmediatamente a urgencias

Busca atención médica urgente si aparece cualquiera de estos síntomas:

- Vómitos con sangre.
- Heces negras, brillantes o con sangre.
- Confusión intensa.
- Dificultad para despertar.
- Fiebre junto con abdomen muy hinchado.
- Dolor abdominal intenso.
- Dificultad para respirar.
- Desmayo o pérdida del conocimiento.
- Aumento rápido del volumen abdominal.

Estos síntomas pueden indicar complicaciones graves, como hemorragia digestiva, encefalopatía hepática, infección del líquido abdominal u otros cuadros que requieren tratamiento inmediato.

---

## Comparación: hígado sano, cirrosis inicial y cirrosis avanzada

| Característica | Hígado sano | Cirrosis inicial | Cirrosis avanzada |
| :--- | :--- | :--- | :--- |
| Tejido | Estructura normal | Comienza fibrosis relevante | Gran parte del tejido está reemplazado por cicatrices |
| Síntomas | Ninguno | Leves o inexistentes | Frecuentes y más evidentes |
| Función hepática | Normal | Generalmente conservada | Puede estar disminuida |
| Circulación sanguínea | Fluida | Puede empezar a alterarse | Mayor riesgo de hipertensión portal |
| Riesgo de complicaciones | Muy bajo | Variable | Elevado |

---

## Causas principales de cirrosis

Aunque muchas personas la relacionan solo con el alcohol, existen numerosas causas.

### Enfermedad hepática asociada al metabolismo

Actualmente es una de las causas más frecuentes en muchos países. Se relaciona con obesidad, diabetes tipo 2, colesterol elevado, resistencia a la insulina y síndrome metabólico. Puede empezar como hígado graso y progresar a inflamación, fibrosis y cirrosis.

Para ampliar este punto, puedes revisar el artículo sobre [hígado graso](/articulos/higado-graso).

### Consumo excesivo de alcohol

El consumo elevado y mantenido durante años puede producir inflamación, fibrosis y cirrosis. El riesgo depende de la cantidad, la duración del consumo, la genética, el sexo biológico, la nutrición y otras enfermedades coexistentes.

### Hepatitis B y hepatitis C

Las infecciones crónicas por virus de hepatitis pueden provocar inflamación hepática durante décadas. Hoy existen tratamientos muy eficaces, especialmente para hepatitis C, y vacunas frente a hepatitis B.

### Enfermedades autoinmunes

En algunas personas el sistema inmunitario ataca por error al hígado o las vías biliares. Requieren diagnóstico y tratamiento especializado.

### Enfermedades hereditarias

Algunas condiciones genéticas pueden dañar el hígado si no se detectan a tiempo. Entre ellas se incluyen hemocromatosis, enfermedad de Wilson y déficit de alfa-1 antitripsina.

### Enfermedades de las vías biliares

Cuando la bilis no drena correctamente o existe inflamación crónica de las vías biliares, el hígado puede lesionarse de forma progresiva.

---

## Factores que aumentan el riesgo

Conviene realizar controles médicos si existen factores como:

- Obesidad o aumento de grasa abdominal.
- Diabetes tipo 2.
- Hipertensión.
- Colesterol o triglicéridos elevados.
- Hepatitis viral previa o actual.
- Antecedentes familiares de enfermedades hepáticas.
- Consumo elevado de alcohol.
- Uso prolongado de medicamentos potencialmente hepatotóxicos sin control médico.
- Antecedentes de transfusiones antiguas o exposición a agujas no seguras.

Tener un factor de riesgo no significa que desarrollarás cirrosis, pero sí aumenta la importancia de los controles.

---

## Cómo se diagnostica la cirrosis

El diagnóstico no depende solo de los síntomas. El médico suele combinar historia clínica, exploración física y pruebas complementarias.

Las herramientas más usadas incluyen:

- Análisis de sangre, como enzimas hepáticas, bilirrubina, albúmina, plaquetas y pruebas de coagulación.
- Ecografía abdominal.
- Elastografía hepática, conocida por muchas personas como FibroScan.
- Tomografía o resonancia cuando se necesita más detalle.
- Endoscopia si existe sospecha de varices esofágicas.
- Biopsia hepática en casos seleccionados.

La elastografía permite estimar la rigidez del hígado de forma no invasiva en muchos pacientes. Una mayor rigidez puede sugerir fibrosis avanzada, aunque la interpretación siempre debe hacerla un profesional.

---

## Tratamiento de la cirrosis

El tratamiento depende de la causa, el estadio y la presencia de complicaciones. Los objetivos son detener el daño hepático, tratar la enfermedad de base, prevenir complicaciones y mantener la mejor calidad de vida posible.

Puede incluir:

- Abandono completo del alcohol cuando existe consumo de riesgo o cirrosis establecida.
- Pérdida de peso supervisada cuando hay enfermedad hepática metabólica.
- Control de diabetes, presión arterial y lípidos.
- Medicamentos antivirales para hepatitis B o C cuando corresponda.
- Tratamiento de enfermedades autoinmunes o biliares.
- Vacunación frente a infecciones indicadas por el equipo médico.
- Manejo de la hipertensión portal.
- Tratamiento de ascitis con restricción de sodio, diuréticos u otros procedimientos si se indican.
- Prevención y tratamiento de encefalopatía hepática.
- Vigilancia de cáncer hepático en pacientes con cirrosis.
- Evaluación para trasplante hepático cuando existe insuficiencia hepática avanzada.

No existe una recomendación única válida para todas las personas. La cirrosis requiere seguimiento médico individualizado.

---

## Qué puedes hacer para prevenir o reducir el riesgo

En muchos casos se puede reducir el riesgo de cirrosis actuando sobre la causa del daño hepático.

Medidas con respaldo científico:

- Mantener un peso saludable.
- Tratar el hígado graso y los factores metabólicos a tiempo.
- Controlar la diabetes.
- Limitar o evitar el alcohol; en enfermedad hepática, seguir la indicación médica, que suele ser evitarlo por completo.
- Vacunarse frente a hepatitis A o B cuando esté indicado.
- Evitar compartir agujas, objetos cortopunzantes o material que pueda contener sangre.
- Usar preservativo si existe riesgo de infecciones de transmisión sexual.
- No automedicarse con suplementos, hierbas o fármacos potencialmente hepatotóxicos.
- Realizar controles si existen antecedentes familiares o factores de riesgo.

---

## Preguntas frecuentes

### ¿Cómo saber si tengo cirrosis?

No se puede confirmar solo por síntomas. La cirrosis se diagnostica con evaluación médica, análisis de sangre, imágenes y pruebas como elastografía. Si tienes factores de riesgo o síntomas persistentes, consulta.

### ¿La cirrosis tiene cura?

El tejido cicatricial avanzado normalmente no vuelve a ser completamente normal. Sin embargo, controlar la causa puede detener o ralentizar la progresión, mejorar la función restante y reducir complicaciones.

### ¿La cirrosis siempre produce dolor?

No. Muchas personas permanecen sin dolor durante años. Algunas pueden sentir presión o molestia en la parte superior derecha del abdomen, pero el dolor no es obligatorio para que exista enfermedad hepática.

### ¿Puedo vivir muchos años con cirrosis?

Sí. El pronóstico depende de la causa, el estadio, la presencia de complicaciones, el tratamiento y el seguimiento. Algunas personas con cirrosis compensada viven muchos años con control adecuado.

### ¿La cirrosis siempre está causada por alcohol?

No. También puede deberse a enfermedad hepática metabólica, hepatitis virales crónicas, enfermedades autoinmunes, enfermedades hereditarias y trastornos de las vías biliares.

### ¿Qué alimentos debo evitar si tengo cirrosis?

La alimentación debe adaptarse a cada caso. En general se evita el alcohol y se siguen indicaciones médicas sobre sodio, proteínas, calorías y líquidos, especialmente si hay ascitis, encefalopatía o desnutrición.

### ¿La cirrosis tiene etapas?

Sí. Suele hablarse de cirrosis compensada, cuando el hígado aún mantiene funciones suficientes, y cirrosis descompensada, cuando aparecen complicaciones como ascitis, sangrado por varices, ictericia o encefalopatía.

---

## Conclusión

La cirrosis hepática suele desarrollarse lentamente y durante mucho tiempo puede no producir síntomas claros. Precisamente por eso no conviene ignorar el cansancio persistente, la pérdida de peso sin explicación, la ictericia, la hinchazón abdominal o los cambios de concentración cuando aparecen.

Recibir un diagnóstico de cirrosis no significa automáticamente que no exista tratamiento. Hoy se dispone de mejores herramientas para identificar la enfermedad antes, tratar su causa, prevenir complicaciones y acompañar a cada persona con un plan médico adecuado. Si tienes factores de riesgo o síntomas persistentes, consultar a tiempo puede marcar una diferencia importante.

---

## Referencias científicas

1. National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK). Cirrhosis.
2. American Association for the Study of Liver Diseases (AASLD). Practice Guidelines and Guidances.
3. European Association for the Study of the Liver (EASL). Clinical Practice Guidelines.
4. NHS. Cirrhosis.
5. Mayo Clinic. Cirrhosis: Symptoms and causes.
6. American Liver Foundation. Cirrhosis.
7. World Health Organization. Hepatitis and liver disease resources.`;

const postData = {
  title: 'Primeros síntomas de cirrosis hepática: señales que debes conocer',
  slug,
  excerpt:
    'Descubre cuáles son los primeros síntomas de la cirrosis hepática, cuándo acudir al médico, qué pruebas la detectan y cómo puede tratarse según la evidencia científica.',
  content,
  category: 'Salud del Hígado, Hígado Graso, Metabolismo',
  image_url: '/images/cirrosis%20hepatica%20nuevo%20articulo.png',
  author: 'Daniel Falcón',
  is_published: true,
  tags: 'cirrosis hepática, primeros síntomas de cirrosis, síntomas de cirrosis, salud del hígado, hígado graso, hepatitis',
  updated_at: new Date().toISOString(),
};

(async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(postData, { onConflict: 'slug' })
    .select('id,title,slug,image_url,is_published,created_at,updated_at')
    .single();

  if (error) {
    console.error('Publish failed:', error);
    process.exit(1);
  }

  console.log(JSON.stringify(data, null, 2));
})();
