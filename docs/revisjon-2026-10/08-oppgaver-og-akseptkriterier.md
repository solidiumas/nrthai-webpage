# 08 · Oppgaver og akseptkriterier

Én branch og én PR per steg, mot `main`. Hver PR har en kort beskrivelse, en liste over hva som er endret og skjermbilder av desktop (1440 px) og mobil (390 px).

## 1. Før start (Thomas)

- [ ] `fix/investors-deadline-31-dec` er merget til `main`.
- [ ] Vercel: `nrth.no` er primærdomene, `www.nrth.no` videresender med 308. (Project → Settings → Domains.) Se P0-1 i `ANALYSE-SYNLIGHET.md`.
- [ ] Resend: `nrth.no` er verifisert avsenderdomene. Send en testforespørsel på dagens side og sjekk at den kommer frem.
- [ ] Prisene i `01` §5 er bekreftet.

## 2. PR-er

### PR 1 · Struktur (`revisjon/1-struktur`)
- Legg `CLAUDE.md` i roten av repoet.
- Opprett alle 16 sider fra `02` §1 med meny, footer, sidehero og tomme seksjoner (overskriftene fra `03`/`04`, men ingen brødtekst ennå).
- Ny `vercel.json`-seksjon for videresendinger. Slett `product/`, `work/`, `company/`, `contact/`.
- Oppdater hash-videresendingen i `index.html`.
- Språkbryter og hreflang på alle sider.
- `partials/` med referansekopier av meny, footer og bookingseksjon, og `.vercelignore` så de ikke publiseres.
- Nye CSS-komponenter fra `05` §3, uten innhold.

**Ferdig når:**
- [ ] Alle 16 URL-ene svarer 200 lokalt (`vercel dev`) og har riktig `lang`, `canonical` og hreflang.
- [ ] `/services`, `/work`, `/company`, `/contact`, `/product` gir 308 til riktig mål.
- [ ] `EN`/`NO` i menyen går til samme side på det andre språket.
- [ ] Ingen endringer i `investors/` eller `pitchdeck/`.

### PR 2 · Norsk innhold (`revisjon/2-norsk`)
- All norsk tekst fra `03`, ord for ord.
- Forsiden: fjern Agentic OS-seksjonen, «Work» med tallene, «Why now» og det gamle kontaktskjemaet.
- Behold canvas-visualen, marquee (ny tekst) og team.

**Ferdig når:**
- [ ] Teksten stemmer med `03` (sjekk overskrifter, priser, varigheter og knappetekster).
- [ ] `grep -ri "agentic os\|on-premise runtime\|72%\|5×\|FTE added" --include=*.html .` gir ingen treff utenfor `investors/` og `pitchdeck/`.
- [ ] Alle `[hakeparenteser]` er igjen synlige i HTML. De fylles inn av Thomas, ikke av Claude Code.
- [ ] Hver side har én `<h1>`.

### PR 3 · Booking (`revisjon/3-booking`)
- `assets/booking-config.js`, `assets/booking.js`, `api/book.js` som beskrevet i `06`.
- `/book` med kalender eller skjema, og forespørselsskjemaet flyttet til `/book#skriv`.
- Temaforhåndsvalg fra URL og `data-default-topic`.
- `api/inquiry.js` får `lang` og norske etiketter.

**Ferdig når:**
- [ ] Med tom `url`: skjemaet sender, e-posten kommer til contact@nrth.no med riktig emne, og kunden får kvittering på riktig språk.
- [ ] Med en test-`url` satt: iframen vises, og lenken «Åpne kalenderen i ny fane» virker.
- [ ] `/implementering?tema=implementering#book` har «Implementering» forhåndsvalgt. `/en/book?topic=talk` har «Talk or course» forhåndsvalgt.
- [ ] Skjemaet virker med JavaScript slått av.
- [ ] Honningfeltet stopper innsending uten feilmelding.
- [ ] Temavalget kan brukes med tastatur alene.

### PR 4 · Engelsk innhold (`revisjon/4-engelsk`)
- All engelsk tekst fra `04` på de åtte sidene under `/en/`.

**Ferdig når:**
- [ ] Hver engelsk side har samme seksjoner og rekkefølge som den norske.
- [ ] Priser står som «NOK 35,000».

### PR 5 · SEO og agentlaget (`revisjon/5-seo-agent`)
- Alt i `07`: metadata, OG-bilder, JSON-LD, `llms.txt`, `data/tjenester.json`, `api/services.js`, `scripts/sjekk-priser.mjs`, de fire manifestene, `sitemap.xml`, `robots.txt`, sikkerhetsheadere, `security.txt`, `404.html`.

**Ferdig når:**
- [ ] `GET /api/services` gir gyldig JSON med alle ti tjenestene.
- [ ] Ingen manifester nevner `/api/chat` eller endepunkter som ikke finnes.
- [ ] `node scripts/sjekk-priser.mjs` går uten feil.
- [ ] JSON-LD validerer i Googles Rich Results Test og i validator.schema.org.
- [ ] Alle titler er under 60 tegn og alle beskrivelser under 160.

### PR 6 · Kvalitetssjekk (`revisjon/6-qa`)
- Gå gjennom QA-listen under og fiks det som dukker opp.

## 3. QA før publisering

- [ ] Lighthouse på forsiden og én tjenesteside, mobil: Ytelse ≥ 90, Tilgjengelighet ≥ 95, Beste praksis ≥ 95, SEO = 100.
- [ ] Ingen døde interne lenker (`npx linkinator http://localhost:3000 --recurse`).
- [ ] Hver side sjekket på 390 px, 768 px og 1440 px uten horisontal scroll.
- [ ] Tastatur: alle lenker, knapper og skjemafelt kan nås og brukes, med synlig fokus.
- [ ] `prefers-reduced-motion`: marquee og canvas står stille.
- [ ] Testbooking og testforespørsel sendt fra produksjonsdomenet etter publisering.

## 4. Etter publisering (Thomas)

- [ ] Google Search Console: domeneeiendom for `nrth.no`, send inn sitemap.
- [ ] Bing Webmaster Tools: send inn sitemap.
- [ ] Fyll inn plassholderne under og publiser på nytt.
- [ ] Når trynrth.com er oppe: slå på Nrth OS-lenkene og endre `/product` til å peke dit.

## 5. Plassholdere Thomas må fylle inn

| Plassholder | Hvor |
|---|---|
| Pris for pilot i drift | Forsiden (dørkort 2), `/implementering`, `/en/implementation`, `data/tjenester.json` |
| Pris og varighet for innføring av AI-verktøy | `/implementering`, `/en/implementation` |
| Varighet og pris for foredrag, kurs og workshop | `/foredrag-og-kurs`, `/en/talks-and-courses` |
| Møtelengde «[30] minutter» | Bookingseksjonen, `booking-config.js` |
| Møteform «[Digitalt eller i Bergen]» | Bookingseksjonen, feltet `form` |
| Org.nr. | Footer, Om oss, personvern, JSON-LD |
| Kalenderverktøy og lenke | `booking-config.js`, personvern |
| Lagringstid «[12] måneder» og analyseverktøy | Personvern |
| Datoer | Personvern, llms.txt |
