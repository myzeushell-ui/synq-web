// Generates PWA icons for Synq using sharp (no external deps)
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
mkdirSync(publicDir, { recursive: true });

// SVG icon: rounded square, purple gradient, stylised "S"
const makeSvg = (size, maskable = false) => {
  const r = maskable ? 0 : Math.round(size * 0.22); // sharp corners for maskable (safe-zone)
  const pad = maskable ? Math.round(size * 0.18) : Math.round(size * 0.1);
  const inner = size - pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6B5EE6"/>
      <stop offset="100%" stop-color="#9B6EF6"/>
    </linearGradient>
    <linearGradient id="s" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="100%" stop-color="#d4ccff" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
  <!-- Subtle glow -->
  <circle cx="${size * 0.72}" cy="${size * 0.28}" r="${size * 0.3}" fill="white" fill-opacity="0.07"/>
  <!-- S letterform -->
  <g transform="translate(${pad}, ${pad})">
    <text
      x="${inner / 2}"
      y="${inner * 0.75}"
      font-family="'Segoe UI', system-ui, -apple-system, sans-serif"
      font-size="${Math.round(inner * 0.72)}"
      font-weight="800"
      fill="url(#s)"
      text-anchor="middle"
      letter-spacing="-2"
    >S</text>
  </g>
</svg>`;
};

async function generate(filename, size, maskable = false) {
  const svg = makeSvg(size, maskable);
  await sharp(Buffer.from(svg)).resize(size, size).png({ quality: 100 }).toFile(join(publicDir, filename));
  console.log(`✓ ${filename}`);
}

await generate('icon-192x192.png', 192);
await generate('icon-512x512.png', 512);
await generate('icon-maskable-512x512.png', 512, true);
console.log('Icons generated.');
