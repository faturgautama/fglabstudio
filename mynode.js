const fs = require('fs');
const path = require('path');
const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';
const dotenv = require('dotenv').config({ path: '.env' }); // Changed from src/.env to .env

const envFileDev = `export const environment = {
    production: ${false},
    SUPABASE_URL: '${process.env.SUPABASE_URL}',
    SUPABASE_KEY: '${process.env.SUPABASE_KEY}',
    RESEND_KEY: '${process.env.RESEND_KEY}'
};
`;

const envFileProd = `export const environment = {
    production: ${true},
    SUPABASE_URL: '${process.env.SUPABASE_URL}',
    SUPABASE_KEY: '${process.env.SUPABASE_KEY}',
    RESEND_KEY: '${process.env.RESEND_KEY}'
};
`;

// Generate environment.ts for development
const targetPathDev = path.join(__dirname, './src/environments/environment.ts');
fs.writeFile(targetPathDev, envFileDev, (err) => {
    if (err) {
        console.error(err);
        throw err;
    } else {
        console.log(successColor, `${checkSign} Successfully generated environment.ts`);
    }
});

// Generate environment.prod.ts for production
const targetPathProd = path.join(__dirname, './src/environments/environment.prod.ts');
fs.writeFile(targetPathProd, envFileProd, (err) => {
    if (err) {
        console.error(err);
        throw err;
    } else {
        console.log(successColor, `${checkSign} Successfully generated environment.prod.ts`);
    }
});