// Lager innsiktssidene fra docs/innsikt/*.md. Nettstedet har ingen byggesteg: kjør skriptet og commit resultatet.
//   node scripts/innsikt.mjs          skriver sidene
//   node scripts/innsikt.mjs --sjekk  skriver ingenting, feiler hvis noe er utdatert eller bryter reglene
// Skriver:
//  - innsikt/<slug>/index.html (én per artikkel), innsikt/index.html, en/insights/index.html, innsikt/feed.xml
//  - innsiktsdelen på forsiden og /en, og i sitemap.xml (mellom <!-- innsikt:start --> og <!-- innsikt:slutt -->)
//  - avsnittet «## Innsikt» i llms.txt
// Meny, footer og bookingseksjon hentes fra partials/, så de er like på alle sider.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://nrth.no";
const SJEKK = process.argv.includes("--sjekk");
const read = (f) => readFileSync(join(ROOT, f), "utf8");
const errors = [];
const feil = (msg) => errors.push(msg);

const FORFATTERE = {
  "thomas-uthaug": { navn: "Thomas Uthaug", stilling: "Medgründer, forretning, produkt og leveranse", linkedin: "https://www.linkedin.com/in/thomas-uthaug" },
  "simen-uthaug": { navn: "Simen Uthaug", stilling: "Medgründer, teknologi og utvikling", linkedin: "https://www.linkedin.com/in/simen-uthaug" },
};
const TEMA = {
  "Ta i bruk AI": "Getting started with AI",
  "Lokal AI og datakontroll": "Local AI and data control",
  "AI-assistenter": "AI assistants",
  "Regelverk og trygghet": "Rules and safety",
  "Verktøyvalg": "Choosing tools",
};
// Beslutninger etter revisjonen (CLAUDE.md regel 5, budskapet fra 19. oktober 2026) og plassholdere som ikke skal ut.
const FORBUDT = [
  /AI-medarbeider/i, /\berstatt/i, /døgnet rundt/i, /uten å ansette/i, /brøkdel av en ansatt/i,
  /Agentic OS/i, /on-premise runtime/i, /data never leaves/i, /aldri forlater/i, /forlater aldri/i,
  /\b72 ?%/, /5×/, /0 FTE/i, /Sett inn eget eksempel/i, /\[[^\]]*\](?!\()/, /!/,
  // Det samme på engelsk (en_tittel og en_beskrivelse står på /en og /en/insights)
  /\breplac/i, /around the clock/i, /24\/7/, /without hiring/i, /never leaves/i,
];
// Lenker i markdown, med én nivå parenteser i adressen: [tekst](https://no.wikipedia.org/wiki/Mistral_(selskap))
const LENKE = /\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g;

