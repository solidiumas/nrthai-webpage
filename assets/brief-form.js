/* ============================================================================
   Nrth AI — brief form (vanilla progressive enhancement)
   The <form class="brief-form"> is a real form (method="POST"
   action="/api/inquiry") that works with no JS at all. When JS is present we
   intercept it, POST JSON to /api/inquiry, and swap the panel to a confirmation
   state — mirroring the v1 React InquiryForm behaviour.
   ========================================================================== */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  function enhance(form) {
    var panel = form.closest(".brief-panel") || form.parentElement;
    var submit = form.querySelector('[type="submit"]');
    var errorEl = form.querySelector(".brief-error");
    var statusEl = panel ? panel.querySelector("[data-brief-status]") : null;
    var pdot = panel ? panel.querySelector(".pdot") : null;
    var defaultLabel = submit ? submit.textContent : "Send brief →";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;
      if (submit) { submit.disabled = true; submit.textContent = "Sending…"; }

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });

      fetch(form.getAttribute("action") || "/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("send failed");
          if (panel) panel.classList.add("is-sent");
          if (statusEl) statusEl.textContent = "nrth.brief — sent";
          if (pdot) pdot.style.animation = "none";
        })
        .catch(function () {
          if (errorEl) errorEl.hidden = false;
        })
        .finally(function () {
          if (submit) { submit.disabled = false; submit.textContent = defaultLabel; }
        });
    });

    // "Send another →" — reset back to the editable form.
    var reset = panel ? panel.querySelector(".brief-reset") : null;
    if (reset) {
      reset.addEventListener("click", function () {
        if (panel) panel.classList.remove("is-sent");
        if (statusEl) statusEl.textContent = "nrth.brief — fill in";
        if (pdot) pdot.style.animation = "";
        form.reset();
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
