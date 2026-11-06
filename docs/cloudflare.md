# Flytting av nrth.no fra Vercel til Cloudflare

nrth.no kjører på Cloudflare Workers, i Workeren `nrthai-webpage`, som publiseres fra `main` med Workers Builds. Oppsettet for Vercel står fortsatt i repoet til Vercel er avviklet.

## Oppsettet

| Fil | Hva den gjør | Tilsvarer på Vercel |
|---|---|---|
| `wrangler.jsonc` | Worker `nrthai-webpage`. Navnet må være det samme som Workeren i Cloudflare, ellers stopper Workers Builds med feil. Statiske filer fra roten, `/om-oss/index.html` på `/om-oss` (`drop-trailing-slash`), `404.html` for ukjente adresser. Worker-koden kjøres bare for `/api/*`. | `cleanUrls`, `trailingSlash: false` |
| `_redirects` | Videresendingene | `redirects` i `vercel.json` |
| `_headers` | Sikkerhetsheadere og mellomlagring | `headers` i `vercel.json` |
| `.assetsignore` | Det som ikke publiseres, inkludert `api/`, `worker/` og `scripts/` | `.vercelignore` |
| `worker/index.js` | Sender `/api/book`, `/api/inquiry` og `/api/services` til funksjonene i `api/` og setter sikkerhetsheaderne | Funksjonene i `api/` |
| `worker/vercel.js` | Lager `req` og `res` som hos Vercel, så `api/` kjører uendret | |

Endres `vercel.json`, må `_redirects` eller `_headers` endres på samme måte, og motsatt.

## Lokalt

```bash
npm install
```

Legg `RESEND_API_KEY=…` i `.dev.vars` (ligger i `.gitignore`), og start:

```bash
npx wrangler dev
```

Siden svarer på http://localhost:8787.

## Før flyttingen

1. Opprett en Cloudflare-konto og legg til `nrth.no` (Add a domain, gratisplanen). Cloudflare leser inn DNS-postene.
2. Sammenlign postene med DNS-panelet hos dagens leverandør, post for post. Viktigst:
   - MX for contact@nrth.no
   - Resend-postene for nrth.no (DKIM på `resend._domainkey`, SPF og MX på `send`)
   - DMARC (`_dmarc`) og bekreftelsesposter (Google Search Console, Bing)

   E-post- og Resend-postene skal stå som «DNS only» (grå sky). Mangler noen av dem, slutter e-posten eller skjemaene å virke.
3. Workers & Pages → Create → Import a repository → `solidiumas/nrthai-webpage`. Produksjonsbranch `main`, ingen byggkommando, publiseringskommando `npx wrangler deploy`. Andre brancher får en egen forhåndsvisningsadresse.
4. Workerens Settings → Variables and Secrets: legg inn `RESEND_API_KEY` som Secret.
5. Test på workers.dev-adressen: forsiden og en side på hvert språk, `/services`, `/product`, en ukjent adresse (404-siden), og send ett skjema på norsk og ett på engelsk.

## Flyttingen

6. Bytt navnetjenere hos registraren til de to Cloudflare oppgir. Vent til Cloudflare melder at domenet er aktivt.
7. Slett den gamle posten som peker `nrth.no` til Vercel. Legg så til `nrth.no` under Workerens Settings → Domains & Routes → Custom Domain. Cloudflare lager posten og sertifikatet.
8. `www.nrth.no` til `nrth.no`. Det krever to ting i Cloudflare: en DNS-post som gjør at Cloudflare tar imot `www.nrth.no`, og en regel som sender videre.

   **a. DNS-posten.** DNS → Records. Finnes det en post med navnet `www` fra før (for eksempel en CNAME til Vercel), slett den. Velg så Add record:

   | Felt | Verdi |
   |---|---|
   | Type | `AAAA` |
   | Name | `www` |
   | IPv6 address | `100::` |
   | Proxy status | Proxied (oransje sky) |
   | TTL | Auto |
   | Comment | `Bare for videresending til nrth.no` |

   `100::` er en adresse som ikke fører noe sted. Cloudflare svarer selv med videresendingen, så forespørselen kommer aldri dit. Posten må være proxied. Med «DNS only» (grå sky) virker ikke regelen.

   **b. Regelen.** Rules → Overview → Create rule → Redirect Rule:

   | Felt | Verdi |
   |---|---|
   | Rule name | `www til nrth.no` |
   | When incoming requests match | Custom filter expression |
   | Field | `Hostname` |
   | Operator | `equals` |
   | Value | `www.nrth.no` |
   | Then, Type | `Dynamic` |
   | Expression | `concat("https://nrth.no", http.request.uri.path)` |
   | Status code | `308` |
   | Preserve query string | På |

   Under Edit expression skal det stå `(http.host eq "www.nrth.no")`. Velg Deploy.

   Regelen treffer både `http://` og `https://` og tar med stien og spørrestrengen. `https://www.nrth.no/om-oss?utm_source=x` går til `https://nrth.no/om-oss?utm_source=x`. 308 er det samme som Vercel brukte.

   **c. Unngå dette:**
   - Malen med `https://www.*` treffer bare `https://`. Bruk regelen over.
   - Ikke legg `www.nrth.no` til som Custom Domain på Workeren. Da svarer siden på to adresser i stedet for å sende videre.

   **d. Sjekk.** Sertifikatet for `www` lages automatisk (Universal SSL dekker `www`). Det kan ta opptil 30 minutter før `www.nrth.no` virker for alle, fordi svaret «finnes ikke» mellomlagres så lenge. Så:

   ```bash
   curl -sI "https://www.nrth.no/om-oss?utm_source=test"
   ```

   Svaret skal ha `HTTP/2 308` og `location: https://nrth.no/om-oss?utm_source=test`.

   ```bash
   curl -sIL "http://www.nrth.no/" | grep -iE "^(HTTP|location)"
   ```

   Siste `location` skal være `https://nrth.no/`, og siste svar `HTTP/2 200`.
9. SSL/TLS → Edge Certificates: slå på «Always Use HTTPS» og HSTS med max-age 2 år (63072000), som Vercel sender i dag.
10. Sjekk at `curl -sI https://nrth.no` viser `server: cloudflare`, at `https://www.nrth.no` videresender, og send et skjema.

## Samme dag

11. Personvernsiden (`personvern/` og `en/privacy/`) sier at Vercel drifter nettsiden og skjemaene og lagrer tekniske logger. Ny tekst skrives inn i `03-tekst-norsk.md` og `04-tekst-engelsk.md` først (CLAUDE.md regel 1), så i HTML.

## Etterpå

12. Når Cloudflare har kjørt en stund: fjern domenet og prosjektet i Vercel, slett `vercel.json`, Vercel-linjene i `.vercelignore`, `.vercelignore` selv og Vercel-linjene i CLAUDE.md.
13. Valgfritt: skriv om `api/` til `Request` og `Response`, så `worker/vercel.js` kan slettes.

## Forskjeller fra Vercel

- `/om-oss/` videresendes til `/om-oss` med 307 på Cloudflare, mot 308 på Vercel. Lenkene og canonical bruker adressen uten skråstrek, så dette treffer sjelden.
- `/services/` og de andre gamle adressene med skråstrek går rett til målet, ikke via `/services`.
- Ukjente adresser under `/api/` gir 404-siden i stedet for en tekstlinje.
- Pitch-deckene i roten (PDF) publiseres ikke, som på Vercel i dag.

## Kostnad

Gratisplanen holder. Forespørsler til statiske filer er gratis og uten tak. Worker-koden kjøres bare for `/api/*`, med 100 000 forespørsler per dag i gratisplanen.
