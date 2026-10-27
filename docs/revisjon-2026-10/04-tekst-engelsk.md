# 04 · Text, English

Same rules as `03`: `*word*` becomes `<em>`, `[brackets]` are for Thomas to fill in, and the text is final. All English pages live under `/en/`. Prices stay in Norwegian kroner, written «NOK 35,000».

The English site is for international visitors and Norwegian companies with English-speaking teams. It mirrors the Norwegian site page for page. It is written for English readers, not translated word for word.

---

## Shared parts

### Nav
- Links: AI assessment · Implementation · AI services · Insights · About (Insights added 27 October 2026)
- Language: `NO`
- Button: **Book a meeting →**
- Menu button aria-label: «Open menu»
- Logo aria-label: «Nrth AI, home»

### Booking section (`booking`, `id="book"`)
- Kicker: ✦ Book a meeting
- Heading: **Where can AI do the *most* for you?**
- Intro: Book a meeting with us. We look at how you work today, and where AI can increase sales, save time or raise quality.
- Label: In the meeting
- List:
  - We look at how you work today.
  - We point out where AI can increase sales or save time.
  - You leave with a proposed first step, with price and timeline.
- Chips: 30 minutes · In person in Norway or online
- Link below: Prefer to write? **Send a request →** (to `/en/book#write`)

### Nrth OS note (`os-note`)
- Label: Nrth OS
- Text: We also build Nrth OS: the workspace where companies put AI to work themselves.
- Link: trynrth.com ↗

### Talks and courses info box (`info-box`)
- Kicker: ✦ Talks and courses
- Title: We also give talks and courses on AI.
- Text: For leadership teams, staff and conferences.
- Link: **About talks and courses →** (to `/en/talks-and-courses`)

### Footer
- Links: AI assessment · Implementation · AI services · Talks and courses · Insights · About · FAQ · Privacy
- © 2026 Nrth AI AS · Bergen, Norway · Org. no. 937 872 038
- Nrth OS ↗ · LinkedIn ↗ (to `https://www.linkedin.com/company/nrth-ai/`) · Investors · Norsk
- Built by agents · ▲

---

## Home `/en`

**Title:** Nrth AI · We solve AI for businesses
**Description:** Nrth AI in Bergen helps companies sell more and work more efficiently with AI. AI assessment, implementation and AI services. Book a meeting.

### Hero
- Eyebrow: AI for businesses · Bergen, Norway
- H1: **We solve AI for *businesses*.**
- Subtag: ✦ Prices and timelines are on the site.
- Intro: We find where AI can make every employee better at their job, streamline and automate the work, and raise quality. Then we put it into daily use and build the AI services you need.
- Button: **Book a meeting →**
- Link: See what we do ↓

### Marquee
AI assessment ✦ Implementation ✦ AI services ✦ More sales ✦ Less manual work ✦ AI assistants ✦ Strategy sprints ✦ Local AI ✦

### 01 · What we do (`id="services"`)
- Kicker: ✦ 01 · What we do
- H2: **Three ways we *help*.**
- Intro: Everything starts with a meeting. That's where we find out which of the three you need first.

**Card 1** · 01 · AI assessment
- Title: Find out where AI does the most for you.
- Text: Before you spend money on tools, we find where AI actually increases sales or saves time in your business, and what to do first.
- List: AI assessment · 3–5 days / Strategy sprint · 2 weeks / Leadership advisory · monthly
- Price: From NOK 35,000
- Link: Read more → `/en/ai-assessment`

**Card 2** · 02 · Implementation
- Title: From plan to AI in daily use.
- Text: We put AI into production on a bounded part of the work, train the people who will use it, and follow up until it works.
- List: Pilot in production · 2–3 weeks / Rolling out AI tools · 2–4 weeks / Operations and improvement · ongoing
- Price: From NOK 30,000
- Link: Read more → `/en/implementation`

**Card 3** · 03 · AI services
- Title: Solutions that sell more and save time.
- Text: We build AI solutions around your processes and data: AI assistants that support your team and automate routine work, custom solutions, and AI on your own hardware.
- List: AI assistants · 1–3 weeks / Custom solutions · 4–16 weeks / Local AI infrastructure · 2–4 weeks
- Price: From NOK 50,000
- Link: Read more → `/en/ai-services`

