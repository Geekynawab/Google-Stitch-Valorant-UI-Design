# Lore Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated Lore section to the site with index page and individual product lore pages that pull from the custom "lore" metafield on each product.

**Architecture:** Create a lore index page (`/lore`) that lists all products with lore, plus a dynamic lore detail section that displays individual product lore with side-by-side image and text layout. Use Shopify sections for modularity and reusability. Update header navigation to include "Lore" link.

**Tech Stack:** Shopify Liquid, JSON templates, CSS Grid, Metafields API

---

## Task 1: Update Header Navigation

Add "Lore" link to both desktop and mobile navigation.

**Files:**
- Modify: `sections/header.liquid` (lines 36, 325)

- [ ] **Step 1: Locate the desktop nav section in header.liquid**

Find the line with `<a href="/blogs/news" class="desktop-nav__link">Blogs</a>` (around line 36).

- [ ] **Step 2: Add Lore link to desktop nav**

Replace this section:
```liquid
<a href="/blogs/news" class="desktop-nav__link">Blogs</a>
```

With:
```liquid
<a href="/lore" class="desktop-nav__link">Lore</a>
<a href="/blogs/news" class="desktop-nav__link">Blogs</a>
```

- [ ] **Step 3: Add Lore link to mobile nav**

Find the line with `<a href="/blogs/news" class="mobile-nav__link">Blogs</a>` (around line 325).

Replace:
```liquid
<div class="mobile-nav__item">
  <a href="/blogs/news" class="mobile-nav__link">Blogs</a>
</div>
```

With:
```liquid
<div class="mobile-nav__item">
  <a href="/lore" class="mobile-nav__link">Lore</a>
</div>

<div class="mobile-nav__item">
  <a href="/blogs/news" class="mobile-nav__link">Blogs</a>
</div>
```

- [ ] **Step 4: Commit header changes**

```bash
git add sections/header.liquid
git commit -m "feat: add Lore navigation link to header"
```

---

## Task 2: Create Lore Index Section

Create a section that displays all products with lore metafield populated.

**Files:**
- Create: `sections/lore-index.liquid`

- [ ] **Step 1: Create the lore-index.liquid file**

Create the file with this content:

```liquid
<div class="lore-index">
  <div class="container">
    <div class="lore-index__header">
      <h1 class="lore-index__title">Product Lore</h1>
      <p class="lore-index__subtitle">Discover the stories behind our weapons</p>
    </div>

    <div class="lore-index__grid">
      {%- for product in search.results -%}
        {%- if product.metafields.custom.lore -%}
          <div class="lore-index__card">
            <div class="lore-index__image">
              {%- if product.featured_image -%}
                <img
                  src="{{ product.featured_image | image_url: width: 300 }}"
                  alt="{{ product.title }}"
                  loading="lazy">
              {%- endif -%}
            </div>
            <div class="lore-index__content">
              <h3 class="lore-index__product-name">{{ product.title }}</h3>
              <p class="lore-index__collection">
                {%- if product.collections.first -%}
                  {{ product.collections.first.title }}
                {%- endif -%}
              </p>
              <p class="lore-index__excerpt">
                {{ product.metafields.custom.lore | strip_html | truncatewords: 20 }}
              </p>
              <a href="/lore/{{ product.handle }}" class="lore-index__link">Read Lore</a>
            </div>
          </div>
        {%- endif -%}
      {%- endfor -%}
    </div>
  </div>
</div>

{% schema %}
{
  "name": "Lore Index",
  "limit": 1,
  "settings": []
}
{% endschema %}
```

- [ ] **Step 2: Commit the lore-index section**

```bash
git add sections/lore-index.liquid
git commit -m "feat: create lore-index section to display all products with lore"
```

---

## Task 3: Create Lore Detail Section

Create a section that displays individual product lore with side-by-side layout (image left, text right).

**Files:**
- Create: `sections/lore-detail.liquid`

- [ ] **Step 1: Create the lore-detail.liquid file**

Create the file with this content:

```liquid
{%- assign product_handle = request.path | split: '/' | last -%}
{%- assign lore_product = shop.products | where: 'handle', product_handle | first -%}

<div class="lore-detail">
  <div class="container">
    {%- if lore_product -%}
      {%- if lore_product.metafields.custom.lore -%}
        <div class="lore-detail__wrapper">
          <!-- Left: Product Image -->
          <div class="lore-detail__image-section">
            {%- if lore_product.featured_image -%}
              <img
                src="{{ lore_product.featured_image | image_url: width: 600 }}"
                alt="{{ lore_product.title }}"
                class="lore-detail__image"
                loading="eager">
            {%- endif -%}
          </div>

          <!-- Right: Lore Content & Shop Button -->
          <div class="lore-detail__content-section">
            <div class="lore-detail__breadcrumb">
              <a href="/lore">← Back to Lore</a>
            </div>

            <h1 class="lore-detail__title">{{ lore_product.title }}</h1>

            {%- if lore_product.collections.first -%}
              <p class="lore-detail__collection">{{ lore_product.collections.first.title }}</p>
            {%- endif -%}

            <div class="lore-detail__text">
              {{ lore_product.metafields.custom.lore }}
            </div>

            <a
              href="{{ lore_product.url }}"
              class="lore-detail__shop-button button button--primary">
              Shop Now
            </a>
          </div>
        </div>
      {%- else -%}
        <div class="lore-detail__error">
          <p>This product doesn't have lore information yet.</p>
          <a href="/lore">← Back to Lore Index</a>
        </div>
      {%- endif -%}
    {%- else -%}
      <div class="lore-detail__error">
        <h2>Lore Not Found</h2>
        <p>This weapon's lore couldn't be found.</p>
        <a href="/lore">← Back to Lore Index</a>
      </div>
    {%- endif -%}
  </div>
</div>

{% schema %}
{
  "name": "Lore Detail",
  "limit": 1,
  "settings": []
}
{% endschema %}
```

