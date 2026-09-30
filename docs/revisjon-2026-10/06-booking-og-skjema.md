# 06 · Booking og skjema

## 1. To moduser

Bookingseksjonen skal virke **fra dag én**, også før Thomas har valgt bookingverktøy.

| Modus | Når | Hva kunden ser |
|---|---|---|
| **Kalender** | `url` er satt i `assets/booking-config.js` | Temavalg + kalenderen fra verktøyet (iframe). Verktøyet sender bekreftelse og kalenderinvitasjon |
| **Forespørsel** | `url` er tom | Temavalg + et kort skjema. Sendes til `POST /api/book`, som sender e-post via Resend. Nrth svarer med forslag til tid |

## 2. Konfigurasjon

Ny fil `assets/booking-config.js`, lastet før `assets/booking.js`:

```js
window.NRTH_BOOKING = {
  provider: "",        // "google" | "cal" | "" (tom = forespørselsmodus)
  url: "",             // Lenke til avtaleplanen eller Cal.com-siden
  durationMinutes: 30  // Vises i brikken «[30] minutter»
};
```

Thomas fyller inn `provider` og `url` når verktøyet er valgt. Ingen annen kode skal måtte endres.

- **Google Kalender-avtaleplan:** bruk innebyggingslenken fra Google Kalender (Del → Nettsted-innebygging). Iframe med `title="Velg tid for møte med Nrth AI"`.
- **Cal.com:** bruk `https://cal.com/<bruker>/<type>?embed=true` i iframe, eller Cal.com sin innebyggingskode. Send tema som `?notes=Tema:%20<tema>`.

Under iframen: lenken «Åpne kalenderen i ny fane ↗» til samme URL, for de som ikke får lastet iframen.

## 3. Tema

| Norsk verdi | Norsk etikett | Engelsk verdi | Engelsk etikett |
|---|---|---|---|
| `ai-vurdering` | AI-vurdering | `ai-assessment` | AI assessment |
| `implementering` | Implementering | `implementation` | Implementation |
| `ai-tjenester` | AI-tjenester | `ai-services` | AI services |
| `foredrag` | Foredrag eller kurs | `talk` | Talk or course |
| `annet` | Annet | `other` | Other |

Forhåndsvalg, i denne rekkefølgen:
1. `?tema=` (norsk) eller `?topic=` (engelsk) i URL-en.
2. `data-default-topic` på bookingseksjonen. Settes på tjenestesidene og foredragssiden (se `03`).
3. Ellers: ingen valgt.

`/api/book` gjør engelske verdier om til de norske før e-posten sendes, så innboksen bare har ett sett verdier.

## 4. Forespørselsskjemaet (modus uten kalender)

| Felt | Type | Påkrevd | Norsk etikett | Engelsk etikett |
|---|---|---|---|---|
| `tema` | radio (se over) | ja | Hva vil dere snakke om? | What would you like to talk about? |
| `navn` | tekst | ja | Navn | Name |
| `epost` | e-post | ja | E-post | Email |
| `bedrift` | tekst | nei | Bedrift | Company |
| `maal` | select | nei | Hva vil dere oppnå? | What do you want to achieve? |
| `naar` | select | nei | Når passer det? | When suits you? |
| `tid` | tekst | nei | Foretrukket tidspunkt | Preferred time |
| `form` | select | nei | Møteform | Meeting format |
| `website` | skjult honningfelle | – | – | – |
| `lang` | skjult, `nb` eller `en` | – | – | – |

Valg:
- `maal`: Øke salget / Jobbe mer effektivt / Forbedre kvalitet eller kundeopplevelse / Vet ikke ennå — Increase sales / Work more efficiently / Improve quality or customer experience / Not sure yet
- `naar`: Denne uken / Neste uke / Om to uker eller senere — This week / Next week / In two weeks or later
- `form`: Digitalt / I Bergen — Online / In Bergen *(Thomas bekrefter om begge skal tilbys)*
- Plassholder for `tid`: «F.eks. tirsdag formiddag» / «E.g. Tuesday morning»

