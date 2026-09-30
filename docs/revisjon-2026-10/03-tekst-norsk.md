# 03 · Tekst, norsk

**Slik leses filen**

- `*ord*` i overskrifter blir `<em>` (oransje kursiv i Instrument Serif, som i dag).
- `[hakeparentes]` er noe Thomas må fylle inn. Ikke finn på noe.
- Komponentnavn i `kode` viser til `05-komponenter-og-design.md`.
- Teksten er ferdig. Ikke skriv den om, forkort eller legg til. Er noe uklart, spør.

---

## Felles deler

### Meny
- Lenker: AI-vurdering · Implementering · AI-tjenester · Om oss
- Språk: `EN`
- Knapp: **Book et møte →**
- Mobilmeny-knapp, aria-label: «Åpne meny»
- Logo, aria-label: «Nrth AI, til forsiden»

### Bookingseksjonen (`booking`, `id="book"`)
Brukes nederst på alle sider unntatt `/book` og `/personvern`. Tema forhåndsvelges etter siden (se `06`).

- Kicker: ✦ Book et møte
- Overskrift: **Hvor kan AI gi dere *mest*?**
- Ingress: Book et møte med oss. Vi ser på hvordan dere jobber, og hvor AI kan øke salget, spare tid eller heve kvaliteten.
- Etikett: I møtet
- Liste:
  - Vi ser på hvordan dere jobber i dag.
  - Vi peker på hvor AI kan øke salget eller spare tid.
  - Dere får forslag til første steg, med pris og tidslinje.
- Brikker: [30] minutter · [Digitalt eller i Bergen]
- Lenke under: Heller skrive? **Send en forespørsel →** (til `/book#skriv`)
- Skjema og kalender: se `06-booking-og-skjema.md`

### Nrth OS-blokk (`os-note`)
- Etikett: Nrth OS
- Tekst: Vi lager også Nrth OS: arbeidsrommet der bedrifter tar i bruk AI selv.
- Lenke: trynrth.com ↗

### Infoboks om foredrag og kurs (`info-box`)
- Kicker: ✦ Foredrag og kurs
- Tittel: Vi holder også foredrag og kurs om AI.
- Tekst: For ledergrupper, ansatte og konferanser.
- Lenke: **Les om foredrag og kurs →** (til `/foredrag-og-kurs`)

### Footer
- Lenker: AI-vurdering · Implementering · AI-tjenester · Foredrag og kurs · Om oss · Personvern
- © 2026 Nrth AI AS · Bergen · Org.nr. [org.nr]
- Nrth OS ↗ · Investorer · English
- Built by agents · ▲

---

## Forside `/`

**Title:** Nrth AI · Vi løser AI for norske bedrifter
**Description:** Nrth AI i Bergen hjelper bedrifter å selge mer og jobbe mer effektivt med AI. AI-vurdering, implementering og AI-tjenester. Book et møte.

### Hero (`hero`, beholder dagens canvas-visual)
- Eyebrow: AI for norske bedrifter · Bergen
- H1: **Vi løser AI for *norske bedrifter*.**
- Undertekst (`hero-subtag`): ✦ Priser og tidslinjer står på siden.
- Ingress: Vi finner ut hvor AI kan øke salget og gjøre dere mer effektive, implementerer det og bygger AI-tjenestene dere trenger.
- Knapp: **Book et møte →** (til `#book`)
- Lenke: Se hva vi gjør ↓ (til `#tjenester`)

### Marquee
AI-vurdering ✦ Implementering ✦ AI-tjenester ✦ Mer salg ✦ Mindre manuelt arbeid ✦ AI-medarbeidere ✦ Strategisprint ✦ Lokal AI ✦

### 01 · Hva vi gjør (`id="tjenester"`, `card-grid--3` med `door-card`)
- Kicker: ✦ 01 · Hva vi gjør
- H2: **Tre måter vi *hjelper* på.**
- Intro: Alle starter med et møte. Der finner vi ut hvilken av de tre dere trenger først.

**Kort 1**
- Topp: 01 · AI-vurdering
- Tittel: Finn ut hvor AI gir dere mest.
- Tekst: Før dere bruker penger på verktøy, finner vi ut hvor AI faktisk øker salget eller sparer tid hos dere, og hva som bør gjøres først.
- Liste: AI-kartlegging · 3–5 dager / Strategisprint · 2 uker / Ledersparring · månedlig
- Pris: Fra 35 000 kr
- Lenke: Les mer → `/ai-vurdering`

