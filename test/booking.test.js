/**
 * Booking rules and API.
 *   node --test test/
 */
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const R = require('../assets/js/booking-core');

/**
 * Fixed instants, written in UTC so the suite passes on any machine. The
 * comment gives the Warsaw wall-clock time the restaurant actually works in
 * (August is CEST, UTC+2).
 */
const NOW = new Date('2026-08-17T08:00:00Z');         // Mon 17 Aug 2026, 10:00 in Wrocław
const TODAY = '2026-08-17';
const SOON = '2026-08-18';

function booking(over) {
  return Object.assign({
    name: 'Anna Kowalska',
    phone: '600 000 000',
    email: 'anna@example.com',
    guests: 2,
    date: SOON,
    time: '18:00'
  }, over);
}

/* ── Slots ────────────────────────────────────────────────────────── */

test('slots run from opening to last seating, every half hour', () => {
  const s = R.slots();
  assert.equal(s[0], '12:00');
  assert.equal(s[s.length - 1], '21:00');
  assert.equal(s.length, 19);
  assert.ok(s.includes('18:30'));
});

/* ── Capacity ─────────────────────────────────────────────────────── */

test('seats are counted across the whole 90 minute turn', () => {
  const book = [{ date: SOON, time: '18:00', guests: 4, status: 'confirmed' }];

  assert.equal(R.seatsTaken(book, SOON, '18:00'), 4, 'same slot');
  assert.equal(R.seatsTaken(book, SOON, '19:00'), 4, 'still seated an hour later');
  assert.equal(R.seatsTaken(book, SOON, '19:30'), 0, 'table has turned');
  assert.equal(R.seatsTaken(book, SOON, '16:00'), 0, 'before they arrive');
  assert.equal(R.seatsTaken(book, TODAY, '18:00'), 0, 'another date entirely');
});

test('cancelled bookings free their seats', () => {
  const book = [{ date: SOON, time: '18:00', guests: 6, status: 'cancelled' }];
  assert.equal(R.seatsTaken(book, SOON, '18:00'), 0);
});

test('a full seating is reported as full, and only for parties that do not fit', () => {
  const book = [{ date: SOON, time: '18:00', guests: R.CONFIG.seats - 2, status: 'confirmed' }];

  const forTwo = R.availability(book, SOON, NOW, 2).find((s) => s.time === '18:00');
  assert.equal(forTwo.status, 'open', 'two still fit');
  assert.equal(forTwo.seatsLeft, 2);

  const forFour = R.availability(book, SOON, NOW, 4).find((s) => s.time === '18:00');
  assert.equal(forFour.status, 'full', 'four do not');
});

test('seatings that have gone, or are inside the lead time, are closed off', () => {
  const at = (now, time) =>
    R.availability([], TODAY, now, 2).find((s) => s.time === time).status;

  // 10:00 — the whole service is still ahead
  assert.equal(at(NOW, '12:00'), 'open', 'two hours away');
  assert.equal(at(NOW, '21:00'), 'open');

  // mid-service at 13:10
  const midday = new Date('2026-08-17T11:10:00Z');      // 13:10 in Wrocław
  assert.equal(at(midday, '12:00'), 'past', 'gone');
  assert.equal(at(midday, '13:00'), 'past', 'gone');
  assert.equal(at(midday, '13:30'), 'past', 'only 20 minutes away — inside the lead time');
  assert.equal(at(midday, '14:00'), 'open', '50 minutes away — bookable');

  // exactly on the 45 minute boundary
  const sharp = new Date('2026-08-17T15:15:00Z');       // 17:15 in Wrocław
  assert.equal(at(sharp, '18:00'), 'open', '45 minutes ahead is still open');
  assert.equal(at(new Date('2026-08-17T15:16:00Z'), '18:00'), 'past', 'a minute inside it is not');

  // times we never offer are simply absent
  assert.equal(R.availability([], TODAY, NOW).find((s) => s.time === '10:30'), undefined);
  assert.equal(R.availability([], TODAY, NOW).find((s) => s.time === '22:00'), undefined);
});

