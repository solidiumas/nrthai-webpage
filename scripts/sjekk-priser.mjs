// Sjekker at prisene i data/tjenester.json står likt på nettsiden (docs/revisjon-2026-10/07-seo-og-agentlag.md §4).
// HTML-sidene skrives for hånd, så prisene må holdes like. Kjør før hver PR:  node scripts/sjekk-priser.mjs
//  - prisTekst (norsk og engelsk) står på tjenestesiden den hører til
//  - JSON-LD på samme side har samme fra-pris (minPrice), og tjenester uten pris har ingen pris i JSON-LD
//  - fra-prisen står i llms.txt
//  - innsiktsartiklene (docs/innsikt/*.md): en tabellrad som starter med et tjenestenavn har prisTekst og leveranse
//    derfra, og «fra N kr» og «NOK N» i teksten er en pris som står i data/tjenester.json
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(join(ROOT, f), "utf8");
const data = JSON.parse(read("data/tjenester.json"));

// Hardt mellomrom (&nbsp;) og tagger i HTML-en blir vanlige mellomrom før sammenligningen
const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, "").replace(/&nbsp;| /g, " ").replace(/\s+/g, " ");
const fileFor = (url) => {
  const path = new URL(url).pathname.replace(/^\/|\/$/g, "");
  return path ? `${path}/index.html` : "index.html";
};
const nbNumber = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const jsonld = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
  const j = JSON.parse(m[1]);
  return Array.isArray(j) ? j : [j];
});

const errors = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) errors.push(msg); };

ok(data.valuta === "NOK" && data.eksMva === true, "valuta skal være NOK og eksMva true");
ok(Array.isArray(data.tjenester) && data.tjenester.length === 11, `ventet elleve tjenester, fant ${data.tjenester && data.tjenester.length}`);
const llms = read("llms.txt").replace(/ /g, " ");

for (const t of data.tjenester) {
  ok(t.fraPris === null || Number.isInteger(t.fraPris), `${t.id}: fraPris skal være et heltall eller null`);
  ok((t.fraPris === null) === (t.prisTekst === null), `${t.id}: fraPris og prisTekst skal begge være satt, eller begge null`);
  for (const lang of ["nb", "en"]) {
    const file = fileFor(t.url[lang]);
    if (!existsSync(join(ROOT, file))) { ok(false, `${t.id}: fant ikke ${file}`); continue; }
    const html = read(file);
    const anchor = new URL(t.url[lang]).hash.slice(1);
    if (anchor) ok(html.includes(`id="${anchor}"`), `${t.id}: ${file} mangler id="${anchor}"`);
    if (t.prisTekst) ok(text(html).includes(t.prisTekst[lang]), `${t.id}: «${t.prisTekst[lang]}» står ikke i ${file}`);
    // JSON-LD: tjenesten på siden har samme fra-pris, eller ingen pris
    const service = jsonld(html).find((j) => j["@type"] === "Service" && j.url === t.url[lang]);
    ok(service, `${t.id}: ${file} mangler Service i JSON-LD for ${t.url[lang]}`);
    if (service) {
      const specs = service.offers ? [].concat(service.offers.priceSpecification) : [];
      if (t.fraPris === null) ok(!service.offers, `${t.id}: ${file} har pris i JSON-LD, men fraPris er null`);
      else ok(specs.some((s) => s.minPrice === t.fraPris && s.priceCurrency === "NOK"), `${t.id}: JSON-LD i ${file} har ikke minPrice ${t.fraPris} NOK`);
      if (t.driftFraPrisPerMaaned) ok(specs.some((s) => s.minPrice === t.driftFraPrisPerMaaned), `${t.id}: JSON-LD i ${file} mangler driftsprisen ${t.driftFraPrisPerMaaned}`);
    }
  }
  if (t.fraPris !== null) ok(llms.includes(nbNumber(t.fraPris)), `${t.id}: ${nbNumber(t.fraPris)} står ikke i llms.txt`);
}

// Innsiktsartiklene. Sidene lages fra kildene av scripts/innsikt.mjs, så det holder å sjekke kildene.
if (existsSync(join(ROOT, "docs/innsikt"))) {
  const tall = (s) => (s.match(/\d{1,3}(?: \d{3})+|\d+/g) || []).map((n) => Number(n.replace(/ /g, "")));
  const kjente = new Set(data.tjenester.flatMap((t) => [t.fraPris, t.driftFraPrisPerMaaned, ...(t.prisTekst ? tall(t.prisTekst.nb) : [])]).filter(Boolean));
  for (const f of readdirSync(join(ROOT, "docs/innsikt")).filter((f) => f.endsWith(".md") && !f.startsWith("_"))) {
    const md = read(`docs/innsikt/${f}`);
    for (const row of md.split("\n").filter((l) => l.trim().startsWith("|"))) {
      // Første celle uten markdown, så «[AI-kartlegging](/ai-vurdering)» og «**AI-kartlegging**» også sjekkes
      const first = row.trim().replace(/^\|/, "").split("|")[0].trim().replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*/g, "");
      const t = data.tjenester.find((t) => t.navn.nb === first);
      if (!t) continue;
      if (t.prisTekst) ok(row.includes(t.prisTekst.nb), `docs/innsikt/${f}: raden for ${t.navn.nb} har ikke «${t.prisTekst.nb}»`);
      ok(row.includes(t.leveranse.nb), `docs/innsikt/${f}: raden for ${t.navn.nb} har ikke leveransen «${t.leveranse.nb}»`);
    }
    for (const m of md.matchAll(/\bfra (?:ca\. )?(\d{1,3}(?: \d{3})+) (?:kr|kroner)(?![\wæøå])/gi)) {
      ok(kjente.has(Number(m[1].replace(/ /g, ""))), `docs/innsikt/${f}: «${m[0]}» er ingen pris i data/tjenester.json`);
    }
    // Engelske priser i en_beskrivelse (vises på /en og /en/insights)
    for (const m of md.matchAll(/\bNOK (\d{1,3}(?:,\d{3})+)/g)) {
      ok(kjente.has(Number(m[1].replace(/,/g, ""))), `docs/innsikt/${f}: «${m[0]}» er ingen pris i data/tjenester.json`);
    }
  }
}

if (errors.length) {
  console.error(`sjekk-priser: ${errors.length} feil av ${checks} kontroller`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`sjekk-priser: ${checks} kontroller, ingen feil`);
