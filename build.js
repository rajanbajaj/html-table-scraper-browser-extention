const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const browserArg = args.find(arg => arg.startsWith('--browser='));
const browser = browserArg ? browserArg.split('=')[1] : null;

if (!browser || (browser !== 'firefox' && browser !== 'chrome')) {
    console.error('Please specify a valid browser: --browser=firefox or --browser=chrome');
    process.exit(1);
}

const baseManifest = require('./manifest_template.json');
const firefoxSpecific = require('./firefox_specific.json');
const chromeSpecific = require('./chrome_specific.json');

const specificManifest = browser === 'firefox' ? { ...baseManifest, ...firefoxSpecific } : { ...baseManifest, ...chromeSpecific };

// Function to ensure directory exists
function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

// Paths for the manifest files
const distPath = path.join(__dirname, 'dist', browser, 'manifest.json');
const rootPath = path.join(__dirname, 'manifest.json');

// Ensure directories exist and write files
ensureDirectoryExistence(distPath);

// Write to dist folder
fs.writeFileSync(distPath, JSON.stringify(specificManifest, null, 2));

// Replace root manifest.json
fs.writeFileSync(rootPath, JSON.stringify(specificManifest, null, 2));

console.log(`Manifest files for ${browser} have been generated successfully.`);
console.log(`Root manifest.json has been updated for ${browser}.`);

// Add manifest.json to .gitignore if it's not already there
const gitignorePath = path.join(__dirname, '.gitignore');
let gitignoreContent = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';

if (!gitignoreContent.includes('manifest.json')) {
    gitignoreContent += '\n# Generated manifest file\nmanifest.json\n';
    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log('Added manifest.json to .gitignore');
}
