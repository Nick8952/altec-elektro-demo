import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { inhaltsquelle } from "@/lib/content";
import { seitenMetadata } from "@/lib/seo";
import { Seite } from "./Seite";

export async function generateMetadata(): Promise<Metadata> {
  const q = await inhaltsquelle();
  const [s, e, t] = await Promise.all([q.getSeite("start"), q.getEinstellungen(), q.getTexte()]);
  return s ? seitenMetadata(s, e, t) : {};
}

export default async function Startseite() {
  const q = await inhaltsquelle();
  const [seite, e, t] = await Promise.all([q.getSeite("start"), q.getEinstellungen(), q.getTexte()]);
  if (!seite) notFound();
  return <Seite seite={seite} einstellungen={e} texte={t} />;
}
