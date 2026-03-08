# Developer Kit: Adding New Sections

This guide outlines the steps to extract a new section from the main `index.html` and include it in the optimized `demo/` environment.

## Overview of the Workflow

1.  **Tagging**: Add comment markers in `index.html`.
2.  **Configuration**: Register the new section in `scripts/prepare-demo.js`.
3.  **Extraction**: Run the preparation script.
4.  **Verification**: Rebuild and serve the demo.

---

## Step 1: Tagging in `index.html`

Ensure the section you want to extract is wrapped in unique comment markers. Use consistent naming conventions.

Example:
```html
<!-- ============================================================
     SECTION: MY NEW SECTION
     ============================================================ -->
<section class="...">
  ...
</section>
<!-- END MY NEW SECTION -->
```

## Step 2: Registering in `prepare-demo.js`

Open `scripts/prepare-demo.js` and add a new entry to the `sectionDefinitions` array.

```javascript
const sectionDefinitions = [
    // ... existing sections
    { 
        name: 'my-new-section', 
        start: /<!-- SECTION: MY NEW SECTION /i, 
        end: /<!-- END MY NEW SECTION/i 
    },
];
```
> [!TIP]
> Use regex with the `/i` flag for case-insensitive matching. Ensure the `end` marker of one section is often the `start` marker of the next to avoid gaps.

## Step 3: Run the Extraction

From the root directory, run:
```bash
node scripts/prepare-demo.js
```
This will:
- Create `demo/sections/my-new-section/`.
- Extract the HTML and generate an initial CSS file.
- Generate a `package.json` for the section.
- Update `demo/index.html` with a placeholder link.

## Step 4: Build and Verify

Ensure all CSS is properly optimized and the demo is updated:
```bash
pnpm run build:demo-css
pnpm run serve:demo
```
Access [http://localhost:3001](http://localhost:3001) to verify layout and styles.

## Troubleshooting

### CSS not appearing?
- Check that the classes used in the HTML match those in `src/input.css`.
- Ensure the `@source` directive in the generated `[section]-input.css` points correctly to the extracted HTML.

### Section overlapping?
- Verify your `start` and `end` regex markers don't overlap with other sections in a way that captures more than intended.