test('the clock is the restaurant\'s, not the machine\'s or the guest\'s', () => {
  // 10:00 UTC is 12:00 in Wrocław in August (CEST, UTC+2)
  const summer = R.wallClock(new Date('2026-08-17T10:00:00Z'));
  assert.equal(summer.getHours(), 12, 'summer time');
  assert.equal(summer.getDate(), 17);

  // and 11:00 in January (CET, UTC+1) — the offset is not hardcoded
  const winter = R.wallClock(new Date('2026-01-17T10:00:00Z'));
  assert.equal(winter.getHours(), 11, 'winter time');

  // crossing midnight in Warsaw while it is still "yesterday" in UTC
  const late = R.wallClock(new Date('2026-08-17T22:30:00Z'));
  assert.equal(late.getDate(), 18, 'already tomorrow in Wrocław');

  // a guest whose own clock says otherwise still sees the restaurant's day:
  // 21:00 UTC = 23:00 in Wrocław, so nothing is left today
  const open = R.availability([], '2026-08-17', new Date('2026-08-17T21:00:00Z'), 2)
    .filter((s) => s.status === 'open');
  assert.equal(open.length, 0, 'service is over in Wrocław');
});

/* ── Validation ───────────────────────────────────────────────────── */

test('a good booking passes and comes back tidied up', () => {
  const out = R.validate(booking({ name: '  Anna   Kowalska ' }), [], NOW);
  assert.ok(out.ok, JSON.stringify(out.errors));
  assert.equal(out.booking.name, 'Anna Kowalska', 'whitespace collapsed');
  assert.equal(out.booking.guests, 2);
});

test('name and phone are required, email only if given', () => {
  assert.ok(R.validate(booking({ name: 'A' }), [], NOW).errors.name);
  assert.ok(R.validate(booking({ phone: 'nope' }), [], NOW).errors.phone);
  assert.ok(R.validate(booking({ email: 'bent@' }), [], NOW).errors.email);
  assert.ok(R.validate(booking({ email: '' }), [], NOW).ok, 'email is optional');
});

test('party size is held between one and the table limit', () => {
  assert.ok(R.validate(booking({ guests: 0 }), [], NOW).errors.guests);
  assert.ok(R.validate(booking({ guests: 13 }), [], NOW).errors.guests);
  assert.ok(R.validate(booking({ guests: 12 }), [], NOW).ok);
});

test('bookings in the past, off the clock, or too far ahead are refused', () => {
  assert.equal(R.validate(booking({ date: '2026-08-16' }), [], NOW).errors.time.code, 'too_soon', 'yesterday');
  assert.equal(R.validate(booking({ time: '23:00' }), [], NOW).errors.time.code, 'off_hours', 'after last seating');
  assert.equal(R.validate(booking({ time: '11:00' }), [], NOW).errors.time.code, 'off_hours', 'before opening');
  assert.ok(R.validate(booking({ date: '2026-02-31' }), [], NOW).errors.date, 'not a real date');
  assert.equal(R.validate(booking({ date: '2027-01-01' }), [], NOW).errors.date.code, 'too_far', 'beyond the horizon');
});

test('leaving the seating unchosen says so, rather than blaming the hours', () => {
  const out = R.validate(booking({ time: '' }), [], NOW);
  assert.equal(out.errors.time.code, 'no_time');
});

test('errors come back as codes the page can translate', () => {
  const out = R.validate(booking({ name: '', guests: 40 }), [], NOW);
  assert.equal(out.errors.name.code, 'name_short');
  assert.equal(out.errors.guests.code, 'party');
  assert.equal(out.errors.guests.max, R.CONFIG.maxParty, 'carries what the sentence needs');
});

test('a booking is refused when the seating has filled up', () => {
  const book = [{ date: SOON, time: '18:00', guests: R.CONFIG.seats - 1, status: 'confirmed' }];
  const out = R.validate(booking({ guests: 4 }), book, NOW);
  assert.ok(!out.ok);
  assert.equal(out.errors.time.code, 'seats_left_1');
  assert.equal(out.errors.time.n, 1);
  assert.equal(out.errors.time.time, '18:00');
});

