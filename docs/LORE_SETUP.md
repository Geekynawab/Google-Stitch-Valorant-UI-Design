# Lore Pages Setup Guide

## Overview
This guide explains how to create and manage Lore pages for your knivesfactory.store site. Lore pages display individual product stories pulled from the custom "lore" metafield on each product.

## How It Works

- **Lore Index** (`/lore`) — displays all products that have lore content
- **Lore Detail** (`/lore/{product-handle}`) — displays individual product lore with image, text, and "Shop Now" button

Both pages use custom sections (`lore-index` and `lore-detail`) that automatically fetch data from your product's "lore" metafield.

## Step 1: Ensure Products Have Lore Metafield

Before creating pages, make sure your products have the custom `custom.lore` metafield populated with lore text:

1. Go to **Products** in Shopify Admin
2. Select a product
3. Scroll down to **Metafields** section
4. Make sure there's a field called `custom.lore` with text content
5. If not present, you may need to create the metafield definition first:
   - Go to **Settings > Custom Data > Metafields**
   - Create a new metafield definition:
     - **Namespace:** `custom`
     - **Key:** `lore`
     - **Name:** Lore
     - **Type:** Multi-line text
   - Save and start adding lore text to products

## Step 2: Create Lore Index Page

1. In Shopify Admin, go to **Content > Pages**
2. Click **Add page**
3. Set the following:
   - **Title:** `Lore`
   - **URL (slug):** `lore`
   - **Content:** You can leave this blank or add placeholder text (the lore-index section will override it)
4. Click **Save**

The page is now live at `/lore` and will automatically display the `lore-index` section, showing all products with lore content.

## Step 3: Create Individual Lore Detail Pages

For each product that has lore content, create a corresponding page:

1. Go to **Content > Pages**
2. Click **Add page**
3. Set the following:
   - **Title:** `[Product Name] Lore` (e.g., "Prime Vandal Lore")
   - **URL (slug):** `lore/[product-handle]` (e.g., `lore/prime-vandal`)
   - **Content:** Leave blank (the lore-detail section will override it)
4. Click **Save**

Repeat for each product with lore content.

### Finding Product Handles

To find a product's handle:
1. Go to **Products**
2. Click on the product
3. Look at the URL — it will be something like `/products/prime-vandal`
4. The handle is the last part: `prime-vandal`

### Example Pages to Create

If you have these products:
- Prime Vandal → create page at `/lore/prime-vandal`
- Reaver Phantom → create page at `/lore/reaver-phantom`
- Oni Knife → create page at `/lore/oni-knife`

## Step 4: Verify Everything Works

1. Go to your site and navigate to `/lore`
2. You should see a grid of all products with lore, each showing:
   - Product image
   - Product name
   - Collection name
   - First 20 words of lore text
   - "Read Lore" link
3. Click "Read Lore" to verify the detail page loads
4. On the detail page, you should see:
   - Product image (left side)
   - Lore title and text (right side)
   - "Shop Now" button linking to the product

## Step 5: Update Products with New Lore

To add or edit lore for a product:
1. Go to **Products**
2. Select the product
3. Find the `custom.lore` metafield
4. Add or update the lore text
5. Save the product

The lore pages will automatically display the updated text.

## Adding New Products

When you add a new product with lore:
1. Add the `custom.lore` metafield with text
2. Create a page at `/lore/{product-handle}`
3. The product will automatically appear on the `/lore` index page

## Troubleshooting

### Products Don't Appear on Lore Index
- Make sure the product has the `custom.lore` metafield populated (not empty)
- Make sure the metafield namespace is `custom` and key is `lore`
- Try refreshing the page

### Lore Text Not Showing on Detail Page
- Verify the page URL matches the product handle (e.g., `/lore/prime-vandal` for product with handle `prime-vandal`)
- Make sure the product's lore metafield has text in it
- Check the Shopify theme editor to verify the `lore-detail` section is active

### Images Not Showing
- Make sure the product has a featured image set
- Try refreshing the page cache

## Technical Details

### Sections Used
- **`lore-index`** — queries all products and filters by `custom.lore` metafield
- **`lore-detail`** — extracts product handle from URL and displays that product's lore

### Styling
- All styles are in `assets/lore.css`
- Responsive design works on mobile, tablet, and desktop
- Uses the same red accent color (#ff5262) as your existing theme

## Need Help?

If pages aren't displaying correctly:
1. Check that products have non-empty `custom.lore` metafield
2. Verify page URLs match product handles exactly
3. Clear your browser cache
4. Check the Shopify theme editor to ensure sections are assigned to pages
