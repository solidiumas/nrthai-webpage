/* ============================================================================
   Nrth AI — bookingverktøyet (docs/revisjon-2026-10/06-booking-og-skjema.md §2)
   Tom url: bookingseksjonen viser forespørselsskjemaet, som sendes til /api/book.
   Satt url: kalenderen fra verktøyet vises i stedet (iframe), med lenken
   «Åpne kalenderen i ny fane ↗» under.
     - Google Kalender-avtaleplan: lenken fra Del → Nettsted-innebygging
       (bare adressen i src="…", ikke hele iframe-koden).
     - Cal.com: https://cal.com/<bruker>/<type>. Valgt tema sendes med som notat.
   /assets/ mellomlagres i én time (vercel.json), så en endring her kan bruke
   opptil en time på å nå alle.
   ========================================================================== */
window.NRTH_BOOKING = {
  provider: "google",  // "google" | "cal". Valgt 21. oktober: Google Kalender-avtaleplan
  // Innebyggingsadressen (…/calendar/appointments/schedules/…?gv=true). Delelenken calendar.app.google/…
  // går til en side Google ikke lar vises i en iframe. Tom = forespørselsskjemaet vises.
  url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0gzsf4_MsId8WpPDCOGBxjGmTdKaoNi2DCyRfM6KdxJBkZgsn9c9rGwo3xUomrbNHqJLEIrZQZ?gv=true",
  durationMinutes: 30  // Møtelengden. Brikken «30 minutter» står i HTML og endres for hånd
};
