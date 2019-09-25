const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
  const files = [
    './dist/elements/runtime-es2015.js',
    './dist/elements/polyfills-es2015.js',
    './dist/elements/scripts.js',
    './dist/elements/main-es2015.js',
  ]
  await fs.ensureDir('elements')
  await concat(files, 'elements/elements.js');
  await fs.copyFile('./dist/elements/styles.css', 'elements/styles.css')
  //await fs.copy('./dist/elements/assets/', 'elements/assets/' )

})()