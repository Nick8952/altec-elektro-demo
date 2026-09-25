// DOM-Audit aller Seiten in mehreren Breiten: Status, horizontaler Überlauf, zu kleine Touch-Ziele, Alt-Texte, h1,
// Überschriften-Reihenfolge, robots, externe Anfragen, Konsolenfehler, Speicher/Cookies, Kontrast der Textfarben (Stichprobe).
// Aufruf: node werkzeuge/qa/audit.mjs  (Vorschau-Server: npm run vorschau:pages)  ·  SEITEN=/,/kontakt/  BREITEN=360,1440  SCREENSHOTS=1
import { mkdirSync, writeFileSync } from "node:fs";
import { BASE, alleSeiten, browserStarten, externeAnfragen, warten } from "./chrome.mjs";
const seiten = process.env.SEITEN ? process.env.SEITEN.split(",") : [...alleSeiten(), "/diese-seite-gibt-es-nicht/"];
const breiten = (process.env.BREITEN ?? "360,390,768,1440").split(",").map(Number);
const screenshots = process.env.SCREENSHOTS === "1";
mkdirSync("pruefung/shots", { recursive: true });
const browser = await browserStarten();
const bericht = [];
for (const breite of breiten) {
  for (const seite of seiten) {
    const ctx = await browser.createBrowserContext();
    const p = await ctx.newPage();
    await p.setViewport({ width: breite, height: 900, deviceScaleFactor: 1 });
    const konsole = [];
    p.on("console", (m) => { if (m.type() === "error") konsole.push(m.text().slice(0, 160)); });
    p.on("pageerror", (e) => konsole.push("pageerror: " + e.message.slice(0, 160)));
    const extern = externeAnfragen(p);
    const resp = await p.goto(BASE + seite, { waitUntil: "networkidle0", timeout: 60000 });
    await warten(300);
    const audit = await p.evaluate(() => {
      const de = document.documentElement;
      const sichtbar = (el) => { const r = el.getBoundingClientRect(); const st = getComputedStyle(el); return r.width > 0 && r.height > 0 && st.visibility !== "hidden"; };
      const zuKlein = [...document.querySelectorAll("a,button,input,select,textarea,summary")].filter((el) => {
        if (!sichtbar(el)) return false;
        if (el.closest("dialog:not([open])")) return false;
        if (el.classList.contains("nur-sr")) return false;
        if (el.tagName === "A" && el.closest("p,li,dd,figcaption,blockquote,address") && !el.closest("nav,ul.grid,footer ul")) return false;
        const r = el.getBoundingClientRect();
        return r.width < 44 || r.height < 44;
      }).map((el) => `${el.tagName.toLowerCase()} «${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}» ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);
      const breit = [...document.querySelectorAll("body *")].filter((el) => { if (el.closest("dialog")) return false; const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > de.clientWidth + 1 || r.left < -1); }).slice(0, 5).map((el) => el.tagName.toLowerCase() + "." + [...el.classList].slice(0, 2).join("."));
      const hs = [...document.querySelectorAll("h1,h2,h3,h4")].filter((h) => !h.closest("dialog")).map((h) => Number(h.tagName[1]));
      let spruenge = 0; for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) spruenge++;
      return {
        overflow: de.scrollWidth > de.clientWidth + 1, breit, zuKlein, bilderOhneAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length,
        h1: document.querySelectorAll("main h1").length, spruenge, robots: document.querySelector("meta[name=robots]")?.content ?? null,
        title: document.title, lang: de.lang, storage: Object.keys(localStorage), cookies: document.cookie,
        skip: document.querySelector('a[href="#inhalt"]') !== null, main: !!document.querySelector("main#inhalt"),
      };
    });
    if (screenshots) await p.screenshot({ path: `pruefung/shots/${seite.replaceAll("/", "_") || "_"}-${breite}.png`, fullPage: true });
    const z = { status: resp?.status(), seite, breite, ...audit, extern: [...new Set(extern)], konsole: konsole.filter((k) => !(/status of 404/.test(k) && resp?.status() === 404)) };
    bericht.push(z);
    const probleme = [z.status !== 200 && !/gibt-es-nicht/.test(seite) ? `status=${z.status}` : "", z.overflow ? `ÜBERLAUF ${z.breit.join(",")}` : "", z.zuKlein.length ? `klein: ${z.zuKlein.slice(0, 3).join(" | ")}` : "", z.bilderOhneAlt ? `alt fehlt ${z.bilderOhneAlt}` : "", z.h1 !== 1 ? `h1=${z.h1}` : "", z.spruenge ? `Überschriften-Sprünge ${z.spruenge}` : "", z.extern.length ? `EXTERN ${z.extern.join(",")}` : "", z.konsole.length ? `KONSOLE ${z.konsole[0]}` : "", z.storage.length ? `storage ${z.storage}` : "", z.cookies ? "COOKIES" : "", !z.skip || !z.main ? "SKIP/MAIN fehlt" : ""].filter(Boolean);
    console.log(`${z.status} ${breite} ${seite} ${probleme.length ? "→ " + probleme.join(" · ") : "ok"}`);
    await ctx.close();
  }
}
await browser.close();
writeFileSync("pruefung/audit.json", JSON.stringify(bericht, null, 1));
const fehler = bericht.filter((z) => (z.status !== 200 && !/gibt-es-nicht/.test(z.seite)) || z.overflow || z.zuKlein.length || z.bilderOhneAlt || z.h1 !== 1 || z.spruenge || z.extern.length || z.konsole.length || z.cookies || !z.skip || !z.main);
console.log(`\n${bericht.length} Prüfungen, ${fehler.length} mit Befund → pruefung/audit.json`);
process.exitCode = fehler.length ? 1 : 0;
