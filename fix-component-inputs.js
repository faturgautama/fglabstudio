const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all component spec files (not service specs)
const specFiles = execSync('find src -name "*.spec.ts" -type f ! -path "*/*.service.spec.ts"', { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .filter(f => f);

console.log(`Found ${specFiles.length} component spec files to check`);

specFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    // Check if fixture.detectChanges() is called without setting inputs first
    // Pattern: fixture.detectChanges() right after fixture = TestBed.createComponent
    const pattern = /(fixture = TestBed\.createComponent\([^)]+\);[\s\n]*component = fixture\.componentInstance;)([\s\n]*)(fixture\.detectChanges\(\);)/;

    if (pattern.test(content)) {
        // Add a comment to remind about setting inputs
        content = content.replace(
            pattern,
            '$1$2// TODO: Set required @Input() properties here if component has any$2// Example: component.someInput = mockValue;$2$3'
        );

        // Also check if there's already a TODO comment
        if (!content.includes('TODO: Set required @Input()')) {
            modified = true;
        }
    }

    // For specs that call detectChanges without any setup, wrap it in try-catch
    const detectChangesPattern = /(\s+)(fixture\.detectChanges\(\);)(\s+}\);)/g;
    if (detectChangesPattern.test(content) && !content.includes('try {')) {
        content = content.replace(
            /(\s+beforeEach\(async \(\) => \{[\s\S]*?fixture = TestBed\.createComponent[^;]+;[\s\S]*?component = fixture\.componentInstance;)([\s\S]*?)(fixture\.detectChanges\(\);)([\s\S]*?}\);)/,
            (match, before, middle, detectChanges, after) => {
                if (!middle.includes('component.') && !middle.includes('TODO')) {
                    return `${before}${middle}
    // Set component inputs if needed before detectChanges
    ${detectChanges}${after}`;
                }
                return match;
            }
        );
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`✓ Updated ${file}`);
    }
});

console.log('\nDone! Now manually set required inputs for failing tests.');
