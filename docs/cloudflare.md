# Flytting av nrth.no fra Vercel til Cloudflare

Koden er klar for Cloudflare Workers. Vercel drifter nrth.no til DNS flyttes. Oppsettene for Vercel og Cloudflare står side om side, så koden kan ligge på main før flyttingen.

## Oppsettet

| Fil | Hva den gjør | Tilsvarer på Vercel |
|---|---|---|
| `wrangler.jsonc` | Worker `nrth-no`. Statiske filer fra roten, `/om-oss/index.html` på `/om-oss` (`drop-trailing-slash`), `404.html` for ukjente adresser. Worker-koden kjøres bare for `/api/*`. | `cleanUrls`, `trailingSlash: false` |
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
8. `www.nrth.no` til `nrth.no`: la posten for `www` peke til `nrth.no` og sett den til proxied (oransje sky). Legg så til en Redirect Rule fra `www.nrth.no/*` til `https://nrth.no/${1}` med 308 og spørrestrengen bevart. Det er det Vercel gjør i dag.
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
