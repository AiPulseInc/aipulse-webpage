# Research: Minimum-Effort Markdown Blog for Ai Puls (Vite 5 + Vanilla JS)

## 1. Tool Comparison for Vite-based Blog

| Tool | Usage / Strategy | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **vite-plugin-markdown** | Imports `.md` files as JS objects containing HTML/Frontmatter. | Stays inside current Vite build; Type-safe frontmatter. | Requires a JS "loader" page to render the content; SEO requires SSR/SSG setup. |
| **Astro** | Framework designed for content-heavy sites. | Industry standard for MD blogs; Automatic image optimization; Zero-JS by default. | **Heavy Lift**: Requires migrating current Vite project to Astro (though easy). |
| **Decap CMS** | Git-backed UI (`admin/index.html`) that commits MD to repo. | Maciej gets a "Wordpress-like" UI to write/upload images without code. | Doesn't solve the "rendering" part, only the "writing" part. |
| **Build-time Script** (Node + Marked) | Custom `scripts/build-blog.mjs` using `marked` and `gray-matter`. | **Zero runtime overhead**; Total control over Brutalist HTML output; Best for SEO. | You have to write the ~50 line script once. |
| **Notion-as-CMS** | Fetch posts from Notion API at build time. | Familiar writing environment; No Git commits for content. | API complexity; Potential build failures if Notion is down; Slower build. |

## 2. Image Handling for Markdown

To maintain the Brutalist aesthetic while staying performant:

*   **Storage**: Store images in `src/assets/blog/{slug}/` (colocated with posts). This allows Vite's asset pipeline to hash them.
*   **Optimization**: Use **`vite-imagetools`**. 
    *   *Usage*: `![alt](./image.jpg?as=webp&w=800)`.
    *   It automatically converts to WebP and resizes during the Vite build.
*   **Responsive**: Use a simple CSS rule: `article img { max-width: 100%; height: auto; border: 2px solid var(--violet); }`. No complex `srcset` needed for a Brutalist 1-2 post/week blog unless images are massive.
*   **Recommendation**: Colocated images in `src/assets/blog/` + `vite-imagetools`.

## 3. URL Structure & SEO

*   **URL Structure**: `/security/blog/[slug]/index.html`.
    *   *Why*: Better SEO than `/blog?post=slug`. Vite handles multi-page `index.html` files perfectly.
*   **Sitemap**: Use **`vite-plugin-sitemap`**. It crawls your `dist` folder post-build and generates `sitemap.xml`.
*   **Open Graph (OG)**: In the build script, map Frontmatter (title, description, image) directly into `<meta>` tags in the generated `<head>`.
*   **RSS Feed**: Use the `feed` npm package. Add 10 lines to your build script to output `feed.xml` in `/public`. Essential for the "Cybersecurity" niche (OSINT/Infosec folks use RSS).

## 4. Minimum Working Example (MWE)

### Folder Structure
```text
/
├── scripts/
│   └── build-blog.mjs         # The "Engine"
├── security/
│   └── blog/
│       ├── template.html      # The Brutalist blog layout
│       └── posts/
│           └── 2026-04-12-zapora-ogniowa.md
├── src/
│   └── assets/
│       └── blog/
│           └── zapora/
│               └── diagram.png
└── package.json
```

### Example `.md` Format
```markdown
---
title: "Nowoczesne Zapory Ogniowe w 2026"
date: "2026-04-12"
excerpt: "Dlaczego tradycyjne firewall-e już nie wystarczają?"
image: "/assets/blog/zapora/cover.jpg"
tags: ["cybersecurity", "firewall", "ai"]
---

# Nowoczesne Zapory Ogniowe

Treść wpisu w języku polskim...

![Diagram](./diagram.png?as=webp)
```

### Build Workflow (Bash)
```bash
# 1. Install dependencies
npm install marked gray-matter vite-imagetools vite-plugin-sitemap --save-dev

# 2. Run build script before/during vite build
node scripts/build-blog.mjs && vite build
```

## 5. Final Recommendation

**The Winner**: **Custom Node Build Script (`marked` + `gray-matter`) generating static `.html` files.**

For a solo author doing 1-2 posts/week on a Vanilla Vite project, this provides the highest SEO value (true static HTML), zero runtime JS bloat, and allows you to keep your Obsidian Brutalist design exactly as you want it without fighting a framework's abstractions.
