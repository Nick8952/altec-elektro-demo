import { defineArrayMember, defineField, defineType } from "sanity";
import { bausteinMitglieder } from "./bausteine";
import { linkRegel } from "./objekte";

const reihenfolge = defineField({ name: "reihenfolge", title: "Reihenfolge", type: "number", validation: (r) => r.required().integer() });
/** Slug einer Seite: ein Segment, nicht «elektroinstallationen» (für Leistungen reserviert), eindeutig über alle Seiten; «start» nur einmal. */
const slugRegel = async (s: { current?: string } | undefined, ctx: { document?: { _id?: string }; getClient: (o: { apiVersion: string }) => { fetch: (q: string, p: Record<string, unknown>) => Promise<number> } }) => {
  const wert = s?.current;
  if (!wert) return true;
  if (!/^[a-z0-9-]+$/.test(wert)) return "Nur Kleinbuchstaben, Ziffern und Bindestriche, keine Schrägstriche.";
  if (wert === "elektroinstallationen" || wert.startsWith("elektroinstallationen-")) {
    if (wert !== "elektroinstallationen") return "Der Pfad /elektroinstallationen/… ist für Leistungen reserviert.";
  }
  const id = (ctx.document?._id ?? "").replace(/^drafts\./, "");
  const doppelt = await ctx.getClient({ apiVersion: "2026-09-25" }).fetch(`count(*[_type == "seite" && slug.current == $slug && !(_id in [$id, "drafts." + $id])])`, { slug: wert, id });
  return doppelt === 0 || `Der Slug «${wert}» wird bereits von einer anderen Seite verwendet.`;
};

/** Unternehmensdaten: genau ein Dokument. */
export const einstellungenTyp = defineType({
  name: "einstellungen",
  title: "Unternehmensdaten",
  type: "document",
  groups: [
    { name: "firma", title: "Firma", default: true },
    { name: "kontakt", title: "Kontakt & Bürozeiten" },
    { name: "notfall", title: "Notfalldienst" },
    { name: "bilder", title: "Logo & Bilder" },
  ],
  fields: [
    defineField({ name: "firma", title: "Firma (vollständig)", type: "string", group: "firma", description: "Erscheint im Impressum, in den Titeln und in den strukturierten Daten.", validation: (r) => r.required() }),
    defineField({ name: "kurzname", title: "Kurzname", type: "string", group: "firma", validation: (r) => r.required() }),
    defineField({ name: "claim", title: "Untertitel / Claim", type: "string", group: "firma", validation: (r) => r.required().max(120) }),
    defineField({ name: "adresse", title: "Adresse", type: "adresse", group: "kontakt", validation: (r) => r.required() }),
    defineField({ name: "telefon", title: "Telefon", type: "string", group: "kontakt", validation: (r) => r.required() }),
    defineField({ name: "fax", title: "Fax", type: "string", group: "kontakt" }),
    defineField({ name: "email", title: "E-Mail", type: "string", group: "kontakt", validation: (r) => r.required().email() }),
    defineField({ name: "oeffnungszeiten", title: "Büroöffnungszeiten", type: "array", group: "kontakt", of: [defineArrayMember({ type: "oeffnungszeit" })], validation: (r) => r.required().min(1) }),
    defineField({ name: "oeffnungszeitenText", title: "Text zu den Bürozeiten", type: "text", rows: 3, group: "kontakt", validation: (r) => r.required() }),
    defineField({ name: "routenlink", title: "Routenlink (externer Kartendienst)", type: "url", group: "kontakt", description: "Wird nur verlinkt, nie eingebettet.", validation: (r) => r.required() }),
    defineField({ name: "geo", title: "Koordinaten (für Suchmaschinen)", type: "object", group: "kontakt", fields: [defineField({ name: "breite", title: "Breitengrad", type: "number" }), defineField({ name: "laenge", title: "Längengrad", type: "number" })] }),
    defineField({ name: "notfall", title: "Notfall-/Pikettdienst", type: "notfall", group: "notfall", validation: (r) => r.required() }),
    defineField({ name: "logo", title: "Logo (Bilddatei; Standard ist die Vektor-Marke im Code)", type: "bild", group: "bilder" }),
    defineField({ name: "seoBild", title: "Vorschaubild (Teilen in sozialen Medien)", type: "bild", group: "bilder" }),
  ],
  preview: { prepare: () => ({ title: "Unternehmensdaten" }) },
});

