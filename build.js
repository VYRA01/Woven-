/**
 * Bundles the site into one self-contained file: dist/index.html.
 *
 * The source stays split across index.html + assets/ for editing; this
 * inlines the CSS and JS so the page can be dropped anywhere that wants a
 * single file (a preview host, an email attachment, a CMS block).
 *
 *   node build.js
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const html = read('index.html');
const css = read('assets/css/styles.css');
const i18n = read('assets/js/i18n.js');
const menuI18n = read('assets/js/menu-i18n.js');
const data = read('assets/js/data.js');
const core = read('assets/js/booking-core.js');
const main = read('assets/js/main.js');
const booking = read('assets/js/booking.js');

// The standalone bundle is named for the restaurant; index.html keeps the
// longer, search-friendly title for the deployed site.
const title = 'Meatologia';
const body = (html.match(/<body>([\s\S]*?)<\/body>/) || [, ''])[1];

const bundle = [
  `<title>${title}</title>`,
  '<style>',
  css.trim(),
  '</style>',
  body.replace(/<script src="assets\/js\/[^"]+"><\/script>\s*/g, '').trim(),
  '<script>', i18n.trim(), '</script>',
  '<script>', menuI18n.trim(), '</script>',
  '<script>', data.trim(), '</script>',
  '<script>', core.trim(), '</script>',
  '<script>', main.trim(), '</script>',
  '<script>', booking.trim(), '</script>',
  ''
].join('\n');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/index.html'), bundle);

console.log('dist/index.html — ' + (bundle.length / 1024).toFixed(1) + ' KB, no external requests');
