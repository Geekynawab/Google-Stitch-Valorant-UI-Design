# KnivesFactory Stitch Shopify Theme — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Valorant-themed Shopify theme from scratch using Google Stitch project #2 designs, push to `ckk43q-vx.myshopify.com` as an unpublished parallel theme.

**Architecture:** Stitch MCP generates HTML screens → HTML is converted to Shopify Liquid sections with real data bindings and `{% schema %}` blocks → assembled into Shopify 2.0 JSON templates → pushed via Shopify CLI. CSS design tokens live in `assets/theme.css` as CSS custom properties; no Tailwind CDN in production.

**Tech Stack:** Shopify Liquid 2.0, CSS custom properties, vanilla JS, Google Stitch MCP (`mcp__stitch__*`), Shopify CLI (`shopify theme push`), Git

**Stitch project ID:** `3118771630089350558`
**Existing home screen ID:** `0514d3c8fa8041a69c0014675158b9af`
**Deploy store:** `ckk43q-vx.myshopify.com`
**GitHub remote:** `https://github.com/Geekynawab/Google-Stitch-Valorant-UI-Design.git`

---

## File Map

| File | Responsibility |
|------|---------------|
| `assets/theme.css` | CSS custom properties, clip-paths, typography, component classes |
| `assets/theme.js` | Sticky header, cart drawer toggle, quantity stepper |
| `layout/theme.liquid` | Root HTML shell: loads fonts, CSS, JS; renders header/content/footer |
| `config/settings_schema.json` | Theme editor settings definitions |
| `config/settings_data.json` | Default values for theme settings |
| `locales/en.default.json` | String translations |
| `sections/announcement-bar.liquid` | Top banner with message + link |
| `sections/header.liquid` | Sticky nav: logo, links, cart icon |
| `sections/footer.liquid` | Brand tagline, nav links, disclaimer |
| `sections/hero-banner.liquid` | Full-screen hero: headline, subtext, CTAs, bg image |
| `sections/category-grid.liquid` | 4-col tactical-cut category cards |
| `sections/featured-products.liquid` | Bestsellers grid with HUD hover overlay |
| `sections/trust-bar.liquid` | 4 trust signal icons |
| `sections/main-product.liquid` | Product detail: gallery, specs, Add to Cart, related products |
| `sections/main-collection.liquid` | Paginated product grid with collection header |
| `sections/main-cart.liquid` | Line items, quantity controls, subtotal, checkout CTA |
| `sections/main-about.liquid` | Brand story, imagery, Riot disclaimer |
| `snippets/product-card.liquid` | Reusable product card with HUD hover |
| `snippets/price.liquid` | Price display with compare-at |
| `templates/index.json` | Home page section assignments |
| `templates/product.json` | Product page section assignments |
| `templates/collection.json` | Collection page section assignments |
| `templates/cart.json` | Cart page section assignments |
| `templates/page.about.json` | About page section assignments |

---

## Task 1: Scaffold theme structure

**Files:**
- Create: all directories and placeholder files listed in the file map above

- [ ] **Step 1: Create directory structure and all files**

```bash
cd /c/Users/Sanketh/Valorant_stitch_inspired

mkdir -p assets config layout locales sections snippets templates

# Create all files
touch assets/theme.css assets/theme.js
touch layout/theme.liquid
touch config/settings_schema.json config/settings_data.json
touch locales/en.default.json
touch sections/announcement-bar.liquid sections/header.liquid sections/footer.liquid
touch sections/hero-banner.liquid sections/category-grid.liquid
touch sections/featured-products.liquid sections/trust-bar.liquid
touch sections/main-product.liquid sections/main-collection.liquid
touch sections/main-cart.liquid sections/main-about.liquid
touch snippets/product-card.liquid snippets/price.liquid
touch templates/index.json templates/product.json templates/collection.json
touch templates/cart.json templates/page.about.json
```

- [ ] **Step 2: Write `locales/en.default.json`**

```json
{
  "general": {
    "add_to_cart": "ADD TO LOADOUT",
    "sold_out": "OUT OF STOCK",
    "unavailable": "UNAVAILABLE",
    "view_all": "VIEW ALL",
    "quantity": "QTY",
    "remove": "REMOVE",
    "subtotal": "SUBTOTAL",
    "checkout": "PROCEED TO CHECKOUT",
    "continue_shopping": "CONTINUE SHOPPING",
    "free_shipping_threshold": "FREE SHIPPING OVER $75"
  },
  "products": {
    "product": {
      "quantity": {
        "label": "Quantity"
      }
    }
  }
}
```

- [ ] **Step 3: Commit scaffold**

```bash
git add -A
git commit -m "feat: scaffold Shopify theme structure"
```

---

## Task 2: CSS design tokens and utilities

**Files:**
- Modify: `assets/theme.css`

- [ ] **Step 1: Write full `assets/theme.css`**