/* ── References ───────────────────────────────────────────────────── */

test('references look like MT-XXXXX and avoid lookalike characters', () => {
  for (let i = 0; i < 200; i++) {
    const ref = R.reference();
    assert.match(ref, /^MT-[ACDEFGHJKLMNPQRTUVWXY3479]{5}$/);
    assert.ok(!/[OI01S5BZ2]/.test(ref.slice(3)));
  }
});

/* ── Calendar file ────────────────────────────────────────────────── */

test('the calendar file carries the booking and closes its blocks', () => {
  const ics = R.toICS(Object.assign({ ref: 'MT-ABCDE' }, booking()));
  assert.match(ics, /^BEGIN:VCALENDAR/);
  assert.match(ics, /END:VCALENDAR$/);
  assert.match(ics, /DTSTART:20260818T\d{6}Z/);
  assert.match(ics, /UID:MT-ABCDE@meatologia\.pl/);
  assert.ok(ics.includes('SUMMARY:Table at Meatologia'));
});

/* ── The API, end to end ──────────────────────────────────────────── */

test('the API takes a booking, holds the seats, and cancels on request', async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'meatologia-'));
  process.env.BOOKINGS_FILE = path.join(dir, 'bookings.json');
  process.env.STAFF_TOKEN = 'test-token';

  // required after the env is set, so the store picks up the temp file
  const server = require('../server/server');
  await new Promise((r) => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;

  t.after(() => {
    server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  });

  // a date far enough ahead that it is never "past" while the suite runs
  const soon = new Date();
  soon.setDate(soon.getDate() + 3);
  const date = R.toISODate(soon);

  const post = (path, body, headers) => fetch(base + path, {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}),
    body: JSON.stringify(body)
  });

  await t.test('availability is served for a date', async () => {
    const res = await fetch(base + '/api/availability?date=' + date);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.slots.length, 19);
    assert.equal(body.slots.find((s) => s.time === '19:00').seatsLeft, R.CONFIG.seats);
  });

  let ref;

  await t.test('a valid booking is stored and given a reference', async () => {
    const res = await post('/api/bookings', booking({ date, time: '19:00', guests: 4 }));
    const body = await res.json();
    assert.equal(res.status, 201);
    assert.match(body.booking.ref, /^MT-/);
    assert.equal(body.booking.status, 'confirmed');
    ref = body.booking.ref;

    const saved = JSON.parse(fs.readFileSync(process.env.BOOKINGS_FILE, 'utf8'));
    assert.equal(saved.length, 1, 'written to disk');
  });

  await t.test('those seats are gone from availability', async () => {
    const res = await fetch(base + '/api/availability?date=' + date);
    const body = await res.json();
    assert.equal(body.slots.find((s) => s.time === '19:00').seatsLeft, R.CONFIG.seats - 4);
    assert.equal(body.slots.find((s) => s.time === '20:00').seatsLeft, R.CONFIG.seats - 4,
      'still seated within the turn');
    assert.equal(body.slots.find((s) => s.time === '21:00').seatsLeft, R.CONFIG.seats,
      'table has turned by then');
  });

  await t.test('a bad booking is refused with per-field reasons', async () => {
    const res = await post('/api/bookings', booking({ date, time: '19:00', name: '', phone: 'x' }));
    const body = await res.json();
    assert.equal(res.status, 422);
    assert.ok(body.errors.name);
    assert.ok(body.errors.phone);
  });

  await t.test('an overbooking is refused', async () => {
    const res = await post('/api/bookings', booking({ date, time: '12:00', guests: 12 }));
    assert.equal(res.status, 201, 'first big party fits');

    const fill = [];
    for (let i = 0; i < 4; i++) fill.push(post('/api/bookings', booking({ date, time: '12:00', guests: 11 })));
    await Promise.all(fill);

    const res2 = await post('/api/bookings', booking({ date, time: '12:00', guests: 12 }));
    const body2 = await res2.json();
    assert.equal(res2.status, 422);
    assert.ok(body2.errors.time, 'told which field is the problem');
  });

  await t.test('the staff list needs the token', async () => {
    const denied = await fetch(base + '/api/staff/bookings');
    assert.equal(denied.status, 401);

    const wrong = await fetch(base + '/api/staff/bookings', { headers: { 'X-Staff-Token': 'nope-nope-x' } });
    assert.equal(wrong.status, 401);

    const ok = await fetch(base + '/api/staff/bookings', { headers: { 'X-Staff-Token': 'test-token' } });
    const body = await ok.json();
    assert.equal(ok.status, 200);
    assert.ok(body.count >= 1);
  });

  await t.test('cancelling needs the phone it was booked with', async () => {
    const wrong = await post('/api/bookings/' + ref + '/cancel', { phone: '111 111 111' });
    assert.equal(wrong.status, 403);

    const right = await post('/api/bookings/' + ref + '/cancel', { phone: '600 000 000' });
    const body = await right.json();
    assert.equal(right.status, 200);
    assert.equal(body.booking.status, 'cancelled');
  });

  await t.test('cancelled seats go back on sale', async () => {
    const res = await fetch(base + '/api/availability?date=' + date);
    const body = await res.json();
    assert.equal(body.slots.find((s) => s.time === '19:00').seatsLeft, R.CONFIG.seats);
  });

  await t.test('an unknown reference is a 404', async () => {
    const res = await fetch(base + '/api/bookings/MT-ZZZZZ');
    assert.equal(res.status, 404);
  });

  await t.test('the site is served, but nothing else in the working tree is', async () => {
    const page = await fetch(base + '/');
    assert.equal(page.status, 200, 'the page itself');
    assert.equal((await fetch(base + '/assets/css/styles.css')).status, 200, 'its assets');

    for (const secret of ['/package.json', '/server/store.js', '/test/booking.test.js',
                          '/.git/config', '/server/data/bookings.json']) {
      assert.equal((await fetch(base + secret)).status, 404, secret + ' should not be served');
    }
  });

  await t.test('encoded directory traversal is refused', async () => {
    for (const attempt of ['/%2e%2e/%2e%2e/etc/passwd', '/assets/../package.json',
                           '/assets/%2e%2e/package.json']) {
      const res = await fetch(base + attempt);
      assert.ok(res.status === 404 || res.status === 403, attempt + ' got ' + res.status);
    }
  });
});

