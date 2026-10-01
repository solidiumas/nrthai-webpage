# 05 · Komponenter og design

## 1. Fasit

`assets/site.css` er fasit for utseendet. Farger, fonter, avstander og hover-effekter skal se ut som i dag.

- Farger: `--bg #0a0a0b`, `--bg-2 #111114`, `--fg #f5f2ec`, `--fg-dim #a8a49c`, `--accent #ff8a5b`, linjer via `--line` og `--line-2`.
- Fonter: Instrument Serif (overskrifter, oransje kursiv på `<em>`), Geist (brødtekst), Geist Mono (etiketter, knapper, menyen i store bokstaver), Satoshi (kun logoen).
- Skarpe hjørner. Kortrutenett med 2 px linjer mellom kortene (`.card-grid`).
- Filmkorn-overlegget på `body::before` beholdes.

**Skissene i `referanse/`** viser rekkefølge og innhold. De er laget med en annen font og avrundede hjørner. Følg `site.css`, ikke skissene, for utseende.

**Designsystem-pakken** (Satoshi/Inter, 14 px hjørner) gjelder ikke nrth.no.

## 2. Gjenbruk

| Behov | Bruk | Finnes i |
|---|---|---|
| Meny | `.site-nav`, `.logo`, `.nav-right`, `.nav-link`, `.nav-cta`, `.nav-toggle` | `index.html` |
| Forsidehero | `.hero`, `.eyebrow`, `.hero-subtag`, `.lede`, `.hero-actions`, `.hero-visual` med canvas | `index.html` |
| Marquee | `.marquee`, `.marquee-track` | `index.html` |
| Seksjon | `.section`, `.section--bordered`, `.section-header`, `.kicker`, `.section-intro` | `index.html` |
| Kort | `.card-grid--3` / `--2`, `.card`, `.card-head`, `.tag`, `.card-foot` | `index.html` |
| Slik jobber vi | `.process-grid`, `.process-step`, `.numeral`, `.step-label` | `index.html` (#process) |
| Regnestykket | `.stat-row`, `.stat-cell`, `.big`, `.lbl` | `index.html` (#work) |
| Team | `.team-grid`, `.member`, `.avatar`, `.role`, `.tags` | `index.html` (#company) |
| Tjenestekort | `.service-card`, `.included-label`, `.included`, `.service-meta-group`, `.service-meta` | `services/index.html` |
| Skjema | `.cta-grid`, `.brief-panel`, `.brief-head`, `.brief-form`, `.brief-sent` | `index.html` (#contact) |
| Knapper | `.btn`, `.btn-ghost`, `.link-arrow` | `site.css` |
| Footer | `.site-footer` | `index.html` |

## 3. Nye komponenter

Legg nye stiler nederst i `site.css` under en egen kommentar: `/* ───── Revisjon 2026-10 ───── */`. Bruk bare eksisterende variabler.

### `page-hero` (undersider)
- Som `.hero`, men uten canvas og med `min-height: 64vh`.
- Innhold: `.kicker`, `<h1>` i serif (`clamp(48px, 6vw, 96px)`, `line-height: 0.98`), `.lede`, `.btn`.
- Én kolonne, venstrejustert, maks bredde `var(--maxw)`.

### `door-card` (tre dører på forsiden)
- Et `.card` i `.card-grid--3`.
- `.card-head`: nummer til venstre, dørnavnet som `.tag` til høyre («01» · «AI-vurdering»).
- `<h3>` i serif, 36 px (som `.card h3`).
- Kort tekst i `--fg-dim`.
- Liste i samme stil som `.included`: oransje pil, navn, og varighet til høyre i Geist Mono 11 px.
- Bunn (`.card-foot`): pris til venstre i Geist Mono («FRA 35 000 KR»), `.link-arrow` «Les mer →» til høyre.
- Hele kortet er ikke en lenke. Bare «Les mer →» er det, så tastaturnavigasjonen blir enkel.

### `booking` (id `book`)
- Rutenett 5/7 som `.cta-grid`.
- **Venstre:** `.kicker`, `<h2>` i serif, `.lede`, etiketten «I møtet» i mono, liste med oransje piler, to brikker i mono med 1 px `--line-2`-kant, og lenken «Heller skrive?».
- **Høyre:** et panel i samme stil som `.brief-panel`, med `.brief-head` («nrth.book · velg tid» og «book.v1»).
  - Øverst: temavalg som **ekte radioknapper** (`<input type="radio" name="tema">`) stilt som brikker i mono, store bokstaver, 1 px kant. Valgt = oransje kant og oransje tekst. Tastatur: piltaster flytter valget (standard for radiogrupper).
  - Under: enten kalenderen fra bookingverktøyet (iframe) eller forespørselsskjemaet. Se `06`.
- Under 1024 px: én kolonne.
- På `/book` vises bare høyre panel i full bredde under sidehero.

### `info-box` (foredrag og kurs)
- Én rad: tekst til venstre, `.btn-ghost` til høyre.
- 1 px `--line-2`-kant, `padding: 32px 40px`.
- Tittelen i serif 32 px. Ingen stor seksjonsoverskrift, dette skal være lavmælt.
- Under 720 px: knappen går under teksten.

### `os-note` (Nrth OS)
- Én rad med 1 px **stiplet** `--line-2`-kant.
- Etiketten «Nrth OS» i mono og oransje, én setning i `--fg`, og lenken «trynrth.com ↗» i oransje til høyre.

### `lang-switch`
- I menyen, før «Book et møte»: `EN` eller `NO` i samme stil som `.nav-link`.
- `hreflang` og `lang` på lenken, og `aria-label="English version"` / `aria-label="Norsk versjon"`.

### `prose` (personvern)
- Maks bredde 720 px, Geist 17 px, `line-height: 1.6`, overskrifter i serif 32 px.

## 4. Tilgjengelighet

- `--fg-faint` (#5c5a55) har kontrast 2,9:1 mot bakgrunnen, under kravet på 4,5:1. Ikke bruk den til tekst som skal leses i nye komponenter. Bruk `--fg-dim` (8,0:1). I `.card-head` endres nummeret til `--fg-dim`.
- Oransje tekst på bakgrunnen er 8,5:1, og svart tekst på oransje knapp er 9,0:1. Begge er i orden.
- Legg til en «Hopp til innhold»-lenke øverst på alle sider (til `#main`).
- Marquee og canvas-animasjonen skal stå stille ved `prefers-reduced-motion: reduce`.
- Alle skjemafelt har `<label>`. Feilmeldinger kobles til feltet med `aria-describedby`.
- Radioknappene for tema er en `<fieldset>` med `<legend>`: «Hva vil dere snakke om?».

## 5. Mobil

Sjekk hver side på 390 px bredde:
- Ingen horisontal scroll.
- Dørkortene ligger under hverandre.
- Temabrikkene brytes over flere linjer.
- Kalenderen (iframe) er minst 640 px høy og i full bredde.
- Menyknappen virker og lukkes etter klikk (som i dag).
