/**
 * Gemeinsame Inhaltsstruktur der Website «Altec Elektro GmbH».
 *
 * Schnittstelle zwischen Inhaltsquelle und Darstellung:
 * - lib/content/local.ts  liefert sie aus data/ (GitHub-Pages-Demo, JETZT)
 * - lib/content/sanity.ts liefert sie aus Sanity (SPÄTER, Vercel)
 * Seitenkomponenten kennen nur diese Typen, nie die Quelle.
 * Feldnamen sind deutsch und decken sich 1:1 mit den Sanity-Schemas in sanity/schemas/.
 */
import type { PortableTextBlock } from "@portabletext/types";

export type RichText = PortableTextBlock[];

/** Fertig aufbereitetes Bild; beide Provider liefern dieselbe Form. */
export interface Bild {
  id: string;
  alt: string;
  breite: number;
  hoehe: number;
  /** Varianten aufsteigend nach Breite; `url` absolut (Sanity) oder wurzelrelativ ohne Unterpfad (lokal). */
  quellen: { breite: number; url: string }[];
}

export interface Link {
  titel: string;
  /** Interner Pfad («/kontakt/»), externe URL (https://…), tel: oder mailto: */
  ziel: string;
  extern?: boolean;
}

export interface NavEintrag {
  _key: string;
  titel: string;
  ziel: string;
  /** Untermenü (z. B. die acht Leistungen) */
  kinder?: Link[];
}

export interface Adresse {
  strasse: string;
  plz: string;
  ort: string;
  quartier?: string;
  land?: string;
}

export type Wochentag = "Montag" | "Dienstag" | "Mittwoch" | "Donnerstag" | "Freitag" | "Samstag" | "Sonntag";

export interface Oeffnungszeit {
  _key: string;
  /** Anzeige, z. B. «Montag bis Freitag» */
  tage: string;
  /** Anzeige, z. B. «08.00–12.00 und 13.00–17.00 Uhr» */
  zeiten: string;
  /** Strukturiert für JSON-LD */
  wochentage: Wochentag[];
  intervalle: { _key: string; von: string; bis: string }[];
}

/** Notfall-/Pikettdienst: getrennt von den Büroöffnungszeiten. */
export interface Notfall {
  titel: string;
  /** Wörtliche Beschreibung der Quelle («7x24 Stunden … an 365 Tagen im Jahr») */
  verfuegbarkeit: string;
  text: string;
  nummern: string[];
  /** Stadtquartiere mit kurzer Anfahrt laut Quelle */
  quartiere: string[];
  /** Umliegende Gemeinden laut Quelle (wörtlich, auch bei fraglicher Schreibweise) */
  agglomeration: string[];
  /** Redaktioneller Hinweis, z. B. zu ungeprüften Ortsnamen */
  hinweis?: string;
}

/** Unternehmensdaten (ein Dokument). */
export interface Einstellungen {
  firma: string; // «Altec Elektro GmbH»
  kurzname: string; // «Altec Elektro»
  claim: string; // «Elektroinstallationen und Telekommunikation, Zürich Seefeld»
  adresse: Adresse;
  telefon: string;
  fax?: string;
  email: string;
  notfall: Notfall;
  oeffnungszeiten: Oeffnungszeit[];
  /** Freitext der Quelle zu den Bürozeiten */
  oeffnungszeitenText: string;
  /** Externer Kartenlink (wird nur verlinkt, nie eingebettet) */
  routenlink: string;
  geo?: { breite: number; laenge: number };
  logo?: Bild;
  seoBild?: Bild;
}

export interface EinwilligungKategorie {
  kennung: string;
  titel: string;
  beschreibung: string;
}

