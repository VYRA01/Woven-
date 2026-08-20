# Meatologia — restaurant site

Website and table-booking system for **Meatologia**, a burger and steak
restaurant in Wrocław (Zwycięska 45/lok. 3). No framework and no dependencies —
the front end is plain HTML/CSS/JS, the server is plain Node.

```bash
npm start        # site + booking API on http://localhost:3000
npm test         # 31 tests: booking rules, the API end to end, translations
npm run build    # bundle everything into a single dist/index.html
```

Bookings need the server. Served as static files instead, the site still works —
the booking form falls back to holding reservations in the visitor's browser and
says plainly that the table needs confirming by phone.

## Files

```
index.html               markup + the inline SVG <symbol> artwork for every dish
assets/css/styles.css    the whole stylesheet; design tokens live in :root
assets/js/data.js        the menu — the only file to touch to change dishes
assets/js/photos.js      photographs, if there are any; empty means "keep drawing"
assets/js/booking-core.js booking rules, shared by the browser and the server
assets/js/booking.js     the reservation flow
assets/js/main.js        takeover, filtering, the anatomy scroll, opening hours
server/server.js         static file server + booking API
server/store.js          the diary, persisted to server/data/bookings.json
server/staff.html        the book, for whoever is working the floor
test/booking.test.js     the suite
PHOTOS.md                the shot list, for whoever photographs the food
build.js                 inlines CSS + JS into a single-file dist/index.html
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

## Languages

English, Polish and Korean, switched from the masthead. The choice is
remembered; on a first visit the browser's own preference is used, falling back
to English.

```
assets/js/i18n.js       interface strings, one block per language
assets/js/menu-i18n.js  dish copy, keyed by dish then language
```

Two rules keep it honest. Dish **names** are never translated — "Tatar 'Nduja"
is what the kitchen calls it in any language. And validation errors travel as
*codes* (`{code: 'seats_left', n: 3, time: '19:00'}`), not sentences, because
the same check runs on the server, which has no idea what the guest is reading;
the page turns the code into a sentence in the active language.

**Adding a language** — say Ukrainian:

1. add `{ code: 'uk', label: 'Українська', locale: 'uk-UA' }` to `languages` in `i18n.js`
2. copy the `en` block, translate it
3. add a `uk` block to each dish in `menu-i18n.js`

`npm test` then reports exactly which keys and which dishes are still missing —
three tests compare every language against English and fail with the list.
Nothing else in the codebase changes.

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

## Photographs

The site draws its food rather than photographing it, and is complete that way.
Real photographs are a manifest entry, not a code change:

```js
// assets/js/photos.js
dishes: { 'classic-burger': { src: 'assets/photos/dishes/classic-burger.jpg' } }
```

That dish now shows the photograph on its card, in the takeover, in the
filmstrip, and through the morph between them; every dish without an entry
keeps its drawing, so the board can be shot a few dishes at a time. `npm test`
fails with the offending line if an id is wrong or a path points at nothing.

`#anatomy` is the exception, and the reason there is a whole document about
this: a single photograph cannot come apart, because there is nothing behind
the bun. That section wants five shots of the same burger, one layer at a time,
same camera and same background — see **[PHOTOS.md](PHOTOS.md)** for the shot
list. Supply fewer than five and it stays drawn rather than mixing the two.

Layer labels are not positioned by hand: each cut-out's alpha channel is
weighed and its centre of mass taken, so a crown shot high in its frame still
gets its label beside it. `anchor` on a layer overrides that if a shot fools it.

No photographs are committed here, deliberately — the site is the deliverable,
the food in it belongs to the restaurant.

## Reservations

A real booking system, not a mailto link.

**The rules** live in `assets/js/booking-core.js` and are loaded by *both* the
browser and the server, so a seating the page offers is a seating the server
will accept:

| | |
|---|---|
| Seatings | 12:00 to 21:00, every 30 minutes |
| Table held | 90 minutes, so a 19:00 booking still occupies seats at 20:00 |
| Capacity | 56 covers at any one moment |
| Party size | 1–12; bigger groups are asked to call |
| Notice | 45 minutes minimum |
| Horizon | 60 days |
| Clock | `Europe/Warsaw`, whatever timezone the server or the guest is in |

Change any of these in one place — `CONFIG` — and the page, the server and the
tests all follow.

