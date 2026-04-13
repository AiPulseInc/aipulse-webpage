# Plan wdrożenia: markdownowy blog cyberbezpieczeństwa pod `/security/blog/`

## Punkt wyjścia

- Aktualnie projekt jest klasycznym Vite MPA z trzema wejściami hard-coded w `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/vite.config.js:10`.
- Strona security już ma właściwy branding i układ do odziedziczenia: `body.theme-security` w `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/security/index.html:22`.
- Fioletowy akcent jest już zdefiniowany globalnie w `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/style.css:33` i aktywowany dla security w `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/style.css:741`.
- Wspólny CSS jest dziś ładowany przez `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/main.js:1`, ale dla bloga lepiej zrobić osobny, lżejszy entry JS.

## Rekomendowana architektura

Najprostsze i najbezpieczniejsze rozwiązanie dla tego repo:

- autor pisze posty w Markdownie,
- build script generuje **realne pliki HTML** pod `/security/blog/`,
- Vite buduje je jak kolejne strony MPA,
- obrazki są optymalizowane do `public/generated/security/blog/...`,
- efekt końcowy jest w 100% statyczny i działa bez problemu na Vercelu.

To daje:
- SEO lepsze niż client-side rendering markdowna,
- czyste URL-e typu `/security/blog/nis2-dla-msp-7-krokow/`,
- bardzo prosty workflow dla jednej osoby publikującej 1–2 wpisy tygodniowo.

---

## 1. Folder structure

Użyj dokładnie takiej struktury:

```text
/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/
├── content/
│   └── security/
│       └── blog/
│           ├── nis2-dla-msp-7-krokow/
│           │   ├── index.md
│           │   └── images/
│           │       ├── hero.jpg
│           │       └── macierz-luk.png
│           └── phishing-w-firmie-checklista/
│               ├── index.md
│               └── images/
│                   └── cover.png
├── execution/
│   └── build-security-blog.mjs
├── src/
│   ├── security-blog.js
│   └── security-blog.css
├── security/
│   └── blog/
│       ├── index.html
│       ├── nis2-dla-msp-7-krokow/
│       │   └── index.html
│       └── phishing-w-firmie-checklista/
│           └── index.html
├── public/
│   └── generated/
│       └── security/
│           └── blog/
│               ├── nis2-dla-msp-7-krokow/
│               │   ├── hero-a1b2c3.webp
│               │   ├── hero-og-a1b2c3.webp
│               │   └── macierz-luk-d4e5f6.webp
│               └── phishing-w-firmie-checklista/
│                   └── cover-a7b8c9.webp
├── package.json
├── vite.config.js
└── style.css
```

### Co jest czym

- `content/security/blog/` — jedyne źródło treści.
- `execution/build-security-blog.mjs` — deterministyczny generator Markdown → HTML.
- `security/blog/**/index.html` — wygenerowane strony źródłowe dla Vite MPA.
- `public/generated/security/blog/` — wygenerowane, zoptymalizowane obrazki.
- `src/security-blog.js` + `src/security-blog.css` — lekki entry tylko dla bloga.

### Ważna zasada

- Folder posta = slug posta.
- `front-matter.slug` musi być identyczny jak nazwa folderu.
- Build ma failować przy mismatchu, duplikatach slugów albo brakujących polach.

---

## 2. Zmiany w `vite.config.js`

### Cel

Obecny config nie zobaczy nowych stron bloga, bo wejścia są wpisane ręcznie w `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/vite.config.js:10`.

Trzeba zrobić 3 rzeczy:

- uruchamiać generator bloga **przed** zebraniem inputów,
- zbierać inputy dynamicznie z `security/blog/**/index.html`,
- w devie przebudowywać blog po zmianie Markdowna lub obrazków.

### Proponowany kształt

```js
// /Users/mk/code-sandbox/toolbox-project/aipulse-webpage/vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globbySync } from 'globby';
import { buildSecurityBlog } from './execution/build-security-blog.mjs';

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
    files.map((file) => [
      file === 'index.html'
        ? 'landing'
        : file.replace(/\/index\.html$/, '').replace(/\//g, '-'),
      resolve(__dirname, file),
    ])
  );
}

function securityBlogWatcher() {
  return {
    name: 'security-blog-watcher',
    configureServer(server) {
      server.watcher.add(resolve(__dirname, 'content/security/blog/**/*'));

      server.watcher.on('all', async (_, file) => {
        if (!file.includes('/content/security/blog/')) return;
        await buildSecurityBlog({ rootDir: __dirname });
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}

export default defineConfig(async () => {
  await buildSecurityBlog({ rootDir: __dirname });

  return {
    plugins: [securityBlogWatcher()],
    build: {
      rollupOptions: {
        input: getHtmlInputs(),
      },
    },
  };
});
```

