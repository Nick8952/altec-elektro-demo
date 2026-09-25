import "server-only";
import { defineQuery } from "next-sanity";
import { client, vorschauClient } from "@/sanity/client";
import { sanityPruefen } from "@/sanity/env";
import { BILD_PROJEKTION, sanityBild, type SanityBildRoh } from "@/sanity/bild";
import { istVorschau } from "@/lib/vorschau/status";
import type { Baustein, Einstellungen, Inhaltsquelle, Leistung, Partner, Seite, SeitenTeaser, Teammitglied, Texte } from "./types";
import { BEKANNTE_BAUSTEINE } from "./types";

/**
 * Sanity-Inhaltsquelle (für Vercel). Liefert exakt dieselben Typen und Fallback-Regeln wie lib/content/local.ts
 * (leere Arrays statt undefined, sortiert nach reihenfolge, Referenzen aufgelöst).
 * Cache: veröffentlichte Inhalte mit Tag «inhalt», Invalidierung per Webhook (server-routes/app/api/revalidate).
 * Im Draft Mode ungecacht mit Perspektive «drafts».
 * Status: VORBEREITET, erst nach Anlegen eines Sanity-Projekts überprüfbar.
 */
export const INHALT_TAG = "inhalt";

async function abfrage<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  sanityPruefen();
  const vorschau = await istVorschau();
  const c = vorschau ? vorschauClient() : client();
  return c.fetch<T>(query, params, vorschau ? { cache: "no-store" } : { next: { revalidate: false, tags: [INHALT_TAG] } });
}

type Roh = Record<string, unknown>;
const bildAus = (o: unknown, alt = "") => sanityBild(o as SanityBildRoh | undefined, alt);
// Gelöschte Referenzen kommen aus GROQ als null zurück und werden hier verworfen.
const liste = <T,>(x: unknown): T[] => (Array.isArray(x) ? (x as T[]).filter((e) => e != null) : []);
const sortiert = <T extends { reihenfolge: number }>(l: T[]) => [...l].sort((a, b) => a.reihenfolge - b.reihenfolge);

const LINK = `{ titel, ziel, extern }`;
const LEISTUNG = `{ "id": _id, "slug": slug.current, titel, kurztitel, symbol, kurz, inhalt, bild ${BILD_PROJEKTION}, seoBeschreibung, reihenfolge, alteUrl, quelle }`;
const TEAM = `{ "id": _id, name, funktion, reihenfolge }`;
const PARTNER = `{ "id": _id, name, logo ${BILD_PROJEKTION}, url, reihenfolge }`;
const TEASER = `{ "slug": slug.current, titel, art, teaser }`;

const BAUSTEINE = `bausteine[] {
  _key, _type, "anker": anker.current, titel,
  _type == "textBaustein" => { inhalt, bild ${BILD_PROJEKTION}, bildPosition, breite },
  _type == "leistungenBaustein" => { einleitung, darstellung, "leistungen": *[_type == "leistung"] | order(reihenfolge asc) ${LEISTUNG} },
  _type == "zitatBaustein" => { zitat, inhalt, bild ${BILD_PROJEKTION}, bildText },
  _type == "faktenBaustein" => { fakten[] { _key, titel, text, symbol } },
  _type == "zielgruppenBaustein" => { einleitung, gruppen[] { _key, titel, text, bild ${BILD_PROJEKTION}, link ${LINK} } },
  _type == "ablaufBaustein" => { einleitung, schritte[] { _key, titel, text, link ${LINK} }, knopf ${LINK} },
  _type == "spaltenBaustein" => { einleitung, spalten[] { _key, titel, inhalt } },
  _type == "notfallBaustein" => { einleitung, mitGebieten, kompakt },
  _type == "teamBaustein" => { einleitung, "team": *[_type == "teammitglied"] | order(reihenfolge asc) ${TEAM} },
  _type == "partnerBaustein" => { einleitung, "partner": *[_type == "partner"] | order(reihenfolge asc) ${PARTNER} },
  _type == "kontaktBaustein" => { einleitung, mitFormular, mitOeffnungszeiten },
  _type == "aufrufBaustein" => { text, knopf ${LINK}, zweiterKnopf ${LINK} },
  _type == "hinweisBaustein" => { inhalt, art }
}`;

