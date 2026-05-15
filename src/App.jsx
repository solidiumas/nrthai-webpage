// Main app
const { useRef } = React;

const ACCENT = "#ff8a5b";
const THEME = "dark";

// Headline copy. Swap parts here to A/B test wording.
const HEADLINE = {
  parts: [
    { text: "Your next " },
    { text: "hire", italic: true },
    { text: " isn't a person." },
  ],
  sub: "Nrth AI builds custom AI agents that handle the work your team shouldn't be doing. Production-grade, observed, and accountable — like the best employee you've ever had.",
};

// Feature flag: set to true when the chat backend (POST /api/chat) is wired up.
// When true: also re-add <script src="./src/AgentChat.jsx"> to index.html.
const CHAT_ENABLED = false;

document.documentElement.setAttribute("data-theme", THEME);
document.documentElement.style.setProperty("--accent", ACCENT);

function App() {
  const ctaSectionRef = useRef(null);

  const onCTA = () => {
    const el = document.getElementById("contact");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      <Nav accent={ACCENT} onCTA={onCTA} />
      <main>
        <Hero
          accent={ACCENT}
          headline={HEADLINE.parts}
          sub={HEADLINE.sub}
          onCTA={onCTA}
        />
        <Marquee accent={ACCENT} />
        <Work accent={ACCENT} />
        <Process accent={ACCENT} />
        <CTA accent={ACCENT} ctaSectionRef={ctaSectionRef} chatEnabled={CHAT_ENABLED} />
      </main>
      <Footer accent={ACCENT} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
