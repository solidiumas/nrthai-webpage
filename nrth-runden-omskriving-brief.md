# Build-brief: Omskriving av «Runden»-seksjonen

**Side:** `nrth.no/investors`
**Seksjon:** `#round` («Runden» / «The round»)
**Mål:** Forenkle seksjonen for en ikke-finansiell nær krets. Vi skal lede med
«du blir medeier», oversette SLIP-sjargong til klartekst, og flytte selve
mekanikken til samtalen med Thomas og den signerte avtalen.

---

## Instruksjoner til Claude Code

1. **Følg det eksisterende tospråklige mønsteret i kodebasen.** NO- og EN-tekst
   ligger sammen og togglet av NO/EN-bryteren. Slott inn strengene under i samme
   struktur som resten av siden bruker (egne NO/EN-felt eller spans – bruk det
   som allerede finnes). Ikke hardkod sammenslåtte strenger hvis koden bruker
   separate felt.
2. **Behold `#round`-id-en og navigasjonslenken** («Runden / The round») uendret.
3. **Erstatt innholdet** i `#round`: overskrift, ingress, boksene og de tre
   stegene – med innholdet nedenfor.
4. **Reduser boksene fra seks til tre.** Fjern de fire tekniske boksene
   (Instrument/SLIP, Verditak, Rabatt, Tilgjengelig) og behold/erstatt med de tre
   nye under. Legg til én fremhevet linje under boksene (se «Fremhevet linje»).
5. **La følgende stå helt uendret:**
   - «Ta kontakt / Get in touch»-seksjonen nederst (her er ordet «SLIP» ok – det
     er i samtale-konteksten).
   - Risiko- og forbeholdsteksten nederst.
6. Legg til den lille «for de nysgjerrige»-linjen diskré nederst i `#round`
   (liten skrift, dempet), ikke som hovedbudskap.

---

## Innhold

### Navigasjonsetikett (uendret)
- NO: `Runden`
- EN: `The round`

### Overskrift
- NO: `Bli medeier fra start.`
- EN: `Become a co-owner from day one.`
- Sammenslått visning: `Bli medeier fra start. Become a co-owner from day one.`

### Ingress
- NO: `Du går inn med penger nå, mens selskapet er helt i startgropa, og blir
  medeier. Fordi du er tidlig ute – før selskapet har fått en fast prislapp –
  får du bedre vilkår enn de som kommer inn etter deg. Det praktiske håndteres
  gjennom en enkel og vanlig tidligfaseavtale, så du trenger ikke sette deg inn
  i detaljene. Thomas går gjennom alt sammen med deg.`
- EN: `You put in money now, while the company is just getting started, and
  become a co-owner. Because you're early – before the company has a fixed price
  tag – you get better terms than those who come in after you. The practical
  side runs through a simple, standard early-stage agreement, so you don't need
  to dig into the details. Thomas will walk through everything with you.`

### Boksene (3 stk)

**Boks 1**
- Etikett — NO: `Minste beløp` · EN: `Minimum`
- Verdi — NO: `25 000 kr` · EN: `NOK 25,000`
- Underetikett — NO: `Per investor` · EN: `Per investor`

**Boks 2**
- Etikett — NO: `Du blir medeier` · EN: `You become a co-owner`
- Verdi — NO: `Andel` · EN: `A stake`
- Underetikett — NO: `I selskapet` · EN: `In the company`

**Boks 3**
- Etikett — NO: `Frist` · EN: `Deadline`
- Verdi — NO: `1. aug 2026` · EN: `1 Aug 2026`
- Underetikett — NO: `For å være med` · EN: `To join`

### Fremhevet linje (under boksene)
- NO: `Som tidlig investor betaler du mindre per aksje enn de neste
  investorene, og vi har avtalt et tak på verdsettelsen som sikrer deg en god
  andel selv om selskapet vokser mye.`
- EN: `As an early investor you pay less per share than later investors, and
  we've agreed a ceiling on the valuation that secures you a solid stake even if
  the company grows a lot.`

### De tre stegene

**01**
- Tittel — NO: `Du går inn nå.` · EN: `You invest now.`
- Tekst — NO: `Pengene kommer rett inn i selskapet og hjelper oss å bygge
  ferdig produktet og lande de første kundene.` · EN: `The money goes straight
  into the company and helps us finish the product and land our first
  customers.`

**02**
- Tittel — NO: `Du sikrer deg en god posisjon.` · EN: `You secure a good
  position.`
- Tekst — NO: `Fordi du er tidlig ute, får du gunstigere vilkår enn investorene
  som kommer etter deg.` · EN: `Because you're early, you get better terms than
  the investors who come after you.`

**03**
- Tittel — NO: `Du blir medeier.` · EN: `You become a co-owner.`
- Tekst — NO: `Når vi senere henter inn mer kapital, gjøres din andel om til
  aksjer.` · EN: `When we later raise more capital, your stake converts into
  shares.`

### Liten «for de nysgjerrige»-linje (diskré nederst i seksjonen)
- NO: `Avtalen heter en SLIP – en standard norsk tidligfaseavtale. Vil du ha
  detaljene, spør Thomas.`
- EN: `The agreement is called a SLIP – a standard Norwegian early-stage
  instrument. Want the details? Just ask Thomas.`

---

## Også: oppdater hero-stripen

Hero-en har i dag en teknisk stripe:
`SLIP · verditak 10 MNOK · 35% rabatt · Minste beløp 25 000 kr · Frist 1. august 2026`

Erstatt med en enklere variant (3 elementer):
- NO: `Bli medeier · Minste beløp 25 000 kr · Frist 1. august 2026`
- EN: `Become a co-owner · Min. NOK 25,000 · Deadline 1 Aug 2026`

(Vurder også å endre hero-CTA-en «Se vilkårene / See the terms» til
«Bli med fra start / Join from day one» for å matche det nye språket.)

---

## Akseptkriterier

- [ ] Ordet «SLIP» vises ikke i overskrift, ingress, bokser eller steg i
      `#round` – kun i den lille «for de nysgjerrige»-linjen og i «Ta kontakt».
- [ ] Boksene er redusert til tre (beløp, medeier, frist).
- [ ] «Verditak» og «35 % rabatt» som egne tallbokser er fjernet; budskapet er
      i stedet dekket av den fremhevede linjen i klartekst.
- [ ] NO/EN-toggle fungerer på all ny tekst, likt resten av siden.
- [ ] Risiko-/forbeholdsteksten og «Ta kontakt»-seksjonen er uendret.
- [ ] Hero-stripen er forenklet til tre elementer.
- [ ] Ingen brutte ankerlenker (`#round` består).
