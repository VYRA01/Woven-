/**
 * Meatologia — static site + booking API.
 *
 * No dependencies; runs on plain Node.
 *
 *   node server/server.js                 # http://localhost:3000
 *   PORT=8080 STAFF_TOKEN=secret node server/server.js
 *
 * API
 *   GET  /api/availability?date=YYYY-MM-DD[&guests=n]
 *   POST /api/bookings                    {name, phone, email?, guests, date, time, notes?}
 *   GET  /api/bookings/:ref
 *   POST /api/bookings/:ref/cancel        {phone}
 *   GET  /api/staff/bookings              (X-Staff-Token or ?token=)
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const store = require('./store');
const rules = require('../assets/js/booking-core');
const notify = require('./notify');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.PORT) || 3000;
const STAFF_TOKEN = process.env.STAFF_TOKEN || '';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ics': 'text/calendar; charset=utf-8'
};

/* ── Helpers ──────────────────────────────────────────────────────── */

/**
 * Tell the guest and the floor, without making either of them wait and
 * without letting a mail failure reach the guest. The booking is already
 * saved; this is the part that can go wrong harmlessly.
 */
function announce(booking, event) {
  notify.booked(booking, event).then((done) => {
    if (done.skipped) return;
    if (done.sent.length) console.log('[mail] %s -> %s', booking.ref, done.sent.join(', '));
    for (const why of done.failed) console.error('[mail] %s FAILED %s', booking.ref, why);
  });
}

function send(res, status, body, headers) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, Object.assign({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  }, headers || {}));
  res.end(payload);
}

function readJson(req, limit = 16 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(new Error('too_large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch (err) { reject(new Error('bad_json')); }
    });
    req.on('error', reject);
  });
}

/**
 * Crude per-IP throttle so the diary cannot be spammed from one machine.
 * BOOKING_RATE is how many bookings one address may make in ten minutes;
 * a busy room behind a single NAT may want it higher than the default.
 */
const hits = new Map();
function tooMany(ip, max, windowMs = 10 * 60 * 1000) {
  if (max == null) max = Number(process.env.BOOKING_RATE) || 12;
  const now = Date.now();
  const seen = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  seen.push(now);
  hits.set(ip, seen);
  if (hits.size > 5000) hits.clear();
  return seen.length > max;
}

function staffAllowed(req, url) {
  if (!STAFF_TOKEN) return false;
  const given = req.headers['x-staff-token'] || url.searchParams.get('token') || '';
  const a = Buffer.from(String(given));
  const b = Buffer.from(STAFF_TOKEN);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ── API ──────────────────────────────────────────────────────────── */

async function api(req, res, url) {
  const ip = req.socket.remoteAddress || 'unknown';
  const parts = url.pathname.split('/').filter(Boolean);   // ['api', ...]

  // GET /api/availability
  if (req.method === 'GET' && parts[1] === 'availability') {
    const date = url.searchParams.get('date') || rules.toISODate(new Date());
    const guests = Number(url.searchParams.get('guests')) || 1;
    if (!rules.toDate(date, '12:00')) return send(res, 400, { error: 'bad_date' });

    return send(res, 200, {
      date,
      guests,
      seats: rules.CONFIG.seats,
      slots: rules.availability(store.forDate(date), date, new Date(), guests)
    });
  }

  // POST /api/bookings
  if (req.method === 'POST' && parts[1] === 'bookings' && parts.length === 2) {
    if (tooMany(ip)) return send(res, 429, { error: 'rate_limited' });

    let body;
    try { body = await readJson(req); }
    catch (err) { return send(res, 400, { error: err.message }); }

    const checked = rules.validate(body, store.forDate(String(body.date || '')), new Date());
    if (!checked.ok) return send(res, 422, { error: 'invalid', errors: checked.errors });

    // A reference nobody else holds.
    let ref;
    do { ref = rules.reference(); } while (store.find(ref));

    const booking = Object.assign({ ref, status: 'confirmed', createdAt: new Date().toISOString() },
      checked.booking);
    store.add(booking);

    console.log('[booking] %s  %s %s  %d guests  %s', ref, booking.date, booking.time,
      booking.guests, booking.name);

    // After the reply, never before it. The table is already in the diary
    // and the guest should not wait on a mail server to hear so.
    announce(booking, 'booked');
    return send(res, 201, { booking });
  }

  // GET /api/bookings/:ref
  if (req.method === 'GET' && parts[1] === 'bookings' && parts[2]) {
    const booking = store.find(parts[2]);
    if (!booking) return send(res, 404, { error: 'not_found' });
    // no personal details without the phone check — just enough to confirm it exists
    return send(res, 200, {
      booking: {
        ref: booking.ref, date: booking.date, time: booking.time,
        guests: booking.guests, status: booking.status
      }
    });
  }

  // POST /api/bookings/:ref/cancel
  if (req.method === 'POST' && parts[1] === 'bookings' && parts[2] && parts[3] === 'cancel') {
    if (tooMany(ip, (Number(process.env.BOOKING_RATE) || 12) + 8)) {
      return send(res, 429, { error: 'rate_limited' });
    }

    let body;
    try { body = await readJson(req); }
    catch (err) { return send(res, 400, { error: err.message }); }

    const result = store.cancel(parts[2], body.phone);
    if (result.booking) announce(result.booking, 'cancelled');
    if (!result.ok) return send(res, result.reason === 'not_found' ? 404 : 403, { error: result.reason });
    return send(res, 200, { booking: result.booking });
  }

  // GET /api/staff/bookings
  if (req.method === 'GET' && parts[1] === 'staff' && parts[2] === 'bookings') {
    if (!staffAllowed(req, url)) return send(res, 401, { error: 'unauthorised' });
    const date = url.searchParams.get('date');
    const list = date ? store.forDate(date) : store.all();
    return send(res, 200, { count: list.length, bookings: list });
  }

  return send(res, 404, { error: 'no_such_endpoint' });
}

/* ── Static files ─────────────────────────────────────────────────── */

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));

  if (url.pathname.startsWith('/api/')) {
    api(req, res, url).catch((err) => {
      console.error('[api]', err);
      send(res, 500, { error: 'server_error' });
    });
    return;
  }

  if (url.pathname === '/staff' || url.pathname === '/staff/') {
    return serveFile(res, path.join(__dirname, 'staff.html'));
  }

  // Static site. Only the published parts of the repo are reachable — the
  // process runs from a working tree that also holds source, tests and .git,
  // and none of that belongs on the web.
  let rel;
  try { rel = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname); }
  catch (err) { return send(res, 400, 'Bad path', { 'Content-Type': 'text/plain' }); }

  const filePath = path.normalize(path.join(ROOT, rel));
  const public_ = filePath === path.join(ROOT, 'index.html') ||
                  filePath.startsWith(path.join(ROOT, 'assets') + path.sep);

  if (!filePath.startsWith(ROOT) || !public_) {
    return send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
  }
  serveFile(res, filePath);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log('Meatologia running on http://localhost:' + PORT);
    console.log('Bookings stored in ' + store.FILE);
    console.log(STAFF_TOKEN
      ? 'Staff list: http://localhost:' + PORT + '/staff'
      : 'Set STAFF_TOKEN to enable the staff list at /staff');

    const mail = notify.config();
    console.log(mail.on
      ? 'Mailing confirmations via ' + mail.url.replace(/\/\/[^@]*@/, '//') +
        (mail.to ? ', alerts to ' + mail.to : ' (set MAIL_TO to alert the floor)')
      : 'Set SMTP_URL to mail confirmations; without it nothing is sent');
  });
}

module.exports = server;
