process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const contentHtml = `
<h2>A veces un diagnóstico llega cuando menos lo esperamos</h2>
<p>Quizá acudiste a un chequeo de rutina. Tal vez una ecografía realizada por otra razón terminó mostrando una frase que nunca imaginaste escuchar: <strong>"tienes hígado graso"</strong>.</p>
<p>Es normal que aparezcan preguntas.</p>
<p>¿Es grave? ¿Voy a desarrollar una enfermedad del hígado? ¿Hice algo mal? ¿Tiene solución?</p>
<p>Si hoy estás buscando respuestas, queremos decirte algo importante desde el principio: recibir este diagnóstico no significa que todo esté perdido. En muchos casos, detectar el hígado graso es una oportunidad para actuar a tiempo y cuidar uno de los órganos más importantes del cuerpo.</p>
<p>En Bienestar en Claro creemos que la información clara, responsable y cercana también forma parte del cuidado de la salud. Por eso, este artículo busca ayudarte a comprender qué es el hígado graso, por qué aparece y qué papel pueden tener los hábitos saludables en su evolución.</p>

<h2>¿Qué es el hígado graso?</h2>
<p>El hígado graso, conocido en medicina como <strong>esteatosis hepática</strong>, es una condición en la que se acumula una cantidad excesiva de grasa dentro de las células del hígado.</p>
<p>El hígado contiene naturalmente una pequeña cantidad de grasa. Sin embargo, cuando esa cantidad aumenta por encima de lo esperado, puede comenzar a afectar su funcionamiento.</p>
<p>No siempre produce síntomas y, en muchas personas, se descubre de manera incidental durante un examen de imagen o un análisis de laboratorio.</p>

<h2>¿Por qué el hígado es tan importante?</h2>
<p>Aunque pocas veces pensamos en él, el hígado trabaja silenciosamente todos los días. Entre sus funciones se encuentran:</p>
<ul>
  <li>Procesar los nutrientes que obtenemos de los alimentos.</li>
  <li>Participar en el metabolismo de grasas, proteínas y carbohidratos.</li>
  <li>Almacenar vitaminas y minerales.</li>
  <li>Producir sustancias necesarias para la coagulación.</li>
  <li>Colaborar en la eliminación de productos de desecho del organismo.</li>
  <li>Ayudar en múltiples procesos relacionados con el equilibrio interno del cuerpo.</li>
</ul>
<p>Cuando el hígado comienza a acumular grasa, estas funciones pueden verse alteradas con el paso del tiempo.</p>

<h2>¿Por qué aparece el hígado graso?</h2>
<p>No existe una única causa.</p>
<p>Actualmente se sabe que el hígado graso puede estar relacionado con diversos factores que, muchas veces, se combinan entre sí. Entre ellos se encuentran:</p>
<ul>
  <li>Sobrepeso u obesidad.</li>
  <li>Diabetes tipo 2.</li>
  <li>Resistencia a la insulina.</li>
  <li>Colesterol o triglicéridos elevados.</li>
  <li>Sedentarismo.</li>
  <li>Alimentación desequilibrada.</li>
  <li>Consumo excesivo de alcohol en algunos casos.</li>
  <li>Factores genéticos y familiares.</li>
</ul>
<p>Es importante aclarar que una persona puede desarrollar hígado graso incluso si no consume alcohol.</p>
<p>Por eso, este diagnóstico no debe interpretarse como un juicio sobre el estilo de vida de alguien. Cada caso tiene su propia historia y merece ser evaluado de manera individual.</p>

<h2>¿El hígado graso produce síntomas?</h2>
<p>En muchas personas, no.</p>
<p>De hecho, es frecuente convivir durante años con esta condición sin notar molestias evidentes. Cuando aparecen síntomas, suelen ser poco específicos, por ejemplo:</p>
<ul>
  <li>Cansancio persistente.</li>
  <li>Sensación de falta de energía.</li>
  <li>Molestias o presión en la parte superior derecha del abdomen.</li>
  <li>Sensación de pesadez después de algunas comidas.</li>
</ul>
<p>Estos síntomas pueden deberse a muchas otras causas, por lo que nunca deben utilizarse para establecer un diagnóstico por cuenta propia.</p>

<h2>¿Siempre es una enfermedad grave?</h2>
<p>No necesariamente.</p>
<p>Aquí es donde queremos transmitirte un mensaje de tranquilidad. En muchas personas, el hígado graso permanece estable durante años y no llega a producir complicaciones importantes.</p>
<p>Sin embargo, en otras puede progresar si persisten los factores que favorecen el daño hepático.</p>
<p>Por eso, detectar esta condición a tiempo ofrece una oportunidad valiosa para adoptar cambios que favorezcan la salud del hígado. El objetivo no es vivir con miedo, sino con información.</p>

<h2>¿Puede evolucionar si no se controla?</h2>
<p>En algunos casos, sí.</p>
<p>Cuando la acumulación de grasa se acompaña de inflamación persistente, el hígado puede comenzar a desarrollar lesiones que, con el paso de los años, favorezcan la aparición de fibrosis.</p>
<p>En un porcentaje menor de personas, ese proceso puede avanzar hacia etapas más complejas de enfermedad hepática. Esto no significa que vaya a ocurrir en todos los casos.</p>
<p>Precisamente por eso es tan importante el seguimiento médico y la adopción de hábitos saludables desde etapas tempranas.</p>

<h2>El papel de la alimentación y el estilo de vida</h2>
<p>Como investigadores de salud, sabemos que la alimentación por sí sola no reemplaza la evaluación médica. Sin embargo, constituye una de las herramientas más importantes para cuidar el hígado.</p>
<p>Una alimentación equilibrada, junto con otros hábitos saludables, puede contribuir al bienestar general y favorecer la salud metabólica. De forma general, suele recomendarse:</p>
<ul>
  <li>Consumir una amplia variedad de frutas y verduras.</li>
  <li>Preferir alimentos frescos frente a ultraprocesados.</li>
  <li>Elegir fuentes de proteínas de buena calidad.</li>
  <li>Favorecer cereales integrales cuando sean adecuados.</li>
  <li>Mantener una hidratación suficiente.</li>
  <li>Realizar actividad física adaptada a cada persona.</li>
  <li>Dormir adecuadamente.</li>
  <li>Evitar el consumo excesivo de alcohol.</li>
</ul>
<p>Las recomendaciones pueden variar según la situación de cada persona, por lo que siempre deben adaptarse de manera individual.</p>

<h2>Más allá del diagnóstico</h2>
<p>A veces, recibir un diagnóstico hace que nos sintamos culpables. Es comprensible pensar: "¿podría haberlo evitado?" o "¿qué hice mal?".</p>
<p>Pero la salud rara vez depende de un solo factor. La genética, el metabolismo, el entorno, el nivel de actividad física, la alimentación y muchas otras circunstancias influyen en el funcionamiento del organismo.</p>
<p>Más que mirar hacia atrás buscando culpables, puede ser más útil preguntarse: <strong>¿Qué puedo hacer hoy para cuidar mejor de mi salud?</strong> Esa suele ser una pregunta mucho más poderosa.</p>

<h2>Un mensaje para ti</h2>
<p>Si hoy acabas de descubrir que tienes hígado graso, intenta no dejarte llevar por el miedo ni por la información alarmista que a veces circula en internet.</p>
<p>Infórmate con fuentes confiables. Mantén una comunicación abierta con los profesionales que te acompañan. Y recuerda que los cambios importantes rara vez ocurren de un día para otro. Los hábitos saludables se construyen paso a paso.</p>
<p>Cada decisión que tomas para cuidar de tu salud cuenta.</p>
`;

async function publishArticle() {
  console.log("Conectando a Supabase para publicar tercer artículo...");
  const postData = {
    title: "¿Qué es el hígado graso? Causas, síntomas y cómo cuidar la salud del hígado",
    slug: "higado-graso",
    excerpt: "Conoce qué es el hígado graso, sus causas, síntomas y cómo cuidar la salud de tu hígado con hábitos saludables e información basada en evidencia.",
    content: contentHtml,
    category: "Salud del Hígado",
    author: "Daniel Falcón",
    is_published: true,
    image_url: '/images/articles/higado-graso-causas-sintomas.jpg'
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
