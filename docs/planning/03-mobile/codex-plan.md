**1. Audit Findings**

- **Shared responsive system**
  - `style.css:717`, `style.css:1130`, `style.css:1743`, `style.css:1794`, `style.css:1956`, `style.css:2119` are all `@media (max-width: 768px)`; there is no tablet layer for `768-1023px`, and `768px` is currently treated as mobile.
  - `style.css:97` gives `.container-fluid` `padding: 0 var(--spacing-m)`, while `--spacing-m: 2rem` is set at `style.css:13`; on a `375px` screen that leaves tight usable width before any inner padding.
  - `style.css:105` gives sections `padding: 5rem 0`, and `style.css:119` gives `.section-tall` `min-height: 90vh`; that creates too much vertical dead space on phones.
  - `style.css:1957` sets mobile `.grid-fluid` `gap: 10px`, but `style.css:2138` later sets mobile `.grid-fluid` `gap: 2rem`; the later block wins, so mobile spacing is currently controlled by cascade accident.
  - `style.css:108` hardcodes `scroll-margin-top: 78px`, which is fragile once the sticky nav changes height.

- **Landing chooser**
  - `index.html:25` uses a full-screen split chooser, but `style.css:529` sets `overflow: hidden` on `body` and `style.css:534` fixes the split to `height: 100vh`.
  - `style.css:640` hides `.landing-desc` until hover, and `style.css:659` hides `.landing-cta` until hover; mobile reveals them at `style.css:734`, but the page still keeps hover-era layout assumptions.
  - `style.css:680` keeps the overlay absolutely positioned at the top, and `style.css:698` keeps the footer absolutely positioned at the bottom.
  - `style.css:717` only changes the split to column and sets each half to `min-height: 50vh`; that is not enough for short phones once header/footer and safe areas are considered.

- **Business — Hero**
  - `business/index.html:43` uses the shared static hero, with CTA row inline at `business/index.html:56`.
  - `style.css:1679` makes the hero `min-height: calc(100vh - 65px)` and bottom-aligned; `style.css:1694` gives the text block `padding-bottom: 13rem`, `style.css:1695` gives it `padding-left: 80px`.
  - `style.css:1706` pushes the photo wrapper left with `margin-left: -100px`, and `style.css:1754` / `style.css:1756` enlarge the photo to `width: 132%` and `margin-right: -15%`.
  - The only phone-specific hero image rule is `style.css:1998` `max-width: 280px`; it does not reset the negative offsets or bottom-heavy layout.
  - `business/index.html:58` points to `#section-szkolenia`, but the actual IDs are `business/index.html:71` and `business/index.html:165`.

- **Business — Wdrażaj AI / Buduj z AI**
  - `business/index.html:71` and `business/index.html:165` are horizontal slider sections.
  - `style.css:2037` defines `.slider-track` as a horizontal flex row, `style.css:2046` makes every slide `min-width: 100%`, and `style.css:2051` places the contextual nav as a fixed bottom pill bar.
  - `style.css:1455` keeps compact module titles at `3.15rem`, `style.css:1459` keeps descriptions at `1.125rem`, and `style.css:1464` / `style.css:1469` keep visuals at `360px` tall.
  - `style.css:2119` stacks slides only for `<=768px` and hides the contextual bar at `style.css:2133`; tablet gets no dedicated behavior.

- **Business — Automatyzacje**
  - `business/index.html:283` uses a `col-5`/`col-7` split, and `business/index.html:298` adds inline `padding-left: 4rem`.
  - `style.css:956` sets `.academy-header` to `font-size: 4rem`; `style.css:964` sets `.academy-curriculum-box` `padding: 4rem`; `style.css:976` sets item titles to `1.5rem`.
  - On phones this section will stack because of `.grid-fluid`, but its typographic and spacing scale stays desktop-heavy.