/* ── Translations ─────────────────────────────────────────────────── */

test('every language carries every interface string', () => {
  const I = require('../assets/js/i18n');
  const base = Object.keys(I.strings.en);

  assert.ok(base.length > 100, 'the English table is the reference');

  for (const lang of I.languages) {
    const table = I.strings[lang.code];
    assert.ok(table, lang.code + ' has a string table');

    const missing = base.filter((key) => table[key] == null);
    const extra = Object.keys(table).filter((key) => I.strings.en[key] == null);

    assert.deepEqual(missing, [], lang.label + ' is missing keys');
    assert.deepEqual(extra, [], lang.label + ' has keys English does not');
  }
});

test('every dish is translated into every language', () => {
  const I = require('../assets/js/i18n');
  const MENU = (() => {
    const sandbox = { window: {} };
    new Function('window', fs.readFileSync(__dirname + '/../assets/js/data.js', 'utf8'))(sandbox.window);
    return sandbox.window.MEATOLOGIA_MENU;
  })();
  const T = require('../assets/js/menu-i18n');

  const fields = ['flag', 'short', 'blurb', 'parts', 'weight', 'cook', 'pair'];
  const gaps = [];

  for (const dish of MENU.dishes) {
    for (const lang of I.languages) {
      if (lang.code === 'en') continue;              // data.js is the English copy
      const block = (T[dish.id] || {})[lang.code];
      if (!block) { gaps.push(dish.id + ' has no ' + lang.code); continue; }

      for (const field of fields) {
        // an empty string in data.js means the dish genuinely has no such field
        if (dish[field] === '' || (Array.isArray(dish[field]) && !dish[field].length)) continue;
        if (block[field] == null) gaps.push(dish.id + '.' + lang.code + ' missing ' + field);
      }
    }
  }

  assert.deepEqual(gaps, [], 'untranslated menu copy');
});

