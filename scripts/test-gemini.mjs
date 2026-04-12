// Test script — verify Gemini image generation works before batch
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { GoogleGenAI, Modality } from '@google/genai';

// Try local .env first, fallback to workspace root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (!process.env.GEMINI_API_KEY) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const API_KEY = process.env.GEMINI_API || process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Missing GEMINI_API or GEMINI_API_KEY in environment');
  console.error('Expected in .env file (workspace root or aipulse-webpage/)');
  process.exit(1);
}

console.log('Key found:', API_KEY.substring(0, 8) + '...' + API_KEY.slice(-4));

// Try multiple model IDs to find the right one
const MODELS_TO_TRY = [
  'gemini-3.1-flash-image-preview',
  'gemini-3-flash-image-preview',
  'gemini-2.5-flash-image-preview',
  'gemini-2.5-flash-image',
];

const ai = new GoogleGenAI({ apiKey: API_KEY });

// List available models to see what we have access to
try {
  console.log('\n--- Available models ---');
  const pager = await ai.models.list();
  const imageModels = [];
  for await (const model of pager) {
    if (model.name?.toLowerCase().includes('image') || model.supportedActions?.includes('generateImages')) {
      imageModels.push(model.name);
    }
  }
  console.log('Image-capable models:');
  imageModels.forEach(n => console.log('  ', n));
} catch (err) {
  console.warn('Could not list models:', err.message);
}

// Test simple prompt
const TEST_PROMPT = 'Minimalist brutalist digital illustration. Solid black background. White geometric circle with amber (#F5A623) smaller circle inside. Abstract, technical, clean. No text.';

console.log('\n--- Testing image generation (generateContent API) ---');
for (const model of MODELS_TO_TRY) {
  console.log(`\nTrying model: ${model}`);
  try {
    const response = await ai.models.generateContent({
      model,
      contents: TEST_PROMPT,
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Find image part in response
    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData?.data);

    if (!imagePart) {
      console.log('  ✗ No image in response. Parts received:', parts.map(p => Object.keys(p)));
      continue;
    }

    const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
    const ext = imagePart.inlineData.mimeType?.includes('png') ? 'png' : 'jpg';
    const outPath = path.join('public', 'generated', `test.${ext}`);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, buffer);
    console.log(`  ✓ SUCCESS: ${model} worked. Saved ${buffer.length / 1024 | 0}KB to ${outPath}`);
    console.log(`  mimeType: ${imagePart.inlineData.mimeType}`);
    console.log(`\n>>> WORKING MODEL ID: "${model}"`);
    process.exit(0);
  } catch (err) {
    console.log(`  ✗ ${err.message?.substring(0, 160)}`);
  }
}

console.error('\n✗ No working model found.');
process.exit(1);