- **Business — Narzędzia**
  - `business/index.html:324` uses a dark tool grid with 10 items.
  - `style.css:1802` sets `.tool-grid` to `repeat(5, 1fr)`; the only mobile change is `style.css:1969` `repeat(2, 1fr)`.
  - There is no tablet rule, so widths `768-1023px` still try to carry a 5-column desktop grid.

- **Business — O nas / testimonials**
  - `business/index.html:414` uses a 3-step process; `style.css:1937` keeps `.method-steps` at `repeat(3, 1fr)` until the phone rule at `style.css:1986`.
  - `business/index.html:437` uses an animated testimonial marquee.
  - `style.css:277` masks the marquee edges, `style.css:286` animates the track for `40s linear infinite`, and `style.css:298` makes each testimonial card `width: 400px`.
  - There is no testimonial-specific mobile treatment in any existing `@media` block.

- **Business — Strony WWW / contact / footer**
  - `business/index.html:617` uses a 5-card website mockup grid; `style.css:1844` makes it `repeat(5, 1fr)` and only `style.css:1982` changes it to `1fr` on phones.
  - `style.css:1018` gives the contact section `min-height: 65vh`; `business/index.html:661` and `business/index.html:668` add inline `padding: 2rem 4rem`.
  - `style.css:1905` keeps the form in 2 columns until `style.css:1990`, and `style.css:1048` keeps the footer in a single horizontal row with no mobile rule.

- **Security — Hero**
  - `security/index.html:45` reuses the same hero/photo structure as business, so it inherits the same negative-margin risk from `style.css:1706` and `style.css:1754`.
  - `security/index.html:46` adds the certificate strip as an absolutely positioned link.
  - `style.css:1718` places it at `bottom: 10.75rem`, `style.css:1719` at `right: 3rem`, and `style.css:1732` gives the image `width: 390px`.
  - The only mobile change is `style.css:1745` / `style.css:1749`, which moves it to `bottom: 1.5rem`, `right: 1.5rem`, `width: 240px`; it remains absolute and still competes with text/photo.

- **Security — Compliance**
  - `security/index.html:78` uses the same academy split pattern as business automations.
  - `security/index.html:96` also uses inline `padding-left: 4rem`.
  - It inherits the same large desktop type and padding from `style.css:956` and `style.css:964`.

- **Security — Szkolenia**
  - `security/index.html:122` is another slider section, image-first.
  - It shares the same slider architecture and current breakpoints as business via `style.css:2037`, `style.css:2051`, `style.css:2119`.
  - There are 4 slides, so the tablet gap is even more visible here.

- **Security — Proces + cert strip**
  - `security/index.html:269` uses 3 process columns; `security/index.html:291` adds a 2-column certificate strip.
  - `style.css:1073` sets `.cert-strip` to `1fr 1fr`, `style.css:1089` makes badges `80px x 80px`, and `style.css:1116` styles the “why it matters” callout.
  - `style.css:1130` only changes the strip to one column at `<=768px`; there is no tablet behavior.

- **Security — Dla kogo**
  - `security/index.html:332` uses a 5-card industry grid.
  - `style.css:1387` sets `.branze-grid` to `repeat(5, 1fr)`; `style.css:1973` changes it only to `repeat(2, 1fr)` for phones.
  - Tablet widths still get the full 5-column desktop density.

- **Security — Oferta / pricing**
  - `security/index.html:397` uses 4 pricing cards.
  - `style.css:1140` sets `.pricing-grid` to `repeat(4, 1fr)` with subgrid rows; `style.css:1153` uses compact card padding `1.65rem 1.45rem`.
  - `style.css:1197` keeps names at `1.15rem`, `style.css:1246` keeps description copy at `0.72rem`, and `style.css:1261` keeps CTAs at `0.65rem`.
  - `style.css:1977` only changes the pricing grid to `repeat(2, 1fr)` on phones; that is still too dense for `360-412px`.

