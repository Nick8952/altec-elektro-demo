import { defineArrayMember, defineField, defineType } from "sanity";

/** Bild mit Pflicht-Alt-Text. */
export const bildTyp = defineType({
  name: "bild",
  title: "Bild",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({ name: "alt", title: "Alternativtext", type: "string", description: "Beschreibt das Bild für Screenreader und Suchmaschinen. Pflichtfeld. Keine Stockfotos als Team- oder Referenzbilder bezeichnen.", validation: (r) => r.required().max(200) }),
  ],
});

export const linkRegel = (wert: unknown) => {
  if (typeof wert !== "string") return true;
  const ok = /^\/(?!\/)/.test(wert) || /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:\+?[\d\s()-]+)$/.test(wert);
  return ok || "Erlaubt sind interne Pfade (/…/), http(s)://…, mailto:… und tel:…";
};

export const linkTyp = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "titel", title: "Beschriftung", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ziel", title: "Ziel", type: "string", description: "Interner Pfad (z. B. /kontakt/), externe Adresse (https://…), tel:… oder mailto:…", validation: (r) => r.required().custom(linkRegel) }),
    defineField({ name: "extern", title: "In neuem Tab öffnen", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "titel", subtitle: "ziel" } },
});

export const navEintragTyp = defineType({
  name: "navEintrag",
  title: "Menüpunkt",
  type: "object",
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ziel", title: "Zielseite", type: "string", validation: (r) => r.required().custom(linkRegel) }),
    defineField({ name: "kinder", title: "Untermenü", type: "array", of: [defineArrayMember({ type: "link" })], validation: (r) => r.max(12), description: "Leer lassen für einen einfachen Menüpunkt. Für «Elektroinstallationen»: die acht Leistungen." }),
  ],
  preview: { select: { title: "titel", kinder: "kinder" }, prepare: ({ title, kinder }) => ({ title, subtitle: kinder?.length ? `${kinder.length} Untereinträge` : "ohne Untermenü" }) },
});

/** Formatierter Text: Absätze, Zwischentitel, Listen, Zitat, Links, fett/kursiv. */
export const richTextTyp = defineType({
  name: "richText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Absatz", value: "normal" },
        { title: "Zwischentitel", value: "h2" },
        { title: "Untertitel", value: "h3" },
        { title: "Kleiner Titel", value: "h4" },
        { title: "Zitat", value: "blockquote" },
      ],
      lists: [
        { title: "Aufzählung", value: "bullet" },
        { title: "Nummerierung", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Fett", value: "strong" },
          { title: "Kursiv", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({ name: "href", title: "Adresse", type: "string", validation: (r) => r.required().custom(linkRegel) }),
              defineField({ name: "extern", title: "In neuem Tab öffnen", type: "boolean", initialValue: false }),
            ],
          },
        ],
      },
    }),
  ],
});

export const adresseTyp = defineType({
  name: "adresse",
  title: "Adresse",
  type: "object",
  fields: [
    defineField({ name: "strasse", title: "Strasse und Nr.", type: "string", validation: (r) => r.required() }),
    defineField({ name: "plz", title: "PLZ", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ort", title: "Ort", type: "string", validation: (r) => r.required() }),
    defineField({ name: "quartier", title: "Quartier (z. B. Seefeld)", type: "string" }),
    defineField({ name: "land", title: "Land", type: "string", initialValue: "Schweiz" }),
  ],
});

export const WOCHENTAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const ZEIT = /^([01]\d|2[0-3]):[0-5]\d$/;

export const oeffnungszeitTyp = defineType({
  name: "oeffnungszeit",
  title: "Öffnungszeit",
  type: "object",
  fields: [
    defineField({ name: "tage", title: "Tage (Anzeige)", type: "string", description: "z. B. «Montag bis Freitag»", validation: (r) => r.required() }),
    defineField({ name: "zeiten", title: "Zeiten (Anzeige)", type: "string", description: "z. B. «08.00–12.00 und 13.00–17.00 Uhr»", validation: (r) => r.required() }),
    defineField({ name: "wochentage", title: "Wochentage (für Suchmaschinen)", type: "array", of: [defineArrayMember({ type: "string" })], options: { list: WOCHENTAGE }, validation: (r) => r.required().min(1) }),
    defineField({
      name: "intervalle", title: "Zeitspannen (für Suchmaschinen)", type: "array",
      of: [defineArrayMember({ type: "object", name: "intervall", fields: [defineField({ name: "von", title: "Von (HH:MM)", type: "string", validation: (r) => r.required().regex(ZEIT, { name: "Uhrzeit" }) }), defineField({ name: "bis", title: "Bis (HH:MM)", type: "string", validation: (r) => r.required().regex(ZEIT, { name: "Uhrzeit" }) })], preview: { select: { von: "von", bis: "bis" }, prepare: ({ von, bis }) => ({ title: `${von}–${bis}` }) } })],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: { select: { title: "tage", subtitle: "zeiten" } },
});

export const notfallTyp = defineType({
  name: "notfall",
  title: "Notfall-/Pikettdienst",
  type: "object",
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
    defineField({ name: "verfuegbarkeit", title: "Verfügbarkeit (kurz)", type: "string", description: "z. B. «7×24 Stunden, 365 Tage im Jahr». Keine Anfahrtszeiten oder Tarife versprechen, die nicht gelten.", validation: (r) => r.required() }),
    defineField({ name: "text", title: "Beschreibung", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "nummern", title: "Notfallnummern", type: "array", of: [defineArrayMember({ type: "string" })], validation: (r) => r.required().min(1).max(3) }),
    defineField({ name: "quartiere", title: "Quartiere mit kurzer Anfahrt", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "agglomeration", title: "Gemeinden in der Agglomeration", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "hinweis", title: "Hinweis zu den Ortsangaben", type: "string" }),
  ],
});
