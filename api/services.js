// GET /api/services: tjenestekatalogen fra data/tjenester.json (docs/revisjon-2026-10/07-seo-og-agentlag.md §5).
// ?lang=en eller ?lang=nb gir bare feltene på det språket.
const catalog = require('../data/tjenester.json');

const LANGS = ['nb', 'en'];

// { nb: …, en: … } blir én verdi på valgt språk. Andre felt står som de er.
function pick(value, lang) {
  if (Array.isArray(value)) return value.map((v) => pick(v, lang));
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length && keys.every((k) => LANGS.includes(k))) return value[lang] ?? null;
    return Object.fromEntries(keys.map((k) => [k, pick(value[k], lang)]));
  }
  return value;
}

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).json({ error: 'Method not allowed' });

  const lang = String((req.query && req.query.lang) || '').toLowerCase();
  if (lang && !LANGS.includes(lang)) return res.status(400).json({ error: 'lang must be nb or en' });

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).json(lang ? { ...pick(catalog, lang), lang } : catalog);
};
