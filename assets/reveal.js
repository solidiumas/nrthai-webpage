/* ============================================================================
   Nrth AI — bevegelse ved rulling (vanilla)
   - [data-reveal]: får .is-in når elementet kommer inn i bildet, og glir inn.
   - Slik jobber vi (forsiden): linjen mellom stegene fylles med rullingen, og
     sirkelen blir svart når steget er nådd (.is-active, --p).
   - Menyen får en kant når siden er rullet (.is-scrolled).
   Progressiv forbedring: uten JavaScript, eller med «redusert bevegelse»,
   står alt ferdig fra start. <head> fjerner html.js etter tre sekunder hvis
   denne filen ikke er lastet, så ingenting blir stående usynlig.
   ========================================================================== */
(function () {
  "use strict";
  if (typeof window === "undefined") return;
  window.nrthReveal = true;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    var steps = Array.prototype.slice.call(document.querySelectorAll(".process-step"));
    var nav = document.querySelector(".site-nav");

    // Avsløring
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });
      items.forEach(function (el) { io.observe(el); });
    }

    // Steg og meny
    function update() {
      if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
      if (!steps.length) return;

      var anchor = window.innerHeight * 0.6;
      var tops = steps.map(function (step) {
        return step.querySelector(".numeral").getBoundingClientRect().top;
      });
      steps.forEach(function (step, i) {
        var active = reduce || tops[i] < anchor;
        step.classList.toggle("is-active", active);
        if (i < steps.length - 1) {
          var p = reduce ? 1 : (anchor - tops[i]) / (tops[i + 1] - tops[i]);
          step.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(4));
        }
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; update(); });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