const MND = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const datoNb = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${d}. ${MND[m - 1]} ${y}`; };
const ekteDato = (iso) => /^\d{4}-\d{2}-\d{2}$/.test(iso) && !isNaN(Date.parse(iso)) && new Date(iso).toISOString().slice(0, 10) === iso;
const datoEn = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Hardt mellomrom i tall og foran enheter, som på resten av nettstedet: 35&nbsp;000&nbsp;kr
const typo = (h) => h
  .replace(/(\d) (?=\d{3}(?!\d))/g, "$1&nbsp;")
  .replace(/(\d) (kr|kroner|%|prosent|millioner|milliarder|MNOK)(?![\wæøåÆØÅ])/g, "$1&nbsp;$2");
const indent = (s, n) => s.split("\n").map((l) => (l ? " ".repeat(n) + l : l)).join("\n");
const json = (o) => JSON.stringify(o, null, 2).replace(/</g, "\\u003c");
const ldScript = (o) => `<script type="application/ld+json">\n${json(o)}\n</script>`;

// ───── Kildefilene ─────
function parse(file) {
  const raw = read(`docs/innsikt/${file}`).replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`docs/innsikt/${file}: mangler front matter`);
  const a = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) a[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  a.fil = `docs/innsikt/${file}`;
  a.nummer = Number(a.nummer);
  a.relaterte = (a.relaterte || "").split(",").map((s) => s.trim()).filter(Boolean);
  a.blokker = blokker(m[2]);
  const first = a.blokker.shift();
  if (!first || first.kind !== "p") feil(`${a.fil}: første avsnitt (ingressen) mangler`);
  a.ingress = first ? first.lines.join(" ") : "";
  a.url = `${SITE}/innsikt/${a.slug}`;
  return a;
}

function blokker(md) {
  const out = [];
  let cur = null;
  for (const line of md.split("\n")) {
    const t = line.trim();
    // «2. august 2026 …» midt i et avsnitt er tekst, ikke en liste: en liste starter etter en tom linje.
    const ol = /^\d+\. /.test(t) && (!cur || cur.kind === "ol");
    const kind = !t ? null : t.startsWith("## ") ? "h2" : /^#/.test(t) ? "heading" : t.startsWith("|") ? "table" : /^- /.test(t) ? "ul" : ol ? "ol" : "p";
    if (!kind) { cur = null; continue; }
    if (kind === "h2" || kind === "heading") { out.push({ kind, lines: [t] }); cur = null; continue; }
    if (!cur || cur.kind !== kind) { cur = { kind, lines: [] }; out.push(cur); }
    cur.lines.push(t);
  }
  return out;
}

function validate(a, slugs) {
  for (const k of ["slug", "tittel", "h1", "beskrivelse", "forfatter", "tema", "publisert", "oppdatert", "en_tittel", "en_beskrivelse"]) {
    if (!a[k]) feil(`${a.fil}: mangler «${k}»`);
  }
  if (a.fil !== `docs/innsikt/${a.slug}.md`) feil(`${a.fil}: slug «${a.slug}» stemmer ikke med filnavnet`);
  if (a.tittel && a.tittel.length > 60) feil(`${a.fil}: tittelen er ${a.tittel.length} tegn (maks 60)`);
  if (a.beskrivelse && a.beskrivelse.length > 155) feil(`${a.fil}: beskrivelsen er ${a.beskrivelse.length} tegn (maks 155)`);
  if (a.h1 && a.h1.length > 110) feil(`${a.fil}: h1 er ${a.h1.length} tegn (maks 110, Googles grense for headline)`);
  if (a.en_beskrivelse && a.en_beskrivelse.length > 155) feil(`${a.fil}: en_beskrivelse er ${a.en_beskrivelse.length} tegn (maks 155)`);
  for (const k of ["publisert", "oppdatert"]) if (a[k] && !ekteDato(a[k])) feil(`${a.fil}: ${k} skal være en dato som ÅÅÅÅ-MM-DD («${a[k]}»)`);
  if (!Number.isInteger(a.nummer) || a.nummer < 1) feil(`${a.fil}: nummer skal være et heltall fra 1`);
  if (a.oppdatert < a.publisert) feil(`${a.fil}: oppdatert er før publisert`);
  if (!FORFATTERE[a.forfatter]) feil(`${a.fil}: ukjent forfatter «${a.forfatter}»`);
  if (!TEMA[a.tema]) feil(`${a.fil}: ukjent tema «${a.tema}» (legg det inn i TEMA i scripts/innsikt.mjs)`);
  for (const r of a.relaterte) if (r === a.slug || !slugs.has(r)) feil(`${a.fil}: relatert artikkel «${r}» finnes ikke`);
  for (const b of a.blokker) if (b.kind === "heading") feil(`${a.fil}: bare ## er lov som overskrift («${b.lines[0]}»)`);
  for (const b of a.blokker) if (b.kind === "ol" && !b.lines[0].startsWith("1. ")) feil(`${a.fil}: nummerert liste som ikke starter på 1 («${b.lines[0].slice(0, 40)}»)`);
  // Teksten uten lenkeadresser, så [tekst](url) ikke ser ut som en plassholder
  const tekst = [a.tittel, a.h1, a.beskrivelse, a.en_tittel, a.en_beskrivelse, a.ingress, ...a.blokker.flatMap((b) => b.lines)].join("\n").replace(LENKE, "$1");
  for (const re of FORBUDT) {
    const m = tekst.match(re);
    if (m) feil(`${a.fil}: «${m[0]}» skal ikke stå i teksten (${re})`);
  }
}

// ───── Markdown til HTML ─────
function lenke(text, url, ctx) {
  let href = url.replace(/^https:\/\/nrth\.no(?=\/|$)/, "") || "/";
  if (ctx.bookAnchor && href === "/book") href = "#book";
  const web = /^https?:/.test(href);
  const ext = web || /^(mailto|tel):/.test(href);
  if (!ext) (href.startsWith("#") ? ctx.ankre : ctx.lenker).push(href);
  if (ctx.absolutt && !ext) href = href.startsWith("#") ? `${ctx.url}${href}` : `${SITE}${href}`;
  return `<a href="${esc(href)}"${web ? ' rel="noopener"' : ""}>${text}</a>`;
}

