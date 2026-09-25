// Erzeugt data/seiten/*.json und data/leistungen.json aus den Quelldateien in werkzeuge/inhalte/seiten/.
// Aufruf: npm run inhalte   (danach npm run inhalt:pruefen)
import { readdirSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { keysZuruecksetzen } from "./pt.mjs";
const HIER = path.dirname(fileURLToPath(import.meta.url));
const ZIEL = process.env.ZIEL ?? path.join(HIER, "..", "..", "data");
mkdirSync(path.join(ZIEL, "seiten"), { recursive: true });
let n = 0;
const erzeugt = new Set();
for (const f of readdirSync(path.join(HIER, "seiten")).filter((x) => x.endsWith(".mjs")).sort()) {
  keysZuruecksetzen();
  const mod = await import(`file://${path.join(HIER, "seiten")}/${f}`);
  const inhalt = await mod.default;
  if (mod.art === "leistungen") { writeFileSync(path.join(ZIEL, "leistungen.json"), JSON.stringify(inhalt, null, 1) + "\n"); n++; continue; }
  for (const seite of [].concat(inhalt)) {
    writeFileSync(path.join(ZIEL, "seiten", `${seite.slug}.json`), JSON.stringify({ id: `seite-${seite.slug}`, ...seite }, null, 1) + "\n");
    erzeugt.add(`${seite.slug}.json`);
    n++;
  }
}
for (const alt of readdirSync(path.join(ZIEL, "seiten")).filter((f) => f.endsWith(".json") && !erzeugt.has(f))) {
  unlinkSync(path.join(ZIEL, "seiten", alt));
  console.log("veraltet entfernt:", alt);
}
console.log(n, "Dateien geschrieben");
