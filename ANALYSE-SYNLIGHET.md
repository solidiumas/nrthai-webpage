# nrth.no — Analyse: Agentisk synlighet, SEO og AI-oppdagbarhet

**Dato:** 11. juni 2026 · **Analysert:** kodebase (branch `nrthWeb_v2`) + live-siden (www.nrth.no)

---

## Sammendrag

Nettsiden har en **uvanlig god agentisk grunnmur** for å være en 4-siders statisk side: `llms.txt`, `agent.json`, `openapi.json`, `.well-known/ai-plugin.json`, JSON-LD på forsiden, AI-vennlig robots.txt, og alt innhold er lesbart uten JavaScript. Det meste av det andre bygger ikke engang dette laget.

**Men to kritiske feil undergraver hele laget i dag:**

1. **Domene-splitt:** `nrth.no` redirecter (307, *midlertidig*) til `www.nrth.no` — mens *alle* canonical-URL-er, sitemap, JSON-LD, OG-tagger og agent-manifester peker på `https://nrth.no` uten www. Hvert eneste SEO-signal peker altså på en URL som ikke serverer innhold.
2. **Døde API-endepunkter:** `/api/services`, `/api/book` og `/api/chat` er annonsert i fire ulike agent-manifester, men gir **404**. Kun `/api/inquiry` finnes. En AI-agent som prøver å handle på manifestet feiler — det er verre enn å ikke ha manifest.

Den største *langsiktige* begrensningen er innhold: 3 indekserbare sider, kun på engelsk, null eksterne entitetssignaler (`sameAs` er tom). Teknisk polering alene vil ikke gi rangering på konkurransedyktige termer eller omtale i AI-svar.

### Tilstandsvurdering per område

| Område | Score | Vurdering |
|---|---|---|
| Agentisk lag (manifester, llms.txt, API) | 7/10 | Beste-i-klassen oppsett, men manifestene lover endepunkter som 404-er |
| Teknisk SEO | 5/10 | God on-page meta, men domene/canonical/307-feilen rammer alle URL-er |
| Innhold & entitets-SEO | 4/10 | 3 sider, kun engelsk, tom `sameAs`, ingen ekstern tilstedeværelse |
| Ytelse | 7/10 | Lett statisk side; render-blokkerende fonter fra to tredjeparter |
| Tilgjengelighet | 7/10 | God semantikk og ARIA; mangler skip-link og `prefers-reduced-motion` |
| Distribusjon / off-page | 2/10 | Ingenting ennå (forventet pre-seed, men det er flaskehalsen) |

---

## P0 — Kritisk (fiks i dag)

### 1. Domene-primær: apex vs www
**Funn (verifisert live):** `https://nrth.no/` → `307` → `https://www.nrth.no/`. Samtidig sier alt i kodebasen `https://nrth.no`:
- `<link rel="canonical">` på alle sider
- alle URL-er i `sitemap.xml` (Google Search Console vil rapportere «URL redirects» på hele sitemapen)
- alle `@id`/`url` i JSON-LD
- `og:url`, `agent.json`, `openapi.json` (`servers`), `ai-plugin.json`, `llms.txt`

**Konsekvens:** Splittet link equity, svekket kanonisering, og 307 er *midlertidig* — Google konsoliderer ikke signalene. Agenter som følger manifestene treffer redirect-hopp på alt.

**Fiks (Vercel-dashboard, ikke kode):** Project → Settings → Domains → sett `nrth.no` som primærdomene, og `www.nrth.no` til «Redirect to nrth.no» (308 Permanent). Da stemmer plutselig hele kodebasen. *Alternativet* (bytte alle referanser til www) er mer jobb og gir styggere URL-er.

### 2. Annonserte API-endepunkter som ikke finnes
**Funn (verifisert live):** `GET /api/services`, `POST /api/book`, `POST /api/chat` → 404. Kun `api/inquiry.js` eksisterer i repoet. Endepunktene er lovet i `agent.json`, `openapi.json`, `ai-plugin.json` og inline `ai-actions`-blokken i `index.html`.

**Fiks (velg per endepunkt):**
- `GET /api/services` — **implementer** (trivielt: en serverless-funksjon som returnerer statisk JSON fra tjenestekatalogen). Dette er det mest verdifulle endepunktet for agenter.
- `POST /api/book` og `POST /api/chat` — **fjern fra alle fire manifester** til de faktisk finnes. Et manifest som lyver ødelegger agent-tillit; agenter (og folkene bak dem) husker 404-er.

