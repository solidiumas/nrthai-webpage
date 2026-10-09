// POST /api/inquiry: forespørselen på /book#skriv og /en/book#write (06 §6).
// Feltnavnene (email, company, role, problem, urgency) er uendret, så API-kontrakten holder.
const { sendMail, cors, wantsHtml, readBody, field, oneLine, sendPage } = require('./_lib/form');

const URGENCY_LABELS = {
  exploring: 'Vi utforsker',
  this_quarter: 'Dette kvartalet',
  asap: 'Så fort som mulig',
};

// Svarsiden når skjemaet er sendt uten JavaScript
const PAGES = {
  nb: {
    title: 'Book et møte om AI · Nrth AI',
    sent: {
      heading: 'Forespørselen er sendt.<br /> <em>Vi tar kontakt.</em>',
      text: 'Et menneske i Nrth AI-teamet svarer innen én virkedag fra <strong>contact@nrth.no</strong>.',
      link: { href: '/book#skriv', text: 'Send en ny →' },
    },
    error: {
      heading: 'Noe gikk galt.',
      text: 'Prøv igjen, eller send e-post til <a href="mailto:contact@nrth.no">contact@nrth.no</a>.',
      link: { href: '/book#skriv', text: 'Send en forespørsel →' },
    },
  },
  en: {
    title: 'Book a meeting about AI · Nrth AI',
    sent: {
      heading: "Request sent.<br /> <em>We'll be in touch.</em>",
      text: 'A person on the Nrth AI team replies within one business day from <strong>contact@nrth.no</strong>.',
      link: { href: '/en/book#write', text: 'Send another →' },
    },
    error: {
      heading: 'Something went wrong.',
      text: 'Please try again, or email <a href="mailto:contact@nrth.no">contact@nrth.no</a>.',
      link: { href: '/en/book#write', text: 'Send a request →' },
    },
  },
};

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const html = wantsHtml(req);
  const body = readBody(req);
  const lang = body && field(body, 'lang') === 'en' ? 'en' : 'nb';
  const reply = (status, json) => {
    if (!html) return res.status(status).json(json);
    const page = PAGES[lang];
    return sendPage(res, status, { lang, title: page.title, ...(status === 200 ? page.sent : page.error) });
  };

  if (!body) return reply(400, { error: 'Invalid JSON' });
  const email = field(body, 'email');
  const company = field(body, 'company');
  const role = field(body, 'role');
  const problem = field(body, 'problem');
  const urgency = field(body, 'urgency');

  if (!email || !problem) {
    return reply(400, { error: 'Email and problem are required' });
  }

  const lines = [`Fra: ${email}`];
  if (company) lines.push(`Bedrift: ${oneLine(company)}`);
  if (role) lines.push(`Rolle: ${oneLine(role)}`);
  lines.push(`Hvor haster det: ${URGENCY_LABELS[urgency] || urgency || 'Ikke oppgitt'}`);
  lines.push(`Språk: ${lang === 'en' ? 'engelsk' : 'norsk'}`);
  lines.push('', 'Hva de vil ha hjelp med:', problem);

  try {
    await sendMail({
      // Avsenderen må være et verifisert domene i Resend (nrth.no)
      from: 'brief@nrth.no',
      to: 'contact@nrth.no',
      replyTo: email,
      subject: oneLine(`${lang === 'en' ? 'Brief' : 'Forespørsel'} · ${company || email}`),
      text: lines.join('\n'),
    });

    return reply(200, { ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return reply(500, { error: 'Failed to send brief' });
  }
};
