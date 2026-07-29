// scripts/auditoria-productos/discover_paths.cjs
// Discover the main Productos page component and its import tree for audit.

const fs = require('fs');
const path = require('path');

// Resolve project root (two levels up from this script)
const projectRoot = path.resolve(__dirname, '../../');
const productosPage = path.join(projectRoot, 'src', 'pages', 'ProductosFuxionPage.jsx');

if (!fs.existsSync(productosPage)) {
  console.error('ProductosFuxionPage.jsx not found');
  process.exit(1);
}

function parseImports(file, visited = new Set()) {
  if (visited.has(file)) return {};
  visited.add(file);
  const content = fs.readFileSync(file, 'utf8');
  const importLines = content.split('\n').filter(l => l.startsWith('import'));
  const tree = {};
  for (const line of importLines) {
    const match = line.match(/import\s+.*?\s+from\s+['"](.+?)['"]/);
    if (match) {
      let rel = match[1];
      if (!rel.startsWith('.')) continue; // skip external modules
      const resolved = path.resolve(path.dirname(file), rel) + (rel.endsWith('.jsx') ? '' : '.jsx');
      if (fs.existsSync(resolved)) {
        tree[rel] = parseImports(resolved, visited);
      }
    }
  }
  return tree;
}

const tree = parseImports(productosPage);
console.log('Import tree for ProductosFuxionPage.jsx:');
console.log(JSON.stringify(tree, null, 2));
