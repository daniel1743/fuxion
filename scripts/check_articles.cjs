const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('blog_posts').select('id, title, slug, image_url, created_at').order('created_at', { ascending: false });
  if (error) { console.error(error); return; }
  console.log(JSON.stringify(data, null, 2));
}
check();