**Kort 2**
- Topp: 02 · Implementering
- Tittel: Fra plan til AI i daglig bruk.
- Tekst: Vi setter AI i drift på en avgrenset del av arbeidet, lærer opp dem som skal bruke det, og følger opp til det virker.
- Liste: Pilot i drift · 2–3 uker / Innføring av AI-verktøy / Drift og forbedring · løpende
- Pris: Fra [pris] kr
- Lenke: Les mer → `/implementering`

**Kort 3**
- Topp: 03 · AI-tjenester
- Tittel: Løsninger som selger mer og sparer tid.
- Tekst: Vi bygger AI-løsninger rundt deres prosesser og data: AI-medarbeidere som tar rutinearbeid, skreddersydde løsninger og AI på egen maskinvare.
- Liste: AI-medarbeidere · 1–3 uker / Skreddersydde løsninger · 4–16 uker / Lokal AI-infrastruktur · 2–4 uker
- Pris: Fra 50 000 kr
- Lenke: Les mer → `/ai-tjenester`

Under kortene: knapp **Book et møte →** og teksten «Usikre på hvor dere skal starte? Det finner vi ut i møtet.»

### 02 · Slik jobber vi (`id="slik-jobber-vi"`, dagens `process-grid`)
- Kicker: ✦ 02 · Slik jobber vi
- H2: **Kartlegg. Pilot. *Drift.***
- i · Steg 1, Kartlegg · 1 uke: Vi sitter med teamet, ser arbeidet gjøres og finner de 3–5 stedene der AI endrer regnestykket.
- ii · Steg 2, Pilot · 2–3 uker: Én løsning i drift på en avgrenset del av arbeidet. Ekte data, ekte brukere, målbart resultat.
- iii · Steg 3, Drift · løpende: Vi overvåker, forbedrer og utvider. Med logg, kontroll og et menneske inne der det betyr noe.

### Regnestykket (`math-block`)
- Kicker: ✦ Regnestykket
- Tekst: En dyktig medarbeider i Norge koster 1–1,5 millioner kroner i året. En AI-medarbeider koster typisk 15–35 % av det, og jobber døgnet rundt.
- Tall 1: 1–1,5 MNOK · Ansatt per år
- Tall 2 (oransje): 15–35 % · AI-medarbeider

### 03 · Om oss (dagens `team-grid`)
- Kicker: ✦ 03 · Om oss
- H2: **To gründere i *Bergen*.**
- Thomas Uthaug · Medgründer · forretning, produkt og leveranse
  Ti år innen finans, kvalitetsledelse og teknologileveranser i Storebrand og Sopra Steria. MSc i finans fra NHH, med utveksling ved UC Berkeley og Copenhagen Business School. Hele karrieren har handlet om å gjøre kompleks teknologi om til resultater på bunnlinjen.
  Merker: NHH MSc finans · UC Berkeley · Storebrand · Sopra Steria
- Simen Uthaug · Medgründer · teknologi og utvikling
  Bachelor i informasjonsvitenskap fra UiB og master i UX og utvikling. Fullstack-utvikler med TypeScript, React, Python, API-integrasjon, databaser og maskinlæring.
  Merker: UiB informasjonsvitenskap · TypeScript / React · Python / ML · Fullstack
- Under: `os-note`

### Infoboks: foredrag og kurs
(se felles deler)

### 04 · Book et møte
(se felles deler, tema: ingen forhåndsvalgt)

---

## AI-vurdering `/ai-vurdering`

**Title:** AI-vurdering og AI-strategi for bedrifter · Nrth AI
**Description:** Finn ut hvor AI gir bedriften mest: AI-kartlegging på 3–5 dager, strategisprint på 2 uker og ledersparring. Fra 35 000 kr.

### Sidehero (`page-hero`)
- Kicker: ✦ AI-vurdering
- H1: **Finn ut hvor AI gir dere *mest*.**
- Ingress: Før dere bruker penger på verktøy, finner vi ut hvor AI faktisk øker salget, sparer tid eller hever kvaliteten hos dere. Og vi sier fra om hva som ikke bør løses med AI.
- Knapp: **Book et møte →** (til `#book`)

### Tjenester (dagens `service-card`)

