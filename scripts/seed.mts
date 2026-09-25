/**
 * Importskript: lokale Demo-Inhalte (data/) und freigegebene Originalbilder (assets/originale/) → Sanity.
 *
 * NUR NACH DER SANITY-EINRICHTUNG AUSFÜHREN (docs/SANITY-VERCEL-EINRICHTUNG.md).
 * Braucht in .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.
 *
 *   npm run seed -- --probe   zeigt nur, was passieren würde (kein Schreibzugriff): EMPFOHLENER ERSTER SCHRITT
 *   npm run seed              legt fehlende Dokumente an, überschreibt NICHTS Vorhandenes
 *   npm run seed -- --force   ersetzt die vom Skript verwalteten Dokumente (nur die mit bekannten IDs)
 *
 * Dokument-IDs sind deterministisch (die `id`-Felder der JSON-Dateien), _key-Werte stammen unverändert aus den JSON-Dateien.
 * Sanity dedupliziert Assets anhand des Dateiinhalts; Wiederholungen legen keine Duplikate an.
 * Status: lokal nur mit --probe geprüft; der eigentliche Upload ist erst mit einem echten Projekt überprüfbar.
 */
import { createClient, type SanityClient } from "@sanity/client";
import nextEnv from "@next/env";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

nextEnv.loadEnvConfig(process.cwd());
const force = process.argv.includes("--force");
const probe = process.argv.includes("--probe");
const WURZEL = process.cwd();
const json = async <T,>(p: string): Promise<T> => JSON.parse(await readFile(path.join(WURZEL, "data", p), "utf8")) as T;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!probe && (!projectId || !token)) {
  console.error("Fehlend: NEXT_PUBLIC_SANITY_PROJECT_ID und/oder SANITY_API_WRITE_TOKEN in .env.local (siehe .env.example).");
  process.exit(1);
}
const client: SanityClient = createClient({ projectId: projectId ?? "probe", dataset, token, apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-09-25", useCdn: false });

type Roh = Record<string, unknown>;
type BildRef = { bild: string; alt: string };
const bilder = await json<Record<string, { id: string; original: string }>>("bilder.json");
const assetIds = new Map<string, string>();

async function hochladen(datei: string, kennung: string): Promise<string> {
  if (assetIds.has(kennung)) return assetIds.get(kennung)!;
  if (probe) {
    await readFile(datei);
    console.log(`  [probe] würde hochladen: ${path.relative(WURZEL, datei)}`);
    assetIds.set(kennung, `probe-${kennung}`);
    return `probe-${kennung}`;
  }
  const asset = await client.assets.upload("image", await readFile(datei), { filename: path.basename(datei), label: kennung });
  console.log(`  hochgeladen: ${path.relative(WURZEL, datei)} → ${asset._id}`);
  assetIds.set(kennung, asset._id);
  return asset._id;
}
async function bild(ref: BildRef | undefined) {
  if (!ref) return undefined;
  const eintrag = bilder[ref.bild];
  if (!eintrag) throw new Error(`Bild «${ref.bild}» fehlt in data/bilder.json`);
  return { _type: "bild", asset: { _type: "reference", _ref: await hochladen(path.join(WURZEL, eintrag.original), ref.bild) }, alt: ref.alt };
}
const link = (l: unknown) => (l && typeof l === "object" ? { _type: "link", ...(l as object) } : undefined);
const slug = (s: unknown) => (typeof s === "string" ? { _type: "slug", current: s } : undefined);
const mitKeys = (liste: unknown, praefix: string, typ: string): Roh[] => ((liste as Roh[]) ?? []).map((x, i) => ({ _type: typ, _key: (x._key as string) ?? `${praefix}-${i}`, ...x }));

async function bausteinUmwandeln(b: Roh) {
  const k: Roh = { ...b, anker: slug(b.anker) };
  for (const f of ["knopf", "zweiterKnopf"]) if (f in b) k[f] = link(b[f]);
  if ("bild" in b) k.bild = await bild(b.bild as BildRef | undefined);
  if (b._type === "spaltenBaustein") k.spalten = mitKeys(b.spalten, "spalte", "spalte");
  return k;
}

const dokumente: Roh[] = [];
const e = await json<Roh>("einstellungen.json");
dokumente.push({
  ...e, _id: "einstellungen", _type: "einstellungen",
  adresse: { _type: "adresse", ...(e.adresse as object) },
  notfall: { _type: "notfall", ...(e.notfall as object) },
  oeffnungszeiten: mitKeys(e.oeffnungszeiten, "oz", "oeffnungszeit").map((z) => ({ ...z, intervalle: mitKeys(z.intervalle, "iv", "intervall") })),
  logo: await bild(e.logo as BildRef | undefined), seoBild: await bild(e.seoBild as BildRef | undefined),
});
const t = await json<Roh>("texte.json");
const footer = t.footer as Roh;
dokumente.push({
  ...t, _id: "texte", _type: "texte",
  navigation: mitKeys(t.navigation, "nav", "navEintrag").map((n) => ({ ...n, kinder: mitKeys(n.kinder, "kind", "link") })),
  kopfKnopf: link(t.kopfKnopf),
  mobilLeiste: { ...(t.mobilLeiste as Roh), anfragen: link((t.mobilLeiste as Roh).anfragen) },
  footer: { ...footer, gruppen: mitKeys(footer.gruppen, "fg", "footerGruppe").map((g) => ({ ...g, links: mitKeys(g.links, "fl", "link") })), rechtslinks: mitKeys(footer.rechtslinks, "recht", "link") },
  formular: { ...(t.formular as Roh), betreffOptionen: mitKeys((t.formular as Roh).betreffOptionen, "opt", "option") },
  einwilligung: { ...(t.einwilligung as Roh), kategorien: mitKeys((t.einwilligung as Roh).kategorien, "kat", "kategorie") },
});
for (const l of await json<Roh[]>("leistungen.json")) dokumente.push({ ...l, _id: l.id as string, _type: "leistung", id: undefined, slug: slug(l.slug), bild: await bild(l.bild as BildRef | undefined) });
for (const p of await json<Roh[]>("team.json")) dokumente.push({ ...p, _id: p.id as string, _type: "teammitglied", id: undefined });
for (const p of await json<Roh[]>("partner.json")) dokumente.push({ ...p, _id: p.id as string, _type: "partner", id: undefined, logo: await bild(p.logo as BildRef) });
for (const f of (await readdir(path.join(WURZEL, "data/seiten"))).filter((x) => x.endsWith(".json"))) {
  const s = await json<Roh>(`seiten/${f}`);
  const hero = s.hero as Roh | undefined;
  dokumente.push({
    ...s, _id: s.id as string, _type: "seite", id: undefined, slug: slug(s.slug),
    hero: hero ? { ...hero, knopf: link(hero.knopf), zweiterKnopf: link(hero.zweiterKnopf), bild: await bild(hero.bild as BildRef | undefined) } : undefined,
    bausteine: await Promise.all(((s.bausteine as Roh[]) ?? []).map(bausteinUmwandeln)),
  });
}

console.log(`${dokumente.length} Dokumente vorbereitet${probe ? " (Probelauf, nichts geschrieben)" : ""}.`);
if (probe) { for (const d of dokumente) console.log(`  ${String(d._type).padEnd(14)} ${d._id}`); process.exit(0); }
const tx = client.transaction();
let angelegt = 0, uebersprungen = 0;
for (const d of dokumente) {
  const bereits = await client.getDocument(d._id as string).catch(() => undefined);
  if (bereits && !force) { uebersprungen++; continue; }
  tx.createOrReplace(d as { _id: string; _type: string });
  angelegt++;
}
await tx.commit();
console.log(`Fertig: ${angelegt} Dokument(e) geschrieben, ${uebersprungen} vorhanden gelassen${force ? " (force)" : ""}.`);