function inline(s, ctx) {
  let h = esc(s);
  h = h.replace(LENKE, (_, text, url) => lenke(text, url.replace(/&amp;/g, "&"), ctx));
  h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return typo(h);
}

const slugify = (t) => t.toLowerCase().replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
  .normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Tabellen kan bli bredere enn mobilskjermen. Rammen ruller sidelengs, får tastaturfokus og navnet fra overskriften over.
function tabell(lines, ctx, fil, overskrift) {
  const rows = lines.map((l) => l.replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|")));
  const [head, sep, ...body] = rows;
  if (!sep || !sep.every((c) => /^:?-{3,}:?$/.test(c))) { feil(`${fil}: tabellen mangler skillelinje under overskriftsraden`); return ""; }
  for (const r of body) if (r.length !== head.length) feil(`${fil}: en tabellrad har ${r.length} celler, overskriften har ${head.length}`);
  const th = head.map((c) => `<th scope="col">${inline(c, ctx)}</th>`).join("");
  const tr = body.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${inline(c, ctx)}</th>` : `<td>${inline(c, ctx)}</td>`)).join("")}</tr>`);
  const navn = overskrift ? ` aria-labelledby="${overskrift}"` : "";
  return `<div class="table-wrap" role="region" tabindex="0"${navn}>\n  <table>\n    <thead><tr>${th}</tr></thead>\n    <tbody>\n${tr.map((t) => `      ${t}`).join("\n")}\n    </tbody>\n  </table>\n</div>`;
}

function brodtekst(a, ctx) {
  const ids = new Set();
  let sist = null;
  const html = a.blokker.map((b) => {
    if (b.kind === "h2") {
      const t = b.lines[0].slice(3);
      let id = slugify(t);
      while (ids.has(id)) id += "-2";
      ids.add(id);
      sist = id;
      return `<h2 id="${id}">${inline(t, ctx)}</h2>`;
    }
    if (b.kind === "p") return `<p>${inline(b.lines.join(" "), ctx)}</p>`;
    if (b.kind === "ul" || b.kind === "ol") return `<${b.kind}>\n${b.lines.map((l) => `  <li>${inline(l.replace(/^(- |\d+\. )/, ""), ctx)}</li>`).join("\n")}\n</${b.kind}>`;
    if (b.kind === "table") return tabell(b.lines, ctx, a.fil, sist);
    return "";
  }).join("\n");
  ctx.ids = ids;
  return html;
}

// ───── Felles deler fra partials/ og eksisterende sider ─────
const cssVersjon = read("index.html").match(/site\.css\?v=([\w-]+)/)[1];
const partial = (navn, start, slutt) => {
  const s = read(`partials/${navn}`);
  const i = s.indexOf(start), j = s.indexOf(slutt, i);
  if (i < 0 || j < 0) throw new Error(`partials/${navn}: fant ikke ${start} … ${slutt}`);
  return s.slice(i, j + slutt.length);
};
const skript = (side) => read(side).split("</footer>")[1].match(/<script src=[^\n]+/g).join("\n");
const SPRAK = {
  nb: {
    meny: partial("nav.nb.html", '<a class="skip-link"', "</header>"),
    footer: partial("footer.nb.html", "<!-- ───────── Footer", "</footer>"),
    booking: partial("booking.nb.html", "<!-- ───────── Book et møte", "</section>"),
    skript: skript("sporsmal-og-svar/index.html"),
    sprakLenke: /(<a class="nav-link lang-switch" href=")[^"]*(")/, footerSprak: /(<li><a href=")[^"]*(" hreflang="en" lang="en">English<\/a><\/li>)/,
    innsikt: '<a class="nav-link" href="/innsikt">', locale: "nb_NO", og: "og.png", ogAlt: "Nrth AI. Vi løser AI for norske bedrifter.",
  },
  en: {
    meny: partial("nav.en.html", '<a class="skip-link"', "</header>"),
    footer: partial("footer.en.html", "<!-- ───────── Footer", "</footer>"),
    booking: partial("booking.en.html", "<!-- ───────── Book et møte", "</section>"),
    skript: skript("en/faq/index.html"),
    sprakLenke: /(<a class="nav-link lang-switch" href=")[^"]*(")/, footerSprak: /(<li><a href=")[^"]*(" hreflang="nb" lang="nb">Norsk<\/a><\/li>)/,
    innsikt: '<a class="nav-link" href="/en/insights">', locale: "en_GB", og: "og-en.png", ogAlt: "Nrth AI. We solve AI for businesses.",
  },
};

