# Design Spec: KnivesFactory Stitch Shopify Theme

**Date:** 2026-03-29
**Repo:** `github.com/Geekynawab/Google-Stitch-Valorant-UI-Design`
**Deploy target:** `ckk43q-vx.myshopify.com` (unpublished, parallel to `tactical-armory`)

---

## Overview

Build a complete Shopify theme from scratch using Google Stitch (project #2: "Knives Factory UI Analysis & Strategy", ID `3118771630089350558`) as the design source. Each page is first generated as a Stitch screen, then converted to a Shopify Liquid section with real data bindings and theme editor schema.

The theme runs as a second unpublished theme on `knivesfactory.store` for side-by-side comparison with the existing `tactical-armory` theme.

---

## Design Language

Sourced from Stitch project #2 design system:

| Token | Value |
|-------|-------|
| Background | `#0a141e` |
| Surface container | `#17202b` |
| Accent / Primary | `#ff5262` |
| Text | `#d9e3f2` |
| Muted text | `#e3bebd` |
| Headline font | Space Grotesk (Bold/Black, uppercase) |
| Body font | Inter |
| Border radius | `0px` everywhere (sharp corners only) |
| Card shape | `clip-path: polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%)` |
| Button shape | `clip-path: polygon(0 0, 100% 0, 100% 75%, 92% 100%, 0 100%)` |
| Background texture | Radial dot grid (`rgba(255,82,98,0.05)` dots, 40px spacing) |
| No dividers | Section boundaries defined by background color shifts only |

---

## Repo Structure

```
Google-Stitch-Valorant-UI-Design/
├── assets/
│   ├── theme.css          # Design tokens, clip-paths, glows, grid texture
│   └── theme.js           # Cart drawer, sticky header, animations
├── config/
│   ├── settings_schema.json
│   └── settings_data.json
├── layout/
│   └── theme.liquid       # Root layout
├── locales/
│   └── en.default.json
├── sections/
│   ├── announcement-bar.liquid
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero-banner.liquid
│   ├── featured-products.liquid
│   ├── category-grid.liquid
│   ├── trust-bar.liquid
│   ├── main-product.liquid
│   ├── main-collection.liquid
│   ├── main-cart.liquid
│   └── main-about.liquid
├── snippets/
│   ├── product-card.liquid
│   └── price.liquid
└── templates/
    ├── index.json
    ├── product.json
    ├── collection.json
    ├── cart.json
    └── page.about.json
```

---

## Pages

### Home (`templates/index.json`)
**Stitch screen:** "Knives Factory Redesign Concept" (already exists, screen ID `0514d3c8fa8041a69c0014675158b9af`)
**Sections:** announcement-bar → header → hero-banner → category-grid → featured-products → trust-bar → footer

### Product Detail (`templates/product.json`)
**Stitch screen:** To generate — single product with image gallery, HUD stat chips, Add to Cart, related products strip
**Liquid bindings:** `product.title`, `product.price | money`, `product.images`, `product.variants`, `product.type`, `product.vendor`, `product.tags`
**Schema settings:** None (data-driven)

### Collection (`templates/collection.json`)
**Stitch screen:** To generate — filterable product grid with tactical category header
**Liquid bindings:** `collection.title`, `collection.products` paginated by 12, `product-card` snippet
**Schema settings:** Items per row (3/4), show filters toggle

### Cart (`templates/cart.json`)
**Stitch screen:** To generate — line items, quantity controls, order summary, checkout CTA
**Liquid bindings:** `cart.items`, `cart.total_price | money`, `/cart/change` AJAX
**Schema settings:** None

### About (`templates/page.about.json`)
**Stitch screen:** To generate — brand story, tactical imagery, Riot disclaimer
**Schema settings:** Heading, body text, image picker

### Global Components
**Stitch screen:** To generate as part of home — header + footer + announcement bar

| Component | Schema Settings |
|-----------|----------------|
| Announcement bar | Message text, link URL, show/hide |
| Header | Logo text, nav menu picker |
| Footer | Brand tagline, nav links, disclaimer text |

---

## Stitch → Liquid Conversion Workflow

For each page:
1. Generate Stitch screen in project `3118771630089350558`
2. Fetch HTML via `mcp__stitch__get_screen` download URL
3. Strip Tailwind CDN — rewrite utility classes as scoped CSS in `theme.css` (Tailwind CDN is not suitable for production Shopify themes)
4. Replace hardcoded strings with Liquid variables
5. Add `{% schema %}` block for theme editor settings
6. Add `{% stylesheet %}` and `{% javascript %}` blocks if needed
7. Commit section file

---

## Deployment

```bash
# Push to GitHub
git push origin main

# Push to Shopify as unpublished theme
shopify theme push --store ckk43q-vx.myshopify.com --unpublished
```

The theme is pushed unpublished so `tactical-armory` remains live. Preview via Shopify admin theme preview URL.

---

## Out of Scope

- Blog, search, 404, gift card templates (can be added later)
- Mobile-specific Stitch screens (desktop designs adapted with responsive CSS)
- Shopify app integrations (wishlist, reviews) — add after base theme is working
