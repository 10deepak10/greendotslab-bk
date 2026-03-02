# Bedroom King - Figma to HTML

This project is a static HTML/CSS implementation of the Bedroom King Figma design, focusing on luxury solid wood furniture. It uses Tailwind CSS (v4) for styling.

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [pnpm](https://pnpm.io/) package manager. 

If you don't have `pnpm` installed globally, you can install it via npm:
```bash
npm install -g pnpm
```

## Setup & Running Locally

1. **Install Dependencies**
   Navigate to the project directory and run:
   ```bash
   pnpm install
   ```

2. **Start the CSS Compiler (Watch Mode)**
   To compile Tailwind CSS and watch for changes in `src/input.css`, run:
   ```bash
   pnpm run watch:css
   ```
   *This will continuously output the compiled CSS to `dist/styles.css`.*

3. **Serve the HTML files**
   To view the project in your browser, you need a local web server (to avoid CORS issues or path problems with local files). You can use any static server. 
   
   If you have Python installed, you can simply run:
   ```bash
   python -m http.server 3000
   ```
   Or, you can use `npx` to temporarily run a server without installing it to the project:
   ```bash
   npx serve . -l 3000
   ```

4. **View the Project**
   Open your browser and navigate to:
   [http://localhost:3000](http://localhost:3000)

## Build for Production
To do a one-time build of the CSS without watching for changes, run:
```bash
pnpm run build
```

5. **command fro split**
To do a one-time split:
```bash
pnpm run split-sections
```
