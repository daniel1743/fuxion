import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const articlesDir = path.join(__dirname, '../docs/articles');

async function publishArticles() {
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');
    
    // Extract title (first line starting with #)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : file.replace('.md', '');
    
    // Generate slug
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
      
    // Extract excerpt from the AEO block
    const aeoMatch = content.match(/> \*\*Lo más importante\*\*\s*\n>\s*(.+)/);
    const fallbackExcerpt = content.split('\n\n').find(p => !p.startsWith('#') && !p.startsWith('>') && !p.startsWith('*'))?.trim();
    const excerpt = aeoMatch ? aeoMatch[1].trim() : (fallbackExcerpt || 'Un artículo de bienestar.');
    
    // Extract image URL if present: ![alt](/images/...)
    const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
    const image_url = imageMatch ? imageMatch[1] : '';
    
    const postData = {
      title,
      slug,
      excerpt,
      content,
      category: 'Bienestar',
      author: 'Proyecto Aurora',
      is_published: true,
      image_url
    };
    
    console.log(`Publishing: ${title}`);
    
    // Check if it exists first
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (existing) {
      console.log(`Updating existing post: ${slug}`);
      const { error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', existing.id);
      if (error) console.error('Error updating:', error);
    } else {
      const { error } = await supabase
        .from('blog_posts')
        .insert([postData]);
      if (error) console.error('Error inserting:', error);
    }
  }
  
  console.log('Done publishing articles to Supabase.');
}

publishArticles();
