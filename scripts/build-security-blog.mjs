// Build security blog — scans content/security/blog, renders markdown → HTML,
// optimizes images, generates index + per-post pages + RSS feed.
// Run via vite.config.js plugin (build + dev watch) or standalone via npm run blog:build.

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { resolve, dirname, basename, extname, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { globby } from 'globby';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import slugify from 'slugify';
import sharp from 'sharp';
import { Feed } from 'feed';

const slugifyPl = (value) =>
  slugify(value, { lower: true, strict: true, locale: 'pl' });

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
  .use(markdownItAttrs)
  .use(markdownItAnchor, { slugify: slugifyPl, permalink: false });

const SITE_URL = 'https://aipulse.pl';
const REQUIRED_FIELDS = ['title', 'slug', 'date', 'excerpt', 'description', 'category', 'cover', 'coverAlt'];

function hashFile(buf) {
  return createHash('sha1').update(buf).digest('hex').slice(0, 8);
}

function countWords(text) {
  return text.trim().split(/\s+/).length;
}

function readingMinutes(text) {
  return Math.max(1, Math.round(countWords(text) / 200));
}

function extractHeadings(htmlContent) {
  const toc = [];
  const re = /<h2[^>]*id="([^"]+)"[^>]*>(.*?)<\/h2>/g;
  let m;
  while ((m = re.exec(htmlContent)) !== null) {
    toc.push({ id: m[1], text: m[2].replace(/<[^>]+>/g, '') });
  }
  return toc;
}

function formatDate(iso) {
  const [y, mo, d] = iso.split('-');
  return `${d}.${mo}.${y}`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Resolve image sources in markdown body and process them through sharp (for relative refs).
// Absolute paths (starting with /) are passed through unchanged.
async function processImagesInContent(contentHtml, postDir, rootDir, slug) {
  const assetMap = {};
  const imgRe = /<img[^>]+src="([^"]+)"[^>]*>/g;
  const srcs = new Set();
  let m;
  while ((m = imgRe.exec(contentHtml)) !== null) {
    srcs.add(m[1]);
  }

  for (const src of srcs) {
    if (src.startsWith('/') || src.startsWith('http')) {
      assetMap[src] = src;
      continue;
    }
    // Relative — resolve against post dir, copy to public/generated/security/blog/<slug>/
    const srcPath = resolve(postDir, src);
    if (!existsSync(srcPath)) {
      console.warn(`[blog] missing inline image: ${srcPath} — leaving src unchanged`);
      assetMap[src] = src;
      continue;
    }
    const buf = readFileSync(srcPath);
    const hash = hashFile(buf);
    const ext = extname(srcPath).toLowerCase();
    const name = basename(srcPath, ext);
    const isSvg = ext === '.svg';
    const outExt = isSvg ? '.svg' : '.webp';
    const outFile = `${name}-${hash}${outExt}`;
    const outDir = resolve(rootDir, 'public/generated/security/blog', slug);
    mkdirSync(outDir, { recursive: true });
    const outPath = resolve(outDir, outFile);

    if (!existsSync(outPath)) {
      if (isSvg) {
        copyFileSync(srcPath, outPath);
      } else {
        await sharp(buf)
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 78 })
          .toFile(outPath);
      }
    }
    assetMap[src] = `/generated/security/blog/${slug}/${outFile}`;
  }

  return contentHtml.replace(imgRe, (match, src) => {
    const finalSrc = assetMap[src] || src;
    return match.replace(`src="${src}"`, `src="${finalSrc}" loading="lazy" decoding="async" class="blog-inline-image"`);
  });
}

