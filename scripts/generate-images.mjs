// Generates all 22 images for AI Pulse via Gemini 3.1 Flash Image Preview
// Uses the generateContent API with responseModalities: [IMAGE]
// Env: GEMINI_API (found in workspace root .env)

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { GoogleGenAI, Modality } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (!process.env.GEMINI_API && !process.env.GEMINI_API_KEY) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const API_KEY = process.env.GEMINI_API || process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Missing GEMINI_API or GEMINI_API_KEY');
  process.exit(1);
}

const MODEL = 'gemini-3.1-flash-image-preview';
const OUTPUT_ROOT = path.resolve(__dirname, '../public/generated');

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Unified style prefix applied to every prompt
const STYLE = `Minimalist brutalist digital illustration.
Solid black background (#000000).
White geometric elements.
Amber (#F5A623) accent — used sparingly for focal point.
Clean, precise, abstract, technical aesthetic.
Obsidian design language: dark, premium, minimal.
No people, no faces, no realistic icons, no text, no words, no letters.
`;

const IMAGES = [
  // SZKOLENIA (7) — 16:9 natural Gemini aspect
  {
    id: 'podstawy',
    dir: 'szkolenia',
    desc: 'Abstract dialogue flow. White rounded square on the left, amber circle on the right, flowing curved white line connecting them through negative space. Represents simple conversation between human and AI. Symmetric composition, minimal detail.',
  },
  {
    id: 'prawo-jazdy',
    dir: 'szkolenia',
    desc: 'Diagonal upward arrow composed of small amber dots transitioning into white angled lines. Sense of acceleration, momentum, B2B sales trajectory. Dynamic minimalism, composition weighted bottom-left to top-right.',
  },
  {
    id: 'ai-builder',
    dir: 'szkolenia',
    desc: 'Three white geometric cubes stacked architecturally. Top cube glows with amber light. Represents construction, layering, building an AI system. Isometric perspective, precise geometry.',
  },
  {
    id: 'cc-start',
    dir: 'szkolenia',
    desc: 'Simplified white terminal cursor block centered on black. Single thin amber vertical line next to it. Minimalist code editor aesthetic. Represents starting point, the first line of code.',
  },
  {
    id: 'cc-skills',
    dir: 'szkolenia',
    desc: 'White geometric puzzle piece being fitted into an amber-outlined receptacle. Modularity, composition. Clean precise shapes, strong geometry, satisfying fit.',
  },
  {
    id: 'cc-pro',
    dir: 'szkolenia',
    desc: 'Complex interconnected white network nodes forming an abstract graph. One critical path highlighted in amber, flowing through the network. Represents advanced multi-agent orchestration.',
  },
  {
    id: 'antigravity',
    dir: 'szkolenia',
    desc: 'Two white circular shapes orbiting around an amber gravitational center point. Balanced dual-stack metaphor. Sense of orbital mechanics, equilibrium, elegant motion.',
  },
  // TOOLS (10) — 1:1 square icons
  {
    id: 'voice-agents',
    dir: 'tools',
    desc: 'Stylized white microphone silhouette with minimal sound wave lines radiating outward. Small amber dot at the base of the microphone. Flat icon style, precise geometry, square composition.',
  },
  {
    id: 'inbox-agent',
    dir: 'tools',
    desc: 'Three white envelope shapes stacked at slight offsets. One envelope has an amber corner accent. Flat icon style, square composition, represents email inbox organization.',
  },
  {
    id: 'voice-memo',
    dir: 'tools',
    desc: 'White microphone silhouette with a curved arrow leading to a simple document shape. Amber accent at the transformation point (arrow head). Flat icon style, square composition.',
  },
  {
    id: 'vcard',
    dir: 'tools',
    desc: 'White business card rectangle with minimal contact info suggestion (3 horizontal lines). Amber corner dot in the top-right. Flat icon style, square composition.',
  },
  {
    id: 'grafiki-ai',
    dir: 'tools',
    desc: 'White rectangular image frame with a simple amber sparkle (4-pointed star) accent inside. Represents AI image generation. Flat icon style, square composition.',
  },
  {
    id: 'video-prompter',
    dir: 'tools',
    desc: 'Camera aperture iris made of geometric white blades, with a single amber dot in the center. Flat icon style, precise geometric symmetry, square composition.',
  },
  {
    id: 'transkrypcja',
    dir: 'tools',
    desc: 'White sound waveform on the left transforming into horizontal text lines on the right. Amber dot at the transformation midpoint. Flat icon style, square composition.',
  },
  {
    id: 'youtube-transcript',
    dir: 'tools',
    desc: 'White play button triangle on the left, three horizontal text lines to the right. Amber accent on the triangle tip. Flat icon style, square composition.',
  },
  {
    id: 'qr-generator',
    dir: 'tools',
    desc: 'Simplified QR code pattern (abstracted — just 9x9 grid of white and black squares with 3 corner position markers). One corner marker is amber instead of white. Flat icon style, square composition.',
  },
  {
    id: 'custom-tool',
    dir: 'tools',
    desc: 'White question mark glyph centered inside an amber circle outline. Flat icon style, represents custom/bespoke tooling, square composition.',
  },
  // STRONY (5) — 16:9 website mockups
  {
    id: 'ecommerce',
    dir: 'strony',
    desc: 'Mockup of a modern Polish e-commerce website. Dark theme (black/near-black background). Shown as a laptop screen view. Product grid layout with 3x2 product cards, each product card has a placeholder image area and price below. One amber "Dodaj do koszyka" button visible. Top navigation bar with search icon. Minimalist premium online shop aesthetic. Realistic UI mockup style, no actual brand names.',
  },
  {
    id: 'ubezpieczenia',
    dir: 'strony',
    desc: 'Mockup of a professional Polish insurance agent landing page. Dark theme. Shown as a laptop screen view. Hero section with a trust-building headline placeholder and an amber "Oblicz składkę" CTA button. Below hero: 3 policy type cards (minimalist icons, short labels). Top navigation with agent logo placeholder. Realistic UI mockup style, premium B2C feel.',
  },
  {
    id: 'firma-uslugowa',
    dir: 'strony',
    desc: 'Mockup of a generic Polish service company landing page. Dark brutalist aesthetic. Shown as a laptop screen view. Hero section with headline placeholder and amber CTA button "Zamów wycenę". Below: 3-column services grid with icons and descriptions. Testimonial section at the bottom. Realistic UI mockup style, professional B2B feel.',
  },
  {
    id: 'ogrodnicza',
    dir: 'strony',
    desc: 'Mockup of a sophisticated Polish garden services landing page. Dark premium aesthetic with amber accents (represented as stylized geometric leaf shapes — abstract, not literal). Shown as a laptop screen view. Hero with project photography placeholder. Below: before/after gallery grid (6 tiles), services list. Amber CTA "Umów wizytę". Premium outdoor business feel.',
  },
  {
    id: 'golf',
    dir: 'strony',
    desc: 'Mockup of a premium Polish golf course landing page. Dark elegant design with amber accents. Shown as a laptop screen view. Hero with aerial course photography frame. Tee time booking widget on the right side with amber "Zarezerwuj" button. Member area preview section below. Luxury sports/leisure aesthetic, precise layout.',
  },
];

