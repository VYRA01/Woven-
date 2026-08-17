/**
 * Booking storage.
 *
 * A JSON file, written atomically through a temp file and rename so a crash
 * mid-write cannot truncate the book. Plenty for one restaurant's diary; swap
 * this module for a database if the site ever outgrows a single process.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const FILE = process.env.BOOKINGS_FILE || path.join(__dirname, 'data', 'bookings.json');

let cache = null;

function load() {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    if (!Array.isArray(cache)) cache = [];
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('[store] unreadable book, starting empty:', err.message);
    cache = [];
  }
  return cache;
}

function persist() {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = FILE + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(cache, null, 2));
  fs.renameSync(tmp, FILE);
}

/** Every booking, newest first. */
function all() {
  return load().slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

/** Bookings for one date, used for availability maths. */
function forDate(date) {
  return load().filter((b) => b.date === date);
}

function find(ref) {
  return load().find((b) => b.ref === String(ref || '').toUpperCase()) || null;
}

function add(booking) {
  load().push(booking);
  persist();
  return booking;
}

function cancel(ref, phone) {
  const booking = find(ref);
  if (!booking) return { ok: false, reason: 'not_found' };
  // last four digits of the phone act as the guest's proof it is their booking
  const tail = (s) => String(s || '').replace(/\D/g, '').slice(-4);
  if (tail(booking.phone) !== tail(phone)) return { ok: false, reason: 'mismatch' };
  if (booking.status === 'cancelled') return { ok: true, booking };

  booking.status = 'cancelled';
  booking.cancelledAt = new Date().toISOString();
  persist();
  return { ok: true, booking };
}

module.exports = { all, forDate, find, add, cancel, FILE };
