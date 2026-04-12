// Generates security-specific images (violet accent instead of amber)
// Uses same API as generate-images.mjs but with violet color in prompts

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
const OUTPUT_ROOT = path.resolve(__dirname, '../public/generated/security');

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Violet accent instead of amber — cybersec brand
const STYLE = `Minimalist brutalist digital illustration.
Solid black background (#000000).
White geometric elements.
Deep violet (#7E22CE) accent — used sparingly for focal point.
Clean, precise, abstract, technical aesthetic.
Obsidian design language: dark, premium, minimal, security-focused.
No people, no faces, no realistic icons, no text, no words, no letters.
`;

const IMAGES = [
  {
    id: 'audyt-basic',
    desc: 'Abstract shield shape outlined in white with a single violet dot in the center. Minimal, represents basic protection. Entry-level security. Simple geometric clarity.',
  },
  {
    id: 'audyt-standard',
    desc: 'Layered geometric shield composition — 3 concentric hexagonal shapes in white, innermost pulsing with violet glow. Represents comprehensive multi-layer defense. Premium NIS2/KSC compliance feel.',
  },
  {
    id: 'audyt-premium',
    desc: 'Complex geometric fortress composition. White architectural structure like a vault or secure citadel, with violet accents highlighting key structural elements. Represents enterprise-grade security with ongoing protection.',
  },
  {
    id: 'selfcheck',
    desc: 'Abstract questionnaire visualization. White horizontal lines representing form fields, with violet checkmark accents at key points. Clean, minimalist form design. Represents online self-assessment tool.',
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
      await fs.mkdir(OUTPUT_ROOT, { recursive: true });
      const outPath = path.join(OUTPUT_ROOT, `${img.id}.${ext}`);
      await fs.writeFile(outPath, buffer);
      const sizeKB = Math.round(buffer.length / 1024);
      console.log(`  ✓ security/${img.id}.${ext} (${sizeKB}KB)`);
      return { ok: true };
    } catch (err) {
      const msg = String(err.message || err).substring(0, 140);
      console.warn(`  ✗ attempt ${attempt + 1}/${retries + 1}: ${msg}`);
      if (attempt === retries) return { ok: false, error: msg };
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

const start = Date.now();
console.log(`\nGenerating ${IMAGES.length} security images`);
console.log(`Output: ${OUTPUT_ROOT}\n`);

const results = [];
for (let i = 0; i < IMAGES.length; i++) {
  console.log(`[${i + 1}/${IMAGES.length}] ${IMAGES[i].id}`);
  results.push(await generateOne(IMAGES[i]));
  if (i < IMAGES.length - 1) await new Promise(r => setTimeout(r, 4500));
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
const ok = results.filter(r => r.ok).length;
console.log(`\n---\nDone in ${elapsed}s · ${ok}/${IMAGES.length} generated`);
