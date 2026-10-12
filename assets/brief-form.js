/* ============================================================================
   Nrth AI — skjemaene (vanilla progressiv forbedring)
   <form class="brief-form"> er et vanlig skjema (method="POST") som virker uten
   JavaScript. Med JavaScript sendes det som JSON til action-adressen, og panelet
   får klassen is-sent, som viser kvitteringen. Brukes av bookingskjemaet
   (/api/book) og forespørselsskjemaet (/api/inquiry).
   Alle tekster står i HTML-en: «Sender …» i data-sending på knappen, feilmeldingen
   i .brief-error og kvitteringen i .brief-sent.
   ========================================================================== */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // Første felt man kan skrive i. I en radiogruppe: den valgte knappen.
  function firstField(form) {
    var el = form.querySelector('input:not([type="hidden"]):not([tabindex="-1"]):not([disabled]), select:not([disabled]), textarea:not([disabled])');
    if (el && el.type === "radio") {
      el = form.querySelector('input[type="radio"][name="' + el.name + '"]:checked') || el;
    }
    return el;
  }

  function enhance(form) {
    var panel = form.closest(".brief-panel") || form.parentElement;
    var submit = form.querySelector('[type="submit"]');
    var errorEl = form.querySelector(".brief-error");
    var sent = panel.querySelector(".brief-sent");
    var heading = sent ? sent.querySelector("h2, h3") : null;
    var pdot = panel.querySelector(".pdot");
    var label = submit ? submit.textContent : "";
    var sending = submit ? submit.getAttribute("data-sending") || label : "";
    var busy = false;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      busy = true;
      if (errorEl) errorEl.hidden = true;
      if (submit) { submit.disabled = true; submit.textContent = sending; }
      form.setAttribute("aria-busy", "true");

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });

      fetch(form.getAttribute("action"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("send failed");
          panel.classList.add("is-sent");
          if (pdot) pdot.style.animation = "none";
          // Skjemaet skjules. Flytt fokus til kvitteringen, så den blir lest opp.
          if (heading) heading.focus();
        })
        .catch(function () {
          if (errorEl) errorEl.hidden = false;
        })
        .then(function () {
          busy = false;
          form.removeAttribute("aria-busy");
          if (submit) { submit.disabled = false; submit.textContent = label; }
        });
    });

    // «Send en ny →» / «Book et nytt møte →»: tilbake til et tomt skjema
    var reset = sent ? sent.querySelector(".brief-reset") : null;
    if (reset) {
      reset.addEventListener("click", function () {
        form.reset();
        panel.classList.remove("is-sent");
        if (pdot) pdot.style.animation = "";
        // booking.js velger temaet på nytt etter reset. Vent til det er gjort.
        setTimeout(function () {
          var first = firstField(form);
          if (first) first.focus();
        }, 0);
      });
    }
  }

  function init() {
    var forms = document.querySelectorAll("form.brief-form");
    for (var i = 0; i < forms.length; i++) enhance(forms[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