const EINSTELLUNGEN_QUERY = defineQuery(`*[_type == "einstellungen"][0] {
  firma, kurzname, claim, adresse, telefon, fax, email,
  notfall { titel, verfuegbarkeit, text, nummern, quartiere, agglomeration, hinweis },
  oeffnungszeiten[] { _key, tage, zeiten, wochentage, intervalle[] { _key, von, bis } }, oeffnungszeitenText,
  routenlink, geo, logo ${BILD_PROJEKTION}, seoBild ${BILD_PROJEKTION}
}`);
const TEXTE_QUERY = defineQuery(`*[_type == "texte"][0] {
  navigation[] { _key, titel, ziel, kinder[] ${LINK} }, kopfKnopf ${LINK}, mobilLeiste { anrufen, anfragen ${LINK} },
  footer { gruppen[] { titel, links[] ${LINK} }, rechtslinks[] ${LINK}, demoHinweis }, seo, ui, formular, einwilligung
}`);
const SEITE_QUERY = defineQuery(`*[_type == "seite" && slug.current == $slug][0] {
  "id": _id, "slug": slug.current, titel, art, teaser, seoTitel, seoBeschreibung, alteUrls, stand, quelle,
  hero { titel, text, knopf ${LINK}, zweiterKnopf ${LINK}, bild ${BILD_PROJEKTION}, variante, panelTitel, "leistungen": select(variante == "verteiler" => *[_type == "leistung"] | order(reihenfolge asc) ${LEISTUNG}, null) },
  ${BAUSTEINE}
}`);

const leistungAufbereiten = (l: Roh): Leistung => ({ ...(l as object), inhalt: liste(l.inhalt), bild: bildAus(l.bild, l.titel as string) }) as Leistung;
const partnerAufbereiten = (p: Roh): Partner => {
  const logo = bildAus(p.logo, p.name as string);
  if (!logo) throw new Error(`Sanity: Partner «${String(p.name)}» hat kein Logo (Pflichtfeld).`);
  return { ...(p as object), logo } as Partner;
};

function bausteinAufbereiten(b: Roh): Baustein {
  const mk = (o: Roh): Baustein => ({ ...b, ...o }) as unknown as Baustein;
  switch (b._type) {
    case "textBaustein": return mk({ inhalt: liste(b.inhalt), bild: bildAus(b.bild) });
    case "leistungenBaustein": return mk({ darstellung: b.darstellung ?? "schiene", leistungen: sortiert(liste<Roh>(b.leistungen).map(leistungAufbereiten)) });
    case "zitatBaustein": return mk({ inhalt: b.inhalt ? liste(b.inhalt) : undefined, bild: bildAus(b.bild) });
    case "faktenBaustein": return mk({ fakten: liste(b.fakten) });
    case "zielgruppenBaustein": return mk({ gruppen: liste<Roh>(b.gruppen).map((g) => ({ ...(g as object), bild: bildAus(g.bild) })) });
    case "ablaufBaustein": return mk({ schritte: liste(b.schritte) });
    case "spaltenBaustein": return mk({ spalten: liste<Roh>(b.spalten).map((s) => ({ ...(s as object), inhalt: liste(s.inhalt) })) });
    case "notfallBaustein": return mk({ mitGebieten: b.mitGebieten !== false, kompakt: b.kompakt === true });
    case "teamBaustein": return mk({ team: sortiert(liste<Teammitglied>(b.team)) });
    case "partnerBaustein": return mk({ partner: sortiert(liste<Roh>(b.partner).map(partnerAufbereiten)) });
    case "kontaktBaustein": return mk({ mitFormular: b.mitFormular === true, mitOeffnungszeiten: b.mitOeffnungszeiten !== false });
    case "hinweisBaustein": return mk({ inhalt: liste(b.inhalt) });
    default:
      if (!BEKANNTE_BAUSTEINE.has(String(b._type))) throw new Error(`Sanity: unbekannter Bausteintyp «${String(b._type)}» (${String(b._key)}).`);
      return b as unknown as Baustein;
  }
}