- **Shared nav / modal behavior**
  - `style.css:516` makes the nav sticky with `padding: 1.5rem 2rem`; `style.css:776` sets the brand to `2.6rem`; `style.css:828` keeps links in one horizontal row with `gap: 2rem` and `font-size: 0.8rem`; there is no hamburger CSS.
  - `main.js:255` assumes links live inside `.site-nav-links`, so a mobile nav should preserve that DOM relationship.
  - `style.css:2149` and `style.css:2153` target `.blur-overlay` / `.modal-content`, but the actual modal is `.academy-modal-content` at `style.css:2184` and in `business/index.html:394`, `security/index.html:485`; mobile modal sizing is effectively missing.

**2. Breakpoint Strategy**

- Keep desktop as the default, untouched baseline: `>=1024px` continues to use current layout proportions and the current desktop overlap aesthetic.
- Introduce one shared structural layer at `@media (max-width: 1023px)` for anything that should change on both phones and tablets: nav mode, hero offsets reset, modal sizing, contact/footer stacking rules, certificate ribbon flow, and tablet-safe card widths.
- Introduce a tablet layer at `@media (min-width: 768px) and (max-width: 1023px)` for 2- and 3-column grids, a non-destructive hero split, and section-local slider navigation.
- Introduce a phone layer at `@media (max-width: 767px)` for single-column stacking, CTA/button stacking, slider flattening, testimonial swipe rails, and pricing ladder mode.
- Add a narrow-phone micro layer at `@media (max-width: 399px)` only for final polish: hero CTA spacing, certificate width cap, and card padding trims. This protects `360px` and `375px` without polluting larger breakpoints.
- Consolidate the six existing mobile blocks into one ordered responsive section near the end of `style.css`; move every current `max-width: 768px` rule to either `<=767px` or `<=1023px`.
- Add a small `prefers-reduced-motion` block to disable marquee/slider motion on small screens while preserving the brutalist aesthetic.

**3. Nav System**

- **HTML**
  - Add a `<button class="site-nav-toggle" aria-expanded="false" aria-controls="site-nav-menu">` to both `business/index.html:23` and `security/index.html:25`.
  - Keep the current `.site-nav-links` wrapper, but give it an `id="site-nav-menu"` so `main.js` can toggle it without breaking `main.js:255`.
  - Wrap the current hero CTA rows in a reusable class such as `.hero-actions` instead of inline `display:flex; gap:1rem` from `business/index.html:56` and `security/index.html:63`.
  - Optional cleanup: keep the version chip in the brand area on desktop, but hide or move it under the menu on phones.

- **CSS**
  - Desktop stays as-is by default.
  - At `<=1023px`, show the toggle, reduce nav padding, reduce brand size, and convert `.site-nav-links` from inline flex to a dropdown sheet below the sticky bar.
  - Use a full-width brutalist sheet: black background, white type, `1px` borders, accent underline/left rule for the active item, and generous tap targets.
  - Add `--nav-height` and set `scroll-margin-top` from it instead of the hardcoded `78px` at `style.css:108`.
  - Ensure the menu never creates horizontal overflow and respects safe areas.

- **JS (`main.js`)**
  - Add `initMobileNav()` alongside the existing DOM bootstrapping at `main.js:7`.
  - Toggle `aria-expanded`, a nav-open class on the `<nav>`, and optionally a `body.nav-open` helper class.
  - Close the menu on hash-link click, outside click, `Escape`, and breakpoint change back to desktop.
  - Measure `siteNav.offsetHeight` on load/resize and expose it as `--nav-height` so anchor scrolling and sticky section pills stay correct.
  - Keep the existing active-link observer in `main.js:255`; do not duplicate the links into a second mobile-only DOM tree.

**4. Landing Chooser Mobile**

