# Photographs

The site ships with drawings, not photographs, and it is complete that way —
nothing is broken or missing while `assets/js/photos.js` is empty. This is the
list to hand a photographer when Meatologia want their own food on it.

Adding a photograph is one line. Drop the file in `assets/photos/`, name it in
`assets/js/photos.js`, and that dish stops drawing and starts showing the
picture — on the card, in the full-screen takeover, in the filmstrip, and
through the morph between them. Nothing else changes, and dishes you have no
photograph for keep their drawing, so the board can be shot a few dishes at a
time.

Run `npm test` after editing the manifest. It fails with the specific line if a
dish id is wrong, a path points at a file nobody added, or the anatomy stack is
missing a layer.

---

## 1 · The dishes

**One photograph per dish, as many or as few as you like.**

| | |
|---|---|
| Size | 1600 × 1280 or larger — it is displayed as a 5:4 crop |
| Format | JPEG, quality ~80. WebP if you would rather |
| Crop | the dish fills the frame; it is cropped to fill, not fitted |
| Weight | keep each under 300 KB, or the menu grid gets slow on a phone |

```js
dishes: {
  'classic-burger': { src: 'assets/photos/dishes/classic-burger.jpg' },
  'wagyu-smash':    { src: 'assets/photos/dishes/wagyu-smash.jpg' }
}
```

The key is the dish's `id` in `assets/js/data.js` — `classic-burger`,
`cheese-bacon`, `arg-ribeye`, `tatar-klasyk`, and so on for all 38.

Add `src2x` pointing at a double-resolution file if you want it sharp on retina
screens; it is optional, and one well-sized image is usually enough.

## 2 · The scroll section — five shots, not one

`#anatomy` pins the burger and pulls it apart as you scroll. **A single
photograph cannot do this.** There is nothing behind the bun in a flat image;
the layers have to exist separately before they can be separated.

So the burger is photographed **five times, one layer at a time**:

| Shot | File | What is in frame |
|---|---|---|
| 1 | `1-base.png` | the toasted heel with the sauce on it, alone |
| 2 | `2-patty.png` | the heel with the patty on it — *or* the patty alone |
| 3 | `3-cheese.png` | the cheese slice |
| 4 | `4-lettuce.png` | the lettuce and any other garnish |
| 5 | `5-crown.png` | the sesame crown, alone |

**Everything that matters is in how they are shot, not in what they are:**

- **The camera does not move.** Tripod, locked focus, locked exposure, locked
  white balance. Build the burger up and shoot after each layer, or take it
  apart and shoot down — either way the camera stays put between frames.
- **Same light in all five.** Continuous light, not flash, so nothing shifts
  between frames.
- **Same background in all five,** and one that cuts out cleanly — a plain
  sweep, well separated from the food.
- **Cut each one out** and save as PNG or WebP **with transparency**. Keep the
  full frame: do not crop each layer tight to its own food. Every file must be
  the same pixel dimensions, with each layer sitting where it sat in the shot.
  That shared frame is what keeps the stack aligned.
- Roughly 1400 × 2000 each, portrait, so the stack has room to fan out.

```js
anatomy: {
  layers: [
    { key: 'art-bun-btm', src: 'assets/photos/anatomy/1-base.png' },
    { key: 'art-patty',   src: 'assets/photos/anatomy/2-patty.png' },
    { key: 'art-cheese',  src: 'assets/photos/anatomy/3-cheese.png' },
    { key: 'art-veg',     src: 'assets/photos/anatomy/4-lettuce.png' },
    { key: 'art-bun-top', src: 'assets/photos/anatomy/5-crown.png' }
  ]
}
```

Order is bottom of the stack upward, and the `key` values are fixed — they name
the five things the animation moves.

**All five or none.** A photographed crown floating above a drawn patty looks
worse than either on its own, so a part-filled stack falls back to the drawing
and `npm test` says which shots are missing.

**No measuring.** The labels — *Sesame crown*, *Aged cheddar* — find each layer
by reading where its opaque pixels actually are, so a crown that sits high in
its frame still gets its label beside it. If a shot fools the measurement
(heavy shadow baked into the cut-out will do it), add `anchor: 0.34` to that
layer, where 0 is the top of the frame and 1 the bottom.

## 3 · The hero (optional)

```js
hero: { src: 'assets/photos/hero.png' }
```

Replaces the drawn burger at the top of the page. A cut-out on transparency
works best — it sits on the paper background rather than in a box. Without one
the drawing stays, and its layers keep their slow drift.

---

## Before you publish someone else's photographs

These are the restaurant's pictures of the restaurant's food. Get it in writing
that they can be used on the site, and check whether the photographer retained
any rights — a studio shoot is usually licensed, not sold. Nothing in this repo
ships a photograph, which is deliberate: the site is yours to hand over, the
food in it is theirs.