async function generateOne(img, retries = 2) {
  const prompt = STYLE + img.desc;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: { responseModalities: [Modality.IMAGE] },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find(p => p.inlineData?.data);
      if (!imagePart) throw new Error('no inline image data');

      const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
      const mimeType = imagePart.inlineData.mimeType || 'image/jpeg';
      const ext = mimeType.includes('png') ? 'png' : 'jpg';
      const outDir = path.join(OUTPUT_ROOT, img.dir);
      await fs.mkdir(outDir, { recursive: true });
      const outPath = path.join(outDir, `${img.id}.${ext}`);
      await fs.writeFile(outPath, buffer);
      const sizeKB = Math.round(buffer.length / 1024);
      console.log(`  ✓ ${img.dir}/${img.id}.${ext} (${sizeKB}KB)`);
      return { ok: true, path: outPath, size: buffer.length };
    } catch (err) {
      const msg = String(err.message || err).substring(0, 140);
      console.warn(`  ✗ attempt ${attempt + 1}/${retries + 1}: ${msg}`);
      if (attempt === retries) return { ok: false, error: msg };
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

const start = Date.now();
const results = [];

console.log(`\nGenerating ${IMAGES.length} images with ${MODEL}`);
console.log(`Output: ${OUTPUT_ROOT}\n`);

for (let i = 0; i < IMAGES.length; i++) {
  const img = IMAGES[i];
  console.log(`[${i + 1}/${IMAGES.length}] ${img.dir}/${img.id}`);
  const result = await generateOne(img);
  results.push({ ...img, ...result });
  // Brief delay to stay under rate limits (15 RPM)
  if (i < IMAGES.length - 1) await new Promise(r => setTimeout(r, 4500));
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
const ok = results.filter(r => r.ok).length;
const fail = results.filter(r => !r.ok);
const totalSize = results.reduce((s, r) => s + (r.size || 0), 0);

console.log(`\n---\nDone in ${elapsed}s`);
console.log(`Success: ${ok}/${IMAGES.length}`);
console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
if (fail.length) {
  console.log(`Failed:`);
  fail.forEach(f => console.log(`  - ${f.dir}/${f.id}: ${f.error}`));
  process.exit(1);
}
