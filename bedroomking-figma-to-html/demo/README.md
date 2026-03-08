# Bedroom King - Demo Environment

This folder contains the isolated HTML sections and their corresponding transpiled Tailwind CSS files, extracted from the main `index.html`. This environment is used for verification and unification before converting components to Shopify Liquid sections.

## Structure

- `index.html`: Master assembly file. It uses a dynamic loader to fetch sections from their source files.
- `base.css`: Global Tailwind preflight and shared theme variables.
- `sections/`: 
  - Each subdirectory represents a self-contained component.
  - `[section].html`: Isolated HTML structure.
  - `[section].css`: Optimized CSS (utilities only, base styles removed).
  - `[section]-input.css`: Source CSS for Tailwind 4 builds.
  - `package.json`: Contains a localized build script for the individual section.

## Commands (from root directory)

### Re-Extract Everything
To re-run the extraction script and refresh all sections:
```bash
node scripts/prepare-demo.js
```

### Build All Section CSS
To rebuild the CSS for every section at once:
```bash
pnpm run build:demo-css
```

### Serve Demo
To start a local server and view the assembly:
```bash
pnpm run serve:demo
```
Access the demo at [http://localhost:3001](http://localhost:3001).

## Notes
- **Optimization**: Per-section CSS files are stripped of the base layer to reduce size. The global `base.css` must be included in the master file (which `index.html` already does).
- **Self-Contained**: Each section folder is designed to be moved or used independently if needed.
