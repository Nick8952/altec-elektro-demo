// Funktionsprüfungen: kein Banner/kein Speicher (keine Dienste Dritter), Tastatur-Navigation (Skip-Link, Untermenü, Escape, Fokusring),
// mobiles Menü (<dialog>, Touch-Ziele, Escape), mobile Kontaktleiste (nicht auf /kontakt/), reduzierte Bewegung, mailto-Formular mit
// fiktiven Daten (kein Versand, Validierung), Telefon-Links, 404, JSON-LD, Partner-Links, Leistungs-Nachbarn.
import { writeFileSync, mkdirSync } from "node:fs";
import { BASE, browserStarten, externeAnfragen, warten } from "./chrome.mjs";
const ergebnisse = [];
const ok = (name, cond, detail = "") => { ergebnisse.push({ name, ok: !!cond, detail }); console.log(`${cond ? "✓" : "✗"} ${name}${detail ? " · " + detail : ""}`); };
const browser = await browserStarten();
async function frisch({ breite = 1440, reduziert = false } = {}) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: breite, height: 900 });
  if (reduziert) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  return { ctx, page, extern: externeAnfragen(page) };
}

// 1) Erstbesuch: keine externen Anfragen, kein Banner, kein Speicher
{
  const { ctx, page, extern } = await frisch();
  await page.goto(BASE + "/", { waitUntil: "networkidle0" }); await warten(500);
  ok("Erstbesuch: keine externen Anfragen", extern.length === 0, extern.join(","));
  ok("Erstbesuch: kein Cookie-Banner (keine Dienste Dritter)", (await page.$('[role="region"][aria-label="Datenschutz-Einstellungen"]')) === null);
  ok("Erstbesuch: kein Speicher, keine Cookies", (await page.evaluate(() => Object.keys(localStorage).length + Object.keys(sessionStorage).length)) === 0 && (await page.evaluate(() => document.cookie)) === "");
  ok("Kein Footer-Link zu Cookie-Einstellungen (nichts aktiv)", (await page.evaluate(() => [...document.querySelectorAll("footer button")].length)) === 0);
  ok("Demo: kein JSON-LD (erst mit INDEXIERUNG=1 auf der Kundendomain)", (await page.$('script[type="application/ld+json"]')) === null);
  const robots = await (await page.goto(BASE + "/robots.txt")).text();
  ok("Demo: robots.txt sperrt (Disallow: /)", /Disallow: \/\s*$/m.test(robots), robots.replaceAll("\n", " "));
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  ok("noindex auf der Startseite", await page.evaluate(() => document.querySelector("meta[name=robots]")?.content.includes("noindex")));
  await ctx.close();
}
// 2) Tastatur: Skip-Link, Untermenü, Pfeiltasten, Escape, Fokusring
{
  const { ctx, page } = await frisch();
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  await page.keyboard.press("Tab");
  ok("Tastatur: erster Tab = Skip-Link", await page.evaluate(() => document.activeElement?.textContent?.trim() === "Zum Inhalt springen"));
  await page.keyboard.press("Enter"); await warten(100);
  ok("Tastatur: Skip-Link springt zu #inhalt und setzt den Fokus auf <main>", await page.evaluate(() => location.hash === "#inhalt" && document.activeElement?.id === "inhalt"));
  let gefunden = false;
  await page.evaluate(() => document.querySelector("header a").focus());
  for (let i = 0; i < 8 && !gefunden; i++) { await page.keyboard.press("Tab"); gefunden = await page.evaluate(() => document.activeElement?.getAttribute("aria-expanded") !== null && document.activeElement?.tagName === "BUTTON"); }
  ok("Tastatur: Untermenü-Knopf mit aria-expanded erreichbar", gefunden);
  await page.keyboard.press("Enter"); await warten(150);
  ok("Tastatur: Enter öffnet Untermenü", await page.evaluate(() => document.activeElement?.getAttribute("aria-expanded") === "true"));
  await page.keyboard.press("ArrowDown"); await warten(100);
  ok("Tastatur: Pfeil nach unten fokussiert ersten Eintrag", await page.evaluate(() => document.activeElement?.tagName === "A" && !!document.activeElement.closest(".nav-untermenue")));
  await page.keyboard.press("Escape"); await warten(150);
  ok("Tastatur: Escape schliesst und gibt Fokus zurück", await page.evaluate(() => document.activeElement?.tagName === "BUTTON" && document.activeElement.getAttribute("aria-expanded") === "false"));
  const fokusSichtbar = await page.evaluate(() => { const st = getComputedStyle(document.activeElement); return st.outlineStyle !== "none" && parseInt(st.outlineWidth) >= 2; });
  ok("Tastatur: Fokusring sichtbar (Outline ≥ 2px)", fokusSichtbar);
  await page.goto(BASE + "/team/", { waitUntil: "networkidle0" });
  ok("Navigation: aria-current auf /team/", await page.evaluate(() => document.querySelector('header a[aria-current="page"]')?.textContent?.trim() === "Team"));
  await ctx.close();
}
// 3) Mobiles Menü + Kontaktleiste
{
  const { ctx, page } = await frisch({ breite: 360 });
  await page.goto(BASE + "/elektroinstallationen/beleuchtung/", { waitUntil: "networkidle0" });
  ok("Mobil: Kontaktleiste sichtbar mit Anrufen + Projekt anfragen", await page.evaluate(() => { const a = [...document.querySelectorAll("div.fixed a")].map((x) => x.textContent.trim()); return a.includes("Anrufen") && a.includes("Projekt anfragen"); }));
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" })); await warten(200);
  ok("Mobil: Kontaktleiste verdeckt Fusszeile nicht (Platzhalter)", await page.evaluate(() => { const f = document.querySelector("footer").getBoundingClientRect(); const l = document.querySelector("div.fixed").getBoundingClientRect(); return f.bottom <= l.top + 1; }));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  const knopf = await page.$('header button[aria-label="Menü"]');
  ok("Mobil: Menüknopf vorhanden (≥44px)", !!knopf && (await knopf.boundingBox()).height >= 44);
  await knopf.click(); await warten(300);
  ok("Mobil: Menü-Dialog offen, aktive Gruppe aufgeklappt, Fokus im Dialog", await page.evaluate(() => !!document.querySelector("dialog[open]") && !!document.querySelector("dialog[open] details[open]") && document.activeElement?.closest("dialog") !== null));
  const kleine = await page.evaluate(() => [...document.querySelectorAll("dialog[open] a, dialog[open] summary, dialog[open] button")].filter((e) => e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().height < 44).length);
  ok("Mobil: alle Menüziele ≥44px hoch", kleine === 0, `${kleine} zu klein`);
  await page.keyboard.press("Escape"); await warten(200);
  ok("Mobil: Escape schliesst Menü", !(await page.$("dialog[open]")));
  await page.goto(BASE + "/kontakt/", { waitUntil: "networkidle0" });
  ok("Mobil: keine Kontaktleiste auf /kontakt/ (Formular frei)", (await page.$("div.fixed")) === null);
  await ctx.close();
}
// 4) Bewegung
{
  const { ctx, page } = await frisch({ reduziert: true });
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  ok("Reduzierte Bewegung: keine Animationen, Inhalt sichtbar", await page.evaluate(() => { const a = document.querySelector(".auftauchen"); const h = document.querySelector(".hero-auftritt > *"); return getComputedStyle(a).animationName === "none" && getComputedStyle(h).animationName === "none" && getComputedStyle(a).opacity === "1"; }));
  await ctx.close();
  const n = await frisch();
  await n.page.goto(BASE + "/", { waitUntil: "networkidle0" });
  ok("Normale Bewegung: Scroll-Timeline aktiv", await n.page.evaluate(() => /view/.test(getComputedStyle(document.querySelector(".auftauchen")).animationTimeline)));
  await n.ctx.close();
}
// 5) mailto-Formular mit fiktiven Daten (kein Versand)
{
  const { ctx, page } = await frisch();
  const cdp = await page.createCDPSession();
  await cdp.send("Page.enable");
  const navigationen = [];
  cdp.on("Page.frameRequestedNavigation", (e) => navigationen.push(e.url));
  cdp.on("Page.frameScheduledNavigation", (e) => navigationen.push(e.url));
  await page.goto(BASE + "/kontakt/", { waitUntil: "networkidle0" });
  const form = await page.$("main form");
  ok("Formular: ohne action (kein Versand durch die Website), noscript-Link vorhanden", !!form && (await page.evaluate((f) => !f.hasAttribute("action") && !!f.querySelector("noscript"), form)));
  const felder = await page.evaluate(() => [...document.querySelectorAll('main form input, main form select, main form textarea')].map((e) => `${e.tagName.toLowerCase()}:${e.name}:${e.type || ""}`));
  ok("Formular: Name, E-Mail, Telefon, Anliegen, Nachricht; kein Upload", felder.join(" ") === "input:Name:text input:E-Mail:email input:Telefon:tel select:Anliegen:select-one textarea:Nachricht:textarea", felder.join(" "));
  ok("Formular: sichtbare Labels für alle Felder", await page.evaluate(() => [...document.querySelectorAll('main form input, main form select, main form textarea')].every((e) => document.querySelector(`label[for="${e.id}"]`)?.offsetHeight > 0)));
  await page.evaluate(() => document.querySelector('main form button[type="submit"]').click()); await warten(300);
  ok("Formular: leer absenden → Fehlermeldungen, Fokus im ersten Fehlerfeld, kein mailto", (await page.$$('form [role="alert"]')).length === 3 && (await page.evaluate(() => document.activeElement?.name === "Name")) && !navigationen.some((u) => u.startsWith("mailto:")));
  await page.type('main form input[name="Name"]', "Testperson Fiktiv");
  await page.type('main form input[name="E-Mail"]', "keine-adresse");
  await page.type('main form textarea', "Fiktive Testanfrage der QA. Bitte ignorieren.");
  await page.evaluate(() => document.querySelector('main form button[type="submit"]').click()); await warten(300);
  ok("Formular: ungültige E-Mail → genau eine Fehlermeldung, kein mailto", (await page.$$('form [role="alert"]')).length === 1 && !navigationen.some((u) => u.startsWith("mailto:")));
  await page.evaluate(() => { const i = document.querySelector('input[name="E-Mail"]'); i.value = ""; });
  await page.type('main form input[name="E-Mail"]', "test@example.invalid");
  await page.evaluate(() => document.querySelector('main form button[type="submit"]').click()); await warten(800);
  const mailto = navigationen.find((u) => u.startsWith("mailto:")) ?? "";
  ok("Formular: gültig absenden erzeugt mailto an info@altec-elektro.ch mit Inhalten", mailto.startsWith("mailto:info@altec-elektro.ch") && decodeURIComponent(mailto).includes("Testperson Fiktiv") && decodeURIComponent(mailto).includes("Fiktive Testanfrage"), decodeURIComponent(mailto).slice(0, 140).replaceAll("\n", " "));
  ok("Formular: Hinweis «E-Mail-Programm öffnet sich» sichtbar, keine falsche Versandbestätigung", await page.evaluate(() => { const s = document.querySelector('[role="status"]').textContent; return s.includes("E-Mail-Programm") && !/gesendet|versandt|erhalten/i.test(s); }));
  ok("Formular: nichts gespeichert, URL unverändert", (await page.evaluate(() => Object.keys(localStorage).length + Object.keys(sessionStorage).length)) === 0 && page.url().split("?")[0] === BASE + "/kontakt/" && !page.url().includes("Name="));
  await ctx.close();
}
// 6) Telefon-, E-Mail-, Partner-Links, Leistungs-Nachbarn, 404
{
  const { ctx, page } = await frisch();
  await page.goto(BASE + "/notfalldienst/", { waitUntil: "networkidle0" });
  const tels = await page.evaluate(() => [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute("href")));
  ok("Telefon-Links im E.164-Format (beide Notfallnummern)", tels.includes("tel:+41448400770") && tels.includes("tel:+41796538399") && tels.every((t) => /^tel:\+41\d{9}$/.test(t)), [...new Set(tels)].join(","));
  await page.goto(BASE + "/partner/", { waitUntil: "networkidle0" });
  const partner = await page.evaluate(() => [...document.querySelectorAll('main ul a[target="_blank"]')].map((a) => `${a.getAttribute("href")}|${a.rel}`));
  ok("Partner: genau 2 externe Links (Komma3, ATC) mit noopener", partner.length === 2 && partner.every((p) => p.includes("noopener")), partner.join(" "));
  ok("Partner: 6 Logos mit Alt-Text", (await page.evaluate(() => [...document.querySelectorAll("main ul img")].filter((i) => i.alt.trim()).length)) === 6);
  await page.goto(BASE + "/kontakt/", { waitUntil: "networkidle0" });
  ok("Kontakt: Routenlink extern, keine Karten-Einbettung", (await page.$("iframe")) === null && (await page.evaluate(() => !!document.querySelector('a[href^="https://www.google.com/maps"][target="_blank"]'))));
  ok("Kontakt: mailto-Link auf info@altec-elektro.ch", await page.evaluate(() => !!document.querySelector('main a[href="mailto:info@altec-elektro.ch"]')));
  await page.goto(BASE + "/elektroinstallationen/planung-und-projektierung/", { waitUntil: "networkidle0" });
  ok("Leistung: Nachbarn-Navigation (erste Leistung: Übersicht + nächste)", await page.evaluate(() => { const a = [...document.querySelectorAll('nav[aria-label="Weitere Leistungen"] a')].map((x) => x.getAttribute("href")); return a.length === 2 && a[0].endsWith("/elektroinstallationen/") && a[1].endsWith("/service-und-unterhalt/"); }));
  await page.goto(BASE + "/elektroinstallationen/sicherheit/", { waitUntil: "networkidle0" });
  ok("Leistung Sicherheit: Einsatzgebiete (Kantone) vorhanden", await page.evaluate(() => document.body.textContent.includes("Appenzell Innerrhoden") && document.body.textContent.includes("Gira")));
  const r = await page.goto(BASE + "/gibt-es-nicht/", { waitUntil: "networkidle0" });
  ok("404: Status 404 mit gestalteter Seite, noindex", r.status() === 404 && (await page.evaluate(() => !!document.querySelector("main h1") && !!document.querySelector("header") && document.querySelector("meta[name=robots]")?.content.includes("noindex"))));
  await ctx.close();
}
await browser.close();
mkdirSync("pruefung", { recursive: true });
writeFileSync("pruefung/funktionen.json", JSON.stringify(ergebnisse, null, 1));
console.log(`\n${ergebnisse.filter((e) => e.ok).length}/${ergebnisse.length} bestanden → pruefung/funktionen.json`);
process.exitCode = ergebnisse.every((e) => e.ok) ? 0 : 1;
