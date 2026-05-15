// Section components
const { useEffect, useState, useRef } = React;

function Nav({ accent, onCTA }) {
  return (
    <nav role="navigation" aria-label="Primary" data-section="nav" style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 32px",
      backdropFilter: "blur(14px) saturate(140%)",
      WebkitBackdropFilter: "blur(14px) saturate(140%)",
      background: "color-mix(in oklab, var(--bg) 72%, transparent)",
      borderBottom: "1px solid var(--line)",
    }}>
      <Logo accent={accent} />
      <div style={{
        display: "flex", gap: 28, alignItems: "center",
        fontFamily: "var(--mono)",
        fontSize: 12,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--fg-dim)",
      }}>
        <a href="#work" className="nav-link" data-action="navigate" data-target="#work">Work</a>
        <a href="#process" className="nav-link" data-action="navigate" data-target="#process">Process</a>
        <a href="#contact" className="nav-link" data-action="navigate" data-target="#contact">Contact</a>
        <button
          onClick={onCTA}
          data-action="invoke"
          data-action-id="submitInquiry"
          data-primary="true"
          aria-label="Send Nrth AI a discovery brief"
          style={{
            border: `1px solid ${accent}`,
            color: accent,
            padding: "8px 14px",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            transition: "all 0.18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = "#000"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = accent; }}
        >
          Send brief ↓
        </button>
      </div>
      <style>{`
        .nav-link { transition: color 0.15s; }
        .nav-link:hover { color: var(--fg); }
      `}</style>
    </nav>
  );
}

function Logo({ accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{
        fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif",
        fontWeight: 900,
        fontSize: 19,
        color: accent,
        letterSpacing: "-0.04em",
        lineHeight: 1,
      }}>
        &lt;/&gt;
      </span>
      <span style={{
        fontFamily: "Satoshi, var(--sans)",
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: "-0.02em",
        color: "var(--fg)",
      }}>
        Nrth AI
      </span>
    </div>
  );
}

