/* ============================================================================
   Nrth AI — agent visualization (vanilla)
   A constellation of agent "steps" with signal pulses travelling between them.
   Vanilla port of the v1 React component (src/AgentVisual.jsx) — identical
   node graph, signals, and render loop. Progressive enhancement: with no JS the
   surrounding <canvas> is simply blank, the rest of the page is unaffected.

   Mounts onto every <canvas data-agent-visual>. Accent colour is read from the
   --accent CSS variable so it stays in sync with the design system.
   ========================================================================== */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  function accentColor() {
    var v = getComputedStyle(document.documentElement).getPropertyValue("--accent");
    return (v && v.trim()) || "#ff8a5b";
  }

  function mount(canvas) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var accent = accentColor();
    var W = 0, H = 0;

    function resize() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    var ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Directed graph of agent "steps" — roughly an arc, top-to-bottom flow.
    var nodes = [
      { id: "input",  label: "Request",    x: 0.5,  y: 0.08, r: 4 },
      { id: "parse",  label: "Understand", x: 0.25, y: 0.28, r: 5 },
      { id: "plan",   label: "Plan",       x: 0.75, y: 0.28, r: 5 },
      { id: "tool1",  label: "Search",     x: 0.12, y: 0.52, r: 3 },
      { id: "tool2",  label: "Database",   x: 0.35, y: 0.55, r: 3 },
      { id: "tool3",  label: "API",        x: 0.60, y: 0.55, r: 3 },
      { id: "tool4",  label: "Compute",    x: 0.85, y: 0.52, r: 3 },
      { id: "verify", label: "Verify",     x: 0.35, y: 0.78, r: 4 },
      { id: "refine", label: "Refine",     x: 0.65, y: 0.78, r: 4 },
      { id: "output", label: "Deliver",    x: 0.5,  y: 0.94, r: 6 }
    ];
    var edges = [
      ["input", "parse"], ["input", "plan"],
      ["parse", "tool1"], ["parse", "tool2"],
      ["plan", "tool3"], ["plan", "tool4"],
      ["tool1", "verify"], ["tool2", "verify"],
      ["tool3", "refine"], ["tool4", "refine"],
      ["verify", "output"], ["refine", "output"],
      ["parse", "plan"],     // cross-link
      ["verify", "refine"]   // feedback loop
    ];

    var nodeById = {};
    nodes.forEach(function (n) { nodeById[n.id] = n; });
    var getNode = function (id) { return nodeById[id]; };
    var toPx = function (n) { return { x: n.x * W, y: n.y * H }; };

    var signals = [];
    function spawnSignal() {
      var e = edges[(Math.random() * edges.length) | 0];
      signals.push({
        from: e[0], to: e[1], t: 0,
        speed: 0.006 + Math.random() * 0.012,
        hue: Math.random() < 0.88 ? "accent" : "warm"
      });
    }

    var spawnTimer = 0;
    var activeNode = null;
    var activeUntil = 0;
    var raf = 0;

    function render(tMs) {
      ctx.clearRect(0, 0, W, H);

      // subtle radial vignette
      var grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      grd.addColorStop(0, "rgba(111, 227, 255, 0.04)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // edges (static, faint)
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(245, 242, 236, 0.06)";
      for (var i = 0; i < edges.length; i++) {
        var na = toPx(getNode(edges[i][0])), nb = toPx(getNode(edges[i][1]));
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        var mx = (na.x + nb.x) / 2, my = (na.y + nb.y) / 2;
        var dx = nb.x - na.x, dy = nb.y - na.y;
        var nx = -dy, ny = dx;
        var len = Math.hypot(nx, ny) || 1;
        var curve = 14;
        ctx.quadraticCurveTo(mx + (nx / len) * curve, my + (ny / len) * curve, nb.x, nb.y);
        ctx.stroke();
      }

      // signals
      spawnTimer -= 16;
      if (spawnTimer <= 0) { spawnSignal(); spawnTimer = 180 + Math.random() * 260; }
      for (var j = signals.length - 1; j >= 0; j--) {
        var s = signals[j];
        s.t += s.speed;
        if (s.t >= 1) { activeNode = s.to; activeUntil = tMs + 600; signals.splice(j, 1); continue; }
        var a = toPx(getNode(s.from)), b = toPx(getNode(s.to));
        var smx = (a.x + b.x) / 2, smy = (a.y + b.y) / 2;
        var sdx = b.x - a.x, sdy = b.y - a.y;
        var snx = -sdy, sny = sdx;
        var slen = Math.hypot(snx, sny) || 1;
        var cv = 14;
        var cx = smx + (snx / slen) * cv, cy = smy + (sny / slen) * cv;
        var t = s.t;
        var x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cx + t * t * b.x;
        var y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cy + t * t * b.y;

        var col = s.hue === "accent" ? accent : "#ff8a5b";
        for (var k = 0; k < 6; k++) {
          var tt = Math.max(0, t - k * 0.025);
          var xx = (1 - tt) * (1 - tt) * a.x + 2 * (1 - tt) * tt * cx + tt * tt * b.x;
          var yy = (1 - tt) * (1 - tt) * a.y + 2 * (1 - tt) * tt * cy + tt * tt * b.y;
          ctx.beginPath();
          ctx.fillStyle = col;
          ctx.globalAlpha = (1 - k / 6) * 0.55;
          ctx.arc(xx, yy, 2.2 - k * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = 12;
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // nodes
      for (var m = 0; m < nodes.length; m++) {
        var n = nodes[m];
        var p = toPx(n);
        var isActive = activeNode === n.id && tMs < activeUntil;
        var pulse = isActive ? (1 - (activeUntil - tMs) / 600) : 0;

        if (isActive) {
          ctx.beginPath();
          ctx.strokeStyle = accent;
          ctx.globalAlpha = 1 - pulse;
          ctx.lineWidth = 1;
          ctx.arc(p.x, p.y, n.r + 4 + pulse * 18, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        ctx.beginPath();
        ctx.fillStyle = isActive ? accent : "rgba(245, 242, 236, 0.85)";
        ctx.arc(p.x, p.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isActive ? accent : "rgba(168, 164, 156, 0.75)";
        ctx.font = "500 10.5px Geist Mono, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(n.label.toUpperCase(), p.x, p.y + n.r + 6);
      }

      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);

    // Pause when the tab is hidden (saves cycles; resumes on return).
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { raf = requestAnimationFrame(render); }
    });
  }

  function init() {
    var canvases = document.querySelectorAll("canvas[data-agent-visual]");
    for (var i = 0; i < canvases.length; i++) mount(canvases[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
