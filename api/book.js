// POST /api/book: forespørsel om møte fra bookingseksjonen (docs/revisjon-2026-10/06-booking-og-skjema.md §5).
// Sender forespørselen til contact@nrth.no og en kvittering til kunden via Resend.
const { sendMail, cors, wantsHtml, readBody, field, oneLine, sendPage } = require('./_lib/form');

const FROM = 'Nrth AI <booking@nrth.no>';
const TO = 'contact@nrth.no';
const MAX_LENGTH = 2000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tema (06 §3). Engelske verdier gjøres om til norske, så innboksen bare har ett sett verdier.
const TOPICS = {
  'ai-vurdering': 'AI-vurdering',
  implementering: 'Implementering',
  'ai-tjenester': 'AI-tjenester',
  foredrag: 'Foredrag eller kurs',
  annet: 'Annet',
};
const TOPIC_FROM_EN = {
  'ai-assessment': 'ai-vurdering',
  implementation: 'implementering',
  'ai-services': 'ai-tjenester',
  talk: 'foredrag',
  other: 'annet',
};

// Valgene i skjemaet (06 §4). Verdiene er de samme på norsk og engelsk.
const GOALS = {
  salg: 'Øke salget',
  effektivitet: 'Jobbe mer effektivt',
  kvalitet: 'Forbedre kvalitet eller kundeopplevelse',
  'vet-ikke': 'Vet ikke ennå',
};
const WHEN = { 'denne-uken': 'Denne uken', 'neste-uke': 'Neste uke', senere: 'Om to uker eller senere' };
const FORMATS = { digitalt: 'Digitalt', bergen: 'I Bergen' };

const FIELDS = ['tema', 'navn', 'epost', 'bedrift', 'maal', 'naar', 'tid', 'form', 'website', 'lang'];

// Kvitteringen til kunden (06 §5). Temaet står midt i setningen og har derfor egne ord her.
// Engelsk «Other» står ikke i setningen («meet us about other» er ikke engelsk).
const RECEIPT = {
  nb: {
    subject: 'Vi har fått forespørselen din om møte',
    topics: {
      'ai-vurdering': 'AI-vurdering',
      implementering: 'implementering',
      'ai-tjenester': 'AI-tjenester',
      foredrag: 'foredrag eller kurs',
      annet: 'annet',
    },
    text: (name, topic) => [
      `Hei${name ? ` ${name}` : ''}.`,
      '',
      `Takk for at du vil møte oss om ${topic}. Vi svarer innen én virkedag med forslag til tidspunkt.`,
      '',
      'Hilsen Thomas og Simen, Nrth AI',
    ].join('\n'),
  },
  en: {
    subject: "We've received your meeting request",
    topics: {
      'ai-vurdering': 'AI assessment',
      implementering: 'implementation',
      'ai-tjenester': 'AI services',
      foredrag: 'a talk or course',
      annet: '',
    },
    text: (name, topic) => [
      `Hi${name ? ` ${name}` : ''}.`,
      '',
      `Thanks for wanting to meet us${topic ? ` about ${topic}` : ''}. We'll reply within one business day with a proposed time.`,
      '',
      'Best, Thomas and Simen, Nrth AI',
    ].join('\n'),
  },
};

// Svarsiden når skjemaet er sendt uten JavaScript (06 §4)
const PAGES = {
  nb: {
    lang: 'nb',
    title: 'Book et møte om AI · Nrth AI',
    sent: {
      heading: 'Takk.<br /> <em>Vi bekrefter tiden.</em>',
      text: 'Du får svar fra contact@nrth.no innen én virkedag med forslag til tidspunkt.',
      link: { href: '/book#book', text: 'Book et nytt møte →' },
    },
    error: {
      heading: 'Noe gikk galt.',
      text: 'Prøv igjen, eller send e-post til <a href="mailto:contact@nrth.no">contact@nrth.no</a>.',
      link: { href: '/book#book', text: 'Book et møte →' },
    },
  },
  en: {
    lang: 'en',
    title: 'Book a meeting about AI · Nrth AI',
    sent: {
      heading: "Thanks.<br /> <em>We'll confirm the time.</em>",
      text: "You'll hear from contact@nrth.no within one business day with a proposed time.",
      link: { href: '/en/book#book', text: 'Book another →' },
    },
    error: {
      heading: 'Something went wrong.',
      text: 'Please try again, or email <a href="mailto:contact@nrth.no">contact@nrth.no</a>.',
      link: { href: '/en/book#book', text: 'Book a meeting →' },
    },
  },
};

const submittedAt = () =>
  new Intl.DateTimeFormat('nb-NO', { timeZone: 'Europe/Oslo', dateStyle: 'short', timeStyle: 'short' }).format(new Date()) +
  ' (norsk tid)';

// Navnet står i kvitteringen. Lange navn og lenker tas ut, så skjemaet ikke kan brukes
// til å sende vilkårlig tekst fra booking@nrth.no til andre.
const safeName = (name) => (name.length <= 80 && !/https?:|www\.|[<>]/i.test(name) ? name : '');

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
  const f = Object.fromEntries(FIELDS.map((name) => [name, field(body, name)]));

  // Honningfelle: svar som om alt gikk bra, men send ingenting
  if (f.website) return reply(200, { ok: true });

  const tooLong = FIELDS.find((name) => f[name].length > MAX_LENGTH);
  if (tooLong) return reply(400, { error: `${tooLong} must be at most ${MAX_LENGTH} characters` });
  if (!f.navn || !f.epost || !f.tema) return reply(400, { error: 'navn, epost and tema are required' });
  if (!EMAIL.test(f.epost)) return reply(400, { error: 'epost must be an email address' });

  const value = f.tema.toLowerCase();
  const topic = TOPICS[value] ? value : TOPIC_FROM_EN[value];
  if (!topic) {
    return reply(400, { error: `tema must be one of: ${[...Object.keys(TOPICS), ...Object.keys(TOPIC_FROM_EN)].join(', ')}` });
  }

  const line = (label, v) => `${label}: ${oneLine(v) || '–'}`;
  const text = [
    line('Tema', TOPICS[topic]),
    line('Navn', f.navn),
    line('E-post', f.epost),
    line('Bedrift', f.bedrift),
    line('Mål', GOALS[f.maal] || f.maal),
    line('Når', WHEN[f.naar] || f.naar),
    line('Foretrukket tidspunkt', f.tid),
    line('Møteform', FORMATS[f.form] || f.form),
    line('Språk', lang === 'en' ? 'engelsk' : 'norsk'),
    line('Sendt', submittedAt()),
  ].join('\n');

  try {
    await sendMail({
      from: FROM,
      to: TO,
      replyTo: f.epost,
      subject: oneLine(`Møte · ${TOPICS[topic]} · ${f.bedrift || f.epost}`),
      text,
    });
  } catch (err) {
    console.error('Resend error (book):', err);
    return reply(500, { error: 'Failed to send' });
  }

  // Forespørselen er kommet frem. Feiler kvitteringen, logges det, men svaret er fortsatt 200,
  // så kunden ikke sender samme forespørsel to ganger.
  const receipt = RECEIPT[lang];
  try {
    await sendMail({
      from: FROM,
      to: f.epost,
      replyTo: TO,
      subject: receipt.subject,
      text: receipt.text(safeName(oneLine(f.navn)), receipt.topics[topic]),
    });
  } catch (err) {
    console.error('Resend error (book receipt):', err);
  }

  return reply(200, { ok: true });
};
