/**
 * Just enough SMTP to send a booking confirmation.
 *
 * No dependencies, on purpose: the rest of this project has none, and a
 * restaurant already has a mailbox somewhere. Point SMTP_URL at it and
 * this speaks to it directly.
 *
 *   smtps://user:pass@smtp.example.com:465        implicit TLS
 *   smtp+starttls://user:pass@smtp.example.com:587
 *   smtp://127.0.0.1:1025                          plain, localhost only
 *
 * What it deliberately does not do: attachments, multiple recipients per
 * message, connection pooling, or retries. One booking, one short mail.
 * If the restaurant outgrows that, replace this file — notify.js only
 * needs `send()`.
 */
const net = require('node:net');
const tls = require('node:tls');

const TIMEOUT = 15000;

/* ── The address ─────────────────────────────────────────────────── */

function parse(url) {
  const at = new URL(url);
  const scheme = at.protocol.replace(':', '');

  const secure = scheme === 'smtps';
  const starttls = scheme === 'smtp+starttls';
  if (!secure && !starttls && scheme !== 'smtp') {
    throw new Error('SMTP_URL scheme must be smtp, smtps or smtp+starttls, not ' + scheme);
  }

  const host = at.hostname;
  const user = decodeURIComponent(at.username || '');
  const pass = decodeURIComponent(at.password || '');
  const local = host === 'localhost' || host === '127.0.0.1' || host === '::1';

  // A password sent over an unencrypted socket is a password given away.
  // Localhost is exempt because that is how you run a catcher in dev.
  if (user && !secure && !starttls && !local) {
    throw new Error('refusing to send SMTP credentials over a plain connection to ' + host);
  }

  return {
    host, user, pass, secure, starttls, local,
    port: Number(at.port) || (secure ? 465 : 587)
  };
}

/* ── The conversation ────────────────────────────────────────────── */

/**
 * A reply is one or more lines; only the last has a space after the code
 * ("250-STARTTLS" continues, "250 OK" ends). Anything 4xx or 5xx throws.
 */
function talk(socket) {
  let buffer = '';
  let reply = [];
  let waiting = null;

  socket.setEncoding('utf8');
  socket.on('data', (chunk) => {
    buffer += chunk;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop();

    for (const line of lines) {
      reply.push(line.slice(4));
      if (!/^\d{3} /.test(line)) continue;      // still a continuation

      // The whole reply, not just its last line — the capability list
      // an EHLO comes back with is entirely in the continuations.
      const text = reply.join('\n');
      const code = Number(line.slice(0, 3));
      reply = [];

      const done = waiting;
      waiting = null;
      if (done) done(code, text);
    }
  });

  return function say(command) {
    return new Promise((resolve, reject) => {
      waiting = (code, text) => {
        if (code >= 400) reject(new Error('SMTP ' + code + ' ' + text + (command ? ' (after ' + command.split(' ')[0] + ')' : '')));
        else resolve({ code, text });
      };
      if (command !== null) socket.write(command + '\r\n');
    });
  };
}

/* ── Encoding ────────────────────────────────────────────────────── */

/** RFC 2047, so a subject can hold "Rezerwacja" or "예약". */
function header(value) {
  return /^[\x20-\x7e]*$/.test(value)
    ? value
    : '=?UTF-8?B?' + Buffer.from(value, 'utf8').toString('base64') + '?=';
}

function body(text) {
  return Buffer.from(text, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n');
}

function message(mail) {
  return [
    'From: ' + (mail.fromName ? header(mail.fromName) + ' <' + mail.from + '>' : mail.from),
    'To: ' + mail.to,
    'Subject: ' + header(mail.subject),
    'Date: ' + new Date().toUTCString(),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    body(mail.text)
  ].join('\r\n');
}

/* ── Sending ─────────────────────────────────────────────────────── */

async function send(url, mail) {
  const at = parse(url);

  let socket = at.secure
    ? tls.connect({ host: at.host, port: at.port, servername: at.host })
    : net.connect({ host: at.host, port: at.port });

  socket.setTimeout(TIMEOUT);

  const failed = new Promise((_, reject) => {
    socket.once('error', reject);
    socket.once('timeout', () => { socket.destroy(); reject(new Error('SMTP timed out talking to ' + at.host)); });
  });

  async function run() {
    let say = talk(socket);
    await say(null);                                    // the greeting
    let hello = await say('EHLO meatologia');

    if (at.starttls) {
      await say('STARTTLS');
      socket = tls.connect({ socket, host: at.host, servername: at.host });
      socket.setTimeout(TIMEOUT);
      await new Promise((ok, no) => { socket.once('secureConnect', ok); socket.once('error', no); });
      say = talk(socket);
      hello = await say('EHLO meatologia');             // capabilities change after upgrading
    }

    if (at.user) {
      // AUTH PLAIN is one round trip and every server that authenticates
      // at all supports it; LOGIN is the fallback for the ones that lie.
      const plain = Buffer.from('\0' + at.user + '\0' + at.pass, 'utf8').toString('base64');
      if (/AUTH[ =-][^\r\n]*PLAIN/i.test(hello.text) || !/AUTH[ =-]/i.test(hello.text)) {
        await say('AUTH PLAIN ' + plain);
      } else {
        await say('AUTH LOGIN');
        await say(Buffer.from(at.user, 'utf8').toString('base64'));
        await say(Buffer.from(at.pass, 'utf8').toString('base64'));
      }
    }

    await say('MAIL FROM:<' + mail.from + '>');
    await say('RCPT TO:<' + mail.to + '>');
    await say('DATA');
    await say(message(mail) + '\r\n.');
    await say('QUIT').catch(() => {});                  // some servers just hang up
  }

  try {
    await Promise.race([run(), failed]);
  } finally {
    socket.destroy();
  }
}

module.exports = { send, parse, message, header };