test('course chips have a label in every language', () => {
  const I = require('../assets/js/i18n');
  const sandbox = { window: {} };
  new Function('window', fs.readFileSync(__dirname + '/../assets/js/data.js', 'utf8'))(sandbox.window);

  for (const course of sandbox.window.MEATOLOGIA_MENU.courses) {
    for (const lang of I.languages) {
      assert.ok(I.strings[lang.code]['course.' + course.id],
        course.id + ' has no label in ' + lang.label);
    }
  }
});

/* ── Photography ──────────────────────────────────────────────────────
   The manifest is edited by hand, so the ways it can go wrong are typing
   ones: a dish id that no longer exists, a path to a file nobody added, a
   layer key the animation does not move. All three fail silently in the
   browser — the site just keeps drawing — so they are caught here instead. */

test('every photograph named in photos.js exists and belongs to something', () => {
  const PHOTOS = require('../assets/js/photos');
  const MENU = (() => {
    const sandbox = { window: {} };
    new Function('window', fs.readFileSync(__dirname + '/../assets/js/data.js', 'utf8'))(sandbox.window);
    return sandbox.window.MEATOLOGIA_MENU;
  })();

  const ids = MENU.dishes.map((d) => d.id);
  const stack = ['art-bun-btm', 'art-patty', 'art-cheese', 'art-veg', 'art-bun-top'];
  const problems = [];

  const onDisk = (src, where) => {
    if (!src) return problems.push(where + ' has no src');
    if (!fs.existsSync(path.join(__dirname, '..', src))) problems.push(where + ' points at a missing file: ' + src);
  };

  for (const [id, photo] of Object.entries(PHOTOS.dishes || {})) {
    if (!ids.includes(id)) problems.push('no dish has the id "' + id + '"');
    onDisk(photo && photo.src, 'dishes.' + id);
    if (photo && photo.src2x) onDisk(photo.src2x, 'dishes.' + id + ' @2x');
  }

  if (PHOTOS.hero) onDisk(PHOTOS.hero.src, 'hero');

  const layers = (PHOTOS.anatomy || {}).layers || [];
  for (const layer of layers) {
    if (!layer) continue;
    if (!stack.includes(layer.key)) problems.push('"' + layer.key + '" is not a layer the animation moves');
    onDisk(layer.src, 'anatomy layer ' + layer.key);
  }

  // Half a stack is worse than none, and main.js falls back to the drawing
  // rather than mixing the two — so say so here instead of leaving it a
  // mystery why five supplied photographs are not showing up.
  const named = layers.filter(Boolean).map((l) => l.key);
  if (named.length) {
    const gaps = stack.filter((key) => !named.includes(key));
    if (gaps.length) problems.push('anatomy stack is incomplete, so it stays drawn — missing ' + gaps.join(', '));
  }

  assert.deepEqual(problems, []);
});

/* ── Telling somebody ─────────────────────────────────────────────────
   A booking nobody sees is a guest arriving to no table, so the mail is
   worth testing against something that actually speaks SMTP rather than
   against a stub of our own making. */

