/**
 * The reservation flow.
 *
 * Talks to the booking API when the site is served by server/server.js. On a
 * plain static host there is no API, so it falls back to holding the booking
 * in this browser and tells the guest plainly that it still needs confirming
 * by phone — the rules and availability maths are identical either way,
 * because both paths run booking-core.js.
 */
(function () {
  'use strict';

  var R = window.MEATOLOGIA_BOOKING;
  if (!R) return;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var PHONE = '+48666854218';
  var LOCAL_KEY = 'meatologia.bookings.v1';

  var form = $('#reserve-form');
  if (!form) return;

  var els = {
    guests: $('#r-guests'), date: $('#r-date'), slots: $('#r-slots'),
    name: $('#r-name'), phone: $('#r-phone'), email: $('#r-email'), notes: $('#r-notes'),
    submit: $('#r-submit'), msg: $('#form-msg'),
    booked: $('#booked'), lookup: $('#lookup-form'), lookupMsg: $('#lookup-msg'),
    bookedMsg: $('#booked-msg')
  };

  var state = { guests: 2, date: '', time: '', slots: [], online: null, current: null };

  /* ── Local book (static hosting / offline) ──────────────────────── */

  function localAll() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || []; }
    catch (err) { return []; }
  }
  function localSave(list) {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(list)); } catch (err) { /* private mode */ }
  }

  /* ── Talking to the API ─────────────────────────────────────────── */

  function api(path, options) {
    return fetch(path, Object.assign({ headers: { 'Content-Type': 'application/json' } }, options))
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          return { status: res.status, ok: res.ok, body: body };
        });
      });
  }

  /** Load the slots for the chosen date, from the API if there is one. */
  function loadSlots() {
    var date = state.date;
    if (!date) return Promise.resolve([]);

    // Opened straight from disk (or inside a sandboxed frame) — there is no
    // origin to call, so don't bother trying and littering the console.
    if (state.online === null && !/^https?:$/.test(location.protocol)) state.online = false;

    if (state.online === false) return Promise.resolve(localSlots(date));

    return api('/api/availability?date=' + encodeURIComponent(date) + '&guests=' + state.guests)
      .then(function (res) {
        if (!res.ok || !res.body || !Array.isArray(res.body.slots)) throw new Error('no api');
        state.online = true;
        return res.body.slots;
      })
      .catch(function () {
        state.online = false;
        return localSlots(date);
      });
  }

  function localSlots(date) {
    return R.availability(localAll(), date, new Date(), state.guests);
  }

  /* ── Rendering ──────────────────────────────────────────────────── */

  function renderSlots(slots) {
    state.slots = slots;
    els.slots.innerHTML = '';

    var openCount = 0;
    slots.forEach(function (slot) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot';
      btn.textContent = slot.time;
      btn.dataset.time = slot.time;

      if (slot.status !== 'open') {
        btn.disabled = true;
        btn.title = slot.status === 'past' ? 'This seating has passed' : 'Fully booked';
      } else {
        openCount++;
        if (slot.seatsLeft <= 8) {
          btn.classList.add('slot-tight');
          btn.title = slot.seatsLeft + ' seats left';
        }
      }

      btn.setAttribute('aria-pressed', String(slot.time === state.time));
      btn.addEventListener('click', function () { pickTime(slot.time); });
      els.slots.appendChild(btn);
    });

    if (!openCount) {
      var none = document.createElement('p');
      none.className = 'slots-empty';
      none.textContent = 'Nothing free on this date for ' + state.guests +
        (state.guests === 1 ? ' guest' : ' guests') + '. Try another day, or call us.';
      els.slots.appendChild(none);
    }

    // keep a chosen time only while it is still bookable
    var still = slots.filter(function (s) { return s.time === state.time && s.status === 'open'; })[0];
    if (!still) { state.time = ''; markTime(); }
  }

  function markTime() {
    $$('.slot', els.slots).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.time === state.time));
    });
  }

  function pickTime(time) {
    state.time = time;
    markTime();
    showError('time', '');
  }

  function refresh() {
    els.slots.setAttribute('aria-busy', 'true');
    loadSlots().then(function (slots) {
      renderSlots(slots);
      els.slots.setAttribute('aria-busy', 'false');
    });
  }

  /* ── Errors ─────────────────────────────────────────────────────── */

  function showError(field, message) {
    var out = $('#err-' + field);
    if (out) out.textContent = message || '';
    var input = els[field];
    if (input && input.tagName === 'INPUT') {
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
  }

  function clearErrors() {
    ['guests', 'date', 'time', 'name', 'phone', 'email', 'notes'].forEach(function (f) {
      showError(f, '');
    });
    els.msg.className = 'form-msg';
    els.msg.textContent = '';
  }

  function say(node, text, kind) {
    node.className = 'form-msg' + (kind ? ' ' + kind : '');
    node.textContent = text;
  }

  /* ── Submitting ─────────────────────────────────────────────────── */

  function gather() {
    return {
      name: els.name.value, phone: els.phone.value, email: els.email.value,
      notes: els.notes.value, guests: state.guests, date: state.date, time: state.time
    };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var input = gather();
    var known = state.online === false ? localAll() : [];
    var checked = R.validate(input, known, new Date());

    if (!checked.ok) {
      Object.keys(checked.errors).forEach(function (f) { showError(f, checked.errors[f]); });
      var first = $('#err-' + Object.keys(checked.errors)[0]);
      if (first && first.previousElementSibling) first.previousElementSibling.focus();
      say(els.msg, 'Almost — check the highlighted fields.', 'bad');
      return;
    }

    els.submit.disabled = true;
    els.submit.textContent = 'Booking…';

    submit(checked.booking)
      .then(function (booking) { confirmed(booking); })
      .catch(function (err) {
        if (err && err.errors) {
          Object.keys(err.errors).forEach(function (f) { showError(f, err.errors[f]); });
          say(els.msg, 'That seating just went. Pick another time.', 'bad');
          refresh();
        } else {
          say(els.msg, 'We could not save that booking. Please call us on 666 854 218.', 'bad');
        }
      })
      .then(function () {
        els.submit.disabled = false;
        els.submit.textContent = 'Book the table';
      });
  });

  function submit(booking) {
    if (state.online === false) return Promise.resolve(saveLocal(booking));

    return api('/api/bookings', { method: 'POST', body: JSON.stringify(booking) })
      .then(function (res) {
        if (res.status === 201 && res.body.booking) { state.online = true; return res.body.booking; }
        if (res.status === 422) throw { errors: res.body.errors || {} };
        if (res.status === 429) throw new Error('rate limited');
        throw new Error('api unavailable');
      })
      .catch(function (err) {
        if (err && err.errors) throw err;
        state.online = false;          // no API here — hold it locally instead
        return saveLocal(booking);
      });
  }

  function saveLocal(booking) {
    var list = localAll();
    var ref;
    do { ref = R.reference(); } while (list.some(function (b) { return b.ref === ref; }));

    var saved = Object.assign({ ref: ref, status: 'confirmed', local: true,
      createdAt: new Date().toISOString() }, booking);
    list.push(saved);
    localSave(list);
    return saved;
  }

  /* ── Confirmation ───────────────────────────────────────────────── */

  function confirmed(booking) {
    state.current = booking;

    $('#booked-ref').textContent = booking.ref;
    $('#booked-when').textContent = R.prettyDate(booking.date) + ' at ' + booking.time;
    $('#booked-guests').textContent = booking.guests + (booking.guests === 1 ? ' guest' : ' guests');
    $('#booked-name').textContent = booking.name;

    $('#booked-title').textContent = booking.local ? 'Booking saved' : 'Table booked';
    $('#booked-sub').textContent = booking.local
      ? 'This copy of the site has no booking server, so we have kept the details on this device — ' +
        'please ring 666 854 218 to confirm the table.'
      : 'We have you in the book. Quote the reference if you need to change anything.';

    say(els.bookedMsg, '', '');
    form.hidden = true;
    els.lookup.hidden = true;
    els.booked.hidden = false;
    $('#booked-title').setAttribute('tabindex', '-1');
    $('#booked-title').focus();
  }

  $('#booked-again').addEventListener('click', function () {
    els.booked.hidden = true;
    form.hidden = false;
    state.time = '';
    clearErrors();
    refresh();
    els.name.focus();
  });

  /* Add to calendar — a real .ics file */
  $('#booked-ics').addEventListener('click', function () {
    var booking = state.current;
    if (!booking) return;
    var ics = R.toICS(booking);
    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });

    // A published artifact blocks page-initiated downloads; use the host's
    // save capability there, and a plain link everywhere else.
    if (window.claude && typeof window.claude.use === 'function') {
      window.claude.use('downloads').then(function (downloads) {
        if (!downloads) return say(els.bookedMsg, 'Saving files is not available here.', 'bad');
        return downloads.save({ filename: 'meatologia-' + booking.ref + '.ics', data: ics })
          .then(function () { say(els.bookedMsg, 'Saved to your calendar file.', 'good'); })
          .catch(function () { say(els.bookedMsg, 'The download was declined.', ''); });
      }).catch(function () { say(els.bookedMsg, 'Saving files is not available here.', 'bad'); });
      return;
    }

    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'meatologia-' + booking.ref + '.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    say(els.bookedMsg, 'Calendar file saved.', 'good');
  });

  /* Cancelling */
  $('#booked-cancel').addEventListener('click', function () {
    var booking = state.current;
    if (!booking) return;
    if (!window.confirm('Cancel the table on ' + R.prettyDate(booking.date) +
        ' at ' + booking.time + '?')) return;

    cancel(booking.ref, booking.phone).then(function (ok) {
      if (!ok) return say(els.bookedMsg, 'We could not cancel it here — please call us.', 'bad');
      say(els.bookedMsg, 'Cancelled. The table is back in the book.', 'good');
      $('#booked-title').textContent = 'Booking cancelled';
      $('#booked-sub').textContent = 'Nothing else to do — you are not expected.';
      $('#booked-cancel').disabled = true;
      $('#booked-ics').disabled = true;
    });
  });

  function cancel(ref, phone) {
    if (state.online === false) {
      var list = localAll();
      var hit = list.filter(function (b) { return b.ref === ref; })[0];
      if (!hit) return Promise.resolve(false);
      hit.status = 'cancelled';
      localSave(list);
      return Promise.resolve(true);
    }
    return api('/api/bookings/' + encodeURIComponent(ref) + '/cancel',
      { method: 'POST', body: JSON.stringify({ phone: phone }) })
      .then(function (res) { return res.ok; })
      .catch(function () { return false; });
  }

  /* ── Look up an existing booking ────────────────────────────────── */

  $$('[data-find]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      form.hidden = true;
      els.booked.hidden = true;
      els.lookup.hidden = false;
      $('#l-ref').focus();
    });
  });

  $$('[data-find-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      els.lookup.hidden = true;
      form.hidden = false;
    });
  });

  els.lookup.addEventListener('submit', function (e) {
    e.preventDefault();
    var ref = $('#l-ref').value.trim().toUpperCase();
    var phone = $('#l-phone').value.trim();
    if (!ref || !phone) return say(els.lookupMsg, 'Both the reference and the phone number, please.', 'bad');

    find(ref, phone).then(function (booking) {
      if (!booking) return say(els.lookupMsg, 'No booking matches that pair.', 'bad');
      if (booking.status === 'cancelled') return say(els.lookupMsg, 'That booking is already cancelled.', '');
      els.lookup.hidden = true;
      confirmed(booking);
    });
  });

  function find(ref, phone) {
    var tail = function (s) { return String(s || '').replace(/\D/g, '').slice(-4); };

    if (state.online === false) {
      var hit = localAll().filter(function (b) {
        return b.ref === ref && tail(b.phone) === tail(phone);
      })[0];
      return Promise.resolve(hit || null);
    }

    return api('/api/bookings/' + encodeURIComponent(ref)).then(function (res) {
      if (!res.ok || !res.body.booking) return null;
      // the API withholds personal details, so carry the phone we were given
      return Object.assign({ name: 'your booking', phone: phone }, res.body.booking);
    }).catch(function () { return null; });
  }

  /* ── Wiring ─────────────────────────────────────────────────────── */

  $$('[data-guests]', form).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = state.guests + Number(btn.dataset.guests);
      state.guests = Math.min(R.CONFIG.maxParty, Math.max(R.CONFIG.minParty, next));
      els.guests.textContent = String(state.guests);
      showError('guests', '');

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        els.guests.animate([{ transform: 'scale(1.22)' }, { transform: 'scale(1)' }],
          { duration: 260, easing: 'cubic-bezier(.34,1.5,.64,1)' });
      }
      refresh();
    });
  });

  els.date.addEventListener('change', function () {
    state.date = els.date.value;
    showError('date', '');
    refresh();
  });

  var today = new Date();
  var latest = new Date(today.getTime());
  latest.setDate(latest.getDate() + R.CONFIG.maxDaysAhead);

  els.date.min = R.toISODate(today);
  els.date.max = R.toISODate(latest);
  els.date.value = R.toISODate(today);
  state.date = els.date.value;

  refresh();
}());
