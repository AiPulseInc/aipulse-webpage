# Lighthouse / SEO Audit — aipulse.pl

**Data:** 2026-07-24
**Narzędzie:** Google Lighthouse (via Chrome DevTools MCP), tryb `navigation`, device `mobile` (mobile-first — tak jak indeksuje Google)
**Wersja strony w chwili audytu:** v0.585 (przed wdrożeniem fixów a11y/llms.txt)

## Wyniki

| Kategoria | `/` (landing) | `/business/` |
|---|---|---|
| SEO | **100** | **100** |
| Performance (CWV) | excellent | LCP 109 ms · CLS 0.00 · TTFB 2 ms |
| Accessibility | 96 | 92 |
| Best Practices | 77 | 100 |
| Agentic Browsing | 67 | 67 |

### Core Web Vitals (`/business/`, lab)
- **LCP:** 109 ms (próg "good" < 2.5 s) — render delay 68 ms dominuje, brak lazy-loadu na LCP
- **CLS:** 0.00
- **TTFB:** 2 ms
- **Field data (CrUX):** BRAK — za mało realnego ruchu, by Google miał dane page-experience.
  To jest sygnał rankingowy, którego jeszcze nie ma → problem ruchu, nie kodu.

## Znalezione problemy i status

| Problem | Strona | Status |
|---|---|---|
| Brak landmarka `<main>` | landing, business, security | ✅ naprawione (v0.586) |
| heading-order h2→h4 | business, security | ✅ naprawione — h4→h3 |
| color-contrast `#aaa` na jasnym tle (2.2:1) | business, security | ✅ naprawione → `#6b6b6b` |
| color-contrast `#666` na czarnym (3.65:1) | business (dev subtitle) | ✅ naprawione → `#b3b3b3` |
| color-contrast amber `#F5A623` na białym (2.02:1) | business | ⚠️ ŚWIADOMIE zostawione — kolor marki na dekoracyjnych labelach (eyebrow). Darkening zepsułby brand. |
| color-contrast `#ccc` module-label (1.6:1) | business | ⚠️ jw. — dekoracyjny kicker |
| third-party-cookies (`_GRECAPTCHA` / GA `G-G0G6W8Y1JK`) | landing | ⚠️ świadomie — to Google Analytics, nie defekt. Nie wpływa na SEO. |
| inspector-issues (pusty detail) | landing | ⚠️ pochodna deprecjacji 3rd-party cookies |
| llms.txt nie zgodny z rekomendacjami | wszystkie | ✅ dodany `public/llms.txt` (v0.586) |

## Wniosek

Technicznie SEO on-page = maksimum (100/100). Performance rewelacyjny.
Czego brakuje do realnego wpływu na ranking: **realnego ruchu** (dane CrUX).
Priorytet biznesowy = pozyskanie ruchu, nie dalsza optymalizacja techniczna.

## Jak powtórzyć audyt

Chrome DevTools MCP:
1. `navigate_page` → https://aipulse.pl/ (lub /business/)
2. `lighthouse_audit` device=mobile, mode=navigation (SEO/a11y/BP)
3. `performance_start_trace` reload=true (Core Web Vitals: LCP/CLS/INP)
