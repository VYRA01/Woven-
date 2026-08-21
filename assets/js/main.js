/* ══════════════════════════════════════════════════════════════════════
   Meatologia — interactions

   The centrepiece is the dish takeover: a card does not open a modal, it
   becomes a full page. The artwork, the name and the price are handed to
   the new view as shared elements, so three things fly into place while
   everything else cross-fades. Browsers without the View Transition API
   run the same choreography through FLIP + WAAPI.
   ═════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MENU = window.MEATOLOGIA_MENU;
  var I = window.MEATOLOGIA_I18N;
  var MENU_T = window.MEATOLOGIA_MENU_I18N || {};
  var PHOTOS = window.MEATOLOGIA_PHOTOS || {};
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var OPEN_HOUR = 12;
  var CLOSE_HOUR = 22;
  var PHONE = '+48666854218';

  var hasVT = typeof document.startViewTransition === 'function';
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  function still() { return calm.matches; }

  /* ── Menu ───────────────────────────────────────────────────────── */
  var grid = $('#dish-grid');
  var chipBar = $('.chips');
  var cards = [];
  var course = 'all';

  function tint(dish) {
    return Object.keys(dish.paint || {}).map(function (k) { return k + ':' + dish.paint[k]; }).join(';');
  }

  function courseLabel(id) {
    var c = MENU.courses.filter(function (x) { return x.id === id; })[0];
    return I.t('course.' + id) !== 'course.' + id ? I.t('course.' + id) : (c ? c.label : '');
  }

  /** A dish field in the active language, falling back to the English in data.js. */
  function text(dish, field) {
    var block = (MENU_T[dish.id] || {})[I.language()];
    var value = block && block[field];
    if (value == null || value === '') return dish[field];
    return value;
  }

  /* ── Photography ─────────────────────────────────────────────────
     A dish shows a photograph if photos.js names one and its illustration
     otherwise, and nothing downstream has to know which it got: the card,
     the takeover and the filmstrip all ask for "the media", and the
     shared-element name is put on whichever element came back. */

  function attr(value) { return String(value).replace(/"/g, '&quot;'); }

  /** The photograph for a dish, or null while it still draws its symbol. */
  function photoOf(dish) {
    var p = (PHOTOS.dishes || {})[dish.id];
    return p && p.src ? p : null;
  }

  function imgHTML(photo, cls, alt) {
    return '<img class="' + cls + ' is-photo" src="' + attr(photo.src) + '"' +
      (photo.src2x ? ' srcset="' + attr(photo.src) + ' 1x, ' + attr(photo.src2x) + ' 2x"' : '') +
      ' alt="' + attr(alt || '') + '"' + (alt ? '' : ' aria-hidden="true"') +
      ' loading="lazy" decoding="async">';
  }

  function media(dish, cls) {
    var photo = photoOf(dish);
    if (photo) return imgHTML(photo, cls, dish.name);
    return '<svg class="' + cls + '" viewBox="0 0 320 280" aria-hidden="true">' +
           '<use href="#' + dish.art + '"></use></svg>';
  }

  function makeCard(dish, i) {
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'dish rise';
    el.dataset.id = dish.id;
    el.dataset.course = dish.course;
    el.style.setProperty('--delay', Math.min(i, 8) * 55 + 'ms');
    el.setAttribute('aria-label', I.t('menu.detailsFor', { name: dish.name, price: dish.price }));

    el.innerHTML =
      '<span class="dish-media" style="' + tint(dish) + '">' +
        media(dish, 'dish-pic') +
        '<span class="dish-flag">' + text(dish, 'flag') + '</span>' +
      '</span>' +
      '<span class="dish-body">' +
        '<span class="dish-name">' + dish.name + '</span>' +
        '<span class="dish-short">' + text(dish, 'short') + '</span>' +
      '</span>' +
      '<span class="dish-foot">' +
        '<span class="dish-cost">' + dish.price + '<small>zł</small></span>' +
        '<span class="dish-open">' + I.t('menu.open') + ' <span aria-hidden="true">→</span></span>' +
      '</span>';

    el.addEventListener('click', function () { openDish(dish.id, el); });
    return el;
  }

  function buildMenu(rebuild) {
    var frag = document.createDocumentFragment();
    MENU.dishes.forEach(function (dish, i) {
      var card = makeCard(dish, i);
      cards.push(card);
      frag.appendChild(card);
    });
    grid.appendChild(frag);
    if (rebuild) return;

    MENU.courses.forEach(function (c) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.dataset.course = c.id;
      chip.textContent = courseLabel(c.id);
      chip.setAttribute('aria-pressed', c.id === course ? 'true' : 'false');
      chip.addEventListener('click', function () { filter(c.id); });
      chipBar.appendChild(chip);
    });
  }

  /* Course filter, with the grid reflow animated by FLIP */
  function filter(id) {
    if (id === course) return;
    course = id;

    $$('.chip', chipBar).forEach(function (c) {
      c.setAttribute('aria-pressed', c.dataset.course === id ? 'true' : 'false');
    });

    var before = new Map();
    cards.forEach(function (c) {
      if (!c.classList.contains('gone')) before.set(c, c.getBoundingClientRect());
    });

    cards.forEach(function (c) {
      var hidden = !(id === 'all' || c.dataset.course === id);
      c.classList.toggle('gone', hidden);

      // A card the filter has just put on screen is on screen, whatever the
      // reveal observer thinks. Courses low down the card — sides, dessert,
      // drinks — are never scrolled past before they are filtered to, so
      // they still carry .rise at opacity 0. The appear animation below
      // covers that only while it is filling, and the browser is free to
      // drop a filling animation once it has been replaced — at which point
      // the card silently reverts to invisible and the grid looks empty.
      if (!hidden) c.classList.add('up');
    });

    buildFilmstrip();
    if (still()) return;

    cards.forEach(function (c) {
      if (c.classList.contains('gone')) return;
      var last = c.getBoundingClientRect();
      var first = before.get(c);

      if (!first) {
        c.animate(
          [{ opacity: 0, transform: 'translateY(20px) scale(.95)' }, { opacity: 1, transform: 'none' }],
          { duration: 440, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
        );
        return;
      }
      var dx = first.left - last.left;
      var dy = first.top - last.top;
      if (!dx && !dy) return;
      c.animate(
        [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }],
        { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' }
      );
    });
  }

  /* ── Takeover ───────────────────────────────────────────────────── */
  var over      = $('#takeover');
  var sheet     = $('.takeover-sheet', over);
  var stageDish = $('#dish-art');
  var stageUse  = $('#dish-art-use');
  var stagePic  = $('#dish-photo');
  var strip     = $('#filmstrip');
  var current   = -1;
  var from      = null;      // card the takeover grew out of
  var restoreTo = null;
  var seq       = 0;    // guards against a stale transition callback landing late
  var active    = null; // the in-flight view transition, if any

  /**
   * A new open/close cancels whatever is still animating rather than being
   * refused. Bumping `seq` makes the old transition's callback inert, so a
   * late-landing close cannot hide a dish that has just been opened.
   */
  function supersede() {
    if (active && typeof active.skipTransition === 'function') {
      try { active.skipTransition(); } catch (err) { /* already finished */ }
    }
    active = null;
    return ++seq;
  }

  function shown() {
    return MENU.dishes.filter(function (d) { return course === 'all' || d.course === course; });
  }

  /** Whichever of the two stage elements is currently showing. */
  function stageArt() { return stagePic.hidden ? stageDish : stagePic; }

  function fill(dish) {
    var photo = photoOf(dish);
    if (photo) {
      stagePic.src = photo.src;
      if (photo.src2x) stagePic.srcset = photo.src + ' 1x, ' + photo.src2x + ' 2x';
      else stagePic.removeAttribute('srcset');
      stagePic.alt = dish.name;
      stagePic.hidden = false;
      stageDish.setAttribute('hidden', '');
    } else {
      stageUse.setAttribute('href', '#' + dish.art);
      stagePic.hidden = true;
      stageDish.removeAttribute('hidden');
    }
    $('.takeover-stage').setAttribute('style', tint(dish));

    $('#dish-course').textContent = courseLabel(dish.course) + ' · ' + text(dish, 'flag');
    $('#dish-name').textContent = dish.name;
    $('#dish-blurb').textContent = text(dish, 'blurb');
    $('#dish-weight').textContent = text(dish, 'weight') || '—';
    $('#dish-cook').textContent = text(dish, 'cook') || '—';
    $('#dish-pair').textContent = text(dish, 'pair') || '—';
    $('#dish-price').textContent = dish.price;

    var parts = $('#dish-parts');
    parts.innerHTML = '';
    (text(dish, 'parts') || []).forEach(function (p, i) {
      var li = document.createElement('li');
      li.style.setProperty('--i', i);
      li.textContent = p;
      parts.appendChild(li);
    });

    $$('.frame', strip).forEach(function (f) {
      f.setAttribute('aria-selected', f.dataset.id === dish.id ? 'true' : 'false');
    });
    var active = $('.frame[aria-selected="true"]', strip);
    if (active && active.scrollIntoView) {
      active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: still() ? 'auto' : 'smooth' });
    }
  }

  function buildFilmstrip() {
    strip.innerHTML = '';
    shown().forEach(function (dish) {
      var f = document.createElement('button');
      f.type = 'button';
      f.className = 'frame';
      f.dataset.id = dish.id;
      f.setAttribute('role', 'tab');
      f.setAttribute('aria-selected', 'false');
      f.setAttribute('aria-label', dish.name);
      f.setAttribute('style', tint(dish));
      f.innerHTML = media(dish, 'frame-pic');
      f.addEventListener('click', function () { goTo(dish.id); });
      strip.appendChild(f);
    });
  }

  /* names used by the View Transition API for the shared elements */
  function label(card, on) {
    var pic = card ? $('.dish-pic', card) : null;
    var name = card ? $('.dish-name', card) : null;
    var cost = card ? $('.dish-cost', card) : null;
    if (pic)  pic.style.viewTransitionName  = on ? 'dish-art' : '';
    if (name) name.style.viewTransitionName = on ? 'dish-title' : '';
    if (cost) cost.style.viewTransitionName = on ? 'dish-cost' : '';
  }

  function labelStage(on) {
    stageDish.style.viewTransitionName = '';
    stagePic.style.viewTransitionName = '';
    if (on) stageArt().style.viewTransitionName = 'dish-art';
    $('#dish-name').style.viewTransitionName = on ? 'dish-title' : '';
    $('.dish-price').style.viewTransitionName = on ? 'dish-cost' : '';
  }

  function show() {
    over.hidden = false;
    document.body.classList.add('locked');
  }

  function hide() {
    over.hidden = true;
    over.classList.remove('shutting', 'swapping');
    document.body.classList.remove('locked');
  }

  /* FLIP fallback: grow the artwork out of the card it came from */
  function flip(rect, reverse) {
    var art = stageArt();
    var to = art.getBoundingClientRect();
    if (!to.width || !rect.width) return Promise.resolve();

    var scale = rect.width / to.width;
    var dx = (rect.left + rect.width / 2) - (to.left + to.width / 2);
    var dy = (rect.top + rect.height / 2) - (to.top + to.height / 2);
    var a = { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')' };
    var b = { transform: 'none' };

    var anim = art.animate(reverse ? [b, a] : [a, b], {
      duration: reverse ? 330 : 540,
      easing: 'cubic-bezier(.16,1,.3,1)',
      fill: 'both'
    });
    sheet.animate(
      reverse ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }],
      { duration: reverse ? 300 : 380, easing: 'ease', fill: 'both' }
    );
    return anim.finished.then(function () { anim.cancel(); }).catch(function () {});
  }

  function openDish(id, card) {
    var i = MENU.dishes.findIndex(function (d) { return d.id === id; });
    if (i < 0) return;

    current = i;
    from = card || null;
    restoreTo = document.activeElement;
    buildFilmstrip();
    fill(MENU.dishes[i]);

    var pic = from ? $('.dish-pic', from) : null;
    var rect = pic ? pic.getBoundingClientRect() : null;

    if (still()) { show(); focusSheet(); return; }

    if (hasVT && from) {
      var mine = supersede();
      label(from, true);
      var vt = document.startViewTransition(function () {
        if (mine !== seq) return;      // a newer open/close has taken over
        label(from, false);
        show();
        labelStage(true);
      });
      active = vt;
      var settle = function () {
        labelStage(false);
        if (active === vt) active = null;
      };
      vt.finished.then(settle).catch(settle);
      vt.ready.then(focusSheet).catch(focusSheet);
      return;
    }

    show();
    if (rect) flip(rect, false);
    focusSheet();
  }

  function closeDish() {
    if (over.hidden) return;
    var pic = from ? $('.dish-pic', from) : null;

    function back() {
      if (restoreTo && document.contains(restoreTo)) restoreTo.focus({ preventScroll: true });
      restoreTo = null;
      from = null;
    }

    if (still()) { hide(); back(); return; }

    // make sure the card is on screen, so the artwork has somewhere to land
    if (pic && !onScreen(pic)) pic.scrollIntoView({ block: 'center', behavior: 'auto' });

    if (hasVT && pic && !from.classList.contains('gone')) {
      var mine = supersede();
      var leaving = from;
      labelStage(true);
      var vt = document.startViewTransition(function () {
        if (mine !== seq) return;
        labelStage(false);
        hide();
        label(from, true);
      });
      active = vt;
      var done = function () {
        label(leaving, false);
        if (active === vt) active = null;
        back();
      };
      vt.finished.then(done).catch(done);
      return;
    }

    over.classList.add('shutting');
    var end = function () { hide(); back(); };
    if (pic) flip(pic.getBoundingClientRect(), true).then(end); else end();
  }

  /* Move between dishes without leaving the takeover */
  function goTo(id) {
    var i = MENU.dishes.findIndex(function (d) { return d.id === id; });
    if (i < 0 || i === current) return;

    var dir = i > current ? 1 : -1;
    current = i;
    from = cards.filter(function (c) { return c.dataset.id === id; })[0] || null;
    over.style.setProperty('--swing', (dir > 0 ? -44 : 44) + 'px');

    if (still()) { fill(MENU.dishes[i]); return; }

    over.classList.remove('swapping');
    void over.offsetWidth;                        // restart the CSS animations
    over.classList.add('swapping');
    window.setTimeout(function () { fill(MENU.dishes[i]); }, 215);
    window.setTimeout(function () { over.classList.remove('swapping'); }, 560);
  }

  function step(dir) {
    var list = shown();
    if (!list.length) return;
    var here = list.findIndex(function (d) { return d.id === MENU.dishes[current].id; });
    if (here < 0) here = 0;
    goTo(list[(here + dir + list.length) % list.length].id);
  }

  function onScreen(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }

  function focusSheet() {
    var btn = $('.takeover-close', over);
    if (btn) btn.focus({ preventScroll: true });
  }

  $$('[data-close]', over).forEach(function (el) { el.addEventListener('click', closeDish); });

  document.addEventListener('keydown', function (e) {
    if (over.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDish(); }
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Tab') keepFocus(e);
  });

  function keepFocus(e) {
    var able = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', sheet)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!able.length) return;
    var first = able[0];
    var last = able[able.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* Swipe through dishes on touch */
  (function () {
    var x0 = null, y0 = null;
    sheet.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    sheet.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 1.6) step(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    }, { passive: true });
  }());

  /* ── Inline artwork ─────────────────────────────────────────────── */
  /**
   * CSS cannot reach into a <use> shadow tree, so where the hero's layers
   * need to drift independently the symbol is cloned into real nodes.
   */
  function fillSvg(svg, id) {
    var symbol = document.getElementById(id);
    if (!svg || !symbol) return;
    svg.innerHTML = '';
    Array.prototype.forEach.call(symbol.children, function (node) {
      svg.appendChild(node.cloneNode(true));
    });
  }


  /* The order the animation moves them in, bottom of the stack upward. */
  var STACK = ['art-bun-btm', 'art-patty', 'art-cheese', 'art-veg', 'art-bun-top'];

  /* ── The burger, in three dimensions ──────────────────────────────
     Built rather than drawn. Each layer is a short stack of discs
     standing in a tilted 3D scene, so it has real thickness and real
     space between the layers — scroll lifts them apart along the scene's
     own vertical axis and turns the whole thing as it goes. A flat
     drawing cannot do that however hard you animate it: there is no
     behind to see into.

     Sizes are in `u`, hundredths of the stage's short side, so the whole
     thing scales with its box. `base` is the underside of the layer when
     the burger is shut; `lift` is how far it travels by the time it is
     fully open. */
  var SOLIDS = [
    { key: 'art-bun-btm', kind: 'heel',   r: 24,   t: 7.6, base: 0,    lift: -18   },
    { key: 'art-patty',   kind: 'patty',  r: 25.5, t: 8.5, base: 7.6,  lift: -6.5  },
    { key: 'art-cheese',  kind: 'cheese', r: 26.5, t: 2.2, base: 16.1, lift: 3.5   },
    { key: 'art-veg',     kind: 'veg',    r: 28,   t: 3,   base: 18.3, lift: 11.5, dense: 3 },
    { key: 'art-bun-top', kind: 'crown',  r: 24.5, t: 17,  base: 21.3, lift: 21, dense: 1.25 }
  ];

  /* Half the shut burger, so the scene is built around its own middle and
     grows evenly in both directions instead of climbing out of the frame. */
  var MIDDLE = 19.15;

  /* What else is on the table. Both are built the same way as a layer —
     a stack of discs following a profile — and both stand off to one side
     at a fixed spot in the scene, drifting outward a little as the burger
     opens so the table reads as a table rather than a diagram.

     `toneAt` colours a stack by depth, which is the whole trick for the
     beer: glass at the bottom, then the pour, then the head, then empty
     glass above it. */
  var PROPS = [
    {
      kind: 'cup', r: 9, t: 17, x: -46, y: 22, turn: -12, slim: 1.6,
      // a carton, wider at the mouth, with the edge rolled over at the top
      profile: function (u) { return u > 0.93 ? 1.05 : 0.8 + 0.2 * u; },
      toneAt: function (u) {
        if (u > 0.93) return '#8e241d';                          // the rolled rim
        return mixHex('#a52d24', '#c33e33', u);
      }
    },
    {
      kind: 'glass', r: 7.6, t: 24, x: -48, y: -56, turn: 8, slim: 1.1,
      // straight-sided, a touch heavier at the base
      profile: function (u) { return u < 0.06 ? 0.9 : 0.88 + 0.14 * u; },
      toneAt: function (u) {
        if (u < 0.06) return '#cfd6d2';                          // the thick glass base
        if (u < 0.9) return mixHex('#f2dd72', '#f8ec9e', u);     // cloudy homemade lemonade
        return '#e6ece9';                                        // the glass above it
      }
    }
  ];

  /* Radius across a layer's thickness, 0 at the underside to 1 on top —
     this is what gives each one its shape rather than a plain cylinder. */
  var PROFILE = {
    heel:   function (u) { return 0.86 + 0.14 * Math.pow(u, 0.4); },     // rounded underneath, square where the patty sits
    patty:  function (u) { return 0.95 + 0.07 * Math.sin(u * Math.PI); },// bulges where it pressed on the grill
    cheese: function ()  { return 1; },
    veg:    function ()  { return 1; },
    crown:  function (u) { return Math.sqrt(Math.max(0, 1 - 0.86 * u * u)); }   // the dome
  };

  var TONE = {
    heel:   '#c98a3f',
    patty:  '#54301c',
    cheese: '#f0ad2b',
    veg:    '#6d9b39',
    crown:  '#e3a95b',
    sauce:  '#e8c98a',      // roast garlic
    chip:   '#e8a83c'
  };

  /**
   * How each layer's colour moves through its own thickness.
   *
   * A bun is not one brown. It is pale where it was cut, gold up the
   * sides, and darker across the top where it caught the oven; a patty is
   * near-black on the faces that met the plancha and redder in between.
   * Shading alone cannot say any of that — it only makes one colour
   * lighter and darker.
   */
  /* How hard the depth shading is driven, per layer. This is what gives
     each one its form now: it runs one way through the stack, so it
     ramps smoothly instead of repeating. */
  var DEPTH = { crown: 0.34, heel: 0.3, cheese: 0.26, veg: 0.28 };

  var GRADE = {
    heel:   function (u) { return u > 0.88 ? '#e9c692' : mixHex('#c78a41', '#d3994f', u); },
    patty:  function (u) {
      if (u > 0.9 || u < 0.09) return '#33190c';                 // seared, both faces
      return mixHex('#63381e', '#4c2b18', Math.abs(u - 0.5) * 1.6);
    },
    cheese: function (u) { return u > 0.7 ? '#f6bb3c' : '#e0a022'; },
    veg:    function (u) { return mixHex('#85b44b', '#6a983b', Math.abs(u - 0.6) * 1.5); },
    // Light comes from above, so the crown is *lighter* toward the top.
    // Toasting shows as warmth, not as shadow — and the range is kept
    // short: every slice's rim is visible edge-on, and a ramp that moves
    // faster than a level or two a slice reads as ribbing up the dome.
    crown:  function (u) { return mixHex('#dda257', '#e3ac63', Math.pow(u, 1.2)); }
  };

  /** Blend two hex colours, 0 = first, 1 = second. */
  function mixHex(a, b, t) {
    var x = rgb(a), y = rgb(b);
    var k = Math.min(1, Math.max(0, t));
    return 'rgb(' + x.map(function (c, i) {
      return Math.round(c + (y[i] - c) * k);
    }).join(',') + ')';
  }

  /* ── Colour helpers ───────────────────────────────────────────── */

  /** Channels of a colour, hex or rgb() — the two get passed around here. */
  function rgb(colour) {
    if (colour.charAt(0) === '#') {
      var n = parseInt(colour.slice(1), 16);
      return [n >> 16 & 255, n >> 8 & 255, n & 255];
    }
    return colour.replace(/[^0-9,]/g, '').split(',').map(Number);
  }

  /**
   * Mix a colour toward shadow (amount < 0) or light (amount > 0).
   *
   * Toward warm dark and warm light rather than pure black and white.
   * Food shaded to black goes grey and dead at the bottom of the stack;
   * a bun's shadow is still bun-coloured, only darker and a little redder.
   */
  var SHADOW = [38, 20, 10];
  var LIGHT  = [255, 246, 228];

  function mix(hex, amount) {
    var target = amount < 0 ? SHADOW : LIGHT;
    var k = Math.abs(amount);
    return 'rgb(' + rgb(hex).map(function (c, i) {
      return Math.round(c + (target[i] - c) * k);
    }).join(',') + ')';
  }

  /* Lettuce is not a disc. Cycling a few irregular radii up the stack
     gives it an edge that ripples instead of one that is turned. */
  var RUFFLE = [
    '42% 58% 47% 53% / 57% 43% 57% 43%',
    '56% 44% 59% 41% / 43% 58% 42% 58%',
    '47% 53% 41% 59% / 59% 41% 56% 44%'
  ];

  /* Nothing that came out of an oven is a perfect circle. A percent or
     two of wobble, cycled up the stack, is the difference between bread
     and a turned wooden disc — enough to read, not enough to notice. */
  var WOBBLE = [
    '50% 50% 50% 50% / 50% 50% 50% 50%',
    '49% 51% 50% 50% / 51% 49% 50% 50%',
    '51% 49% 49% 51% / 50% 51% 49% 50%',
    '50% 50% 51% 49% / 49% 50% 51% 50%'
  ];

  /* Deterministic scatter, so seeds and char marks stay where they were
     on the last frame instead of crawling about. */
  function jitter(seed) {
    var x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  /* ── Things that stand up out of the plane ────────────────────────
     Discs lie flat, which is right for a patty and useless for a chip or
     a run of sauce down the side of a bun. Those are quads tipped
     upright.

     One quad each, not two crossed: tipping it up by 90° leaves it facing
     the viewer, and the scene only turns 34° across the whole scroll, so
     none of them ever comes close to edge-on. A second face would double
     the element count to insure against something that cannot happen —
     and so would a wrapper to hold the placement, which is why the
     placement rides on the quad's own transform. */

  function upright(cls, w, h, tone, at) {
    var node = document.createElement('i');
    node.className = 'b3-up ' + cls;
    node.style.setProperty('--w', w);
    node.style.setProperty('--h', h);
    node.style.setProperty('--x', at.x.toFixed(2));
    node.style.setProperty('--y', at.y.toFixed(2));
    node.style.setProperty('--z', at.z.toFixed(2));
    if (at.lean) node.style.setProperty('--lean', at.lean.toFixed(1) + 'deg');
    node.style.background = tone;
    return node;
  }

  /**
   * Sauce and melted cheese running over an edge.
   *
   * Each run hangs from a point on the rim, and they are deliberately
   * uneven — same length all the way round reads as a skirt, not as
   * something that was poured on and went where it wanted.
   */
  function dripsOn(host, opts) {
    // +y is toward the viewer, so half a turn is the front of the bun.
    // Ringing it the whole way round reads as a skirt; keeping the runs
    // to the side you can see reads as sauce that went where it wanted.
    var arc = opts.arc || Math.PI * 2;
    var span = opts.count > 1 ? arc / (opts.count - 1) : 0;

    for (var i = 0; i < opts.count; i++) {
      var angle = Math.PI / 2 - arc / 2 + i * span + (jitter(opts.seed + i) - 0.5) * span * 0.8;
      var drop = opts.drop * (0.45 + jitter(opts.seed + i * 3) * 0.9);
      var wide = opts.wide * (0.7 + jitter(opts.seed + i * 5) * 0.7);

      host.appendChild(upright('b3-drip', wide, drop, opts.tone, {
        x: Math.cos(angle) * opts.r,
        y: Math.sin(angle) * opts.r,
        z: opts.z - drop / 2
      }));
    }
  }

  /* ── Building one layer ───────────────────────────────────────── */

  /**
   * A layer is `n` discs stacked through its thickness, each one lit from
   * the same direction and darkened toward the underside. Enough of them
   * and the profile above reads as a solid.
   */
  function slicesOf(spec) {
    // Enough discs that the profile reads as a curve, not so many that
    // the compositor has to raster a shelf of them every frame.
    var n = Math.max(4, Math.round(spec.t * (spec.slim || spec.dense || 0.85)) + 3);
    var out = [];

    var shape = spec.profile || PROFILE[spec.kind];

    for (var i = 0; i < n; i++) {
      var u = i / (n - 1);
      var r = shape(u) * spec.r;
      var tone = spec.toneAt ? spec.toneAt(u)
               : GRADE[spec.kind] ? GRADE[spec.kind](u)
               : TONE[spec.kind];

      var slice = document.createElement('i');
      slice.className = 'b3-slice';
      slice.style.setProperty('--r', r);
      slice.style.setProperty('--z', ((u - 0.5) * spec.t).toFixed(2));

      // Flat per slice, shaded by how deep it sits. The highlight is a
      // separate layer sized to the whole layer rather than to the slice
      // (see .b3-slice in the stylesheet) — give each disc its own and
      // the stack reads as a set of concentric rings, not as a solid.
      var shade = mix(tone, -(DEPTH[spec.kind] || 0.34) * (1 - u));
      slice.style.backgroundColor = shade;
      // Each disc covers all but a sliver of the one beneath it, and that
      // sliver is a slightly different colour — twenty-five of them up a
      // dome is a corduroy. A soft glow in the disc's own colour feathers
      // the edge so the steps blend instead of banding.
      slice.style.setProperty('--tone', shade);

      // the lettuce and the cheese are not discs, and the bread is not
      // quite one either
      if (spec.kind === 'veg') {
        slice.style.borderRadius = RUFFLE[i % RUFFLE.length];
        slice.style.setProperty('--turn', (i * 31) + 'deg');
      } else if (spec.kind === 'cheese') {
        slice.style.borderRadius = '19%';
        slice.style.setProperty('--turn', '14deg');
      } else {
        // no turn here: rotating a not-quite-circle a little further on
        // every slice makes the stack's rims read as ribs up the dome
        slice.style.borderRadius = WOBBLE[Math.floor(i / 3) % WOBBLE.length];
      }

      // the grill marks only show once the bun lifts off the patty
      if (spec.kind === 'patty' && i === n - 1) slice.appendChild(charMarks(r));

      if (spec.kind === 'glass' && u > 0.80) slice.style.borderRadius = RUFFLE[i % RUFFLE.length];

      // roast-garlic sauce, spread on the heel and gone over the sides
      if (spec.kind === 'heel' && i === n - 1) {
        slice.style.backgroundColor = mix(TONE.sauce, -0.04);
        slice.style.borderRadius = RUFFLE[1];
      }

      // seeds sit on the dome, each on the disc whose rim it belongs to
      if (spec.kind === 'crown' && u > 0.25 && i % 4 === 0 && i < n - 1) seedsOn(slice, r, i);

      out.push(slice);
    }
    return out;
  }

  function charMarks(r) {
    var g = document.createElement('span');
    g.className = 'b3-char';
    for (var i = 0; i < 5; i++) {
      var across = (i - 2) * r * 0.32;
      var bar = document.createElement('b');
      // the bars are chords of the disc, so they stop at its edge instead
      // of running out past a patty that is round
      bar.style.setProperty('--w', (Math.sqrt(Math.max(0, r * r - across * across)) * 1.7).toFixed(1));
      bar.style.setProperty('--y', across.toFixed(1));
      g.appendChild(bar);
    }
    return g;
  }

  function seedsOn(slice, r, i) {
    for (var k = 0; k < 3; k++) {
      var angle = jitter(i * 7 + k) * Math.PI * 2;
      // out near the rim, or the next disc up simply covers it
      var reach = r * (0.9 + jitter(i * 13 + k) * 0.12);
      var seed = document.createElement('u');
      seed.className = 'b3-seed';
      seed.style.setProperty('--x', (Math.cos(angle) * reach).toFixed(1));
      seed.style.setProperty('--y', (Math.sin(angle) * reach * 0.92).toFixed(1));
      // lying along the surface, not all pointing the same way
      seed.style.setProperty('--turn', ((angle * 57.3) + 90).toFixed(0) + 'deg');
      seed.style.setProperty('--k', (0.82 + jitter(i * 5 + k) * 0.36).toFixed(2));
      slice.appendChild(seed);
    }
  }

  /**
   * Build the whole scene. The layer elements carry the same `art-*`
   * classes the drawing used, so the labels go on finding them and
   * measuring where they have got to — a 3D-transformed box still
   * reports where it landed on screen.
   */
  function build3D(host) {
    host.innerHTML = '';
    host.classList.add('is-3d');

    var scene = document.createElement('div');
    scene.className = 'b3-scene';

    SOLIDS.forEach(function (spec, i) {
      var layer = document.createElement('div');
      layer.className = 'b3-layer art-layer ' + spec.key + ' b3-' + spec.kind;
      layer.style.setProperty('--d', spec.r * 2);
      layer.style.setProperty('--rest', (spec.base + spec.t / 2 - MIDDLE).toFixed(2));
      layer.style.setProperty('--lift', spec.lift);
      slicesOf(spec).forEach(function (slice) { layer.appendChild(slice); });
      trim(layer, spec);
      if (SOLIDS[i + 1]) contact(layer, spec, SOLIDS[i + 1].r);
      scene.appendChild(layer);
    });

    PROPS.forEach(function (spec) { scene.appendChild(prop(spec)); });

    host.appendChild(scene);
    return scene;
  }

  /**
   * The shadow a layer casts on the one under it.
   *
   * Without it every layer looks like it is hovering a millimetre clear
   * of the next, which is what makes a stack of discs read as a stack of
   * discs. It lives on the lower layer's top face and is gone by the time
   * the burger is a fifth open, because by then there is daylight between
   * them and nothing to catch a contact shadow.
   */
  function contact(layer, spec, above) {
    // Only the sliver of this layer's face that the one above does not
    // cover can show a contact shadow at all. So it is a ring sitting on
    // the upper layer's footprint, not a disc over the whole face —
    // which is just a dark lid.
    var mark = document.createElement('u');
    mark.className = 'b3-ao';
    mark.style.setProperty('--r', (above * 1.3).toFixed(1));
    mark.style.setProperty('--z', (spec.t / 2 + 0.05).toFixed(2));
    layer.appendChild(mark);
  }

  /** A single soft sheen standing in front of a layer. */
  function gloss(layer, spec, size) {
    var g = document.createElement('u');
    g.className = 'b3-gloss';
    g.style.setProperty('--w', (spec.r * 1.7).toFixed(1));
    g.style.setProperty('--h', (spec.t * (size || 1.5)).toFixed(1));
    g.style.setProperty('--x', (-spec.r * 0.1).toFixed(1));
    g.style.setProperty('--y', (spec.r * 0.8).toFixed(1));
    g.style.setProperty('--z', (spec.t * 0.14).toFixed(1));
    layer.appendChild(g);
  }

  /** What runs over the edge of a layer once it is built. */
  function trim(layer, spec) {
    // Only the cheese gets a sheen. On the dome a translucent panel in
    // front of twenty-five disc edges brings every one of them back as
    // moiré — the depth shading already does that job there.
    if (spec.kind === 'cheese') gloss(layer, spec, 5);
    if (spec.kind === 'cheese') {
      // cheddar laid on straight off the grill goes over the sides
      dripsOn(layer, { count: 7, r: spec.r * 0.94, z: -spec.t / 2, arc: 4.2,
        drop: 5.5, wide: 3.4, tone: mix(TONE.cheese, -0.06), seed: 31 });
    }
    if (spec.kind === 'heel') {
      // and so does the sauce, from under the patty rather than over it
      dripsOn(layer, { count: 4, r: spec.r * 0.97, z: spec.t / 2, arc: 2.4,
        drop: 3.2, wide: 2.6, tone: mix(TONE.sauce, -0.16), seed: 77 });
    }
  }

  /* ── The rest of the table ────────────────────────────────────── */

  /**
   * A prop is a layer that does not lift: same stack of discs, parked at
   * its own spot on the table. The fries carton gets chips standing in
   * it; the glass gets nothing, because the pour is in the stack itself.
   */
  function prop(spec) {
    var node = document.createElement('div');
    node.className = 'b3-prop b3-' + spec.kind;
    node.style.setProperty('--d', spec.r * 2);
    node.style.setProperty('--x', spec.x);
    node.style.setProperty('--y', spec.y);
    node.style.setProperty('--rest', (spec.t / 2 - MIDDLE).toFixed(2));
    node.style.setProperty('--turn', (spec.turn || 0) + 'deg');

    slicesOf(spec).forEach(function (slice) { node.appendChild(slice); });
    if (spec.kind === 'cup') chips(node, spec);
    if (spec.kind === 'glass') lemonade(node, spec);
    return node;
  }

  /**
   * Chips standing in the carton, leaning every which way.
   *
   * Each one is graded down its own length — dark where it is buried,
   * golden at the tip — because a chip lit flat is a lolly stick.
   */
  function chips(node, spec) {
    for (var i = 0; i < 11; i++) {
      var angle = jitter(i * 9 + 2) * Math.PI * 2;
      var reach = spec.r * 0.66 * Math.sqrt(jitter(i * 4 + 5));
      var tall = spec.t * (0.74 + jitter(i * 6) * 0.52);
      var wide = 2.1 + jitter(i * 3 + 1) * 1.1;
      var warm = 0.1 - jitter(i) * 0.2;

      var skin = 'linear-gradient(to top, ' +
        mix(TONE.chip, warm - 0.42) + ', ' +
        mix(TONE.chip, warm) + ' 46%, ' +
        mix(TONE.chip, warm + 0.2) + ')';

      node.appendChild(upright('b3-chip', wide, tall, skin, {
        x: Math.cos(angle) * reach,
        y: Math.sin(angle) * reach,
        // buried to just under half its length, so every chip clears the
        // rim instead of the short ones disappearing into the carton
        z: spec.t * 0.05 + tall / 2,
        lean: (jitter(i * 11) - 0.5) * 18
      }));
    }
  }

  /**
   * What turns a glass of yellow into a lemonade: ice standing proud of
   * the surface, a wheel of lemon on the rim, and a straw.
   */
  function lemonade(node, spec) {
    var top = spec.t / 2;

    // Three, not four, and near enough opaque. Stacked translucent
    // quads stop reading as cubes and start reading as one milky slab
    // across the top of the glass.
    var ICE = [
      { x: -0.42, y:  0.30, z: -0.6, lean:  14, k: 1    },
      { x:  0.34, y: -0.26, z:  1.1, lean: -22, k: 0.86 },
      { x:  0.02, y:  0.46, z:  2.4, lean:  36, k: 0.74 }
    ];
    ICE.forEach(function (cube) {
      node.appendChild(upright('b3-ice', 4 * cube.k, 3.6 * cube.k,
        'linear-gradient(148deg, rgba(255,255,255,.94), rgba(222,241,246,.82) 58%, rgba(188,219,228,.86))', {
          x: spec.r * cube.x,
          y: spec.r * cube.y,
          z: top + cube.z,
          lean: cube.lean
        }));
    });

    // the wheel on the near rim, the straw on the far side of it, so
    // neither is standing in front of the other
    node.appendChild(upright('b3-wheel', 7.4, 7.4,
      'radial-gradient(circle at 50% 50%, #fffbe0 22%, #efcb35 26%, #f9ea90 66%, #d9ae24)', {
        x: -spec.r * 0.82, y: spec.r * 0.5, z: top + 0.4, lean: -16
      }));

    node.appendChild(upright('b3-straw', 1.8, spec.t * 0.9,
      'repeating-linear-gradient(-160deg, #b8352c 0 22%, #fdf6e8 22% 44%)', {
        x: spec.r * 0.34, y: -spec.r * 0.1, z: top + spec.t * 0.24, lean: 12
      }));
  }

  /**
   * Replace the drawn burger with five photographed layers.
   *
   * Returns null unless every layer in STACK has a shot, because half a
   * stack is worse than none — a photographed crown floating over a drawn
   * patty. The classes are the same ones the drawing uses, so the scroll
   * transforms and the labels carry on working untouched.
   */
  function stackPhotos(host, layers) {
    var by = {};
    (layers || []).forEach(function (l) { if (l && l.key && l.src) by[l.key] = l; });
    for (var i = 0; i < STACK.length; i++) if (!by[STACK[i]]) return null;

    host.innerHTML = '';
    host.classList.add('is-photo-stack');

    return STACK.map(function (key) {
      var spec = by[key];
      var img = document.createElement('img');
      img.className = 'art-layer ' + key;
      img.alt = '';
      img.decoding = 'async';
      if (spec.src2x) img.srcset = spec.src + ' 1x, ' + spec.src2x + ' 2x';
      img.src = spec.src;
      if (typeof spec.anchor === 'number') img.dataset.anchor = spec.anchor;
      host.appendChild(img);
      return img;
    });
  }

  /**
   * Where a cut-out actually sits in its frame, 0 (top) to 1 (bottom).
   *
   * A transparent PNG is mostly nothing, and the element's box says nothing
   * about where the food is inside it — so the alpha channel is weighed and
   * its centre of mass taken. That is what lets a label find a crown shot
   * high in frame without anyone measuring anything by hand.
   */
  function anchorOf(img) {
    if (img.dataset.anchor) return Number(img.dataset.anchor);
    if (img._anchor != null) return img._anchor;
    if (!img.complete || !img.naturalWidth) return 0.5;

    var value = 0.5;
    try {
      var h = 96;
      var w = Math.max(1, Math.round(h * img.naturalWidth / img.naturalHeight));
      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      var data = ctx.getImageData(0, 0, w, h).data;

      var weighted = 0, total = 0;
      for (var y = 0; y < h; y++) {
        var row = 0;
        for (var x = 0; x < w; x++) row += data[(y * w + x) * 4 + 3];
        weighted += row * y;
        total += row;
      }
      if (total) value = (weighted / total + 0.5) / h;
    } catch (err) {
      value = 0.5;                    // no 2d context, or the canvas is tainted
    }
    img._anchor = value;
    return value;
  }

  /** The part of an <img> box the picture is really drawn in (object-fit: contain). */
  function drawn(img, box) {
    var nw = img.naturalWidth, nh = img.naturalHeight;
    if (!nw || !nh) return { top: box.top, height: box.height };
    var scale = Math.min(box.width / nw, box.height / nh);
    var height = nh * scale;
    return { top: box.top + (box.height - height) / 2, height: height };
  }

  /* ── Anatomy: the burger comes apart on scroll ──────────────────── */
  function anatomy() {
    var section = $('#anatomy');
    if (!section) return;

    var host = $('.anat-burger', section);
    var shots = stackPhotos(host, (PHOTOS.anatomy || {}).layers);
    if (!shots) build3D(host);

    heroArt();

    var track = $('.anat-track', section);
    var steps = $$('.anat-list li', section);
    var stage = $('.anat-art', section);

    // The scene is measured in hundredths of the stage's short side, so
    // the burger is the same shape in a tall desktop column as in a wide
    // phone one. One number, set here, drives every size in the CSS.
    function sizeScene() {
      var box = stage.getBoundingClientRect();
      stage.style.setProperty('--u', (Math.min(box.width, box.height) / 100) + 'px');
    }
    sizeScene();

    // Each label is pinned to the layer it names. Reading the layer's real
    // box beats predicting it — the artwork can be redrawn and the labels
    // still land in the right place.
    var tags = $$('.anat-tag', section).map(function (el, i) {
      return { el: el, layer: $('.' + ['art-bun-top', 'art-veg', 'art-cheese', 'art-patty', 'art-bun-btm'][i], section) };
    });

    function placeTags() {
      var base = stage.getBoundingClientRect();

      // Where each label wants to be: the middle of the layer it names.
      var want = [];
      tags.forEach(function (tag) {
        if (!tag.layer) return;
        var box = tag.layer.getBoundingClientRect();
        var middle;
        if (tag.layer.tagName === 'IMG') {
          var seen = drawn(tag.layer, box);
          middle = seen.top + seen.height * anchorOf(tag.layer);
        } else {
          // an <svg> group's box is tight, and a 3D-transformed layer
          // reports the box it actually projects onto the screen
          middle = box.top + box.height / 2;
        }
        want.push({ el: tag.el, y: middle - base.top });
      });

      // Two layers can sit closer together than their labels are tall —
      // cheese and lettuce nearly always do. Push overlapping labels
      // apart, then pull them back wherever there turned out to be room,
      // so a crowded pair separates without dragging the rest down.
      var gap = (want[0] ? want[0].el.offsetHeight : 30) + 14;
      var run = want.slice().sort(function (a, b) { return a.y - b.y; });

      for (var i = 1; i < run.length; i++) {
        if (run[i].y - run[i - 1].y < gap) run[i].y = run[i - 1].y + gap;
      }
      for (var j = run.length - 2; j >= 0; j--) {
        if (run[j + 1].y - run[j].y > gap) run[j].y = Math.min(run[j].y, run[j + 1].y - gap);
      }

      want.forEach(function (item) { item.el.style.top = item.y + 'px'; });
    }

    function settle() { sizeScene(); placeTags(); }

    /* The scene is built and measured in the same breath, and the first
       frame after inserting it is too early — the layers have not been
       through layout with their sizes yet, so every one of them reports
       the same empty box and the labels are spread apart from nothing.
       Waiting a frame past that gives real numbers. */
    function settleSoon() {
      requestAnimationFrame(function () { requestAnimationFrame(settle); });
    }

    /**
     * Re-measure when the stage changes size, and again when it is
     * actually on screen.
     *
     * The scrolling path re-measures on every frame, so it corrects
     * itself. The reduced-motion path places the labels once and stops —
     * and measured while the section is still below the fold, a promoted
     * 3D layer reports the box it had before its transform, so all five
     * come back stacked in the same place and the labels are spread out
     * from nothing. Waiting until it is in view is what makes that
     * measurement real; the size watch then covers late webfonts, a
     * rotated phone and a resized window.
     */
    function watch() {
      if (window.ResizeObserver) new ResizeObserver(settle).observe(stage);
      else window.addEventListener('resize', settle);

      if (window.IntersectionObserver) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) { if (entry.isIntersecting) settle(); });
        }, { rootMargin: '200px' }).observe(stage);
      }
      window.addEventListener('load', settle);
    }

    // a shot that arrives late has to be measured and the labels moved again
    (shots || []).forEach(function (img) {
      if (img.complete) return;
      img.addEventListener('load', settleSoon);
    });

    if (still()) {
      section.style.setProperty('--p', '1');
      steps.forEach(function (li) { li.classList.add('lit'); });
      settleSoon();
      watch();
      return;
    }

    var pending = false;
    function update() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        var box = track.getBoundingClientRect();
        var travel = box.height - window.innerHeight;
        var p = travel > 0 ? -box.top / travel : 0;
        p = Math.min(1, Math.max(0, p));

        section.style.setProperty('--p', p.toFixed(4));

        // light the step whose layer is currently pulling away
        var active = Math.min(steps.length - 1, Math.floor(p * steps.length * 1.06));
        steps.forEach(function (li, i) { li.classList.toggle('lit', i === active); });

        placeTags();
        pending = false;
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    watch();
    update();

    // "See the full dish" opens the burger this section takes apart. The id
    // is read off the link's own href so the two cannot drift apart.
    var jump = $('[data-open-classic]', section);
    if (jump) {
      jump.addEventListener('click', function (e) {
        var id = (jump.getAttribute('href') || '').replace('#dish-', '');
        var card = cards.filter(function (c) { return c.dataset.id === id; })[0];
        if (!card) return;
        e.preventDefault();
        card.scrollIntoView({ block: 'center', behavior: 'auto' });
        openDish(id, card);
      });
    }
  }

  /**
   * The hero. A photograph replaces the drawing outright; without one the
   * symbol is cloned into real nodes so its layers can drift independently
   * (CSS cannot reach inside a <use> shadow tree).
   */
  function heroArt() {
    var svg = $('.hero-dish');
    if (!svg) return;

    var photo = PHOTOS.hero;
    if (photo && photo.src) {
      var img = document.createElement('img');
      img.className = 'hero-dish is-photo';
      img.alt = '';
      img.decoding = 'async';
      if (photo.src2x) img.srcset = photo.src + ' 1x, ' + photo.src2x + ' 2x';
      img.src = photo.src;
      svg.parentNode.replaceChild(img, svg);
      return;
    }
    fillSvg(svg, 'art-burger');
  }

  /* ── Opening hours ──────────────────────────────────────────────── */
  function hours() {
    var now = new Date();
    var open = now.getHours() >= OPEN_HOUR && now.getHours() < CLOSE_HOUR;

    var chip = $('#status-chip');
    var text = $('#status-text');   // shadows the dish helper; local to hours()
    if (chip && text) {
      chip.classList.toggle('shut', !open);
      text.textContent = I.t(open ? 'hours.open' : 'hours.shut');
    }

    var row = $('#hours-table tr[data-day="' + now.getDay() + '"]');
    if (row) row.classList.add('today');
  }

  /* The reservation flow lives in booking.js, alongside the shared rules. */

  /* ── Reveal on scroll ───────────────────────────────────────────── */
  function reveal() {
    var items = $$('.rise');
    if (!('IntersectionObserver' in window) || still()) {
      items.forEach(function (el) { el.classList.add('up'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('up');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .1 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ── Masthead ───────────────────────────────────────────────────── */
  function masthead() {
    var bar = $('.masthead');
    var toggle = $('.burger-btn');
    var drawer = $('#drawer');
    var links = $$('.nav a');
    var targets = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);

    var pending = false;
    function onScroll() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        bar.classList.toggle('stuck', y > 8);

        var hero = $('.hero-dish');
        if (hero && !still()) hero.style.setProperty('--drift', Math.min(y, 700) * .07 + 'px');

        var on = null;
        targets.forEach(function (sec) {
          if (sec.getBoundingClientRect().top <= window.innerHeight * .36) on = sec.id;
        });
        links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + on); });

        pending = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      drawer.hidden = open;
    });
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        drawer.hidden = true;
      });
    });
  }

  /* ── Language ───────────────────────────────────────────────────── */

  var LANG_KEY = 'meatologia.lang';

  /** Fill every [data-i18n] element from the active language. */
  function applyStatic() {
    $$('[data-i18n]').forEach(function (el) {
      el.textContent = I.t(el.dataset.i18n);
    });
    $$('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = I.t(el.dataset.i18nHtml);
    });
    // data-i18n-attr="placeholder:form.namePlaceholder, aria-label:nav.open"
    $$('[data-i18n-attr]').forEach(function (el) {
      el.dataset.i18nAttr.split(',').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length === 2) el.setAttribute(bits[0].trim(), I.t(bits[1].trim()));
      });
    });

    document.documentElement.lang = I.language();
    document.title = I.t('meta.title');
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute('content', I.t('meta.description'));

    var year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());
    var legal = $('.foot-legal');
    if (legal) legal.textContent = I.t('foot.legal', { year: new Date().getFullYear() });
  }

  function setLanguage(code, remember) {
    I.setLanguage(code);
    if (remember) { try { localStorage.setItem(LANG_KEY, I.language()); } catch (err) {} }

    applyStatic();

    // anything rendered from data has to be rebuilt
    var openId = current >= 0 ? MENU.dishes[current].id : null;
    grid.innerHTML = '';
    cards.length = 0;
    buildMenu(true);
    cards.forEach(function (c) {
      c.classList.toggle('gone', !(course === 'all' || c.dataset.course === course));
      c.classList.add('up');
    });
    buildFilmstrip();
    if (openId) fill(MENU.dishes[current]);

    $$('.chip', chipBar).forEach(function (c) { c.textContent = courseLabel(c.dataset.course); });

    $$('.lang-pick').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === I.language()));
    });

    hours();
    document.dispatchEvent(new CustomEvent('meatologia:language', { detail: I.language() }));
  }

  function languagePicker() {
    var host = $('#lang-switch');
    if (!host) return;

    I.languages.forEach(function (lang) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lang-pick';
      b.dataset.lang = lang.code;
      // Both spellings ship; CSS shows the code instead of the name on a
      // narrow masthead, where three full names do not fit beside the brand.
      b.innerHTML = '<span class="lang-long">' + lang.label + '</span>' +
                    '<span class="lang-short">' + lang.code.toUpperCase() + '</span>';
      b.lang = lang.code;
      b.setAttribute('aria-label', lang.label);
      b.setAttribute('aria-pressed', String(lang.code === I.language()));
      b.addEventListener('click', function () { setLanguage(lang.code, true); });
      host.appendChild(b);
    });
  }

  /* ── Go ─────────────────────────────────────────────────────────── */
  var saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (err) {}
  I.setLanguage(saved || I.preferred());
  applyStatic();
  languagePicker();

  buildMenu();
  buildFilmstrip();
  anatomy();
  reveal();
  masthead();
  hours();

  // #dish-classic opens that dish on load
  if (/^#dish-/.test(location.hash)) {
    var id = location.hash.slice(6);
    var card = cards.filter(function (c) { return c.dataset.id === id; })[0];
    if (card) window.setTimeout(function () { openDish(id, card); }, 350);
  }
}());