Below the cards: button **Book a meeting →** and «Not sure where to start? We'll work that out in the meeting.»

### 02 · How we work (`id="how-we-work"`)
- Kicker: ✦ 02 · How we work
- H2: **Map. Pilot. *Run.***
- i · Step 1, Map · 1 week: We sit with your team, watch the work happen, and find the 3–5 places where AI changes the numbers.
- ii · Step 2, Pilot · 2–3 weeks: One solution in production on a bounded part of the work. Real data, real users, measurable results.
- iii · Step 3, Run · ongoing: We monitor, improve and expand. With logs, control, and a human in the loop where it matters.

### The math
- Kicker: ✦ The math
- Text: A skilled employee in Norway costs NOK 1–1.5 million a year. When AI supports your people and takes the routine work, your team can gain the capacity of one or more extra employees, and quality goes up. AI typically costs 20–40% of what one employee costs.
- Figure 1: NOK 1–1.5M · Employee per year
- Figure 2 (orange): 20–40% · Cost of AI

### 03 · About
- Kicker: ✦ 03 · About
- H2: **Two founders in *Bergen*.**
- Thomas Uthaug · Co-founder · business, product and delivery
  A decade across finance, quality leadership and technology delivery at Storebrand and Sopra Steria. MSc in Finance from NHH, with exchange studies at UC Berkeley and Copenhagen Business School. A career spent turning complex technology into bottom-line results.
  Tags: NHH MSc Finance · UC Berkeley · Storebrand · Sopra Steria
  Link: LinkedIn ↗ (`https://www.linkedin.com/in/thomas-uthaug`, aria-label `Thomas Uthaug on LinkedIn`)
- Simen Uthaug · Co-founder · technology and development
  BSc in Information Science from the University of Bergen and a master's degree in UX and development. Full-stack developer working in TypeScript, React, Python, API integration, databases and machine learning.
  Tags: UiB Information Science · TypeScript / React · Python / ML · Full-stack
  Link: LinkedIn ↗ (`https://www.linkedin.com/in/simen-uthaug`, aria-label `Simen Uthaug on LinkedIn`)
- Below: `os-note`

### 04 · Insights (`id="insights"`, `card-grid` with the three newest articles)
Added and approved by Thomas on 27 October 2026. Made by `scripts/innsikt.mjs` from `docs/innsikt/`.
- Kicker: 04 · Insights
- H2: **Articles on AI in *business*.**
- Cards: topic · tag «In Norwegian» · English title (links to the Norwegian article) · English description · author · date
- Button: All articles →
- Note: The articles are in Norwegian.

### Info box, talks and courses

### 04 · Book a meeting

---

## AI assessment `/en/ai-assessment`

**Title:** AI assessment and AI strategy for businesses · Nrth AI
**Description:** Find out where AI does the most for your business: a 3–5 day AI assessment, a 2-week strategy sprint and leadership advisory. From NOK 35,000.

### Page hero
- Kicker: ✦ AI assessment
- H1: **Find out where AI does the *most* for you.**
- Intro: Before you spend money on tools, we find where AI actually increases sales, saves time or raises quality in your business. And we tell you what shouldn't be solved with AI.
- Button: **Book a meeting →**

**01 · AI assessment** (`id="assessment"`)
- Text: A written overview of where AI does the most in your business, and what to do first.
- Included: Interviews with leadership and key people / Review of processes, systems and data / Assessment of where AI can increase sales or save time / A written roadmap with prioritised actions
- Delivery: 3–5 days
- Investment: From NOK 35,000
- Best fit: Companies that want to know where to start before they commit.

**02 · Strategy sprint** (`id="sprint"`)
- Text: Two intensive weeks that end in a plan you can carry out.
- Included: Implementation plan / A model of gains and costs / Prioritised scope for the first pilot / A recommendation on what to buy and what to build
- Delivery: 2 weeks
- Investment: From NOK 75,000
- Best fit: Leadership teams about to make a decision on AI who want solid ground to stand on.

**03 · Leadership advisory** (`id="advisory"`)
- Text: Ongoing advice for the leadership team while AI is being adopted.
- Included: Regular advisory sessions with the leadership team / Assessment of tools and vendors / Follow-up of priorities and gains
- Delivery: Monthly
- Investment: From NOK 25,000 per month
- Best fit: CEOs and leadership teams who want a partner that tells them what won't work, not just what will.