### 3. Verifiser konverteringsflyten
`api/inquiry.js` sender fra `brief@nrth.no` via Resend. Hvis `nrth.no` ikke er verifisert som avsenderdomene i Resend-dashboardet, feiler hovedkonverteringen stille for brukeren (skjemaet viser feilmelding, men ingen får beskjed). **Send en testbrief og bekreft at e-posten kommer frem.** Vurder også et Resend-webhook/logg-varsel ved feil.

---

## P1 — Viktig (denne uka)

### Teknisk SEO
4. **Meta description forsiden er 196 tegn** — Google kutter ved ~155. Kort ned, behold «Agentic OS», «on-premise», «enterprise AI agents» tidlig.
5. **Svake titler på undersider.** `Nrth AI — Services` sier ingenting til søkemotorer. Forslag:
   - `/services`: «AI Employees, On-Premise AI Infrastructure & Custom AI Development — Nrth AI»
   - `/contact`: «Contact Nrth AI — AI agents & on-premise AI, Bergen, Norway»
6. **`/investors` mangler alt av meta:** ingen canonical, ingen robots-direktiv, ingen OG — men ligger i sitemap. **Beslutning trengs:** Skal en investorpresentasjon (SLIP, pre-seed fra nær krets) være indeksert på Google? Anbefaling: `noindex` + fjern fra sitemap (den er fortsatt lenket fra footer for de som skal se den). Hvis den skal være offentlig: legg på canonical + meta som de andre sidene.
7. **`rel="nofollow"` på intern CTA** (`index.html` hero, «Send us a brief →» til `#contact`) — nofollow på interne lenker er meningsløst og svakt negativt. Fjern.
8. **Sikkerhetsheadere mangler** (kun HSTS er satt, av Vercel). Legg til i `vercel.json`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. (CSP krever nonce-håndtering pga. inline-redirect-scriptet — ta som P2.)
9. **Egendefinert 404-side mangler** (Vercel-default vises nå). Lag en lett `404.html` med nav tilbake til forsiden — Vercel plukker den opp automatisk for statiske deploys.
10. **Favicon-sett:** kun SVG i dag. Legg til `apple-touch-icon.png` (180×180) og en 32×32 PNG-fallback — Slack, eldre crawlere og Google-favicon-renderere er ikke alltid SVG-vennlige.
11. **OG-finpuss:** legg til `og:image:width` (1200), `og:image:height` (630), `og:image:alt`. Bildet finnes og har riktige dimensjoner (1200×630, 61 KB — bra).
12. **Cache-strategi:** alt serveres med `max-age=3600`. HTML bør ha kortere (`max-age=0, must-revalidate` + CDN-cache), `/assets/*` lengre (≥1 uke; immutable først ved hashede filnavn).
13. **Fjern `meta name="keywords"`** — død praksis, signaliserer utdatert SEO til den som ser etter.
14. **Rydd døde filer:** `/product/`, `/work/`, `/company/` sine `index.html` er uoppnåelige (redirects i `vercel.json` vinner alltid over filsystemet på Vercel). Slett for å unngå drift.

### Strukturert data (JSON-LD)
15. **`sameAs` er tom i Organization-skjemaet.** Dette er hovedmekanismen for entitetskobling i Google Knowledge Graph *og* hvordan LLM-er kobler «Nrth AI» til noe verifiserbart. Opprett og lenk (i prioritert rekkefølge): LinkedIn-bedriftsside, Proff.no-oppføring, GitHub-org, Crunchbase.
16. **Organization-skjema utvides** med: `legalName: "Nrth AI AS"`, `email`, `vatID`/org.nr (fra Brønnøysund når det finnes), `logo` som `ImageObject` med PNG-variant ≥112×112 (Google foretrekker raster), `founder[].sameAs` → grunnleggernes LinkedIn-profiler (E-E-A-T).
17. **`/services` mangler JSON-LD fullstendig** — siden med *prisene* har bare microdata. Legg til `OfferCatalog` med `UnitPriceSpecification` per tjeneste (priser i strukturert data er sterkt for både rich results og AI-agenter som sammenligner leverandører) + `BreadcrumbList`.
18. **`/contact` mangler JSON-LD** — legg til `ContactPage` + `ContactPoint`.
19. **BreadcrumbList på forsiden bruker anker-URL-er** (`/#product` osv.) — kunstig og gir ingenting. Behold kun ekte sider (Home → Services → Contact) eller fjern.
20. FAQPage-skjemaet beholdes — gir ikke lenger rich results for vanlige nettsteder, men LLM-er leser det, og spørsmål/svar-formatet er ideelt GEO-råstoff.