```css
/* ============================================================
   DESIGN TOKENS — KnivesFactory Stitch Theme
   Source: Stitch project 3118771630089350558
   ============================================================ */

:root {
  /* Surfaces */
  --color-surface:              #0a141e;
  --color-surface-dim:          #0a141e;
  --color-surface-container-lowest: #050f19;
  --color-surface-container-low:    #121c27;
  --color-surface-container:        #17202b;
  --color-surface-container-high:   #212b35;
  --color-surface-container-highest:#2c3641;
  --color-surface-bright:           #303a45;
  --color-surface-variant:          #2c3641;

  /* Brand */
  --color-primary:              #ff5262;
  --color-primary-container:    #ff5262;
  --color-on-primary:           #680016;
  --color-on-primary-container: #5b0012;

  /* Text */
  --color-on-surface:           #d9e3f2;
  --color-on-surface-variant:   #e3bebd;
  --color-outline:              #aa8988;
  --color-outline-variant:      #5b4040;

  /* Accent */
  --color-error:                #ffb4ab;

  /* Typography */
  --font-headline: 'Space Grotesk', sans-serif;
  --font-body:     'Inter', sans-serif;

  /* Spacing */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
}

/* ============================================================
   RESET & BASE
   ============================================================ */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; }

body {
  background-color: var(--color-surface);
  color: var(--color-on-surface);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: inherit; border: none; background: none; }

/* ============================================================
   TYPOGRAPHY
   ============================================================ */

.font-headline {
  font-family: var(--font-headline);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-headline);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--color-on-surface);
}

h1 { font-size: clamp(3rem, 8vw, 6rem); font-style: italic; }
h2 { font-size: clamp(2rem, 5vw, 3.5rem); font-style: italic; }
h3 { font-size: clamp(1.25rem, 3vw, 2rem); }
h4 { font-size: 1.25rem; }

p {
  font-family: var(--font-body);
  line-height: 1.6;
  color: var(--color-on-surface-variant);
}

.label {
  font-family: var(--font-headline);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3em;
}

/* ============================================================
   LAYOUT
   ============================================================ */

.container {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

@media (min-width: 768px) {
  .container { padding: 0 var(--space-12); }
}

.section { padding: var(--space-24) 0; }

/* ============================================================
   CLIP-PATH UTILITIES
   ============================================================ */

.tactical-cut {
  clip-path: polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%);
}

.btn-clip {
  clip-path: polygon(0 0, 100% 0, 100% 75%, 92% 100%, 0 100%);
}

/* ============================================================
   BACKGROUND TEXTURES
   ============================================================ */

.bg-grid {
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 82, 98, 0.05) 1px, transparent 0);
  background-size: 40px 40px;
}

/* ============================================================
   BUTTONS
   ============================================================ */

.btn-primary {
  display: inline-block;
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  font-family: var(--font-headline);
  font-weight: 900;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 1.25rem 2.5rem;
  clip-path: polygon(0 0, 100% 0, 100% 75%, 92% 100%, 0 100%);
  transition: filter 0.15s ease;
  border: none;
  cursor: pointer;
}

.btn-primary:hover { filter: brightness(1.1); }
.btn-primary:active { transform: translateY(1px); }

.btn-secondary {
  display: inline-block;
  background: transparent;
  color: var(--color-on-surface);
  font-family: var(--font-headline);
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 1.25rem 2.5rem;
  border: 2px solid rgba(255,255,255,0.2);
  transition: border-color 0.15s ease, background 0.15s ease;
  cursor: pointer;
}

.btn-secondary:hover {
  border-color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.05);
}

/* ============================================================
   ANNOUNCEMENT BAR
   ============================================================ */

.announcement-bar {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  text-align: center;
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

/* ============================================================
   HEADER
   ============================================================ */

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-surface);
  border-bottom: 2px solid var(--color-surface-container-low);
  transition: background-color 0.2s ease;
}

.site-header.scrolled {
  background-color: rgba(10, 20, 30, 0.9);
  backdrop-filter: blur(20px);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  max-width: 1920px;
  margin: 0 auto;
}

.site-header__logo {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 900;
  font-style: italic;
  color: var(--color-primary);
  letter-spacing: -0.02em;
}

.site-header__nav {
  display: flex;
  gap: var(--space-8);
  list-style: none;
}

.site-header__nav a {
  font-family: var(--font-headline);
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(217,227,242,0.7);
  transition: color 0.15s ease;
}

.site-header__nav a:hover,
.site-header__nav a.active {
  color: var(--color-primary);
}

.site-header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.site-header__cart-icon {
  position: relative;
  color: rgba(217,227,242,0.7);
  transition: color 0.15s ease;
  font-size: 1.5rem;
  cursor: pointer;
}

.site-header__cart-icon:hover { color: var(--color-primary); }

.cart-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-size: 0.625rem;
  font-weight: 900;
  font-family: var(--font-headline);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ============================================================
   HERO BANNER
   ============================================================ */

.hero {
  position: relative;
  min-height: 921px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: var(--color-surface-container-lowest);
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
}

.hero__bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, var(--color-surface) 0%, rgba(10,20,30,0.8) 50%, transparent 100%);
}

.hero__content {
  position: relative;
  z-index: 1;
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  width: 100%;
}

@media (min-width: 768px) {
  .hero__content { padding: 0 var(--space-12); }
}

.hero__inner { max-width: 48rem; }

.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  color: var(--color-primary);
}

.hero__eyebrow-line {
  height: 2px;
  width: 3rem;
  background-color: var(--color-primary);
}

.hero__heading { margin-bottom: var(--space-6); }
.hero__heading em { color: var(--color-primary); font-style: italic; }

.hero__subtext {
  font-size: 1.25rem;
  max-width: 32rem;
  margin-bottom: var(--space-10);
  line-height: 1.6;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-surface-container);
  border: 1px solid rgba(255,82,98,0.3);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-primary);
}

/* ============================================================
   TRUST BAR
   ============================================================ */

.trust-bar {
  background-color: var(--color-surface-container-low);
  padding: var(--space-8) 0;
}

.trust-bar__inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-8);
  opacity: 0.8;
}

.trust-bar__item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-family: var(--font-headline);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.trust-bar__item svg,
.trust-bar__item .icon {
  color: var(--color-primary);
  font-size: 1.75rem;
}

/* ============================================================
   CATEGORY GRID
   ============================================================ */

.category-grid { background-color: var(--color-surface); }
.category-grid.bg-grid { /* uses .bg-grid utility */ }

.category-grid__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 640px)  { .category-grid__grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .category-grid__grid { grid-template-columns: repeat(4, 1fr); } }

.category-card {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  cursor: pointer;
  clip-path: polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%);
}

.category-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.category-card:hover img { transform: scale(1.1); }

.category-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--color-surface) 0%, transparent 60%);
}

.category-card__label {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: var(--space-8);
  width: 100%;
}

.category-card__label h3 { font-style: italic; margin-bottom: var(--space-2); }

.category-card__bar {
  height: 4px;
  width: 0;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.category-card:hover .category-card__bar { width: 100%; }

/* ============================================================
   FEATURED PRODUCTS / PRODUCT CARD
   ============================================================ */

.featured-products { background-color: var(--color-surface-container-low); }

.section-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-16);
}

@media (min-width: 768px) {
  .section-header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.section-header__eyebrow {
  display: block;
  color: var(--color-primary);
  font-family: var(--font-headline);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: var(--space-4);
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 640px)  { .products-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .products-grid { grid-template-columns: repeat(4, 1fr); } }

/* Product card — in snippets/product-card.liquid */
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-surface-container-lowest);
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.product-card:hover { border-color: var(--color-primary); }

.product-card__badge {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  z-index: 2;
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  font-family: var(--font-headline);
  font-size: 0.625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  padding: 0.25rem 0.75rem;
  font-style: italic;
}

.product-card__image-wrap {
  position: relative;
  aspect-ratio: 1/1;
  overflow: hidden;
  background-color: var(--color-surface-container);
}

.product-card__image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: var(--space-8);
  transition: transform 0.5s ease;
}

.product-card:hover .product-card__image-wrap img { transform: scale(1.1); }

.product-card__hud {
  position: absolute;
  inset: 0;
  background-color: rgba(255, 82, 98, 0.9);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-6);
  color: var(--color-on-primary);
}

.product-card:hover .product-card__hud { opacity: 1; }

.product-card__spec {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(94, 0, 18, 0.2);
  padding-bottom: var(--space-2);
  margin-bottom: var(--space-4);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-card__add-btn {
  width: 100%;
  background-color: var(--color-on-primary);
  color: var(--color-primary);
  font-family: var(--font-headline);
  font-weight: 900;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--space-3) var(--space-4);
  text-align: center;
  margin-top: var(--space-4);
  border: none;
  cursor: pointer;
  transition: transform 0.1s ease;
}

.product-card__add-btn:active { transform: scale(0.97); }

.product-card__info {
  padding: var(--space-6);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface-container-high);
}

.product-card__title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 900;
  font-style: italic;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-2);
}

.product-card__price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.product-card__price {
  font-family: var(--font-headline);
  font-weight: 900;
  font-size: 1.5rem;
  color: var(--color-primary);
}

.product-card__stock {
  font-family: var(--font-headline);
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(217,227,242,0.4);
}

/* ============================================================
   MAIN PRODUCT PAGE
   ============================================================ */

.product-page {
  background-color: var(--color-surface);
  padding: var(--space-16) 0;
}

.product-page__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12);
}

@media (min-width: 1024px) {
  .product-page__grid { grid-template-columns: 1fr 1fr; gap: var(--space-16); }
}

.product-gallery__main {
  aspect-ratio: 1/1;
  background-color: var(--color-surface-container);
  overflow: hidden;
  position: relative;
}

.product-gallery__main img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: var(--space-8);
}

.product-gallery__thumbs {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-3);
}

.product-gallery__thumb {
  width: 5rem;
  height: 5rem;
  background-color: var(--color-surface-container);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.15s ease;
}

.product-gallery__thumb.active,
.product-gallery__thumb:hover { border-color: var(--color-primary); }

.product-gallery__thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: var(--space-2);
}

.product-info__title { margin-bottom: var(--space-4); }

.product-info__price {
  font-family: var(--font-headline);
  font-weight: 900;
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: var(--space-8);
}

.product-info__compare-price {
  font-size: 1rem;
  color: rgba(217,227,242,0.4);
  text-decoration: line-through;
  margin-left: var(--space-3);
}

.hud-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
}

.hud-chip {
  font-family: var(--font-headline);
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: var(--space-1) var(--space-3);
  background-color: var(--color-surface-container-highest);
  color: var(--color-on-surface-variant);
  border-left: 2px solid var(--color-primary);
}

.product-info__variants { margin-bottom: var(--space-8); }

.variant-label {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-on-surface-variant);
  margin-bottom: var(--space-3);
  display: block;
}

.variant-buttons { display: flex; flex-wrap: wrap; gap: var(--space-2); }

.variant-btn {
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-surface-container);
  color: var(--color-on-surface);
  font-family: var(--font-headline);
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid var(--color-outline-variant);
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;
}

.variant-btn.active,
.variant-btn:hover { background-color: var(--color-primary); color: var(--color-on-primary); border-color: var(--color-primary); }

.variant-btn:disabled { opacity: 0.4; cursor: not-allowed; text-decoration: line-through; }

.product-info__quantity { margin-bottom: var(--space-8); }

.quantity-stepper {
  display: flex;
  align-items: center;
  gap: 0;
  width: fit-content;
}

.quantity-stepper button {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--color-surface-container);
  color: var(--color-on-surface);
  font-size: 1.25rem;
  font-weight: 700;
  border: 1px solid var(--color-outline-variant);
  cursor: pointer;
  transition: background-color 0.15s;
}

.quantity-stepper button:hover { background-color: var(--color-primary); color: var(--color-on-primary); }

.quantity-stepper input {
  width: 3.5rem;
  height: 2.5rem;
  background-color: var(--color-surface-container-lowest);
  color: var(--color-on-surface);
  font-family: var(--font-headline);
  font-weight: 700;
  text-align: center;
  border: 1px solid var(--color-outline-variant);
  border-left: none;
  border-right: none;
}

.product-info__add-btn {
  width: 100%;
  margin-bottom: var(--space-4);
}

.product-info__description {
  border-top: 1px solid var(--color-surface-container-high);
  padding-top: var(--space-8);
  margin-top: var(--space-8);
  color: var(--color-on-surface-variant);
  line-height: 1.8;
}

/* ============================================================
   COLLECTION PAGE
   ============================================================ */

.collection-header {
  background-color: var(--color-surface-container-lowest);
  padding: var(--space-16) 0 var(--space-12);
}

.collection-header__eyebrow {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  color: var(--color-primary);
}

.collection-header__meta {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(217,227,242,0.4);
  margin-top: var(--space-4);
}

.collection-grid-section { background-color: var(--color-surface); }

.collection-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 640px)  { .collection-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .collection-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1280px) { .collection-grid { grid-template-columns: repeat(4, 1fr); } }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-16);
}

.pagination a,
.pagination span {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface-container);
  color: var(--color-on-surface);
  border: 1px solid var(--color-outline-variant);
  transition: background-color 0.15s, border-color 0.15s;
}

.pagination a:hover,
.pagination span.current {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border-color: var(--color-primary);
}

/* ============================================================
   CART PAGE
   ============================================================ */

.cart-page {
  background-color: var(--color-surface);
  padding: var(--space-16) 0;
}

.cart-page__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12);
}

@media (min-width: 1024px) {
  .cart-page__grid { grid-template-columns: 1fr 380px; }
}

.cart-items { display: flex; flex-direction: column; gap: var(--space-6); }

.cart-item {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: var(--space-6);
  background-color: var(--color-surface-container);
  padding: var(--space-6);
  align-items: start;
}

.cart-item__image {
  aspect-ratio: 1/1;
  background-color: var(--color-surface-container-high);
  overflow: hidden;
}

.cart-item__image img { width: 100%; height: 100%; object-fit: contain; padding: var(--space-2); }

.cart-item__title {
  font-family: var(--font-headline);
  font-weight: 900;
  font-size: 1rem;
  font-style: italic;
  margin-bottom: var(--space-2);
}

.cart-item__variant {
  font-size: 0.75rem;
  color: rgba(217,227,242,0.5);
  margin-bottom: var(--space-4);
  font-family: var(--font-headline);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cart-item__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.cart-item__price {
  font-family: var(--font-headline);
  font-weight: 900;
  font-size: 1.25rem;
  color: var(--color-primary);
}

.cart-item__remove {
  font-family: var(--font-headline);
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(217,227,242,0.4);
  cursor: pointer;
  transition: color 0.15s ease;
  background: none;
  border: none;
}

.cart-item__remove:hover { color: var(--color-primary); }

.cart-summary {
  background-color: var(--color-surface-container-low);
  padding: var(--space-8);
  align-self: start;
  position: sticky;
  top: 6rem;
}

.cart-summary__title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 900;
  font-style: italic;
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-surface-container-high);
}

.cart-summary__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cart-summary__total {
  display: flex;
  justify-content: space-between;
  margin: var(--space-6) 0;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-surface-container-high);
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 900;
}

.cart-summary__total-price { color: var(--color-primary); }

.cart-summary__note {
  font-size: 0.75rem;
  text-align: center;
  color: rgba(217,227,242,0.4);
  margin-top: var(--space-4);
  font-family: var(--font-headline);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cart-empty {
  text-align: center;
  padding: var(--space-24) 0;
}

.cart-empty h2 { margin-bottom: var(--space-6); }

/* ============================================================
   ABOUT PAGE
   ============================================================ */

.about-hero {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  background-color: var(--color-surface-container-lowest);
  overflow: hidden;
}

.about-body {
  background-color: var(--color-surface);
  padding: var(--space-24) 0;
}

.about-body__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-16);
}

@media (min-width: 1024px) {
  .about-body__grid { grid-template-columns: 1fr 1fr; align-items: center; }
}

.about-body__image {
  aspect-ratio: 4/3;
  background-color: var(--color-surface-container);
  overflow: hidden;
  clip-path: polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%);
}

.about-body__image img { width: 100%; height: 100%; object-fit: cover; }

.about-disclaimer {
  margin-top: var(--space-8);
  padding: var(--space-4) var(--space-6);
  background-color: var(--color-surface-container);
  border-left: 2px solid rgba(255,82,98,0.3);
  font-size: 0.75rem;
  color: rgba(217,227,242,0.4);
  font-family: var(--font-headline);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ============================================================
   FOOTER
   ============================================================ */

.site-footer {
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-surface-container-low);
}

.site-footer__main {
  padding: var(--space-12) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .site-footer__main { flex-direction: row; justify-content: space-between; align-items: center; }
}

.site-footer__brand {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 900;
  font-style: italic;
  color: var(--color-primary);
}

.site-footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  list-style: none;
}

.site-footer__links a {
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(217,227,242,0.5);
  transition: color 0.15s ease;
}

.site-footer__links a:hover { color: var(--color-primary); }

.site-footer__bottom {
  padding: var(--space-6) 0;
  border-top: 1px solid var(--color-surface-container-low);
}

.site-footer__copyright {
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(217,227,242,0.3);
  font-family: var(--font-body);
}

/* ============================================================
   MATERIAL ICONS (loaded via theme.liquid)
   ============================================================ */

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

/* ============================================================
   UTILITY
   ============================================================ */

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
}

.text-primary { color: var(--color-primary); }
.bg-surface    { background-color: var(--color-surface); }
.bg-surface-low { background-color: var(--color-surface-container-low); }
```

