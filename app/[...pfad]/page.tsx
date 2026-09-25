import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { inhaltsquelle, LEISTUNGEN_BASIS } from "@/lib/content";
import { leistungMetadata, seitenMetadata } from "@/lib/seo";
import { LeistungSeite } from "@/components/LeistungSeite";
import { Seite } from "../Seite";

// Alle Unterseiten kommen aus den Inhaltsdaten: Seiten (data/seiten) und Leistungen (/elektroinstallationen/<slug>/).
// Statischer Export: nur bekannte Pfade (false). Auf Vercel dürfen neu im CMS angelegte Seiten zur Laufzeit gerendert werden (true, ISR),
// sonst wären sie bis zum nächsten Deployment 404 (Codex-Befund). Next verlangt hier einen statischen Wert; scripts/vercel-routen.mjs
// setzt ihn vor jedem Build/Dev-Start passend zur Betriebsart (die Markierung am Zeilenende ist der Anker dafür).
export const dynamicParams = false; // vercel-routen

type Params = { pfad: string[] };

export async function generateStaticParams(): Promise<Params[]> {
  const q = await inhaltsquelle();
  const [seiten, leistungen] = await Promise.all([q.getAlleSeiten(), q.getLeistungen()]);
  return [
    ...seiten.filter((s) => s.slug !== "start").map((s) => ({ pfad: s.slug.split("/") })),
    ...leistungen.map((l) => ({ pfad: [LEISTUNGEN_BASIS, l.slug] })),
  ];
}

const leistungSlug = (pfad: string[]) => (pfad.length === 2 && pfad[0] === LEISTUNGEN_BASIS ? pfad[1] : null);

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { pfad } = await params;
  const q = await inhaltsquelle();
  const [e, t] = await Promise.all([q.getEinstellungen(), q.getTexte()]);
  const ls = leistungSlug(pfad);
  if (ls) {
    const l = await q.getLeistung(ls);
    return l ? leistungMetadata(l, e, t) : {};
  }
  const s = await q.getSeite(pfad.join("/"));
  return s ? seitenMetadata(s, e, t) : {};
}

export default async function Unterseite({ params }: { params: Promise<Params> }) {
  const { pfad } = await params;
  const q = await inhaltsquelle();
  const [e, t] = await Promise.all([q.getEinstellungen(), q.getTexte()]);
  const ls = leistungSlug(pfad);
  if (ls) {
    const [l, alle] = await Promise.all([q.getLeistung(ls), q.getLeistungen()]);
    if (!l) notFound();
    return <LeistungSeite leistung={l} alle={alle} einstellungen={e} texte={t} />;
  }
  const seite = await q.getSeite(pfad.join("/"));
  if (!seite) notFound();
  return <Seite seite={seite} einstellungen={e} texte={t} />;
}
