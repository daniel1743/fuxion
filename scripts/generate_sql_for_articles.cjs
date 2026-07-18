const fs = require('fs');
const path = require('path');

const trackerPath = path.join(__dirname, '..', 'articles_tracker.json');
const tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));

const sqlFile = path.join(__dirname, '..', 'supabase', 'migrations', 'insert_articles_11_to_20.sql');
let sql = `
-- Inserts para los artículos del 11 al 20
`;

const extractExcerpt = (md) => {
    // Buscar la sección de resumen AEO o usar el primer párrafo
    const summaryMatch = md.match(/> \*\*Lo más importante\*\*:?\s*([^]*?)(?=\n\n|\n##|$)/);
    if (summaryMatch && summaryMatch[1]) {
        return summaryMatch[1].trim().replace(/\n/g, ' ').substring(0, 300);
    }
    // Fallback: buscar el primer texto después del título
    const textMatch = md.match(/# [^\n]+\n+([^\n]+)/);
    if (textMatch && textMatch[1]) {
        return textMatch[1].trim().replace(/\n/g, ' ').substring(0, 300);
    }
    return "Artículo de bienestar en claro.";
};

const escapeSql = (str) => {
    if (!str) return "''";
    return "'" + str.replace(/'/g, "''") + "'";
};

tracker.articles.filter(a => a.id >= 11 && a.id <= 20).forEach(article => {
    const slug = article.title.toLowerCase().replace(/[\s\W_]+/g, '-').replace(/^-|-$/g, '');
    const filename = `${slug}.md`;
    const filepath = path.join(__dirname, '..', 'docs', 'articles', filename);
    
    if (fs.existsSync(filepath)) {
        const mdContent = fs.readFileSync(filepath, 'utf8');
        const excerpt = extractExcerpt(mdContent);
        
        sql += `
INSERT INTO public.wellness_articles (
  title, 
  slug, 
  category, 
  excerpt, 
  content, 
  is_published, 
  editor_name,
  editor_email,
  owner_user_id
) VALUES (
  ${escapeSql(article.title)},
  ${escapeSql(slug)},
  ${escapeSql(article.category)},
  ${escapeSql(excerpt)},
  ${escapeSql(mdContent)},
  true,
  'Daniel Falcón',
  'falcondaniel37@gmail.com',
  (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  editor_name = EXCLUDED.editor_name,
  editor_email = EXCLUDED.editor_email,
  is_published = EXCLUDED.is_published;
`;
    }
});

fs.writeFileSync(sqlFile, sql);
console.log(`SQL generado en ${sqlFile}`);