**The flow.** Pick a party size and date and the seating grid fills in live:
times that have gone are struck through, full ones are disabled, and ones
running low are outlined. Submitting validates every field, re-checks capacity
*on the server*, and returns a reference like `MT-K7QD3`. From the confirmation
the guest can save a real `.ics` to their calendar, call the restaurant, or
cancel. `Find an existing booking` takes a reference plus the phone number it
was booked with — that pairing is what authorises a cancellation.

**The API**

```
GET  /api/availability?date=YYYY-MM-DD[&guests=n]
POST /api/bookings                 {name, phone, email?, guests, date, time, notes?}
GET  /api/bookings/:ref            existence + status only, no personal details
POST /api/bookings/:ref/cancel     {phone}
GET  /api/staff/bookings           requires X-Staff-Token
```

Bookings are appended to `server/data/bookings.json`, written through a temp
file and renamed so a crash cannot truncate the diary. Swap `server/store.js`
for a database if the restaurant outgrows one process. Submissions are throttled
per IP.

**For the floor.** `/staff` lists the book with covers and cancellations, behind
the token:

```bash
STAFF_TOKEN=pick-something-long npm start
```

**Without the server** — GitHub Pages, or the single-file `dist/index.html` —
there is nothing to POST to. The form detects this, keeps the booking in
`localStorage` (still doing the full availability maths against it) and tells
the guest the table needs confirming by phone. Nothing pretends to be booked
when it isn't.

**Not included:** no confirmation emails or SMS (that needs a mail provider and
credentials), and no card holds or deposits. The email field is collected and
stored for whoever picks up the diary.

## Putting it online

Bookings need the Node process running. Static hosting (GitHub Pages, Netlify,
the single-file `dist/index.html`) serves the site fine but cannot take a real
reservation — see the fallback described above.

**Anywhere that runs a container**

```bash
docker build -t meatologia .
docker run -p 3000:3000 -v meatologia-data:/data \
  -e STAFF_TOKEN=pick-something-long meatologia
```

The diary is written to `/data`, so mount a volume there — without one, every
redeploy starts the book empty.

**Render** — `New > Blueprint`, point it at this repo, and `render.yaml` sets up
the service, the 1 GB disk at `/data` and a generated `STAFF_TOKEN` (read it in
the dashboard). The disk needs a paid plan; on the free tier the filesystem is
wiped on each deploy.

**Railway / Fly / a VPS** — same shape: run `node server/server.js`, set
`BOOKINGS_FILE` to a path on persistent storage, set `STAFF_TOKEN`, point the
domain at it.

**Before it takes real bookings**

- Put it behind HTTPS — guests are typing names and phone numbers.
- Set `STAFF_TOKEN` to something long; without it `/staff` stays shut.
- Check `CONFIG` in `booking-core.js` matches the real room: `seats` is the
  covers available at once and `turnMinutes` how long a table is held.
  `timeZone` is what "has that seating passed?" is measured against — change it
  only if the restaurant moves.
- Decide who watches the diary. There are no notifications yet, so someone has
  to open `/staff` — or wire the `POST /api/bookings` handler to a mail service.

## Business data

Address, phone, hours and rating appear in three places: the JSON-LD block in
`<head>`, the `#find` section, and the footer. Change all three together.

> **On the content:** the menu is transcribed from Meatologia's own board,
> photographed July 2026 — 38 dishes with their real prices, weights and
> ingredient lists, and the restaurant's own words in the Craft section. The
> descriptive sentences under each dish are written for the site; the facts
> around them are the restaurant's.
>
> Worth re-checking before launch: prices move, and the board carries a few
> things the site does not yet — the weekday lunch menu (to 16:00), spirits and
> cocktails, the Steak Art Festival specials, and the 10% service charge on
> groups of eight or more.

## Accessibility and performance

- Keyboard throughout: skip link, focus trap in the takeover, `Esc` to close,
  arrow keys to move between dishes, focus returned to the card you came from.
- Opening hours are computed live — the header chip and the highlighted row in
  the hours table both follow the clock.
- No webfonts, no analytics, no third-party anything: every byte is local.
- Animation is limited to `transform` and `opacity`; scroll handlers are
  throttled through `requestAnimationFrame`.
- Booking errors appear per field, tied to the input with `aria-invalid`, and
  the confirmation takes focus so it is announced.
- Verified in Chromium at 1440px and 390px: no console errors, no horizontal
  page scroll, and the booking flow driven end to end against a live server —
  book, persist, deduct seats, cancel, restore seats, staff view.