function head({ lang, tittel, beskrivelse, url, alternates, ogType, ekstraMeta = "", ld, bilde }) {
  const L = SPRAK[lang];
  const og = bilde || { url: `${SITE}/${L.og}`, alt: L.ogAlt };
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<!-- .js skrur på animasjonene (assets/reveal.js). Lastes ikke skriptet innen tre sekunder, fjernes klassen så alt vises. -->
<script>
  document.documentElement.classList.add("js");
  setTimeout(function () { if (!window.nrthReveal) document.documentElement.classList.remove("js"); }, 3000);
</script>
<!-- Laget av scripts/innsikt.mjs fra docs/innsikt/. Endre kilden og kjør skriptet, ikke denne filen. -->
<title>${esc(tittel)}</title>
<meta name="description" content="${esc(beskrivelse)}" />
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
<link rel="canonical" href="${url}" />
${alternates.map(([hl, href]) => `<link rel="alternate" hreflang="${hl}" href="${href}" />`).join("\n")}
<meta property="og:type" content="${ogType}" />
<meta property="og:site_name" content="Nrth AI" />
<meta property="og:title" content="${esc(tittel)}" />
<meta property="og:description" content="${esc(beskrivelse)}" />
<meta property="og:url" content="${url}" />
<meta property="og:locale" content="${L.locale}" />
<meta property="og:image" content="${og.url}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${esc(og.alt)}" />
${ekstraMeta}<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="mask-icon" href="/favicon.svg" color="#ff8a5b" />
<meta name="theme-color" content="#ffffff" />
<link rel="alternate" type="text/markdown" href="/llms.txt" title="Nrth AI for LLMs" />
<link rel="alternate" type="application/atom+xml" href="/innsikt/feed.xml" title="Innsikt · Nrth AI" />

<!-- Strukturerte data -->
${ld.map(ldScript).join("\n")}

<link rel="preload" href="/assets/fonts/figtree-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="/assets/site.css?v=${cssVersjon}" />
<!-- Satoshi (logoen) fra Fontshare, lastet uten å blokkere visningen. Lisensen tillater ikke filene i et offentlig repo. -->
<link rel="preconnect" href="https://api.fontshare.com" />
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin />
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@700,900&display=swap" media="print" onload="this.media='all'" />
<noscript><link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@700,900&display=swap" /></noscript>
</head>
<body>
`;
}

function side({ lang, annetSprak, main, gjeldende, ...h }) {
  const L = SPRAK[lang];
  let meny = L.meny.replace(L.sprakLenke, `$1${annetSprak}$2`);
  if (gjeldende) meny = meny.replace(L.innsikt, L.innsikt.replace(">", ' aria-current="page">'));
  const footer = L.footer.replace(L.footerSprak, `$1${annetSprak}$2`);
  return `${head({ lang, ...h })}${meny}

<main id="main">
${main}
${indent(L.booking, 2)}
</main>

${footer}
${L.skript}
</body>
</html>
`;
}

const brodsmuler = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })),
});
const person = (slug) => {
  const f = FORFATTERE[slug];
  return { "@type": "Person", "@id": `${SITE}/om-oss#${slug}`, name: f.navn, url: `${SITE}/om-oss#${slug}`, jobTitle: f.stilling, sameAs: [f.linkedin], worksFor: { "@id": `${SITE}/#organization` } };
};
const utgiver = { "@type": "Organization", "@id": `${SITE}/#organization`, name: "Nrth AI", legalName: "Nrth AI AS", url: `${SITE}/`, logo: { "@type": "ImageObject", url: `${SITE}/logo-light.png` } };