export const texteTyp = defineType({
  name: "texte",
  title: "Website-Texte",
  type: "document",
  groups: [
    { name: "navigation", title: "Navigation & Footer", default: true },
    { name: "seo", title: "Suchmaschinen" },
    { name: "ui", title: "Bedienelemente" },
    { name: "formular", title: "Kontaktanfrage" },
    { name: "einwilligung", title: "Datenschutz-Einstellungen" },
  ],
  fields: [
    defineField({ name: "navigation", title: "Hauptnavigation", type: "array", of: [defineArrayMember({ type: "navEintrag" })], validation: (r) => r.required().min(1).max(6), group: "navigation" }),
    defineField({ name: "kopfKnopf", title: "Roter Knopf in der Kopfzeile (Notfallnummer)", type: "link", group: "navigation", validation: (r) => r.required() }),
    defineField({ name: "mobilLeiste", title: "Mobile Kontaktleiste", type: "object", group: "navigation", fields: [defineField({ name: "anrufen", title: "Beschriftung «Anrufen»", type: "string", validation: (r) => r.required() }), defineField({ name: "anfragen", title: "Zweiter Knopf", type: "link", validation: (r) => r.required() })] }),
    defineField({
      name: "footer", title: "Fusszeile", type: "object", group: "navigation",
      fields: [
        defineField({ name: "gruppen", title: "Linkgruppen", type: "array", of: [defineArrayMember({ type: "object", name: "footerGruppe", fields: [defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }), defineField({ name: "links", title: "Links", type: "array", of: [defineArrayMember({ type: "link" })] })], preview: { select: { title: "titel" } } })], validation: (r) => r.max(3) }),
        defineField({ name: "rechtslinks", title: "Rechtliche Links", type: "array", of: [defineArrayMember({ type: "link" })], validation: (r) => r.required().min(2) }),
        defineField({ name: "demoHinweis", title: "Demo-Hinweis", type: "string", description: "Kurzer Hinweis am Seitenende, solange die Website eine Demo ist. Beim Go-Live leeren." }),
      ],
    }),
    defineField({ name: "seo", title: "Suchmaschinen", type: "object", group: "seo", fields: [defineField({ name: "titelZusatz", title: "Zusatz im Browser-Titel", type: "string", validation: (r) => r.required() }), defineField({ name: "beschreibung", title: "Standard-Beschreibung", type: "text", rows: 3, validation: (r) => r.required().max(170) })] }),
    defineField({
      name: "ui", title: "Bedienelemente", type: "object", group: "ui", description: "Beschriftungen von Knöpfen, Menüs und Hinweisen. Die Feldnamen sind technisch, die Werte frei.",
      fields: ["zumInhalt", "menue", "menueSchliessen", "hauptnavigation", "notfallKurz", "notfalldienst", "buerozeiten", "mehrErfahren", "alleLeistungen", "weitereLeistungen", "vorherigeLeistung", "naechsteLeistung", "zurUebersicht", "telefon", "fax", "email", "adresse", "route", "seiteNichtGefunden", "seiteNichtGefundenText", "zurStartseite", "quartiere", "agglomeration", "notfallnummern", "erreichbarkeit", "stand", "anrufen", "kontaktAlternative", "webseite"].map((n) => defineField({ name: n, title: n, type: "string", validation: (r) => r.required() })),
    }),
    defineField({
      name: "formular", title: "Kontaktanfrage («E-Mail vorbereiten»)", type: "object", group: "formular",
      fields: [
        ...["titel", "einleitung", "name", "email", "telefon", "betreff", "nachricht", "nachrichtHilfe", "pflicht", "fehlerName", "fehlerEmail", "fehlerNachricht", "emailVorbereiten", "hinweisNachher", "datenschutzHinweis"].map((n) => defineField({ name: n, title: n, type: n === "einleitung" || n === "hinweisNachher" ? "text" : "string", validation: (r) => r.required() })),
        defineField({ name: "betreffOptionen", title: "Auswahl «Anliegen»", type: "array", of: [defineArrayMember({ type: "object", name: "option", fields: [defineField({ name: "wert", title: "Kennung", type: "string", validation: (r) => r.required() }), defineField({ name: "titel", title: "Beschriftung", type: "string", validation: (r) => r.required() })], preview: { select: { title: "titel", subtitle: "wert" } } })], validation: (r) => r.required().min(1) }),
      ],
    }),
    defineField({
      name: "einwilligung", title: "Datenschutz-Einstellungen (Cookie-Banner)", type: "object", group: "einwilligung",
      description: "Der Banner erscheint nur, wenn mindestens eine optionale Kategorie eingetragen ist. Ohne Dienste Dritter bleibt die Liste leer.",
      fields: [
        ...["bannerTitel", "bannerText", "alleAkzeptieren", "nurNotwendige", "einstellungen", "auswahlSpeichern", "widerrufen", "notwendigTitel", "notwendigText", "datenschutzerklaerung"].map((n) => defineField({ name: n, title: n, type: n === "bannerText" || n === "notwendigText" ? "text" : "string", validation: (r) => r.required() })),
        defineField({ name: "kategorien", title: "Optionale Kategorien", type: "array", of: [defineArrayMember({ type: "object", name: "kategorie", fields: [defineField({ name: "kennung", title: "Kennung (technisch, z. B. karten)", type: "string", validation: (r) => r.required().regex(/^[a-z]+$/, { name: "Kennung" }) }), defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }), defineField({ name: "beschreibung", title: "Beschreibung", type: "text", rows: 2, validation: (r) => r.required() })], preview: { select: { title: "titel", subtitle: "kennung" } } })] }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Website-Texte" }) },
});

export const seiteTyp = defineType({
  name: "seite",
  title: "Seite",
  type: "document",
  groups: [
    { name: "inhalt", title: "Inhalt", default: true },
    { name: "kopf", title: "Seitenanfang" },
    { name: "seo", title: "Suchmaschinen" },
    { name: "herkunft", title: "Herkunft" },
  ],
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", group: "inhalt", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Adresse (Slug)", type: "slug", group: "inhalt", options: { source: "titel" }, description: "«start» = Startseite (genau einmal). Sonst z. B. «kontakt» → /kontakt/. Der Pfad /elektroinstallationen/… ist für Leistungen reserviert.", validation: (r) => r.required().custom(slugRegel) }),
    defineField({ name: "art", title: "Art", type: "string", group: "inhalt", options: { list: [{ title: "Seite", value: "seite" }, { title: "Rechtstext (Impressum, Datenschutz)", value: "rechtliches" }], layout: "radio" }, initialValue: "seite", validation: (r) => r.required() }),
    defineField({ name: "teaser", title: "Kurzbeschreibung", type: "text", rows: 2, group: "inhalt" }),
    defineField({ name: "stand", title: "Stand (nur Rechtstexte)", type: "string", group: "inhalt" }),
    defineField({
      name: "hero", title: "Seitenanfang", type: "object", group: "kopf",
      fields: [
        defineField({ name: "variante", title: "Darstellung", type: "string", options: { list: [{ title: "Verteiler (Startseite: Titel + Direkteinstieg zu allen Leistungen)", value: "verteiler" }, { title: "Bildband", value: "bildband" }, { title: "Kompakt", value: "kompakt" }], layout: "radio" }, initialValue: "kompakt", validation: (r) => r.required() }),
        defineField({ name: "panelTitel", title: "Titel des Direkteinstieg-Panels (nur Verteiler)", type: "string" }),
        defineField({ name: "titel", title: "Überschrift", type: "string", validation: (r) => r.required().max(90) }),
        defineField({ name: "text", title: "Einleitung", type: "text", rows: 3, validation: (r) => r.max(400) }),
        defineField({ name: "knopf", title: "Knopf", type: "link" }),
        defineField({ name: "zweiterKnopf", title: "Zweiter Knopf", type: "link" }),
        defineField({ name: "bild", title: "Bild (nur Bildband)", type: "bild" }),
      ],
    }),
    defineField({ name: "bausteine", title: "Bausteine", type: "array", group: "inhalt", of: bausteinMitglieder, validation: (r) => r.required().min(1) }),
    defineField({ name: "seoTitel", title: "Titel für Suchmaschinen", type: "string", group: "seo", validation: (r) => r.max(70) }),
    defineField({ name: "seoBeschreibung", title: "Beschreibung für Suchmaschinen", type: "text", rows: 3, group: "seo", validation: (r) => r.max(170) }),
    defineField({ name: "alteUrls", title: "Bisherige Adressen (Weiterleitungen)", type: "array", of: [defineArrayMember({ type: "string" })], group: "herkunft" }),
    defineField({ name: "quelle", title: "Quelle", type: "url", group: "herkunft", description: "Adresse auf der bisherigen Website, von der die Inhalte stammen." }),
  ],
  preview: { select: { title: "titel", subtitle: "slug.current" } },
});