### Book a meeting (topic: AI assessment)

---

## Implementation `/en/implementation`

**Title:** AI implementation for businesses · Nrth AI
**Description:** We put AI into daily use: a 2–3 week pilot in production, AI tool rollout with training, and operations and improvement after.

### Page hero
- Kicker: ✦ Implementation
- H1: **From plan to AI in *daily use*.**
- Intro: Many AI projects stop after the demo. We put the solution into production on a bounded part of the work, train the people who will use it, and stay until it works.
- Button: **Book a meeting →**

**01 · Pilot in production** (`id="pilot"`)
- Text: One solution in production on real work, with a goal you can measure.
- Included: Choosing a bounded area with a clear goal / Setup connected to your systems and data / Testing with real users / Measurement against the goal, and a recommendation for the next step
- Delivery: 2–3 weeks
- Investment: From NOK 60,000
- Best fit: Companies that want to see results before they scale.

**02 · Rolling out AI tools** (`id="tools"`)
- Text: The right tool, set up properly, and people who actually use it.
- Included: Choosing tools by need and data requirements / Setup, access and usage guidelines / Training for the teams who will use it / Follow-up in the first weeks
- Delivery: 2–4 weeks
- Investment: From NOK 30,000
- Best fit: Companies that have bought, or are about to buy, AI tools and want value from them.

**03 · Operations and improvement** (`id="operations"`)
- Text: We monitor, improve and expand what is in production.
- Included: Monitoring and logs / Adjustments when the work changes / Expansion to new areas / A monthly review of results
- Delivery: Ongoing
- Investment: From NOK 5,000 per month
- Best fit: Anyone with AI in production who wants it to keep delivering.

### Book a meeting (topic: Implementation)

---

## AI services `/en/ai-services`

**Title:** AI services and AI assistants for businesses · Nrth AI
**Description:** AI assistants from NOK 50,000, custom AI solutions and local AI infrastructure on your own hardware. Prices and timelines on the site.

### Page hero
- Kicker: ✦ AI services
- H1: **Solutions that *sell more* and save time.**
- Intro: We build AI solutions around your processes and data. From a single AI assistant that supports your team and automates routine work, to custom systems and AI that runs on your own hardware.
- Button: **Book a meeting →**

**01 · AI assistants** (`id="ai-assistants"`)
- Text: An AI assistant works alongside your people in a specific workflow: document processing, customer service, analysis, internal knowledge or sales follow-up. It takes the routine work, so people get more time for the work that needs them, and quality goes up.
- Included: Mapping of the workflow and the people who use it / An AI assistant built around your processes / Integration with your existing tools and data / Deployment on local infrastructure when your data requires it / Ongoing improvement and monitoring
- Delivery: 1–3 weeks
- Investment: Setup from about NOK 50,000, operations from NOK 5,000 per month. Typically 20–40% of the cost of one employee.
- Best fit: Companies that want their team to get more done and deliver better work, especially where there is a lot of repetitive knowledge work or high volumes.

**02 · Custom solutions** (`id="custom"`)
- Text: When off-the-shelf tools don't fit, we design and build the solution that does. From first idea to solution in production.
- Included: Discovery and scoping / Architecture and solution design / Development, adaptation and integration / Testing, deployment and documentation / Further development when needed
- Delivery: 4–16 weeks
- Investment: Fixed price per project. Small from about NOK 150,000, mid-size from NOK 400,000, large from NOK 1,000,000.
- Best fit: Companies with a specific problem where existing tools fall short on data sensitivity, integration or domain.

**03 · Local AI infrastructure** (`id="local-ai"`)
- Text: AI that runs on your own hardware, inside your network. We choose the hardware, set up the models and secure the solution.
- Included: Hardware specification and purchasing support / Language model setup, open-source or licensed / Adaptation to your data / Security architecture and access control / Documentation, handover and training
- Delivery: 2–4 weeks
- Investment: Typically NOK 100,000 to 1,000,000+, depending on scale.
- Best fit: Regulated industries and companies that treat control over their own data as a strategic choice, not a box to tick.

### The math

### Book a meeting (topic: AI services)

---

## About `/en/about`

**Title:** About Nrth AI · AI company in Bergen, Norway
**Description:** Nrth AI AS is an AI company in Bergen, Norway, founded in 2026. We help businesses put AI to work.