**01 · AI-kartlegging** (`id="kartlegging"`)
- Tekst: En skriftlig oversikt over hvor AI gir mest hos dere, og hva som bør gjøres først.
- Inkludert:
  - Samtaler med ledelse og nøkkelpersoner
  - Gjennomgang av prosesser, systemer og data
  - Vurdering av hvor AI kan øke salget eller spare tid
  - Skriftlig veikart med prioriterte tiltak
- Leveranse: 3–5 dager
- Investering: Fra 35 000 kr
- Passer for: Bedrifter som vil vite hvor de skal begynne før de forplikter seg.

**02 · Strategisprint** (`id="strategisprint"`)
- Tekst: To intensive uker som ender i en plan dere kan gjennomføre.
- Inkludert:
  - Implementeringsplan
  - Regnestykke for gevinst og kostnad
  - Prioritert omfang for første pilot
  - Anbefaling om hva som bør kjøpes, og hva som bør bygges
- Leveranse: 2 uker
- Investering: Fra 75 000 kr
- Passer for: Ledergrupper som skal ta en beslutning om AI og vil ha et solid grunnlag.

**03 · Ledersparring** (`id="ledersparring"`)
- Tekst: Løpende rådgivning for ledergruppen mens AI tas i bruk.
- Inkludert:
  - Faste rådgivningsmøter med ledergruppen
  - Vurdering av verktøy og leverandører
  - Oppfølging av prioriteringer og gevinster
- Leveranse: Månedlig
- Investering: Fra 25 000 kr per måned
- Passer for: Daglige ledere og ledergrupper som vil ha en partner som sier fra om hva som ikke vil fungere, ikke bare hva som vil.

### Book et møte (tema: AI-vurdering)

---

## Implementering `/implementering`

**Title:** AI-implementering for bedrifter · Nrth AI
**Description:** Vi setter AI i drift i bedriften: pilot på 2–3 uker, innføring av AI-verktøy med opplæring, og drift og forbedring etterpå.

### Sidehero
- Kicker: ✦ Implementering
- H1: **Fra plan til AI i *daglig bruk*.**
- Ingress: Mange AI-prosjekter stopper etter demoen. Vi setter løsningen i drift på en avgrenset del av arbeidet, lærer opp dem som skal bruke den, og blir med til den virker.
- Knapp: **Book et møte →**

### Tjenester

**01 · Pilot i drift** (`id="pilot"`)
- Tekst: Én løsning i drift på ekte arbeid, med et mål dere kan måle.
- Inkludert:
  - Valg av et avgrenset område med tydelig mål
  - Oppsett koblet til deres systemer og data
  - Test med ekte brukere
  - Måling mot målet, og anbefaling om neste steg
- Leveranse: 2–3 uker
- Investering: Fra [pris] kr
- Passer for: Bedrifter som vil se effekt før de skalerer.

**02 · Innføring av AI-verktøy** (`id="verktoy"`)
- Tekst: Riktig verktøy, riktig satt opp, og folk som faktisk bruker det.
- Inkludert:
  - Valg av verktøy etter behov og krav til data
  - Oppsett, tilganger og retningslinjer for bruk
  - Opplæring av teamene som skal bruke det
  - Oppfølging de første ukene
- Leveranse: [varighet]
- Investering: Fra [pris] kr
- Passer for: Bedrifter som har kjøpt, eller skal kjøpe, AI-verktøy og vil få verdi ut av dem.

**03 · Drift og forbedring** (`id="drift"`)
- Tekst: Vi overvåker, forbedrer og utvider det som er satt i drift.
- Inkludert:
  - Overvåking og logg
  - Justering når arbeidet endrer seg
  - Utvidelse til nye områder
  - Månedlig gjennomgang av resultater
- Leveranse: Løpende
- Investering: Fra 5 000 kr per måned
- Passer for: Alle som har AI i drift og vil at den skal fortsette å levere.

### Book et møte (tema: Implementering)

---

## AI-tjenester `/ai-tjenester`

**Title:** AI-tjenester og AI-medarbeidere for bedrifter · Nrth AI
**Description:** AI-medarbeidere fra 50 000 kr, skreddersydde AI-løsninger og lokal AI-infrastruktur på egen maskinvare. Priser og tidslinjer på siden.

### Sidehero
- Kicker: ✦ AI-tjenester
- H1: **Løsninger som *selger mer* og sparer tid.**
- Ingress: Vi bygger AI-løsninger rundt deres prosesser og data. Fra én AI-medarbeider som tar rutinearbeid, til skreddersydde systemer og AI som kjører på egen maskinvare.
- Knapp: **Book et møte →**

### Tjenester

