/**
 * Photography manifest.
 *
 * Empty by default, and the site runs exactly as it does now — every dish
 * draws its illustration. Add an entry and that dish switches to a photograph
 * with no other change: the card, the full-screen takeover, the filmstrip and
 * the morph between them all follow, because the shared-element name sits on
 * whichever media element is on screen.
 *
 *   dishes['classic-burger'] = {
 *     src:   'assets/photos/dishes/classic-burger.jpg',    // 1600×1280 or larger
 *     src2x: 'assets/photos/dishes/classic-burger@2x.jpg'  // optional
 *   }
 *
 * The key is the dish's `id` in data.js — `classic-burger`, `wagyu-smash`,
 * `arg-ribeye`, `tatar-klasyk`. `npm test` names any that do not match, and
 * any path pointing at a file nobody added.
 *
 * `anatomy.layers` is the scroll section, and it is the one that cannot be
 * done with a single photograph: a flat image has nothing behind the bun.
 * Each layer needs its own shot, on the same background, from the same
 * camera position, saved as a transparent PNG or WebP. Order is bottom of
 * the stack to top; `key` must match the layer the animation moves.
 *
 * Nothing else is required — the labels find each layer by reading where its
 * opaque pixels actually are, so a crown shot slightly higher in frame than
 * the base still gets its label in the right place. `anchor` (0 = top of the
 * frame, 1 = bottom) overrides that measurement if a shot fools it.
 *
 * See PHOTOS.md for the shot list.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MEATOLOGIA_PHOTOS = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return {
    /** dish id -> { src, src2x? }. Anything absent keeps its illustration. */
    dishes: {
      // 'classic-burger': { src: 'assets/photos/dishes/classic-burger.jpg' },
    },

    /** The hero, if you would rather show a photograph than the illustration. */
    hero: null,
    // hero: { src: 'assets/photos/hero.png', src2x: 'assets/photos/hero@2x.png' },

    anatomy: {
      /**
       * Five transparent cut-outs, bottom of the stack first. Leave this
       * empty and the section keeps using the layered illustration. All five
       * or none — a half-filled stack falls back to the drawing.
       */
      layers: [
        // { key: 'art-bun-btm', src: 'assets/photos/anatomy/1-base.png' },
        // { key: 'art-patty',   src: 'assets/photos/anatomy/2-patty.png' },
        // { key: 'art-cheese',  src: 'assets/photos/anatomy/3-cheese.png' },
        // { key: 'art-veg',     src: 'assets/photos/anatomy/4-lettuce.png' },
        // { key: 'art-bun-top', src: 'assets/photos/anatomy/5-crown.png' }
      ]
    }
  };
}));