- On tablets `768-1023px`, keep the 2-up split, but remove hover dependency: both halves stay at `50%`, descriptions and CTAs are always visible, and the divider becomes decorative rather than structural.
- On phones `<=767px`, convert the chooser into a vertical stack of two brutalist cards: top intro label, then business card, then security card, then footer. Body scrolling must be enabled.
- Make `body` scrollable by reversing `overflow: hidden` from `style.css:529`; convert the overlay and footer from absolute to normal flow for phones.
- Reduce logo scale from the current `clamp(3rem, 7vw, 6rem)` at `style.css:610` to a phone-safe fixed range, and trim the large empty panel space created by `min-height: 50vh` at `style.css:724`.
- Preserve the black/white/amber/violet look by keeping the radial glow overlays, uppercase logo, and hard borders; just make the layout card-based instead of hover-based.
- `index.html:59` uses `src/landing.js`, not `main.js`, so this can stay CSS-only except for the existing version injection.

**5. Business Page**

- **Hero — Current**
  - Bottom-weighted desktop hero with `padding-bottom: 13rem`, `padding-left: 80px`, `margin-left: -100px`, photo `width: 132%`, and a broken CTA target at `business/index.html:58`.
- **Hero — Proposed**
  - Tablet: keep a 6/6 split, but remove all negative offsets and fit the portrait inside a clean right-side frame.
  - Phone: copy first, framed portrait second, CTAs stacked full-width, no overlap. Keep the portrait masked and high-contrast, but treat it like a module instead of an offset canvas.
- **Hero — CSS changes needed**
  - Add `.hero-actions`; override `.hero-static`, `.hero-static .flex-center-v`, `.hero-photo-wrap`, `.hero-photo`, `.hero-subtitle`, and `.btn` at `<=1023px`; fix the hero CTA target in `business/index.html`.

- **`#section-szkolenia-zespoly` — Current**
  - 3-slide horizontal carousel with fixed bottom contextual nav, large module titles, and `360px` visuals.
- **`#section-szkolenia-zespoly` — Proposed**
  - Tablet: keep one-slide-at-a-time behavior, but move the pill nav directly under the section header and make it a sticky in-section chip row.
  - Phone: flatten the slider into 3 stacked training cards with image, copy, and CTAs in one readable flow; no fixed bottom pills.
- **`#section-szkolenia-zespoly` — CSS changes needed**
  - Move `#nav-szkolenia-zespoly` above the viewport in `business/index.html`; add tablet chip-row styling; at `<=767px` reset transforms, stack slides, reduce visual height to `220-260px`, reduce header padding from `style.css:1621`, and stack `.module-actions`.

- **`#section-szkolenia-dev` — Current**
  - Same slider mechanics as above, but with dark image-fill visuals and more visual-first content.
- **`#section-szkolenia-dev` — Proposed**
  - Tablet: keep slide logic, reduce image height, and preserve the dark immersive look without overflowing the viewport.
  - Phone: image first, then copy, then CTAs; each slide becomes a card in the page flow.
- **`#section-szkolenia-dev` — CSS changes needed**
  - Reuse the same slider breakpoint system; add phone-specific height rules for `.module-image-full` and `.visual-dark-bg`, and ensure dark cards keep white type and amber accents.

- **`#section-automatyzacje` — Current**
  - 5/7 split with inline `padding-left: 4rem`, `4rem` box padding, and `4rem` header size.
- **`#section-automatyzacje` — Proposed**
  - Tablet: 6/6 split with tighter spacing and a smaller curriculum box.
  - Phone: copy block first, then a stacked list of tappable platform cards; modal behavior remains, but the section reads like a mobile card list instead of a desktop split.
- **`#section-automatyzacje` — CSS changes needed**
  - Replace inline spacing with reusable classes, shrink `.academy-header`, shrink `.academy-curriculum-box`, and create a shared `.academy-layout` responsive pattern used on both pages.

- **`#section-narzedzia` — Current**
  - 5-column tool grid with only a phone `2-column` fallback.
- **`#section-narzedzia` — Proposed**
  - Tablet: 3-column grid.
  - Phone: 1-column media-object list with icon left and content right; the CTA drops below the intro copy.
- **`#section-narzedzia` — CSS changes needed**
  - Add tablet `repeat(3, 1fr)` and phone `1fr`; convert `.tool-card` to a small two-column internal layout on phones; trim card padding and gaps.