### Page hero
- Kicker: ✦ About
- H1: **Two founders in *Bergen*.**
- Intro: Nrth AI AS was founded in 2026. We help businesses adopt AI in a way that delivers results.

### Team

### What to expect
- Kicker: ✦ What to expect
- H2: **How we *work*.**
1. **We run what we build.** The work doesn't end at handover.
2. **Prices and timelines are on the site.** No «contact us for a quote».
3. **We tell you when AI is the wrong tool.** That saves you more than it costs us.
4. **Measured on what matters.** Every solution gets a goal you can measure: more sales, fewer hours or better quality.

### Nrth OS note

### Contact
- Email: contact@nrth.no
- Location: Bergen, Norway
- Company: Nrth AI AS · Org. no. 937 872 038

### Book a meeting

---

## Book a meeting `/en/book`

**Title:** Book a meeting about AI · Nrth AI
**Description:** Book a meeting with Nrth AI about AI assessment, implementation or AI services. We reply within one business day.

### Page hero
- Kicker: ✦ Book a meeting
- H1: **Book a *meeting*.**
- Intro: We look at how you work, and where AI can increase sales, save time or raise quality. You leave with a proposed first step.

### Booking (topic from `?topic=` in the URL)

### Send a request (`id="write"`)
- Kicker: ✦ Prefer to write?
- H2: **Send a *request*.**
- Intro: Tell us what you want help with. A person on our team replies with a concrete proposal, usually within one business day.
- Panel head: nrth.request · fill in / request.v1
- Fields: Email * (you@company.com) / Company (Optional) / Role (Optional) / What do you want help with? * (A few sentences is fine: what work, what systems, what outcome.) / How urgent is it? (Exploring / This quarter / As soon as possible)
- Button: **Send request →** · Sending: Sending…
- Error: Something went wrong. Please try again, or email contact@nrth.no.
- Note: We reply from contact@nrth.no within one business day. Your details are not shared.
- Receipt: **Request sent. *We'll be in touch.*** / A person on the Nrth AI team replies within one business day from **contact@nrth.no**. / Send another →

---

## Talks and courses `/en/talks-and-courses`

**Title:** Talks and courses on AI for businesses · Nrth AI
**Description:** Nrth AI gives talks, company courses and workshops on AI for leadership teams, staff and conferences.

### Page hero
- Kicker: ✦ Talks and courses
- H1: **Talks and courses on *AI*.**
- Intro: We give talks and courses for leadership teams, staff and conferences. Practical, concrete and adapted to your industry.

### Formats
1. **Talks** · 45–60 min · For staff, customers or conferences. What AI can do today, and what it means for you.
2. **Company courses** · Half day · For teams who will use AI in their work, using their own tasks as practice material.
3. **Leadership workshops** · Full day · The leadership team finds the first places AI should go, and leaves with a prioritised list.

- Price: Talks from NOK 20,000, company courses from NOK 30,000 and workshops from NOK 45,000. Travel outside Bergen is extra.
- Button: **Ask about a talk →** (to `/en/book?topic=talk#book`)

### Book a meeting (topic: Talk or course)

---

## FAQ `/en/faq`

Added 21 October 2026. Mirror of `/sporsmal-og-svar`, with the same five questions as the English `FAQPage` in `07` §2.

**Title:** Questions and answers about AI for businesses · Nrth AI
**Description:** Answers to what businesses ask us most often: what we do, how we start, what it costs, talks and courses, and where we are.

### Page hero
- Kicker: FAQ
- H1: **Questions and *answers*.**
- Intro: What businesses ask us most often.

### Questions (`prose`, H2 per question)
1. **What does Nrth AI do?** We help businesses adopt AI: we assess where AI does the most, implement it, and build AI services such as AI assistants and custom solutions.
2. **How do we get started?** With a meeting. Book at nrth.no/en/book. Then we follow three steps: map (1 week), pilot (2–3 weeks) and run.
3. **What does it cost?** AI assessment from NOK 35,000. AI assistants from about NOK 50,000 in setup and NOK 5,000 per month in operations. Custom solutions from about NOK 150,000. All prices are on nrth.no.
4. **Do you give talks and courses?** Yes, for leadership teams, staff and conferences. See nrth.no/en/talks-and-courses.
5. **Where are you based?** In Bergen, Norway. We meet businesses in person across Norway, and online with clients abroad.