export const sanityQuelle: Inhaltsquelle = {
  async getEinstellungen() {
    const e = await abfrage<Roh | null>(EINSTELLUNGEN_QUERY);
    if (!e) throw new Error("Sanity: Dokument «einstellungen» fehlt: `npm run seed` ausführen.");
    const notfall = (e.notfall ?? {}) as Roh;
    return {
      ...(e as object),
      notfall: { ...notfall, nummern: liste(notfall.nummern), quartiere: liste(notfall.quartiere), agglomeration: liste(notfall.agglomeration) },
      oeffnungszeiten: liste<Roh>(e.oeffnungszeiten).map((z) => ({ ...z, wochentage: liste(z.wochentage), intervalle: liste(z.intervalle) })),
      logo: bildAus(e.logo, e.firma as string),
      seoBild: bildAus(e.seoBild),
    } as Einstellungen;
  },
  async getTexte() {
    const t = await abfrage<Roh | null>(TEXTE_QUERY);
    if (!t) throw new Error("Sanity: Dokument «texte» fehlt: `npm run seed` ausführen.");
    const footer = (t.footer ?? {}) as Roh;
    const einwilligung = (t.einwilligung ?? {}) as Roh;
    return {
      ...(t as object),
      navigation: liste<Roh>(t.navigation).map((n) => ({ ...n, kinder: liste(n.kinder) })),
      footer: { ...footer, gruppen: liste<Roh>(footer.gruppen).map((g) => ({ ...g, links: liste(g.links) })), rechtslinks: liste(footer.rechtslinks), demoHinweis: footer.demoHinweis ?? "" },
      einwilligung: { ...einwilligung, kategorien: liste(einwilligung.kategorien) },
    } as Texte;
  },
  async getSeite(slug) {
    const s = await abfrage<Roh | null>(SEITE_QUERY, { slug });
    if (!s) return null;
    const hero = s.hero as Roh | undefined;
    return { ...(s as object), alteUrls: liste(s.alteUrls), hero: hero ? { ...(hero as object), variante: hero.variante ?? "kompakt", bild: bildAus(hero.bild), leistungen: hero.leistungen ? sortiert(liste<Roh>(hero.leistungen).map(leistungAufbereiten)) : undefined } : undefined, bausteine: liste<Roh>(s.bausteine).map(bausteinAufbereiten) } as Seite;
  },
  async getAlleSeiten() {
    return abfrage<SeitenTeaser[]>(`*[_type == "seite" && defined(slug.current)] | order(slug.current asc) ${TEASER}`);
  },
  async getLeistungen() { return (await abfrage<Roh[]>(`*[_type == "leistung"] | order(reihenfolge asc) ${LEISTUNG}`)).map(leistungAufbereiten); },
  async getLeistung(slug) { const l = await abfrage<Roh | null>(`*[_type == "leistung" && slug.current == $slug][0] ${LEISTUNG}`, { slug }); return l ? leistungAufbereiten(l) : null; },
  async getTeam() { return sortiert(await abfrage<Teammitglied[]>(`*[_type == "teammitglied"] | order(reihenfolge asc) ${TEAM}`)); },
  async getPartner() { return sortiert((await abfrage<Roh[]>(`*[_type == "partner"] | order(reihenfolge asc) ${PARTNER}`)).map(partnerAufbereiten)); },
};
