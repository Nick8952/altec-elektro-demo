// Kopiert die serverabhängigen Routen (Sanity Studio, Webhook, Vorschau) aus server-routes/app
// nach app/ (nur für Vercel). Für den statischen GitHub-Pages-Export werden sie entfernt.
// Kopieren ist idempotent; app/studio und app/api stehen in .gitignore.
import { cp, rm, access, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const wurzel = path.resolve(import.meta.dirname, "..");
const ziele = ["studio", "api"];
const entfernen = process.argv.includes("--entfernen");

for (const ordner of ziele) {
  const ziel = path.join(wurzel, "app", ordner);
  await rm(ziel, { recursive: true, force: true });
  if (entfernen) continue;
  const quelle = path.join(wurzel, "server-routes/app", ordner);
  await access(quelle);
  await cp(quelle, ziel, { recursive: true });
}
if (entfernen) {
  // Nach einem Vercel-Build verweist .next/types noch auf die kopierten Routen und bricht `tsc`; deshalb mit entfernen.
  for (const t of [".next/types", ".next/dev/types"]) await rm(path.join(wurzel, t), { recursive: true, force: true });
  const rest = (await readdir(path.join(wurzel, "app"))).filter((n) => ziele.includes(n));
  if (rest.length) throw new Error(`Server-Routen konnten nicht entfernt werden: ${rest.join(", ")}`);
} else {
  for (const ordner of ziele) await access(path.join(wurzel, "app", ordner));
}
// Route-Segment-Konfiguration muss statisch sein: dynamicParams je Betriebsart setzen (siehe Kommentar in der Seite).
const seite = path.join(wurzel, "app/[...pfad]/page.tsx");
const quelltext = await readFile(seite, "utf8");
const muster = /export const dynamicParams = (true|false); \/\/ vercel-routen/g;
const treffer = quelltext.match(muster)?.length ?? 0;
if (treffer !== 1) throw new Error(`app/[...pfad]/page.tsx: erwartet genau eine Zeile «export const dynamicParams = …; // vercel-routen», gefunden: ${treffer}.`);
const gesetzt = quelltext.replace(muster, `export const dynamicParams = ${entfernen ? "false" : "true"}; // vercel-routen`);
if (gesetzt !== quelltext) await writeFile(seite, gesetzt);
console.log(entfernen ? "Server-Routen entfernt, dynamicParams=false (statischer Export)." : "Server-Routen nach app/ kopiert, dynamicParams=true (Vercel).");
