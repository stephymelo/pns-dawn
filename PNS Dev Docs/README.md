# PNS Dev Docs

Developer documentation for the **Premier Nail Source** Shopify theme (built on Shopify **Dawn 15.5.0**).

➡️ **Open [`index.html`](./index.html) in a browser** — it's the full, PNS-branded reference (new sections, modified components, theme-editor setup, dependencies, gotchas).

## TL;DR

- **Base theme:** Shopify Dawn 15.5.0. Repo: `stephymelo/pns-dawn` (branch `main`).
- **Convention:** everything custom is prefixed `pns-` / "PNS " — section files, CSS/JS assets, CSS classes, and section display names.
- **Each section links its own CSS file** (`assets/pns-<section>.css`). There is no shared mega-stylesheet. Product-card CSS (`pns-card.css`) is loaded from `snippets/card-product.liquid` so it loads wherever a card renders.
- **Two-way GitHub ↔ Shopify sync is live** — the theme editor rewrites the JSON config and pushes commits back. **Always `git pull` before editing and before pushing.** Commits update the *draft* theme only; they do not publish.

## New custom sections

| Section | Files |
|---|---|
| PNS Feature Bar | `sections/pns-feature-bar.liquid`, `snippets/pns-feature-item.liquid`, `assets/pns-feature-bar.css` |
| PNS Home Banner | `sections/pns-home-banner.liquid`, `assets/pns-home-banner.{css,js}` |
| PNS Featured Collection | `sections/pns-featured-collection.liquid`, `assets/pns-featured-collection.css` |
| PNS Brand Slider | `sections/pns-brand-slider.liquid`, `assets/pns-brand-slider.{css,js}` |
| PNS Footer | `sections/pns-footer.liquid`, `assets/pns-footer.css` |
| PNS Breadcrumb Products | `sections/pns-breadcrumb-products.liquid`, `assets/pns-breadcrumb-products.css` |
| PNS Related Products | `sections/pns-related-products.liquid`, `assets/pns-related-products.css` |
| PNS Related Collections | `sections/pns-related-collections.liquid`, `assets/pns-related-collections.css` |
| PNS Brands Page | `sections/pns-brands-page.liquid` |

## Modified Dawn components

`announcement-bar.liquid` (+`pns-announcement.css`), `header.liquid` (+`pns-header.css`, `pns-nav-menu.js`), `snippets/card-product.liquid` (+`pns-card.css`, `pns-quantity-picker.js`), `main-product.liquid` (+`pns-product.css`), `main-collection-product-grid.liquid`, `featured-collection.liquid`, `related-products.liquid`, `multicolumn.liquid`, `image-banner.liquid`.

## Key dependencies

- Product metafield `product_collection.product_collection` → **PNS Related Collections**.
- Navigation menus `main-menu`, `footer`, `footer-products`.
- Theme social settings (`settings.social_*_link`).
- Uploaded assets: footer lotus, Feature Bar icons, brand logos, banner artwork (3200×1280).

See `index.html` for the full breakdown and the theme-editor setup checklist.