// ───── Kort ─────
function kort(a, { lang, h, d, alltidMeta = true }) {
  const f = FORFATTERE[a.forfatter];
  const en = lang === "en";
  const head = en
    ? `<div class="card-head"><span>${TEMA[a.tema]}</span> <span class="tag">In Norwegian</span></div>`
    : `<div class="card-head"><span>${esc(a.tema)}</span></div>`;
  const tittel = en ? `<a href="/innsikt/${a.slug}" hreflang="nb">${esc(a.en_tittel)}</a>` : `<a href="/innsikt/${a.slug}">${esc(a.tittel)}</a>`;
  const tekst = en ? a.en_beskrivelse : a.beskrivelse;
  const dato = en ? datoEn(a.publisert) : datoNb(a.publisert);
  return `<article class="card card--link" data-reveal style="--d: ${d}">
  ${head}
  <${h}>${tittel}</${h}>
  <p>${typo(esc(tekst))}</p>
  <p class="card-meta">${f.navn} · <time datetime="${a.publisert}">${dato}</time></p>
</article>`;
}

// Delingsbildet med tittelen (innsikt/<slug>/og.png) lages av scripts/innsikt-bilder.mjs, som også skriver og.json
// med teksten bildet viser. Mangler bildet, brukes og.png. Viser bildet en annen tekst enn kilden, stopper skriptet.
function delingsbilde(a) {
  const png = `innsikt/${a.slug}/og.png`, meta = `innsikt/${a.slug}/og.json`;
  if (!existsSync(join(ROOT, png))) return { url: `${SITE}/og.png`, alt: SPRAK.nb.ogAlt };
  const vist = existsSync(join(ROOT, meta)) ? JSON.parse(read(meta)) : {};
  const ulikt = ["tittel", "tema", "forfatter"].filter((k) => vist[k] !== a[k]);
  if (ulikt.length) feil(`${png} viser ikke samme ${ulikt.join(", ")} som ${a.fil}. Lag bildet på nytt med scripts/innsikt-bilder.mjs`);
  return { url: `${SITE}/${png}`, alt: a.tittel };
}

// ───── Artikkelside ─────
function artikkelside(a, alle) {
  const f = FORFATTERE[a.forfatter];
  const ctx = { lenker: [], ankre: [], bookAnchor: true };
  const ingress = inline(a.ingress, ctx);
  const body = brodtekst(a, ctx);
  a.lenker = [...ctx.lenker, `/om-oss#${a.forfatter}`];
  // #book og #main er bookingseksjonen og hovedinnholdet, som alltid står på siden
  for (const anker of ctx.ankre) if (!ctx.ids.has(anker.slice(1)) && !["book", "main"].includes(anker.slice(1))) feil(`${a.fil}: ankeret ${anker} finnes ikke i artikkelen`);
  const oppdatert = a.oppdatert !== a.publisert ? ` <span>Oppdatert <time datetime="${a.oppdatert}">${datoNb(a.oppdatert)}</time></span>` : "";
  const relaterte = a.relaterte.map((s) => alle.find((x) => x.slug === s)).filter(Boolean);
  const bilde = delingsbilde(a);
  const ord = [a.ingress, ...a.blokker.flatMap((b) => b.lines)].join(" ").replace(/\]\([^)]*\)/g, "]").split(/\s+/).filter((w) => /[\wæøå]/i.test(w)).length;
  const main = `  <article>
    <!-- ───────── Sidehero ───────── -->
    <header class="page-hero page-hero--article">
      <div class="wrap">
        <nav class="breadcrumb" aria-label="Brødsmulesti">
          <ol><li><a href="/">Forside</a></li><li><a href="/innsikt">Innsikt</a></li></ol>
        </nav>
        <h1>${typo(esc(a.h1))}</h1>
        <p class="lede">${ingress}</p>
        <p class="byline dots"><span>Av <a href="/om-oss#${a.forfatter}" rel="author">${f.navn}</a></span> <span>Publisert <time datetime="${a.publisert}">${datoNb(a.publisert)}</time></span>${oppdatert}</p>
      </div>
    </header>

    <!-- ───────── Artikkelen ───────── -->
    <div class="section">
      <div class="wrap">
        <div class="prose">
${indent(body, 10)}
        </div>
      </div>
    </div>
  </article>

  <!-- ───────── Les også ───────── -->
  <section class="section section--compact">
    <div class="wrap">
      <div class="section-header" data-reveal>
        <p class="kicker">Innsikt</p>
        <h2>Les <em>også</em>.</h2>
      </div>
      <div class="card-grid card-grid--2">
${indent(relaterte.map((r, i) => kort(r, { lang: "nb", h: "h3", d: i })).join("\n"), 8)}
      </div>
      <div class="section-actions" data-reveal>
        <a class="link-arrow" href="/innsikt">Alle artikler →</a>
      </div>
    </div>
  </section>
`;
  return side({
    lang: "nb", annetSprak: "/en/insights", main,
    tittel: a.tittel, beskrivelse: a.beskrivelse, url: a.url, ogType: "article", bilde,
    alternates: [["nb", a.url], ["x-default", a.url]],
    ekstraMeta: `<meta name="author" content="${f.navn}" />
<meta property="article:published_time" content="${a.publisert}" />
<meta property="article:modified_time" content="${a.oppdatert}" />
<meta property="article:section" content="${esc(a.tema)}" />
`,
    ld: [
      brodsmuler([["Nrth AI", `${SITE}/`], ["Innsikt", `${SITE}/innsikt`], [a.tittel, a.url]]),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${a.url}#artikkel`,
        headline: a.h1,
        description: a.beskrivelse,
        url: a.url,
        mainEntityOfPage: a.url,
        inLanguage: "nb",
        datePublished: a.publisert,
        dateModified: a.oppdatert,
        articleSection: a.tema,
        wordCount: ord,
        image: bilde.url,
        author: person(a.forfatter),
        publisher: utgiver,
        isPartOf: { "@type": "CollectionPage", "@id": `${SITE}/innsikt` },
      },
    ],
  });
}

