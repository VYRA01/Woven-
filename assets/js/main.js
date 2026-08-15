/* ══════════════════════════════════════════════════════════════════════
   Meatologia — interactions
   The heart of it is `openProduct()` / `closeProduct()`: the dish artwork
   morphs from its card into the detail dialog. Browsers with the View
   Transition API get a native cross-document-style morph; everyone else
   gets the same motion hand-rolled with FLIP + WAAPI.
   ═════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DATA = window.MEATOLOGIA_MENU;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var supportsVT = typeof document.startViewTransition === 'function';

  function prefersLessMotion() { return reduceMotion.matches; }

  /* ── Menu rendering ─────────────────────────────────────────────── */
  var grid = $('#menu-grid');
  var filterBar = $('.filters');
  var cards = [];
  var activeFilter = 'all';

  function paintOf(item) {
    return Object.keys(item.paint || {}).map(function (k) {
      return k + ':' + item.paint[k];
    }).join(';');
  }

  function categoryLabel(id) {
    var cat = DATA.categories.filter(function (c) { return c.id === id; })[0];
    return cat ? cat.label : '';
  }

  function buildCard(item, index) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'card reveal';
    card.dataset.id = item.id;
    card.dataset.cat = item.cat;
    card.style.setProperty('--reveal-delay', Math.min(index, 8) * 60 + 'ms');
    card.setAttribute('aria-label', item.name + ', ' + item.price + ' zł — pokaż szczegóły');

    card.innerHTML =
      '<span class="card-media" style="' + paintOf(item) + '">' +
        '<svg class="card-art" viewBox="0 0 220 180" aria-hidden="true"><use href="#' + item.art + '"></use></svg>' +
        '<span class="card-tag">' + item.tag + '</span>' +
      '</span>' +
      '<span class="card-body">' +
        '<span class="card-title">' + item.name + '</span>' +
        '<span class="card-short">' + item.short + '</span>' +
      '</span>' +
      '<span class="card-foot">' +
        '<span class="card-price">' + item.price + ' <small>zł</small></span>' +
        '<span class="card-more">Zobacz <span aria-hidden="true">→</span></span>' +
      '</span>';

    card.addEventListener('click', function () { openProduct(item.id, card); });
    return card;
  }

  function renderMenu() {
    var frag = document.createDocumentFragment();
    DATA.items.forEach(function (item, i) {
      var card = buildCard(item, i);
      cards.push(card);
      frag.appendChild(card);
    });
    grid.appendChild(frag);

    DATA.categories.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter';
      btn.dataset.cat = cat.id;
      btn.textContent = cat.label;
      btn.setAttribute('aria-pressed', cat.id === activeFilter ? 'true' : 'false');
      btn.addEventListener('click', function () { applyFilter(cat.id); });
      filterBar.appendChild(btn);
    });
  }

  /* ── Filtering with a FLIP reflow ───────────────────────────────── */
  function applyFilter(catId) {
    if (catId === activeFilter) return;
    activeFilter = catId;

    $$('.filter', filterBar).forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.cat === catId ? 'true' : 'false');
    });

    var before = new Map();
    cards.forEach(function (c) {
      if (!c.classList.contains('is-hidden')) before.set(c, c.getBoundingClientRect());
    });

    cards.forEach(function (c) {
      var show = catId === 'all' || c.dataset.cat === catId;
      c.classList.toggle('is-hidden', !show);
    });

    if (prefersLessMotion()) return;

    cards.forEach(function (c) {
      if (c.classList.contains('is-hidden')) return;
      var last = c.getBoundingClientRect();
      var first = before.get(c);

      if (!first) {
        // newly shown — fade and rise into place
        c.animate(
          [{ opacity: 0, transform: 'translateY(18px) scale(.96)' }, { opacity: 1, transform: 'none' }],
          { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
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

  /* ── Product overlay ────────────────────────────────────────────── */
  var overlay      = $('#product-overlay');
  var dialog       = $('.product-dialog', overlay);
  var dialogMedia  = $('#product-media');
  var artUse       = $('#product-art-use');
  var lastFocused  = null;
  var currentIndex = -1;
  var originCard   = null;
  var isAnimating  = false;

  function visibleItems() {
    return DATA.items.filter(function (it) {
      return activeFilter === 'all' || it.cat === activeFilter;
    });
  }

  function fillDialog(item) {
    artUse.setAttribute('href', '#' + item.art);
    dialogMedia.setAttribute('style', paintOf(item));

    $('#product-tag').textContent = item.tag;
    $('#product-cat').textContent = categoryLabel(item.cat);
    $('#product-title').textContent = item.name;
    $('#product-desc').textContent = item.desc;
    $('#product-weight').textContent = item.weight;
    $('#product-heat').textContent = item.heat || '';
    $('#product-price').textContent = item.price;

    var ings = $('#product-ings');
    ings.innerHTML = '';
    item.ings.forEach(function (ing, i) {
      var li = document.createElement('li');
      li.style.setProperty('--i', i);
      li.textContent = ing;
      ings.appendChild(li);
    });
  }

  function showOverlay() {
    overlay.hidden = false;
    overlay.classList.add('is-open');
    document.body.classList.add('is-locked');
  }

  function hideOverlay() {
    overlay.hidden = true;
    overlay.classList.remove('is-open', 'is-closing');
    document.body.classList.remove('is-locked');
  }

  /**
   * FLIP fallback — grow the dialog out of the card's media box.
   * `from` is the DOMRect of the element that was clicked.
   */
  function flipDialog(from, reverse) {
    var to = dialog.getBoundingClientRect();
    var sx = Math.max(from.width / to.width, .05);
    var sy = Math.max(from.height / to.height, .05);
    var dx = from.left - to.left;
    var dy = from.top - to.top;

    var start = {
      transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')',
      opacity: 0,
      borderRadius: '20px'
    };
    var end = { transform: 'none', opacity: 1, borderRadius: '28px' };

    dialog.classList.add('is-flipping');
    var anim = dialog.animate(
      reverse ? [end, start] : [start, end],
      { duration: reverse ? 320 : 520, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
    );
    anim.finished.then(function () {
      dialog.classList.remove('is-flipping');
      anim.cancel();
    }).catch(function () {});
    return anim;
  }

  function openProduct(id, card) {
    if (isAnimating) return;
    var index = DATA.items.findIndex(function (it) { return it.id === id; });
    if (index < 0) return;

    currentIndex = index;
    originCard = card || null;
    lastFocused = document.activeElement;
    fillDialog(DATA.items[index]);

    var cardMedia = originCard ? $('.card-media', originCard) : null;
    var fromRect = cardMedia ? cardMedia.getBoundingClientRect() : null;

    if (prefersLessMotion()) {
      showOverlay();
      focusDialog();
      return;
    }

    if (supportsVT && cardMedia) {
      isAnimating = true;
      cardMedia.style.viewTransitionName = 'product-media';

      var vt = document.startViewTransition(function () {
        cardMedia.style.viewTransitionName = '';
        dialogMedia.style.viewTransitionName = 'product-media';
        showOverlay();
      });

      vt.finished.then(function () {
        dialogMedia.style.viewTransitionName = '';
        isAnimating = false;
      }).catch(function () { isAnimating = false; });

      vt.ready.then(focusDialog).catch(focusDialog);
      return;
    }

    showOverlay();
    if (fromRect) flipDialog(fromRect, false);
    focusDialog();
  }

  function closeProduct() {
    if (overlay.hidden || isAnimating) return;

    var cardMedia = originCard ? $('.card-media', originCard) : null;

    function restoreFocus() {
      if (lastFocused && document.contains(lastFocused)) lastFocused.focus({ preventScroll: true });
      lastFocused = null;
      originCard = null;
    }

    if (prefersLessMotion()) {
      hideOverlay();
      restoreFocus();
      return;
    }

    // If the origin card scrolled out of view, bring it back so the morph
    // has somewhere to land.
    if (cardMedia && !isInViewport(cardMedia)) {
      cardMedia.scrollIntoView({ block: 'center', behavior: 'auto' });
    }

    if (supportsVT && cardMedia && !cardMedia.closest('.is-hidden')) {
      isAnimating = true;
      dialogMedia.style.viewTransitionName = 'product-media';

      var vt = document.startViewTransition(function () {
        dialogMedia.style.viewTransitionName = '';
        hideOverlay();
        cardMedia.style.viewTransitionName = 'product-media';
      });

      vt.finished.then(function () {
        cardMedia.style.viewTransitionName = '';
        isAnimating = false;
        restoreFocus();
      }).catch(function () {
        cardMedia.style.viewTransitionName = '';
        isAnimating = false;
        restoreFocus();
      });
      return;
    }

    overlay.classList.add('is-closing');
    if (cardMedia) {
      isAnimating = true;
      flipDialog(cardMedia.getBoundingClientRect(), true).finished
        .then(finish).catch(finish);
    } else {
      finish();
    }

    function finish() {
      isAnimating = false;
      hideOverlay();
      restoreFocus();
    }
  }

  function stepProduct(dir) {
    var list = visibleItems();
    if (!list.length) return;

    var currentId = DATA.items[currentIndex].id;
    var pos = list.findIndex(function (it) { return it.id === currentId; });
    if (pos < 0) pos = 0;

    var next = list[(pos + dir + list.length) % list.length];
    currentIndex = DATA.items.findIndex(function (it) { return it.id === next.id; });
    originCard = cards.filter(function (c) { return c.dataset.id === next.id; })[0] || null;

    var body = $('.product-body', dialog);
    dialogMedia.style.setProperty('--swap-x', (dir > 0 ? -30 : 30) + 'px');

    if (prefersLessMotion()) { fillDialog(next); return; }

    dialogMedia.classList.remove('is-swapping');
    body.classList.remove('is-swapping');
    void dialogMedia.offsetWidth;                    // restart the CSS animations
    dialogMedia.classList.add('is-swapping');
    body.classList.add('is-swapping');

    window.setTimeout(function () { fillDialog(next); }, 210);
    window.setTimeout(function () {
      dialogMedia.classList.remove('is-swapping');
      body.classList.remove('is-swapping');
    }, 520);
  }

  function isInViewport(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }

  function focusDialog() {
    var target = $('.product-close', dialog);
    if (target) target.focus({ preventScroll: true });
  }

  /* Dialog wiring: close targets, arrows, keyboard, focus trap */
  $$('[data-close]', overlay).forEach(function (el) {
    el.addEventListener('click', closeProduct);
  });
  $('[data-prev]', overlay).addEventListener('click', function () { stepProduct(-1); });
  $('[data-next]', overlay).addEventListener('click', function () { stepProduct(1); });

  document.addEventListener('keydown', function (e) {
    if (overlay.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeProduct(); }
    else if (e.key === 'ArrowRight') stepProduct(1);
    else if (e.key === 'ArrowLeft') stepProduct(-1);
    else if (e.key === 'Tab') trapFocus(e);
  });

  function trapFocus(e) {
    var focusables = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', dialog)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!focusables.length) return;

    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* Swipe between dishes on touch devices */
  (function () {
    var x0 = null, y0 = null;
    dialog.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    dialog.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) stepProduct(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    }, { passive: true });
  }());

  /* ── Scroll reveal ──────────────────────────────────────────────── */
  function initReveal() {
    var items = $$('.reveal');
    if (!('IntersectionObserver' in window) || prefersLessMotion()) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ── Counters ───────────────────────────────────────────────────── */
  function initCounters() {
    var nums = $$('.fact-n');
    if (!('IntersectionObserver' in window) || prefersLessMotion()) {
      nums.forEach(function (el) { el.textContent = el.dataset.count.replace('.', ','); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: .6 });
    nums.forEach(function (el) { io.observe(el); });
  }

  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var start = performance.now();
    var duration = 1300;

    function frame(now) {
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals).replace('.', ',');
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ── Header: stuck state, progress, active link, mobile nav ─────── */
  function initHeader() {
    var header = $('.site-header');
    var bar = $('.scroll-progress');
    var toggle = $('.nav-toggle');
    var mobileNav = $('#mobile-nav');
    var links = $$('.site-nav a');
    var sections = links
      .map(function (a) { return $(a.getAttribute('href')); })
      .filter(Boolean);

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        header.classList.toggle('is-stuck', y > 8);

        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.setProperty('--progress', (max > 0 ? (y / max) * 100 : 0) + '%');

        var active = null;
        sections.forEach(function (sec) {
          if (sec.getBoundingClientRect().top <= window.innerHeight * .38) active = sec.id;
        });
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + active);
        });

        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobileNav.hidden = open;
    });
    $$('a', mobileNav).forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      });
    });
  }

  /* ── Hero parallax ──────────────────────────────────────────────── */
  function initParallax() {
    var burger = $('.hero-burger');
    if (!burger || prefersLessMotion()) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var offset = Math.min(window.scrollY, 700) * .08;
        burger.style.setProperty('--parallax', offset + 'px');
        ticking = false;
      });
    }, { passive: true });
  }

  /* ── Init ───────────────────────────────────────────────────────── */
  renderMenu();
  initReveal();
  initCounters();
  initHeader();
  initParallax();

  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Deep link: #menu-classic opens that dish straight away.
  if (/^#dish-/.test(location.hash)) {
    var id = location.hash.replace('#dish-', '');
    var card = cards.filter(function (c) { return c.dataset.id === id; })[0];
    if (card) window.setTimeout(function () { openProduct(id, card); }, 400);
  }
}());
