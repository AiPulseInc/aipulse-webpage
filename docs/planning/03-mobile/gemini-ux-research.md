# Mobile UX Research: B2B Conversion-Focused Site (Polish SMB Context)

## 1. Target Devices + Breakpoints
Polish SMB decision-makers (owners/CEOs) often consume B2B content in "micro-moments" between meetings or during commutes. 
- **Core Breakpoints:** 
    - **360px:** Base for older Android/small devices.
    - **393px:** iPhone 14/15/16 Pro (current standard).
    - **768px:** iPad/Tablet portrait (often where desktop grids fail most).
- **Strategy:** **Mobile-First Re-architecture.** For a brutalist site relying on "boldness," progressive adaptation usually results in "shrunken desktop" syndrome. You must design the 393px experience as the primary vessel for the CTA.

## 2. Nav Patterns for Multi-Section Landing
- **The "Brutalist" Drawer:** A full-screen overlay menu triggered by a hamburger. In a brutalist context, use a **2px solid border** for the drawer and high-contrast typography (all-caps).
- **Sticky Header:** Mandatory. Should contain only: Logo, "Kontakt" (Primary CTA), and Hamburger. 
- **Floating Action Button (FAB):** For the Polish market, a "Zadzwoń teraz" (Call now) or "WhatsApp" floating button is highly effective for the 5-50 person company tier, where owners prefer immediate verbal contact over forms.

## 3. Hero Section on Mobile
- **Visual Priority:** Drop the background photo if it compromises text legibility or pushes the H1 below the fold. 
- **Typography Scaling:** 
    - Desktop 4rem → **Mobile 2.25rem - 2.5rem**. Use `clamp()` for fluid scaling.
- **CTA Stacking:** 100% width buttons. Primary (Amber/Violet) on top, Secondary (Outline) below. 
- **The "Fold" Rule:** The "Consultation" CTA must be visible without scrolling on an iPhone SE.

## 4. Content Section Patterns
- **Grids to Lists:** 
    - **Toolbox (5x2 grid):** Switch to a **horizontal swipeable container** with a "scroll indicator" (e.g., "Przesuń →"). Do not stack 10 items vertically; it kills the "toolbox" feel.
    - **Automatyzacje (3 tiles):** Stack vertically with 100% width.
- **Pricing Cards (4 cards):** Use a **horizontal card slider** (Snap-point scrolling). A vertical stack of 4 pricing cards creates "scroll fatigue," making users lose the context of the first tier by the time they reach the fourth.
- **Testimonials:** Replace the marquee with a **single, high-impact quote card** that allows manual swiping. Auto-scrolling text on mobile is often too fast/slow for varying reading speeds in outdoor lighting.

## 5. Forms on Mobile
- **Input Design:** Large tap targets (min 48px height). Use `inputmode` attributes (e.g., `inputmode="tel"` for phone numbers) to trigger the correct native keyboard.
- **RODO/Consent:** Use a custom-styled checkbox (large target) but keep the text small (12px). Avoid "Select All" if not legally required; keep it to a single "Akceptuję politykę prywatności."
- **Sticky Submit:** Consider making the "Wyślij zapytanie" button sticky at the bottom of the screen only when the user is within the form viewport.

## 6. Typography System for Mobile
- **Base Size:** **16px** (iOS default to prevent auto-zoom on inputs). 
- **Line-Height:** Increase body text to **1.6** for mobile. Small screens require more "breathing room" between lines to prevent eye strain.
- **Brutalist Twist:** Use **negative letter-spacing (-0.02em)** for large headers to maintain the "dense/raw" Obsidian look on narrow screens, but keep body text at `normal` or `0.01em`.

## 7. Imagery Strategy
- **LCP Optimization:** Use WebP with `<picture>` tags.
- **Aspect Ratios:** Force `aspect-ratio: 16/9` or `1/1` on mobile placeholders to prevent **Cumulative Layout Shift (CLS)** as images load over Polish 4G/LTE.
- **Iconography:** Use SVGs for the "Toolbox" icons. Raster icons look blurry on high-DPI mobile screens (Retina).

## 8. Performance on Mobile
- **LCP Target:** <1.8s. 
- **Font Strategy:** Use `font-display: swap`. Since the brutalist look depends on specific fonts (Mono/Bold Sans), ensure the fallback system font is similar in width to avoid "layout jump."
- **JS Minimization:** Since you are on Vanilla JS, avoid heavy animation libraries (GSAP). Stick to CSS Transitions/Intersections for the "fade-in" effects.

## 9. Conversion Patterns (Polish B2B)
- **Trust Placement:** Move the "Certyfikaty/Logotypy" (Certs/Logos) directly **below the Hero CTA** but **above the first content section**. In Polish B2B, "Who else trusts you?" is the first question asked after "What do you do?".
- **Language:** For SMB owners (5-250 range), use **"Państwo" / "Twoja Firma"**. Avoid the overly casual "Ty" unless the sub-niche is purely creative/startup. 
- **CTA Copy:** Use "Bezpłatna Konsultacja" (Free Consultation) instead of "Kontakt." It implies value rather than a sales pitch.

## 10. Accessibility on Mobile
- **Contrast:** Ensure Amber/Violet on Black meets **WCAG AA (4.5:1)**. Violet often fails this on mobile screens at low brightness; you may need a "Mobile-Bright" variant of the violet.
- **Touch Targets:** 44px is the Apple standard, but **48px x 48px** (Google/Android) is safer for "fat-finger" navigation while walking.

## 11. Brutalist Aesthetic on Mobile
- **Preserve the "Rawness":** Do not use rounded corners (border-radius: 0). 
- **The "Grid" Illusion:** Use **solid 1px or 2px white borders** to separate sections instead of background color changes. This maintains the Obsidian/Brutalist feel without adding visual weight.
- **Typography-First:** Let the H1 take up 40% of the initial screen height. Brutalism is about "shouting," and on mobile, that means size.

## 12. Anti-patterns to Avoid
- **The "Ghost" Button:** Avoid outline buttons for primary CTAs. On mobile screens with glare, they disappear. Use solid fills.
- **Multi-step Forms:** Do not use them unless the form has >5 fields. For a simple B2B lead, a single-page flow is always higher-converting.
- **Hidden Trust Signals:** Never put certifications or "DEKRA" logos in a carousel that requires swiping to see. They must be static and visible.
