// Live animated agent visualization — a constellation of "nodes" representing
// agent steps, with signal pulses traveling between them. Hypnotic, on-brand for "north".
const { useEffect, useRef, useState } = React;

function AgentVisual({ accent = "#6fe3ff" }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Build a directed graph of agent "steps"
    // Layout: roughly an arc, top-to-bottom flow
    const nodes = [
      { id: "input",   label: "Request",    x: 0.5,  y: 0.08, r: 4 },
      { id: "parse",   label: "Understand", x: 0.25, y: 0.28, r: 5 },
      { id: "plan",    label: "Plan",       x: 0.75, y: 0.28, r: 5 },
      { id: "tool1",   label: "Search",     x: 0.12, y: 0.52, r: 3 },
      { id: "tool2",   label: "Database",   x: 0.35, y: 0.55, r: 3 },
      { id: "tool3",   label: "API",        x: 0.60, y: 0.55, r: 3 },
      { id: "tool4",   label: "Compute",    x: 0.85, y: 0.52, r: 3 },
      { id: "verify",  label: "Verify",     x: 0.35, y: 0.78, r: 4 },
      { id: "refine",  label: "Refine",     x: 0.65, y: 0.78, r: 4 },
      { id: "output",  label: "Deliver",    x: 0.5,  y: 0.94, r: 6 },
    ];
    const edges = [
      ["input","parse"],["input","plan"],
      ["parse","tool1"],["parse","tool2"],
      ["plan","tool3"],["plan","tool4"],
      ["tool1","verify"],["tool2","verify"],
      ["tool3","refine"],["tool4","refine"],
      ["verify","output"],["refine","output"],
      ["parse","plan"], // cross-link
      ["verify","refine"], // feedback loop
    ];

    // Signals travel along edges
    const signals = [];
    const spawnSignal = () => {
      const e = edges[(Math.random() * edges.length) | 0];
      signals.push({
        from: e[0], to: e[1],
        t: 0,
        speed: 0.006 + Math.random() * 0.012,
        hue: Math.random() < 0.88 ? "accent" : "warm",
      });
    };

    let spawnTimer = 0;
    let activeNode = null;
    let activeUntil = 0;

    const getNode = (id) => nodes.find(n => n.id === id);
    const toPx = (n) => ({ x: n.x * W, y: n.y * H });

    const render = (tMs) => {
      ctx.clearRect(0, 0, W, H);

      // subtle radial vignette center
      const grd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.7);
      grd.addColorStop(0, "rgba(111, 227, 255, 0.04)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // edges (static, faint)
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(245, 242, 236, 0.06)";
      for (const [a, b] of edges) {
        const na = toPx(getNode(a)), nb = toPx(getNode(b));
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        // slight curve
        const mx = (na.x + nb.x) / 2;
        const my = (na.y + nb.y) / 2;
        const dx = nb.x - na.x, dy = nb.y - na.y;
        const nx = -dy, ny = dx;
        const len = Math.hypot(nx, ny) || 1;
        const curve = 14;
        const cx = mx + (nx / len) * curve;
        const cy = my + (ny / len) * curve;
        ctx.quadraticCurveTo(cx, cy, nb.x, nb.y);
        ctx.stroke();
      }

      // signals
      spawnTimer -= 16;
      if (spawnTimer <= 0) {
        spawnSignal();
        spawnTimer = 180 + Math.random() * 260;
      }
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        s.t += s.speed;
        if (s.t >= 1) {
          // arrival flash
          activeNode = s.to;
          activeUntil = tMs + 600;
          signals.splice(i, 1);
          continue;
        }
        const na = toPx(getNode(s.from));
        const nb = toPx(getNode(s.to));
        const mx = (na.x + nb.x) / 2;
        const my = (na.y + nb.y) / 2;
        const dx = nb.x - na.x, dy = nb.y - na.y;
        const nx = -dy, ny = dx;
        const len = Math.hypot(nx, ny) || 1;
        const curve = 14;
        const cx = mx + (nx / len) * curve;
        const cy = my + (ny / len) * curve;
        // quadratic bezier at t
        const t = s.t;
        const x = (1 - t) * (1 - t) * na.x + 2 * (1 - t) * t * cx + t * t * nb.x;
        const y = (1 - t) * (1 - t) * na.y + 2 * (1 - t) * t * cy + t * t * nb.y;

        // trail
        const col = s.hue === "accent" ? accent : "#ff8a5b";
        for (let k = 0; k < 6; k++) {
          const tt = Math.max(0, t - k * 0.025);
          const xx = (1 - tt) * (1 - tt) * na.x + 2 * (1 - tt) * tt * cx + tt * tt * nb.x;
          const yy = (1 - tt) * (1 - tt) * na.y + 2 * (1 - tt) * tt * cy + tt * tt * nb.y;
          ctx.beginPath();
          ctx.fillStyle = col;
          ctx.globalAlpha = (1 - k / 6) * 0.55;
          ctx.arc(xx, yy, 2.2 - k * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // head
        ctx.beginPath();
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = 12;
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // nodes
      for (const n of nodes) {
        const p = toPx(n);
        const isActive = activeNode === n.id && tMs < activeUntil;
        const pulse = isActive ? (1 - (activeUntil - tMs) / 600) : 0;

        // outer ring on active
        if (isActive) {
          ctx.beginPath();
          ctx.strokeStyle = accent;
          ctx.globalAlpha = 1 - pulse;
          ctx.lineWidth = 1;
          ctx.arc(p.x, p.y, n.r + 4 + pulse * 18, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // core
        ctx.beginPath();
        ctx.fillStyle = isActive ? accent : "rgba(245, 242, 236, 0.85)";
        ctx.arc(p.x, p.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        // label
        ctx.fillStyle = isActive ? accent : "rgba(168, 164, 156, 0.75)";
        ctx.font = "500 10.5px Geist Mono, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(n.label.toUpperCase(), p.x, p.y + n.r + 6);
      }

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [accent]);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: "1 / 1",
      maxWidth: 560,
      margin: "0 auto",
    }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      {/* corner ticks */}
      <Ticks />
      <div style={{
        position: "absolute",
        top: 14, left: 14,
        fontFamily: "var(--mono)",
        fontSize: 10.5,
        letterSpacing: "0.14em",
        color: "var(--fg-dim)",
        textTransform: "uppercase",
      }}>
        <span style={{ color: accent }}>●</span> agent.live
      </div>
      <div style={{
        position: "absolute",
        top: 14, right: 14,
        fontFamily: "var(--mono)",
        fontSize: 10.5,
        letterSpacing: "0.14em",
        color: "var(--fg-faint)",
        textTransform: "uppercase",
      }}>
        n°01 / run
      </div>
    </div>
  );
}

function Ticks() {
  const corner = {
    position: "absolute",
    width: 12, height: 12,
    borderColor: "var(--line-2)",
    borderStyle: "solid",
  };
  return (
    <>
      <div style={{ ...corner, top: 0, left: 0, borderWidth: "1px 0 0 1px" }} />
      <div style={{ ...corner, top: 0, right: 0, borderWidth: "1px 1px 0 0" }} />
      <div style={{ ...corner, bottom: 0, left: 0, borderWidth: "0 0 1px 1px" }} />
      <div style={{ ...corner, bottom: 0, right: 0, borderWidth: "0 1px 1px 0" }} />
    </>
  );
}

Object.assign(window, { AgentVisual });