- **`#section-o-nas` — Current**
  - 3 process columns plus a 400px-card animated marquee with duplicated testimonials.
- **`#section-o-nas` — Proposed**
  - Keep the 3-step process visually strong; on phone it becomes a vertical sequence of numbered brutalist cards.
  - Replace the marquee on `<=1023px` with a swipeable horizontal rail or manually scrollable snap list. Hide the duplicated testimonial set on non-desktop.
- **`#section-o-nas` — CSS changes needed**
  - Add `scroll-snap-type`, remove `animation`, remove mask fades on small screens, change card width from `400px` to roughly `280-320px`, and mark the duplicate testimonial batch as hidden on small screens in `business/index.html`.

- **`#section-strony` — Current**
  - 5-column mockup grid that jumps straight to `1fr` on phones.
- **`#section-strony` — Proposed**
  - Tablet: 2-column showcase grid.
  - Phone: single-column stack with slightly taller cards and always-readable overlays.
- **`#section-strony` — CSS changes needed**
  - Add tablet `repeat(2, 1fr)`; keep phone `1fr`; adjust `aspect-ratio` and overlay padding for narrow screens.

- **`#contact` / footer — Current**
  - 2-column contact with large inline paddings and a footer that stays horizontal.
- **`#contact` / footer — Proposed**
  - Tablet: keep 2 columns with reduced gutters.
  - Phone: one-column contact, copy first, form second, footer stacked and left-aligned.
- **`#contact` / footer — CSS changes needed**
  - Move inline spacing to classes, reduce `min-height`, stack `.footer-inner`, and ensure forms/buttons fill width cleanly.

**6. Security Page**

- **Hero — Current**
  - Same shared overlap-prone hero plus an absolute certificate ribbon at `390px` wide.
- **Hero — Proposed**
  - Tablet: clean 6/6 split with the certificate ribbon flowing below the CTAs instead of floating over the hero.
  - Phone: copy, CTAs, then an inline certificate strip card, then portrait. No absolute overlap.
- **Hero — CSS changes needed**
  - Reuse business hero fixes; move `.hero-certificates-link` from absolute to in-flow at `<=1023px`; cap the ribbon to `min(100%, 320px)` on phones.

- **`#section-compliance` — Current**
  - Same academy split and spacing problems as business automations.
- **`#section-compliance` — Proposed**
  - Tablet: cleaner 6/6 split with reduced padding.
  - Phone: intro copy followed by 3 tappable compliance cards in a stacked list.
- **`#section-compliance` — CSS changes needed**
  - Reuse the shared academy responsive classes; remove inline left padding from `security/index.html:96`.

- **`#section-szkolenia-security` — Current**
  - 4-slide image-first carousel with the same fixed bottom nav and no tablet-specific layout.
- **`#section-szkolenia-security` — Proposed**
  - Tablet: one-slide-at-a-time with sticky local chips under the section header.
  - Phone: 4 stacked security-training cards with image first, then copy, then CTAs.
- **`#section-szkolenia-security` — CSS changes needed**
  - Same slider/nav system as business, plus image-height caps tuned for the security visuals.

- **`#section-proces` — Current**
  - 3 process columns followed by a 2-column cert strip; only phones get a cert-strip stack.
- **`#section-proces` — Proposed**
  - Tablet: keep the 3-step row if it still reads cleanly, but collapse the cert strip to one column for clarity.
  - Phone: stacked steps plus stacked cert cards with smaller badges and stronger internal spacing.
- **`#section-proces` — CSS changes needed**
  - Add `<=1023px` cert-strip stacking, reduce badge size from `80px`, and rebalance card spacing.

- **`#section-dla-kogo` — Current**
  - 5-column industry grid with only a phone `2-column` fallback.
- **`#section-dla-kogo` — Proposed**
  - Tablet: 2 columns.
  - Phone: 1 column with shorter vertical spacing and tighter point lists.