- [ ] **Step 2: Commit**

```bash
git add assets/theme.css
git commit -m "feat: add CSS design tokens and component styles"
```

---

## Task 3: `assets/theme.js`

**Files:**
- Modify: `assets/theme.js`

- [ ] **Step 1: Write `assets/theme.js`**

```js
/* ============================================================
   KnivesFactory Theme JS
   ============================================================ */

// --- Sticky header scroll class ---
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

// --- Quantity stepper ---
document.addEventListener('click', function (e) {
  if (e.target.matches('[data-qty-minus]')) {
    const input = e.target.closest('.quantity-stepper').querySelector('input');
    const val = parseInt(input.value, 10);
    if (val > 1) input.value = val - 1;
  }
  if (e.target.matches('[data-qty-plus]')) {
    const input = e.target.closest('.quantity-stepper').querySelector('input');
    input.value = parseInt(input.value, 10) + 1;
  }
});

// --- Variant selector ---
document.addEventListener('click', function (e) {
  if (!e.target.matches('.variant-btn')) return;
  const form = e.target.closest('form');
  if (!form) return;
  form.querySelectorAll('.variant-btn').forEach(function (btn) {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');
  const variantId = e.target.dataset.variantId;
  const input = form.querySelector('[name="id"]');
  if (input) input.value = variantId;
});

// --- Product gallery thumbnail switcher ---
document.addEventListener('click', function (e) {
  if (!e.target.matches('.product-gallery__thumb img')) return;
  const wrap = e.target.closest('.product-page__gallery');
  if (!wrap) return;
  const main = wrap.querySelector('.product-gallery__main img');
  if (main) main.src = e.target.src;
  wrap.querySelectorAll('.product-gallery__thumb').forEach(function (t) {
    t.classList.remove('active');
  });
  e.target.closest('.product-gallery__thumb').classList.add('active');
});

// --- Cart item remove (AJAX) ---
document.addEventListener('click', function (e) {
  if (!e.target.matches('[data-cart-remove]')) return;
  e.preventDefault();
  const key = e.target.dataset.cartRemove;
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: key, quantity: 0 })
  })
  .then(function () { window.location.reload(); });
});

// --- Cart quantity update (AJAX) ---
document.addEventListener('change', function (e) {
  if (!e.target.matches('[data-cart-qty]')) return;
  const key = e.target.dataset.cartQty;
  const qty = parseInt(e.target.value, 10);
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: key, quantity: qty })
  })
  .then(function () { window.location.reload(); });
});
```

