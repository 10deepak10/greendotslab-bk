import fs from 'node:fs';

const inputFile = 'index.html';
const content = fs.readFileSync(inputFile, 'utf8');

// --- Extract Common Boilerplate Parts ---

// 1. Head (meta tags, styles)
const headEndMatch = content.match(/<\/head>/);
const head = content.substring(0, headEndMatch.index + 7);

// 2. Header (announcement bar + header)
const headerStartMatch = content.match(/<!-- Announcement Bar -->|<header/);
const headerEndMatch = content.match(/<\/header>/);
const header = content.substring(headerStartMatch.index, headerEndMatch.index + 9);

// 3. Mobile Menu + Scripts (from end of file)
const mobileMenuMatch = content.match(/<!-- Mobile Menu Overlay -->[\s\S]*?<\/aside>/);
const scriptsMatch = content.match(/<script>[\s\S]*?<\/script>[\s\S]*?<\/body>[\s\S]*?<\/html>/);

const footerMatch = content.match(/<footer[\s\S]*?<\/footer>/);
const footer = footerMatch ? footerMatch[0] : '';

const mobileMenu = mobileMenuMatch ? mobileMenuMatch[0] : '';
const scripts = scriptsMatch ? scriptsMatch[0] : '</body></html>';

const boilerplateStart = `${head}\n<body class="bg-white text-gray-800 overflow-x-hidden">\n${header}`;
const boilerplateEnd = `\n${footer}\n${mobileMenu}\n${scripts}`;

// --- Define Sections to Extract ---
// Using stricter regex to avoid matching across multiple section blocks
const sections = [
    { name: 'hero', startMarker: /<!-- =+[\r\n\s]+SECTION: HERO BANNER[\r\n\s]+=+/ , endMarker: /<!-- VALUE PROPS -->/ },
    { name: 'value-props', startMarker: /<!-- VALUE PROPS -->/, endMarker: /<!-- NEW & TRENDING -->/ },
    { name: 'trending', startMarker: /<!-- NEW & TRENDING -->/, endMarker: /<!-- =+[\r\n\s]+SECTION: CHILDREN'S BEDS/ },
    { name: 'childrens', startMarker: /<!-- =+[\r\n\s]+SECTION: CHILDREN'S BEDS/, endMarker: /<!-- =+[\r\n\s]+SECTION: UPHOLSTERED OTTOMAN STORAGE BEDS/ },
    { name: 'ottoman', startMarker: /<!-- =+[\r\n\s]+SECTION: UPHOLSTERED OTTOMAN STORAGE BEDS/, endMarker: /<!-- =+[\r\n\s]+SECTION: LUXURY BED FRAME COLLECTION/ },
    { name: 'luxury', startMarker: /<!-- =+[\r\n\s]+SECTION: LUXURY BED FRAME COLLECTION/, endMarker: /<!-- =+[\r\n\s]+SECTION: FEATURED BLOGS/ },
    { name: 'blogs', startMarker: /<!-- =+[\r\n\s]+SECTION: FEATURED BLOGS/, endMarker: /<!-- =+[\r\n\s]+SECTION: PAYMENT OPTIONS/ },
    { name: 'payment', startMarker: /<!-- =+[\r\n\s]+SECTION: PAYMENT OPTIONS/, endMarker: /<!-- =+[\r\n\s]+SECTION: PROMOTIONAL BANNER STRIP/ },
    { name: 'promo-banners', startMarker: /<!-- =+[\r\n\s]+SECTION: PROMOTIONAL BANNER STRIP/, endMarker: /<footer/ }
];

// --- Generate Files ---

// Cleanup existing files first
const filesToCleanup = ['1-hero.html', '2-value-props.html', '3-trending.html', '4-childrens.html', '5-ottoman.html', '6-luxury.html', '7-blogs.html', '8-payment.html', '9-promo-banners.html'];
filesToCleanup.forEach(f => { if(fs.existsSync(f)) fs.unlinkSync(f); });

sections.forEach((section, index) => {
    const startMatch = content.match(section.startMarker);
    const endMatch = content.match(section.endMarker);

    if (startMatch && endMatch) {
        // Find the full comment block start and end
        const startIndex = startMatch.index;
        const endIndex = endMatch.index;

        const sectionHtml = content.substring(startIndex, endIndex).trim();
        const fileName = `${index + 1}-${section.name}.html`; 
        const fullHtml = `${boilerplateStart}\n\n${sectionHtml}\n\n${boilerplateEnd}`;
        
        fs.writeFileSync(fileName, fullHtml);
        console.log(`Generated: ${fileName}`);
    } else {
        console.warn(`Warning: Could not find markers for section: ${section.name}`);
    }
});

console.log('Successfully split all sections.');
