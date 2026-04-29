#!/usr/bin/env node
// Gera todos os ícones PNG necessários para PWA a partir do favicon.svg
// Requer: pnpm add -D sharp

import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const svgPath = join(ROOT, 'client/public/favicon.svg');
const iconsDir = join(ROOT, 'client/public/icons');

if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('❌ sharp não instalado. Execute: pnpm add -D sharp');
  process.exit(1);
}

const svgBuffer = readFileSync(svgPath);

console.log('🎨 A gerar ícones PWA...');

for (const size of sizes) {
  const outputPath = join(iconsDir, `icon-${size}x${size}.png`);
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(outputPath);
  console.log(`  ✓ icon-${size}x${size}.png`);
}

// OG Image (1200x630)
const ogPath = join(ROOT, 'client/public/og-image.png');
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E3A5F"/>
    </linearGradient>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="80" y="180" width="100" height="100" rx="24" fill="url(#g)"/>
  <text x="155" y="255" font-family="Arial,sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">B</text>
  <text x="210" y="255" font-family="Arial,sans-serif" font-size="72" font-weight="bold" fill="white">BookMe</text>
  <text x="80" y="340" font-family="Arial,sans-serif" font-size="32" fill="#94a3b8">Software de Marcações Online para o Seu Negócio</text>
  <text x="80" y="400" font-family="Arial,sans-serif" font-size="24" fill="#64748b">Salões · Clínicas · Restaurantes · E muito mais</text>
  <rect x="80" y="450" width="200" height="50" rx="12" fill="url(#g)"/>
  <text x="180" y="483" font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">Grátis para Começar</text>
</svg>`;

await sharp(Buffer.from(ogSvg))
  .resize(1200, 630)
  .png()
  .toFile(ogPath);
console.log('  ✓ og-image.png (1200×630)');

// Favicon ICO (32x32)
const faviconPath = join(ROOT, 'client/public/favicon.ico');
await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toFile(faviconPath.replace('.ico', '-32.png'));
console.log('  ✓ favicon-32.png (renomear para .ico se necessário)');

console.log('\n✅ Todos os assets PWA gerados em client/public/icons/');