/** Navigation, Footer, Bedienelemente, Formular, Einwilligung (ein Dokument). */
export interface Texte {
  navigation: NavEintrag[];
  /** Roter Knopf in der Kopfzeile (Notfallnummer) */
  kopfKnopf: Link;
  mobilLeiste: { anrufen: string; anfragen: Link };
  footer: {
    gruppen: { titel: string; links: Link[] }[];
    rechtslinks: Link[];
    /** Kurzer Hinweis am Seitenende, solange die Website eine Demo ist. Leer = kein Hinweis. */
    demoHinweis: string;
  };
  seo: { titelZusatz: string; beschreibung: string };
  ui: Record<
    | "zumInhalt" | "menue" | "menueSchliessen" | "hauptnavigation" | "notfallKurz" | "notfalldienst" | "buerozeiten" | "mehrErfahren"
    | "alleLeistungen" | "weitereLeistungen" | "vorherigeLeistung" | "naechsteLeistung" | "zurUebersicht" | "telefon" | "fax" | "email"
    | "adresse" | "route" | "seiteNichtGefunden" | "seiteNichtGefundenText" | "zurStartseite" | "quartiere" | "agglomeration"
    | "notfallnummern" | "erreichbarkeit" | "stand" | "anrufen" | "kontaktAlternative" | "webseite",
    string
  >;
  formular: {
    titel: string;
    einleitung: string;
    name: string;
    email: string;
    telefon: string;
    betreff: string;
    betreffOptionen: { wert: string; titel: string }[];
    nachricht: string;
    nachrichtHilfe: string;
    pflicht: string;
    fehlerName: string;
    fehlerEmail: string;
    fehlerNachricht: string;
    emailVorbereiten: string;
    hinweisNachher: string;
    datenschutzHinweis: string;
  };
  einwilligung: {
    bannerTitel: string;
    bannerText: string;
    alleAkzeptieren: string;
    nurNotwendige: string;
    einstellungen: string;
    auswahlSpeichern: string;
    widerrufen: string;
    notwendigTitel: string;
    notwendigText: string;
    datenschutzerklaerung: string;
    /** Optionale Kategorien. Leer = keine einwilligungspflichtigen Dienste, kein Banner. */
    kategorien: EinwilligungKategorie[];
  };
}

/** Schematische Symbole für die Leistungen (Signatur «Sammelschiene»). */
export const SYMBOLE = ["plan", "service", "bau", "motor", "lampe", "steckdose", "antenne", "alarm"] as const;
export type Symbol = (typeof SYMBOLE)[number];

export interface Leistung {
  id: string;
  /** Pfadsegment unter /elektroinstallationen/, z. B. «beleuchtung» */
  slug: string;
  titel: string;
  kurztitel: string;
  symbol: Symbol;
  /** Kurztext der Übersichtsseite (wörtlich aus der Quelle, sprachlich geglättet) */
  kurz: string;
  inhalt: RichText;
  bild?: Bild;
  seoBeschreibung?: string;
  reihenfolge: number;
  /** Adresse auf der bisherigen Website, für spätere Weiterleitungen */
  alteUrl?: string;
  quelle?: string;
}

export interface Teammitglied {
  id: string;
  name: string;
  funktion: string;
  reihenfolge: number;
}

export interface Partner {
  id: string;
  name: string;
  logo: Bild;
  /** Nur, wenn die Quelle das Logo verlinkt hat */
  url?: string;
  reihenfolge: number;
}