- [ ] **Step 2: Commit the lore-detail section**

```bash
git add sections/lore-detail.liquid
git commit -m "feat: create lore-detail section for individual product lore pages"
```

---

## Task 4: Create Lore Page Template

Create a JSON template that uses the lore-index and lore-detail sections based on the URL.

**Files:**
- Create: `templates/lore.json`

- [ ] **Step 1: Create the lore.json template**

Create the file with this content:

```json
{
  "sections": {
    "lore_index": {
      "type": "lore-index"
    }
  },
  "order": ["lore_index"]
}
```

Note: The template starts with lore-index. For individual product pages (`/lore/{handle}`), we'll use JavaScript routing in the next task.

- [ ] **Step 2: Commit the lore template**

```bash
git add templates/lore.json
git commit -m "feat: create lore page template"
```

---

## Task 5: Create Lore Detail Page Template

Create a separate template for individual lore detail pages that uses the lore-detail section.

**Files:**
- Create: `templates/lore-detail.json`

- [ ] **Step 1: Create the lore-detail.json template**

Create the file with this content:

```json
{
  "sections": {
    "lore_detail": {
      "type": "lore-detail"
    }
  },
  "order": ["lore_detail"]
}
```

- [ ] **Step 2: Commit the lore detail template**

```bash
git add templates/lore-detail.json
git commit -m "feat: create lore-detail page template"
```

---

## Task 6: Create Lore Styling

Add CSS for lore pages to style the index grid and detail side-by-side layout.

**Files:**
- Create: `assets/lore.css`

- [ ] **Step 1: Create the lore.css file**

Create the file with this content:

```css
/* Lore Index Styles */
.lore-index {
  padding: 4rem 0;
}

.lore-index__header {
  text-align: center;
  margin-bottom: 3rem;
}

.lore-index__title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.lore-index__subtitle {
  font-size: 1rem;
  color: #999;
  margin: 0;
}

.lore-index__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.lore-index__card {
  border: 1px solid #333;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.lore-index__card:hover {
  transform: translateY(-4px);
  border-color: #ff5262;
}

.lore-index__image {
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: #0a141e;
}

.lore-index__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lore-index__content {
  padding: 1.5rem;
}

.lore-index__product-name {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
}

.lore-index__collection {
  font-size: 0.75rem;
  color: #ff5262;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 1rem 0;
}

.lore-index__excerpt {
  font-size: 0.9rem;
  color: #ccc;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lore-index__link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #ff5262;
  color: white;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background 0.3s ease;
}

.lore-index__link:hover {
  background: #ff3d5c;
}

/* Lore Detail Styles */
.lore-detail {
  padding: 2rem 0 4rem 0;
  min-height: 60vh;
}

.lore-detail__wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.lore-detail__image-section {
  width: 100%;
}

.lore-detail__image {
  width: 100%;
  height: auto;
  display: block;
  border: 1px solid #333;
}

.lore-detail__content-section {
  padding-top: 1rem;
}

.lore-detail__breadcrumb {
  margin-bottom: 2rem;
}

.lore-detail__breadcrumb a {
  color: #ff5262;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.lore-detail__breadcrumb a:hover {
  color: #fff;
}

.lore-detail__title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.lore-detail__collection {
  color: #ff5262;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 2rem 0;
}

.lore-detail__text {
  font-size: 1rem;
  line-height: 1.8;
  color: #ddd;
  margin-bottom: 2rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.lore-detail__shop-button {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #ff5262;
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background 0.3s ease;
  border: none;
  cursor: pointer;
}

.lore-detail__shop-button:hover {
  background: #ff3d5c;
}

.lore-detail__error {
  text-align: center;
  padding: 4rem 0;
}

.lore-detail__error h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.lore-detail__error p {
  color: #999;
  margin-bottom: 1.5rem;
}

.lore-detail__error a {
  color: #ff5262;
  text-decoration: none;
  transition: color 0.3s ease;
}

.lore-detail__error a:hover {
  color: #fff;
}

/* Responsive: Tablet */
@media (max-width: 768px) {
  .lore-index__grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .lore-index__title {
    font-size: 1.75rem;
  }

  .lore-detail__wrapper {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .lore-detail__title {
    font-size: 1.5rem;
  }
}

/* Responsive: Mobile */
@media (max-width: 480px) {
  .lore-index {
    padding: 2rem 0;
  }

  .lore-index__header {
    margin-bottom: 2rem;
  }

  .lore-index__title {
    font-size: 1.5rem;
  }

  .lore-index__grid {
    grid-template-columns: 1fr;
  }

  .lore-detail {
    padding: 1rem 0 2rem 0;
  }

  .lore-detail__text {
    font-size: 0.9rem;
  }

  .lore-detail__shop-button {
    width: 100%;
    text-align: center;
  }
}
```

