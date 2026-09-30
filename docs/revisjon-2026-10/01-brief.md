# 01 · Brief

## 1. Mål

nrth.no skal få norske bedrifter til å **booke et møte** med Nrth AI. Møtet handler om én av tre ting:

1. **AI-vurdering**: hvor AI gir mest, og hva som bør gjøres først.
2. **Implementering**: få AI i daglig bruk.
3. **AI-tjenester**: løsninger Nrth bygger, som AI-medarbeidere, skreddersydde løsninger og lokal AI-infrastruktur.

Resultatet kunden kjøper er **bedre drift, mer salg og mer effektivt arbeid**. Teksten skal si det rett ut.

Et møte booket er målet. En sendt forespørsel er et godt nok alternativ.

## 2. Målgruppe

Norske bedrifter, fra små bedrifter til store. Den som leser er daglig leder, økonomisjef, salgssjef eller en i ledergruppen. De er ikke tekniske, og mange har prøvd AI uten å få verdi av det.

## 3. Beslutninger (tatt)

| Område | Beslutning |
|---|---|
| Struktur | Forslag A · Tre dører: AI-vurdering, implementering, AI-tjenester |
| Hovedhandling | «Book et møte» i menyen, i heroen, på hver tjenesteside og nederst på alle sider |
| Sekundær handling | «Send en forespørsel» (dagens brief-skjema, oversatt). Ligger på `/book` under kalenderen |
| Foredrag og kurs | Informasjon: egen side `/foredrag-og-kurs` og en liten boks på forsiden. Ikke i menyen |
| Nrth OS | Ut av nrth.no. Én blokk på forsiden og Om oss, pluss lenke i footer til trynrth.com |
| Språk | Norsk på `/` (standard). Engelsk under `/en/`. Egne sider per språk med hreflang, **ikke** en språkbryter som skjuler tekst |
| Priser | I kroner, eks. mva. Synlige på tjenestesidene |
| Design | Dagens nrth.no. `assets/site.css` er fasit. Ingen nye farger eller fonter |
| Teknikk | Statisk HTML, vanilla JS, Vercel-funksjoner i `api/`, Resend for e-post. Samme som i dag |
| Investorsiden | Uendret i denne runden (etter at fristendringen er merget). Lenken i footer beholdes |

## 4. Hva som går ut

- Alt om «Nrth Agentic OS»: produktseksjonen, lagene, «Why it's different», veikartet, «Early access»-boksen og SoftwareApplication-JSON-LD.
- Tallene 72 %, 5× og 0 FTE, overalt: HTML, llms.txt, agent.json og JSON-LD. De kommer tilbake når det finnes kunder som kan stå bak dem.
- «Why now»-seksjonen. Det er investorspråk. Regnestykket fra den blir en egen blokk.
- Påstander om on-premise og at «data never leaves» knyttet til et produkt. Lokal AI-infrastruktur er fortsatt en **tjeneste**, og kan beskrives som det.
- Engelsk som standardspråk.
- Døde stubber: `product/`, `work/`, `company/` og `contact/` (erstattes av videresendinger, se `02`).

## 5. Priser (må bekreftes av Thomas)

Kroneprisene er hentet fra commit `3d11de7`, før tjenestene ble gjort om til USD (commit `3eed86b`, 26. mai 2026).

| Tjeneste | Dør | Leveranse | Pris |
|---|---|---|---|
| AI-kartlegging | AI-vurdering | 3–5 dager | Fra 35 000 kr |
| Strategisprint | AI-vurdering | 2 uker | Fra 75 000 kr |
| Ledersparring | AI-vurdering | Månedlig | Fra 25 000 kr per måned |
| Pilot i drift | Implementering | 2–3 uker | **[pris]** |
| Innføring av AI-verktøy | Implementering | **[varighet]** | **[pris]** |
| Drift og forbedring | Implementering | Løpende | Fra 5 000 kr per måned (driftsprisen for AI-medarbeidere) |
| AI-medarbeidere | AI-tjenester | 1–3 uker | Oppsett fra ca. 50 000 kr, drift fra 5 000 kr per måned |
| Skreddersydde løsninger | AI-tjenester | 4–16 uker | Fastpris. Små fra ca. 150 000 kr, mellomstore fra 400 000 kr, store fra 1 000 000 kr |
| Lokal AI-infrastruktur | AI-tjenester | 2–4 uker | Typisk 100 000 til 1 000 000+ kr |
| Foredrag og kurs | Informasjon | **[varighet]** | **[pris]** eller «etter avtale» |

«Fra-prisen» på dørkortene på forsiden er prisen for første steg i hver dør, ikke den laveste månedsprisen: AI-vurdering «Fra 35 000 kr» (kartlegging), Implementering «Fra [pris] kr» (pilot) og AI-tjenester «Fra 50 000 kr» (oppsett av AI-medarbeider).

## 6. Tone og språk

- **Norsk bokmål**, skrevet for norske lesere, ikke oversatt engelsk.
- Setningsstart med stor bokstav, resten små: «Book et møte», ikke «Book Et Møte».
- Korte setninger. Ingen utropstegn. Ingen emoji.
- Unngå: «revolusjonerende», «banebrytende», «superlading», «AI-drevet», «sømløs», «skreddersydde AI-reiser».
- Tall er konkrete: «3–5 dager», «fra 35 000 kr». Mellomrom som tusenskille, tankestrek i intervaller.
- «Vi» om Nrth AI, «dere» om kunden.
- Én hovedhandling per seksjon.

## 7. Ikke i denne runden

- Innholdssider og kundehistorier (kommer når det finnes kunder, se «C · Problemer vi løser» på lerretet).
- Chat eller salgsagent på siden. `/api/chat` fjernes fra manifestene.
- Flytting av investorsiden til trynrth.com.
- Nytt designsystem. Designsystem-pakken (Satoshi/Inter, avrundede hjørner) gjelder **ikke** nrth.no.
