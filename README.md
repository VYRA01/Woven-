# Meatologia — restaurant site

A static site for **Meatologia**, a burger and steak restaurant in Wrocław
(Zwycięska 45/lok. 3). No framework, no build step required, no external
requests — open `index.html` or drop the folder on any static host.

```bash
python3 -m http.server 8000     # preview at http://localhost:8000
node build.js                   # optional: bundle everything into dist/index.html
```

## Files

```
index.html            markup + the inline SVG <symbol> artwork for every dish
assets/css/styles.css the whole stylesheet; design tokens live in :root
assets/js/data.js     the menu — the only file you need to touch to change dishes
assets/js/main.js     interactions: takeover, filtering, hours, booking form
build.js              inlines CSS + JS into a single-file dist/index.html
```

## The dish takeover

Tapping a dish does not open a modal — the card *becomes* a full page. Three
elements are handed across as shared elements, so the artwork, the name and
the price fly into their new positions while everything else cross-fades:

- **View Transitions API** (Chrome, Edge, Safari 18+) — `view-transition-name`
  is moved from the card's artwork, title and price onto their counterparts in
  the takeover inside the `startViewTransition()` callback, then cleared once
  the animation settles so no name is ever claimed twice.
- **FLIP + WAAPI fallback** — where the API is missing, the same motion is
  measured and played by hand with `getBoundingClientRect()` and `animate()`.
- **Filmstrip** along the bottom moves between dishes without leaving the page;
  arrow keys and horizontal swipes do the same thing.
- **Course filtering** reflows the grid with FLIP rather than snapping.
- `prefers-reduced-motion: reduce` skips every one of these paths — the page
  simply appears.

All three paths (View Transitions, FLIP, reduced motion) are exercised the same
way: open, close, cycle, restore focus, leave nothing stuck.

## The anatomy scroll

`#anatomy` pins a burger to the viewport for three screens of scroll and pulls
it apart layer by layer — sesame crown, lettuce, cheddar, patty, base — with a
label pinned to each layer and a step list that lights up as its layer lifts
away.

Scroll position drives a single custom property, `--p` (0 = assembled,
1 = fully apart), set on the section inside a `requestAnimationFrame`; every
layer transform, the label fades, the plate shadow and the progress rail are
all `calc()`s off that one value. Label positions are *measured* from each
layer's real box on every frame rather than predicted, so the artwork can be
redrawn without the labels drifting out of alignment.

Under `prefers-reduced-motion: reduce` the pinning is dropped entirely and the
burger renders already apart, with every step expanded.

**Worth knowing if you edit the artwork:** CSS cannot reach inside a `<use>`
shadow tree, so individual layers cannot be animated where the symbol is drawn
with `<use>` (that is how the menu cards draw theirs — only the whole artwork
animates there). Wherever layers need to move independently, `inlineArt()` /
`fillSvg()` in `main.js` clone the symbol into real nodes first. The hero
burger is cloned for the same reason.

## Editing the menu

Everything lives in `assets/js/data.js`:

```js
{
  id: 'classic',            // unique; also a deep link — #dish-classic opens it
  course: 'burgers',        // must match an id in courses[]
  name: 'The Classic',
  flag: 'Where to start',   // small badge on the card
  price: 42,                // number; the currency is added in the view
  weight: '180 g beef',
  cook: 'Medium',
  pair: "Let's Meat IPA",   // the "drink it with" spec
  short: '…',               // one line on the card
  blurb: '…',               // paragraph in the takeover
  parts: ['…'],             // ingredient chips
  art: 'art-burger',        // id of a <symbol> in index.html
  paint: { '--art-bun': '#e5a94f', … }   // per-dish tint for that symbol
}
```

Add an object to `dishes` and the card, the course filter, the takeover and the
filmstrip all pick it up.

## Artwork

The dishes are layered inline SVG (`art-burger`, `art-steak`, `art-side`,
`art-dessert`, `art-drink`). Each symbol is drawn once in neutral shapes and
tinted per dish through CSS custom properties, with fixed highlight and shadow
gradients layered on top for depth — which is why one burger symbol serves six
burgers on a single set of paths.

**Swap in real photography when you have it.** Replace the `<svg><use>` in
`makeCard()` (`assets/js/main.js`) and in `.takeover-stage` (`index.html`) with
an `<img>`. Nothing about the transitions changes: the shared-element name sits
on the artwork element itself, so a photo morphs exactly the same way.

## Booking form

The kitchen takes bookings by phone, so the form validates the details and
assembles them into a confirmation line with a `tel:` link — it does not post
anywhere. Wire it to a real endpoint by replacing the `submit` handler in
`reservation()`.

## Business data

Address, phone, hours and rating appear in three places: the JSON-LD block in
`<head>`, the `#find` section, and the footer. Change all three together.

> **On the content:** dish names, prices, weights and descriptions are written
> from a photo of the menu board and the Google listing — treat them as
> placeholder copy to replace with the real card from `meatologia.pl`.
> Accurate as written: the address, phone number, 12:00–22:00 hours, the
> 40–160 zł per-person range, and the 4.5 rating from 737 reviews.

## Accessibility and performance

- Keyboard throughout: skip link, focus trap in the takeover, `Esc` to close,
  arrow keys to move between dishes, focus returned to the card you came from.
- Opening hours are computed live — the header chip and the highlighted row in
  the hours table both follow the clock.
- No webfonts, no analytics, no third-party anything: every byte is local.
- Animation is limited to `transform` and `opacity`; scroll handlers are
  throttled through `requestAnimationFrame`.
- Verified in Chromium at 1440px and 390px: no console errors, no horizontal
  page scroll.