### Dlaczego tak

- Vite dalej pozostaje zwykłym MPA.
- Nie ma SSR, Reacta ani CMS-a.
- Każdy post jest prawdziwą stroną HTML.
- Vercel dostaje gotowe pliki `dist/security/blog/.../index.html`.

---

## 3. Markdown → HTML: approach, biblioteki, slug → URL

### Biblioteki

- `gray-matter` — front matter
- `markdown-it` — parser Markdown
- `markdown-it-anchor` — ID w nagłówkach i anchor links
- `markdown-it-attrs` — opcjonalne klasy/atrybuty w markdownie
- `slugify` — slugi zgodne z polskimi znakami

### Reguły front matter

Wymagane pola:

- `title`
- `slug`
- `date`
- `excerpt`
- `description`
- `category`
- `tags`
- `cover`
- `coverAlt`
- `draft`

Opcjonalne:

- `updated`
- `featured`
- `author` (default: `Maciej Konieczny`)

### Reguła slugów i URL-i

- źródło prawdy: `front-matter.slug`
- walidacja: slug musi być równy nazwie folderu
- URL: `/security/blog/${slug}/`
- HTML output: `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/security/blog/${slug}/index.html`

### Parser i render

```js
// fragment z /Users/mk/code-sandbox/toolbox-project/aipulse-webpage/execution/build-security-blog.mjs
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import slugify from 'slugify';

const slugifyPl = (value) =>
  slugify(value, { lower: true, strict: true, locale: 'pl' });

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(markdownItAttrs)
  .use(markdownItAnchor, {
    slugify: slugifyPl,
  });
```

### Dodatkowe zasady generatora

- posty z `draft: true` nie trafiają do bloga,
- kolejność na indexie: `featured: true` najpierw, potem `date desc`,
- build failuje przy:
  - zduplikowanym slugu,
  - brakującym `cover`,
  - pustym `excerpt`,
  - pustym `alt` w obrazku,
  - braku pliku obrazka.

### Czy robić HTML client-side?

Nie.  
Dla tego projektu lepszy jest build-time HTML, bo:

- `/security/blog/` ma być SEO-friendly,
- Vercel ma serwować statykę bez JS-required renderingu,
- cyber blog powinien mieć pełne meta tagi i pre-rendered content.

---

## 4. Image handling: storage, optymalizacja, składnia Markdown

### Gdzie trzymać obrazki

Źródła:

- `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/content/security/blog/<slug>/images/*`

Wygenerowane assety:

- `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/public/generated/security/blog/<slug>/*`

### Workflow

1. Autor wrzuca oryginał do folderu posta.
2. W markdownie używa ścieżki względnej.
3. Generator:
   - znajduje obrazki użyte w treści,
   - optymalizuje je przez `sharp`,
   - nadaje nazwę z krótkim hashem,
   - zapisuje do `public/generated/security/blog/<slug>/`,
   - podmienia `src` w HTML.

### Format i rozmiary

- raster (`jpg`, `jpeg`, `png`) → `webp`
- `svg` → kopiuj bez konwersji
- `gif` → nie wspieraj w v1; build fail z komunikatem
- cover image:
  - wersja artykułowa: max `1600px`, `webp`, quality `78`
  - wersja OG: `1200x630`, `webp`
- inline image:
  - max `1600px`, `webp`, quality `78`

### Składnia w Markdown

Podstawowa:

```md
![Macierz luk NIS2](./images/macierz-luk.png)
```

Z podpisem pod obrazkiem:

```md
![Macierz luk NIS2](./images/macierz-luk.png "Przykład prostego podziału luk na procesy, ludzi i technologię")
```

Z atrybutami przez `markdown-it-attrs`:

```md
![Segmentacja sieci](./images/segmentacja.png "Przykładowy podział VLAN"){.blog-image-wide}
```

### Render HTML dla obrazków

- każde `<img>` dostaje:
  - `loading="lazy"`
  - `decoding="async"`
  - klasę `blog-inline-image`
- jeśli obrazek ma `title`, generator opakowuje go w `<figure>` + `<figcaption>`

Przykład reguły:

```js
const defaultImageRule =
  md.renderer.rules.image ||
  ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const originalSrc = token.attrGet('src');
  const finalSrc = env.assetMap[originalSrc] ?? originalSrc;

  token.attrSet('src', finalSrc);
  token.attrSet('loading', 'lazy');
  token.attrSet('decoding', 'async');
  token.attrSet('class', 'blog-inline-image');

  const html = defaultImageRule(tokens, idx, options, env, self);
  const caption = token.attrGet('title');

  return caption
    ? `<figure class="blog-figure">${html}<figcaption>${caption}</figcaption></figure>`
    : html;
};
```