/** A throwaway SMTP server that keeps what it is given. */
function catcher() {
  const net = require('node:net');
  const inbox = [];

  const server = net.createServer((socket) => {
    let buffer = '';
    let reading = false;
    let mail = { rcpt: [], data: '' };

    socket.setEncoding('utf8');
    socket.write('220 catcher ESMTP\r\n');

    socket.on('data', (chunk) => {
      buffer += chunk;
      let cut;
      while ((cut = buffer.indexOf('\r\n')) >= 0) {
        const line = buffer.slice(0, cut);
        buffer = buffer.slice(cut + 2);

        if (reading) {
          if (line === '.') {
            reading = false;
            inbox.push(mail);
            mail = { rcpt: [], data: '' };
            socket.write('250 queued\r\n');
          } else {
            mail.data += line + '\n';
          }
          continue;
        }

        const verb = line.toUpperCase();
        if (verb.startsWith('EHLO')) socket.write('250-catcher\r\n250-AUTH PLAIN LOGIN\r\n250 HELP\r\n');
        else if (verb.startsWith('AUTH')) { mail.auth = line; socket.write('235 authenticated\r\n'); }
        else if (verb.startsWith('MAIL FROM')) { mail.from = line; socket.write('250 ok\r\n'); }
        else if (verb.startsWith('RCPT TO')) { mail.rcpt.push(line); socket.write('250 ok\r\n'); }
        else if (verb === 'DATA') { reading = true; socket.write('354 go ahead\r\n'); }
        else if (verb === 'QUIT') { socket.write('221 bye\r\n'); socket.end(); }
        else socket.write('250 ok\r\n');
      }
    });
    socket.on('error', () => {});
  });

  return { server, inbox };
}

/** Headers and decoded body of a captured message. */
function opened(raw) {
  const split = raw.indexOf('\n\n');
  const head = raw.slice(0, split);
  const encoded = raw.slice(split + 2).replace(/\n/g, '');
  const subject = (head.match(/^Subject: (.*)$/m) || [, ''])[1];

  return {
    head,
    to: (head.match(/^To: (.*)$/m) || [, ''])[1],
    subject: /^=\?UTF-8\?B\?(.*)\?=$/.test(subject)
      ? Buffer.from(subject.replace(/^=\?UTF-8\?B\?|\?=$/g, ''), 'base64').toString('utf8')
      : subject,
    text: Buffer.from(encoded, 'base64').toString('utf8')
  };
}