interface BausteinBasis {
  _key: string;
  titel?: string;
  /** Sprungziel, z. B. «leistungen» → /#leistungen */
  anker?: string;
}
export interface TextBaustein extends BausteinBasis { _type: "textBaustein"; inhalt: RichText; bild?: Bild; bildPosition?: "links" | "rechts"; breite?: "schmal" | "normal" }
export interface LeistungenBaustein extends BausteinBasis { _type: "leistungenBaustein"; einleitung?: string; darstellung: "schiene" | "raster"; leistungen: Leistung[] }
export interface ZitatBaustein extends BausteinBasis { _type: "zitatBaustein"; zitat: string; inhalt?: RichText; bild?: Bild; bildText?: string }
/** Belegte Merkmale des Betriebs als Leiste (keine Kennzahlen). */
export const FAKT_SYMBOLE = ["siegel", "diplom", "uhr", "ort"] as const;
export type FaktSymbol = (typeof FAKT_SYMBOLE)[number];
export interface FaktenBaustein extends BausteinBasis { _type: "faktenBaustein"; fakten: { _key: string; titel: string; text: string; symbol: FaktSymbol }[] }
/** Einstiege nach Zielgruppe (Wohnen, Büro, Industrie), je mit Bild und Link in eine Leistung. */
export interface ZielgruppenBaustein extends BausteinBasis { _type: "zielgruppenBaustein"; einleitung?: string; gruppen: { _key: string; titel: string; text: string; bild?: Bild; link: Link }[] }
/** Ablauf in Schritten (echte Reihenfolge: planen, ausführen, warten). */
export interface AblaufBaustein extends BausteinBasis { _type: "ablaufBaustein"; einleitung?: string; schritte: { _key: string; titel: string; text: string; link?: Link }[]; knopf?: Link }
export interface SpaltenBaustein extends BausteinBasis { _type: "spaltenBaustein"; einleitung?: string; spalten: { _key: string; titel: string; inhalt: RichText }[] }
export interface NotfallBaustein extends BausteinBasis { _type: "notfallBaustein"; einleitung?: string; mitGebieten: boolean; kompakt?: boolean }
export interface TeamBaustein extends BausteinBasis { _type: "teamBaustein"; einleitung?: string; team: Teammitglied[] }
export interface PartnerBaustein extends BausteinBasis { _type: "partnerBaustein"; einleitung?: string; partner: Partner[] }
export interface KontaktBaustein extends BausteinBasis { _type: "kontaktBaustein"; einleitung?: string; mitFormular: boolean; mitOeffnungszeiten: boolean }
export interface AufrufBaustein extends BausteinBasis { _type: "aufrufBaustein"; text?: string; knopf: Link; zweiterKnopf?: Link }
export interface HinweisBaustein extends BausteinBasis { _type: "hinweisBaustein"; inhalt: RichText; art: "info" | "wichtig" }

export type Baustein = TextBaustein | LeistungenBaustein | ZitatBaustein | SpaltenBaustein | NotfallBaustein | TeamBaustein | PartnerBaustein | KontaktBaustein | AufrufBaustein | HinweisBaustein | FaktenBaustein | ZielgruppenBaustein | AblaufBaustein;
export const BEKANNTE_BAUSTEINE: ReadonlySet<string> = new Set(["textBaustein", "leistungenBaustein", "zitatBaustein", "spaltenBaustein", "notfallBaustein", "teamBaustein", "partnerBaustein", "kontaktBaustein", "aufrufBaustein", "hinweisBaustein", "faktenBaustein", "zielgruppenBaustein", "ablaufBaustein"]);

export interface Hero {
  titel: string;
  text?: string;
  knopf?: Link;
  zweiterKnopf?: Link;
  bild?: Bild;
  /** «verteiler» = Startseite mit Direkteinstieg-Panel aller Leistungen; «bildband» = Titel mit Bildband; «kompakt» = Titelblock */
  variante: "verteiler" | "bildband" | "kompakt";
  /** Nur «verteiler»: alle Leistungen, vom Adapter aufgelöst */
  leistungen?: Leistung[];
  /** Nur «verteiler»: Überschrift des Panels */
  panelTitel?: string;
}

export interface Seite {
  id: string;
  slug: string; // «start» für die Startseite
  titel: string;
  art: "seite" | "rechtliches";
  teaser?: string;
  seoTitel?: string;
  seoBeschreibung?: string;
  /** Adressen auf der bisherigen Website, für spätere Weiterleitungen */
  alteUrls: string[];
  /** Für Rechtstexte: Stand des Textes */
  stand?: string;
  hero?: Hero;
  bausteine: Baustein[];
  quelle?: string;
}

export type SeitenTeaser = Pick<Seite, "slug" | "titel" | "art" | "teaser">;

/** Pfad einer Seite («start» → «/», sonst «/slug/»). */
export const seitenPfad = (slug: string) => (slug === "start" ? "/" : `/${slug}/`);
export const LEISTUNGEN_BASIS = "elektroinstallationen";
export const leistungPfad = (slug: string) => `/${LEISTUNGEN_BASIS}/${slug}/`;

export interface Inhaltsquelle {
  getEinstellungen(): Promise<Einstellungen>;
  getTexte(): Promise<Texte>;
  getSeite(slug: string): Promise<Seite | null>;
  getAlleSeiten(): Promise<SeitenTeaser[]>;
  getLeistungen(): Promise<Leistung[]>;
  getLeistung(slug: string): Promise<Leistung | null>;
  getTeam(): Promise<Teammitglied[]>;
  getPartner(): Promise<Partner[]>;
}
