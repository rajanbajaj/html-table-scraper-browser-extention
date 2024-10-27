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

3. Install dependencies:
   ```
   npm install
   ```

4. Create two files in the root directory:
   - `firefox_specific.json`: Add Firefox-specific settings here.
   - `chrome_specific.json`: Add Chrome-specific settings here.

5. Build the extension for the desired browser and specify the version:

   For Firefox:
   ```
   npm run build:firefox -- --version=X.X.X
   ```
   
   For Chrome:
   ```
   npm run build:chrome -- --version=X.X.X
   ```
   
   Replace `X.X.X` with the desired version number (e.g., 1.0.0).

6. After running the build script:
   - A browser-specific manifest will be generated in the `dist/{browser}` folder.
   - The root `manifest.json` file will be updated to match the specified browser.
   - A zip file named `{browser}_extension.zip` will be created in the root directory, ready for deployment.

7. The extension is now ready to be loaded into the browser:
   - For Chrome: Go to `chrome://extensions/`, enable "Developer mode", and click "Load unpacked". Select the `dist/chrome` folder.
   - For Firefox: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select the `manifest.json` file in the `dist/firefox` folder.

## Development

- Make changes to the base `manifest.json` file for shared configurations.
- Use `firefox_specific.json` and `chrome_specific.json` for browser-specific settings.
- After making changes, re-run the build script with the appropriate browser flag and version, then reload the extension in your browser.

## Build Commands

The following npm scripts are available for building the extension:

- Build for Firefox:
  ```
  npm run build:firefox -- --version=X.X.X
  ```

- Build for Chrome:
  ```
  npm run build:chrome -- --version=X.X.X
  ```

Replace `X.X.X` with the desired version number.

These commands will:
1. Update the manifest version
2. Generate browser-specific manifest files
3. Create a deployment-ready zip file

## File Structure

- `build.js`: The main build script that handles manifest generation and zip file creation.
- `manifest_template.json`: The base manifest file with shared configurations.
- `firefox_specific.json`: Firefox-specific manifest settings.
- `chrome_specific.json`: Chrome-specific manifest settings.
- `dist/`: Directory containing browser-specific builds.
- `assets/`: Directory containing extension assets (CSS, JS, images, etc.).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Rajan Bajaj

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author

Rajan Bajaj