### Ważna decyzja

Nie pakuj obrazków bloga przez importy JS.  
Dla generowanych stron MPA bezpieczniej trzymać finalne assety w `public/generated/...`.

---

## 5. Struktura strony indexu `/security/blog/`

### Założenie designu

Index bloga ma dziedziczyć security theme z `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/security/index.html:22` i akcent z `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/style.css:741`.

### Sekcje strony

1. **Sticky nav**
   - ten sam branding co security
   - linki:
     - `Start` → `/security/`
     - `Blog` → `/security/blog/`
     - `Oferta` → `/security/#section-oferta`
     - `Kontakt` → `/security/#contact`

2. **Dark hero**
   - eyebrow: `// SECURITY BLOG`
   - H1: `CYBERBEZPIECZEŃSTWO DLA MŚP`
   - lead po polsku
   - CTA do najnowszego wpisu
   - secondary CTA do strony auditów

3. **Featured post**
   - większy card/grid 7/5
   - cover image
   - data, kategoria, reading time
   - excerpt
   - `Czytaj artykuł`

4. **Lista wpisów**
   - grid 3 kolumny desktop / 1 kolumna mobile
   - każdy card:
     - category
     - title
     - excerpt
     - date
     - reading time
     - tagi
     - CTA

5. **CTA section**
   - box w stylu security
   - tekst: blog edukuje, audyt zamienia to w plan działania
   - button → `/security/#contact`

6. **Footer**
   - spójny z security footerem z `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/security/index.html:531`

### Szkielet HTML

```html
<body class="theme-neon-nexus theme-security blog-index-page">
  <nav class="site-nav">...</nav>

  <header class="hero-static blog-hero">
    <div class="container-fluid">
      <div class="grid-fluid grid-align-center">
        <div class="layout-col col-7 flex-center-v">
          <div class="text-xs">// SECURITY BLOG</div>
          <h1 class="hero-headline">CYBERBEZPIECZEŃSTWO<br><span>dla MŚP</span></h1>
          <p class="hero-subtitle">Praktyczne wpisy o NIS2, phishingu, kopiach zapasowych i audytach.</p>
          <div class="module-actions">
            <a class="btn btn-accent" href="/security/blog/nis2-dla-msp-7-krokow/">Najnowszy wpis</a>
            <a class="btn btn-outline" href="/security/#section-oferta">Zobacz ofertę</a>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main>
    <section class="section section-white">
      <!-- featured -->
    </section>

    <section class="section">
      <!-- posts grid -->
    </section>

    <section class="section section-white">
      <!-- CTA -->
    </section>
  </main>

  <footer class="site-footer">...</footer>
  <script type="module" src="/src/security-blog.js"></script>
</body>
```

---

## 6. Single post template

### Struktura

1. **Head SEO**
   - `<title>`
   - `<meta name="description">`
   - canonical
   - Open Graph
   - article og:image
   - JSON-LD `BlogPosting`

2. **Sticky nav**
   - ten sam nav co index

3. **Breadcrumb**
   - `Security / Blog / Tytuł`

4. **Post hero**
   - category
   - H1
   - dek/lead
   - date / updated / reading time
   - cover image

5. **Article layout**
   - desktop: content + TOC
   - mobile: content, TOC nad treścią
   - content wyrenderowany z Markdown

6. **After-post CTA**
   - `Chcesz przełożyć to na plan działań w firmie?`
   - link do `/security/#contact`

7. **Prev/Next**
   - opcjonalnie w v1.1
   - w v1 można odpuścić

### Szkielet HTML

