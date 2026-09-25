import "server-only";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { Baustein, Bild, Einstellungen, Inhaltsquelle, Leistung, Partner, Seite, SeitenTeaser, Teammitglied, Texte } from "./types";
import { BEKANNTE_BAUSTEINE, SYMBOLE } from "./types";

/**
 * Lokale Inhaltsquelle: liest die JSON-Dateien in data/.
 *
 * Aufbau (spiegelt die Sanity-Dokumente, gleiche Feldnamen, Rich Text als Portable Text):
 *   data/einstellungen.json   Unternehmensdaten (Singleton)
 *   data/texte.json           Navigation, Footer, Bedienelemente, Formular, Einwilligung
 *   data/bilder.json          von `npm run bilder` erzeugt
 *   data/leistungen.json, team.json, partner.json
 *   data/seiten/<slug>.json
 * Bilder werden per Kennung referenziert (`{ "bild": "hero-zuerich", "alt": "…" }`).
 */

const DATA = path.resolve(process.cwd(), "data");

interface BildEintrag { id: string; breite: number; hoehe: number; quellen: { breite: number; url: string }[] }
export interface BildReferenz { bild: string; alt: string }

const jsonCache = new Map<string, Promise<unknown>>();
/** JSON-Datei einmal pro Prozess lesen (der Build liest jede Datei sonst pro Seite und Baustein neu). */
function json<T>(datei: string): Promise<T> {
  let p = jsonCache.get(datei);
  if (!p) { p = readFile(path.join(DATA, datei), "utf8").then((s) => JSON.parse(s) as unknown); jsonCache.set(datei, p); }
  return p as Promise<T>;
}
const fehltNur = (err: unknown) => (err as NodeJS.ErrnoException)?.code === "ENOENT";

async function bild(ref: BildReferenz | undefined, kontext: string): Promise<Bild | undefined> {
  if (!ref) return undefined;
  const eintrag = (await json<Record<string, BildEintrag>>("bilder.json"))[ref.bild];
  if (!eintrag) throw new Error(`Bild «${ref.bild}» (${kontext}) fehlt in data/bilder.json: \`npm run bilder\` ausführen?`);
  if (typeof ref.alt !== "string") throw new Error(`Bild «${ref.bild}» (${kontext}) hat keinen Alt-Text.`);
  return { id: eintrag.id, alt: ref.alt, breite: eintrag.breite, hoehe: eintrag.hoehe, quellen: eintrag.quellen };
}

type MitBild<T> = Omit<T, "bild"> & { bild?: BildReferenz };
type RohEinstellungen = Omit<Einstellungen, "logo" | "seoBild"> & { logo?: BildReferenz; seoBild?: BildReferenz };
type RohLeistung = MitBild<Leistung>;
type RohPartner = Omit<Partner, "logo"> & { logo: BildReferenz };
type RohSeite = Omit<Seite, "bausteine" | "hero"> & { hero?: Omit<NonNullable<Seite["hero"]>, "bild"> & { bild?: BildReferenz }; bausteine: Record<string, unknown>[] };

const sortiert = <T extends { reihenfolge: number }>(l: T[]) => [...l].sort((a, b) => a.reihenfolge - b.reihenfolge);

async function leistungen(): Promise<Leistung[]> {
  const liste = await json<RohLeistung[]>("leistungen.json");
  return sortiert(
    await Promise.all(
      liste.map(async (l) => {
        if (!SYMBOLE.includes(l.symbol)) throw new Error(`Leistung «${l.id}»: Symbol «${l.symbol}» unbekannt.`);
        return { ...l, bild: await bild(l.bild, `Leistung ${l.id}`) };
      }),
    ),
  );
}
async function team(): Promise<Teammitglied[]> {
  return sortiert(await json<Teammitglied[]>("team.json"));
}
async function partner(): Promise<Partner[]> {
  const liste = await json<RohPartner[]>("partner.json");
  return sortiert(await Promise.all(liste.map(async (p) => ({ ...p, logo: (await bild(p.logo, `Partner ${p.id}`))! }))));
}
async function alleSeiten(): Promise<SeitenTeaser[]> {
  const liste: SeitenTeaser[] = [];
  for (const d of (await readdir(path.join(DATA, "seiten"))).filter((f) => f.endsWith(".json")).sort()) {
    const s = await json<RohSeite>(`seiten/${d}`);
    if (s.slug !== d.replace(/\.json$/, "")) throw new Error(`data/seiten/${d}: Slug «${s.slug}» passt nicht zum Dateinamen.`);
    liste.push({ slug: s.slug, titel: s.titel, art: s.art, teaser: s.teaser });
  }
  return liste;
}

async function baustein(roh: Record<string, unknown>, seite: string): Promise<Baustein> {
  const ort = `Seite ${seite}, Baustein ${roh._key}`;
  const mk = (o: Record<string, unknown>): Baustein => ({ ...roh, ...o }) as unknown as Baustein;
  switch (roh._type) {
    case "textBaustein":
      return mk({ bild: await bild(roh.bild as BildReferenz | undefined, ort) });
    case "leistungenBaustein":
      return mk({ leistungen: await leistungen(), darstellung: roh.darstellung ?? "schiene" });
    case "teamBaustein":
      return mk({ team: await team() });
    case "zitatBaustein":
      return mk({ bild: await bild(roh.bild as BildReferenz | undefined, ort) });
    case "zielgruppenBaustein":
      return mk({ gruppen: await Promise.all(((roh.gruppen as Record<string, unknown>[]) ?? []).map(async (g) => ({ ...g, bild: await bild(g.bild as BildReferenz | undefined, `${ort} Gruppe ${g._key}`) }))) });
    case "partnerBaustein":
      return mk({ partner: await partner() });
    case "notfallBaustein":
      return mk({ mitGebieten: roh.mitGebieten !== false, kompakt: roh.kompakt === true });
    case "kontaktBaustein":
      return mk({ mitFormular: roh.mitFormular === true, mitOeffnungszeiten: roh.mitOeffnungszeiten !== false });
    default:
      if (!BEKANNTE_BAUSTEINE.has(String(roh._type))) throw new Error(`${ort}: unbekannter Bausteintyp «${String(roh._type)}».`);
      return roh as unknown as Baustein;
  }
}

export const lokaleQuelle: Inhaltsquelle = {
  async getEinstellungen() {
    const roh = await json<RohEinstellungen>("einstellungen.json");
    return { ...roh, logo: await bild(roh.logo, "Einstellungen: Logo"), seoBild: await bild(roh.seoBild, "Einstellungen: SEO-Bild") };
  },
  async getTexte() {
    return json<Texte>("texte.json");
  },
  async getSeite(slug) {
    let roh: RohSeite;
    try {
      roh = await json<RohSeite>(`seiten/${slug}.json`);
    } catch (err) {
      if (fehltNur(err)) return null;
      throw err;
    }
    return {
      ...roh,
      alteUrls: roh.alteUrls ?? [],
      hero: roh.hero ? { ...roh.hero, bild: await bild(roh.hero.bild, `Hero ${slug}`), leistungen: roh.hero.variante === "verteiler" ? await leistungen() : undefined } : undefined,
      bausteine: await Promise.all(roh.bausteine.map((b) => baustein(b, slug))),
    };
  },
  getAlleSeiten: alleSeiten,
  getLeistungen: leistungen,
  async getLeistung(slug) {
    return (await leistungen()).find((l) => l.slug === slug) ?? null;
  },
  getTeam: team,
  getPartner: partner,
};