- [ ] **Step 2: Link CSS in theme layout**

Open `layout/theme.liquid` and add this line in the `<head>` section (after other asset links):

```liquid
{{ 'lore.css' | asset_url | stylesheet_tag }}
```

- [ ] **Step 3: Commit the lore styles**

```bash
git add assets/lore.css layout/theme.liquid
git commit -m "feat: add lore page styling"
```

---

## Task 7: Create Shopify Page for Lore Index

Create a page object in Shopify that routes `/lore` to use the lore.json template.

**Files:**
- Create a file to help with page setup (optional, for reference)

- [ ] **Step 1: In Shopify Admin, create a new page**

1. Go to **Content > Pages**
2. Click **Add page**
3. Set title to: `Lore`
4. Set slug/URL to: `lore`
5. Add any placeholder content (will be replaced by template)
6. Click **Save**

The page should now be accessible at `/lore` and will use the `lore.json` template automatically.

- [ ] **Step 2: Document the page creation**

No commit needed for this step, but note that the page was manually created in Shopify admin.

---

## Task 8: Set Up Lore Detail Pages for Each Product

For each product with lore, create a corresponding Shopify page.

**Files:**
- Create a guide document for reference

- [ ] **Step 1: In Shopify Admin, create pages for each product**

For each product with lore metafield:
1. Go to **Content > Pages**
2. Click **Add page**
3. Set title to: `[Product Name] Lore` (e.g., "Prime Vandal Lore")
4. Set slug/URL to: `lore/[product-handle]` (e.g., `lore/prime-vandal`)
5. Add placeholder content
6. Click **Save**

The page will use the `lore-detail.json` template and display the product lore.

- [ ] **Step 2: Create a reference document**

Create `docs/LORE_SETUP.md` with instructions:

```markdown
# Lore Pages Setup

To add lore pages for new products:

1. Product must have a custom metafield `custom.lore` populated with lore text
2. In Shopify Admin, go to **Content > Pages**
3. Create a new page with:
   - **Title:** [Product Name] Lore
   - **Slug:** `lore/[product-handle]`
   - Example: For product "prime-vandal", slug is `lore/prime-vandal`

4. The page will automatically display the product lore using the lore-detail.json template

## Bulk Creation

For faster setup with many products, consider using Shopify's bulk operations or CSV import.
```

- [ ] **Step 3: Commit the reference document**

```bash
git add docs/LORE_SETUP.md
git commit -m "docs: add lore pages setup guide"
```

---

## Task 9: Deploy and Test

Deploy the changes to Shopify and verify all pages work.

**Files:**
- No new files

- [ ] **Step 1: Push theme changes to Shopify**

Run:
```bash
shopify theme push
```

Expected: Theme files uploaded successfully.

- [ ] **Step 2: Test the lore index page**

1. Open your site and navigate to `/lore`
2. Verify the lore index loads with all products that have lore metafield
3. Verify images and excerpts display correctly
4. Click a "Read Lore" link and verify it navigates to the product lore page

- [ ] **Step 3: Test individual lore pages**

1. Navigate to `/lore/{product-handle}` for a product you created a page for
2. Verify the side-by-side layout (image left, content right)
3. Verify the "Shop Now" button links to the correct product page
4. Test the breadcrumb back link

- [ ] **Step 4: Test navigation**

1. From the header, click the "Lore" link
2. Verify it navigates to `/lore`
3. Test on mobile and desktop

- [ ] **Step 5: Test responsive design**

1. Resize browser to tablet size (~768px)
2. Verify lore detail layout stacks vertically
3. Resize to mobile (~480px)
4. Verify all elements are readable and button is full-width

- [ ] **Step 6: Final commit**

```bash
git status
```

If there are any uncommitted changes:

```bash
git add .
git commit -m "deploy: lore feature complete"
```

---

## Summary

This plan implements a complete Lore feature with:
- **Header navigation** — "Lore" link added to desktop and mobile nav
- **Lore index page** — Displays all products with lore metafield at `/lore`
- **Individual lore pages** — Side-by-side layout (image + text + shop button) at `/lore/{handle}`
- **Responsive design** — Works on mobile, tablet, and desktop
- **Styling** — Consistent with your existing theme (red accent color, dark background)

Total commits: 6 feature commits + 1 deployment commit