- **`#section-dla-kogo` — CSS changes needed**
  - Add tablet `repeat(2, 1fr)` and phone `1fr`; trim card padding and copy spacing.

- **`#section-oferta` — Current**
  - Desktop-optimized 4-card railway with tiny card copy and only a phone `2-column` fallback.
- **`#section-oferta` — Proposed**
  - Tablet: a 2-row layout where `Samoocena` spans full width on top, `Basic` and `Rozszerzony` sit beneath, and `Premium` spans full width below or sits as the fourth card depending visual balance.
  - Phone: radical reorg into a vertical audit ladder: `Samoocena` intro card first, then `Basic`, `Rozszerzony`, `Premium` stacked in maturity order. `Basic` remains highlighted.
  - Desktop: preserve the current 4-up railway.
- **`#section-oferta` — CSS changes needed**
  - Disable subgrid at `<=1023px`; use explicit card ordering/classes; enlarge name/desc/CTA typography; move the badge into normal flow on mobile/tablet; remove min-height assumptions.
  - Add modifier classes in `security/index.html` so mobile ordering and spanning are predictable without affecting desktop.

- **`#contact` / footer — Current**
  - Same large inline paddings and horizontal footer as business.
- **`#contact` / footer — Proposed**
  - Same responsive pattern as business: tighter tablet gutters, one-column phone contact, stacked footer.
- **`#contact` / footer — CSS changes needed**
  - Reuse the same shared contact/footer responsive rules and remove inline spacing.

**7. Typography Scale**

- Keep `1rem` base body text across breakpoints; change scale through component tokens, not global zooming.
- Suggested responsive values:
  - `Meta / labels / nav microcopy`: `0.6875rem` phone, `0.75rem` tablet, `0.75-0.8rem` desktop.
  - `Body copy`: `0.95rem` phone, `1rem` tablet, `1rem` desktop.
  - `Lead / subtitle`: `1rem` phone, `1.125rem` tablet, `1.25rem` desktop.
  - `Card / small section titles`: `1.125rem` phone, `1.25rem` tablet, `1.5rem` desktop.
  - `Section h2`: `2rem` phone, `2.5rem` tablet, `3rem` desktop.
  - `Module titles`: `2.25rem` phone, `2.75rem` tablet, `3.15rem` desktop.
  - `Hero h1`: `2.5rem` phone, `3.5rem` tablet, current desktop clamp preserved.
- Keep title line-height near `1`, body line-height near `1.5-1.6`, and keep uppercase/monospace micro-labels to preserve the brutalist system.

**8. Image Strategy**

- **Hero portrait**
  - Source: `public/MK_3.1.png` is `2328x2048`.
  - Generate responsive variants at roughly `768w`, `1200w`, `1800w`, plus original fallback.
  - Use `sizes="(max-width: 767px) 88vw, (max-width: 1023px) 46vw, 42vw"` and add width/height attributes to stabilize layout.

- **Training visuals**
  - Sources in `public/generated/szkolenia/*.jpg` are `1408x768`.
  - Generate `480w`, `768w`, `1200w`.
  - Use `sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 58vw"` and keep them `loading="lazy"`.

- **Mockups**
  - Sources in `public/generated/strony/*.jpg` are also `1408x768`.
  - Reuse the same `480/768/1200` set.
  - Use `sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 20vw"`.

- **Hero cert strip**
  - Source: `public/certificates.png` is `1292x430`.
  - Generate `320w`, `480w`, `720w`, `960w`.
  - Use `sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) 320px, 390px"`.

- **Cert badges**
  - `public/security+.png` is large enough for `80w`, `120w`, `160w` variants.
  - `public/dekra.png` is already narrow; prioritize optimization and explicit dimensions over multiple variants unless higher-res source exists.

- If variants are added, generate them with a repeatable asset step, not manual exports.

**9. Implementation Phases**

