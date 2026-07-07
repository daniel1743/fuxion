/**
 * Script para integrar la información detallada de base de datos.json
 * a fuxion_database.json y fuxion_ai_verified_catalog.json
 * 
 * Uso: node scripts/integrar-base-datos.js
 */

const fs = require('fs');
const path = require('path');

// Rutas de archivos
const BASE_DATOS_PATH = path.join(__dirname, '..', 'base de datos.json');
const FUXION_DB_PATH = path.join(__dirname, '..', 'src', 'data', 'fuxion_database.json');
const AI_CATALOG_PATH = path.join(__dirname, '..', 'src', 'data', 'fuxion_ai_verified_catalog.json');

// Mapeo de IDs de base de datos.json a nombres en fuxion_database.json
const PRODUCT_MAP = {
  'prunex_1': 'PRUNEX 1',
  'liquid_fiber': 'LIQUID FIBER',
  'flora_liv': 'FLORA LIV',
  'berry_balance': 'BERRY BALANCE',
  'alpha_balance': 'ALPHA BALANCE',
  'rexet': 'REXET',
  'bioprotein_active': 'BIOPROTEIN ACTIVE',
  'vita_xtra_t_plus': 'VITA XTRA T+',
  'vitaenergia': 'VITAENERGÍA',
  'nutraday': 'NUTRADAY',
  'vera_plus': 'VERA+',
  'gano_cappuccino': 'GANO+ CAPPUCCINO',
  'thermo_t3': 'THERMO T3',
  'nocarb_t': 'NOCARB-T',
  'protein_active_fit': 'PROTEIN ACTIVE FIT',
  'cafe_fit_cappuccino': 'CAFE & CAFE FIT CAPPUCCINO',
  'pack_5_14': 'PACK 5/14',
  'youth_elixir': 'YOUTH ELIXIR HGH',
  'beauty_in': 'BEAUTY-IN',
  'probal': 'PROBAL',
  'passion': 'PASSION',
  'golden_flx': 'GOLDEN FLX',
  'on': 'ON',
  'no_stress': 'NO STRESS',
  'pre_sport': 'PRE SPORT',
  'post_sport': 'POST SPORT'
};

// Mapeo inverso para nombres en fuxion_ai_verified_catalog.json
const AI_PRODUCT_MAP = {
  'PRUNEX 1': 'PRUNEX 1',
  'LIQUID FIBER': 'LIQUID FIBER',
  'FLORA LIV': 'FLORA LIV',
  'BERRY BALANCE': 'BERRY BALANCE',
  'ALPHA BALANCE': 'ALPHA BALANCE',
  'REXET': 'REXET',
  'BIOPROTEIN ACTIVE': 'BIOPROTEIN ACTIVE',
  'VITA XTRA T+': 'VITA XTRA T+',
  'VITAENERGÍA': 'VITAENERGÍA',
  'NUTRADAY': null, // No está en ai_catalog
  'VERA+': 'VERA+',
  'GANO+ CAPPUCCINO': 'GANO+ CAPPUCCINO',
  'THERMO T3': 'THERMO T3',
  'NOCARB-T': 'NOCARB-T',
  'PROTEIN ACTIVE FIT': 'PROTEIN ACTIVE FIT',
  'CAFE & CAFE FIT CAPPUCCINO': 'CAFÉ & CAFÉ FIT CAPPUCCINO',
  'PACK 5/14': 'PACK 5/14',
  'YOUTH ELIXIR HGH': 'YOUTH ELIXIR',
  'BEAUTY-IN': 'BEAUTY-IN',
  'PROBAL': 'PROBAL',
  'PASSION': 'PASSION',
  'GOLDEN FLX': 'GOLDEN FLX',
  'ON': 'ON',
  'NO STRESS': 'NO STRESS',
  'PRE SPORT': 'PRE SPORT PRO EDITION',
  'POST SPORT': 'POST SPORT PRO EDITION'
};

function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error al leer ${filePath}:`, err.message);
    return null;
  }
}

function saveJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Guardado: ${filePath}`);
    return true;
  } catch (err) {
    console.error(`Error al guardar ${filePath}:`, err.message);
    return false;
  }
}

