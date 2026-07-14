process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const contentHtml = `
<p>Escuchar la frase "usted tiene cirrosis hepática" suele provocar angustia, incertidumbre y muchas preguntas. Es completamente normal sentir preocupación. Muchas personas asocian inmediatamente esta enfermedad con una situación irreversible o con un desenlace negativo. Sin embargo, la realidad es más amplia.</p>
<p>Hoy en día se sabe que, dependiendo de la causa, del momento en que se detecte y del cuidado que reciba la persona, es posible frenar el avance de la enfermedad, mejorar la calidad de vida e incluso recuperar parte de la función del hígado cuando aún existe tejido sano.</p>
<p>Este artículo tiene un propósito educativo y busca ayudarte a comprender qué es la cirrosis hepática, cuáles son sus causas, qué síntomas puede producir y qué papel desempeñan la alimentación y los hábitos saludables en el cuidado del hígado.</p>

<h2>¿Qué es la cirrosis hepática?</h2>
<p>La cirrosis hepática es una enfermedad crónica en la que el hígado sufre un daño continuo durante muchos años. Como consecuencia, el tejido sano va siendo reemplazado por tejido cicatricial (fibrosis), dificultando que el órgano realice correctamente sus funciones.</p>
<p>El hígado es uno de los órganos más importantes del cuerpo humano. Entre sus principales funciones están:</p>
<ul>
  <li>Filtrar sustancias presentes en la sangre.</li>
  <li>Procesar nutrientes provenientes de los alimentos.</li>
  <li>Participar en la digestión de las grasas.</li>
  <li>Almacenar vitaminas y minerales.</li>
  <li>Producir proteínas esenciales para el organismo.</li>
  <li>Colaborar en el metabolismo energético.</li>
</ul>
<p>Cuando aparece la cirrosis, todas estas funciones pueden verse afectadas de forma gradual.</p>

<h2>¿Cómo se desarrolla la cirrosis hepática?</h2>
<p>La cirrosis no aparece de un día para otro. Generalmente es el resultado de años de inflamación o daño repetido sobre el hígado. Durante mucho tiempo el órgano intenta repararse a sí mismo. Sin embargo, cuando el daño persiste, comienzan a formarse cicatrices permanentes que alteran su estructura normal. Mientras más tejido cicatricial exista, más difícil será que el hígado funcione adecuadamente.</p>

<h2>¿Cuáles son las causas más frecuentes?</h2>
<p>Existen diversas enfermedades y condiciones capaces de producir cirrosis. Entre las más comunes se encuentran:</p>
<ul>
  <li>Consumo excesivo y prolongado de alcohol.</li>
  <li>Hígado graso asociado al sobrepeso, obesidad o diabetes.</li>
  <li>Hepatitis virales crónicas.</li>
  <li>Enfermedades autoinmunes.</li>
  <li>Algunas enfermedades hereditarias.</li>
  <li>Alteraciones de las vías biliares.</li>
  <li>Exposición prolongada a ciertas sustancias tóxicas.</li>
</ul>
<p>Es importante entender que no todas las personas con cirrosis desarrollaron la enfermedad por consumo de alcohol. Este es uno de los mitos más frecuentes.</p>

<h2>¿Cuáles son los primeros síntomas?</h2>
<p>En sus etapas iniciales muchas personas no presentan síntomas. De hecho, algunas descubren la enfermedad durante un examen de rutina. Cuando comienzan a aparecer molestias, estas pueden incluir:</p>
<ul>
  <li>Cansancio constante.</li>
  <li>Debilidad.</li>
  <li>Pérdida del apetito.</li>
  <li>Disminución de peso sin explicación.</li>
  <li>Sensación de llenura rápida.</li>
  <li>Náuseas ocasionales.</li>
  <li>Malestar abdominal.</li>
</ul>

<p>A medida que la enfermedad avanza pueden aparecer otros signos como:</p>
<ul>
  <li>Color amarillo en la piel y ojos.</li>
  <li>Hinchazón del abdomen.</li>
  <li>Hinchazón de piernas.</li>
  <li>Picazón en la piel.</li>
  <li>Aparición fácil de moretones.</li>
  <li>Cambios en la concentración.</li>
  <li>Somnolencia excesiva.</li>
</ul>
<p>No todas las personas presentan los mismos síntomas.</p>

<h2>¿La cirrosis tiene cura?</h2>
<p>Esta es probablemente la pregunta más frecuente. La respuesta depende del momento en que se detecte y de la causa que produjo el daño hepático. Cuando existe una cicatriz establecida, esa parte del tejido generalmente no vuelve a ser completamente normal.</p>
<p>Sin embargo, eso no significa que todo esté perdido. En muchas personas es posible:</p>
<ul>
  <li>Detener el avance de la enfermedad.</li>
  <li>Evitar nuevas lesiones.</li>
  <li>Mejorar significativamente la función hepática restante.</li>
  <li>Disminuir complicaciones.</li>
  <li>Mantener una buena calidad de vida durante muchos años.</li>
</ul>
<p>Por eso el diagnóstico temprano es tan importante.</p>

<h2>¿La cirrosis siempre es grave?</h2>
<p>No necesariamente. Existen personas con cirrosis compensada que pueden llevar una vida bastante activa durante muchos años bajo seguimiento médico. La gravedad depende de factores como la cantidad de tejido sano que conserva el hígado, la causa del daño, la presencia de complicaciones y el compromiso del paciente con su tratamiento y estilo de vida.</p>

<h2>La importancia de la alimentación</h2>
<p>Como investigador de salud, uno de los mensajes más importantes es que la alimentación no reemplaza el tratamiento médico, pero sí constituye un pilar fundamental para cuidar el hígado.</p>
<p>Una alimentación equilibrada puede ayudar a mantener una buena nutrición, evitar la pérdida excesiva de masa muscular, favorecer el funcionamiento del organismo y contribuir al bienestar general.</p>
<p>En términos generales suele recomendarse:</p>
<ul>
  <li>Consumir frutas y verduras variadas.</li>
  <li>Preferir proteínas de buena calidad.</li>
  <li>Elegir cereales integrales cuando sean apropiados.</li>
  <li>Mantener una adecuada hidratación.</li>
  <li>Limitar alimentos ultraprocesados.</li>
  <li>Reducir el exceso de sal cuando el profesional de salud lo indique.</li>
  <li>Evitar completamente el consumo de alcohol.</li>
</ul>
<p>Las necesidades nutricionales pueden variar considerablemente entre una persona y otra, por lo que siempre es recomendable recibir orientación personalizada.</p>

<h2>¿Se puede hacer ejercicio?</h2>
<p>En muchos casos sí. La actividad física adaptada a la condición de cada persona puede ayudar a conservar masa muscular, mejorar la movilidad y favorecer el bienestar general. Siempre debe ser autorizada por el equipo de salud, especialmente cuando existen complicaciones.</p>

<h2>¿Qué complicaciones pueden aparecer?</h2>
<p>Cuando la enfermedad progresa pueden desarrollarse algunas complicaciones importantes como acumulación de líquido en el abdomen, aumento de la presión en las venas del hígado, sangrado digestivo, infecciones, alteraciones en el funcionamiento cerebral relacionadas con el hígado o mayor riesgo de cáncer hepático.</p>

<h2>Mitos frecuentes sobre la cirrosis hepática</h2>
<ul>
  <li><strong>"La cirrosis solo la produce el alcohol":</strong> Falso. Existen múltiples causas.</li>
  <li><strong>"Si tengo cirrosis, mi vida terminó":</strong> Falso. Muchas personas logran convivir con la enfermedad durante años siguiendo las recomendaciones.</li>
  <li><strong>"No vale la pena cambiar mi alimentación":</strong> Falso. Una buena nutrición marca una diferencia enorme.</li>
  <li><strong>"No tengo síntomas, así que mi hígado está bien":</strong> No siempre. La cirrosis avanza en silencio.</li>
</ul>

<h2>¿Cuándo consultar nuevamente?</h2>
<p>Si ya tienes un diagnóstico de cirrosis hepática, es importante mantener controles periódicos. Busca atención médica inmediata si presentas sangrado digestivo, confusión importante, fiebre persistente, dolor abdominal intenso, dificultad para respirar o aumento rápido del volumen abdominal.</p>

<h2>Un mensaje para quien acaba de recibir este diagnóstico</h2>
<p>Es normal sentir miedo y tener muchas preguntas. La buena noticia es que actualmente existe un mejor conocimiento sobre la enfermedad que hace algunos años. Con un diagnóstico temprano, controles médicos periódicos, una alimentación adecuada, actividad física cuando sea posible y hábitos saludables, muchas personas logran mantener una buena calidad de vida.</p>
<p>Cada caso es diferente, por lo que evita compararte con otras personas. Lo más importante es seguir el plan indicado por tu equipo de salud y convertir el cuidado del hígado en una prioridad diaria.</p>
`;

async function publishArticle() {
  console.log("Conectando a Supabase para publicar artículo...");
  const postData = {
    title: "Cirrosis hepática: qué es, causas, síntomas, tratamiento y cómo cuidar tu hígado desde la alimentación",
    slug: "cirrosis-hepatica",
    excerpt: "Descubre qué es la cirrosis hepática, sus causas, síntomas, diagnóstico y cómo una buena alimentación y hábitos saludables pueden ayudar a cuidar el hígado.",
    content: contentHtml,
    category: "Salud del Hígado",
    author: "Daniel Falcón",
    is_published: true,
    // we don't have the image yet for cirrosis, so leaving image_url blank or null
  };

  const { data, error } = await supabase
    .from('blog_posts')
    .insert([postData])
    .select();

  if (error) {
    console.error("Error al publicar:", error);
  } else {
    console.log("¡Artículo publicado exitosamente!", data);
  }
}

publishArticle();
