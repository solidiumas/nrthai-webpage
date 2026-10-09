/* ============================================================================
   Nrth AI — bookingseksjonen (vanilla progressiv forbedring)
   docs/revisjon-2026-10/06-booking-og-skjema.md
   - Forhåndsvelger tema: ?tema= eller ?topic= i URL-en, ellers data-default-topic
     på seksjonen (som også står som «checked» i HTML-en).
   - Er url satt i booking-config.js, vises kalenderen (iframe) i stedet for
     skjemaet. Tekstene til kalenderen står i <template> i HTML-en.
   Uten JavaScript vises skjemaet, som sendes som vanlig POST til /api/book.
   Sendingen med JavaScript gjøres av brief-form.js.
   ========================================================================== */
(function () {
  "use strict";
  if (typeof document === "undefined") return;

  // Samme tema på norsk og engelsk (06 §3), så ?tema=implementering virker på
  // engelske sider og ?topic=talk på norske.
  var PAIRS = [
    ["ai-vurdering", "ai-assessment"],
    ["implementering", "implementation"],
    ["ai-tjenester", "ai-services"],
    ["foredrag", "talk"],
    ["annet", "other"]
  ];

  function topicFromUrl() {
    try {
      var q = new URLSearchParams(window.location.search);
      return (q.get("tema") || q.get("topic") || "").trim().toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function radioFor(form, value) {
    if (!value) return null;
    var wanted = [value];
    PAIRS.forEach(function (pair) { if (pair.indexOf(value) !== -1) wanted = pair; });
    var radios = form.querySelectorAll('input[type="radio"][name="tema"]');
    for (var i = 0; i < radios.length; i++) {
      if (wanted.indexOf(radios[i].value) !== -1) return radios[i];
    }
    return null;
  }

  function preselect(form, section) {
    var radio = radioFor(form, topicFromUrl()) ||
      radioFor(form, section ? section.getAttribute("data-default-topic") : "");
    if (radio) radio.checked = true;
  }

  // Adressen fra booking-config.js. Tåler at hele iframe-koden er limt inn.
  function calendarUrl(cfg) {
    var raw = String((cfg && cfg.url) || "").trim();
    var src = raw.match(/\ssrc=["']([^"']+)["']/i);
    if (src) raw = src[1].replace(/&amp;/g, "&");
    if (!raw) return null;
    if (!/^[a-z][a-z0-9+.-]*:/i.test(raw)) raw = "https://" + raw;
    try {
      var url = new URL(raw);
      return /^https?:$/.test(url.protocol) ? url : null;
    } catch (e) {
      return null;
    }
  }

  function showCalendar(panel, form, cfg, base) {
    var tpl = panel.querySelector("template.booking-calendar-tpl");
    var request = form.querySelector(".booking-request");
    if (!tpl || !tpl.content || !request) return;
    var node = document.importNode(tpl.content, true).firstElementChild;
    var frame = node.querySelector("iframe");
    var link = node.querySelector("a");
    var notesPrefix = tpl.getAttribute("data-notes-prefix") || "";
    var cal = cfg.provider === "cal";
    link.target = "_blank";
    link.rel = "noopener";

    // Cal.com: valgt tema som notat (?notes=Tema:%20…), og embed=true i iframen
    function address(embed) {
      var url = new URL(base.href);
      if (cal) {
        if (embed && !url.searchParams.has("embed")) url.searchParams.set("embed", "true");
        var checked = form.querySelector('input[name="tema"]:checked');
        var label = checked ? checked.closest("label").textContent.trim() : "";
        if (label) url.searchParams.set("notes", notesPrefix + " " + label);
      }
      return url.href;
    }
    function update() {
      frame.src = address(true);
      link.href = address(false);
    }

    // Skjemafeltene trengs ikke når kalenderen vises
    request.hidden = true;
    request.querySelectorAll("input, select, textarea, button").forEach(function (el) { el.disabled = true; });
    form.querySelectorAll('input[name="tema"]').forEach(function (r) { r.required = false; });
    var mark = form.querySelector(".topic-picker .req");
    if (mark) mark.hidden = true;

    request.parentNode.insertBefore(node, request.nextSibling);
    panel.classList.add("is-calendar");
    update();
    if (cal) {
      form.addEventListener("change", function (e) {
        if (e.target && e.target.name === "tema") update();
      });
    }
  }

  function init() {
    var cfg = window.NRTH_BOOKING || {};
    var base = calendarUrl(cfg);
    var panels = document.querySelectorAll(".booking-panel");
    for (var i = 0; i < panels.length; i++) {
      var panel = panels[i];
      var form = panel.querySelector("form.booking-form");
      if (!form) continue;
      var section = panel.closest(".booking");
      preselect(form, section);
      // «Book et nytt møte →» nullstiller skjemaet. Velg temaet på nytt etterpå.
      form.addEventListener("reset", (function (f, s) {
        return function () { setTimeout(function () { preselect(f, s); }, 0); };
      })(form, section));
      if (base) showCalendar(panel, form, cfg, base);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
