/**
 * Telling somebody a booking happened.
 *
 * Two messages per booking: one to the guest in the language they were
 * reading when they booked, and one to whoever is working the floor. The
 * second one matters more — a booking nobody sees is a guest arriving to
 * no table — so it is sent even when the guest left no email address.
 *
 * Nothing in here is allowed to fail a booking. The table is already in
 * the diary by the time this runs; if the mail server is down that is a
 * problem for the mail server, not for the guest standing at the door.
 * Failures are logged and swallowed.
 *
 *   SMTP_URL   smtps://user:pass@smtp.example.com:465   (see mail.js)
 *   MAIL_FROM  bookings@meatologia.pl
 *   MAIL_TO    the address the floor actually reads
 *
 * With SMTP_URL unset nothing is sent and the server says so at startup.
 */
const mail = require('./mail');
const RULES = require('../assets/js/booking-core');
const I18N = require('../assets/js/i18n');

const PLACE = 'Meatologia, Zwycięska 45/lok. 3, 53-033 Wrocław';

function config() {
  return {
    url: process.env.SMTP_URL || '',
    from: process.env.MAIL_FROM || 'bookings@meatologia.pl',
    to: process.env.MAIL_TO || '',
    on: Boolean(process.env.SMTP_URL)
  };
}

/** The locale for a language code, falling back to English. */
function localeOf(lang) {
  const found = I18N.languages.filter((l) => l.code === lang)[0];
  return (found || I18N.languages[0]).locale;
}

function say(lang, key, vars) {
  const table = I18N.strings[lang] || I18N.strings.en;
  let line = table[key] != null ? table[key] : I18N.strings.en[key];
  if (line == null) return key;
  return String(line).replace(/\{(\w+)\}/g, (whole, name) =>
    (vars && vars[name] != null ? String(vars[name]) : whole));
}

/* ── What the guest gets ─────────────────────────────────────────── */

function forGuest(booking) {
  const lang = I18N.strings[booking.lang] ? booking.lang : 'en';
  const when = RULES.prettyDate(booking.date, localeOf(lang));
  const t = (key, vars) => say(lang, key, vars);

  const lines = [
    t('mail.greeting', { name: booking.name }),
    '',
    t('mail.body'),
    '',
    t('mail.when') + ': ' + when + ', ' + booking.time,
    t('mail.guests') + ': ' + booking.guests,
    t('mail.ref') + ': ' + booking.ref,
    t('mail.where') + ': ' + PLACE
  ];
  if (booking.notes) lines.push(t('mail.notes') + ': ' + booking.notes);
  lines.push('', t('mail.change', { ref: booking.ref }), '', t('mail.signoff'));

  return {
    to: booking.email,
    subject: t('mail.subject', { date: when, time: booking.time }),
    text: lines.join('\n')
  };
}

/* ── What the floor gets ─────────────────────────────────────────── */

/* Polish, and blunt. Whoever reads this is standing up. */
function forFloor(booking, event) {
  const when = RULES.prettyDate(booking.date, 'pl-PL');
  const head = event === 'cancelled' ? 'ODWOŁANA' : 'NOWA REZERWACJA';

  const lines = [
    head,
    '',
    when + ', ' + booking.time,
    booking.guests + (booking.guests === 1 ? ' osoba' : ' os.'),
    booking.name,
    booking.phone
  ];
  if (booking.email) lines.push(booking.email);
  if (booking.notes) lines.push('', 'Uwagi: ' + booking.notes);
  lines.push('', booking.ref);

  return {
    to: config().to,
    subject: head + ' · ' + booking.date + ' ' + booking.time + ' · ' +
             booking.guests + ' os. · ' + booking.name,
    text: lines.join('\n')
  };
}

/* ── Sending ─────────────────────────────────────────────────────── */

/**
 * Send both messages. Resolves to what was sent and what was not, so the
 * caller can log it; never rejects.
 */
async function booked(booking, event) {
  const at = config();
  if (!at.on) return { skipped: 'no SMTP_URL' };

  const out = [];
  if (booking.email && event !== 'cancelled') out.push(['guest', forGuest(booking)]);
  if (at.to) out.push(['floor', forFloor(booking, event)]);

  const done = { sent: [], failed: [] };
  for (const [who, message] of out) {
    try {
      await mail.send(at.url, Object.assign({ from: at.from, fromName: 'Meatologia' }, message));
      done.sent.push(who);
    } catch (err) {
      done.failed.push(who + ': ' + err.message);
    }
  }
  return done;
}

module.exports = { booked, forGuest, forFloor, config };
