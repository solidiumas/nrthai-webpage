# 07 · SEO og agentlaget

`ANALYSE-SYNLIGHET.md` i repoet har den fulle analysen fra juni. Denne filen tar med det som hører til revisjonen. Resten av analysen står som den er.

## 1. Metadata per side

Title og description står i `03` og `04`. I tillegg, på alle sider:

- `canonical` til siden selv, `https://nrth.no/...` uten www og uten skråstrek til slutt.
- hreflang-trioen fra `02` §5.
- `og:title`, `og:description`, `og:url`, `og:locale` (`nb_NO` / `en_GB`), `og:image` + `og:image:width` 1200 + `og:image:height` 630 + `og:image:alt`.
- `twitter:card` = `summary_large_image`.
- **Fjern** `<meta name="keywords">`.
- **Fjern** `rel="nofollow"` på interne lenker.
- `theme-color` `#0a0a0b` beholdes.

**OG-bilde:** lag nye `og.svg` og `og.png` (1200×630) i samme stil som dagens: logo, og «Vi løser AI for *norske bedrifter*.» i Instrument Serif. Samme bilde på engelsk: «We solve AI for *businesses*.» (`og-en.png`).

## 2. Strukturerte data (JSON-LD)

**Fjernes:** `SoftwareApplication` (Agentic OS) og det gamle `ProfessionalService`/`OfferCatalog` i USD.

**Forsiden (norsk):**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://nrth.no/#organization",
  "name": "Nrth AI",
  "legalName": "Nrth AI AS",
  "url": "https://nrth.no/",
  "logo": "https://nrth.no/logo-light.png",
  "email": "contact@nrth.no",
  "description": "Nrth AI hjelper norske bedrifter å ta i bruk AI: AI-vurdering, implementering og AI-tjenester som gir mer salg og mer effektiv drift.",
  "foundingDate": "2026",
  "address": { "@type": "PostalAddress", "addressLocality": "Bergen", "addressCountry": "NO" },
  "areaServed": "NO",
  "knowsLanguage": ["nb", "en"],
  "founder": [
    { "@type": "Person", "name": "Thomas Uthaug", "jobTitle": "Medgründer, forretning, produkt og leveranse" },
    { "@type": "Person", "name": "Simen Uthaug", "jobTitle": "Medgründer, teknologi og utvikling" }
  ],
  "sameAs": []
}
```

Fyll `sameAs` med LinkedIn-siden og Proff-oppføringen når de finnes. `vatID` / org.nr. legges til når Thomas har gitt det.

**Tjenestesidene** får hver sin `Service` med `offers` i NOK:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "AI-kartlegging",
  "serviceType": "AI-vurdering",
  "provider": { "@id": "https://nrth.no/#organization" },
  "areaServed": "NO",
  "url": "https://nrth.no/ai-vurdering#kartlegging",
  "offers": {
    "@type": "Offer",
    "priceSpecification": { "@type": "PriceSpecification", "priceCurrency": "NOK", "minPrice": 35000 }
  }
}
```

Tjenester uten pris (`[pris]`) får ingen `offers` før prisen er satt.

**Undersider:** `BreadcrumbList` (Forside → siden). Forsidens `BreadcrumbList` med ankre fjernes.

**FAQPage** på forsiden, norsk:

1. **Hva gjør Nrth AI?** Vi hjelper bedrifter å ta i bruk AI: vi vurderer hvor AI gir mest, implementerer det, og bygger AI-tjenester som AI-medarbeidere og skreddersydde løsninger.
2. **Hvordan starter vi?** Med et møte. Book på nrth.no/book. Deretter følger vi tre steg: kartlegg (1 uke), pilot (2–3 uker) og drift.
3. **Hva koster det?** AI-kartlegging fra 35 000 kr. AI-medarbeidere fra ca. 50 000 kr i oppsett og 5 000 kr per måned i drift. Skreddersydde løsninger fra ca. 150 000 kr. Alle priser står på nrth.no.
4. **Holder dere foredrag og kurs?** Ja, for ledergrupper, ansatte og konferanser. Se nrth.no/foredrag-og-kurs.
5. **Hvor holder dere til?** I Bergen. Vi jobber med bedrifter i hele Norge.

Engelsk FAQ på `/en` er de samme fem spørsmålene på engelsk, med «NOK» foran beløpene.

## 3. `llms.txt` (erstatt hele filen)