function Hero({ accent, headline, sub, onCTA }) {
  return (
    <section id="hero" aria-label="Hero" data-section="hero" data-screen-label="Hero" style={{
      minHeight: "100vh",
      padding: "140px 32px 80px",
      display: "grid",
      gridTemplateColumns: "1.15fr 1fr",
      gap: 64,
      alignItems: "center",
      maxWidth: 1360,
      margin: "0 auto",
      position: "relative",
    }}>
      <div>
        <div style={{
          fontFamily: "var(--mono)",
          fontSize: 11.5,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--fg-dim)",
          marginBottom: 32,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: 99,
            background: accent,
            boxShadow: `0 0 10px ${accent}`,
          }} />
          AI Agents for the Nordic enterprise · est. 2025
        </div>

        <h1 itemProp="slogan" style={{
          fontFamily: "var(--serif)",
          fontWeight: 400,
          fontSize: "clamp(56px, 7.2vw, 112px)",
          lineHeight: 0.96,
          letterSpacing: "-0.02em",
          marginBottom: 28,
        }}>
          {headline.map((part, i) => (
            part.italic
              ? <em key={i} style={{ color: accent, fontStyle: "italic" }}>{part.text}</em>
              : <span key={i}>{part.text}</span>
          ))}
        </h1>

        <p style={{
          fontSize: 19,
          lineHeight: 1.5,
          color: "var(--fg-dim)",
          maxWidth: 520,
          marginBottom: 40,
        }}>
          {sub}
        </p>

        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={onCTA}
            data-action="invoke"
            data-action-id="submitInquiry"
            data-primary="true"
            aria-label="Send Nrth AI a discovery brief"
            style={{
              background: accent,
              color: "#000",
              padding: "16px 26px",
              fontFamily: "var(--mono)",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 500,
              transition: "transform 0.15s, box-shadow 0.15s",
              boxShadow: `0 0 0 0 ${accent}`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 12px 40px -8px ${accent}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 0 0 0 ${accent}`;
            }}
          >
            Send us a brief →
          </button>
          <a href="#work" data-action="navigate" data-target="#work" style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--fg-dim)",
            borderBottom: "1px solid var(--line-2)",
            paddingBottom: 3,
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--fg)"; e.currentTarget.style.borderColor = "var(--fg)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--fg-dim)"; e.currentTarget.style.borderColor = "var(--line-2)"; }}
          >
            See what we build ↓
          </a>
        </div>
      </div>

      <div>
        <AgentVisual accent={accent} />
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "absolute",
        bottom: 28, left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: "var(--fg-faint)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <span>Scroll</span>
        <span style={{
          width: 1, height: 28,
          background: "linear-gradient(180deg, var(--fg-faint), transparent)",
        }} />
      </div>
    </section>
  );
}

function Marquee({ accent }) {
  const items = [
    "Customer support agents",
    "Sales-outreach agents",
    "Research & intel agents",
    "Back-office automation",
    "Internal knowledge agents",
    "Voice & phone agents",
  ];
  return (
    <div style={{
      borderTop: "1px solid var(--line)",
      borderBottom: "1px solid var(--line)",
      padding: "18px 0",
      overflow: "hidden",
      background: "var(--bg-2)",
    }}>
      <div style={{
        display: "flex",
        gap: 48,
        whiteSpace: "nowrap",
        animation: "scroll 45s linear infinite",
        fontFamily: "var(--mono)",
        fontSize: 12,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--fg-dim)",
      }}>
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 48 }}>
            {t}
            <span style={{ color: accent }}>✦</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

function Work({ accent }) {
  const cases = [
    {
      n: "01",
      tag: "Support",
      serviceId: "customer_support_agents",
      title: "Tier-1 support, handled",
      body: "Agents that read your docs, ticket history, and CRM — resolve routine tickets in seconds, escalate the nuanced ones with full context.",
      metric: { value: "72%", label: "auto-resolved" },
    },
    {
      n: "02",
      tag: "Revenue",
      serviceId: "sales_outreach_agents",
      title: "Inbound qualified, outbound personalized",
      body: "Agents that research prospects, draft first-touch messages in your voice, and keep the pipeline warm while your team sleeps.",
      metric: { value: "5×", label: "SDR throughput" },
    },
    {
      n: "03",
      tag: "Ops",
      serviceId: "ops_automation_agents",
      title: "The invisible back-office",
      body: "Invoice matching, vendor comms, compliance checks, data reconciliation — the boring, expensive work becomes a background process.",
      metric: { value: "0 FTE", label: "added headcount" },
    },
  ];
  return (
    <section id="work" aria-label="Services we build" data-section="work" data-screen-label="Work" itemScope itemType="https://schema.org/OfferCatalog" style={{
      padding: "140px 32px",
      maxWidth: 1360,
      margin: "0 auto",
    }}>
      <SectionHeader label="01 · Work" title="Agents we build." accent={accent} />
      <div role="list" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 2,
        marginTop: 64,
        background: "var(--line)",
        border: "1px solid var(--line)",
      }}>
        {cases.map(c => <Case key={c.n} {...c} accent={accent} />)}
      </div>
    </section>
  );
}

function Case({ n, tag, title, body, metric, accent, serviceId }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      role="listitem"
      itemScope
      itemType="https://schema.org/Service"
      data-service-id={serviceId}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--bg)",
        padding: "40px 32px 36px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        minHeight: 380,
        position: "relative",
        transition: "background 0.25s",
        ...(hover ? { background: "var(--bg-2)" } : {}),
      }}
    >
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--fg-faint)",
      }}>
        <span>{n}</span>
        <span style={{ color: hover ? accent : "var(--fg-dim)", transition: "color 0.25s" }}>{tag}</span>
      </div>

      <h3 itemProp="name" style={{
        fontFamily: "var(--serif)",
        fontWeight: 400,
        fontSize: 36,
        lineHeight: 1.05,
        letterSpacing: "-0.01em",
      }}>
        {title}
      </h3>

      <p itemProp="description" style={{
        fontSize: 15,
        lineHeight: 1.55,
        color: "var(--fg-dim)",
        flex: 1,
      }}>
        {body}
      </p>

      <div data-metric={metric.label.replace(/\s+/g, "_")} data-value={metric.value} style={{
        display: "flex",
        alignItems: "baseline",
        gap: 10,
        paddingTop: 20,
        borderTop: "1px solid var(--line)",
      }}>
        <span style={{
          fontFamily: "var(--serif)",
          fontSize: 32,
          color: accent,
          letterSpacing: "-0.02em",
        }}>
          {metric.value}
        </span>
        <span style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--fg-faint)",
        }}>
          {metric.label}
        </span>
      </div>
    </div>
  );
}

function Process({ accent }) {
  const steps = [
    {
      n: "i",
      title: "Map",
      body: "One week. We sit with your team, shadow the work, and find the 3–5 places an agent will change the unit economics.",
    },
    {
      n: "ii",
      title: "Pilot",
      body: "Two to three weeks. A working agent in production against a bounded slice — real data, real users, measurable outcomes.",
    },
    {
      n: "iii",
      title: "Scale",
      body: "We harden, observe, and expand. Agents operate as named team members, with evals, guardrails, and a human in the loop where it matters.",
    },
  ];
  return (
    <section id="process" aria-label="How we work" data-section="process" data-screen-label="Process" style={{
      padding: "140px 32px",
      maxWidth: 1360,
      margin: "0 auto",
      borderTop: "1px solid var(--line)",
    }}>
      <SectionHeader label="02 · Process" title="Map. Pilot. Scale." accent={accent} />

      <ol role="list" style={{
        marginTop: 80,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1,
        background: "var(--line)",
        listStyle: "none",
        padding: 0,
      }}>
        {steps.map((s, i) => (
          <li key={s.n} role="listitem" data-step={i + 1} data-step-name={s.title} style={{
            background: "var(--bg)",
            padding: "40px 32px",
            minHeight: 260,
            position: "relative",
          }}>
            <div style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 64,
              color: accent,
              lineHeight: 1,
              marginBottom: 24,
            }}>
              {s.n}
            </div>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--fg-dim)",
              marginBottom: 14,
            }}>
              Step {i + 1} — {s.title}
            </div>
            <p style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: "var(--fg)",
              maxWidth: 340,
            }}>
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SectionHeader({ label, title, accent }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: 32,
      alignItems: "end",
      borderBottom: "1px solid var(--line)",
      paddingBottom: 32,
    }}>
      <div style={{
        fontFamily: "var(--mono)",
        fontSize: 11.5,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--fg-dim)",
      }}>
        <span style={{ color: accent }}>✦</span> {label}
      </div>
      <h2 style={{
        fontFamily: "var(--serif)",
        fontWeight: 400,
        fontSize: "clamp(48px, 5.6vw, 84px)",
        lineHeight: 0.98,
        letterSpacing: "-0.02em",
      }}>
        {title}
      </h2>
    </div>
  );
}

function CTA({ accent, ctaSectionRef, chatEnabled }) {
  return (
    <section id="contact" ref={ctaSectionRef} aria-label="Contact us" data-section="contact" data-screen-label="Contact" itemScope itemType="https://schema.org/ContactPoint" style={{
      padding: "140px 32px 80px",
      maxWidth: 1360,
      margin: "0 auto",
      borderTop: "1px solid var(--line)",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr",
        gap: 64,
        alignItems: "start",
      }}>
        <div style={{ position: "sticky", top: 120 }}>
          <div style={{
            fontFamily: "var(--mono)",
            fontSize: 11.5,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--fg-dim)",
            marginBottom: 28,
          }}>
            <span style={{ color: accent }}>✦</span> 03 · Contact
          </div>
          <h2 style={{
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: "clamp(56px, 6.4vw, 92px)",
            lineHeight: 0.98,
            letterSpacing: "-0.02em",
            marginBottom: 28,
          }}>
            Don't email us.<br/>
            <em style={{ color: accent, fontStyle: "italic" }}>Send a brief.</em>
          </h2>
          <p style={{
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--fg-dim)",
            maxWidth: 460,
            marginBottom: 28,
          }}>
            Tell us what you want automated. A human on our team replies with a tailored
            proposal — usually within one business day.
          </p>
          <div style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            letterSpacing: "0.1em",
            color: "var(--fg-faint)",
            display: "grid",
            gap: 6,
          }}>
            <div>Prefer plain email? <a href="mailto:hello@nrth.ai" data-action="email" itemProp="email" style={{ color: "var(--fg)", borderBottom: "1px solid var(--line-2)" }}>hello@nrth.ai</a></div>
            <div itemProp="areaServed">Oslo · Norway</div>
          </div>
        </div>

        {chatEnabled ? <AgentChat accent={accent} /> : <InquiryForm accent={accent} />}
      </div>
    </section>
  );
}

function Footer({ accent }) {
  return (
    <footer role="contentinfo" aria-label="Site footer" data-section="footer" style={{
      borderTop: "1px solid var(--line)",
      padding: "40px 32px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 32,
      maxWidth: 1360,
      margin: "0 auto",
      fontFamily: "var(--mono)",
      fontSize: 11.5,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--fg-faint)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Logo accent={accent} />
      </div>
      <div style={{ textAlign: "center" }}>© 2026 Nrth AI AS</div>
      <div style={{ textAlign: "right" }}>
        Built by agents · <span style={{ color: accent }}>▲</span>
      </div>
    </footer>
  );
}

// Discovery-brief form. Replaces AgentChat when the chat backend is off.
// Submission opens the user's mail client (mailto:) with a structured body.
// When a real form handler is wired (Formspree/Basin/own backend), swap the
// onSubmit body to fetch() against that endpoint.
function InquiryForm({ accent }) {
  const [sent, setSent] = useState(false);
  const formRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(formRef.current);
    const data = Object.fromEntries(fd.entries());
    const urgencyLabel = ({
      exploring: "Exploring",
      this_quarter: "This quarter",
      asap: "ASAP",
    })[data.urgency] || data.urgency;

    const subject = `Brief — ${data.company || data.email}`;
    const lines = [
      `From: ${data.email}`,
      data.company && `Company: ${data.company}`,
      data.role && `Role: ${data.role}`,
      `Urgency: ${urgencyLabel}`,
      "",
      "What they want automated:",
      data.problem,
    ].filter(Boolean).join("\n");

    window.location.href =
      `mailto:hello@nrth.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
    setSent(true);
  };

  const panelStyle = {
    border: "1px solid var(--line-2)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0))",
    display: "flex",
    flexDirection: "column",
    minHeight: 520,
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    borderBottom: "1px solid var(--line)",
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--fg-dim)",
  };

  if (sent) {
    return (
      <div role="region" aria-label="Brief sent" style={panelStyle}>
        <div style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: accent, boxShadow: `0 0 10px ${accent}` }} />
            nrth.brief — sent
          </div>
          <div style={{ color: "var(--fg-faint)" }}>brief.v1</div>
        </div>
        <div style={{
          flex: 1, padding: "56px 28px",
          display: "flex", flexDirection: "column", justifyContent: "center", gap: 22,
        }}>
          <h3 style={{
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: 36,
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}>
            Email client opened.<br/>
            <em style={{ color: accent, fontStyle: "italic" }}>Hit send to complete.</em>
          </h3>
          <p style={{ color: "var(--fg-dim)", fontSize: 16, lineHeight: 1.55, maxWidth: 420 }}>
            A human on the Nrth AI team replies within one business day from{" "}
            <strong style={{ color: "var(--fg)" }}>hello@nrth.ai</strong>.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            style={{
              alignSelf: "flex-start",
              border: `1px solid ${accent}`,
              color: accent,
              padding: "10px 16px",
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = "#000"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = accent; }}
          >
            Send another →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Submit a discovery brief"
      data-action="invoke"
      data-action-id="submitInquiry"
      data-endpoint="/api/inquiry"
      style={panelStyle}
    >
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 7, height: 7, borderRadius: 99,
            background: accent,
            boxShadow: `0 0 10px ${accent}`,
            animation: "pulse 2s ease-in-out infinite",
          }} />
          nrth.brief — fill in
        </div>
        <div style={{ color: "var(--fg-faint)" }}>brief.v1</div>
      </div>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="brief-form"
        method="POST"
        action="mailto:hello@nrth.ai"
        style={{
          padding: "22px 22px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <BriefField label="Email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
        <BriefField label="Company" name="company" type="text" autoComplete="organization" placeholder="Optional" />
        <BriefField label="Role" name="role" type="text" autoComplete="organization-title" placeholder="Optional" />
        <BriefField label="What would you want an agent to do?" name="problem" type="textarea" required rows={4} placeholder="A few sentences is fine — what work, what system, what outcome." />
        <BriefField label="Urgency" name="urgency" type="select" options={[
          ["exploring", "Exploring"],
          ["this_quarter", "This quarter"],
          ["asap", "ASAP"],
        ]} />

        <button
          type="submit"
          data-primary="true"
          style={{
            marginTop: 6,
            alignSelf: "flex-start",
            background: accent,
            color: "#000",
            padding: "14px 22px",
            fontFamily: "var(--mono)",
            fontSize: 11.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 12px 40px -8px ${accent}`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Send brief →
        </button>

        <p style={{
          marginTop: 4,
          fontFamily: "var(--mono)",
          fontSize: 10.5,
          letterSpacing: "0.1em",
          color: "var(--fg-faint)",
          lineHeight: 1.5,
        }}>
          We reply from hello@nrth.ai within one business day. Your data isn't shared.
        </p>
      </form>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .brief-form label > span.lbl {
          display: block;
          font-family: var(--mono);
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--fg-dim);
          margin-bottom: 6px;
        }
        .brief-form input,
        .brief-form textarea,
        .brief-form select {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid var(--line-2);
          color: var(--fg);
          font: inherit;
          font-size: 15px;
          padding: 8px 0 10px;
          outline: 0;
          transition: border-color 0.18s;
          font-family: var(--sans);
        }
        .brief-form textarea { resize: vertical; min-height: 88px; line-height: 1.5; }
        .brief-form select {
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          background-image: linear-gradient(45deg, transparent 50%, var(--fg-dim) 50%), linear-gradient(135deg, var(--fg-dim) 50%, transparent 50%);
          background-position: calc(100% - 14px) 16px, calc(100% - 9px) 16px;
          background-size: 5px 5px, 5px 5px;
          background-repeat: no-repeat;
          padding-right: 28px;
        }
        .brief-form input::placeholder,
        .brief-form textarea::placeholder { color: var(--fg-faint); }
        .brief-form input:focus,
        .brief-form textarea:focus,
        .brief-form select:focus { border-bottom-color: var(--accent); }
        .brief-form option { background: var(--bg-2); color: var(--fg); }
      `}</style>
    </div>
  );
}

function BriefField({ label, name, type, options, ...rest }) {
  let control;
  if (type === "textarea") {
    control = <textarea name={name} {...rest} />;
  } else if (type === "select") {
    control = (
      <select name={name} defaultValue={options[0][0]} {...rest}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    );
  } else {
    control = <input name={name} type={type} {...rest} />;
  }
  return (
    <label>
      <span className="lbl">{label}{rest.required ? <span style={{ color: "var(--accent)" }}> *</span> : null}</span>
      {control}
    </label>
  );
}

Object.assign(window, { Nav, Hero, Marquee, Work, Process, CTA, Footer, InquiryForm });