export const leistungTyp = defineType({
  name: "leistung",
  title: "Leistung",
  type: "document",
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
    defineField({ name: "kurztitel", title: "Kurztitel (Menü, enge Stellen)", type: "string", validation: (r) => r.required().max(24) }),
    defineField({
      name: "slug", title: "Adresse (Slug)", type: "slug", options: { source: "titel" }, description: "Erscheint unter /elektroinstallationen/<slug>/",
      validation: (r) => r.required().custom(async (s, ctx) => {
        if (!s?.current) return true;
        if (!/^[a-z0-9-]+$/.test(s.current)) return "Nur Kleinbuchstaben, Ziffern und Bindestriche.";
        const id = (ctx.document?._id ?? "").replace(/^drafts\./, "");
        const doppelt = await ctx.getClient({ apiVersion: "2026-09-25" }).fetch<number>(`count(*[_type == "leistung" && slug.current == $slug && !(_id in [$id, "drafts." + $id])])`, { slug: s.current, id });
        return doppelt === 0 || `Der Slug «${s.current}» wird bereits von einer anderen Leistung verwendet.`;
      }),
    }),
    defineField({ name: "symbol", title: "Schema-Symbol", type: "string", options: { list: [{ title: "Plan", value: "plan" }, { title: "Schalter (Service)", value: "service" }, { title: "Sicherung (Bau)", value: "bau" }, { title: "Motor", value: "motor" }, { title: "Lampe", value: "lampe" }, { title: "Steckdose", value: "steckdose" }, { title: "Antenne", value: "antenne" }, { title: "Glocke (Alarm)", value: "alarm" }] }, validation: (r) => r.required() }),
    defineField({ name: "kurz", title: "Kurztext (Übersicht)", type: "text", rows: 3, validation: (r) => r.required().max(240) }),
    defineField({ name: "inhalt", title: "Text der Detailseite", type: "richText", description: "Der erste Absatz wiederholt den Kurztext (wie auf der bisherigen Website) und wird auf der Detailseite als Einleitung gezeigt.", validation: (r) => r.required() }),
    defineField({ name: "bild", title: "Bild", type: "bild" }),
    defineField({ name: "seoBeschreibung", title: "Beschreibung für Suchmaschinen", type: "text", rows: 3, validation: (r) => r.max(170) }),
    reihenfolge,
    defineField({ name: "alteUrl", title: "Bisherige Adresse", type: "string", validation: (r) => r.custom(linkRegel) }),
    defineField({ name: "quelle", title: "Quelle", type: "url" }),
  ],
  orderings: [{ title: "Reihenfolge", name: "reihenfolge", by: [{ field: "reihenfolge", direction: "asc" }] }],
  preview: { select: { title: "titel", subtitle: "kurz" } },
});

export const teammitgliedTyp = defineType({
  name: "teammitglied",
  title: "Teammitglied",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "funktion", title: "Funktion", type: "string", validation: (r) => r.required() }),
    reihenfolge,
  ],
  orderings: [{ title: "Reihenfolge", name: "reihenfolge", by: [{ field: "reihenfolge", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "funktion" } },
});

export const partnerTyp = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "logo", title: "Logo", type: "bild", validation: (r) => r.required() }),
    defineField({ name: "url", title: "Website (optional)", type: "url", validation: (r) => r.uri({ scheme: ["http", "https"] }) }),
    reihenfolge,
  ],
  orderings: [{ title: "Reihenfolge", name: "reihenfolge", by: [{ field: "reihenfolge", direction: "asc" }] }],
  preview: { select: { title: "name", media: "logo" } },
});