```html
<body class="theme-neon-nexus theme-security blog-post-page">
  <nav class="site-nav">...</nav>

  <header class="section blog-post-hero">
    <div class="container-fluid">
      <a class="blog-breadcrumbs" href="/security/blog/">Security Blog</a>
      <div class="blog-post-meta">NIS2 · 18.04.2026 · 6 min czytania</div>
      <h1 class="hero-headline">NIS2 dla MŚP: 7 kroków, które warto zrobić jeszcze w tym kwartale</h1>
      <p class="hero-subtitle">Praktyczna checklista dla właściciela firmy...</p>
      <img class="blog-post-cover" src="/generated/security/blog/nis2-dla-msp-7-krokow/hero-a1b2c3.webp" alt="..." />
    </div>
  </header>

  <main class="section section-white">
    <div class="container-fluid blog-post-layout">
      <aside class="blog-toc">
        <!-- wygenerowany TOC -->
      </aside>

      <article class="blog-prose">
        <!-- HTML z markdowna -->
      </article>
    </div>
  </main>

  <section class="section blog-post-cta">
    <div class="container-fluid">
      <div class="pricing-card pricing-card-highlighted">
        <div class="pricing-card-label">_CTA · AUDYT</div>
        <div class="pricing-card-name">Chcesz sprawdzić to w swojej firmie?</div>
        <p class="pricing-card-desc">Przekładamy teorię z bloga na konkretny plan działań.</p>
        <a href="/security/#contact" class="pricing-card-cta">Umów konsultację</a>
      </div>
    </div>
  </section>

  <footer class="site-footer">...</footer>
  <script type="module" src="/src/security-blog.js"></script>
</body>
```

### CSS scope

Dopisuj tylko klasy z prefiksem `blog-`, np.:

- `.blog-hero`
- `.blog-card`
- `.blog-grid`
- `.blog-post-layout`
- `.blog-prose`
- `.blog-toc`
- `.blog-tag`
- `.blog-figure`

Dzięki temu nie rozwalisz dużego globalnego `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/style.css:1`.

---

## 7. npm packages

### Zostawić

- `vite@^5.0.0`

### Dodać jako `devDependencies`

- `gray-matter@4.0.3`
- `markdown-it@14.1.1`
- `markdown-it-anchor@9.2.0`
- `markdown-it-attrs@4.3.1`
- `slugify@1.6.9`
- `sharp@0.34.5`
- `globby@14.0.2`

### Komenda

```bash
npm i -D gray-matter@4.0.3 markdown-it@14.1.1 markdown-it-anchor@9.2.0 markdown-it-attrs@4.3.1 slugify@1.6.9 sharp@0.34.5 globby@14.0.2
```

### `package.json` scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "blog:build": "node execution/build-security-blog.mjs",
    "generate-images": "node scripts/generate-images.mjs"
  }
}
```

`blog:build` zostaje jako ręczny fallback, ale główny flow i tak odpala generator z `vite.config.js`.

---

## 8. Example blog post `.md` with front matter

Ścieżka:

`/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/content/security/blog/nis2-dla-msp-7-krokow/index.md`

```md
---
title: "NIS2 dla MŚP: 7 kroków, które warto zrobić jeszcze w tym kwartale"
slug: "nis2-dla-msp-7-krokow"
date: "2026-04-18"
updated: "2026-04-18"
excerpt: "Krótka checklista dla właścicieli i managerów MŚP: co uporządkować najpierw, żeby zmniejszyć ryzyko i lepiej przygotować się do wymagań NIS2/KSC."
description: "Praktyczny przewodnik po 7 działaniach, które pomagają MŚP uporządkować cyberbezpieczeństwo przed audytem i wymaganiami NIS2."
category: "NIS2"
tags:
  - "nis2"
  - "ksc"
  - "msp"
  - "audyt"
cover: "./images/hero.jpg"
coverAlt: "Macierz priorytetów bezpieczeństwa dla małej i średniej firmy"
featured: true
draft: false
author: "Maciej Konieczny"
---

Wiele firm słyszy dziś o NIS2, ale nie wie, od czego realnie zacząć.  
Dobra wiadomość: na początku nie potrzeba wielkiego programu transformacji. Trzeba uporządkować kilka podstaw.

## 1. Spisz najważniejsze systemy i dane

Na start odpowiedz na trzy pytania:

- z czego firma nie może zrezygnować nawet na 1 dzień,
- gdzie są dane klientów,
- kto ma dostęp administracyjny.

![Prosta mapa priorytetów systemów](./images/mapa-systemow.png "Najpierw ustal, które systemy są naprawdę krytyczne")

## 2. Sprawdź, czy kopie zapasowe da się odtworzyć

Sama informacja „mamy backup” nie wystarcza.  
Liczy się to, czy potrafisz:

- odtworzyć pliki,
- odtworzyć system,
- zrobić to w rozsądnym czasie.

## 3. Ogranicz konta z uprawnieniami admina

To zwykle najszybszy punkt poprawy i jeden z najbardziej opłacalnych.

## 4. Włącz MFA tam, gdzie ryzyko jest największe

Minimalny zakres:

- poczta,
- VPN,
- CRM,
- system księgowy,
- panel hostingu.

## 5. Przygotuj prostą procedurę incydentu

Nie chodzi o 40-stronicowy dokument.  
Chodzi o odpowiedź: kto, do kogo i w jakiej kolejności dzwoni.