### Agentisk lag
21. **Synk manifestene** (følger av P0-2): `agent.json` har også `product.url: https://nrth.no/product` som redirecter — pek direkte på `/#product`. Langsiktig: gjør `openapi.json` til eneste sannhetskilde og generer `agent.json`-actions + inline `ai-actions` fra den (liten build-script), så de aldri driver fra hverandre igjen.
22. **Utvid robots.txt med nyere AI-crawlere.** Default er allerede `Allow: /`, så dette er dokumentasjon av intensjon — men listen mangler dagens viktigste: `OAI-SearchBot`, `ChatGPT-User`, `Claude-User`, `Claude-SearchBot`, `Perplexity-User`, `Meta-ExternalAgent`, `Amazonbot`, `DuckAssistBot`, `MistralAI-User`.
23. **`.well-known/security.txt`** mangler — to minutters jobb, signaliserer modenhet overfor både mennesker og agenter.

### Måling (uten dette er alt annet blindt)
24. **Google Search Console** — registrer som *domeneeiendom* (dekker både apex og www), send inn sitemap.
25. **Bing Webmaster Tools** — undervurdert: Bing-indeksen mater ChatGPT-søk og Copilot. Send inn sitemap der også. Aktiver gjerne **IndexNow** (enkelt på Vercel) for umiddelbar indeksering ved endringer.
26. **Analytics:** Vercel Analytics eller Plausible (GDPR-vennlig, ingen samtykkebanner nødvendig — passer «data never leaves»-budskapet bedre enn Google Analytics).

---

## P2 — Strategisk (denne måneden)

### 27. Norsk språkversjon — største enkeltgrep for hjemmemarkedet
Hele siden er engelsk (`lang="en"`, `og:locale en_US`) — men selskapet sitter i Bergen og selger til Norden, og FAQ-en nevner regulerte norske bransjer (maritim, energi). Norske beslutningstakere søker «AI-agenter for bedrifter», «KI i bedrift», «on-premise AI Norge» — ingenting av dette matcher engelsk innhold. **Anbefaling:** norsk versjon under `/no/` med `hreflang`-par (`en` ↔ `no` + `x-default`), oppdatert sitemap, og norsk `llms.txt`-seksjon. (Investorsiden er allerede på norsk — resten av siten bør kunne møte samme marked.)

### 28. Innholdsplan — fra brosjyre til kilde
3 indekserbare sider rangerer ikke på konkurransedyktige termer, og LLM-er siterer sider som *definerer og forklarer*. Forslag til de første 6–8 sidene (hver ~800–1500 ord, med FAQ-skjema):
- «What is an Agentic OS?» — definisjonssiden; eier begrepet dere selv bruker som posisjonering
- «On-premise vs. cloud LLM deployment» — sammenligning; høy kjøpsintensjon
- «What does an AI employee cost?» — regnestykket 1–1,5 MNOK vs. 15–35 % finnes allerede på siden; utvid til egen side (utmerket GEO-agn: konkrete tall blir sitert)
- Én case-side per agent-type med metodikk bak tallene (72 % auto-resolved, 5× SDR, 0 FTE) — tall uten kontekst svekker troverdighet, tall med metodikk blir sitert
- Bransjesider: maritim / energi / finans (de regulerte bransjene dere allerede peker på)

### 29. Ekstern entitetsbygging (det LLM-er faktisk lærer av)
AI-modeller omtaler selskaper de finner i *flere uavhengige kilder*. Sjekkliste:
- LinkedIn-bedriftsside (viktigst, raskest)
- Google Business Profile (Bergen) — gir lokal entitet + kart
- Proff.no / 1881 (auto-genereres delvis fra Brønnøysund — gjør krav på oppføringen)
- GitHub-org med noe reelt offentlig (selv et lite verktøy eller spec — GitHub indekseres tungt av LLM-trening)
- Crunchbase-profil
- Norsk tech-presse når det finnes noe å fortelle: Shifter, kode24, Digi.no — én omtale i Shifter er verdt mer for AI-synlighet enn ti tekniske finjusteringer