export async function buildSecurityBlog({ rootDir }) {
  const contentRoot = resolve(rootDir, 'content/security/blog');
  if (!existsSync(contentRoot)) {
    console.log('[blog] no content/security/blog — skipping');
    return;
  }

  const files = await globby('*/index.md', { cwd: contentRoot });
  const posts = [];
  const slugsSeen = new Set();

  for (const rel of files) {
    const postDir = resolve(contentRoot, dirname(rel));
    const folderSlug = basename(postDir);
    const raw = readFileSync(resolve(contentRoot, rel), 'utf8');
    const { data: fm, content } = matter(raw);

    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!fm[field]) {
        throw new Error(`[blog] ${rel}: missing required front-matter field '${field}'`);
      }
    }
    if (fm.slug !== folderSlug) {
      throw new Error(`[blog] ${rel}: slug '${fm.slug}' must match folder name '${folderSlug}'`);
    }
    if (slugsSeen.has(fm.slug)) {
      throw new Error(`[blog] duplicate slug: ${fm.slug}`);
    }
    slugsSeen.add(fm.slug);

    if (fm.draft === true) {
      console.log(`[blog] skipping draft: ${fm.slug}`);
      continue;
    }

    const htmlRaw = md.render(content);
    const html = await processImagesInContent(htmlRaw, postDir, rootDir, fm.slug);
    const toc = extractHeadings(html);
    const readMins = readingMinutes(content);

    posts.push({
      ...fm,
      html,
      toc,
      readingMinutes: readMins,
      url: `/security/blog/${fm.slug}/`,
    });
  }

  // Sort: featured first, then date desc
  posts.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Generate per-post pages
  for (const post of posts) {
    const htmlOut = renderBlogPost(post);
    const outDir = resolve(rootDir, 'security/blog', post.slug);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(resolve(outDir, 'index.html'), htmlOut);
  }

  // Generate index
  const indexOut = renderBlogIndex(posts);
  mkdirSync(resolve(rootDir, 'security/blog'), { recursive: true });
  writeFileSync(resolve(rootDir, 'security/blog/index.html'), indexOut);

  // Generate RSS feed
  const feed = new Feed({
    title: 'Ai Puls Security Blog',
    description: 'Cyberbezpieczeństwo dla polskich MŚP — praktyczne wpisy o NIS2, phishingu, backupach i audytach.',
    id: `${SITE_URL}/security/blog/`,
    link: `${SITE_URL}/security/blog/`,
    language: 'pl',
    feedLinks: { rss2: `${SITE_URL}/security/blog/feed.xml` },
    author: { name: 'Maciej Konieczny', email: 'kontakt@aipulse.pl' },
    copyright: `© ${new Date().getFullYear()} Ai Puls`,
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}${post.url}`,
      link: `${SITE_URL}${post.url}`,
      description: post.excerpt,
      content: post.html,
      date: new Date(post.date),
    });
  });

  // Write feed.xml to public/ so Vite copies it as-is (without asset hashing)
  const feedDir = resolve(rootDir, 'public/security/blog');
  mkdirSync(feedDir, { recursive: true });
  writeFileSync(resolve(feedDir, 'feed.xml'), feed.rss2());

  console.log(`[blog] built ${posts.length} post(s) + index + RSS feed`);
  return posts;
}

// ------ TEMPLATES ------

function renderNav(activePath = '') {
  const links = [
    { href: '/security/#top', label: 'Start' },
    { href: '/security/#section-compliance', label: 'NIS2 / KSC' },
    { href: '/security/#section-szkolenia-security', label: 'Szkolenia' },
    { href: '/security/#section-proces', label: 'Jak pracujemy' },
    { href: '/security/#section-dla-kogo', label: 'Dla kogo' },
    { href: '/security/#section-oferta', label: 'Oferta' },
    { href: '/security/blog/', label: 'Blog' },
    { href: '/security/#contact', label: 'Kontakt' },
  ];
  const linksHtml = links.map((l) => {
    const isActive = activePath === '/security/blog/' && l.href === '/security/blog/';
    const cls = isActive ? 'hover-white nav-active' : 'hover-white';
    const aria = isActive ? ' aria-current="page"' : '';
    return `<a href="${l.href}" class="${cls}"${aria}>${l.label}</a>`;
  }).join('\n      ');

  return `<nav class="site-nav">
    <a href="/" class="site-nav-brand-wrap">
      <div class="site-nav-brand-inner">
        <div class="site-nav-brand">A<span class="brand-i">i</span> Puls</div>
        <div class="site-nav-tagline">Cyber Security</div>
      </div>
      <span id="app-version" class="site-nav-version"></span>
    </a>
    <button type="button" class="site-nav-toggle" aria-expanded="false" aria-controls="site-nav-menu" aria-label="Otwórz menu">
      <span class="site-nav-toggle-bar"></span>
      <span class="site-nav-toggle-bar"></span>
    </button>
    <div class="site-nav-links" id="site-nav-menu">
      ${linksHtml}
    </div>
  </nav>`;
}

function renderFooter() {
  return `<footer class="site-footer">
    <div class="container-fluid footer-inner">
      <div class="footer-brand-row">
        <div class="footer-brand">A<span class="brand-i">i</span> Puls</div>
      </div>
      <div class="footer-copyright">© 2026 Ai Puls Security · Audyty cyberbezpieczeństwa dla MŚP</div>
      <div class="footer-links">
        <a href="https://www.linkedin.com/company/aipulseinc" target="_blank" rel="noopener" class="text-xs">LinkedIn</a>
        <a href="mailto:kontakt@aipulse.pl" class="text-xs">Email</a>
        <a href="/business/" class="text-xs">Doradztwo</a>
        <a href="/" class="text-xs">← Powrót do wyboru</a>
        <a href="/polityka-cookies/" class="text-xs footer-cookie-link">Ustawienia cookies</a>
      </div>
    </div>
  </footer>`;
}

function renderFab() {
  return `<a class="call-fab" href="tel:+48502333645" aria-label="Zadzwoń: 502 333 645">
    <svg class="call-fab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  </a>`;
}