// ───── Oversiktssidene ─────
const NB_HUB = {
  tittel: "Innsikt om AI for bedrifter · Nrth AI",
  beskrivelse: "Artikler om AI i norske bedrifter: hva det koster, personvern, AI-forordningen, lokal AI, AI-assistenter og valg av verktøy.",
  kicker: "Innsikt",
  h1: "Innsikt om AI for <em>norske bedrifter</em>.",
  lede: "Artikler om å ta i bruk AI i bedriften: hva det koster, hva regelverket sier og hvor dere bør begynne.",
};
const EN_HUB = {
  tittel: "Insights on AI for businesses in Norway · Nrth AI",
  beskrivelse: "Articles on AI in Norwegian businesses: costs, privacy, the EU AI Act, local AI, AI assistants and choosing tools. The articles are in Norwegian.",
  kicker: "Insights",
  h1: "Insights on AI for <em>Norwegian businesses</em>.",
  lede: "Articles on putting AI to work in a business: what it costs, what the rules say and where to start. The articles are in Norwegian.",
};

function oversikt(lang, alle) {
  const en = lang === "en";
  const T = en ? EN_HUB : NB_HUB;
  const url = en ? `${SITE}/en/insights` : `${SITE}/innsikt`;
  const main = `  <!-- ───────── Sidehero ───────── -->
  <section class="page-hero">
    <div class="wrap">
      <p class="kicker">${T.kicker}</p>
      <h1>${T.h1}</h1>
      <p class="lede">${T.lede}</p>
    </div>
  </section>

  <!-- ───────── Artiklene ───────── -->
  <section class="section">
    <div class="wrap">
      <div class="card-grid card-grid--2">
${indent(alle.map((a, i) => kort(a, { lang, h: "h2", d: i % 2 })).join("\n"), 8)}
      </div>
    </div>
  </section>
`;
  return side({
    lang, annetSprak: en ? "/innsikt" : "/en/insights", main, gjeldende: true,
    tittel: T.tittel, beskrivelse: T.beskrivelse, url, ogType: "website",
    alternates: [["nb", `${SITE}/innsikt`], ["en", `${SITE}/en/insights`], ["x-default", `${SITE}/innsikt`]],
    ld: [
      brodsmuler(en ? [["Nrth AI", `${SITE}/en`], ["Insights", url]] : [["Nrth AI", `${SITE}/`], ["Innsikt", url]]),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": url,
        name: T.tittel.replace(" · Nrth AI", ""),
        description: T.beskrivelse,
        url,
        inLanguage: lang,
        publisher: { "@id": `${SITE}/#organization` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: alle.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: a.url, name: en ? a.en_tittel : a.tittel })),
        },
      },
    ],
  });
}

