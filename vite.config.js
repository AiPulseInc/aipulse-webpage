import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globbySync } from 'globby';
import Sitemap from 'vite-plugin-sitemap';
import { buildSecurityBlog } from './scripts/build-security-blog.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function getHtmlInputs() {
  const files = globbySync(
    [
      'index.html',
      'business/index.html',
      'security/index.html',
      'security/blog/index.html',
      'security/blog/**/index.html',
    ],
    {
      cwd: __dirname,
      ignore: ['dist/**', 'node_modules/**'],
    }
  );

  return Object.fromEntries(
    files.map((file) => {
      const key =
        file === 'index.html'
          ? 'landing'
          : file.replace(/\/index\.html$/, '').replace(/\//g, '-');
      return [key, resolve(__dirname, file)];
    })
  );
}

function securityBlogWatcher() {
  return {
    name: 'security-blog-watcher',
    configureServer(server) {
      const contentGlob = resolve(__dirname, 'content/security/blog');
      server.watcher.add(contentGlob);

      server.watcher.on('all', async (_event, file) => {
        if (!file || !file.includes('/content/security/blog/')) return;
        try {
          await buildSecurityBlog({ rootDir: __dirname });
          server.ws.send({ type: 'full-reload' });
        } catch (err) {
          console.error('[blog-watcher] rebuild failed:', err.message);
        }
      });
    },
  };
}

export default defineConfig(async () => {
  // Always rebuild blog before Vite picks up HTML inputs
  await buildSecurityBlog({ rootDir: __dirname });

  // Collect post URLs for sitemap
  const postFiles = globbySync('security/blog/*/index.html', {
    cwd: __dirname,
    ignore: ['dist/**'],
  });
  const dynamicRoutes = [
    '/',
    '/business/',
    '/security/',
    '/security/blog/',
    ...postFiles.map((f) => '/' + f.replace(/index\.html$/, '')),
  ];

  return {
    plugins: [
      securityBlogWatcher(),
      Sitemap({
        hostname: 'https://aipulse.pl',
        dynamicRoutes,
        outDir: 'dist',
        changefreq: 'weekly',
      }),
    ],
    build: {
      rollupOptions: {
        input: getHtmlInputs(),
      },
    },
  };
});
