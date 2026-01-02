// Script simple pour créer des placeholders pour les icônes
// Pour de vraies icônes PNG, utilisez: npm run generate-icons (nécessite sharp)

import { copyFileSync } from 'fs';

const sizes = [192, 512];

for (const size of sizes) {
  try {
    copyFileSync('./public/icon.svg', `./public/icon-${size}.png`);
    console.log(`✓ Créé placeholder icon-${size}.png (SVG copié)`);
  } catch (error) {
    console.error(`✗ Erreur lors de la création de icon-${size}.png:`, error.message);
  }
}

console.log('\n⚠️  Note: Ces fichiers sont des SVG avec extension .png');
console.log('Pour de vraies icônes PNG, installez sharp et utilisez: npm run generate-icons');