## 6. Sprawdź dostawców zewnętrznych

Jeśli krytyczny system jest poza Twoją firmą, jego bezpieczeństwo dalej jest Twoim ryzykiem biznesowym.

## 7. Zrób punkt wyjścia przed audytem

Bez punktu wyjścia trudno ustalić priorytety, koszt i kolejność działań.

> Jeśli chcesz, mogę przełożyć tę checklistę na konkretny plan audytu dla Twojej firmy.

[Umów konsultację](/security/#contact)
```

---

## 9. Step-by-step implementation

1. Dodaj zależności markdown/image build do `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/package.json:12`.
2. Utwórz `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/content/security/blog/`.
3. Dodaj pierwszy przykładowy post w folderze slugowym z `index.md` i `images/`.
4. Utwórz `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/execution/build-security-blog.mjs`.
5. W generatorze zaimplementuj:
   - scan postów,
   - walidację front matter,
   - sortowanie,
   - liczenie reading time,
   - budowę TOC,
   - render Markdown → HTML.
6. Dodaj obsługę obrazków:
   - resolve ścieżek względnych,
   - `sharp` dla rastrów,
   - copy dla SVG,
   - hash w nazwie pliku,
   - rewrite `src` w HTML.
7. Dodaj template functions:
   - `renderBlogIndex(posts)`
   - `renderBlogPost(post, allPosts)`
8. Wygeneruj:
   - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/security/blog/index.html`
   - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/security/blog/<slug>/index.html`
9. Dodaj `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/security-blog.js`:
   - import wspólnego CSS,
   - import blog CSS,
   - inject wersji do `#app-version`.
10. Dodaj `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/security-blog.css` z typografią i layoutem bloga.
11. Zmień `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/vite.config.js:1` na async config + dynamiczne inputy + watcher.
12. Dodaj link `Blog` do nawigacji i footera security page w `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/security/index.html:33`.
13. Dodaj ewentualny link zwrotny z bloga do `/security/#contact`.
14. Uruchom `npm run build`.
15. Zweryfikuj wynik:
   - `dist/security/blog/index.html`
   - `dist/security/blog/<slug>/index.html`
   - `dist/generated/security/blog/<slug>/*`
16. Wdróż na Vercel bez dodatkowego backendu i sprawdź clean URLs.

---

## 10. Risks specific to this Vite multi-page setup

- **Hard-coded inputs dziś nie skalują się na bloga** — bez dynamicznego input discovery Vite nie zbuduje nowych postów.
- **Kolejność builda ma znaczenie** — generator musi wykonać się przed zebraniem `rollupOptions.input`, inaczej posty nie trafią do `dist`.
- **Nested paths łatwo psują asset URLs** — w generowanych stronach używaj ścieżek root-absolute, np. `/src/security-blog.js` i `/generated/security/blog/...`, nie `../...`.
- **`main.js` jest za ciężki dla bloga** — ładuje logikę modali/sliderów z `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/main.js:12`; blog powinien mieć osobny entry.
- **Globalny CSS jest już duży** — bez prefiksu `.blog-...` łatwo wejść w konflikt z istniejącymi klasami security/business.
- **`public/` omija hashy Vite** — dlatego generator powinien dopisywać krótki hash do nazw obrazków, inaczej Vercel może trzymać stary cache po podmianie pliku.
- **Dev server sam nie rozumie Markdowna** — bez watchera w `vite.config.js` zmiany w `content/security/blog/` nie odświeżą się automatycznie.
- **Generated source HTML może być mylący** — trzeba jasno przyjąć, że `security/blog/**/index.html` są plikami generowanymi, nie edytowanymi ręcznie.
- **Zbyt szeroki glob może złapać `dist/`** — input discovery musi ignorować `dist/**`, inaczej build może zacząć konsumować własny output.
- **Vercel clean URLs wymagają folderowego `index.html`** — generuj `/security/blog/<slug>/index.html`, nie pojedyncze pliki `<slug>.html`.

---

## Minimalny zakres v1

Jeśli chcesz wdrożyć to szybko i bez nadmiaru, v1 powinno zawierać dokładnie to:

- statyczny generator Markdown → HTML,
- folder-per-post z lokalnymi obrazkami,
- optymalizacja obrazków do `public/generated/security/blog/`,
- index `/security/blog/`,
- strony `/security/blog/<slug>/`,
- shared security branding,
- meta SEO per post,
- osobny `src/security-blog.js`,
- dynamiczne inputy w Vite.

To będzie spójne z obecnym repo, zgodne z Vite 5, proste dla solo autora i bezproblemowe dla Vercela.