- [ ] **Step 2: Commit**

```bash
git add assets/theme.js
git commit -m "feat: add theme JS (sticky header, quantity, gallery, cart AJAX)"
```

---

## Task 4: `layout/theme.liquid`

**Files:**
- Modify: `layout/theme.liquid`

- [ ] **Step 1: Write `layout/theme.liquid`**

```liquid
<!DOCTYPE html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0a141e">

  <title>
    {{ page_title }}{% if current_tags %} &ndash; tagged "{{ current_tags | join: ', ' }}"{% endif %}
    {% if current_page != 1 %} &ndash; Page {{ current_page }}{% endif %}
    {% unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless %}
  </title>

  {% if page_description %}
    <meta name="description" content="{{ page_description | escape }}">
  {% endif %}

  <!-- Canonical -->
  <link rel="canonical" href="{{ canonical_url }}">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">

  <!-- Theme CSS -->
  {{ 'theme.css' | asset_url | stylesheet_tag }}

  <!-- Shopify required -->
  {{ content_for_header }}
</head>

<body class="template-{{ template.name }}">

  {% section 'announcement-bar' %}
  {% section 'header' %}

  <main id="main-content" role="main">
    {{ content_for_layout }}
  </main>

  {% section 'footer' %}

  <!-- Theme JS -->
  <script src="{{ 'theme.js' | asset_url }}" defer></script>

</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add layout/theme.liquid
git commit -m "feat: add root theme layout"
```

---

## Task 5: Global sections — announcement bar, header, footer

**Files:**
- Modify: `sections/announcement-bar.liquid`
- Modify: `sections/header.liquid`
- Modify: `sections/footer.liquid`

- [ ] **Step 1: Write `sections/announcement-bar.liquid`**

```liquid
{% if section.settings.show_bar %}
<div class="announcement-bar">
  {% if section.settings.link != blank %}
    <a href="{{ section.settings.link }}">{{ section.settings.message }}</a>
  {% else %}
    {{ section.settings.message }}
  {% endif %}
</div>
{% endif %}

{% schema %}
{
  "name": "Announcement Bar",
  "settings": [
    {
      "type": "checkbox",
      "id": "show_bar",
      "label": "Show announcement bar",
      "default": true
    },
    {
      "type": "text",
      "id": "message",
      "label": "Message",
      "default": "FREE SHIPPING ON ORDERS OVER $75"
    },
    {
      "type": "url",
      "id": "link",
      "label": "Link (optional)"
    }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Write `sections/header.liquid`**

```liquid
<header class="site-header" role="banner">
  <div class="site-header__inner">

    <!-- Logo -->
    <a href="/" class="site-header__logo">
      {{ section.settings.logo_text }}
    </a>

    <!-- Nav -->
    <nav role="navigation">
      <ul class="site-header__nav">
        {% for link in linklists[section.settings.menu].links %}
          <li>
            <a href="{{ link.url }}"
               {% if link.active %}class="active"{% endif %}>
              {{ link.title }}
            </a>
          </li>
        {% endfor %}
      </ul>
    </nav>

    <!-- Actions -->
    <div class="site-header__actions">
      <a href="/cart" class="site-header__cart-icon" aria-label="Cart">
        <span class="material-symbols-outlined">shopping_bag</span>
        {% if cart.item_count > 0 %}
          <span class="cart-count">{{ cart.item_count }}</span>
        {% endif %}
      </a>
    </div>

  </div>
</header>

{% schema %}
{
  "name": "Header",
  "settings": [
    {
      "type": "text",
      "id": "logo_text",
      "label": "Logo text",
      "default": "VALORANT REPLICAS"
    },
    {
      "type": "link_list",
      "id": "menu",
      "label": "Navigation menu",
      "default": "main-menu"
    }
  ]
}
{% endschema %}
```

- [ ] **Step 3: Write `sections/footer.liquid`**

```liquid
<footer class="site-footer">
  <div class="container">
    <div class="site-footer__main">
      <div class="site-footer__brand">{{ section.settings.brand_name }}</div>
      <ul class="site-footer__links">
        {% for link in linklists[section.settings.menu].links %}
          <li><a href="{{ link.url }}">{{ link.title }}</a></li>
        {% endfor %}
      </ul>
    </div>
    <div class="site-footer__bottom">
      <p class="site-footer__copyright">
        &copy; {{ 'now' | date: '%Y' }} {{ shop.name }}. {{ section.settings.disclaimer }}
      </p>
    </div>
  </div>
</footer>

{% schema %}
{
  "name": "Footer",
  "settings": [
    {
      "type": "text",
      "id": "brand_name",
      "label": "Brand name",
      "default": "TACTICAL PRECISION"
    },
    {
      "type": "link_list",
      "id": "menu",
      "label": "Footer menu",
      "default": "footer"
    },
    {
      "type": "text",
      "id": "disclaimer",
      "label": "Disclaimer text",
      "default": "Not affiliated with Riot Games. All rights reserved."
    }
  ]
}
{% endschema %}
```

- [ ] **Step 4: Commit**

```bash
git add sections/announcement-bar.liquid sections/header.liquid sections/footer.liquid
git commit -m "feat: add global sections (announcement bar, header, footer)"
```

---

## Task 6: Home page sections

Source: existing Stitch screen `0514d3c8fa8041a69c0014675158b9af` in project `3118771630089350558`.

**Files:**
- Modify: `sections/hero-banner.liquid`
- Modify: `sections/trust-bar.liquid`
- Modify: `sections/category-grid.liquid`
- Modify: `sections/featured-products.liquid`
- Modify: `snippets/product-card.liquid`
- Modify: `snippets/price.liquid`
- Modify: `templates/index.json`

- [ ] **Step 1: Write `sections/hero-banner.liquid`**

```liquid
<header class="hero">
  <div class="hero__bg">
    {% if section.settings.bg_image != blank %}
      <img src="{{ section.settings.bg_image | image_url: width: 1920 }}"
           alt="{{ section.settings.bg_image.alt | escape }}"
           width="1920" height="921"
           loading="eager">
    {% else %}
      <div style="width:100%;height:100%;background:var(--color-surface-container-lowest);"></div>
    {% endif %}
  </div>

  <div class="hero__content">
    <div class="hero__inner">

      <div class="hero__eyebrow">
        <span class="hero__eyebrow-line"></span>
        <span class="label">{{ section.settings.eyebrow }}</span>
      </div>

      <h1 class="hero__heading">
        {{ section.settings.heading | replace: '|', '<em>' | replace: '|', '</em>' }}
      </h1>

      <p class="hero__subtext">{{ section.settings.subtext }}</p>

      <div class="hero__actions">
        <a href="{{ section.settings.cta_primary_url }}" class="btn-primary">
          {{ section.settings.cta_primary_label }}
        </a>
        <a href="{{ section.settings.cta_secondary_url }}" class="btn-secondary">
          {{ section.settings.cta_secondary_label }}
        </a>
        {% if section.settings.badge != blank %}
          <div class="hero__badge">{{ section.settings.badge }}</div>
        {% endif %}
      </div>

    </div>
  </div>
</header>

