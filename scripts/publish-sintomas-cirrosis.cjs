process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const contentHtml = `
<h2>Tal vez acabas de recibir un diagnóstico... o simplemente tienes miedo de que algo no esté bien</h2>
<p>Si llegaste hasta aquí porque un médico te habló de cirrosis hepática, o porque has comenzado a notar síntomas que te preocupan, queremos decirte algo antes de empezar: es completamente normal sentir miedo.</p>
<p>Muchas personas salen de la consulta con más preguntas que respuestas. Entre los nervios, los términos médicos y la preocupación, es fácil olvidar parte de lo que explicó el profesional de salud.</p>
<p>Este artículo busca acompañarte en ese momento. Queremos ayudarte a comprender cómo suele manifestarse la cirrosis hepática, cuáles son las señales que no debes ignorar y, sobre todo, recordarte que cada persona vive esta enfermedad de una manera diferente.</p>
<p>No estás solo en este proceso.</p>

<h2>¿La cirrosis hepática produce síntomas desde el principio?</h2>
<p>No siempre.</p>
<p>De hecho, una de las razones por las que esta enfermedad puede pasar desapercibida durante años es que, en sus etapas iniciales, muchas personas no sienten absolutamente nada.</p>
<p>El hígado tiene una enorme capacidad para seguir funcionando incluso cuando ya ha sufrido parte del daño. Por eso algunas personas descubren que tienen cirrosis durante un examen de rutina o una evaluación realizada por otra razón completamente distinta.</p>
<p>Esto significa que la ausencia de síntomas no siempre indica que el hígado esté completamente sano.</p>

<h2>Las primeras señales suelen ser muy discretas</h2>
<p>Cuando comienzan a aparecer los síntomas, muchas veces son tan generales que es fácil atribuirlos al estrés, al trabajo o simplemente al cansancio de la vida diaria.</p>
<p>Entre los primeros cambios que algunas personas describen se encuentran:</p>
<ul>
  <li>Sensación constante de fatiga.</li>
  <li>Menos energía para realizar actividades habituales.</li>
  <li>Debilidad muscular.</li>
  <li>Disminución del apetito.</li>
  <li>Pérdida de peso sin proponérselo.</li>
  <li>Molestias leves en la parte superior derecha del abdomen.</li>
  <li>Digestiones más pesadas de lo habitual.</li>
</ul>
<p>Por sí solos, estos síntomas no significan necesariamente que exista una enfermedad hepática, pero cuando aparecen de forma persistente es importante consultar con un profesional.</p>

<h2>El cansancio suele ser uno de los síntomas más frecuentes</h2>
<p>Muchas personas cuentan que "algo cambió" mucho antes del diagnóstico.</p>
<p>No era un dolor intenso. No era una molestia específica. Simplemente sentían que ya no tenían la misma energía de antes.</p>
<p>Algunas describen esa sensación como un agotamiento que no mejora incluso después de descansar o dormir bien. Ese cansancio puede afectar el trabajo, la actividad física e incluso el ánimo.</p>

<h2>¿La cirrosis hepática duele?</h2>
<p>Es una pregunta muy frecuente. La respuesta es que no siempre produce dolor.</p>
<p>Algunas personas nunca sienten molestias importantes en el hígado. Otras experimentan una sensación de presión o incomodidad debajo de las costillas del lado derecho.</p>
<p>Cuando aparece un dolor intenso o repentino, siempre debe ser evaluado por un profesional de la salud, ya que podría indicar otra condición que requiere atención.</p>

<h2>Síntomas que pueden aparecer cuando la enfermedad avanza</h2>
<p>Cuando el hígado comienza a perder una parte importante de su funcionamiento, pueden aparecer señales más evidentes. Entre ellas se encuentran:</p>

<h3>Color amarillo en la piel o en los ojos</h3>
<p>Este cambio recibe el nombre de ictericia y ocurre cuando el organismo no elimina adecuadamente una sustancia llamada bilirrubina. Es uno de los signos más conocidos de las enfermedades hepáticas.</p>

<h3>Hinchazón del abdomen</h3>
<p>Algunas personas comienzan a notar que el abdomen aumenta de tamaño de manera progresiva. No siempre se debe al aumento de peso. En algunos casos puede relacionarse con acumulación de líquido dentro de la cavidad abdominal.</p>

<h3>Hinchazón de piernas y tobillos</h3>
<p>La retención de líquidos también puede aparecer en las extremidades inferiores. Muchas personas observan que los zapatos comienzan a sentirse más ajustados o que las piernas se inflaman al finalizar el día.</p>

<h3>Picazón en la piel</h3>
<p>Aunque pocas personas la relacionan con el hígado, la picazón persistente puede ser otro síntoma asociado a algunas enfermedades hepáticas. Puede afectar la calidad del sueño y el bienestar diario.</p>

<h3>Aparición fácil de moretones</h3>
<p>El hígado participa en la producción de proteínas relacionadas con la coagulación. Cuando su funcionamiento disminuye, algunas personas notan que aparecen moretones con mayor facilidad o que pequeños cortes tardan más tiempo en dejar de sangrar.</p>

<h3>Cambios en la concentración</h3>
<p>En etapas más avanzadas algunas personas pueden experimentar:</p>
<ul>
  <li>Dificultad para concentrarse.</li>
  <li>Lentitud para pensar.</li>
  <li>Cambios en la memoria.</li>
  <li>Somnolencia excesiva.</li>
</ul>
<p>Estos síntomas siempre deben comunicarse al equipo médico.</p>

<h2>Cada persona puede experimentar la enfermedad de forma diferente</h2>
<p>Es importante recordar que no existe una lista de síntomas que se presente exactamente igual en todos los pacientes.</p>
<p>Algunas personas viven muchos años con muy pocas molestias. Otras desarrollan síntomas antes. La evolución depende de múltiples factores, entre ellos la causa de la enfermedad, el estado general de salud y el momento en que se realizó el diagnóstico.</p>
<p>Por eso es tan importante evitar compararse con otras personas o con historias que se leen en internet.</p>

<h2>¿Cuándo debes buscar atención médica de inmediato?</h2>
<p>Si ya tienes un diagnóstico de cirrosis hepática, existen algunos síntomas que requieren valoración médica urgente. Entre ellos destacan:</p>
<ul>
  <li>Vómitos con sangre.</li>
  <li>Heces negras o con sangre.</li>
  <li>Confusión importante o dificultad para mantenerse despierto.</li>
  <li>Fiebre persistente.</li>
  <li>Dolor abdominal intenso.</li>
  <li>Dificultad para respirar.</li>
  <li>Hinchazón abdominal que aumenta rápidamente.</li>
  <li>Desmayos o pérdida de conciencia.</li>
</ul>
<p>Buscar atención temprana puede hacer una diferencia importante.</p>

<h2>Lo que muchas personas sienten... pero pocas se atreven a decir</h2>
<p>Después del diagnóstico, no solo aparecen síntomas físicos. También llegan emociones muy intensas.</p>
<p>Es común sentir miedo, incertidumbre, tristeza o incluso culpa, especialmente cuando no se entiende bien por qué apareció la enfermedad. Si te identificas con esto, recuerda que tus emociones también forman parte del proceso.</p>
<p>Hablar con tus seres queridos, resolver tus dudas con el equipo de salud y buscar información confiable puede ayudarte a recuperar poco a poco la tranquilidad. No necesitas enfrentar este camino completamente solo.</p>

<h2>Escuchar a tu cuerpo es una forma de cuidarte</h2>
<p>El cuerpo suele enviar señales cuando algo necesita atención. No significa vivir con miedo ni interpretar cada molestia como una emergencia, pero sí aprender a reconocer los cambios que merecen una consulta.</p>
<p>Conocer los síntomas de la cirrosis hepática permite actuar a tiempo, seguir los controles indicados y tomar decisiones que favorezcan el cuidado del hígado.</p>

<h2>Un mensaje para ti</h2>
<p>Si hoy estás leyendo este artículo porque acabas de recibir un diagnóstico, queremos dejarte con una idea importante. La cirrosis hepática no define quién eres. Es una condición de salud que requiere atención, seguimiento y cambios en algunos hábitos, pero muchas personas logran convivir con ella durante años manteniendo una buena calidad de vida.</p>
<p>Da un paso a la vez. Haz las preguntas que necesites. Infórmate en fuentes confiables. Y recuerda que pedir ayuda nunca es una señal de debilidad, sino una forma de cuidar de ti.</p>
`;

async function publishArticle() {
  console.log("Conectando a Supabase para publicar segundo artículo...");
  const postData = {
    title: "Síntomas de la cirrosis hepática: primeras señales, síntomas avanzados y cuándo consultar",
    slug: "sintomas-cirrosis-hepatica",
    excerpt: "Conoce los síntomas de la cirrosis hepática, desde las primeras señales hasta los signos de alarma. Aprende cuándo consultar y qué esperar durante la enfermedad.",
    content: contentHtml,
    category: "Salud del Hígado",
    author: "Daniel Falcón",
    is_published: true,
    image_url: null // We don't have an image for this yet, so leaving it null
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
