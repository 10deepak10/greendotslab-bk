# Bedroom King - Project TODO

## 1.  Figma to HTML Phase (Current)
- [ ] **Complete Static Pages:**
  - [x] Homepage (`index.html`) - *Base layout complete*
    - [ ] Separate sections into different components
    - [ ] Refine product cards to perfectly match Figma (Add to Cart buttons, Klarna/Clearpay tags)
  - [ ] Collection / Category Page
  - [ ] Product Details Page (PDP)
  - [ ] Cart Drawer / Page
  - [ ] Checkout Customization (if applicable)
  - [ ] About Us, Contact, FAQ pages
- [ ] **Responsive Design:** Ensure all pages work perfectly on Mobile, Tablet, and Desktop using Tailwind classes.
- [ ] **Interactivity (JavaScript):**
  - [x] Mobile Navigation Menu (hamburger toggle) - *Implemented in index.html*
  - [ ] Image Carousels / Sliders (e.g., Swiper.js)
  - [ ] Accordions for FAQs or Product Details
  - [ ] Modals/Popups (e.g., Size guide)

## 2.  Shopify Porting Phase (Next)
- [ ] **Initialize Shopify Theme:** Create a new empty theme or duplicate a starter theme (like Dawn) using Shopify CLI.
- [ ] **Structure Migration:** 
  - Move global styles (`dist/styles.css`) to the Shopify `assets/` folder.
  - Update PostCSS/Tailwind config to monitor `.liquid` files instead of `.html`.
- [ ] **Convert HTML to Liquid:**
  - Global Header & Footer -> `sections/header.liquid`, `sections/footer.liquid`
  - Reusable parts (Product Cards) -> `snippets/product-card.liquid`
  - Page specific blocks -> `sections/hero.liquid`, `sections/featured-collection.liquid`
- [ ] **Dynamic Data Integration:**
  - Replace hardcoded text with Shopify Settings (`{{ section.settings.heading }}`).
  - Loop through collections and products (`{% for product in collection.products %}`).
  - Add Shopify's standard forms (Cart form, Contact form).
- [ ] **Asset Management:** Update all `<img>` tags to use Shopify CDN `{{ 'image-name.jpg' | asset_url }}`.

## 3.  Testing & Launch
- [ ] Cross-browser testing (Chrome, Safari, Firefox).
- [ ] Run Lighthouse for performance, accessibility, and SEO audits.
- [ ] Upload to the live/staging Shopify store and test the complete purchase flow.
