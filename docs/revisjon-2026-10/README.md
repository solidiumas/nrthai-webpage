# Arbeidspakke: revisjon av nrth.no

*30. september 2026. Repo: `solidiumas/nrthai-webpage`. Legges i repoet under `docs/revisjon-2026-10/`.*

nrth.no skal bli tjenestesiden til Nrth AI AS for norske bedrifter. Hovedhandlingen er **«Book et møte»**, om AI-vurdering, implementering eller AI-tjenester. Nrth OS flytter til trynrth.com. Foredrag og kurs ligger på siden som informasjon.

Strukturen er forslag **A · Tre dører** fra designlerretet «Nrth nettsider – forslag». Utseendet er **dagens nrth.no** (`assets/site.css`). Skissene i `referanse/` viser rekkefølge og innhold, ikke typografi.

## Filene

| Fil | Hva det er | Når det brukes |
|---|---|---|
| `START-HER-prompt.md` | Teksten du limer inn i Claude Code | Først |
| `CLAUDE.md` | Regler for repoet. Kopieres til roten av repoet | PR 1 |
| `01-brief.md` | Mål, beslutninger, hva som beholdes og hva som går ut | Leses først av Claude Code |
| `02-sidekart-ruter-videresending.md` | Alle sider, filstier, videresendinger og hreflang | PR 1 |
| `03-tekst-norsk.md` | Ferdig norsk tekst til alle sider | PR 2 |
| `04-tekst-engelsk.md` | Ferdig engelsk tekst til alle sider under `/en/` | PR 4 |
| `05-komponenter-og-design.md` | Hvilke klasser som gjenbrukes, og de fire nye komponentene | PR 1–3 |
| `06-booking-og-skjema.md` | Booking, `/api/book`, e-poster og det gamle skjemaet | PR 3 |
| `07-seo-og-agentlag.md` | Metadata, JSON-LD, llms.txt, manifester, `/api/services` | PR 5 |
| `08-oppgaver-og-akseptkriterier.md` | PR-plan, akseptkriterier, QA og manuelle steg for Thomas | Hele veien |
| `referanse/` | Skisser fra lerretet | Ved tvil om rekkefølge |

## Før Claude Code starter (Thomas)

1. **Merge `fix/investors-deadline-31-dec`** (flytter fristen i investorrunden til 31. desember 2026). Ellers kan det bli konflikt i `investors/index.html`.
2. **Velg bookingverktøy:** Google Kalender-avtaleplan eller Cal.com. Lim lenken inn i `assets/booking-config.js` når den finnes. Siden fungerer uten, med et forespørselsskjema i stedet. Se `06`.
3. **Bekreft prisene i `01-brief.md` §5.** Kroneprisene er de dere brukte før tjenestene ble gjort om til USD i mai (commit `3eed86b`). Tre tjenester mangler pris.

## Åpne punkter

Alt som står i `[hakeparenteser]` i tekstfilene må fylles inn av Thomas før lansering. Samlet liste står i `08`, del 5.
