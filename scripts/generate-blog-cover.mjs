// Generate a single blog cover image via Gemini 3.1 Flash Image Preview (Nano Banana 2)
// Usage: node scripts/generate-blog-cover.mjs <post-slug> "<one-sentence subject>"
// Example: node scripts/generate-blog-cover.mjs wyciek-sklepow-polska-130k-2026 "database records leaking into the void"

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
  console.error('Missing GEMINI_API or GEMINI_API_KEY in .env');
  process.exit(1);
}

const MODEL = 'gemini-3.1-flash-image-preview';
const OUTPUT_DIR = path.resolve(__dirname, '../public/generated/security/blog');

// Brand guardrails for Security-line blog covers (violet accent, not amber).
const STYLE = `Minimalist brutalist digital illustration, 16:9 landscape.
Solid black background (#000000).
White geometric elements.
Violet (#7E22CE) accent — used sparingly, for focal emphasis only.
Clean, precise, abstract, technical aesthetic.
Obsidian / Bauhaus design language: dark, premium, minimal.
No people, no faces, no realistic icons, no text, no words, no letters, no numbers, no UI mockups, no logos.
Composition should feel editorial — suitable as a cover image for a cybersecurity analysis article.
Subject:`;

async function generate(slug, subject) {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `${STYLE} ${subject}`;
  console.log(`\nModel:   ${MODEL}`);
  console.log(`Slug:    ${slug}`);
  console.log(`Subject: ${subject}\n`);

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: { responseModalities: [Modality.IMAGE] },
      });
      const parts = response.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p) => p.inlineData?.data);
      if (!imagePart) throw new Error('no inline image data in response');

      const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
      const mimeType = imagePart.inlineData.mimeType || 'image/jpeg';
      const ext = mimeType.includes('png') ? 'png' : 'jpg';
      await fs.mkdir(OUTPUT_DIR, { recursive: true });
      const outPath = path.join(OUTPUT_DIR, `${slug}.${ext}`);
      await fs.writeFile(outPath, buffer);
      const relPath = `/generated/security/blog/${slug}.${ext}`;
      console.log(`  ✓ written ${outPath} (${Math.round(buffer.length / 1024)} KB)`);
      console.log(`  ✓ frontmatter cover: "${relPath}"`);
      return { ok: true, path: outPath, coverPath: relPath };
    } catch (err) {
      const msg = String(err.message || err).substring(0, 160);
      console.warn(`  ✗ attempt ${attempt + 1}/3: ${msg}`);
      if (attempt < 2) await new Promise((r) => setTimeout(r, 3000));
      else return { ok: false, error: msg };
    }
  }
}

const [, , slug, ...subjectWords] = process.argv;
if (!slug || subjectWords.length === 0) {
  console.error('Usage: node scripts/generate-blog-cover.mjs <slug> "<subject>"');
  process.exit(1);
}
const result = await generate(slug, subjectWords.join(' '));
if (!result.ok) process.exit(1);
