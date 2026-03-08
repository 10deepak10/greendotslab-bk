import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const inputFile = 'index.html';
const demoDir = 'demo';
const sectionsDir = path.join(demoDir, 'sections');
const content = fs.readFileSync(inputFile, 'utf8');

// Extract internal styles from <style> block
const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
const internalStyles = styleMatch ? styleMatch[1].trim() : '';

// Extract global scripts from <!-- GLOBAL SCRIPTS START -->
const scriptMatch = content.match(/<!-- GLOBAL SCRIPTS START -->[\s\S]*?<script>([\s\S]*?)<\/script>[\s\S]*?<!-- GLOBAL SCRIPTS END -->/);
const globalScripts = scriptMatch ? scriptMatch[1].trim() : '';

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

let masterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bedroom King - Demo Assembly</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Urbanist:ital,wght@0,100..900;1,100..900&family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="main.css">
    <style>
        body { font-family: 'Lato', sans-serif; }
    </style>
</head>
<body class="bg-brand-green/10 text-gray-800 overflow-x-hidden">
`;

sectionDefinitions.forEach((section) => {
  console.log(`Processing section: ${section.name}`);

  const startMatch = content.match(section.start);
  const endMatch = content.match(section.end);

  if (startMatch && endMatch) {
    const sectionHtml = content
      .substring(startMatch.index, endMatch.index)
      .trim();
    const sectionDir = path.join(sectionsDir, section.name);
    if (!fs.existsSync(sectionDir))
      fs.mkdirSync(sectionDir, { recursive: true });

    const htmlPath = path.join(sectionDir, `${section.name}.html`);

    // Write HTML file
    fs.writeFileSync(htmlPath, sectionHtml);

    console.log(`Extracted HTML for ${section.name}`);

    // Add placeholder to master assembly
    masterHtml += `\n<!-- SECTION: ${section.name} -->\n`;
    masterHtml += `<div data-include="sections/${section.name}/${section.name}.html"></div>\n`;
  } else {
    console.warn(`Could not find markers for ${section.name}`);
  }
});

// Generate Unified Main CSS
console.log('Generating unified main CSS...');
const mainCssInputPath = path.join(demoDir, 'main-input.css');
const mainCssOutputPath = path.join(demoDir, 'main.css');
const mainCssInput = `@import "tailwindcss";
@source "./sections/**/*.html";
${themeBlock}

/* Internal Styles from index.html */
${internalStyles}
`;
fs.writeFileSync(mainCssInputPath, mainCssInput);

try {
  execSync(`pnpm exec postcss ${mainCssInputPath} -o ${mainCssOutputPath}`, {
    stdio: "inherit",
  });
  // Remove the input file after build
  fs.unlinkSync(mainCssInputPath);
  console.log("Unified main.css generated successfully.");
} catch (error) {
  console.error("Error building unified CSS:", error.message);
}

fs.writeFileSync(path.join(demoDir, "global.js"), globalScripts);

masterHtml += `
<!-- SECTION LOADER -->
<script>
  async function loadSections() {
    const includes = document.querySelectorAll('[data-include]');
    const promises = Array.from(includes).map(async (el) => {
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
    });

    await Promise.all(promises);
    
    // Once all sections are loaded, load the global JS
    console.log('All sections loaded. Initializing global JS...');
    const script = document.createElement('script');
    script.src = 'global.js';
    document.body.appendChild(script);
  }
  loadSections();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(demoDir, 'index.html'), masterHtml);
console.log('Demo assembly created at demo/index.html');
