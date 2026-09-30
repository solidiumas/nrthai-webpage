# 02 · Sidekart, ruter og videresendinger

## 1. Sider

Alle sider er statiske HTML-filer. `cleanUrls: true` og `trailingSlash: false` i `vercel.json` beholdes.

| Side | Norsk URL | Fil | Engelsk URL | Fil |
|---|---|---|---|---|
| Forside | `/` | `index.html` | `/en` | `en/index.html` |
| AI-vurdering | `/ai-vurdering` | `ai-vurdering/index.html` | `/en/ai-assessment` | `en/ai-assessment/index.html` |
| Implementering | `/implementering` | `implementering/index.html` | `/en/implementation` | `en/implementation/index.html` |
| AI-tjenester | `/ai-tjenester` | `ai-tjenester/index.html` | `/en/ai-services` | `en/ai-services/index.html` |
| Om oss | `/om-oss` | `om-oss/index.html` | `/en/about` | `en/about/index.html` |
| Book et møte | `/book` | `book/index.html` | `/en/book` | `en/book/index.html` |
| Foredrag og kurs | `/foredrag-og-kurs` | `foredrag-og-kurs/index.html` | `/en/talks-and-courses` | `en/talks-and-courses/index.html` |
| Personvern | `/personvern` | `personvern/index.html` | `/en/privacy` | `en/privacy/index.html` |
| 404 | – | `404.html` (norsk og engelsk på samme side) | – | – |
| Investorer | `/investors` | uendret | – | – |
| Pitchdeck | `/pitchdeck` | uendret | – | – |

Hver tjeneste er en **seksjon med anker** på tjenestesiden, ikke en egen side. Egne undersider kan komme senere, når det finnes innhold til dem.

| Tjenesteside | Norske ankre | Engelske ankre |
|---|---|---|
| AI-vurdering | `#kartlegging`, `#strategisprint`, `#ledersparring` | `#assessment`, `#sprint`, `#advisory` |
| Implementering | `#pilot`, `#verktoy`, `#drift` | `#pilot`, `#tools`, `#operations` |
| AI-tjenester | `#ai-medarbeidere`, `#skreddersydd`, `#lokal-ai` | `#ai-employees`, `#custom`, `#local-ai` |

Alle sider unntatt `/book`, `/personvern` og 404 har bookingseksjonen nederst med `id="book"`.

## 2. Meny

**Norsk:** logo → `/` · AI-vurdering · Implementering · AI-tjenester · Om oss · `EN` · knapp «Book et møte →» (til `#book` på siden)

**Engelsk:** logo → `/en` · AI assessment · Implementation · AI services · About · `NO` · knapp «Book a meeting →»

- `EN`/`NO` lenker til **samme side på det andre språket**, ikke til forsiden.
- `aria-current="page"` på aktiv side (klassen finnes i `site.css`).
- Foredrag og kurs står ikke i menyen, bare i footer og i infoboksen på forsiden.
- Dagens mobilmeny (`assets/nav.js`) gjenbrukes.

## 3. Footer

```
</> Nrth AI
AI-vurdering · Implementering · AI-tjenester · Foredrag og kurs · Om oss · Personvern
© 2026 Nrth AI AS · Bergen · Org.nr. [org.nr]      Nrth OS ↗ · Investorer · English      Built by agents · ▲
```

«Nrth OS ↗» lenker til `https://trynrth.com` med `rel="noopener"`. Det samme gjelder Nrth OS-blokken på forsiden og Om oss. Er trynrth.com ikke oppe når nrth.no publiseres, skjules lenkene og blokken til den er det (legg dem i HTML med `hidden`, så de er enkle å slå på).

## 4. Videresendinger (`vercel.json`)

Erstatt dagens `redirects` i `vercel.json` med denne listen (resten av filen beholdes):

```json
{
"redirects": [
  { "source": "/services", "destination": "/ai-tjenester", "permanent": true },
  { "source": "/work", "destination": "/ai-tjenester", "permanent": true },
  { "source": "/company", "destination": "/om-oss", "permanent": true },
  { "source": "/contact", "destination": "/book", "permanent": true },
  { "source": "/product", "destination": "/", "permanent": true }
]
}
```

- `/product` sendes til forsiden nå. **Når trynrth.com er oppe**, endres den til `https://trynrth.com`.
- Slett mappene `product/`, `work/`, `company/` og `contact/`. Videresendingene over tar over.
- Behold `rewrites` for `/investors/:path*`.

Den innebygde hash-videresendingen øverst i `index.html` skal oppdateres, siden gamle lenker peker til ankre som forsvinner:

```js
var moved = {
  "#services": "/ai-tjenester",
  "#contact": "#book",
  "#product": "#tjenester",
  "#work": "#tjenester",
  "#process": "#slik-jobber-vi",
  "#company": "/om-oss"
};
```

## 5. Språk og hreflang

- Norske sider: `<html lang="nb">`, `og:locale` = `nb_NO`.
- Engelske sider: `<html lang="en">`, `og:locale` = `en_GB`.
- Alle sider har tre `link rel="alternate"`:

```html
<link rel="alternate" hreflang="nb" href="https://nrth.no/ai-vurdering" />
<link rel="alternate" hreflang="en" href="https://nrth.no/en/ai-assessment" />
<link rel="alternate" hreflang="x-default" href="https://nrth.no/ai-vurdering" />
```

- `canonical` peker til siden selv, på `https://nrth.no` uten www og uten skråstrek til slutt.
- **Ingen automatisk videresending** basert på nettleserspråk. Det forvirrer søkemotorer og folk som vil lese norsk på en engelsk maskin.

## 6. Delte deler

Menyen, footeren og bookingseksjonen går igjen på 16 sider. Standard er statisk HTML uten byggesteg, som i dag: delene kopieres inn i hver fil. Lag én referansekopi av hver del i `partials/` (ikke publisert, se `.vercelignore`) og hold sidene like den.

Hvis dupliseringen blir et problem, er det greit å foreslå et lite Node-skript som setter sammen sidene før deploy. Det krever at Thomas godkjenner det først, siden det endrer hvordan siden bygges.
