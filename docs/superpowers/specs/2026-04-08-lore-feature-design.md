# Lore Feature Design
**Date:** 2026-04-08
**Status:** Approved

## Overview
Add a dedicated "Lore" section to knivesfactory.store that displays individual product lore stories. Users can browse all product lores via a central index page or view detailed lore pages for each product alongside its image and shop link.

## User Experience

### Lore Index Page (`/lore`)
- Displays all products that have lore content populated
- Shows product image + lore snippet/excerpt
- Link to individual lore page for each product
- Consistent with existing site styling

### Individual Product Lore Page (`/lore/{product-handle}`)
- **Left side:** Product featured image (same image as product page)
- **Right side:**
  - Product name as heading
  - Full lore text (pulled from product's "lore" metafield)
  - "Shop Now" button linking to the product page
- Side-by-side responsive layout (stacks on mobile)

### Navigation
- Add "Lore" link in header navigation between "Categories" and "Blogs"
- Include in mobile nav as well

## Technical Implementation

### Data Source
- Custom product metafield: `product.metafields.custom.lore` (text type)
- Fetched via Liquid's metafield API
- Only products with non-empty lore field are displayed

### Templates & Files
1. **`templates/lore.liquid`** — Individual lore page template
   - Accepts product handle via URL parameter
   - Displays product image (left), lore text + shop button (right)
   - Responsive grid layout

2. **`templates/lore-index.liquid`** (or custom collection view)
   - Lists all products with lore content
   - Shows product image + excerpt
   - Links to individual lore pages

3. **`sections/header.liquid`** — Update navigation
   - Add "Lore" link in desktop nav (between Categories and Blogs)
   - Add "Lore" link in mobile nav

### Layout & Styling
- Reuse existing theme CSS classes for consistency
- Side-by-side layout: image (40%) + content (60%) on desktop
- Full width stack on mobile (image top, content bottom)
- "Shop Now" button uses existing theme button styling

### Responsive Behavior
- Desktop: Side-by-side layout maintained
- Tablet: Adjust column widths, button sizing
- Mobile: Stack vertically, full-width image, full-width text and button

## Error Handling
- Products without lore metafield: exclude from index
- Lore page with missing product: show 404 or friendly "not found" message
- Empty lore field: skip product in index

## Edge Cases
- Product exists but lore is empty: filter out
- Metafield not yet created: gracefully handle missing field
- Special characters in lore text: ensure proper escaping/rendering

## Dependencies
- Shopify Liquid templating
- Existing theme CSS/styling
- Product metafield "lore" must be configured in Shopify admin

## Success Criteria
- [ ] Lore index page displays all products with lore content
- [ ] Individual lore pages display correctly with image + text + shop button
- [ ] Header navigation includes "Lore" link (desktop & mobile)
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] "Shop Now" button links correctly to product page
- [ ] Styling matches existing theme design
- [ ] No broken links or 404s for valid products
