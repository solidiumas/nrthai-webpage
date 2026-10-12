// Felles for skjemafunksjonene i api/ (book.js og inquiry.js).
// Filer og mapper som starter med _ i api/ blir ikke egne Vercel-funksjoner.

const { Resend } = require('resend');

let resend;
// Lages først når noe skal sendes. Mangler RESEND_API_KEY, kaster konstruktøren,
// og funksjonen svarer 500 i stedet for å krasje ved oppstart.
function mailer() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

// Resend-klienten (v4) kaster ikke ved feil, men svarer { data, error }
async function sendMail(message) {
  const { data, error } = await mailer().emails.send(message);
  if (error) throw Object.assign(new Error(error.message || 'Resend error'), { resend: error });
  return data;
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Uten JavaScript sendes skjemaet som vanlig POST (application/x-www-form-urlencoded).
// Da svarer vi med en HTML-side. Med JavaScript sendes det som JSON, og svaret er JSON.
function wantsHtml(req) {
  const type = String(req.headers['content-type'] || '');
  const accept = String(req.headers.accept || '');
  return type.startsWith('application/x-www-form-urlencoded') && accept.includes('text/html');
}

// req.body er en getter hos Vercel og kaster ved ugyldig JSON. Gir null da.
function readBody(req) {
  try {
    const body = req.body;
    return body && typeof body === 'object' && !Buffer.isBuffer(body) ? body : {};
  } catch (err) {
    return null;
  }
}

function field(body, name) {
  const value = body[name];
  return value == null ? '' : String(value).trim();
}

// Til emnelinjer og én-linjes felt i e-posten
const oneLine = (s) => String(s).replace(/\s+/g, ' ').trim();

const LOGO = {
  nb: { href: '/', label: 'Nrth AI, til forsiden' },
  en: { href: '/en', label: 'Nrth AI, home' },
};

// Enkel side med kvittering eller feilmelding. Innholdet er faste tekster fra
// funksjonene, aldri noe kunden har skrevet.
function sendPage(res, status, { lang, title, heading, text, link }) {
  const logo = LOGO[lang] || LOGO.nb;
  const html = `<!doctype html>
<html lang="${lang}" data-theme="dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${title}</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@700,900&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/site.css" />
</head>
<body>
<header class="site-nav">
  <a class="logo" href="${logo.href}" aria-label="${logo.label}">
    <span class="logo-mark">&lt;/&gt;</span>
    <span class="logo-word">Nrth AI</span>
  </a>
</header>
<main id="main">
  <section class="page-hero">
    <h1>${heading}</h1>
    <p class="lede">${text}</p>
    <a class="btn-ghost" href="${link.href}">${link.text}</a>
  </section>
</main>
</body>
</html>
`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).send(html);
}

module.exports = { sendMail, cors, wantsHtml, readBody, field, oneLine, sendPage };