Knapp: **Book møtet →** / **Request the meeting →**
Under knappen: «Vi bekrefter tidspunktet på e-post innen én virkedag. Se [personvern](/personvern).» / «We confirm the time by email within one business day. See [privacy](/en/privacy).»

Kvittering (panelet får `is-sent`, samme mønster som `brief-form.js`):
- **Takk. *Vi bekrefter tiden.*** Du får svar fra contact@nrth.no innen én virkedag med forslag til tidspunkt. / Book et nytt møte →
- **Thanks. *We'll confirm the time.*** You'll hear from contact@nrth.no within one business day with a proposed time. / Book another →

Feil: «Noe gikk galt. Prøv igjen, eller send e-post til contact@nrth.no.» / «Something went wrong. Please try again, or email contact@nrth.no.»

Skjemaet skal virke uten JavaScript (vanlig `POST` til `/api/book`, som da svarer med en enkel HTML-kvitteringsside). Med JavaScript sendes det som JSON, som `brief-form.js` gjør i dag.

## 5. `api/book.js`

Ny Vercel-funksjon, samme mønster som `api/inquiry.js`.

- **Metode:** `POST`, og `OPTIONS` for CORS (som i dag).
- **Tar imot:** JSON eller `application/x-www-form-urlencoded`.
- **Validering:** `navn`, `epost` og `tema` er påkrevd. `epost` må se ut som en e-postadresse. Maks 2 000 tegn per felt. Feil gir `400` med `{ "error": "..." }`.
- **Honningfelle:** er `website` fylt ut, svar `200 { ok: true }` uten å sende noe.
- **E-post til Nrth** via Resend:
  - Fra: `booking@nrth.no` (samme domene som `brief@nrth.no`, som allerede brukes)
  - Til: `contact@nrth.no`
  - Svar til: kundens e-post
  - Emne: `Møte · <tema-etikett> · <bedrift eller e-post>`
  - Tekst: alle feltene, ett per linje, pluss språk og tidspunkt for innsending.
- **Kvittering til kunden** på kundens språk (`lang`):
  - Fra: `booking@nrth.no`, svar til `contact@nrth.no`
  - Norsk emne: «Vi har fått forespørselen din om møte»
  - Norsk tekst: «Hei <navn>. Takk for at du vil møte oss om <tema>. Vi svarer innen én virkedag med forslag til tidspunkt. Hilsen Thomas og Simen, Nrth AI»
  - Engelsk emne: «We've received your meeting request»
  - Engelsk tekst: «Hi <navn>. Thanks for wanting to meet us about <topic>. We'll reply within one business day with a proposed time. Best, Thomas and Simen, Nrth AI»
- **Svar:** `200 { ok: true }`. Ved feil fra Resend: `500 { error: "Failed to send" }` og logg feilen.
- **Miljøvariabel:** `RESEND_API_KEY` finnes allerede.

## 6. Dagens forespørselsskjema (`api/inquiry.js`)

- Beholdes. Flyttes til `/book#skriv` og `/en/book#write`, og står ikke lenger på forsiden.
- Teksten oversettes (se `03` og `04`). Feltnavnene (`email`, `company`, `role`, `problem`, `urgency`) endres **ikke**, så API-kontrakten holder.
- Legg til et skjult felt `lang` og bruk det i emnet: `Forespørsel · <bedrift>` eller `Brief · <company>`.
- `URGENCY_LABELS` får norske etiketter: Vi utforsker / Dette kvartalet / Så fort som mulig.

## 7. Måling (valgfritt)

Hvis Thomas velger Plausible: send hendelsene `book_submitted`, `book_calendar_opened` og `inquiry_submitted`. Ingen informasjonskapsler, ingen persondata i hendelsene.
