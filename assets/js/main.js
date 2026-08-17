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
        '<svg class="dish-pic" viewBox="0 0 320 280" aria-hidden="true"><use href="#' + dish.art + '"></use></svg>' +
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
      c.classList.toggle('gone', !(id === 'all' || c.dataset.course === id));
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

  function fill(dish) {
    stageUse.setAttribute('href', '#' + dish.art);
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
      f.innerHTML = '<svg viewBox="0 0 320 280" aria-hidden="true"><use href="#' + dish.art + '"></use></svg>';
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
    stageDish.style.viewTransitionName = on ? 'dish-art' : '';
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
    var to = stageDish.getBoundingClientRect();
    if (!to.width || !rect.width) return Promise.resolve();

    var scale = rect.width / to.width;
    var dx = (rect.left + rect.width / 2) - (to.left + to.width / 2);
    var dy = (rect.top + rect.height / 2) - (to.top + to.height / 2);
    var a = { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')' };
    var b = { transform: 'none' };

    var anim = stageDish.animate(reverse ? [b, a] : [a, b], {
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
   * CSS cannot reach into a <use> shadow tree, so anywhere the individual
   * layers need to animate, the symbol is cloned into real nodes instead.
   * `pad` grows the viewBox so layers can travel outside the original box.
   */
  /** Replace an existing <svg>'s <use> with real clones of the symbol. */
  function fillSvg(svg, id) {
    var symbol = document.getElementById(id);
    if (!svg || !symbol) return;
    svg.innerHTML = '';
    Array.prototype.forEach.call(symbol.children, function (node) {
      svg.appendChild(node.cloneNode(true));
    });
  }

  function inlineArt(host, id, pad) {
    var symbol = document.getElementById(id);
    if (!host || !symbol) return null;

    var box = (symbol.getAttribute('viewBox') || '0 0 320 280').split(/\s+/).map(Number);
    var top = pad || 0;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', box[0] + ' ' + box[1] + ' ' + box[2] + ' ' + (box[3] + top * 2));
    svg.setAttribute('aria-hidden', 'true');

    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', 'translate(0 ' + top + ')');
    Array.prototype.forEach.call(symbol.children, function (node) {
      g.appendChild(node.cloneNode(true));
    });
    svg.appendChild(g);

    host.innerHTML = '';
    host.appendChild(svg);
    return svg;
  }

  /* ── Anatomy: the burger comes apart on scroll ──────────────────── */
  function anatomy() {
    var section = $('#anatomy');
    if (!section) return;

    inlineArt($('.anat-burger', section), $('.anat-burger', section).dataset.art, 120);

    fillSvg($('.hero-dish'), 'art-burger');   // so the hero layers drift too

    var track = $('.anat-track', section);
    var steps = $$('.anat-list li', section);
    var stage = $('.anat-art', section);

    // Each label is pinned to the layer it names. Reading the layer's real
    // box beats predicting it — the artwork can be redrawn and the labels
    // still land in the right place.
    var tags = $$('.anat-tag', section).map(function (el, i) {
      return { el: el, layer: $('.' + ['art-bun-top', 'art-veg', 'art-cheese', 'art-patty', 'art-bun-btm'][i], section) };
    });

    function placeTags() {
      var base = stage.getBoundingClientRect();
      tags.forEach(function (tag) {
        if (!tag.layer) return;
        var box = tag.layer.getBoundingClientRect();
        tag.el.style.top = (box.top + box.height / 2 - base.top) + 'px';
      });
    }

    if (still()) {
      section.style.setProperty('--p', '1');
      steps.forEach(function (li) { li.classList.add('lit'); });
      requestAnimationFrame(placeTags);
      window.addEventListener('resize', placeTags);
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
    window.addEventListener('resize', update);
    update();

    // "See the full dish" opens the Classic in the takeover
    var jump = $('[data-open-classic]', section);
    if (jump) {
      jump.addEventListener('click', function (e) {
        var card = cards.filter(function (c) { return c.dataset.id === 'classic'; })[0];
        if (!card) return;
        e.preventDefault();
        card.scrollIntoView({ block: 'center', behavior: 'auto' });
        openDish('classic', card);
      });
    }
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
      b.textContent = lang.label;
      b.lang = lang.code;
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