- **Commit 1 — responsive foundation**
  - What: consolidate breakpoints, add shared spacing/type tokens, introduce `--nav-height`, fix the modal class mismatch, and move layout-critical inline spacing into reusable classes.
  - Files: `style.css`, `business/index.html`, `security/index.html`.
  - Verify: at `1024px` desktop looks unchanged; at `375px` there is no horizontal scroll; the shared modal fits within the viewport.

- **Commit 2 — mobile nav + shared hero**
  - What: add hamburger nav, nav JS, anchor-safe offsets, hero action wrappers, and hero responsive layout rules; fix the broken business hero CTA target.
  - Files: `business/index.html`, `security/index.html`, `style.css`, `main.js`.
  - Verify: nav opens/closes via button, closes on hash-link click and `Escape`, and hero photo/text never overlap at `375px` or `834px`.

- **Commit 3 — landing + shared slider system**
  - What: rebuild the landing chooser for phone/tablet, move contextual slider nav markup above each slider, add tablet chip-row behavior, and make phone sliders flatten into stacked cards.
  - Files: `index.html`, `src/landing.js`, `business/index.html`, `security/index.html`, `style.css`, `main.js`.
  - Verify: landing works at `360px` and `768px`; slider sections behave as stack-on-phone and pills-on-tablet; resizing from desktop to phone clears stale slider transforms.

- **Commit 4 — business page sections**
  - What: finish responsive rules for automations, tools, testimonials, websites, contact, and footer.
  - Files: `business/index.html`, `style.css`.
  - Verify: tools become `1-col` phone / `3-col` tablet, testimonials become swipeable on small screens, websites become `1-col` phone / `2-col` tablet, and contact/footer stack cleanly.

- **Commit 5 — security page sections + pricing reorg + image rollout**
  - What: adapt security hero cert ribbon, compliance, training, process/cert cards, industries, and pricing ladder; add `srcset`/`sizes` to hero/training/mockup/cert images.
  - Files: `security/index.html`, `business/index.html`, `style.css`, plus responsive image assets in `public/` if generated.
  - Verify: pricing is readable at `375px`, cert ribbon is in-flow on small screens, cert strip is legible at `768px`, and desktop pricing stays 4-up at `1024px+`.

**10. Testing Plan**

- **360px**
  - Verify no horizontal scroll, nav sheet fits, hero CTAs stack, pricing is single-column, contact form is single-column, and modal padding is usable.

- **375px**
  - Verify brutalist feel survives: black background, white type, accent borders, readable hero, in-flow security cert ribbon, and testimonial swipe rail feels intentional.

- **393px**
  - Verify badge/CTA wrapping in pricing cards, nav toggle spacing, and section headers do not clip.

- **412px**
  - Verify tool cards, automation/compliance lists, and phone CTA stacks do not look under-filled or overly stretched.

- **768px**
  - Verify tablet rules activate instead of phone rules: hamburger still present, grids become `2-3` columns, pricing uses tablet layout, and slider chips are usable.

- **834px**
  - Verify iPad portrait comfort: hero split is balanced, industry grid is readable, website grid is `2-col`, and cert/process sections do not feel phone-stacked.

- **1024px**
  - Verify desktop regression boundary: no hamburger, hero overlap aesthetic is preserved, pricing returns to 4-up desktop, testimonial marquee animation remains desktop-only, and fixed contextual nav remains desktop-safe.

- **Behavior checks at every width**
  - Test hash-link scrolling, active nav highlighting, modal open/close, resize from desktop to phone and back, keyboard `Escape`, and reduced-motion fallback.

**11. CSS Size Impact Estimate**

- Expect gross CSS growth of roughly `+300` to `+380` lines because this plan adds true tablet layouts, nav states, hero resets, pricing reflow, and small-screen component variants.
- Consolidating the six scattered `max-width: 768px` blocks and removing obsolete modal/mobile rules should claw back roughly `60-100` lines.
- Realistic net result: about `+220` to `+280` lines, roughly `+8KB` to `+11KB` unminified, with a much cleaner responsive architecture and lower future maintenance cost.