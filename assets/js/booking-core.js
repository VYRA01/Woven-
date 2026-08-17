/**
 * Booking rules for Meatologia.
 *
 * One source of truth, loaded by both the browser and the Node server, so a
 * slot the page offers is a slot the server will accept. Pure functions only —
 * no storage, no clock of its own; the caller passes `now` and the existing
 * bookings in.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MEATOLOGIA_BOOKING = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var CONFIG = {
    openHour: 12,          // first seating
    lastSeatingHour: 21,   // last seating; kitchen closes 21:15, doors 22:00
    slotMinutes: 30,
    turnMinutes: 90,       // how long a table is held
    seats: 56,             // covers available at any one time
    minParty: 1,
    maxParty: 12,          // above this we ask people to call
    leadMinutes: 45,       // no bookings for the next 45 minutes
    maxDaysAhead: 60
  };

  /* ── Small date helpers (local time, no library) ─────────────────── */

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function toISODate(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  /** "2026-08-17" + "18:30" -> Date in the viewer's local time. */
  function toDate(dateStr, timeStr) {
    var d = String(dateStr).split('-').map(Number);
    var t = String(timeStr || '00:00').split(':').map(Number);
    if (d.length !== 3 || d.some(isNaN) || t.some(isNaN)) return null;
    var out = new Date(d[0], d[1] - 1, d[2], t[0], t[1], 0, 0);
    // reject things like 2026-02-31 that Date silently rolls over
    if (out.getFullYear() !== d[0] || out.getMonth() !== d[1] - 1 || out.getDate() !== d[2]) return null;
    return out;
  }

  function minutesOf(timeStr) {
    var t = String(timeStr).split(':').map(Number);
    return t[0] * 60 + t[1];
  }

  function timeOf(minutes) { return pad(Math.floor(minutes / 60)) + ':' + pad(minutes % 60); }

  /* ── Slots ──────────────────────────────────────────────────────── */

  /** Every seating time we offer on a given date, open to last seating. */
  function slots() {
    var out = [];
    for (var m = CONFIG.openHour * 60; m <= CONFIG.lastSeatingHour * 60; m += CONFIG.slotMinutes) {
      out.push(timeOf(m));
    }
    return out;
  }

  /** Seats already committed across bookings whose turn overlaps `time`. */
  function seatsTaken(bookings, dateStr, time) {
    var start = minutesOf(time);
    var end = start + CONFIG.turnMinutes;

    return (bookings || []).reduce(function (total, b) {
      if (b.date !== dateStr) return total;
      if (b.status === 'cancelled') return total;
      var bStart = minutesOf(b.time);
      var bEnd = bStart + CONFIG.turnMinutes;
      return (bStart < end && bEnd > start) ? total + Number(b.guests || 0) : total;
    }, 0);
  }

  /**
   * Availability for a date.
   * `past` — already gone (or inside the lead time). `full` — no seats left.
   */
  function availability(bookings, dateStr, now, guests) {
    var party = Number(guests) || 1;
    var cutoff = new Date((now || new Date()).getTime() + CONFIG.leadMinutes * 60000);

    return slots().map(function (time) {
      var when = toDate(dateStr, time);
      var taken = seatsTaken(bookings, dateStr, time);
      var left = Math.max(0, CONFIG.seats - taken);

      var status = 'open';
      if (!when || when < cutoff) status = 'past';
      else if (left < party) status = 'full';

      return { time: time, seatsLeft: left, status: status };
    });
  }

  /* ── Validation ─────────────────────────────────────────────────── */

  var PHONE = /^[+()\-\s0-9]{7,20}$/;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /**
   * Check a booking request against the rules and the current book.
   * Returns { ok, errors: {field: message}, booking }.
   */
  function validate(input, bookings, now) {
    input = input || {};
    now = now || new Date();

    var errors = {};
    var name = String(input.name || '').trim().replace(/\s+/g, ' ');
    var phone = String(input.phone || '').trim();
    var email = String(input.email || '').trim();
    var notes = String(input.notes || '').trim();
    var guests = Math.round(Number(input.guests));
    var date = String(input.date || '').trim();
    var time = String(input.time || '').trim();

    if (name.length < 2) errors.name = 'Please give us a name for the table.';
    else if (name.length > 80) errors.name = 'That name is too long for the book.';

    if (!PHONE.test(phone)) errors.phone = 'A phone number so we can reach you if plans change.';
    if (email && !EMAIL.test(email)) errors.email = 'That email address does not look right.';
    if (notes.length > 400) errors.notes = 'Please keep the note under 400 characters.';

    if (!(guests >= CONFIG.minParty && guests <= CONFIG.maxParty)) {
      errors.guests = 'Tables here seat 1 to ' + CONFIG.maxParty + '. For a bigger group, call us.';
    }

    var when = toDate(date, time);
    if (!when) {
      errors.date = 'Pick a date and a time.';
    } else {
      var limit = new Date(now.getTime());
      limit.setDate(limit.getDate() + CONFIG.maxDaysAhead);

      if (!time) {
        errors.time = 'Choose a seating time.';
      } else if (slots().indexOf(time) < 0) {
        errors.time = 'We seat between 12:00 and 21:00.';
      } else if (when < new Date(now.getTime() + CONFIG.leadMinutes * 60000)) {
        errors.time = 'That seating has passed. Please call for anything in the next hour.';
      } else if (when > limit) {
        errors.date = 'We take bookings up to ' + CONFIG.maxDaysAhead + ' days ahead.';
      }
    }

    if (!errors.time && !errors.guests && !errors.date) {
      var left = CONFIG.seats - seatsTaken(bookings, date, time);
      if (left < guests) {
        errors.time = left > 0
          ? 'Only ' + left + ' ' + (left === 1 ? 'seat is' : 'seats are') + ' left at ' + time + '.'
          : 'That seating is fully booked.';
      }
    }

    return {
      ok: Object.keys(errors).length === 0,
      errors: errors,
      booking: {
        name: name, phone: phone, email: email, notes: notes,
        guests: guests, date: date, time: time
      }
    };
  }

  /* ── References ─────────────────────────────────────────────────── */

  var ALPHABET = 'ACDEFGHJKLMNPQRTUVWXY3479';   // no lookalike characters

  function reference(rand) {
    var pick = rand || Math.random;
    var out = 'MT-';
    for (var i = 0; i < 5; i++) out += ALPHABET[Math.floor(pick() * ALPHABET.length)];
    return out;
  }

  /* ── Presentation helpers ───────────────────────────────────────── */

  function prettyDate(dateStr) {
    var d = toDate(dateStr, '12:00');
    if (!d) return dateStr;
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  /** An .ics the guest can save to their calendar. */
  function toICS(booking, place) {
    var start = toDate(booking.date, booking.time);
    if (!start) return '';
    var end = new Date(start.getTime() + CONFIG.turnMinutes * 60000);

    function stamp(d) {
      return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' +
             pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z';
    }
    function esc(s) { return String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n'); }

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Meatologia//Booking//EN',
      'BEGIN:VEVENT',
      'UID:' + (booking.ref || reference()) + '@meatologia.pl',
      'DTSTAMP:' + stamp(new Date()),
      'DTSTART:' + stamp(start),
      'DTEND:' + stamp(end),
      'SUMMARY:' + esc('Table at Meatologia — ' + booking.guests +
        (booking.guests === 1 ? ' guest' : ' guests')),
      'DESCRIPTION:' + esc('Booked under ' + booking.name +
        (booking.ref ? '. Reference ' + booking.ref : '') + '. Phone 666 854 218.'),
      'LOCATION:' + esc(place || 'Meatologia, Zwycięska 45/lok. 3, 53-033 Wrocław'),
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  return {
    CONFIG: CONFIG,
    slots: slots,
    seatsTaken: seatsTaken,
    availability: availability,
    validate: validate,
    reference: reference,
    toISODate: toISODate,
    toDate: toDate,
    prettyDate: prettyDate,
    toICS: toICS
  };
}));
