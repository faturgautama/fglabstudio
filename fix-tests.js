const fs = require('fs');
const path = require('path');

// Find all spec files
const { execSync } = require('child_process');
const specFiles = execSync('find src -name "*.spec.ts" -type f', { encoding: 'utf-8' })
    .trim()
    .split('\n');

console.log(`Found ${specFiles.length} spec files to update`);

specFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');

    // Skip if already has commonTestProviders
    if (content.includes('commonTestProviders') || content.includes('commonTestImports')) {
        console.log(`✓ Skipping ${file} (already updated)`);
        return;
    }

    // Skip if it's a service spec (they have different patterns)
    if (file.includes('.service.spec.ts')) {
        console.log(`⊘ Skipping ${file} (service spec)`);
        return;
    }

    let modified = false;

    // Add imports at the top if not present
    if (!content.includes('commonTestProviders')) {
        // Find the last import statement
        const importRegex = /^import .* from .*;$/gm;
        const imports = content.match(importRegex);

        if (imports && imports.length > 0) {
            const lastImport = imports[imports.length - 1];
            const lastImportIndex = content.lastIndexOf(lastImport);
            const insertPosition = lastImportIndex + lastImport.length;

            // Calculate relative path to test-helpers
            const fileDir = path.dirname(file);
            const depth = fileDir.split('/').length - 1; // -1 for 'src'
            const relativePath = '../'.repeat(depth) + 'test-helpers';

            const newImport = `\nimport { commonTestProviders, commonTestImports } from '${relativePath}';`;

            content = content.slice(0, insertPosition) + newImport + content.slice(insertPosition);
            modified = true;
        }
    }

    // Update TestBed.configureTestingModule
    const testBedRegex = /(TestBed\.configureTestingModule\(\{[\s\S]*?imports:\s*\[)([^\]]*?)(\])/;
    const match = content.match(testBedRegex);

    if (match) {
        const [fullMatch, before, imports, after] = match;

        // Check if already has ...commonTestImports
        if (!imports.includes('...commonTestImports')) {
            const updatedImports = imports.trim()
                ? `${imports.trim()}, ...commonTestImports`
                : '...commonTestImports';

            let replacement = `${before}${updatedImports}${after}`;

            // Add providers if not present
            if (!fullMatch.includes('providers:')) {
                replacement = replacement.replace(/\](\s*)\)/, '],\n      providers: [...commonTestProviders]$1)');
            } else {
                // Update existing providers
                replacement = replacement.replace(
                    /(providers:\s*\[)([^\]]*?)(\])/,
                    (m, p1, p2, p3) => {
                        const updatedProviders = p2.trim()
                            ? `${p2.trim()}, ...commonTestProviders`
                            : '...commonTestProviders';
                        return `${p1}${updatedProviders}${p3}`;
                    }
                );
            }

            content = content.replace(fullMatch, replacement);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`✓ Updated ${file}`);
    } else {
        console.log(`- No changes needed for ${file}`);
    }
});

console.log('\nDone!');
