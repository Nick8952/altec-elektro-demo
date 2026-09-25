// Viewport-Screenshots in Scrollschritten (realistisch für Sticky-Kopfzeile, mobile Leiste und Scroll-Animationen).
// Aufruf: node werkzeuge/qa/screenshots.mjs  ·  SEITEN=/,/kontakt/  BREITEN=360,768,1440  FRAMES=6
import { mkdirSync } from "node:fs";
import { BASE, browserStarten, warten } from "./chrome.mjs";
const seiten = (process.env.SEITEN ?? "/,/elektroinstallationen/,/elektroinstallationen/beleuchtung/,/notfalldienst/,/kontakt/").split(",");
const breiten = (process.env.BREITEN ?? "360,768,1440").split(",").map(Number);
const maxFrames = Number(process.env.FRAMES ?? 6);
mkdirSync("pruefung/screenshots", { recursive: true });
const browser = await browserStarten();
const page = await browser.newPage();
for (const b of breiten) {
  const h = b < 700 ? 780 : 900;
  await page.setViewport({ width: b, height: h, deviceScaleFactor: 1 });
  for (const s of seiten) {
    await page.goto(BASE + s, { waitUntil: "networkidle0" });
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const frames = Math.min(maxFrames, Math.ceil(total / h));
    for (let i = 0; i < frames; i++) { await page.evaluate((y) => window.scrollTo(0, y), i * h); await warten(500); await page.screenshot({ path: `pruefung/screenshots/${s.replaceAll("/", "_") || "_"}-${b}-${i}.png` }); }
    console.log(`${b} ${s} ${frames} Bilder`);
  }
}
await browser.close();
