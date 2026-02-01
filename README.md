# Antigravity AI

> **Intelligence as Architecture.**
> The autonomous layer for modern business.

A high-performance, design-forward landing page for a premier AI automation agency. Built with a "Brutalist Obsidian" aesthetic to convey authority, precision, and technological dominance.

---

## 🚀 Quick Start

Get the system online in < 2 minutes.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Access the portal
> Local: http://localhost:5173
```

---

## 🛠 Technology Stack

*   **Vite**: Next-generation frontend tooling.
*   **Vanilla JS**: Zero-framework approach for maximum performance and control.
*   **CSS Variables**: "Obsidian Fluid" theme engine.
*   **Canvas API**: Hardware-accelerated hero scroll animation.

---

## 🎨 Design System: "Obsidian Brutalist"

This project strictly adheres to the **Frontend Specialist** protocols.

### Core Principles
1.  **Strict Monochrome**: Black (`#000`), White (`#FFF`), and Greyscale. **No Purple.**
2.  **Brutalist Navigation**: Solid black backgrounds, sharp edges (`0px` border-radius), and raw 1px borders.
3.  **Intentional Glassmorphism**: Reserved *only* for the floating Context Nav to distinguish it as a HUD element. [See Architecture Reference].
4.  **Physics-Based Animation**: Scroll-linked animations using Canvas and `IntersectionObserver`.

### Layout Architecture
-   **Scroll-Driven Hero**: 400vh tall track driving a frame-by-frame canvas sequence.
-   **Horizontal Modules**: "Automation" and "Voice" sections use a horizontal scroll paradigm (Apple-style) instead of vertical stacking.
-   **Asymmetric Design**: Avoids standard 50/50 splits where possible.

---

## 📂 Project Structure

```text
├── main.js        # Core logic & HTML injection (Single Entry Point)
├── style.css      # "Obsidian" theme & Global Styles
├── index.html     # Minimal entry wrapper
├── images/        # Animation sequence frames (frame_000.jpg...)
└── package.json   # Dependencies (Vite)
```

> **Note**: The entire DOM structure is injected via `main.js`. This is a strict architectural choice to centralize logic and view for this specific landing page iteration.

---

## 🛡️ Security

*   **Injection Safe**: No external user input is rendered.
*   **Zero-Dependency Runtime**: No production dependencies, minimizing supply chain risk.

---

© 2026 Antigravity AI. All Systems Nominal.
