// Prüft den fertigen statischen Export (out/) so, wie er auf GitHub Pages liegt:
//  - jede erwartete Seite (data/seiten + Leistungen) hat eine index.html, 404.html vorhanden, keine leeren Seiten
//  - alle internen href/src beginnen mit dem Unterpfad und zeigen auf vorhandene Dateien (case-sensitiv wie GitHub Pages)
//  - keine externen Ressourcen (Skripte, Stylesheets, Bilder, Schriften, iframes) von fremden Hosts, auch keine preconnects
//  - jede Seite trägt <meta name="robots" content="noindex"> solange INDEXIERUNG nicht gesetzt ist, und keins mit INDEXIERUNG=1
//  - <html lang="de-CH">, Canonical absolut mit Unterpfad, Sprungziele vorhanden, JSON-LD parsebar
// Aufruf: npm run export:pruefen   (nach npm run build:pages)
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const WURZEL = path.resolve(import.meta.dirname, "..", "out");
const DATA = path.resolve(import.meta.dirname, "..", "data");
const basePath = (process.env.BASE_PATH ?? "/altec-elektro-demo").replace(/\/$/, "");
const indexierung = process.env.INDEXIERUNG === "1";
const siteUrl = (process.env.SITE_URL ?? `https://nick8952.github.io${basePath}`).replace(/\/$/, "");
const fehler = [];

async function htmlDateien(ordner) {
  const liste = [];
  for (const e of await readdir(ordner, { withFileTypes: true })) {
    const p = path.join(ordner, e.name);
    if (e.isDirectory()) liste.push(...(await htmlDateien(p)));
    else if (e.name.endsWith(".html")) liste.push(p);
  }
  return liste;
}
async function existiertGenau(p) {
  try {
    await stat(p);
    const eintraege = await readdir(path.dirname(p));
    return eintraege.includes(path.basename(p));
  } catch {
    return false;
  }
}

let seiten;
try {
  seiten = await htmlDateien(WURZEL);
} catch {
  console.error("✗ out/ fehlt: zuerst `npm run build:pages` ausführen.");
  process.exit(1);
}
if (!seiten.length) { console.error("✗ out/ enthält keine HTML-Dateien."); process.exit(1); }

const erwartet = ["index.html", "404.html", ".nojekyll", "robots.txt", "sitemap.xml"];
for (const f of (await readdir(path.join(DATA, "seiten"))).filter((x) => x.endsWith(".json"))) {
  const slug = f.replace(/\.json$/, "");
  if (slug !== "start") erwartet.push(`${slug}/index.html`);
}
for (const l of JSON.parse(await readFile(path.join(DATA, "leistungen.json"), "utf8"))) erwartet.push(`elektroinstallationen/${l.slug}/index.html`);
for (const s of erwartet) if (!(await existiertGenau(path.join(WURZEL, s)))) fehler.push(`Fehlt im Export: ${s}`);

