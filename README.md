# Sniper Table Scraper Browser Extension

This is a browser extension to scrape tables from websites. Take control of your data extraction with Sniper Table Scraper!

## Build Instructions

To build the extension for either Chrome or Firefox, follow these steps:

1. Ensure you have Node.js installed on your system.

2. Clone this repository:
   ```
   git clone https://github.com/your-username/html-table-scraper-browser-extension.git
   cd html-table-scraper-browser-extension
   ```

3. Install dependencies (if any):
   ```
   npm install
   ```

4. Create two files in the root directory:
   - `firefox_specific.json`: Add Firefox-specific settings here.
   - `chrome_specific.json`: Add Chrome-specific settings here.

5. Run the build script with the appropriate browser flag:
   
   For Firefox:
   ```
   node build.js --browser=firefox
   ```
   
   For Chrome:
   ```
   node build.js --browser=chrome
   ```

6. After running the build script:
   - A browser-specific manifest will be generated in the `dist/{browser}` folder.
   - The root `manifest.json` file will be updated to match the specified browser.

7. Copy all other necessary files (HTML, CSS, JS, assets) to the respective `dist/{browser}` folder.

8. The extension is now ready to be loaded into the browser:
   - For Chrome: Go to `chrome://extensions/`, enable "Developer mode", and click "Load unpacked". Select the `dist/chrome` folder.
   - For Firefox: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select the `manifest.json` file in the `dist/firefox` folder.

## Development

- Make changes to the base `manifest.json` file for shared configurations.
- Use `firefox_specific.json` and `chrome_specific.json` for browser-specific settings.
- After making changes, re-run the build script with the appropriate browser flag and reload the extension in your browser.

## License

[Add your license information here]

## Author

Rajan Bajaj
