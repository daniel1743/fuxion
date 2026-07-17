process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
if (!DEEPSEEK_API_KEY) {
  console.error("DEEPSEEK_API_KEY no encontrada en .env");
  process.exit(1);
}

const trackerPath = path.join(__dirname, '..', 'articles_tracker.json');
const tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
const bible = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'editorial_bible_2026.json'), 'utf8'));

const exampleArticle = fs.readFileSync(path.join(__dirname, '..', 'docs', 'articles', 'permeabilidad-intestinal-mecanismos-de-la-barrera-epitelial-y-factores-moduladores.md'), 'utf8');

const generateMarkdown = async (title, domain) => {
  const prompt = `
Eres un escritor médico experto (Periodista Investigador y Educador Científico) para el Proyecto AURORA.
Vas a escribir un artículo altamente técnico pero accesible (YMYL, E-E-A-T, AEO) siguiendo ESTRICTAMENTE esta Biblia Editorial:

${JSON.stringify(bible, null, 2)}

EJEMPLO DE ESTRUCTURA Y TONO ESPERADO:
${exampleArticle}

TAREA:
Escribe un artículo completo.
Autor: Daniel Falcón, Investigador Periodístico y Educador Científico
Fecha: ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}

Requisitos críticos:
- Devuelve SOLO el Markdown, sin \`\`\`markdown al inicio ni final.
- El H1 debe ser el título optimizado.
- Debajo del H1 y los metadatos (Autor, Revisión, Tiempo de lectura), incluye un resumen AEO (bloque con > **Lo más importante**).
- Incluye al menos una tabla comparativa Markdown.
- Incluye sección de "Desmitificación Científica" y "Guía de Advertencia (Red Flags)".
- Incluye sección de "Preguntas frecuentes" y "Referencias Científicas".
- Respeta ABSOLUTAMENTE el lenguaje YMYL (no curar, no diagnosticar).
`;

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: `Escribe un artículo completo sobre el tema: "${title}" que pertenece al dominio: "${domain}".` }
        ],
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errText}`);
    }

    const data = await response.json();
    let text = data.choices[0].message.content;
    
    // Limpiar backticks si los hay
    if (text.startsWith('```markdown')) text = text.substring(11);
    if (text.startsWith('```')) text = text.substring(3);
    if (text.endsWith('```')) text = text.substring(0, text.length - 3);

    return text.trim();
  } catch (err) {
    console.error(`Error generando ${title}:`, err.message);
    return null;
  }
};

const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const run = async () => {
  const pendingArticles = tracker.articles.filter(a => a.id >= 11 && a.id <= 20 && a.status === 'pending');
  
  for (const article of pendingArticles) {
    console.log(`Generando artículo #${article.id}: ${article.title}...`);
    const mdContent = await generateMarkdown(article.title, article.domain);
    
    if (mdContent) {
      const slug = slugify(article.title);
      const filename = `${slug}.md`;
      const filepath = path.join(__dirname, '..', 'docs', 'articles', filename);
      
      fs.writeFileSync(filepath, mdContent);
      console.log(`Guardado en: ${filepath}`);
      
      // Actualizar tracker
      article.status = 'published';
      article.published_url = `/docs/articles/${filename}`;
      article.publish_date = new Date().toISOString();
      
      tracker.metadata.published_articles += 1;
      tracker.metadata.pending_articles -= 1;
      
      fs.writeFileSync(trackerPath, JSON.stringify(tracker, null, 2));
      console.log(`Tracker actualizado para #${article.id}.`);
    } else {
      console.log(`Fallo al generar #${article.id}. Saltando...`);
    }
  }
  
  console.log('Generación completada.');
};

run();