// ───── Forsidene ─────
function forsidedel(lang, alle) {
  const en = lang === "en";
  const tre = alle.slice(0, 3);
  return `  <!-- ───────── 04 · ${en ? "Insights" : "Innsikt"} ───────── -->
  <section class="section" id="${en ? "insights" : "innsikt"}">
    <div class="wrap">
      <div class="section-header" data-reveal>
        <p class="kicker">04 · ${en ? "Insights" : "Innsikt"}</p>
        <h2>${en ? "Articles on AI in <em>business</em>." : "Artikler om AI i <em>bedriften</em>."}</h2>
      </div>
      <div class="card-grid">
${indent(tre.map((a, i) => kort(a, { lang, h: "h3", d: i })).join("\n"), 8)}
      </div>
      <div class="section-actions" data-reveal>
        <a class="btn-ghost" href="${en ? "/en/insights" : "/innsikt"}">${en ? "All articles" : "Alle artikler"} →</a>${en ? "\n        <p>The articles are in Norwegian.</p>" : ""}
      </div>
    </div>
  </section>`;
}

const mellom = (s, innhold, fil) => {
  const re = /(<!-- innsikt:start[^>]*-->\n)[\s\S]*?(^[ \t]*<!-- innsikt:slutt -->)/m;
  if (!re.test(s)) { feil(`${fil}: mangler <!-- innsikt:start --> og <!-- innsikt:slutt -->`); return s; }
  return s.replace(re, (_, a, b) => `${a}${innhold}\n${b}`);
};

// ───── Feed, sitemap og llms.txt ─────
function feed(alle) {
  const sist = alle.map((a) => a.oppdatert).sort().pop();
  const entries = alle.map((a) => {
    const ctx = { lenker: [], ankre: [], absolutt: true, url: a.url };
    const html = `<p>${inline(a.ingress, ctx)}</p>\n${brodtekst(a, ctx)}`;
    const f = FORFATTERE[a.forfatter];
    return `  <entry>
    <title>${esc(a.h1)}</title>
    <link rel="alternate" type="text/html" href="${a.url}" />
    <id>${a.url}</id>
    <published>${a.publisert}T00:00:00Z</published>
    <updated>${a.oppdatert}T00:00:00Z</updated>
    <author><name>${f.navn}</name><uri>${SITE}/om-oss#${a.forfatter}</uri></author>
    <category term="${esc(a.tema)}" />
    <summary>${esc(a.beskrivelse)}</summary>
    <content type="html">${esc(html.replace(/&nbsp;/g, " "))}</content>
  </entry>`;
  });
  return `<?xml version="1.0" encoding="utf-8"?>
<!-- Laget av scripts/innsikt.mjs fra docs/innsikt/. -->
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="nb">
  <title>Innsikt · Nrth AI</title>
  <subtitle>${esc(NB_HUB.beskrivelse)}</subtitle>
  <link rel="self" type="application/atom+xml" href="${SITE}/innsikt/feed.xml" />
  <link rel="alternate" type="text/html" href="${SITE}/innsikt" />
  <id>${SITE}/innsikt</id>
  <updated>${sist}T00:00:00Z</updated>
  <author><name>Nrth AI</name><uri>${SITE}/</uri></author>
${entries.join("\n")}
</feed>
`;
}

function sitemap(alle) {
  const sist = alle.map((a) => a.oppdatert).sort().pop();
  const url = (loc, lastmod, alts) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
${alts.map(([hl, href]) => `    <xhtml:link rel="alternate" hreflang="${hl}" href="${href}" />`).join("\n")}
  </url>`;
  const hubAlts = [["nb", `${SITE}/innsikt`], ["en", `${SITE}/en/insights`], ["x-default", `${SITE}/innsikt`]];
  return [
    url(`${SITE}/innsikt`, sist, hubAlts),
    url(`${SITE}/en/insights`, sist, hubAlts),
    ...alle.map((a) => url(a.url, a.oppdatert, [["nb", a.url], ["x-default", a.url]])),
  ].join("\n");
}

function llms(s, alle) {
  const del = `## Innsikt

Artikler fra Nrth AI om AI i norske bedrifter, på norsk. Oversikt: ${SITE}/innsikt · Atom-feed: ${SITE}/innsikt/feed.xml

${alle.map((a) => `- **${a.tittel}** (${FORFATTERE[a.forfatter].navn}, ${datoNb(a.oppdatert)}): ${a.beskrivelse} ${a.url}`).join("\n")}

`;
  s = s.replace(/\r\n/g, "\n");
  const antall = (s.match(/^## Innsikt[ \t]*$/gm) || []).length;
  if (antall > 1) { feil("llms.txt: «## Innsikt» står mer enn én gang"); return s; }
  // Avsnittet går til neste «## » eller til slutten av filen
  if (antall === 1) return s.replace(/^## Innsikt[ \t]*\n[\s\S]*?(?=^## |(?![\s\S]))/m, del);
  if (!s.includes("## English")) { feil("llms.txt: fant ikke «## English»"); return s; }
  return s.replace("## English", `${del}## English`);
}