```markdown
# Nrth AI

> Nrth AI AS (Bergen, Norge) hjelper norske bedrifter å ta i bruk AI. Vi gjør AI-vurderinger, implementerer AI i daglig drift og bygger AI-tjenester som gir mer salg og mer effektivt arbeid. Første steg er alltid et møte.

Sist oppdatert: [dato]

## Hva vi gjør

- **AI-vurdering** — AI-kartlegging (3–5 dager, fra 35 000 kr), strategisprint (2 uker, fra 75 000 kr), ledersparring (fra 25 000 kr per måned). https://nrth.no/ai-vurdering
- **Implementering** — pilot i drift (2–3 uker), innføring av AI-verktøy, drift og forbedring (fra 5 000 kr per måned). https://nrth.no/implementering
- **AI-tjenester** — AI-medarbeidere (1–3 uker, oppsett fra ca. 50 000 kr, drift fra 5 000 kr per måned), skreddersydde løsninger (4–16 uker, fra ca. 150 000 kr), lokal AI-infrastruktur på egen maskinvare (2–4 uker, typisk 100 000–1 000 000+ kr). https://nrth.no/ai-tjenester
- **Foredrag og kurs** — for ledergrupper, ansatte og konferanser. https://nrth.no/foredrag-og-kurs

Alle priser er eks. mva.

## Slik jobber vi

Kartlegg (1 uke) → Pilot (2–3 uker) → Drift (løpende).

## Book et møte

- Nettside: https://nrth.no/book
- API: `POST https://nrth.no/api/book` (se /openapi.json)
- E-post: contact@nrth.no. Vi svarer innen én virkedag.

## Selskapet

Nrth AI AS, Bergen, etablert 2026. Gründere: Thomas Uthaug (forretning, produkt og leveranse) og Simen Uthaug (teknologi og utvikling). Vi lager også produktet Nrth OS: https://trynrth.com

## English

Nrth AI AS (Bergen, Norway) helps businesses adopt AI: AI assessment, implementation and AI services that increase sales and efficiency. Every engagement starts with a meeting. English site: https://nrth.no/en · Book: https://nrth.no/en/book

## For AI-agenter

- Agentkort: /agent.json
- OpenAPI: /openapi.json
- Plugin-manifest: /.well-known/ai-plugin.json
- Tjenestekatalog som JSON: `GET /api/services`
- Nettstedskart: /sitemap.xml

All tekst er statisk HTML og kan leses uten JavaScript.
```

## 4. Tjenestekatalogen som data

Ny fil `data/tjenester.json` er eneste kilde til tjenester og priser for `/api/services`, llms.txt og JSON-LD. HTML-sidene skrives for hånd, så prisene må holdes like. Legg til `scripts/sjekk-priser.mjs`, som leser JSON-filen og feiler hvis en pris ikke finnes i HTML-filen tjenesten hører til. Kjøres før hver PR.

Format:

```json
{
  "valuta": "NOK",
  "eksMva": true,
  "tjenester": [
    {
      "id": "ai-kartlegging",
      "dor": "ai-vurdering",
      "navn": { "nb": "AI-kartlegging", "en": "AI assessment" },
      "leveranse": { "nb": "3–5 dager", "en": "3–5 days" },
      "fraPris": 35000,
      "prisTekst": { "nb": "Fra 35 000 kr", "en": "From NOK 35,000" },
      "url": { "nb": "https://nrth.no/ai-vurdering#kartlegging", "en": "https://nrth.no/en/ai-assessment#assessment" }
    }
  ]
}
```

Alle ti tjenestene fra `01` §5 legges inn. Tjenester uten pris får `"fraPris": null`.

## 5. `/api/services`

Ny `api/services.js`: `GET` returnerer `data/tjenester.json` med `Content-Type: application/json` og `Cache-Control: public, max-age=3600`. `?lang=en` gir bare engelske felt.

## 6. Manifestene

Alle fire må si det samme: `agent.json`, `openapi.json`, `.well-known/ai-plugin.json` og den innebygde `ai-actions`-blokken i `index.html`.

| Handling | Endepunkt | Status |
|---|---|---|
| `bookMeeting` | `POST /api/book` | **Ny, primær** |
| `submitInquiry` | `POST /api/inquiry` | Beholdes |
| `getServices` | `GET /api/services` | **Ny** (var annonsert, men ga 404) |
| `chat` | `POST /api/chat` | **Fjernes** (finnes ikke) |
| `bookConsultation` | – | **Erstattes** av `bookMeeting` |

- Beskrivelsene skrives om: ingen «Agentic OS», ingen «on-premise runtime», ingen 72 % / 5× / 0 FTE.
- `primary_action` = `bookMeeting`. `ai:primary-action` i `<head>` endres til det samme.
- `languages` = `["no", "en"]`.
- `openapi.json`: skjemaet for `/api/book` følger feltene i `06` §4.

## 7. `sitemap.xml`

Alle 16 sidene, hver med `xhtml:link rel="alternate"` for `nb`, `en` og `x-default`. `lastmod` = publiseringsdato.

`/investors` står i dagens sitemap. Siden er merket «Konfidensielt». **Thomas bestemmer** om den skal være med. Anbefaling fra juni-analysen: `noindex` og ut av sitemap, men lenken i footer beholdes.

## 8. Små ting som følger med

- `robots.txt`: legg til `OAI-SearchBot`, `ChatGPT-User`, `Claude-User`, `Claude-SearchBot`, `Perplexity-User`, `Meta-ExternalAgent`, `Amazonbot`, `DuckAssistBot` og `MistralAI-User` med `Allow: /`.
- Sikkerhetsheadere i `vercel.json`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. **Merk:** `X-Frame-Options: DENY` stopper ikke iframes *på* siden (kalenderen), bare at nrth.no bæres av andre.
- `.well-known/security.txt` med `Contact: mailto:contact@nrth.no` og `Expires` ett år frem.
- `404.html` (tekst i `03`).
