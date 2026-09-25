import type { Metadata } from "next";
import { stegaClean } from "@sanity/client/stega";
import { leistungPfad, seitenPfad, type Bild, type Einstellungen, type Leistung, type Seite, type Teammitglied, type Texte } from "./content/types";
import { siteUrl } from "./deploy-ziel";

/** Indexierung nur, wenn ausdrücklich freigegeben (nach Go-Live auf der Kundendomain). */
export const indexierungErlaubt = process.env.INDEXIERUNG === "1";

/** Entfernt Stega-Markierungen (Visual Editing) aus Strings, bevor sie in Metadaten/JSON-LD landen. */
const sauber = (s: string | undefined) => (s ? stegaClean(s) : undefined);
const robots = () => (indexierungErlaubt ? { index: true, follow: true } : { index: false, follow: false });
/** Lokale Pfade bekommen die Site-URL, Sanity-CDN-URLs bleiben. */
const absolut = (url: string) => (/^https?:\/\//.test(url) ? url : `${siteUrl}${url}`);

function metadaten(titel: string, beschreibung: string | undefined, pfad: string, bild: Bild | undefined, e: Einstellungen, t: Texte, istStart = false): Metadata {
  const b = bild ?? e.seoBild;
  const bildUrl = b ? b.quellen[b.quellen.length - 1]?.url : undefined;
  return {
    title: istStart ? { absolute: `${sauber(e.firma)}: ${titel}` } : titel,
    description: beschreibung,
    alternates: { canonical: `${siteUrl}${pfad}` },
    openGraph: { title: titel, description: beschreibung, url: `${siteUrl}${pfad}`, siteName: sauber(e.firma), locale: "de_CH", type: "website", images: bildUrl ? [{ url: absolut(bildUrl), width: b?.breite, height: b?.hoehe, alt: sauber(b?.alt) }] : undefined },
    robots: robots(),
  };
}

export function seitenMetadata(seite: Seite, e: Einstellungen, t: Texte): Metadata {
  const titel = sauber(seite.seoTitel) ?? sauber(seite.titel) ?? "";
  const beschreibung = sauber(seite.seoBeschreibung) ?? sauber(seite.teaser) ?? sauber(t.seo.beschreibung);
  return metadaten(titel, beschreibung, seitenPfad(seite.slug), seite.hero?.bild, e, t, seite.slug === "start");
}

export function leistungMetadata(l: Leistung, e: Einstellungen, t: Texte): Metadata {
  return metadaten(sauber(l.titel) ?? "", sauber(l.seoBeschreibung) ?? sauber(l.kurz), leistungPfad(l.slug), l.bild, e, t);
}

const SCHEMA_WOCHENTAG: Record<string, string> = {
  Montag: "https://schema.org/Monday", Dienstag: "https://schema.org/Tuesday", Mittwoch: "https://schema.org/Wednesday", Donnerstag: "https://schema.org/Thursday",
  Freitag: "https://schema.org/Friday", Samstag: "https://schema.org/Saturday", Sonntag: "https://schema.org/Sunday",
};

/** «044 840 07 70», «+41 44 …», «0041 44 …» → «+41448400770» (E.164). */
export function telefonInternational(tel: string): string {
  const ziffern = tel.replace(/\D/g, "");
  if (ziffern.startsWith("00")) return `+${ziffern.slice(2)}`;
  if (ziffern.startsWith("0")) return `+41${ziffern.slice(1)}`;
  return `+${ziffern}`;
}

/**
 * Strukturierte Daten werden nur ausgegeben, wenn die Indexierung freigegeben ist (INDEXIERUNG=1, Kundendomain). In der Demo
 * würden sie die Altec Elektro GmbH maschinenlesbar als Betreiberin einer inoffiziellen Seite ausweisen (Codex-Befund).
 * Strukturierte Daten: `Electrician` (Unterart von LocalBusiness), ausschliesslich belegte Angaben der bisherigen Website:
 * Firma, Adresse, Telefon, Fax, E-Mail, Büroöffnungszeiten, Team, Leistungen, Einsatzgebiet. Keine Bewertungen, keine Preise,
 * kein Gründungsjahr, keine Mitarbeiterzahl. Die Notfallnummern stehen als zusätzliche Kontaktstelle mit «hoursAvailable» rund um die Uhr.
 */
export function betriebJsonLd(e: Einstellungen, team: Teammitglied[], leistungen: Leistung[]): Record<string, unknown> {
  const zeiten = e.oeffnungszeiten.flatMap((z) => z.intervalle.map((i) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: z.wochentage.map((w) => SCHEMA_WOCHENTAG[w]).filter(Boolean), opens: i.von, closes: i.bis })));
  const notfallNummer = e.notfall.nummern[0];
  return {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "@id": `${siteUrl}/#betrieb`,
    name: sauber(e.firma),
    url: `${siteUrl}/`,
    telephone: telefonInternational(e.telefon),
    faxNumber: e.fax ? telefonInternational(e.fax) : undefined,
    email: sauber(e.email),
    image: e.seoBild ? absolut(e.seoBild.quellen[e.seoBild.quellen.length - 1].url) : undefined,
    address: { "@type": "PostalAddress", streetAddress: sauber(e.adresse.strasse), postalCode: sauber(e.adresse.plz), addressLocality: sauber(e.adresse.ort), addressCountry: "CH" },
    geo: e.geo ? { "@type": "GeoCoordinates", latitude: e.geo.breite, longitude: e.geo.laenge } : undefined,
    openingHoursSpecification: zeiten.length ? zeiten : undefined,
    contactPoint: notfallNummer
      ? [{ "@type": "ContactPoint", contactType: "emergency", telephone: telefonInternational(notfallNummer), availableLanguage: "de", hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: Object.values(SCHEMA_WOCHENTAG), opens: "00:00", closes: "23:59" } }]
      : undefined,
    areaServed: [sauber(e.adresse.ort), ...e.notfall.quartiere, ...e.notfall.agglomeration].map((n) => ({ "@type": "Place", name: sauber(n) })),
    employee: team.length ? team.map((p) => ({ "@type": "Person", name: sauber(p.name), jobTitle: sauber(p.funktion) })) : undefined,
    makesOffer: leistungen.map((l) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: sauber(l.titel), url: `${siteUrl}${leistungPfad(l.slug)}` } })),
  };
}

/** JSON-LD sicher in ein <script> einbetten: «<» wird escaped, damit kein HTML entsteht. */
export function jsonLdSicher(daten: unknown): string {
  return JSON.stringify(daten).replace(/</g, "\\u003c");
}
