// The "world's best CTA": a real working AI agent embedded on the page.
// Visitor can describe their problem and the agent responds + captures contact info.
const { useEffect, useRef, useState } = React;

const SYSTEM_PROMPT = `You are an AI agent representing Nrth AI, a company that builds custom AI agents for B2B clients (companies, not consumers).

Your job on this landing page is to help a potential client explore whether Nrth AI can solve their problem, and guide them to leave their email/contact so the Nrth team can follow up.

Guidelines:
- Be warm, sharp, and concise. 1-3 short sentences per message. Never lecture.
- Ask ONE good question at a time about their business, problem, or what they want automated.
- Show genuine understanding — reflect back what you heard before proposing.
- After 2-3 exchanges, naturally suggest they share their email so a Nrth AI human can follow up with a tailored proposal. Don't be pushy.
- If they share an email, confirm it and thank them — say someone from Nrth AI will be in touch within 1 business day.
- Examples of agents Nrth builds: customer-support agents, sales-outreach agents, internal knowledge agents, invoice/ops automation agents, research agents.
- If asked about pricing, say it depends on scope but projects typically start at a small pilot (2–3 weeks) and scale from there.
- Never invent specifics about Nrth AI (team size, clients, locations). If pressed, say the human team will share those details on the follow-up.
- Respond in the same language the user writes in (English or Norwegian).

Keep replies short. This is a chat, not an essay.`;

function AgentChat({ accent = "#6fe3ff" }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi — I'm an AI agent built by Nrth AI. What's a problem in your business you'd want an agent to solve?" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [focused, setFocused] = useState(false);
  const scrollerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages, busy]);

  const suggestions = [
    "Automate customer support",
    "Qualify inbound leads",
    "Summarize our internal docs",
    "Something else →",
  ];

  const send = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      // Build message list for claude.complete
      const apiMessages = [
        ...next.map(m => ({ role: m.role, content: m.content })),
      ];
      const reply = await window.claude.complete({
        system: SYSTEM_PROMPT,
        messages: apiMessages,
      });
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages([...next, { role: "assistant", content: "I'm having trouble reaching my model right now. Email us directly at hello@nrth.ai and we'll follow up today." }]);
    }
    setBusy(false);
    // keep focus
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div role="region" aria-label="Live AI sales agent" data-action="invoke" data-action-id="chat" data-endpoint="/api/chat" style={{
      border: "1px solid var(--line-2)",
      background: "linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0))",
      padding: 0,
      display: "flex",
      flexDirection: "column",
      minHeight: 520,
    }}>
      {/* Header */}
      <div style={{
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
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 7, height: 7, borderRadius: 99,
            background: accent,
            boxShadow: `0 0 10px ${accent}`,
            animation: "pulse 2s ease-in-out infinite",
          }} />
          nrth.agent — live
        </div>
        <div style={{ color: "var(--fg-faint)" }}>chat.v1</div>
      </div>

      {/* Scrollable messages */}
      <div ref={scrollerRef} style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px 20px 8px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        maxHeight: 360,
      }}>
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} accent={accent}>{m.content}</Bubble>
        ))}
        {busy && <Bubble role="assistant" accent={accent} typing />}
      </div>

      {/* Suggestions (first message only) */}
      {messages.length === 1 && !busy && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8,
          padding: "8px 20px 16px",
        }}>
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => send(s.replace(" →", ""))}
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11.5,
                letterSpacing: "0.04em",
                color: "var(--fg-dim)",
                border: "1px solid var(--line-2)",
                padding: "7px 12px",
                borderRadius: 99,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = accent; e.currentTarget.style.borderColor = accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--fg-dim)"; e.currentTarget.style.borderColor = "var(--line-2)"; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        borderTop: "1px solid var(--line)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: focused ? "rgba(111, 227, 255, 0.02)" : "transparent",
        transition: "background 0.15s",
      }}>
        <span style={{ fontFamily: "var(--mono)", color: accent, fontSize: 14 }}>›</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => { if (e.key === "Enter") send(); }}
          placeholder="Type what you'd want an agent to do…"
          disabled={busy}
          style={{
            flex: 1,
            background: "transparent",
            border: 0,
            outline: 0,
            color: "var(--fg)",
            font: "inherit",
            fontSize: 15,
            padding: "6px 0",
          }}
        />
        <button
          onClick={() => send()}
          disabled={busy || !input.trim()}
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "8px 14px",
            border: `1px solid ${input.trim() && !busy ? accent : "var(--line-2)"}`,
            color: input.trim() && !busy ? accent : "var(--fg-faint)",
            transition: "all 0.15s",
            opacity: busy ? 0.5 : 1,
          }}
        >
          Send ↵
        </button>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes dot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.3; } 30% { transform: translateY(-4px); opacity: 1; } }
      `}</style>
    </div>
  );
}

function Bubble({ role, children, accent, typing }) {
  const isUser = role === "user";
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: isUser ? "flex-end" : "flex-start",
      gap: 4,
    }}>
      <div style={{
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: isUser ? "var(--fg-faint)" : accent,
        opacity: 0.8,
      }}>
        {isUser ? "you" : "nrth.agent"}
      </div>
      <div style={{
        maxWidth: "88%",
        padding: isUser ? "10px 14px" : "0",
        border: isUser ? "1px solid var(--line-2)" : "0",
        color: "var(--fg)",
        fontSize: 15,
        lineHeight: 1.5,
      }}>
        {typing ? <TypingDots accent={accent} /> : children}
      </div>
    </div>
  );
}

function TypingDots({ accent }) {
  const dot = {
    display: "inline-block",
    width: 6, height: 6,
    background: accent,
    borderRadius: 99,
    margin: "0 2px",
    animation: "dot 1.2s infinite ease-in-out",
  };
  return (
    <span>
      <span style={{ ...dot, animationDelay: "0s" }} />
      <span style={{ ...dot, animationDelay: "0.15s" }} />
      <span style={{ ...dot, animationDelay: "0.3s" }} />
    </span>
  );
}

Object.assign(window, { AgentChat });
