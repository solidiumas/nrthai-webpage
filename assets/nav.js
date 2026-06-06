/* ============================================================================
   Nrth AI — mobile nav menu (vanilla)
   Toggles body.nav-open when the hamburger is tapped. CSS shows the .nav-right
   panel on small screens. Progressive enhancement: with no JS the menu simply
   isn't interactive (and all content is reachable by scrolling the landing).
   ========================================================================== */
(function () {
  "use strict";
  if (typeof document === "undefined") return;

  function close(btn) {
    document.body.classList.remove("nav-open");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function init() {
    var toggles = document.querySelectorAll(".nav-toggle");
    toggles.forEach(function (btn) {
      var nav = btn.closest(".site-nav");
      var panel = nav ? nav.querySelector(".nav-right") : null;

      btn.addEventListener("click", function () {
        var open = document.body.classList.toggle("nav-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });

      // Close after following a link in the menu.
      if (panel) {
        panel.querySelectorAll("a").forEach(function (a) {
          a.addEventListener("click", function () { close(btn); });
        });
      }
    });

    // Close on Escape.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        close(document.querySelector(".nav-toggle"));
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
