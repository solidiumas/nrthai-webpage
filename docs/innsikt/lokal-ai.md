---
slug: lokal-ai
nummer: 3
tittel: Lokal AI for bedrifter: egen maskinvare eller sky?
h1: Lokal AI: når bedriften bør kjøre AI på egen maskinvare, og når skyen holder
beskrivelse: Lokal AI betyr at modellen kjører på maskinvare dere eier eller leier alene. Når det lønner seg, hva det koster, og når EU-sky holder. Nrth AI, Bergen.
forfatter: simen-uthaug
tema: Lokal AI og datakontroll
publisert: 2026-10-27
oppdatert: 2026-10-27
relaterte: ai-og-personvern, hva-koster-et-ai-prosjekt
en_tittel: Local AI for businesses: your own hardware or the cloud?
en_beskrivelse: Local AI means the model runs on hardware you own or rent alone. When it pays off, what it costs, and when an EU cloud is enough.
---

Lokal AI betyr at språkmodellen kjører på maskinvare dere eier eller leier alene, slik at dokumenter, kundedata og spørsmål ikke sendes til OpenAI, Anthropic, Microsoft eller andre AI-leverandører. Det lønner seg for bedrifter med sensitive data, svært høyt og jevnt forbruk, eller krav fra kunder og tilsyn om at dataene skal behandles i Norge eller internt. For de fleste andre holder en modell som kjører i EU, med en avtale som sier at dataene ikke brukes til trening.

## Hva er lokal AI?

En åpen språkmodell (for eksempel fra Meta, Mistral eller Alibaba) installeres på en server med ett eller flere grafikkort. Bedriftens egne verktøy snakker med den serveren i stedet for med OpenAI, Anthropic eller Microsoft.

Kvaliteten på åpne modeller i 2026 er god nok for de fleste bedriftsoppgaver: oppsummering, utkast, klassifisering, søk i egne dokumenter. De er fortsatt bak de beste skymodellene på komplekse resonnementer og lange oppgaver. Det er den avveiningen dere faktisk gjør.

## Når lønner lokal AI seg?

| Situasjon | Lokal AI | EU-sky med databehandleravtale |
|---|---|---|
| Helse-, advokat-, regnskaps- eller forsvarsdata | Ja | Ofte, men sjekk kundens krav |
| Kunder krever at dataene behandles i Norge eller internt | Ja | Nei |
| Jevnt høyt forbruk, mange brukere hele dagen | Kan bli billigere over tid ved svært høyt volum | Kan bli dyrt over tid med de kraftigste modellene |
| Få brukere, sporadisk bruk | Nei, maskinvaren står stille | Ja |
| Behov for de kraftigste modellene | Nei | Ja |
| Ingen egen IT-drift | Krevende | Ja |

## Hva koster det?

En server som kjører en modell i 30–70 milliarder-parameterklassen for 10–50 samtidige brukere koster typisk fra 150 000 til 500 000 kroner i innkjøp, avhengig av grafikkort, pluss strøm og drift. Alternativet er å leie dedikert GPU i et norsk eller europeisk datasenter. Hos oss koster [lokal AI-infrastruktur](/ai-tjenester#lokal-ai) typisk 100 000 til 1 000 000+ kr eks. mva., inkludert maskinvare, avhengig av omfang, og tar to til fire uker. Nøyaktige tall avhenger av modell og antall brukere, og vi gir et regnestykke i første møte.

## Hva med personvern og regelverk?

Lokal AI løser ikke personvernet alene. Dere er fortsatt behandlingsansvarlig for dataene, og modellen må ikke få tilgang til mer enn den trenger. Men lokal AI fjerner det vanskeligste spørsmålet, nemlig overføring til tredjepart og til land utenfor EØS. For AI-forordningen er lokal AI i seg selv verken bedre eller verre; det er bruksområdet som avgjør risikoklassen.

## Et mellomalternativ: EU-hosting uten trening

For bedrifter som ikke har egen IT-drift, finnes et mellomalternativ: en tjeneste der modellene kjører i EU, med databehandleravtale, uten at dataene brukes til trening, og der dere kan velge kun europeiske leverandører. Det er slik [Nrth OS](https://trynrth.com/no/data) bygges, med mulighet til å koble på en egen lokal modell når dere er klare for det.

## Neste steg

[Book et møte](/book) hvis dere vil ha et konkret regnestykke for deres datamengde og brukere. Vi sier fra hvis skyen er det riktige svaret.