### 30. Ytelse
- **Self-host fontene** (woff2 i `/assets/fonts/`): i dag lastes render-blokkerende CSS fra både Google Fonts og Fontshare — to ekstra DNS/TLS-oppsett i kritisk sti. Self-hosting fjerner begge og er også et personvernpoeng (Google Fonts-IP-saken i EU).
- **`prefers-reduced-motion`:** canvas-animasjonen og marquee-en respekterer den ikke. Canvas pauser ved skjult fane (bra), men bør også pause utenfor viewport (IntersectionObserver) og stå stille ved redusert bevegelse.
- **Skip-link** («Skip to content» → `#main`) mangler — én linje HTML + litt CSS.

### 31. `llms-full.txt` + vedlikehold
`llms.txt` er god. Legg til: «Last updated»-dato, og en `llms-full.txt` med fullt sideinnhold i markdown (konvensjonen støttes av stadig flere agenter). Viktigst: **hold prisene synket** — de står nå i fire filer (services-siden, llms.txt, agent.json-beskrivelser, JSON-LD på forsiden). Vurder å generere alt fra én datafil.

---

## P3 — Differensiator (kvartalet)

32. **Egen MCP-server** (`nrth.no/mcp` med verktøyene `get_services`, `submit_inquiry`): MCP er i ferd med å bli standarden for agent-tilkobling. For et selskap som *selger* en Agentic OS er en fungerende MCP-server ikke bare synlighet — det er produktbevis og en demo i seg selv. («Koble Claude til nrth.no/mcp og send oss en brief» er en bedre pitch enn noen landingsside.)
33. **Wikidata-oppføring** når det finnes presseomtale å referere til (krav om uavhengige kilder).
34. Per-side OG-bilder (services/contact) for bedre delinger.
35. CSP-header med nonce/hash når inline-scriptene er ryddet.

---

## Hva som allerede er bra (ikke rør)

- `llms.txt` — velskrevet, riktig format, lenket via `rel="alternate" type="text/markdown"`
- Alt innhold er statisk HTML, lesbart uten JS — påstanden i llms.txt stemmer faktisk
- JSON-LD-bredden på forsiden (Organization, WebSite, SoftwareApplication, ProfessionalService med priser, FAQPage)
- Semantisk HTML, ARIA-landemerker, `aria-current`, mobilmeny med korrekt `aria-expanded`
- `cleanUrls`, 308-redirects for gamle ruter, `noindex` på redirect-stubbene — konsistent kanonisering (når domenefeilen er fikset)
- OG-bilde i riktig størrelse (1200×630), titler med merkevare + posisjonering
- Robots.txt som eksplisitt ønsker AI-crawlere velkommen + sitemap-direktiv

---

## Anbefalt rekkefølge (oppsummert)

| # | Tiltak | Innsats | Effekt |
|---|---|---|---|
| 1 | Vercel: `nrth.no` som primærdomene (308 fra www) | 5 min (dashboard) | Kritisk |
| 2 | Implementer `GET /api/services`; fjern `book`/`chat` fra manifestene | 1–2 t | Kritisk (agent-tillit) |
| 3 | Test brief-flyten ende-til-ende (Resend-domeneverifisering) | 15 min | Kritisk (konvertering) |
| 4 | GSC + Bing Webmaster + sitemap + IndexNow | 1 t | Høy |
| 5 | Meta/titler/nofollow/keywords-opprydding + investors-beslutning | 1–2 t | Høy |
| 6 | JSON-LD: sameAs, legalName, priser på /services, ContactPage | 2–3 t | Høy |
| 7 | Sikkerhetsheadere, 404-side, security.txt, favicon-sett, robots-utvidelse | 2 t | Middels |
| 8 | LinkedIn + Google Business Profile + Proff | 2–3 t | Høy (entitet) |
| 9 | Norsk versjon med hreflang | dager | Høy (hjemmemarked) |
| 10 | Innholdsplan: 6–8 sider (definisjoner, case, bransjer) | uker | Høyest langsiktig |
| 11 | Self-host fonter, reduced-motion, skip-link | 2–3 t | Middels |
| 12 | MCP-server + llms-full.txt | dager | Differensiator |

**Månedlig rutine:** spør ChatGPT, Claude, Perplexity og Gemini om «AI agent companies in Norway» / «on-premise AI Norge» og logg om/hvordan Nrth AI omtales — det er den faktiske målingen på AI-synlighet.
