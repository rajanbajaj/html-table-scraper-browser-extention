const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

// Parse command line arguments
const args = process.argv.slice(2);
const browserArg = args.find(arg => arg.startsWith('--browser='));
const versionArg = args.find(arg => arg.startsWith('--version='));
const browser = browserArg ? browserArg.split('=')[1] : null;
const newVersion = versionArg ? versionArg.split('=')[1] : null;

if (!browser || (browser !== 'firefox' && browser !== 'chrome')) {
    console.error('Please specify a valid browser: --browser=firefox or --browser=chrome');
    process.exit(1);
}

if (!newVersion) {
    console.error('Please specify a version: --version=X.X.X');
    process.exit(1);
}

const baseManifest = require('./manifest_template.json');
const firefoxSpecific = require('./firefox_specific.json');
const chromeSpecific = require('./chrome_specific.json');

// Update version in the base manifest
baseManifest.version = newVersion;

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

console.log(`Manifest files for ${browser} have been generated successfully with version ${newVersion}.`);
console.log(`Root manifest.json has been updated for ${browser} with version ${newVersion}.`);

// Add manifest.json to .gitignore if it's not already there
const gitignorePath = path.join(__dirname, '.gitignore');
let gitignoreContent = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';

if (!gitignoreContent.includes('manifest.json')) {
    gitignoreContent += '\n# Generated manifest file\nmanifest.json\n';
    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log('Added manifest.json to .gitignore');
}

// Function to create zip file
function createZipFile(browser) {
    const zip = new AdmZip();
    const outputFile = `dist/${browser}_extension.zip`;
    const ignoreList = [
        '.git', 
        '.DS_Store', 
        'node_modules', 
        'build.js', 
        '*.zip', 
        'firefox_specific.json', 
        'chrome_specific.json', 
        'manifest_template.json',
        'package.json',
        'package-lock.json',
        'chrome_extension.zip',
        'firefox_extension.zip',
        'html-table-scraper-browser-extention.zip',
        'dist'
    ];

    // Add files to zip
    function addDirectoryToZip(directory, zipPath = '') {
        const files = fs.readdirSync(directory);
        for (const file of files) {
            const filePath = path.join(directory, file);
            const relativePath = path.join(zipPath, file);
            
            if (ignoreList.some(ignore => filePath.includes(ignore))) continue;
            
            if (fs.statSync(filePath).isDirectory()) {
                zip.addFile(relativePath + '/', Buffer.alloc(0));
                addDirectoryToZip(filePath, relativePath);
            } else {
                zip.addLocalFile(filePath, zipPath);
            }
        }
    }

    addDirectoryToZip(__dirname);

    // Write zip file
    zip.writeZip(outputFile);
    console.log(`Created ${outputFile} for deployment`);
}

// Call the function to create zip file
createZipFile(browser);
