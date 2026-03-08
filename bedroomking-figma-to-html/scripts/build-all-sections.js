import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const sectionsDir = 'demo/sections';

if (!fs.existsSync(sectionsDir)) {
    console.error('No demo/sections directory found. Please run prepare-demo.js first.');
    process.exit(1);
}

const sections = fs.readdirSync(sectionsDir).filter(f => fs.statSync(path.join(sectionsDir, f)).isDirectory());

console.log(`Found ${sections.length} sections. Building CSS...`);

sections.forEach(section => {
    const sectionPath = path.join(sectionsDir, section);
    if (fs.existsSync(path.join(sectionPath, 'package.json'))) {
        console.log(`Building CSS for: ${section}...`);
        try {
            execSync('pnpm run build', { cwd: sectionPath, stdio: 'inherit' });
            
            // Post-process to keep it minimal (only utilities)
            const cssPath = path.join(sectionPath, `${section}.css`);
            let builtCss = fs.readFileSync(cssPath, 'utf8');
            builtCss = builtCss.replace(/@layer base \{[\s\S]*?\n\}/, '/* base layer removed - use global base.css */');
            builtCss = builtCss.replace(/--preflight:[\s\S]*?;/, '/* preflight disabled */');
            fs.writeFileSync(cssPath, builtCss);
            
            console.log(`Optimized ${section}.css`);
        } catch (error) {
            console.error(`Failed to build ${section}:`, error.message);
        }
    }
});

console.log('All section builds complete.');
