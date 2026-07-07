const fs = require('fs');
const db = JSON.parse(fs.readFileSync('src/data/fuxion_database.json', 'utf8'));

const slugifyProduct = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const products = Object.entries(db.productos || {}).map(([key, product]) => {
  const name = product.nombre || key;
  const slug = slugifyProduct(name);
  return { key, name, slug };
});

console.log('=== TODOS LOS PRODUCTOS CON SLUG ===');
products.forEach(p => console.log(p.key + ' -> name: "' + p.name + '" -> slug: "' + p.slug + '"'));

// Now test the carousel slugs
const carouselSlugs = ['flora-liv', 'prunex-1', 'liquid-fiber', 'berry-balance'];
console.log('\n=== BUSQUEDA POR SLUG ===');
carouselSlugs.forEach(slug => {
  const found = products.find(p => p.slug === slug);
  console.log('Buscando "' + slug + '": ' + (found ? 'ENCONTRADO -> ' + found.name : 'NO ENCONTRADO'));
});
