import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        landing: resolve(__dirname, 'index.html'),
        business: resolve(__dirname, 'business/index.html'),
        security: resolve(__dirname, 'security/index.html'),
      },
    },
  },
});
