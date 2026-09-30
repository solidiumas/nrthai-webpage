# CLAUDE.md · nrth.no (`solidiumas/nrthai-webpage`)

Tjenestesiden til Nrth AI AS for norske bedrifter. Hovedhandling: **Book et møte**.

## Stack

- Statisk HTML, én `index.html` per side i egen mappe. Ingen rammeverk, ingen byggesteg.
- Felles stiler i `assets/site.css`. Felles skript i `assets/*.js` (vanilla, progressiv forbedring).
- Vercel: `vercel.json` for videresendinger og headere. Funksjoner i `api/` (Node, CommonJS).
- E-post via Resend (`RESEND_API_KEY`).
- Lokalt: `npx vercel dev`.

## Kilder

- Arbeidspakken i `docs/revisjon-2026-10/` er fasit for struktur og tekst.
- `assets/site.css` er fasit for utseende.
- `ANALYSE-SYNLIGHET.md` har SEO-analysen fra juni.

## Regler

1. **Tekst:** bruk teksten fra `docs/revisjon-2026-10/03-tekst-norsk.md` og `04-tekst-engelsk.md` ordrett. Ikke skriv om, forkort eller legg til tekst. Mangler noe, spør.
2. **Plassholdere** i `[hakeparenteser]` blir stående til Thomas fyller dem inn. Ikke finn på priser, datoer, tall eller kundenavn.
3. **Norsk er standard** på `/`, engelsk under `/en/`. Hver side finnes på begge språk, med hreflang begge veier.
4. **Ingen påstander om produktet** på denne siden. Nrth OS omtales bare i Nrth OS-blokken og footeren, med lenke til trynrth.com.
5. **Aldri disse** på nrth.no: «Agentic OS», «on-premise runtime», «data never leaves», 72 %, 5×, «0 FTE».
6. **Design:** bruk variablene og klassene i `site.css`. Ingen nye farger, fonter eller avrundede hjørner. `--fg-faint` brukes ikke til tekst som skal leses.
7. **Tilgjengelighet:** ekte `<button>`, `<a href>`, `<input>` med `<label>`. Synlig fokus. `prefers-reduced-motion` respekteres.
8. **Siden skal kunne leses uten JavaScript.** Skjemaer virker uten JavaScript.
9. **Priser** finnes i `data/tjenester.json` og i HTML. Endres den ene, endres den andre. Kjør `node scripts/sjekk-priser.mjs`.
10. **Manifestene** (`agent.json`, `openapi.json`, `.well-known/ai-plugin.json`, `ai-actions` i `index.html`) lover bare endepunkter som finnes.
11. **Ikke rør** `investors/` og `pitchdeck/` uten at Thomas ber om det.
12. **Stil i tekst:** setningsstart med stor bokstav, resten små. Ingen utropstegn, ingen emoji.

## Arbeidsform

- Én branch og én PR per steg i `docs/revisjon-2026-10/08-oppgaver-og-akseptkriterier.md`.
- Sjekk akseptkriteriene før PR-en åpnes, og kryss dem av i PR-beskrivelsen.
- Legg ved skjermbilder av desktop og mobil.
- Er du i tvil om innhold, pris eller påstander: spør, ikke gjett.
