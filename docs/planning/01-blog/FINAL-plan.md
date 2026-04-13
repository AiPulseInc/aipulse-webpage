# FINAL Plan — Security Blog

Synteza `gemini-research.md` + `codex-plan.md`. Rekomendacja: **Custom Node build script + Vite MPA**.

## Porównanie Gemini vs Codex

| Aspekt | Gemini | Codex | Winner |
|---|---|---|---|
| Rekomendacja ogólna | Custom build script `marked` + `gray-matter` | Custom build script `markdown-it` + `gray-matter` | **Codex** — bogatszy ekosystem pluginów (`markdown-it-anchor` dla TOC/anchors, `markdown-it-attrs` dla klas) |
| Obrazy — lib | `vite-imagetools` (query strings) | `sharp` native (hash naming) | **Codex** — więcej kontroli, deterministyczne nazwy z hashem, lepiej dla Vercel cache |
| URL structure | `/security/blog/[slug]/` ✓ | `/security/blog/<slug>/index.html` ✓ | **Tie** — same approach |
| Dev workflow | Brak watchera | Vite plugin z watcherem → hot reload | **Codex** — writing → save → browser refresh |
| Entry JS | Sugeruje shared `main.js` | Osobny `src/security-blog.js` | **Codex** — mniejszy bundle dla bloga |
| Sitemap | `vite-plugin-sitemap` | Nie wspomniane | **Gemini** — bezpłatny SEO boost, dodać |
| RSS feed | `feed` package | Nie wspomniane | **Gemini** — wartościowe dla cyber audience |
| Przykładowy post | Jeden krótki | Pełny markdown post + 7-krokowa NIS2 checklista | **Codex** — od razu usable content |

## Decyzja

**Plan bazowy: Codex (22KB)** — structuralnie kompletny, ready-to-implement.

**Dodajmy z Gemini**:
- `vite-plugin-sitemap` w Phase 2 (po v1)
- RSS feed gen (prosty fragment w build-security-blog.mjs, użyj `feed` package)

## Stack końcowy

```bash
npm i -D \
  gray-matter@4.0.3 \
  markdown-it@14.1.1 \
  markdown-it-anchor@9.2.0 \
  markdown-it-attrs@4.3.1 \
  slugify@1.6.9 \
  sharp@0.34.5 \
  globby@14.0.2 \
  feed@4.2.2 \
  vite-plugin-sitemap@0.9.0
```

## Struktura folderów

```
aipulse-webpage/
├── content/security/blog/<slug>/
│   ├── index.md
│   └── images/
├── scripts/build-security-blog.mjs       # NOT execution/ — zgodność z istniejącym scripts/
├── src/
│   ├── security-blog.js
│   └── security-blog.css
├── security/blog/
│   ├── index.html            # generated
│   └── <slug>/index.html     # generated
└── public/generated/security/blog/<slug>/*.webp  # generated
```

> **Korekta wobec Codex plan**: Codex proponuje `execution/build-security-blog.mjs`, ale repo już ma `scripts/` (z `generate-images.mjs`, `generate-security-images.mjs`) i `package.json` wskazuje `"generate-images": "node scripts/generate-images.mjs"`. Używamy istniejącego `scripts/`, nie tworzymy nowego `execution/`.

## Fazy implementacji (streszczenie Codex step-by-step)

1. **Setup** — deps w package.json, utworzenie content/, przykładowy post
2. **Generator** — build-security-blog.mjs: scan + walidacja + render MD→HTML + image pipeline (sharp)
3. **Templates** — renderBlogIndex(posts) + renderBlogPost(post)
4. **Vite config** — async + dynamiczne inputy z globby + watcher plugin
5. **Styling** — src/security-blog.css, wszystkie klasy z prefiksem `.blog-*`
6. **Nav link** — dodać `Blog` do security nav + footer
7. **SEO extras** — sitemap plugin + RSS feed w generatorze
8. **Test build + deploy**

Całość: **~16 kroków** w Codex planie, do zrobienia jednym/dwoma większymi commitami.

## Decyzje (zaakceptowane 2026-04-13)

1. ✅ **Sitemap + RSS od razu (v1)** — `vite-plugin-sitemap` + `feed@4.2.2`, RSS endpoint `/security/blog/feed.xml`
2. ✅ **Bez komentarzy** — blog jest edukacyjny, nie community
3. ✅ **Start z 5 postami testowymi** — Gemini przygotuje drafty (Mity/Supply Chain npm/AI Phishing/Backup 3-2-1/Ubezpieczenia Cyber)
4. ✅ **Newsletter CTA** — wpięty w Task 2 Resend pipeline, prosty email capture pod każdym postem
5. ✅ **Draft workflow** — `draft: true` w front-matter, flow: piszę → commit draft → Twój review → flip → deploy
6. ✅ **Nav = pełny spójny z absolutnymi URL-ami** — 7 linków security nav + `Blog` (8-my), na stronie bloga link `Blog` ma `aria-current="page"` + `.nav-active` wstrzykiwane przez generator. Industry standard (Cloudflare/Vercel pattern). Hash-linki typu `/security/#section-oferta` navigate-to-page + scroll działają natywnie.

## Ryzyka (per Codex)

- Hardcoded inputy w `vite.config.js:10` nie widzą nowych postów → MUSIMY użyć dynamicznego globby
- Kolejność builda (generator PRZED rollupOptions.input)
- Asset URLs — używać root-absolute `/generated/...`, nie `../`
- `public/` omija Vite hashing → dlatego generator sam dodaje hash do nazw obrazków

## Luki do dopięcia przy implementacji (nie w oryginalnym Codex)

1. **`nav-active` na stronach bloga** — `main.js:255` IntersectionObserver pracuje na `#section-*` w bieżącej stronie. Na `/security/blog/` ani `/security/blog/<slug>/` nie ma takich sekcji, więc żaden link nie będzie podświetlony. Generator musi wypalać `class="nav-active"` na linku `Blog` w HTML (server-side), bez liczenia na JS.
2. **Cross-page anchor links** — Codex plan prawidłowo używa absolutnych URL-i typu `/security/#section-oferta` w nav bloga (nie `#section-oferta`), bo te sekcje nie istnieją na stronie bloga. Potwierdzam.
3. **Shared footer** — security page ma `<footer class="site-footer">` ze statycznym HTML; dla bloga trzeba wygenerować identyczny footer w każdej stronie (nie ma include'ów w Vite MPA). Rozwiązanie: funkcja `renderFooter()` w generatorze.
4. **Version badge** — na stronach bloga `#app-version` też powinien być wstrzyknięty (reuse `src/version.js` + DOMContentLoaded pattern z `src/landing.js`).
5. **Slug dopasowany do nazwy folderu** — Codex już o tym mówi, warto dodać że build powinien faktycznie failować (exit 1), nie tylko `console.warn`, żeby CI wychwytywał to wcześnie.