function renderHead(opts) {
  const { title, description, url, image, ogType = 'website' } = opts;
  const absUrl = `${SITE_URL}${url}`;
  const absImage = image && image.startsWith('/') ? `${SITE_URL}${image}` : image;
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${absUrl}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:url" content="${absUrl}" />
  ${absImage ? `<meta property="og:image" content="${absImage}" />` : ''}
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <link rel="alternate" type="application/rss+xml" title="Ai Puls Security Blog" href="/security/blog/feed.xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
</head>`;
}

function renderBlogIndex(posts) {
  const featured = posts.find((p) => p.featured);
  const rest = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  const featuredHtml = featured ? `
  <section class="section section-white blog-featured-section">
    <div class="container-fluid">
      <div class="text-xs" style="color: var(--brand-accent); margin-bottom: 1rem;">// POLECANE</div>
      <a href="${featured.url}" class="blog-featured-card">
        <div class="blog-featured-cover">
          <img src="${featured.cover}" alt="${escapeHtml(featured.coverAlt)}" loading="lazy" />
        </div>
        <div class="blog-featured-body">
          <div class="blog-card-meta">
            <span class="blog-card-category">${escapeHtml(featured.category)}</span>
            <span class="blog-card-date">${formatDate(featured.date)}</span>
            <span class="blog-card-reading">${featured.readingMinutes} min czytania</span>
          </div>
          <h2 class="blog-featured-title">${escapeHtml(featured.title)}</h2>
          <p class="blog-featured-excerpt">${escapeHtml(featured.excerpt)}</p>
          <span class="blog-featured-cta">Czytaj artykuł →</span>
        </div>
      </a>
    </div>
  </section>` : '';

  const listHtml = rest.map((post) => `
    <a href="${post.url}" class="blog-card">
      <div class="blog-card-cover">
        <img src="${post.cover}" alt="${escapeHtml(post.coverAlt)}" loading="lazy" />
      </div>
      <div class="blog-card-body">
        <div class="blog-card-meta">
          <span class="blog-card-category">${escapeHtml(post.category)}</span>
          <span class="blog-card-date">${formatDate(post.date)}</span>
          <span class="blog-card-reading">${post.readingMinutes} min</span>
        </div>
        <h3 class="blog-card-title">${escapeHtml(post.title)}</h3>
        <p class="blog-card-excerpt">${escapeHtml(post.excerpt)}</p>
      </div>
    </a>`).join('\n');

  return `${renderHead({
    title: 'Blog | Ai Puls Security — Cyberbezpieczeństwo dla MŚP',
    description: 'Praktyczne wpisy o NIS2, phishingu, backupach i audytach cyberbezpieczeństwa dla polskich MŚP.',
    url: '/security/blog/',
  })}

<body class="theme-neon-nexus theme-security blog-index-page" id="top">

  ${renderNav('/security/blog/')}

  <header class="hero-static blog-hero">
    <div class="container-fluid">
      <div class="grid-fluid grid-align-center">
        <div class="layout-col col-12">
          <div class="text-xs" style="margin-bottom: 1rem; color: var(--brand-accent);">// SECURITY BLOG</div>
          <h1 class="hero-headline">CYBERBEZPIECZEŃSTWO<br><span style="color: var(--brand-accent);">DLA MŚP</span></h1>
          <p class="hero-subtitle" style="margin-top: 1rem; max-width: 48ch;">
            Praktyczne wpisy o NIS2, phishingu, kopiach zapasowych i audytach. Bez teorii — konkret, który można wdrożyć.
          </p>
        </div>
      </div>
    </div>
  </header>

  <main>
    ${featuredHtml}

    <section class="section blog-posts-section">
      <div class="container-fluid">
        <div class="text-xs" style="color: var(--brand-accent); margin-bottom: 1.5rem;">// WSZYSTKIE WPISY</div>
        <div class="blog-posts-grid">
          ${listHtml}
        </div>
      </div>
    </section>

    <section class="section section-white blog-cta-section">
      <div class="container-fluid">
        <div class="blog-cta-box">
          <div class="text-xs" style="color: var(--brand-accent); margin-bottom: 1rem;">// OD TEORII DO PLANU</div>
          <h2 class="blog-cta-title">Blog edukuje. Audyt daje plan działania.</h2>
          <p class="blog-cta-desc">
            Każdy wpis tu to kawałek większej układanki. Chcesz zobaczyć, gdzie Twoja firma naprawdę jest — i co zrobić w pierwszej kolejności?
          </p>
          <a href="/security/#contact" class="btn btn-accent">Umów bezpłatną konsultację</a>
        </div>
      </div>
    </section>
  </main>

  ${renderFooter()}
  ${renderFab()}

  <script type="module" src="/src/security-blog.js"></script>
</body>

</html>`;
}

function renderBlogPost(post) {
  const tocHtml = post.toc.length > 0 ? `
  <aside class="blog-toc" aria-label="Spis treści">
    <div class="blog-toc-label">W tym wpisie</div>
    <ol class="blog-toc-list">
      ${post.toc.map((h, i) => `<li><a href="#${h.id}"><span class="blog-toc-num">${String(i + 1).padStart(2, '0')}</span> ${escapeHtml(h.text)}</a></li>`).join('\n      ')}
    </ol>
  </aside>` : '';

  // Inject cover as floated figure at start of prose — text wraps around on desktop, full-width on phone
  const coverFigure = `<figure class="blog-post-cover-inline"><img src="${post.cover}" alt="${escapeHtml(post.coverAlt)}" loading="lazy" /></figure>`;
  const proseHtml = coverFigure + post.html;

  return `${renderHead({
    title: `${post.title} | Ai Puls Security Blog`,
    description: post.description,
    url: post.url,
    image: post.cover,
    ogType: 'article',
  })}

<body class="theme-neon-nexus theme-security blog-post-page" id="top">

  ${renderNav('/security/blog/')}

  <article class="blog-post">
    <header class="section section-white blog-post-header">
      <div class="container-fluid">
        <nav class="blog-breadcrumbs" aria-label="Ścieżka">
          <a href="/security/">Security</a>
          <span>›</span>
          <a href="/security/blog/">Blog</a>
        </nav>
        <div class="blog-post-meta">
          <span class="blog-card-category">${escapeHtml(post.category)}</span>
          <span class="blog-card-date">${formatDate(post.date)}</span>
          <span class="blog-card-reading">${post.readingMinutes} min czytania</span>
        </div>
        <h1 class="blog-post-title">${escapeHtml(post.title)}</h1>
        <p class="blog-post-lead">${escapeHtml(post.excerpt)}</p>
      </div>
    </header>

    <div class="section section-white blog-post-body-section">
      <div class="container-fluid blog-post-layout">
        ${tocHtml}
        <div class="blog-prose">
          ${proseHtml}
        </div>
      </div>
    </div>

    <section class="section blog-post-cta">
      <div class="container-fluid">
        <div class="blog-cta-box blog-cta-box-dark">
          <div class="text-xs" style="color: var(--brand-accent); margin-bottom: 1rem;">// OD TEORII DO PLANU</div>
          <h2 class="blog-cta-title">Chcesz przełożyć to na plan działań w Twojej firmie?</h2>
          <p class="blog-cta-desc">
            30 minut bezpłatnej konsultacji. Porozmawiamy o Twojej sytuacji i powiemy, co zrobilibyśmy NAJPIERW.
          </p>
          <div class="blog-cta-buttons">
            <a href="/security/#contact" class="btn btn-accent">Umów konsultację</a>
            <a href="/security/blog/" class="btn btn-outline">Więcej wpisów</a>
          </div>
        </div>
      </div>
    </section>
  </article>

  ${renderFooter()}
  ${renderFab()}

  <script type="module" src="/src/security-blog.js"></script>
</body>

</html>`;
}

// If run directly (not imported): build and exit
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const rootDir = resolve(__filename, '../..');
  buildSecurityBlog({ rootDir }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