### Book a meeting (no topic preselected)

---

## Insights `/en/insights`

Added and approved by Thomas on 27 October 2026. Overview in English of the Norwegian articles on `/innsikt` (Thomas, 22 October 2026: English overview page, the articles stay Norwegian). The English title and description of each article are `en_tittel` and `en_beskrivelse` in `docs/innsikt/<slug>.md`.

**Title:** Insights on AI for businesses in Norway · Nrth AI
**Description:** Articles on AI in Norwegian businesses: costs, privacy, the EU AI Act, local AI, AI assistants and choosing tools. The articles are in Norwegian.

### Page hero
- Kicker: Insights
- H1: **Insights on AI for *Norwegian businesses*.**
- Intro: Articles on putting AI to work in a business: what it costs, what the rules say and where to start. The articles are in Norwegian.

### Articles (`card-grid--2`, newest first)
One card per article: topic · tag «In Norwegian» · English title (links to the Norwegian article, `hreflang="nb"`) · English description · author · date.
Topics: Getting started with AI · Local AI and data control · AI assistants · Rules and safety · Choosing tools

### Book a meeting (no topic preselected)

---

## Privacy `/en/privacy`

**Title:** Privacy · Nrth AI
**Description:** How Nrth AI AS handles the information you give us when you book a meeting or send a request.

Mirror of `/personvern`, in English. Written 21 October 2026, to be reviewed by a lawyer when needed.

### Controller
- Text: Nrth AI AS (org. no. 937 872 038) is responsible for the information we collect on nrth.no. Contact us at contact@nrth.no.

### What we collect
- List:
  - **When you request a meeting:** your name, email, company and what you choose or write about topic, goals, timing and meeting format.
  - **When you send a request:** your email, company, role, what you want help with and how urgent it is.
  - **When you book in the calendar:** your name, email and what you write in the booking. The calendar is provided by Google.
  - **When you visit the website:** technical information such as IP address, browser and which pages were opened. It ends up in the logs of the provider that runs the website.
- Text: We don't ask for sensitive information. Please don't write such information in the forms.

### Why, and on what basis
- List:
  - To reply to you, arrange meetings and prepare proposals. The legal basis is that you ask for it before a possible agreement (GDPR Art. 6(1)(b)), and our legitimate interest in responding to enquiries (Art. 6(1)(f)).
  - To run and secure the website. The legal basis is our legitimate interest (Art. 6(1)(f)).
  - If you become a customer, we process the information to fulfil the agreement (Art. 6(1)(b)) and our accounting obligations (Art. 6(1)(c)).
- Text: We don't use the information for marketing unless you ask for it, and we don't sell it.

### Who processes the information for us
- Text: These providers process information on our behalf and on our instructions:
- List:
  - **Vercel** runs the website and the forms.
  - **Resend** sends the email from the forms to us, and the receipt to you.
  - **Google** provides email and calendar (Google Workspace), including bookings.
- Text: The font in our logo is loaded from Fontshare. This gives Fontshare your IP address, as your browser always does when it loads content.

### Transfers outside the EU/EEA
- Text: Vercel, Resend and Google may process information in the USA. The transfer is based on the EU-U.S. Data Privacy Framework or on the EU standard contractual clauses.

### How long
- List:
  - Enquiries and bookings are deleted when the matter is closed, and at the latest 12 months after the last contact, unless you become a customer.
  - If you become a customer, we keep what the agreement requires. Accounting records are kept as long as the Norwegian Bookkeeping Act requires, currently five years.
  - Technical logs are kept only for a short period by Vercel.

### Cookies and tracking
- Text: nrth.no sets no cookies and uses no analytics or tracking tools. The booking calendar on the page comes from Google. When it loads, Google receives your IP address and may set its own cookies in the calendar. Google's privacy policy then applies.

### Your rights
- Text: You can ask for access to the information we hold about you, and ask us to correct or delete it. You can also ask us to restrict the processing, object to it and receive the information in a common format. Email contact@nrth.no, and we will reply within one month.
- Text: If you believe we are processing your information incorrectly, you can complain to the Norwegian Data Protection Authority (Datatilsynet). (Link to `https://www.datatilsynet.no/en/`.)

### Changes
- Text: We update this page when we change how we process information.
- Last updated: 22 October 2026
