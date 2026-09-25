/**
 * Prüft die lokalen Inhaltsdateien (data/) auf Vollständigkeit; läuft ohne Sanity.
 *   npm run inhalt:pruefen
 * Meldet fehlende Bilder/Alt-Texte, doppelte Slugs/_keys/Anker, unbekannte Bausteine oder Symbole, unzulässige Linkziele,
 * interne Links auf nicht vorhandene Seiten, Weiterleitungen ins Leere, fehlende Pflichtfelder und Gedankenstriche («—») im Text.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const DATA = path.resolve(process.cwd(), "data");
type Roh = Record<string, unknown>;
const json = async <T,>(p: string): Promise<T> => JSON.parse(await readFile(path.join(DATA, p), "utf8")) as T;
const fehler: string[] = [];
const warnungen: string[] = [];
const bilder = await json<Record<string, unknown>>("bilder.json");
const BAUSTEINE = new Set(["textBaustein", "leistungenBaustein", "zitatBaustein", "spaltenBaustein", "notfallBaustein", "teamBaustein", "partnerBaustein", "kontaktBaustein", "aufrufBaustein", "hinweisBaustein"]);
const SYMBOLE = new Set(["plan", "service", "bau", "motor", "lampe", "steckdose", "antenne", "alarm"]);
const linkErlaubt = (z: string) => /^\/(?!\/)/.test(z) || /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:\+?[\d\s()-]+)$/.test(z);
const kennung = /^[a-z0-9-]+$/;
const GEDANKENSTRICH = /—/;

function bildPruefen(ref: { bild?: string; alt?: string } | undefined, ort: string) {
  if (!ref) return;
  if (!ref.bild || !bilder[ref.bild]) fehler.push(`${ort}: Bild «${ref.bild}» fehlt in bilder.json`);
  if (typeof ref.alt !== "string" || !ref.alt.trim()) fehler.push(`${ort}: Alt-Text fehlt`);
}
const interneLinks: [string, string][] = [];
const linkSammeln = (ziel: unknown, ort: string) => {
  if (typeof ziel !== "string") return;
  if (!linkErlaubt(ziel)) fehler.push(`${ort}: unzulässiges Linkziel «${ziel}»`);
  if (ziel.startsWith("/")) interneLinks.push([ziel, ort]);
};
function richTextPruefen(inhalt: unknown, ort: string) {
  if (!Array.isArray(inhalt) || !inhalt.length) { fehler.push(`${ort}: Text fehlt`); return; }
  for (const block of inhalt as { _key?: string; markDefs?: { href?: string }[]; children?: { text?: string }[] }[]) {
    if (!block._key) fehler.push(`${ort}: Block ohne _key`);
    for (const m of block.markDefs ?? []) linkSammeln(m.href, ort);
    for (const c of block.children ?? []) if (typeof c.text === "string" && GEDANKENSTRICH.test(c.text)) fehler.push(`${ort}: Gedankenstrich im Text («${c.text.slice(0, 40)}…»)`);
  }
}
const textPruefen = (t: unknown, ort: string) => { if (typeof t === "string" && GEDANKENSTRICH.test(t)) fehler.push(`${ort}: Gedankenstrich «—» im Text`); };

const e = await json<Roh>("einstellungen.json");
for (const k of ["firma", "kurzname", "claim", "telefon", "email", "routenlink", "oeffnungszeitenText"]) if (!e[k]) fehler.push(`Einstellungen: ${k} fehlt`);
for (const k of ["strasse", "plz", "ort"]) if (!(e.adresse as Roh)?.[k]) fehler.push(`Einstellungen: Adresse ${k} fehlt`);
if (typeof e.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.email)) fehler.push("Einstellungen: E-Mail ungültig");
if (typeof e.routenlink !== "string" || !/^https:\/\//.test(e.routenlink)) fehler.push("Einstellungen: routenlink muss mit https:// beginnen");
for (const n of ((e.notfall as Roh)?.nummern as string[]) ?? []) if (!/^0\d{2} \d{3} \d{2} \d{2}$/.test(n)) fehler.push(`Notfallnummer «${n}» nicht im Format 0xx xxx xx xx`);
const notfall = (e.notfall as Roh) ?? {};
for (const k of ["titel", "verfuegbarkeit", "text"]) if (!notfall[k]) fehler.push(`Einstellungen: Notfall ${k} fehlt`);
if (!Array.isArray(notfall.nummern) || !notfall.nummern.length) fehler.push("Einstellungen: Notfallnummern fehlen");
if (/anfahrt|minuten|tarif|pauschale/i.test(JSON.stringify(notfall))) warnungen.push("Notfall: Angaben zu Anfahrtszeit oder Tarif prüfen (Quelle nennt keine)");
bildPruefen(e.seoBild as never, "Einstellungen SEO-Bild");
bildPruefen(e.logo as never, "Einstellungen Logo");
{
  const ZEIT = /^([01]\d|2[0-3]):[0-5]\d$/;
  const zk = new Set<string>();
  for (const z of (e.oeffnungszeiten as Roh[]) ?? []) {
    if (!z._key || zk.has(z._key as string)) fehler.push("Öffnungszeiten: _key fehlt oder doppelt");
    zk.add(z._key as string);
    if (!(z.wochentage as unknown[])?.length) fehler.push(`Öffnungszeiten ${z._key}: wochentage fehlen`);
    for (const i of (z.intervalle as { _key?: string; von?: string; bis?: string }[]) ?? []) if (!i._key || !ZEIT.test(i.von ?? "") || !ZEIT.test(i.bis ?? "")) fehler.push(`Öffnungszeiten ${z._key}: Zeitspanne ungültig (HH:MM, _key)`);
  }
}
const t = await json<Roh>("texte.json");
for (const n of (t.navigation as Roh[]) ?? []) { linkSammeln(n.ziel, `Navigation ${n.titel}`); for (const k of (n.kinder as Roh[]) ?? []) linkSammeln(k.ziel, `Navigation ${n.titel} › ${k.titel}`); }
linkSammeln((t.kopfKnopf as Roh)?.ziel, "Kopfzeile Knopf");
linkSammeln(((t.mobilLeiste as Roh)?.anfragen as Roh)?.ziel, "Mobile Leiste");
const footer = (t.footer as Roh) ?? {};
for (const g of (footer.gruppen as Roh[]) ?? []) for (const l of (g.links as Roh[]) ?? []) linkSammeln(l.ziel, `Footer ${g.titel}`);
for (const l of (footer.rechtslinks as Roh[]) ?? []) linkSammeln(l.ziel, "Rechtslinks");
for (const gruppe of ["ui", "formular", "einwilligung", "seo"]) for (const [k, v] of Object.entries((t[gruppe] as Roh) ?? {})) { if (v === "" || v === undefined) fehler.push(`texte.json: ${gruppe}.${k} leer`); textPruefen(v, `texte.json ${gruppe}.${k}`); }
if (((t.seo as Roh)?.beschreibung as string)?.length > 170) warnungen.push("texte.json: seo.beschreibung länger als 170 Zeichen");

const leistungen = await json<Roh[]>("leistungen.json");
const lslugs = new Set<string>();
const ids = new Set<string>();
const idPruefen = (id: unknown, ort: string) => { if (typeof id !== "string" || !id) fehler.push(`${ort}: id fehlt`); else if (ids.has(id)) fehler.push(`${ort}: id «${id}» doppelt`); else ids.add(id); };
const reihenfolgen = (liste: Roh[], was: string) => { const r = liste.map((x) => x.reihenfolge); if (new Set(r).size !== r.length) fehler.push(`${was}: reihenfolge doppelt`); };
reihenfolgen(leistungen, "Leistungen");
for (const l of leistungen) {
  const ort = `Leistung ${l.id}`;
  idPruefen(l.id, ort);
  if (!l.id || !l.slug || !kennung.test(l.slug as string) || lslugs.has(l.slug as string)) fehler.push(`${ort}: ID/Slug fehlt, ungültig oder doppelt`); lslugs.add(l.slug as string);
  if (!l.titel || !l.kurztitel || !l.kurz) fehler.push(`${ort}: Titel/Kurztitel/Kurztext fehlt`);
  if (!SYMBOLE.has(l.symbol as string)) fehler.push(`${ort}: Symbol «${l.symbol}» unbekannt`);
  if (!Number.isInteger(l.reihenfolge)) fehler.push(`${ort}: reihenfolge fehlt`);
  richTextPruefen(l.inhalt, ort);
  bildPruefen(l.bild as never, ort);
  for (const k of ["kurz", "titel", "seoBeschreibung"]) textPruefen(l[k], ort);
  if (typeof l.seoBeschreibung === "string" && l.seoBeschreibung.length > 170) warnungen.push(`${ort}: SEO-Beschreibung ${l.seoBeschreibung.length} Zeichen`);
  if (!l.quelle) warnungen.push(`${ort}: keine Quellenangabe`);
}
const team = await json<Roh[]>("team.json");
reihenfolgen(team, "Team");
for (const p of team) { idPruefen(p.id, `Team ${p.id}`); if (!p.name || !p.funktion) fehler.push(`Team ${p.id}: Name/Funktion fehlt`); }
const partner = await json<Roh[]>("partner.json");
reihenfolgen(partner, "Partner");
for (const p of partner) { idPruefen(p.id, `Partner ${p.id}`); if (!p.name) fehler.push(`Partner ${p.id}: Name fehlt`); bildPruefen(p.logo as never, `Partner ${p.id}`); if (p.url && !/^https?:\/\//.test(p.url as string)) fehler.push(`Partner ${p.id}: url ungültig`); }

const slugs = new Set<string>();
const seitenDateien = (await readdir(path.join(DATA, "seiten"))).filter((x) => x.endsWith(".json"));
for (const f of seitenDateien) {
  const s = await json<Roh>(`seiten/${f}`);
  const slug = s.slug as string;
  const ort = `Seite ${slug}`;
  if (slugs.has(slug)) fehler.push(`Doppelter Slug: ${ort}`); slugs.add(slug);
  if (`${slug}.json` !== f) fehler.push(`seiten/${f}: Dateiname passt nicht zum Slug «${slug}»`);
  if (slug === "elektroinstallationen" || slug.startsWith("elektroinstallationen/")) { if (slug !== "elektroinstallationen") fehler.push(`${ort}: Pfad unter /elektroinstallationen/ ist für Leistungen reserviert`); }
  if (!s.titel) fehler.push(`${ort}: Titel fehlt`);
  if (!["seite", "rechtliches"].includes(s.art as string)) fehler.push(`${ort}: art ungültig`);
  if (s.art === "rechtliches" && !s.stand) warnungen.push(`${ort}: Rechtstext ohne Stand`);
  if (!(s.bausteine as unknown[])?.length) fehler.push(`${ort}: keine Bausteine (leere Seite)`);
  for (const k of ["titel", "teaser", "seoTitel", "seoBeschreibung"]) textPruefen(s[k], ort);
  if (typeof s.seoBeschreibung === "string" && s.seoBeschreibung.length > 170) warnungen.push(`${ort}: SEO-Beschreibung ${s.seoBeschreibung.length} Zeichen`);
  const hero = s.hero as Roh | undefined;
  if (hero) {
    if (!hero.titel) fehler.push(`${ort}: hero.titel fehlt`);
    if (!["bildband", "kompakt"].includes(hero.variante as string)) fehler.push(`${ort}: hero.variante ungültig`);
    bildPruefen(hero.bild as never, `${ort} hero`);
    for (const k of ["knopf", "zweiterKnopf"]) linkSammeln((hero[k] as { ziel?: string } | undefined)?.ziel, `${ort} hero`);
    textPruefen(hero.titel, `${ort} hero`); textPruefen(hero.text, `${ort} hero`);
    if (typeof hero.text === "string" && hero.variante === "bildband" && hero.text.split(/\s+/).length > 24) warnungen.push(`${ort}: Hero-Text ${hero.text.split(/\s+/).length} Wörter (Ziel ≤ 20)`);
  }
  if (!s.quelle && s.art !== "rechtliches") warnungen.push(`${ort}: keine Quellenangabe`);
  const keys = new Set<string>(); const anker = new Set<string>();
  for (const b of (s.bausteine as Roh[]) ?? []) {
    const bort = `${ort} › ${b._type}/${b._key}`;
    if (!BAUSTEINE.has(b._type as string)) fehler.push(`${bort}: unbekannter Baustein`);
    if (!b._key || keys.has(b._key as string)) fehler.push(`${bort}: _key fehlt oder doppelt`); keys.add(b._key as string);
    if (b.anker !== undefined) { if (!kennung.test(b.anker as string) || anker.has(b.anker as string)) fehler.push(`${bort}: Anker ungültig/doppelt`); anker.add(b.anker as string); }
    for (const k of ["titel", "einleitung", "text", "zitat"]) textPruefen(b[k], bort);
    if ("bild" in b) bildPruefen(b.bild as never, bort);
    if (b._type === "textBaustein" || b._type === "hinweisBaustein") richTextPruefen(b.inhalt, bort);
    if (b._type === "zitatBaustein") { if (!b.zitat) fehler.push(`${bort}: zitat fehlt`); if (b.inhalt) richTextPruefen(b.inhalt, bort); }
    if (b._type === "spaltenBaustein") for (const sp of (b.spalten as Roh[]) ?? []) { if (!sp._key || !sp.titel) fehler.push(`${bort}: Spalte ohne _key/Titel`); richTextPruefen(sp.inhalt, `${bort} Spalte ${sp.titel}`); }
    if (b._type === "hinweisBaustein" && !["info", "wichtig"].includes(b.art as string)) fehler.push(`${bort}: art ungültig`);
    if (b._type === "leistungenBaustein" && !["schiene", "raster"].includes(b.darstellung as string)) fehler.push(`${bort}: darstellung ungültig`);
    if (b._type === "aufrufBaustein") { if (!b.knopf) fehler.push(`${bort}: knopf fehlt`); for (const k of ["knopf", "zweiterKnopf"]) linkSammeln((b[k] as { ziel?: string } | undefined)?.ziel, bort); }
  }
}
const bekannt = new Set<string>(["/", ...[...slugs].filter((s) => s !== "start").map((s) => `/${s}/`), ...[...lslugs].map((s) => `/elektroinstallationen/${s}/`)]);
for (const [ziel, ort] of interneLinks) { const [pfad, hash] = ziel.split("#"); if (pfad && !bekannt.has(pfad)) fehler.push(`${ort}: interner Link «${ziel}» zeigt auf keine Seite`); if (hash !== undefined && !hash) fehler.push(`${ort}: leerer Anker in «${ziel}»`); }
for (const w of await json<{ von: string; nach: string }[]>("weiterleitungen.json")) if (!bekannt.has(w.nach)) fehler.push(`Weiterleitung ${w.von} → ${w.nach}: Ziel existiert nicht`);
// Jede Leistung muss in Navigation und Footer erreichbar sein
const navZiele = new Set(((t.navigation as Roh[]) ?? []).flatMap((n) => [n.ziel as string, ...(((n.kinder as Roh[]) ?? []).map((k) => k.ziel as string))]));
for (const s of lslugs) if (!navZiele.has(`/elektroinstallationen/${s}/`)) warnungen.push(`Leistung ${s} fehlt in der Navigation`);
for (const s of ["impressum", "datenschutz", "kontakt", "notfalldienst", "team", "partner", "elektroinstallationen"]) if (!slugs.has(s)) fehler.push(`Pflichtseite «${s}» fehlt`);

for (const w of warnungen) console.warn(`⚠ ${w}`);
if (fehler.length) { console.error(`✗ ${fehler.length} Fehler:\n` + fehler.map((f) => `  - ${f}`).join("\n")); process.exit(1); }
console.log(`✓ Inhalte in Ordnung: ${slugs.size} Seiten, ${leistungen.length} Leistungen, ${team.length} Teammitglieder, ${partner.length} Partner, ${interneLinks.length} interne Links geprüft, ${warnungen.length} Warnung(en).`);