**01 · AI-medarbeidere** (`id="ai-medarbeidere"`)
- Tekst: En AI-medarbeider tar en bestemt rolle eller arbeidsflyt: dokumentbehandling, kundeservice, analyse, intern kunnskap eller salgsoppfølging. Døgnet rundt, til en brøkdel av prisen for en ansatt.
- Inkludert:
  - Kartlegging av rollen eller arbeidsflyten
  - AI-medarbeider bygget rundt deres prosesser
  - Kobling til verktøyene og dataene dere har
  - Drift på lokal infrastruktur når dataene krever det
  - Løpende forbedring og overvåking
- Leveranse: 1–3 uker
- Investering: Oppsett fra ca. 50 000 kr, drift fra 5 000 kr per måned. Typisk 15–35 % av kostnaden for en ansatt.
- Passer for: Bedrifter som vil øke kapasiteten uten å ansette, særlig i roller med repeterende kunnskapsarbeid eller store volum.

**02 · Skreddersydde løsninger** (`id="skreddersydd"`)
- Tekst: Når standardverktøy ikke passer, designer og bygger vi løsningen som gjør det. Fra første idé til løsning i drift.
- Inkludert:
  - Kartlegging og avgrensning
  - Arkitektur og løsningsdesign
  - Utvikling, tilpasning og integrasjon
  - Testing, idriftsetting og dokumentasjon
  - Videreutvikling ved behov
- Leveranse: 4–16 uker
- Investering: Fastpris per prosjekt. Små fra ca. 150 000 kr, mellomstore fra 400 000 kr, store fra 1 000 000 kr.
- Passer for: Bedrifter med et konkret problem der eksisterende verktøy kommer til kort på datasensitivitet, integrasjon eller fagområde.

**03 · Lokal AI-infrastruktur** (`id="lokal-ai"`)
- Tekst: AI som kjører på deres egen maskinvare, innenfor deres nettverk. Vi velger maskinvare, setter opp modellene og sikrer løsningen.
- Inkludert:
  - Spesifikasjon av maskinvare og hjelp med innkjøp
  - Oppsett av språkmodeller, åpen kildekode eller lisensierte
  - Tilpasning til deres data
  - Sikkerhetsarkitektur og tilgangsstyring
  - Dokumentasjon, overlevering og opplæring
- Leveranse: 2–4 uker
- Investering: Typisk 100 000 til 1 000 000+ kr, avhengig av omfang.
- Passer for: Regulerte bransjer og bedrifter der kontroll over egne data er et strategisk valg, ikke et krav å krysse av for.

### Regnestykket
(samme blokk som på forsiden)

### Book et møte (tema: AI-tjenester)

---

## Om oss `/om-oss`

**Title:** Om Nrth AI · AI-selskap i Bergen
**Description:** Nrth AI AS er et AI-selskap i Bergen, etablert i 2026. Vi hjelper norske bedrifter å ta AI i bruk, og vi bygger Nrth OS.

### Sidehero
- Kicker: ✦ Om oss
- H1: **To gründere i *Bergen*.**
- Ingress: Nrth AI AS ble etablert i 2026. Vi hjelper norske bedrifter å ta i bruk AI på en måte som gir resultater, og vi bygger produktet Nrth OS.

### Team
(samme kort som på forsiden)

### Det dere kan forvente (`card-grid--2`, fire kort)
- Kicker: ✦ Det dere kan forvente
- H2: **Slik *jobber* vi.**
1. **Vi drifter det vi bygger.** Leveransen slutter ikke ved overlevering.
2. **Priser og tidslinjer står på siden.** Ingen «ta kontakt for tilbud».
3. **Vi sier fra når AI er feil verktøy.** Det sparer dere mer enn det koster oss.
4. **Målt på det som teller.** Hver løsning får et mål dere kan måle: mer salg, færre timer eller bedre kvalitet.

### Nrth OS-blokk

### Kontakt (`contact-lines`)
- E-post: contact@nrth.no
- Sted: Bergen, Norge
- Selskap: Nrth AI AS · Org.nr. [org.nr]

### Book et møte

---

## Book et møte `/book`

**Title:** Book et møte om AI · Nrth AI
**Description:** Book et møte med Nrth AI om AI-vurdering, implementering eller AI-tjenester. Vi svarer innen én virkedag.

### Sidehero
- Kicker: ✦ Book et møte
- H1: **Book et *møte*.**
- Ingress: Vi ser på hvordan dere jobber, og hvor AI kan øke salget, spare tid eller heve kvaliteten. Dere går ut med forslag til første steg.

