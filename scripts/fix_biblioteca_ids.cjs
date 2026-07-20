const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'branding', 'base de datos bienestar ia', 'biblioteca_bienestar.json');

console.log('Leyendo archivo:', filePath);
const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

console.log('Módulos encontrados:', data.modules.length);

// Reasignar IDs únicos globales (1-130)
let nextId = 1;
let changes = 0;

data.modules.forEach((m, mi) => {
  if (m.interventions) {
    m.interventions.forEach((inv, ii) => {
      const oldId = inv.id;
      inv.id = nextId++;
      changes++;
    });
  }
});

// Guardar con formato
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Guardado. ${changes} IDs reasignados. Rango: 1-${nextId - 1}`);

// Verificar
const d2 = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const allIds = [];
d2.modules.forEach(m => {
  if (m.interventions) m.interventions.forEach(inv => allIds.push(inv.id));
});
const uniqueIds = new Set(allIds);
console.log(`Verificación: ${allIds.length} intervenciones, ${uniqueIds.size} IDs únicos`);
console.log(`Duplicados: ${allIds.length - uniqueIds.size}`);

d2.modules.forEach(m => {
  const ids = m.interventions ? m.interventions.map(i => i.id).slice(0, 3).join(',') + '...' + m.interventions.map(i => i.id).slice(-1)[0] : 'ninguno';
  console.log(`  Mod${m.id}: ${m.interventions?.length || 0} ints [${ids}]`);
});