const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const url = 'https://iyloouessyxfvwvzdboc.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bG9vdWVzc3l4ZnZ3dnpkYm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MzcyNzUsImV4cCI6MjA5NzIxMzI3NX0.6bjQCIC3vQKFny4Sl5i-k7P1r7_4UUKhhcQ65Y5jsmc';
const supabase = createClient(url, key);

// El Catálogo Oficial (Hardcoded here for the node script ease)
const CATEGORY_CATALOG = [
  'Salud Digestiva', 'Microbiota', 'Hígado Graso', 'Salud del Hígado',
  'Sistema Inmunitario', 'Inmunidad', 'Diabetes', 'Inflamación', 'Metabolismo',
  'Nutrición', 'Pérdida de Peso', 'Sobrepeso', 'Salud Cardiovascular',
  'Salud Hormonal', 'Bienestar Mental', 'Bienestar', 'Motivación'
];

// Reglas heurísticas del robot SEO (keyword -> category mapping)
const RULES = {
  'hígado graso': ['Hígado Graso', 'Salud del Hígado', 'Metabolismo'],
  'cirrosis': ['Salud del Hígado', 'Hígado Graso', 'Inflamación'],
  'microbiota': ['Microbiota', 'Salud Digestiva', 'Sistema Inmunitario'],
  'disbiosis': ['Microbiota', 'Salud Digestiva', 'Inflamación'],
  'sibo': ['Salud Digestiva', 'Microbiota'],
  'intestino': ['Salud Digestiva', 'Microbiota'],
  'helicobacter': ['Salud Digestiva', 'Sistema Inmunitario'],
  'reflujo': ['Salud Digestiva'],
  'moco gástrico': ['Salud Digestiva', 'Inmunidad'],
  'intolerancia': ['Salud Digestiva', 'Inmunidad', 'Nutrición'],
  'alergia': ['Inmunidad', 'Salud Digestiva', 'Nutrición'],
  'peso': ['Pérdida de Peso', 'Sobrepeso', 'Metabolismo'],
  'sobrepeso': ['Sobrepeso', 'Pérdida de Peso', 'Metabolismo', 'Salud Cardiovascular'],
  'diabetes': ['Diabetes', 'Metabolismo', 'Nutrición'],
  'insulina': ['Diabetes', 'Metabolismo', 'Hígado Graso'],
  'inmune': ['Sistema Inmunitario', 'Inmunidad'],
  'fibra': ['Nutrición', 'Salud Digestiva', 'Microbiota'],
  'butirato': ['Microbiota', 'Salud Digestiva', 'Nutrición'],
  'histaminosis': ['Inmunidad', 'Salud Digestiva', 'Inflamación'],
  'celiaquía': ['Inmunidad', 'Salud Digestiva', 'Nutrición'],
  'gluten': ['Salud Digestiva', 'Inmunidad', 'Nutrición'],
  'digestión': ['Salud Digestiva', 'Nutrición']
};

async function runRobot() {
  console.log('🤖 Iniciando Robot SEO de Categorización Avanzada (v2)...');
  
  // 1. Cargar el dump (o fetchear directo de DB)
  const articles = JSON.parse(fs.readFileSync('articles_dump.json', 'utf8'));
  
  // 2. Crear backup para rollback
  const backup = articles.map(a => ({ id: a.id, title: a.title, category: a.category }));
  fs.writeFileSync('backup_category.json', JSON.stringify(backup, null, 2));
  console.log(`✅ Respaldo creado: backup_category.json con ${backup.length} registros.`);

  let report = {
    procesados: 0,
    errores: 0,
    detalles: []
  };

  // 3. Procesar artículos
  for (const article of articles) {
    const textToAnalyze = (article.title + ' ' + (article.excerpt || '')).toLowerCase();
    
    // Almacenamos las coincidencias con sus "relevancias" (1 por defecto al hacer hit)
    const matches = new Map();
    
    // La categoría original cuenta como muy relevante
    if (article.category) {
      const catParts = article.category.split(',').map(c => c.trim());
      catParts.forEach(c => {
        const found = CATEGORY_CATALOG.find(cat => cat.toLowerCase() === c.toLowerCase());
        if (found) {
          matches.set(found, (matches.get(found) || 0) + 10); // Relevancia Alta
        }
      });
    }

    // Evaluar reglas
    for (const [keyword, categories] of Object.entries(RULES)) {
      if (textToAnalyze.includes(keyword)) {
        categories.forEach((cat, idx) => {
          // El primero de la lista de sugerencias recibe más puntos
          const score = idx === 0 ? 3 : 1; 
          matches.set(cat, (matches.get(cat) || 0) + score);
        });
      }
    }

    // Convertir a array y ordenar por relevancia (descendente)
    let sortedCategories = Array.from(matches.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    // Calcular Confidence Score (heurístico simple)
    const confidenceScore = sortedCategories.length >= 2 ? 95 : 75;

    // Asegurar 1 Principal + máx 5 Secundarias (Total 6 máx)
    sortedCategories = sortedCategories.slice(0, 6);

    // Si no encontró nada nuevo, al menos dejar la que tenía
    if (sortedCategories.length === 0) {
      sortedCategories = article.category ? [article.category] : ['Salud Digestiva'];
    }

    const newCategoryString = sortedCategories.join(',');

    try {
      // 4. Actualizar BD
      await supabase
        .from('blog_posts')
        .update({ category: newCategoryString })
        .eq('id', article.id);
      
      report.procesados++;
      report.detalles.push({
        title: article.title,
        old: article.category,
        new: newCategoryString,
        confidence: confidenceScore
      });
    } catch (err) {
      report.errores++;
      console.error(`❌ Error al actualizar ${article.title}:`, err);
    }
  }

  // 5. Reporte Final
  fs.writeFileSync('robot_seo_report.json', JSON.stringify(report, null, 2));
  console.log(`\n✅ Proceso Finalizado.`);
  console.log(`- Procesados: ${report.procesados}`);
  console.log(`- Errores: ${report.errores}`);
  console.log(`- Reporte detallado en: robot_seo_report.json`);
}

runRobot();