### Booking
Bookingseksjonen uten overskrift (overskriften står i sidehero). Tema fra `?tema=` i URL-en.

### Send en forespørsel (`id="skriv"`, dagens `brief-panel`)
- Kicker: ✦ Heller skrive?
- H2: **Send en *forespørsel*.**
- Ingress: Fortell hva dere vil ha hjelp med. Et menneske i teamet svarer med et konkret forslag, vanligvis innen én virkedag.
- Panelhode: nrth.forespørsel · fyll ut / forespørsel.v1
- Felter:
  - E-post * · plassholder: navn@bedrift.no
  - Bedrift · plassholder: Valgfritt
  - Rolle · plassholder: Valgfritt
  - Hva vil dere ha hjelp med? * · plassholder: Noen setninger holder: hvilket arbeid, hvilke systemer, hvilket resultat.
  - Hvor haster det? · Vi utforsker / Dette kvartalet / Så fort som mulig
- Knapp: **Send forespørsel →**
- Sender: Sender …
- Feil: Noe gikk galt. Prøv igjen, eller send e-post til contact@nrth.no.
- Merknad: Vi svarer fra contact@nrth.no innen én virkedag. Opplysningene deles ikke med andre.
- Kvittering: **Forespørselen er sendt. *Vi tar kontakt.*** / Et menneske i Nrth AI-teamet svarer innen én virkedag fra **contact@nrth.no**. / Send en ny →

---

## Foredrag og kurs `/foredrag-og-kurs`

**Title:** Foredrag og kurs om AI for bedrifter · Nrth AI
**Description:** Nrth AI holder foredrag, bedriftskurs og workshops om AI for ledergrupper, ansatte og konferanser.

### Sidehero
- Kicker: ✦ Foredrag og kurs
- H1: **Foredrag og kurs om *AI*.**
- Ingress: Vi holder foredrag og kurs for ledergrupper, ansatte og konferanser. Praktisk, konkret og tilpasset bransjen deres.

### Formater (`card-grid--3`)
1. **Foredrag** · [varighet] · For ansatte, kunder eller konferanser. Hva AI kan gjøre i dag, og hva det betyr for dere.
2. **Bedriftskurs** · [varighet] · For team som skal bruke AI i jobben, med egne oppgaver som øvingsstoff.
3. **Workshop for ledergrupper** · [varighet] · Ledergruppen finner de første stedene AI skal inn, og går ut med en prioritert liste.

- Pris: [pris eller «Pris etter avtale»]
- Knapp: **Spør om et foredrag →** (til `/book?tema=foredrag#book`)

### Book et møte (tema: Foredrag eller kurs)

---

## Personvern `/personvern`

**Title:** Personvern · Nrth AI
**Description:** Hvordan Nrth AI AS behandler opplysningene du gir oss når du booker et møte eller sender en forespørsel.

Siden skrives som vanlig tekst (`prose`). Dette er et **utkast** som Thomas eller en advokat må godkjenne før publisering.

- **Behandlingsansvarlig:** Nrth AI AS, Bergen. Org.nr. [org.nr]. Kontakt: contact@nrth.no.
- **Hva vi samler inn:** Navn, e-post, bedrift, rolle og det du skriver i skjemaet eller bookingen. Ingenting annet.
- **Hvorfor:** For å svare deg og avtale møter. Grunnlaget er vår berettigede interesse i å svare på henvendelser (GDPR art. 6 nr. 1 bokstav f).
- **Hvor det lagres:** E-post sendes via Resend til innboksen vår. Bookinger lagres i [Google Kalender / Cal.com].
- **Hvor lenge:** Til henvendelsen er avsluttet, og senest [12] måneder etter siste kontakt, med mindre dere blir kunde.
- **Informasjonskapsler og sporing:** [Vi bruker ikke informasjonskapsler til sporing. / Vi bruker Plausible, som ikke setter informasjonskapsler.]
- **Dine rettigheter:** Innsyn, retting, sletting og klage til Datatilsynet. Send e-post til contact@nrth.no.
- Sist oppdatert: [dato]

---

## 404

- H1: **Siden finnes *ikke*.** / Page not found.
- Tekst: Den kan ha flyttet da vi fornyet nettsiden. / It may have moved when we rebuilt the site.
- Lenker: Til forsiden → · Book et møte → · English →
