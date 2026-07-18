const fs = require('fs');
const path = require('path');

const trackerPath = path.join(__dirname, '..', 'articles_tracker.json');
const tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));

const sqlFile = path.join(__dirname, '..', 'supabase', 'migrations', 'insert_ALL_articles_1_to_20.sql');
let sql = `-- Inserts para TODOS los artículos (1 al 20)\n\n`;

const extractExcerpt = (md) => {
    const summaryMatch = md.match(/> \*\*Lo más importante\*\*:?\s*([^]*?)(?=\n\n|\n##|$)/);
    if (summaryMatch && summaryMatch[1]) {
        return summaryMatch[1].trim().replace(/\n/g, ' ').substring(0, 300);
    }
    const textMatch = md.match(/# [^\n]+\n+([^\n]+)/);
    if (textMatch && textMatch[1]) {
        return textMatch[1].trim().replace(/\n/g, ' ').substring(0, 300);
    }
    return 'Artículo de bienestar en claro.';
};

const escapeSql = (str) => {
    if (!str) return "''";
    return "'" + str.replace(/'/g, "''") + "'";
};

const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const allFiles = fs.readdirSync(path.join(__dirname, '..', 'docs', 'articles')).filter(f => f.endsWith('.md'));

tracker.articles.filter(a => a.id >= 1 && a.id <= 20).forEach(article => {
    const slug1 = slugify(article.title);
    const slug2 = article.title.toLowerCase().replace(/[\s\W_]+/g, '-').replace(/^-|-$/g, '');
    
    // Find matching file
    const slug1Prefix = slug1.split('-').slice(0, 3).join('-');
    const slug2Prefix = slug2.split('-').slice(0, 3).join('-');
    let filename = allFiles.find(f => f === `${slug1}.md` || f === `${slug2}.md` || f.startsWith(`${slug1}-`) || f.startsWith(`${slug2}-`) || f.startsWith(`${slug1Prefix}-`) || f.startsWith(`${slug2Prefix}-`));
    
    // Explicit overrides
    if (article.id === 2) {
        filename = 'permeabilidad-intestinal-mecanismos-de-la-barrera-epitelial-y-factores-moduladores.md';
    }
    
    if (filename) {
        const filepath = path.join(__dirname, '..', 'docs', 'articles', filename);
        const mdContent = fs.readFileSync(filepath, 'utf8');
        const excerpt = extractExcerpt(mdContent);
        const finalSlug = filename.replace('.md', '');
        
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
  ${escapeSql(finalSlug)},
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
    } else {
        console.warn(`No file found for article: ${article.title}`);
    }
});

fs.writeFileSync(sqlFile, sql);
console.log(`SQL generado en ${sqlFile}`);
