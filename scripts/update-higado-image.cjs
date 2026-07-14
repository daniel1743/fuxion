process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateImage() {
  console.log("Conectando a Supabase para actualizar imagen del articulo higado graso...");
  
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ image_url: '/images/articles/que-es-el-higado-graso.png' })
    .eq('slug', 'higado-graso')
    .select();

  if (error) {
    console.error("Error al actualizar:", error);
  } else {
    console.log("¡Imagen actualizada exitosamente!", data);
  }
}

updateImage();
