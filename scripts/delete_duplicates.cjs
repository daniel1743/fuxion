const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const slugsToDelete = [
  'sibo-sobrecrecimiento-bacteriano-migracion-microbiana-y-fermentacion-prematura',
  'sindrome-del-intestino-irritable-sii-eje-intestino-cerebro-y-alteraciones-de-la-motilidad',
  'reflujo-gastroesofagico-erge-e-hipoclorhidria-mecanismos-del-esfinter-y-acidez',
  'higado-graso-no-alcoholico-hgna-acumulacion-lipidica-y-estres-oxidativo-hepatico',
  'fibra-soluble-vs-insoluble-impacto-en-la-motilidad-y-modulacion-del-microbioma',
  'eje-intestino-cerebro-vias-de-comunicacion-bidireccional-y-neurotransmisores-entericos',
  'digestion-enzimatica-exocrina-funcion-pancreatica-y-descomposicion-de-macronutrientes',
  'celiaquia-vs-sensibilidad-al-gluten-no-celiaca-mecanismos-inmunologicos-diferenciados'
];

async function cleanup() {
  for (const slug of slugsToDelete) {
    const { data, error } = await supabase.from('blog_posts').delete().eq('slug', slug);
    if (error) {
      console.error('Error deleting', slug, error);
    } else {
      console.log('Deleted successfully:', slug);
    }
  }
}
cleanup();