// ───── Kjør ─────
const filer = readdirSync(join(ROOT, "docs/innsikt")).filter((f) => f.endsWith(".md") && !f.startsWith("_")).sort();
const alle = filer.map(parse);
const slugs = new Set(alle.map((a) => a.slug));
if (slugs.size !== alle.length) feil("to artikler har samme slug");
for (const a of alle) validate(a, slugs);
if (new Set(alle.map((a) => a.nummer)).size !== alle.length) feil("to artikler har samme nummer");
// Artikkelmapper uten kilde blir liggende på nettet (indeksert, med egen canonical) til noen sletter dem.
for (const d of existsSync(join(ROOT, "innsikt")) ? readdirSync(join(ROOT, "innsikt"), { withFileTypes: true }) : []) {
  if (d.isDirectory() && !slugs.has(d.name)) feil(`innsikt/${d.name}/ har ingen kilde i docs/innsikt/. Slett mappen, og legg inn en 301 i vercel.json hvis siden har vært publisert`);
}
const stopp = () => {
  if (!errors.length) return;
  console.error(`innsikt: ${errors.length} feil`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
};
stopp();
// Nyeste først, deretter nummer
alle.sort((a, b) => b.publisert.localeCompare(a.publisert) || a.nummer - b.nummer);

const ut = new Map();
for (const a of alle) ut.set(`innsikt/${a.slug}/index.html`, artikkelside(a, alle));
ut.set("innsikt/index.html", oversikt("nb", alle));
ut.set("en/insights/index.html", oversikt("en", alle));
ut.set("innsikt/feed.xml", feed(alle));
ut.set("index.html", mellom(read("index.html"), forsidedel("nb", alle), "index.html"));
ut.set("en/index.html", mellom(read("en/index.html"), forsidedel("en", alle), "en/index.html"));
// Forsidene viser de tre nyeste artiklene, så lastmod for / og /en følger med.
const sistePublisert = alle.map((a) => a.publisert).sort().pop();
const forsideDato = (xml) => xml.replace(/(<loc>https:\/\/nrth\.no\/(?:en)?<\/loc>\n\s*<lastmod>)([\d-]+)(<\/lastmod>)/g, (m, a, d, b) => (d < sistePublisert ? `${a}${sistePublisert}${b}` : m));
ut.set("sitemap.xml", forsideDato(mellom(read("sitemap.xml"), sitemap(alle), "sitemap.xml")));
ut.set("llms.txt", llms(read("llms.txt"), alle));

// Interne lenker i artiklene: siden og ankeret må finnes
const filFor = (path) => (path === "/" ? "index.html" : `${path.replace(/^\//, "")}/index.html`);
for (const a of alle) {
  for (const l of a.lenker) {
    const [path, anker] = l.split("#");
    const fil = filFor(path);
    const html = ut.get(fil) ?? (existsSync(join(ROOT, fil)) ? read(fil) : null);
    if (html === null) { feil(`${a.fil}: lenken ${l} går til en side som ikke finnes`); continue; }
    if (anker && !html.includes(`id="${anker}"`)) feil(`${a.fil}: ${fil} har ikke id="${anker}" (lenken ${l})`);
  }
}

stopp();

let endret = 0;
for (const [fil, innhold] of ut) {
  const full = join(ROOT, fil);
  const gammel = existsSync(full) ? readFileSync(full, "utf8") : null;
  if (gammel === innhold) continue;
  endret++;
  if (SJEKK) { console.error(`  - ${fil} er utdatert`); continue; }
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, innhold);
  console.log(`  skrev ${fil}`);
}
if (SJEKK && endret) {
  console.error(`innsikt: ${endret} filer er utdatert. Kjør node scripts/innsikt.mjs`);
  process.exit(1);
}
console.log(`innsikt: ${alle.length} artikler, ${SJEKK ? "alt er oppdatert" : `${endret} filer skrevet`}`);
