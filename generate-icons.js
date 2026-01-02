// Script pour générer les icônes PNG à partir du SVG
// Ce script nécessite 'sharp' pour fonctionner
// Installation: npm install --save-dev sharp

import sharp from 'sharp';
import { readFileSync } from 'fs';

const sizes = [192, 512];
const svgBuffer = readFileSync('./public/icon.svg');

for (const size of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(`./public/icon-${size}.png`);
  console.log(`✓ Généré icon-${size}.png`);
}

console.log('✓ Toutes les icônes ont été générées avec succès!');
