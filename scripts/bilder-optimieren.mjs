// Erzeugt aus den Originalen in assets/originale/ die Web-Varianten in public/bilder/
// und schreibt das Bildverzeichnis data/bilder.json (Masse, Varianten).
// Aufruf: npm run bilder   (idempotent: public/bilder wird neu aufgebaut)
// Dateinamen tragen einen Inhalts-Hash, damit Browser nach Bildwechseln nichts Altes zeigen.
// Zuordnung id → Originaldatei: scripts/bilder-liste.json. Herkunft jeder Datei: assets/originale/HERKUNFT.md
// Es wird nie hochskaliert: die Quelle liefert nur kleine Banner (590 px), die Varianten bleiben ≤ Originalbreite.
import sharp from "sharp";
import { mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const WURZEL = path.resolve(import.meta.dirname, "..");
const QUELLE = path.join(WURZEL, "assets/originale");
const ZIEL = path.join(WURZEL, "public/bilder");
const BREITEN = [480, 960, 1600];
const BILDER = JSON.parse(await readFile(path.join(WURZEL, "scripts/bilder-liste.json"), "utf8"));

// Erst alle Quellen prüfen, in einen temporären Ordner rendern und zum Schluss atomar austauschen (kein halber Bestand bei Fehlern).
for (const [id, cfg] of Object.entries(BILDER)) {
  const meta = await sharp(path.join(QUELLE, cfg.datei)).metadata().catch(() => null);
  if (!meta?.width || !meta?.height) throw new Error(`Bild «${id}»: ${cfg.datei} fehlt oder ist nicht lesbar.`);
}
const TEMP = `${ZIEL}.neu`;
await rm(TEMP, { recursive: true, force: true });
await mkdir(TEMP, { recursive: true });
const verzeichnis = {};
for (const [id, cfg] of Object.entries(BILDER)) {
  const eingabe = sharp(path.join(QUELLE, cfg.datei), { animated: false }).rotate();
  const meta = await eingabe.metadata();
  const gewuenscht = cfg.breiten ?? BREITEN;
  const breiten = [...new Set(gewuenscht.map((b) => Math.min(b, meta.width)))];
  const quellen = [];
  for (const b of breiten) {
    let pipe = eingabe.clone().resize({ width: b, withoutEnlargement: true });
    pipe = cfg.format === "png" ? pipe.png({ compressionLevel: 9, palette: true }) : pipe.webp({ quality: 82 });
    const { data, info } = await pipe.toBuffer({ resolveWithObject: true });
    const hash = createHash("sha1").update(data).digest("hex").slice(0, 8);
    const dateiname = `${id}-${info.width}-${hash}.${cfg.format === "png" ? "png" : "webp"}`;
    await writeFile(path.join(TEMP, dateiname), data);
    quellen.push({ breite: info.width, url: `/bilder/${dateiname}` });
  }
  quellen.sort((a, b) => a.breite - b.breite);
  verzeichnis[id] = { id, original: `assets/originale/${cfg.datei}`, breite: meta.width, hoehe: meta.height, quellen };
}
await rm(ZIEL, { recursive: true, force: true });
await rename(TEMP, ZIEL);
await mkdir(path.join(WURZEL, "data"), { recursive: true });
await writeFile(path.join(WURZEL, "data/bilder.json"), JSON.stringify(verzeichnis, null, 2) + "\n");
console.log(`${Object.keys(verzeichnis).length} Bilder → data/bilder.json, ${(await readdir(ZIEL)).length} Dateien in public/bilder`);
