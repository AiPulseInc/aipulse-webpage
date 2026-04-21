// Generate OG image for aipulse.pl/security — 1200x630 brutalist violet
// Usage: node scripts/generate-og-security.mjs [variant]  (v1|v2, default: both)

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public');

const VARIANTS = {
  v1: {
    line1: 'SPRAWDŹ SIĘ,',
    line2: 'ZANIM CIĘ SPRAWDZĄ.',
    fontSize: 94,
  },
  v2: {
    line1: 'CYBERBEZPIECZEŃSTWO',
    line2: 'DLA TWOJEJ FIRMY.',
    line3: 'BEZ ŚCIEMY.',
    fontSize: 82,
  },
};

const VIOLET = '#8B5CF6';
const TEXT_COLOR = '#FFFFFF';
const BG = '#0A0A0A';

function escape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function svgFor(variant) {
  const v = VARIANTS[variant];
  const hasThird = Boolean(v.line3);
  const baseY = hasThird ? 230 : 290;
  const lineHeight = v.fontSize * 1.25;

  const lines = [
    `<text x="80" y="${baseY}" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="${v.fontSize}" fill="${TEXT_COLOR}" letter-spacing="-2">${escape(v.line1)}</text>`,
    `<text x="80" y="${baseY + lineHeight}" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="${v.fontSize}" fill="${VIOLET}" letter-spacing="-2">${escape(v.line2)}</text>`,
  ];
  if (hasThird) {
    lines.push(
      `<text x="80" y="${baseY + lineHeight * 2}" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="${v.fontSize}" fill="${VIOLET}" letter-spacing="-2">${escape(v.line3)}</text>`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <!-- BG -->
  <rect width="1200" height="630" fill="${BG}"/>

  <!-- Violet accent bar top-right -->
  <rect x="1050" y="0" width="8" height="280" fill="${VIOLET}"/>
  <rect x="1080" y="0" width="4" height="160" fill="${VIOLET}" opacity="0.6"/>
  <rect x="1100" y="0" width="2" height="90" fill="${VIOLET}" opacity="0.4"/>

  <!-- Bottom-left violet line accent -->
  <rect x="80" y="540" width="120" height="4" fill="${VIOLET}"/>

  <!-- Brand logo: Ai Pulse with violet dot on "i" -->
  <text x="80" y="100" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="40" fill="${TEXT_COLOR}" letter-spacing="-1">A<tspan fill="${TEXT_COLOR}">i</tspan> Pulse</text>
  <circle cx="116" cy="68" r="5" fill="${VIOLET}"/>
  <text x="80" y="130" font-family="'Space Grotesk', monospace" font-size="14" fill="${VIOLET}" letter-spacing="3">// CYBER SECURITY</text>

  <!-- Headlines -->
  ${lines.join('\n  ')}

  <!-- Bottom footer -->
  <text x="80" y="580" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="22" fill="#999" font-weight="500">aipulse.pl/security</text>
  <text x="1120" y="580" font-family="'Space Grotesk', monospace" font-size="14" fill="${VIOLET}" letter-spacing="3" text-anchor="end">AUDYTY MŚP · NIS2 · KSC</text>
</svg>`;
}

async function render(variant) {
  const svg = svgFor(variant);
  const out = path.join(OUT_DIR, `og-security-${variant}.png`);
  await sharp(Buffer.from(svg))
    .png()
    .toFile(out);
  console.log(`[og] wrote ${out}`);
}

const arg = process.argv[2];
const variants = arg && VARIANTS[arg] ? [arg] : Object.keys(VARIANTS);
for (const v of variants) await render(v);
console.log('[og] done');
