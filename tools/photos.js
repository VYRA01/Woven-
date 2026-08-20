/**
 * Fill in assets/js/photos.js from whatever is sitting in assets/photos/.
 *
 *   npm run photos
 *
 * Drop the files in, name them after the dish, run this. It matches each
 * file to a dish id, works out the five anatomy layers from their numbers,
 * rewrites the manifest between its two markers, and says plainly what it
 * could not place. Nothing else in photos.js is touched, so hand-written
 * entries and the comments above them survive.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const rel = (p) => path.relative(root, p).split(path.sep).join('/');

const KINDS = /\.(jpe?g|png|webp|avif)$/i;
const STACK = ['art-bun-btm', 'art-patty', 'art-cheese', 'art-veg', 'art-bun-top'];
const LAYER_WORDS = {
  'art-bun-btm': ['base', 'heel', 'bottom', 'spod'],
  'art-patty':   ['patty', 'beef', 'kotlet'],
  'art-cheese':  ['cheese', 'cheddar', 'ser'],
  'art-veg':     ['lettuce', 'veg', 'salad', 'salata'],
  'art-bun-top': ['crown', 'top', 'lid', 'gora']
};

/** Every dish id the menu knows about. */
function dishIds() {
  const sandbox = { window: {} };
  new Function('window', fs.readFileSync(path.join(root, 'assets/js/data.js'), 'utf8'))(sandbox.window);
  return sandbox.window.MEATOLOGIA_MENU.dishes.map((d) => d.id);
}

function listing(dir) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((f) => KINDS.test(f)).sort()
    .map((f) => ({ name: f, base: f.replace(KINDS, ''), src: rel(path.join(full, f)) }));
}

/* ── The dishes ─────────────────────────────────────────────────────── */

const ids = dishIds();
const found = new Map();      // dish id -> { src, src2x? }
const strays = [];

for (const file of listing('assets/photos/dishes')) {
  const retina = /@2x$/.test(file.base);
  const id = file.base.replace(/@2x$/, '');

  if (!ids.includes(id)) { strays.push(file.name); continue; }

  const entry = found.get(id) || {};
  entry[retina ? 'src2x' : 'src'] = file.src;
  found.set(id, entry);
}

// a bare @2x with no 1x behind it would fail the test, so say so here
const orphans = [...found].filter(([, e]) => !e.src).map(([id]) => id);
for (const id of orphans) found.delete(id);

/* ── The anatomy stack ──────────────────────────────────────────────── */

const layers = new Map();
const unplaced = [];

for (const file of listing('assets/photos/anatomy')) {
  const name = file.base.toLowerCase();

  // "1-base.png" through "5-crown.png" — the numbering PHOTOS.md asks for
  const numbered = name.match(/^([1-5])\b/);
  let key = numbered ? STACK[Number(numbered[1]) - 1] : null;

  // otherwise go by what the file is called
  if (!key) {
    key = Object.keys(LAYER_WORDS).find((k) => LAYER_WORDS[k].some((w) => name.includes(w))) || null;
  }

  if (!key || layers.has(key)) { unplaced.push(file.name); continue; }
  layers.set(key, file.src);
}

/* ── Write it out ───────────────────────────────────────────────────── */

const q = (s) => "'" + String(s).replace(/'/g, "\\'") + "'";

const dishBlock = [...found]
  .sort((a, b) => ids.indexOf(a[0]) - ids.indexOf(b[0]))
  .map(([id, e]) => '      ' + q(id) + ': { src: ' + q(e.src) +
       (e.src2x ? ', src2x: ' + q(e.src2x) : '') + ' },')
  .join('\n');

const stackReady = STACK.every((k) => layers.has(k));
const layerBlock = stackReady
  ? STACK.map((k, i) => '        { key: ' + q(k) + ', src: ' + q(layers.get(k)) + ' }' +
      (i < STACK.length - 1 ? ',' : '')).join('\n')
  : '';

const file = path.join(root, 'assets/js/photos.js');
let source = fs.readFileSync(file, 'utf8');

function fill(marker, body) {
  const region = new RegExp('([ \\t]*/\\* ' + marker + ':start \\*/\\n)[\\s\\S]*?([ \\t]*/\\* ' + marker + ':end \\*/)');
  if (!region.test(source)) throw new Error('photos.js has no ' + marker + ' markers — put them back, or edit it by hand');
  source = source.replace(region, (all, open, close) => open + (body ? body + '\n' : '') + close);
}

fill('dishes', dishBlock);
fill('layers', layerBlock);
fs.writeFileSync(file, source);

/* ── Say what happened ──────────────────────────────────────────────── */

const say = [];
say.push(found.size ? found.size + ' of ' + ids.length + ' dishes now show a photograph'
                    : 'no dish photographs found — every dish keeps its drawing');

if (stackReady) say.push('anatomy: all five layers in place, the scroll section is photographed');
else if (layers.size) say.push('anatomy: only ' + layers.size + ' of 5 layers (' +
  STACK.filter((k) => !layers.has(k)).join(', ') + ' missing) — it stays drawn until all five are there');

for (const id of orphans) say.push('skipped ' + id + '@2x: there is no 1x file behind it');

if (strays.length) {
  say.push('');
  say.push('not placed, because no dish has that id — rename to match assets/js/data.js:');
  for (const name of strays) say.push('  ' + name);
}
if (unplaced.length) {
  say.push('');
  say.push('not placed in the stack — number them 1- to 5-, bottom layer first:');
  for (const name of unplaced) say.push('  ' + name);
}

say.push('');
say.push('assets/js/photos.js written. Run `npm test` to check every path resolves.');
console.log(say.join('\n'));