{% schema %}
{
  "name": "Hero Banner",
  "settings": [
    { "type": "image_picker", "id": "bg_image", "label": "Background image" },
    { "type": "text", "id": "eyebrow", "label": "Eyebrow text", "default": "Combat Ready Replicas" },
    { "type": "text", "id": "heading", "label": "Heading (wrap a word in | | to accent it)", "default": "YOUR FAVORITE |SKINS|, IRL" },
    { "type": "textarea", "id": "subtext", "label": "Subtext", "default": "Forged from premium 440C stainless steel. Hand-painted finishes. Weighted for tactical precision." },
    { "type": "text", "id": "cta_primary_label", "label": "Primary CTA label", "default": "SHOP THE ARMORY" },
    { "type": "url", "id": "cta_primary_url", "label": "Primary CTA URL" },
    { "type": "text", "id": "cta_secondary_label", "label": "Secondary CTA label", "default": "VIEW COLLECTIONS" },
    { "type": "url", "id": "cta_secondary_url", "label": "Secondary CTA URL" },
    { "type": "text", "id": "badge", "label": "Badge text (optional)", "default": "FREE SHIPPING OVER $75" }
  ],
  "presets": [{ "name": "Hero Banner" }]
}
{% endschema %}
```

- [ ] **Step 2: Write `sections/trust-bar.liquid`**

```liquid
<section class="trust-bar">
  <div class="container">
    <div class="trust-bar__inner">
      {% for block in section.blocks %}
        <div class="trust-bar__item" {{ block.shopify_attributes }}>
          <span class="material-symbols-outlined">{{ block.settings.icon }}</span>
          <span>{{ block.settings.label }}</span>
        </div>
      {% endfor %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Trust Bar",
  "max_blocks": 6,
  "blocks": [
    {
      "type": "item",
      "name": "Trust item",
      "settings": [
        { "type": "text", "id": "icon", "label": "Material Symbol icon name", "default": "public" },
        { "type": "text", "id": "label", "label": "Label", "default": "WORLDWIDE SHIPPING" }
      ]
    }
  ],
  "presets": [{
    "name": "Trust Bar",
    "blocks": [
      { "type": "item", "settings": { "icon": "public", "label": "WORLDWIDE SHIPPING" } },
      { "type": "item", "settings": { "icon": "verified_user", "label": "SECURE CHECKOUT" } },
      { "type": "item", "settings": { "icon": "workspace_premium", "label": "SATISFACTION GUARANTEED" } },
      { "type": "item", "settings": { "icon": "precision_manufacturing", "label": "HAND-FORGED QUALITY" } }
    ]
  }]
}
{% endschema %}
```

- [ ] **Step 3: Write `sections/category-grid.liquid`**

```liquid
<section class="section category-grid bg-grid">
  <div class="container">
    <div class="category-grid__grid">
      {% for block in section.blocks %}
        <a href="{{ block.settings.url }}" class="category-card" {{ block.shopify_attributes }}>
          {% if block.settings.image != blank %}
            <img src="{{ block.settings.image | image_url: width: 600 }}"
                 alt="{{ block.settings.title | escape }}"
                 width="600" height="750"
                 loading="lazy">
          {% else %}
            <div style="width:100%;height:100%;background:var(--color-surface-container);"></div>
          {% endif %}
          <div class="category-card__overlay"></div>
          <div class="category-card__label">
            <h3>{{ block.settings.title }}</h3>
            <div class="category-card__bar"></div>
          </div>
        </a>
      {% endfor %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Category Grid",
  "max_blocks": 8,
  "blocks": [
    {
      "type": "category",
      "name": "Category",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Image" },
        { "type": "text", "id": "title", "label": "Title", "default": "KARAMBITS" },
        { "type": "url", "id": "url", "label": "Link" }
      ]
    }
  ],
  "presets": [{
    "name": "Category Grid",
    "blocks": [
      { "type": "category", "settings": { "title": "KARAMBITS" } },
      { "type": "category", "settings": { "title": "BUTTERFLY KNIVES" } },
      { "type": "category", "settings": { "title": "BAYONETS" } },
      { "type": "category", "settings": { "title": "KEYCHAINS" } }
    ]
  }]
}
{% endschema %}
```

- [ ] **Step 4: Write `snippets/price.liquid`**

```liquid
{% comment %}
  Renders price with optional compare-at.
  Usage: {% render 'price', product: product %}
  or:    {% render 'price', variant: variant %}
{% endcomment %}

{% assign target = variant | default: product %}
{% assign compare_at = target.compare_at_price %}
{% assign price = target.price %}

<span class="product-card__price">
  {{ price | money }}
</span>
{% if compare_at > price %}
  <span class="product-card__compare-price" style="color:rgba(217,227,242,0.4);text-decoration:line-through;font-size:0.875rem;margin-left:0.5rem;">
    {{ compare_at | money }}
  </span>
{% endif %}
```

- [ ] **Step 5: Write `snippets/product-card.liquid`**

```liquid
{% comment %}
  Renders a product card with HUD hover overlay.
  Usage: {% render 'product-card', product: product %}
{% endcomment %}

<div class="product-card">

  {% if product.tags contains 'limited' or product.tags contains 'Limited Edition' %}
    <div class="product-card__badge">Limited Edition</div>
  {% elsif product.tags contains 'bestseller' %}
    <div class="product-card__badge" style="background:var(--color-surface-bright);color:var(--color-on-surface);">Best Seller</div>
  {% endif %}

  <div class="product-card__image-wrap">
    {% if product.featured_image %}
      <img src="{{ product.featured_image | image_url: width: 600 }}"
           alt="{{ product.featured_image.alt | escape | default: product.title }}"
           width="600" height="600"
           loading="lazy">
    {% else %}
      {{ 'product-1' | placeholder_svg_tag }}
    {% endif %}

    <!-- HUD hover overlay -->
    <div class="product-card__hud">
      <div class="product-card__spec">
        <span>Material</span>
        <span>{{ product.type | upcase | default: '440C STEEL' }}</span>
      </div>
      <div class="product-card__spec">
        <span>Weight</span>
        <span>
          {% assign weight_g = product.variants.first.weight | times: 1000 | round %}
          {% if weight_g > 0 %}{{ weight_g }}G{% else %}—{% endif %}
        </span>
      </div>
      <div class="product-card__spec">
        <span>Vendor</span>
        <span>{{ product.vendor | upcase | default: '—' }}</span>
      </div>
      <form action="/cart/add" method="post">
        <input type="hidden" name="id" value="{{ product.variants.first.id }}">
        <input type="hidden" name="quantity" value="1">
        <button type="submit" class="product-card__add-btn">
          {{ 'general.add_to_cart' | t }}
        </button>
      </form>
    </div>
  </div>

  <div class="product-card__info">
    <a href="{{ product.url }}">
      <h4 class="product-card__title">{{ product.title }}</h4>
    </a>
    <div class="product-card__price-row">
      {% render 'price', product: product %}
      <span class="product-card__stock">
        {% if product.available %}In Stock{% else %}Sold Out{% endif %}
      </span>
    </div>
  </div>

</div>
```

- [ ] **Step 6: Write `sections/featured-products.liquid`**

```liquid
<section class="section featured-products">
  <div class="container">

    <div class="section-header">
      <div>
        <span class="section-header__eyebrow">{{ section.settings.eyebrow }}</span>
        <h2>{{ section.settings.heading }}</h2>
      </div>
      {% if section.settings.collection != blank %}
        <a href="{{ collections[section.settings.collection].url }}" class="btn-secondary" style="padding:0.75rem 1.5rem;">
          View All <span class="material-symbols-outlined" style="font-size:1rem;vertical-align:middle;">arrow_forward</span>
        </a>
      {% endif %}
    </div>

    {% assign featured = collections[section.settings.collection] %}
    <div class="products-grid">
      {% if featured != blank %}
        {% for product in featured.products limit: section.settings.product_count %}
          {% render 'product-card', product: product %}
        {% endfor %}
      {% else %}
        {% for i in (1..4) %}
          <div class="product-card">
            <div class="product-card__image-wrap">{{ 'product-' | append: i | placeholder_svg_tag }}</div>
            <div class="product-card__info">
              <h4 class="product-card__title">Sample Product {{ i }}</h4>
              <div class="product-card__price-row">
                <span class="product-card__price">$99.00</span>
              </div>
            </div>
          </div>
        {% endfor %}
      {% endif %}
    </div>

  </div>
