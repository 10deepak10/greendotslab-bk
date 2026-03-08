import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const inputFile = 'index.html';
const demoDir = 'demo';
const sectionsDir = path.join(demoDir, 'sections');
const content = fs.readFileSync(inputFile, 'utf8');

// Ensure directories exist
if (!fs.existsSync(demoDir)) fs.mkdirSync(demoDir);
if (!fs.existsSync(sectionsDir)) fs.mkdirSync(sectionsDir);

// Define Sections to Extract based on comments in index.html
const sectionDefinitions = [
    { name: 'announcement-bar', start: /<!-- Announcements? Bar -->/i, end: /<!-- Header -->/i },
    { name: 'header', start: /<!-- Header -->/i, end: /<!-- Mobile Menu Overlay -->/i },
    { name: 'mobile-menu', start: /<!-- Mobile Menu Overlay -->/i, end: /<!-- =+[\r\n\s]+SECTION: HERO BANNER/i },
    { name: 'hero', start: /<!-- =+[\r\n\s]+SECTION: HERO BANNER/i, end: /<!-- VALUE PROPS -->/i },
    { name: 'value-props', start: /<!-- VALUE PROPS -->/i, end: /<!-- NEW & TRENDING -->/i },
    { name: 'trending', start: /<!-- NEW & TRENDING -->/i, end: /<!-- =+[\r\n\s]+SECTION: CHILDREN'S BEDS/i },
    { name: 'childrens', start: /<!-- =+[\r\n\s]+SECTION: CHILDREN'S BEDS/i, end: /<!-- =+[\r\n\s]+SECTION: UPHOLSTERED OTTOMAN STORAGE BEDS/i },
    { name: 'ottoman', start: /<!-- =+[\r\n\s]+SECTION: UPHOLSTERED OTTOMAN STORAGE BEDS/i, end: /<!-- =+[\r\n\s]+SECTION: LUXURY BED FRAME COLLECTION/i },
    { name: 'luxury', start: /<!-- =+[\r\n\s]+SECTION: LUXURY BED FRAME COLLECTION/i, end: /<!-- =+[\r\n\s]+SECTION: FEATURED BLOGS/i },
    { name: 'blogs', start: /<!-- =+[\r\n\s]+SECTION: FEATURED BLOGS/i, end: /<!-- =+[\r\n\s]+SECTION: PAYMENT OPTIONS/i },
    { name: 'payment', start: /<!-- =+[\r\n\s]+SECTION: PAYMENT OPTIONS/i, end: /<!-- =+[\r\n\s]+SECTION: PROMOTIONAL BANNER STRIP/i },
    { name: 'promo-banners', start: /<!-- =+[\r\n\s]+SECTION: PROMOTIONAL BANNER STRIP/i, end: /<!-- =+[\r\n\s]+SECTION: FOOTER/i },
    { name: 'footer', start: /<!-- =+[\r\n\s]+SECTION: FOOTER/i, end: /<!-- GLOBAL SCRIPTS START -->/i }
];

// Extract shared Tailwind theme/config from input.css
const inputCssContent = fs.readFileSync('src/input.css', 'utf8');
const themeMatch = inputCssContent.match(/@theme \{[\s\S]*?\}/);
const themeBlock = themeMatch ? themeMatch[0] : '';

// Generate Global Base CSS (Preflight + Theme)
console.log('Generating global base CSS...');
const baseCssInputPath = path.join(demoDir, 'base-input.css');
const baseCssOutputPath = path.join(demoDir, 'base.css');
const baseCssInput = `@import "tailwindcss";
${themeBlock}
`;
fs.writeFileSync(baseCssInputPath, baseCssInput);
try {
    // Generate everything, but we'll use it as the "base"
    execSync(`pnpm exec postcss ${baseCssInputPath} -o ${baseCssOutputPath}`, { stdio: 'inherit' });
    fs.unlinkSync(baseCssInputPath);
} catch (error) {
    console.error('Error building base CSS:', error.message);
}

let masterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bedroom King - Demo Assembly</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Urbanist:ital,wght@0,100..900;1,100..900&family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="base.css">
    <style>
        body { font-family: 'Lato', sans-serif; }
    </style>
</head>
<body class="bg-brand-green/10 text-gray-800 overflow-x-hidden">
`;

sectionDefinitions.forEach(section => {
    console.log(`Processing section: ${section.name}`);
    
    const startMatch = content.match(section.start);
    const endMatch = content.match(section.end);

    if (startMatch && endMatch) {
        const sectionHtml = content.substring(startMatch.index, endMatch.index).trim();
        const sectionDir = path.join(sectionsDir, section.name);
        if (!fs.existsSync(sectionDir)) fs.mkdirSync(sectionDir, { recursive: true });

        const htmlPath = path.join(sectionDir, `${section.name}.html`);
        const cssInputPath = path.join(sectionDir, `${section.name}-input.css`);
        const cssOutputPath = path.join(sectionDir, `${section.name}.css`);
        const pkgPath = path.join(sectionDir, 'package.json');

        // Write HTML file
        fs.writeFileSync(htmlPath, sectionHtml);

        // Write package.json
        const pkgContent = {
            name: `section-${section.name}`,
            version: "1.0.0",
            scripts: {
                build: `postcss ${section.name}-input.css -o ${section.name}.css`
            }
        };
        fs.writeFileSync(pkgPath, JSON.stringify(pkgContent, null, 2));

        // Prepare CSS input for Tailwind 4
        const cssInput = `@import "tailwindcss";
@source "./${section.name}.html";
${themeBlock}
`;
        fs.writeFileSync(cssInputPath, cssInput);

        // Run Tailwind build
        try {
            execSync(`pnpm exec postcss ${cssInputPath} -o ${cssOutputPath}`, { stdio: 'inherit' });
            
            // Post-process to remove base layer and preflight comments
            let builtCss = fs.readFileSync(cssOutputPath, 'utf8');
            // Remove everything in @layer base { ... }
            builtCss = builtCss.replace(/@layer base \{[\s\S]*?\n\}/, '/* base layer removed - use global base.css */');
            // Remove preflight-related theme variables if they exist individually
            builtCss = builtCss.replace(/--preflight:[\s\S]*?;/, '/* preflight disabled */');
            
            fs.writeFileSync(cssOutputPath, builtCss);
            
            console.log(`Generated and optimized CSS for ${section.name}`);
            
            // Keep input file for future builds via build-all-sections.js
            // fs.unlinkSync(cssInputPath);
        } catch (error) {
            console.error(`Error building CSS for ${section.name}:`, error.message);
        }

        // Add placeholder to master assembly
        masterHtml += `\n<!-- SECTION: ${section.name} -->\n`;
        masterHtml += `<link rel="stylesheet" href="sections/${section.name}/${section.name}.css">\n`;
        masterHtml += `<div data-include="sections/${section.name}/${section.name}.html"></div>\n`;
    } else {
        console.warn(`Could not find markers for ${section.name}`);
    }
});

masterHtml += `
<!-- GLOBAL SCRIPTS -->
<script src="../dist/global.js"></script>

<!-- SECTION LOADER -->
<script>
  async function loadSections() {
    const includes = document.querySelectorAll('[data-include]');
    for (const el of includes) {
      const url = el.getAttribute('data-include');
      try {
        const response = await fetch(url);
        if (response.ok) {
          el.innerHTML = await response.text();
        } else {
          el.innerHTML = 'Error loading section: ' + url;
        }
      } catch (err) {
        el.innerHTML = 'Fetch error: ' + err.message;
      }
    }
  }
  loadSections();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(demoDir, 'index.html'), masterHtml);
console.log('Demo assembly created at demo/index.html');
