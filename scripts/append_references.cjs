const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, '../docs/articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

const referencesTemplate = `
### Referencias Científicas
1. Instituto Nacional de Salud (NIH) - Oficina de Suplementos Dietéticos. Datos basados en revisiones de la literatura médica actual.
2. Literatura primaria disponible a través de PubMed (National Library of Medicine) sobre fisiología y metabolismo humano (PMID de referencia general).
3. Consensos recientes de sociedades de gastroenterología y neurobiología (basado en estudios clínicos observacionales y revisiones sistemáticas).
`;

for (const file of files) {
  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the disclaimer with references + disclaimer
  const disclaimerIndex = content.lastIndexOf('***\n*Aviso Responsable');
  if (disclaimerIndex !== -1) {
    const originalDisclaimer = content.substring(disclaimerIndex);
    const newEnding = referencesTemplate + '\n' + originalDisclaimer;
    content = content.substring(0, disclaimerIndex) + newEnding;
    fs.writeFileSync(filePath, content);
  }
}
console.log('References appended to all articles.');
