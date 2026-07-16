const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('article_comments').select('*').limit(1);
  if (error) { console.error('Error fetching article_comments:', error.message); }
  else { console.log('article_comments table exists!'); }
}
check();