{
  const robots = await readFile(path.join(WURZEL, "robots.txt"), "utf8").catch(() => "");
  if (!indexierung && !/Disallow:\s*\/\s*$/m.test(robots)) fehler.push("robots.txt: Demo muss «Disallow: /» enthalten");
  if (indexierung && (/Disallow:\s*\/\s*$/m.test(robots) || !/Sitemap:/.test(robots))) fehler.push("robots.txt: mit INDEXIERUNG=1 muss sie erlauben und die Sitemap nennen");
}
let geprueft = 0;
for (const datei of seiten) {
  let html = await readFile(datei, "utf8");
  const rel = path.relative(WURZEL, datei);
  const hatNoindex = /<meta name="robots" content="noindex/.test(html);
  const istFehlerseite = /^(404\.html|404\/index\.html|_not-found\/index\.html)$/.test(rel);
  if (!indexierung && !hatNoindex) fehler.push(`${rel}: kein noindex`);
  // Fehlerseiten bleiben auch nach dem Go-Live noindex (Next setzt das selbst; korrekt so).
  if (indexierung && hatNoindex && !istFehlerseite) fehler.push(`${rel}: noindex trotz INDEXIERUNG=1`);
  if (!/<html[^>]*\blang="de-CH"/.test(html)) fehler.push(`${rel}: <html lang> ist nicht "de-CH"`);
  const textLaenge = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").length;
  if (!istFehlerseite && textLaenge < 600) fehler.push(`${rel}: Seite wirkt leer (${textLaenge} Zeichen Text)`);
  if (!istFehlerseite) {
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const erwartetC = `${siteUrl}/${rel.replace(/index\.html$/, "")}`;
    if (!canonical) fehler.push(`${rel}: kein Canonical`);
    else if (canonical !== erwartetC) fehler.push(`${rel}: Canonical «${canonical}» ≠ erwartet «${erwartetC}»`);
    const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
    if (h1 !== 1) fehler.push(`${rel}: ${h1} h1-Elemente`);
    const titel = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    if (!titel.trim() || titel.length > 90) fehler.push(`${rel}: Titel leer oder zu lang («${titel}»)`);
    if ((titel.match(/Altec Elektro GmbH/g) ?? []).length > 1) fehler.push(`${rel}: Firmenname doppelt im Titel («${titel}»)`);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { fehler.push(`${rel}: JSON-LD nicht parsebar`); } }
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!ids.has(m[1])) fehler.push(`${rel}: Sprungziel #${m[1]} fehlt`);
  if (/<link rel="preconnect" href="(?!\/)/.test(html) || /<link rel="dns-prefetch"/.test(html)) fehler.push(`${rel}: externer preconnect/dns-prefetch`);
  html = html.replace(/<link rel="preconnect" href="\/"[^>]*>/g, "");
  for (const tag of html.matchAll(/<(script|link|img|source|video|audio|iframe|embed|object)\b[^>]*>/g)) {
    if (tag[1] === "link" && /rel="(canonical|alternate|next|prev)"/.test(tag[0])) continue;
    for (const attr of tag[0].matchAll(/(?:src|href|srcset|data)="([^"]+)"/g)) {
      for (const u of attr[1].split(",").map((s) => s.trim().split(" ")[0])) {
        if (/^(https?:)?\/\//.test(u)) fehler.push(`${rel}: externe Ressource in <${tag[1]}>: ${u}`);
      }
    }
  }
  for (const imp of html.matchAll(/@import\s+(?:url\()?["']?((?:https?:)?\/\/[^"')\s]+)/g)) fehler.push(`${rel}: externer CSS-Import ${imp[1]}`);
  for (const m of html.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) {
    for (const rohUrl of m[1].split(",").map((s) => s.trim().split(" ")[0])) {
      if (!rohUrl || rohUrl.startsWith("#") || /^(mailto:|tel:|data:)/.test(rohUrl)) continue;
      if (/^(https?:)?\/\//.test(rohUrl)) continue;
      const url = rohUrl.split("?")[0].split("#")[0];
      if (!url.startsWith(basePath + "/") && url !== basePath) { fehler.push(`${rel}: Pfad ohne Unterpfad: ${rohUrl}`); continue; }
      let ziel = path.join(WURZEL, decodeURIComponent(url.slice(basePath.length)));
      if (url.endsWith("/")) ziel = path.join(ziel, "index.html");
      if (!(await existiertGenau(ziel)) && !(await existiertGenau(ziel + ".html")) && !(await existiertGenau(ziel + ".txt"))) fehler.push(`${rel}: Ziel fehlt: ${rohUrl}`);
      geprueft++;
    }
  }
}
if (fehler.length) {
  console.error(`✗ ${fehler.length} Problem(e) im Export:\n` + [...new Set(fehler)].map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log(`✓ Export in Ordnung: ${seiten.length} HTML-Dateien, ${geprueft} interne Verweise unter ${basePath}, noindex ${indexierung ? "aus (Indexierung erlaubt)" : "auf allen Seiten"}.`);
