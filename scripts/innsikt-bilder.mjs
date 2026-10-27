// Lager delingsbildet (1200×630) for hver artikkel i docs/innsikt/: innsikt/<slug>/og.png, i samme stil som og.svg.
// Skriver også innsikt/<slug>/og.json med teksten bildet viser, så scripts/innsikt.mjs kan si fra når den er utdatert.
// Trenger Playwright og Chromium, som ikke er med i repoet:
//   npm install --no-save playwright && npx playwright install chromium
//   node scripts/innsikt-bilder.mjs            alle artikler
//   node scripts/innsikt-bilder.mjs lokal-ai   bare én
// Satoshi (logoen) hentes fra Fontshare mens bildet lages. Lisensen tillater ikke filene i et offentlig repo.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const { chromium } = await import("playwright");
const NAVN = { "thomas-uthaug": "Thomas Uthaug", "simen-uthaug": "Simen Uthaug" };
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const font = (f) => readFileSync(join(ROOT, "assets/fonts", f)).toString("base64");
const kun = process.argv.slice(2);

const filer = readdirSync(join(ROOT, "docs/innsikt")).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const fil of filer) {
  const fm = {};
  for (const line of readFileSync(join(ROOT, "docs/innsikt", fil), "utf8").replace(/\r\n/g, "\n").split("\n---\n")[0].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  if (kun.length && !kun.includes(fm.slug)) continue;
  await page.setContent(`<!doctype html><html lang="nb"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@700,900&display=block">
<style>
@font-face { font-family: Figtree; font-weight: 300 900; src: url(data:font/woff2;base64,${font("figtree-latin-ext.woff2")}) format("woff2"); unicode-range: U+0100-02BA, U+1E00-1EFF; }
@font-face { font-family: Figtree; font-weight: 300 900; src: url(data:font/woff2;base64,${font("figtree-latin.woff2")}) format("woff2"); }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #fff; font-family: Figtree, sans-serif; color: #0a0a0a; position: relative; -webkit-font-smoothing: antialiased; }
.logo { position: absolute; left: 80px; top: 88px; display: flex; align-items: baseline; gap: 16px; font-family: Satoshi, sans-serif; }
.mark { font-weight: 900; font-size: 48px; color: #ff8a5b; letter-spacing: -1.92px; }
.word { font-weight: 700; font-size: 40px; letter-spacing: -0.8px; }
.kicker { position: absolute; left: 80px; top: 196px; font-size: 26px; font-weight: 600; color: #666; }
h1 { position: absolute; left: 76px; right: 80px; top: 242px; font-size: 72px; font-weight: 700; line-height: 1.02; letter-spacing: -2.9px; text-wrap: balance; }
.foot { position: absolute; left: 80px; right: 80px; bottom: 56px; display: flex; justify-content: space-between; font-size: 24px; color: #666; }
.line { position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: #ff8a5b; }
</style></head><body>
<div class="logo"><span class="mark">&lt;/&gt;</span><span class="word">Nrth AI</span></div>
<p class="kicker">Innsikt · ${esc(fm.tema)}</p>
<h1>${esc(fm.tittel)}</h1>
<div class="foot"><span>${NAVN[fm.forfatter]}</span><span>nrth.no/innsikt</span></div>
<div class="line"></div>
</body></html>`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const bunn = await page.evaluate(() => document.querySelector("h1").getBoundingClientRect().bottom);
  if (bunn > 540) console.warn(`${fm.slug}: tittelen går ned i bunnlinjen (${Math.round(bunn)} px). Kort den ned.`);
  mkdirSync(join(ROOT, "innsikt", fm.slug), { recursive: true });
  await page.screenshot({ path: join(ROOT, "innsikt", fm.slug, "og.png") });
  writeFileSync(join(ROOT, "innsikt", fm.slug, "og.json"), `${JSON.stringify({ tittel: fm.tittel, tema: fm.tema, forfatter: fm.forfatter }, null, 2)}\n`);
  console.log(`  skrev innsikt/${fm.slug}/og.png`);
}
await browser.close();