</section>

{% schema %}
{
  "name": "Featured Products",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Deployment Ready" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "BESTSELLERS" },
    { "type": "collection", "id": "collection", "label": "Collection" },
    {
      "type": "range",
      "id": "product_count",
      "label": "Number of products",
      "min": 2, "max": 12, "step": 2,
      "default": 4
    }
  ],
  "presets": [{ "name": "Featured Products" }]
}
{% endschema %}
```

- [ ] **Step 7: Write `templates/index.json`**

```json
{
  "sections": {
    "hero": {
      "type": "hero-banner",
      "settings": {}
    },
    "trust": {
      "type": "trust-bar",
      "block_order": ["trust_1","trust_2","trust_3","trust_4"],
      "blocks": {
        "trust_1": { "type": "item", "settings": { "icon": "public", "label": "WORLDWIDE SHIPPING" } },
        "trust_2": { "type": "item", "settings": { "icon": "verified_user", "label": "SECURE CHECKOUT" } },
        "trust_3": { "type": "item", "settings": { "icon": "workspace_premium", "label": "SATISFACTION GUARANTEED" } },
        "trust_4": { "type": "item", "settings": { "icon": "precision_manufacturing", "label": "HAND-FORGED QUALITY" } }
      }
    },
    "categories": {
      "type": "category-grid",
      "block_order": ["cat_1","cat_2","cat_3","cat_4"],
      "blocks": {
        "cat_1": { "type": "category", "settings": { "title": "KARAMBITS" } },
        "cat_2": { "type": "category", "settings": { "title": "BUTTERFLY KNIVES" } },
        "cat_3": { "type": "category", "settings": { "title": "BAYONETS" } },
        "cat_4": { "type": "category", "settings": { "title": "KEYCHAINS" } }
      }
    },
    "featured": {
      "type": "featured-products",
      "settings": {
        "eyebrow": "Deployment Ready",
        "heading": "BESTSELLERS",
        "product_count": 4
      }
    }
  },
  "order": ["hero","trust","categories","featured"]
}
```

- [ ] **Step 8: Commit**

```bash
git add sections/hero-banner.liquid sections/trust-bar.liquid sections/category-grid.liquid
git add sections/featured-products.liquid snippets/product-card.liquid snippets/price.liquid
git add templates/index.json
git commit -m "feat: add home page sections and snippets"
```

---

## Task 7: Generate Stitch product page screen + build `main-product.liquid`

**Files:**
- Modify: `sections/main-product.liquid`
- Modify: `templates/product.json`

- [ ] **Step 1: Generate Stitch screen for product page**

Call the Stitch MCP tool:
```
mcp__stitch__generate_screen_from_text
  projectId: "3118771630089350558"
  deviceType: DESKTOP
  modelId: GEMINI_3_1_PRO
  prompt: "Product detail page for KnivesFactory — Valorant-inspired weapon replica store.
    Background #0a141e, accent #ff5262, Space Grotesk headlines, zero border-radius.
    Left column: product image gallery (main image + 4 thumbnails below).
    Right column: product title (large italic), price in #ff5262, HUD stat chips row
    (MATERIAL: 440C STEEL / WEIGHT: 145G / LENGTH: 19.5CM / VENDOR: KF ORIGINALS),
    variant selector buttons (e.g. Standard / Battle-Worn), quantity stepper,
    'ADD TO LOADOUT' primary CTA button (full width, red, btn-clip shape),
    product description text below.
    Below the fold: 'Related Products' horizontal scroll strip of 4 product cards
    with tactical-cut clip-path, HUD hover overlay showing specs, red price."
```

After calling: fetch HTML via `mcp__stitch__get_screen` on the returned screen ID.

- [ ] **Step 2: Write `sections/main-product.liquid`**

```liquid
{% assign current_variant = product.selected_or_first_available_variant %}

<section class="product-page">
  <div class="container">
    <div class="product-page__grid">

      <!-- Gallery -->
      <div class="product-page__gallery">
        <div class="product-gallery__main">
          {% if product.featured_image %}
            <img id="main-product-image"
                 src="{{ current_variant.image | default: product.featured_image | image_url: width: 800 }}"
                 alt="{{ product.featured_image.alt | escape | default: product.title }}"
                 width="800" height="800">
          {% else %}
            {{ 'product-1' | placeholder_svg_tag }}
          {% endif %}
        </div>

        {% if product.images.size > 1 %}
          <div class="product-gallery__thumbs">
            {% for image in product.images limit: 6 %}
              <div class="product-gallery__thumb{% if forloop.first %} active{% endif %}">
                <img src="{{ image | image_url: width: 120 }}"
                     alt="{{ image.alt | escape }}"
                     width="120" height="120"
                     loading="lazy">
              </div>
            {% endfor %}
          </div>
        {% endif %}
      </div>

      <!-- Info -->
      <div class="product-info">

        <h1 class="product-info__title">{{ product.title }}</h1>

        <div class="product-info__price">
          {% render 'price', variant: current_variant %}
        </div>

        <!-- HUD chips -->
        <div class="hud-chips">
          {% if product.type != blank %}
            <div class="hud-chip">MATERIAL: {{ product.type | upcase }}</div>
          {% endif %}
          {% assign weight_g = current_variant.weight | times: 1000 | round %}
          {% if weight_g > 0 %}
            <div class="hud-chip">WEIGHT: {{ weight_g }}G</div>
          {% endif %}
          {% if product.vendor != blank %}
            <div class="hud-chip">VENDOR: {{ product.vendor | upcase }}</div>
          {% endif %}
          {% for tag in product.tags %}
            {% if tag contains 'length:' %}
              <div class="hud-chip">{{ tag | upcase }}</div>
            {% endif %}
          {% endfor %}
        </div>

        <form action="/cart/add" method="post">
          <input type="hidden" name="id" value="{{ current_variant.id }}">

          <!-- Variants -->
          {% unless product.has_only_default_variant %}
            <div class="product-info__variants">
              {% for option in product.options_with_values %}
                <span class="variant-label">{{ option.name }}</span>
                <div class="variant-buttons">
                  {% for value in option.values %}
                    {% assign variant_for_value = product.variants | where: 'option1', value | first %}
                    <button type="button"
                            class="variant-btn{% if option.selected_value == value %} active{% endif %}"
                            data-variant-id="{{ variant_for_value.id }}"
                            {% unless variant_for_value.available %}disabled{% endunless %}>
                      {{ value }}
                    </button>
                  {% endfor %}
                </div>
              {% endfor %}
            </div>
          {% endunless %}

          <!-- Quantity -->
          <div class="product-info__quantity">
            <span class="variant-label">Quantity</span>
            <div class="quantity-stepper">
              <button type="button" data-qty-minus aria-label="Decrease">−</button>
              <input type="number" name="quantity" value="1" min="1" aria-label="Quantity">
              <button type="button" data-qty-plus aria-label="Increase">+</button>
            </div>
          </div>

          <!-- Add to cart -->
          {% if current_variant.available %}
            <button type="submit" class="btn-primary product-info__add-btn">
              {{ 'general.add_to_cart' | t }}
            </button>
          {% else %}
            <button type="button" class="btn-primary product-info__add-btn" disabled style="opacity:0.5;cursor:not-allowed;">
              {{ 'general.sold_out' | t }}
            </button>
          {% endif %}

        </form>

        <!-- Description -->
        {% if product.description != blank %}
          <div class="product-info__description">
            {{ product.description }}
          </div>
        {% endif %}

      </div><!-- /product-info -->
    </div><!-- /grid -->

    <!-- Related products -->
    {% assign related = collections[product.collections.first.handle] %}
    {% if related.products.size > 1 %}
      <div style="margin-top:var(--space-24);">
        <h2 style="margin-bottom:var(--space-8);">RELATED PRODUCTS</h2>
        <div class="products-grid">
          {% for p in related.products limit: 4 %}
            {% unless p.id == product.id %}
              {% render 'product-card', product: p %}
            {% endunless %}
          {% endfor %}
        </div>
      </div>
    {% endif %}

  </div>