test('a booking mails the guest and the floor', async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'meatologia-mail-'));
  process.env.BOOKINGS_FILE = path.join(dir, 'bookings.json');

  const post = catcher();
  await new Promise((r) => post.server.listen(0, '127.0.0.1', r));
  const smtp = 'smtp://127.0.0.1:' + post.server.address().port;

  process.env.SMTP_URL = smtp;
  process.env.MAIL_FROM = 'bookings@meatologia.pl';
  process.env.MAIL_TO = 'floor@meatologia.pl';
  // the throttle counts every booking this process has made, including
  // the ones the API test above made from the same address
  process.env.BOOKING_RATE = '500';

  const server = require('../server/server');
  await new Promise((r) => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;

  t.after(() => {
    server.close();
    post.server.close();
    delete process.env.SMTP_URL;
    delete process.env.MAIL_TO;
    delete process.env.BOOKING_RATE;
    fs.rmSync(dir, { recursive: true, force: true });
  });

  const soon = new Date();
  soon.setDate(soon.getDate() + 4);
  const date = R.toISODate(soon);

  const send = (body) => fetch(base + '/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const settle = async (wanted) => {
    for (let i = 0; i < 100 && post.inbox.length < wanted; i++) {
      await new Promise((r) => setTimeout(r, 20));
    }
  };

  await t.test('the guest is written to in the language they booked in', async () => {
    const res = await send({
      name: 'Anna Kowalska', phone: '600 000 000', email: 'anna@example.com',
      guests: 3, date, time: '19:00', notes: 'Urodziny', lang: 'pl'
    });
    assert.equal(res.status, 201);
    await settle(2);

    const all = post.inbox.map((m) => opened(m.data));
    const guest = all.find((m) => m.to === 'anna@example.com');
    assert.ok(guest, 'the guest was written to');
    assert.match(guest.subject, /Twój stolik w Meatologii/, 'subject in Polish');
    assert.match(guest.text, /Dzień dobry, Anna Kowalska/);
    assert.match(guest.text, /Urodziny/, 'their note is repeated back');
    assert.match(guest.text, /MT-[A-Z0-9]{5}/, 'and the reference');

    const floor = all.find((m) => m.to === 'floor@meatologia.pl');
    assert.ok(floor, 'the floor was told');
    assert.match(floor.subject, /NOWA REZERWACJA/);
    assert.match(floor.text, /600 000 000/, 'with a phone number to ring back on');
  });

  await t.test('a Korean guest gets Korean', async () => {
    post.inbox.length = 0;
    await send({
      name: '김민준', phone: '600 111 222', email: 'min@example.com',
      guests: 2, date, time: '20:00', lang: 'ko'
    });
    await settle(2);

    const guest = post.inbox.map((m) => opened(m.data)).find((m) => m.to === 'min@example.com');
    assert.ok(guest);
    assert.match(guest.subject, /예약 확인/);
    assert.match(guest.text, /예약이 확정되었습니다/);
  });

  await t.test('no email address still tells the floor', async () => {
    post.inbox.length = 0;
    const res = await send({
      name: 'Piotr Nowak', phone: '600 222 333',
      guests: 2, date, time: '20:30', lang: 'pl'
    });
    assert.equal(res.status, 201);
    await settle(1);

    const all = post.inbox.map((m) => opened(m.data));
    assert.equal(all.length, 1, 'one message, not two');
    assert.equal(all[0].to, 'floor@meatologia.pl');
  });

  await t.test('cancelling tells the floor too, and does not mail the guest', async () => {
    post.inbox.length = 0;
    const made = await (await send({
      name: 'Ewa Zielińska', phone: '600 333 444', email: 'ewa@example.com',
      guests: 2, date, time: '21:00', lang: 'pl'
    })).json();
    await settle(2);
    post.inbox.length = 0;

    const off = await fetch(base + '/api/bookings/' + made.booking.ref + '/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '600 333 444' })
    });
    assert.equal(off.status, 200);
    await settle(1);

    const all = post.inbox.map((m) => opened(m.data));
    assert.equal(all.length, 1);
    assert.equal(all[0].to, 'floor@meatologia.pl');
    assert.match(all[0].subject, /ODWOŁANA/);
  });

  await t.test('a dead mail server does not cost the guest their table', async () => {
    // a port with nothing behind it
    const dead = require('node:net').createServer();
    await new Promise((r) => dead.listen(0, '127.0.0.1', r));
    const port = dead.address().port;
    await new Promise((r) => dead.close(r));

    process.env.SMTP_URL = 'smtp://127.0.0.1:' + port;
    const res = await send({
      name: 'Marek Wójcik', phone: '600 444 555', email: 'marek@example.com',
      guests: 2, date, time: '18:00', lang: 'pl'
    });
    process.env.SMTP_URL = smtp;

    assert.equal(res.status, 201, 'the booking is still made');
    const kept = await (await fetch(base + '/api/bookings/' + (await res.json()).booking.ref)).json();
    assert.equal(kept.booking.status, 'confirmed', 'and still in the diary');
  });
});

test('SMTP credentials are never sent over a plain connection', () => {
  const mail = require('../server/mail');

  assert.throws(() => mail.parse('smtp://bob:hunter2@smtp.example.com'), /plain connection/);
  assert.doesNotThrow(() => mail.parse('smtps://bob:hunter2@smtp.example.com'));
  assert.doesNotThrow(() => mail.parse('smtp+starttls://bob:hunter2@smtp.example.com'));
  assert.doesNotThrow(() => mail.parse('smtp://127.0.0.1:1025'), 'a local catcher is fine');

  assert.equal(mail.parse('smtps://a:b@host').port, 465, 'implicit TLS defaults to 465');
  assert.equal(mail.parse('smtp+starttls://a:b@host').port, 587, 'STARTTLS to 587');

  // a subject that is not ASCII has to travel encoded
  assert.equal(mail.header('Twój stolik'), '=?UTF-8?B?VHfDs2ogc3RvbGlr?=');
  assert.equal(mail.header('Your table'), 'Your table', 'and one that is, does not');
});