function integrarFuxionDatabase(baseData, fuxionDb) {
  console.log('\n📦 Integrando en fuxion_database.json...');
  let contador = 0;
  let errores = [];

  for (const categoria of baseData.catalogo_fuxion.categorias) {
    for (const producto of categoria.productos) {
      const dbName = PRODUCT_MAP[producto.id];
      if (!dbName) {
        errores.push(`ID "${producto.id}" no mapeado en fuxion_database`);
        continue;
      }

      const dbProduct = fuxionDb.productos[dbName];
      if (!dbProduct) {
        errores.push(`Producto "${dbName}" no encontrado en fuxion_database`);
        continue;
      }

      // Agregar campos nuevos que no existían
      if (producto.descripcion_tecnica) {
        dbProduct.descripcion_tecnica = producto.descripcion_tecnica;
      }
      if (producto.objetivo_funcional) {
        dbProduct.objetivo_funcional = producto.objetivo_funcional;
      }
      if (producto.ingredientes_clave) {
        dbProduct.ingredientes_clave = producto.ingredientes_clave;
      }
      if (producto.pauta_consumo) {
        dbProduct.pauta_consumo = producto.pauta_consumo;
      }
      if (producto.inversion_referencial) {
        dbProduct.inversion_referencial = producto.inversion_referencial;
      }

      contador++;
      console.log(`  ✓ ${dbName}: campos agregados (descripcion_tecnica, objetivo_funcional, ingredientes_clave, pauta_consumo, inversion_referencial)`);
    }
  }

  console.log(`\n📊 Total productos actualizados en fuxion_database.json: ${contador}`);
  if (errores.length > 0) {
    console.log(`⚠️  Errores (${errores.length}):`);
    errores.forEach(e => console.log(`   - ${e}`));
  }
}

function integrarAiCatalog(baseData, aiCatalog) {
  console.log('\n📦 Integrando en fuxion_ai_verified_catalog.json...');
  let contador = 0;
  let errores = [];

  for (const categoria of baseData.catalogo_fuxion.categorias) {
    for (const producto of categoria.productos) {
      const dbName = PRODUCT_MAP[producto.id];
      if (!dbName) continue;

      const aiName = AI_PRODUCT_MAP[dbName];
      if (!aiName) {
        errores.push(`"${dbName}" no mapeado en ai_catalog`);
        continue;
      }

      const aiProduct = aiCatalog.productos_verificados[aiName];
      if (!aiProduct) {
        errores.push(`"${aiName}" no encontrado en ai_catalog.productos_verificados`);
        continue;
      }

      // Agregar descripción técnica como información adicional
      if (producto.descripcion_tecnica) {
        aiProduct.descripcion_tecnica = producto.descripcion_tecnica;
      }
      if (producto.objetivo_funcional) {
        aiProduct.objetivo_funcional = producto.objetivo_funcional;
      }
      if (producto.pauta_consumo) {
        aiProduct.pauta_consumo_detallada = producto.pauta_consumo;
      }
      if (producto.ingredientes_clave) {
        aiProduct.ingredientes_clave_completos = producto.ingredientes_clave;
      }

      contador++;
      console.log(`  ✓ ${aiName}: campos enriquecidos`);
    }
  }

  console.log(`\n📊 Total productos actualizados en ai_catalog: ${contador}`);
  if (errores.length > 0) {
    console.log(`⚠️  Errores (${errores.length}):`);
    errores.forEach(e => console.log(`   - ${e}`));
  }
}

function generarReporte(baseData) {
  console.log('\n📋 REPORTE DE INFORMACIÓN DISPONIBLE EN base de datos.json');
  console.log('='.repeat(60));
  
  let totalProductos = 0;
  for (const categoria of baseData.catalogo_fuxion.categorias) {
    console.log(`\n📁 ${categoria.nombre}`);
    console.log(`   ${categoria.descripcion}`);
    console.log(`   Productos: ${categoria.productos.length}`);
    
    for (const producto of categoria.productos) {
      totalProductos++;
      console.log(`   - ${producto.nombre} (${producto.id})`);
    }
  }
  
  console.log(`\n📊 TOTAL: ${totalProductos} productos en ${baseData.catalogo_fuxion.categorias.length} categorías`);
}

// === MAIN ===
function main() {
  console.log('🚀 INICIANDO INTEGRACIÓN DE BASE DE DATOS\n');
  console.log('='.repeat(60));

  // Cargar archivos
  const baseData = loadJSON(BASE_DATOS_PATH);
  if (!baseData) {
    console.error('❌ No se pudo cargar base de datos.json');
    process.exit(1);
  }

  const fuxionDb = loadJSON(FUXION_DB_PATH);
  if (!fuxionDb) {
    console.error('❌ No se pudo cargar fuxion_database.json');
    process.exit(1);
  }

  const aiCatalog = loadJSON(AI_CATALOG_PATH);
  if (!aiCatalog) {
    console.error('❌ No se pudo cargar fuxion_ai_verified_catalog.json');
    process.exit(1);
  }

  // Generar reporte
  generarReporte(baseData);

  // Integrar en fuxion_database.json
  integrarFuxionDatabase(baseData, fuxionDb);
  saveJSON(FUXION_DB_PATH, fuxionDb);

  // Integrar en fuxion_ai_verified_catalog.json
  integrarAiCatalog(baseData, aiCatalog);
  saveJSON(AI_CATALOG_PATH, aiCatalog);

  console.log('\n✅ INTEGRACIÓN COMPLETADA');
  console.log('='.repeat(60));
  console.log('Archivos actualizados:');
  console.log(`  - src/data/fuxion_database.json`);
  console.log(`  - src/data/fuxion_ai_verified_catalog.json`);
  console.log('\n💡 Respaldo: Los archivos originales se mantienen intactos.');
  console.log('   Si algo sale mal, puedes restaurarlos desde git.');
}

main();