</section>

{% schema %}
{
  "name": "Product Page",
  "settings": []
}
{% endschema %}
```

- [ ] **Step 3: Write `templates/product.json`**

```json
{
  "sections": {
    "main": {
      "type": "main-product",
      "settings": {}
    }
  },
  "order": ["main"]
}
```

- [ ] **Step 4: Commit**

```bash
git add sections/main-product.liquid templates/product.json
git commit -m "feat: add product detail page"
```

---

## Task 8: Generate Stitch collection page screen + build `main-collection.liquid`

**Files:**
- Modify: `sections/main-collection.liquid`
- Modify: `templates/collection.json`

- [ ] **Step 1: Generate Stitch screen for collection page**

Call the Stitch MCP tool:
```
mcp__stitch__generate_screen_from_text
  projectId: "3118771630089350558"
  deviceType: DESKTOP
  modelId: GEMINI_3_1_PRO
  prompt: "Collection/category page for KnivesFactory — Valorant-inspired weapon replica store.
    Background #0a141e, accent #ff5262, Space Grotesk headlines, zero border-radius.
    Top: collection header with eyebrow line + accent, large italic collection title
    (e.g. 'KARAMBITS'), product count badge (e.g. '24 PRODUCTS').
    Below: 4-column product grid. Each card uses tactical-cut clip-path, red price,
    HUD hover overlay with material/weight/length specs and ADD TO LOADOUT button.
    Bottom: pagination row with sharp square page number buttons, active state in #ff5262."
```

After calling: fetch HTML via `mcp__stitch__get_screen`.

- [ ] **Step 2: Write `sections/main-collection.liquid`**

```liquid
<!-- Collection header -->
<div class="collection-header">
  <div class="container">
    <div class="collection-header__eyebrow">
      <span style="height:2px;width:3rem;background:var(--color-primary);display:inline-block;vertical-align:middle;margin-right:1rem;"></span>
      <span class="label" style="color:var(--color-primary);">{{ collection.title }}</span>
    </div>
    <h1>{{ collection.title }}</h1>
    <p class="collection-header__meta">{{ collection.products_count }} PRODUCTS</p>
  </div>
</div>

<!-- Product grid -->
<section class="section collection-grid-section">
  <div class="container">

    {% paginate collection.products by section.settings.products_per_page %}

      <div class="collection-grid">
        {% for product in collection.products %}
          {% render 'product-card', product: product %}
        {% endfor %}
      </div>

      {% if paginate.pages > 1 %}
        <nav class="pagination" aria-label="Pagination">
          {% if paginate.previous %}
            <a href="{{ paginate.previous.url }}">&larr;</a>
          {% endif %}
          {% for part in paginate.parts %}
            {% if part.is_link %}
              <a href="{{ part.url }}">{{ part.title }}</a>
            {% else %}
              <span {% if part.title == paginate.current_page %}class="current"{% endif %}>
                {{ part.title }}
              </span>
            {% endif %}
          {% endfor %}
          {% if paginate.next %}
            <a href="{{ paginate.next.url }}">&rarr;</a>
          {% endif %}
        </nav>
      {% endif %}

    {% endpaginate %}

  </div>
</section>

{% schema %}
{
  "name": "Collection Page",
  "settings": [
    {
      "type": "range",
      "id": "products_per_page",
      "label": "Products per page",
      "min": 8, "max": 48, "step": 4,
      "default": 12
    }
  ]
}
{% endschema %}
```

- [ ] **Step 3: Write `templates/collection.json`**

```json
{
  "sections": {
    "main": {
      "type": "main-collection",
      "settings": {
        "products_per_page": 12
      }
    }
  },
  "order": ["main"]
}
```

- [ ] **Step 4: Commit**

```bash
git add sections/main-collection.liquid templates/collection.json
git commit -m "feat: add collection page"
```

---

## Task 9: Generate Stitch cart screen + build `main-cart.liquid`

**Files:**
- Modify: `sections/main-cart.liquid`
- Modify: `templates/cart.json`

- [ ] **Step 1: Generate Stitch screen for cart page**

Call the Stitch MCP tool:
```
mcp__stitch__generate_screen_from_text
  projectId: "3118771630089350558"
  deviceType: DESKTOP
  modelId: GEMINI_3_1_PRO
  prompt: "Cart page for KnivesFactory — Valorant-inspired weapon replica store.
    Background #0a141e, accent #ff5262, Space Grotesk headlines, zero border-radius.
    Left column (wider): list of cart line items. Each item shows product image (square,
    dark bg), product name in large italic, variant name, quantity stepper, price in #ff5262,
    and a small REMOVE link.
    Right column: order summary panel (dark surface-container-low bg).
    Panel shows SUBTOTAL row and large TOTAL row with price in #ff5262.
    Full-width red 'PROCEED TO CHECKOUT' CTA button (btn-clip shape).
    Below button: small text 'Taxes and shipping calculated at checkout'.
    If cart is empty: centered message 'YOUR ARSENAL IS EMPTY' with a 'SHOP NOW' CTA."
```

After calling: fetch HTML via `mcp__stitch__get_screen`.

- [ ] **Step 2: Write `sections/main-cart.liquid`**

```liquid
<section class="cart-page">
  <div class="container">

    {% if cart.item_count == 0 %}
      <div class="cart-empty">
        <h2>YOUR ARSENAL IS EMPTY</h2>
        <p style="margin-bottom:var(--space-8);">Add some tactical gear to get started.</p>
        <a href="/collections/all" class="btn-primary">SHOP NOW</a>
      </div>

    {% else %}
      <h1 style="margin-bottom:var(--space-12);">YOUR ARSENAL</h1>

      <form action="/cart" method="post" class="cart-page__grid">

        <!-- Line items -->
        <div class="cart-items">
          {% for item in cart.items %}
            <div class="cart-item">
              <div class="cart-item__image">
                <a href="{{ item.url }}">
                  <img src="{{ item.image | image_url: width: 200 }}"
                       alt="{{ item.image.alt | escape | default: item.title }}"
                       width="200" height="200"
                       loading="lazy">
                </a>
              </div>

              <div>
                <h4 class="cart-item__title">
                  <a href="{{ item.url }}">{{ item.product.title }}</a>
                </h4>
                {% unless item.variant.title == 'Default Title' %}
                  <p class="cart-item__variant">{{ item.variant.title }}</p>
                {% endunless %}

                <div class="cart-item__actions">
                  <div class="quantity-stepper">
                    <button type="button" data-qty-minus aria-label="Decrease">−</button>
                    <input type="number"
                           name="updates[]"
                           data-cart-qty="{{ item.key }}"
                           value="{{ item.quantity }}"
                           min="0"
                           aria-label="Quantity for {{ item.title }}">
                    <button type="button" data-qty-plus aria-label="Increase">+</button>
                  </div>

                  <span class="cart-item__price">{{ item.line_price | money }}</span>

                  <button type="button"
                          class="cart-item__remove"
                          data-cart-remove="{{ item.key }}">
                    {{ 'general.remove' | t }}
                  </button>
                </div>
              </div>
            </div>
          {% endfor %}
        </div>

        <!-- Summary -->
        <div class="cart-summary">
          <h3 class="cart-summary__title">ORDER SUMMARY</h3>

          <div class="cart-summary__row">
            <span>{{ 'general.subtotal' | t }}</span>
            <span>{{ cart.total_price | money }}</span>
          </div>

          <div class="cart-summary__total">
            <span>TOTAL</span>
            <span class="cart-summary__total-price">{{ cart.total_price | money }}</span>
          </div>

          <button type="submit" name="checkout" class="btn-primary" style="width:100%;">
            {{ 'general.checkout' | t }}
          </button>

          <p class="cart-summary__note">Taxes and shipping calculated at checkout</p>

          <a href="/collections/all" class="btn-secondary" style="width:100%;text-align:center;margin-top:var(--space-4);display:block;">
            {{ 'general.continue_shopping' | t }}
          </a>
        </div>

      </form>
    {% endif %}

  </div>
</section>

{% schema %}
{
  "name": "Cart Page",
  "settings": []
}
{% endschema %}
```

- [ ] **Step 3: Write `templates/cart.json`**

```json
{
  "sections": {
    "main": {
      "type": "main-cart",
      "settings": {}
    }
  },
  "order": ["main"]
}
```

- [ ] **Step 4: Commit**

```bash
git add sections/main-cart.liquid templates/cart.json
git commit -m "feat: add cart page"
```

---

## Task 10: Generate Stitch about screen + build `main-about.liquid`

**Files:**
- Modify: `sections/main-about.liquid`
- Modify: `templates/page.about.json`

- [ ] **Step 1: Generate Stitch screen for about page**

Call the Stitch MCP tool:
```
mcp__stitch__generate_screen_from_text
  projectId: "3118771630089350558"
  deviceType: DESKTOP
  modelId: GEMINI_3_1_PRO
  prompt: "About / Brand story page for KnivesFactory — Valorant-inspired weapon replica store.
    Background #0a141e, accent #ff5262, Space Grotesk headlines, zero border-radius.
    Hero area: full-width dark header with large italic heading 'OUR MISSION' and red eyebrow line.
    Body section: two-column layout — left has brand story text about crafting premium
    Valorant-inspired weapon replicas for collectors; right has a dramatic product image
    with tactical-cut clip-path shape.
    Below: a subtle disclaimer section: 'NOT AFFILIATED WITH RIOT GAMES. VALORANT AND ALL
    RELATED MARKS ARE TRADEMARKS OF RIOT GAMES.'
    Overall feel: premium, editorial, tactical."
```

After calling: fetch HTML via `mcp__stitch__get_screen`.

- [ ] **Step 2: Write `sections/main-about.liquid`**

```liquid
<!-- About hero -->
<div class="about-hero">
  <div class="container">
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;color:var(--color-primary);">
      <span style="height:2px;width:3rem;background:var(--color-primary);display:inline-block;"></span>
      <span class="label">{{ section.settings.eyebrow }}</span>
    </div>
    <h1>{{ section.settings.heading }}</h1>
  </div>
</div>

<!-- About body -->
<section class="about-body">
  <div class="container">
    <div class="about-body__grid">

      <div>
        <div class="section-header__eyebrow" style="margin-bottom:var(--space-4);">
          {{ section.settings.subheading }}
        </div>
        <div style="color:var(--color-on-surface-variant);line-height:1.8;font-size:1.125rem;">
          {{ section.settings.body | newline_to_br }}
        </div>

        <div class="about-disclaimer" style="margin-top:var(--space-12);">
          {{ section.settings.disclaimer }}
        </div>
      </div>

      {% if section.settings.image != blank %}
        <div class="about-body__image">
          <img src="{{ section.settings.image | image_url: width: 900 }}"
               alt="{{ section.settings.image.alt | escape | default: shop.name }}"
               width="900" height="675"
               loading="lazy">
        </div>
      {% else %}
        <div class="about-body__image">
          {{ 'product-2' | placeholder_svg_tag }}
        </div>
      {% endif %}

    </div>
  </div>
</section>

{% schema %}
{
  "name": "About Page",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Our Story" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "OUR MISSION" },
    { "type": "text", "id": "subheading", "label": "Subheading", "default": "FORGED FOR COLLECTORS" },
    {
      "type": "textarea",
      "id": "body",
      "label": "Body text",
      "default": "KnivesFactory was founded by a team of Valorant fans who couldn't find high-quality physical replicas of their favourite in-game skins. We hand-craft every piece from premium 440C stainless steel with meticulous attention to detail — so you can hold a piece of the game in your hands."
    },
    { "type": "image_picker", "id": "image", "label": "Image" },
    {
      "type": "text",
      "id": "disclaimer",
      "label": "Disclaimer",
      "default": "Not affiliated with Riot Games. VALORANT and all related marks are trademarks of Riot Games, Inc."
    }
  ],
  "presets": [{ "name": "About Page" }]
}
{% endschema %}
```

- [ ] **Step 3: Write `templates/page.about.json`**

```json
{
  "sections": {
    "main": {
      "type": "main-about",
      "settings": {}
    }
  },
  "order": ["main"]
}
```

- [ ] **Step 4: Commit**

```bash
git add sections/main-about.liquid templates/page.about.json
git commit -m "feat: add about page"
```

---

## Task 11: `config/settings_schema.json` and `config/settings_data.json`

**Files:**
- Modify: `config/settings_schema.json`
- Modify: `config/settings_data.json`

- [ ] **Step 1: Write `config/settings_schema.json`**

```json
[
  {
    "name": "theme_info",
    "theme_name": "KnivesFactory Stitch",
    "theme_version": "1.0.0",
    "theme_author": "KnivesFactory",
    "theme_documentation_url": "https://github.com/Geekynawab/Google-Stitch-Valorant-UI-Design",
    "theme_support_url": "https://github.com/Geekynawab/Google-Stitch-Valorant-UI-Design"
  },
  {
    "name": "Colors",
    "settings": [
      {
        "type": "color",
        "id": "color_accent",
        "label": "Accent color",
        "default": "#ff5262",
        "info": "Used for CTAs, prices, active states"
      },
      {
        "type": "color",
        "id": "color_background",
        "label": "Page background",
        "default": "#0a141e"
      }
    ]
  },
  {
    "name": "Typography",
    "settings": [
      {
        "type": "select",
        "id": "heading_font",
        "label": "Heading font",
        "options": [
          { "value": "'Space Grotesk', sans-serif", "label": "Space Grotesk" },
          { "value": "'Inter', sans-serif", "label": "Inter" }
        ],
        "default": "'Space Grotesk', sans-serif"
      }
    ]
  }
]
```

- [ ] **Step 2: Write `config/settings_data.json`**

```json
{
  "current": {
    "color_accent": "#ff5262",
    "color_background": "#0a141e",
    "heading_font": "'Space Grotesk', sans-serif"
  },
  "presets": {}
}
```

- [ ] **Step 3: Commit**

```bash
git add config/settings_schema.json config/settings_data.json
git commit -m "feat: add theme settings schema and defaults"
```

---

## Task 12: Push to GitHub and deploy to Shopify

- [ ] **Step 1: Verify all files are committed**

```bash
git status
```

Expected output: `nothing to commit, working tree clean`

- [ ] **Step 2: Push to GitHub**

```bash
git push origin main
```

Expected: all commits pushed to `https://github.com/Geekynawab/Google-Stitch-Valorant-UI-Design`

- [ ] **Step 3: Push to Shopify as unpublished theme**

```bash
shopify theme push --store ckk43q-vx.myshopify.com --unpublished --theme-name "KnivesFactory Stitch"
```

Expected output: Shopify CLI uploads all files and returns a preview URL like:
`Preview: https://ckk43q-vx.myshopify.com/?preview_theme_id=XXXXXXXX`

- [ ] **Step 4: Open preview URL**

Open the preview URL from the CLI output in your browser to see the live theme on your store.

- [ ] **Step 5: Verify in Shopify admin**

Go to `https://ckk43q-vx.myshopify.com/admin/themes` — you should see "KnivesFactory Stitch" listed as an unpublished theme alongside your existing `tactical-armory` theme.

---

## Self-Review Notes

- All spec sections covered: theme scaffold ✓, global sections ✓, home ✓, product ✓, collection ✓, cart ✓, about ✓, deploy ✓
- Stitch screen generation steps included in Tasks 7–10 as MCP tool calls
- No TBDs or incomplete steps
- CSS class names are consistent between theme.css and all Liquid sections
- `render 'price'` usage is consistent — passes `product:` or `variant:` parameter throughout
- Cart AJAX in theme.js uses `data-cart-remove` and `data-cart-qty` attributes which match the cart section markup
