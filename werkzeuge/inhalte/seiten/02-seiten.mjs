import { b, text, pt, bild } from "../pt.mjs";

// Texte wörtlich von altec-elektro.ch (Stand 25.09.2026), sprachlich geglättet. Siehe docs/INHALTSMATRIX.md.
export default [
  {
    slug: "start", titel: "Elektroinstallationen in Zürich", art: "seite",
    seoTitel: "Elektroinstallationen und Telekommunikation, Zürich Seefeld",
    seoBeschreibung: "Altec Elektro GmbH, Zürich Seefeld: Elektroplanung und Elektroinstallationen für Stark- und Schwachstrom, Telekommunikation, Service und 7×24-Stunden-Notfalldienst.",
    alteUrls: ["/"], quelle: "https://www.altec-elektro.ch/",
    hero: {
      variante: "bildband",
      titel: "Elektroinstallationen für Zürich. Geplant, ausgeführt, gewartet.",
      text: "Elektroplanung, Starkstrom und Schwachstrom für Wohn-, Büro-, Industrie- und Gewerbebauten, aus dem Zürcher Seefeld.",
      knopf: { titel: "Projekt anfragen", ziel: "/kontakt/" },
      zweiterKnopf: { titel: "Notfalldienst anrufen", ziel: "tel:+41448400770" },
      bild: bild("hero-zuerich", "Zürich am Abend: Limmatquai mit Blick auf die Altstadt"),
    },
    bausteine: [
      b("leistungenBaustein", { anker: "leistungen", titel: "Unsere Leistungen", darstellung: "schiene", einleitung: "Stark- und Schwachstrom: Planung und Projektierung, Service und Unterhalt, Beleuchtung, Telekommunikation, Multimedia, Kabelfernseh-Systeme und SAT-Anlagen." }),
      b("zitatBaustein", {
        anker: "unternehmen",
        zitat: "Wir kümmern uns um alles, was mit Elektrizität und Telekommunikation zu tun hat.",
        inhalt: pt(`Zum Kerngeschäft der Altec Elektro GmbH gehören die Elektroplanung, die Projektierung sowie die Ausführung von Elektroinstallationen im Bereich Starkstrom und Schwachstrom für Neu- und Umbauten von Wohn-, Büro-, Industrie- und Gewerbebauten.

Dank der zentralen Lage im Zürcher Seefeld sind unsere Elektriker für Sie in der Stadt Zürich sowie in den umliegenden Agglomerationen schnell vor Ort.`),
      }),
      b("notfallBaustein", { anker: "notfall", mitGebieten: true }),
      b("teamBaustein", { anker: "team", titel: "Team", einleitung: "Wir sind ein junges, dynamisches Team mit eingespielten und motivierten Mitarbeitern. Wir beschäftigen nur ausgewiesene Fachleute mit einer soliden Fachkompetenz und langjähriger Berufserfahrung." }),
      b("partnerBaustein", { anker: "partner", titel: "Unsere Partner", einleitung: "Hohe Qualitätsansprüche erfordern gute und zuverlässige Partner. Gemeinsam sind wir stark!" }),
      b("kontaktBaustein", { anker: "kontakt", titel: "Kontakt", mitFormular: false, mitOeffnungszeiten: true }),
    ],
  },
  {
    slug: "elektroinstallationen", titel: "Elektroinstallationen", art: "seite",
    teaser: "Stark- und Schwachstrom: acht Leistungsbereiche, von der Planung bis zum Notfalldienst.",
    seoBeschreibung: "Elektroinstallationen in Zürich: Planung, Service und Unterhalt, Neu- und Umbauten, Industrie und Gewerbe, Beleuchtung, Apparate, Telekommunikation, Sicherheit.",
    alteUrls: ["/elektroinstallationen", "/dienstleistungen-b"], quelle: "https://www.altec-elektro.ch/elektroinstallationen",
    hero: { variante: "kompakt", titel: "Elektroinstallationen", text: "Stark- und Schwachstrom: Planung und Projektierung, Service und Unterhalt, Beleuchtung, Telekommunikation, Multimedia, Kabelfernseh-Systeme und SAT-Anlagen." },
    bausteine: [
      b("leistungenBaustein", { anker: "leistungen", darstellung: "raster" }),
      b("aufrufBaustein", { titel: "Nicht sicher, welcher Bereich passt?", text: "Beschreiben Sie uns Ihr Vorhaben. Wir sagen Ihnen, was nötig ist.", knopf: { titel: "Projekt anfragen", ziel: "/kontakt/" }, zweiterKnopf: { titel: "Notfalldienst anrufen", ziel: "tel:+41448400770" } }),
    ],
  },
  {
    slug: "notfalldienst", titel: "7×24-Stunden-Notfall/Pikett", art: "seite",
    teaser: "Notfalldienst an 365 Tagen im Jahr mit qualifizierten Elektroinstallateuren.",
    seoTitel: "7×24-Stunden-Notfall/Pikett, Elektriker Zürich",
    seoBeschreibung: "Notfall-Elektriker Zürich: 7×24-Stunden-Notfall-/Pikettservice an 365 Tagen. Notfallnummern 044 840 07 70 und 079 653 83 99. Schnell vor Ort in Zürich und Umgebung.",
    alteUrls: ["/7x24-stunden-notfall-pikett", "/7x24-stunden-notfall-pikett-b"], quelle: "https://www.altec-elektro.ch/7x24-stunden-notfall-pikett",
    hero: { variante: "kompakt", titel: "7×24-Stunden-Notfall/Pikett", text: "Wir bieten einen 7×24-Stunden-Notfall-/Pikettservice an 365 Tagen im Jahr und stellen Ihnen für den Notfalldienst nur qualifizierte Elektroinstallateure zur Verfügung. Auf Ihren Notfall-Elektriker ist Verlass!", knopf: { titel: "Notfalldienst anrufen", ziel: "tel:+41448400770" } },
    bausteine: [
      b("notfallBaustein", { anker: "nummern", titel: "Rufen Sie uns über die Notfalldienst-Nummer an", einleitung: "Dank der zentralen Lage im Zürcher Seefeld können unsere Elektriker insbesondere in den Quartieren Riesbach, Mühlebach, Hottingen, Hirslanden und Fluntern schnell vor Ort sein. Aber auch in der Stadt Zürich sowie in den umliegenden Agglomerationen vom Kanton Zürich, wie Zollikon, Zollikerberg, Zumikon, Küssnacht, Erlenbach, Herrliberg.", mitGebieten: true }),
      text(`## Wann Sie den Notfalldienst anrufen

Ist es dunkel im Raum, oder ist die Heizung kalt? Können Sie mit dem Kochherdschalter das Wohnzimmerlicht regeln, oder klingelt das Telefon nicht mehr? Selbst den seltensten Phänomenen kommen wir auf die Spur. Wir sind für Sie schnell zur Stelle und finden die passende Lösung für Ihr Problem.

Ausserhalb der Büroöffnungszeiten (Montag bis Freitag, 08.00–12.00 und 13.00–17.00 Uhr) erreichen Sie uns in Notfällen selbstverständlich auch am Abend und am Wochenende.`, { breite: "schmal" }),
      b("hinweisBaustein", { art: "info", inhalt: pt(`Die bisherige Website nennt keine Anfahrtszeiten und keine Notfalltarife. Diese Demo verspricht deshalb bewusst keine. Angaben dazu kann die Altec Elektro GmbH jederzeit ergänzen.`) }),
    ],
  },
  {
    slug: "team", titel: "Team", art: "seite",
    teaser: "Wir über uns: Geschäftsführung, Finanzen/Marketing und fachkundige Leitung.",
    seoTitel: "Team, wir über uns",
    seoBeschreibung: "Das Team der Altec Elektro GmbH in Zürich: Alek Mjekici (Geschäftsführer), Adrian Mjeku (Leitung Finanzen/Marketing), Ulrich Küttel (Fachkundiger Leiter).",
    alteUrls: ["/team", "/team-b"], quelle: "https://www.altec-elektro.ch/team",
    hero: { variante: "kompakt", titel: "Team, wir über uns", text: "Wir sind ein junges, dynamisches Team mit eingespielten und motivierten Mitarbeitern. Wir beschäftigen nur ausgewiesene Fachleute mit einer soliden Fachkompetenz und langjähriger Berufserfahrung." },
    bausteine: [
      b("teamBaustein", { anker: "team", einleitung: "Für die technische Aufsicht ist der eidgenössisch diplomierte Installateur zuständig." }),
      b("aufrufBaustein", { titel: "Sie möchten mit uns arbeiten?", text: "Ob Projekt oder Störung: Rufen Sie an oder schreiben Sie uns.", knopf: { titel: "Projekt anfragen", ziel: "/kontakt/" }, zweiterKnopf: { titel: "044 840 07 70", ziel: "tel:+41448400770" } }),
    ],
  },
  {
    slug: "partner", titel: "Unsere Partner", art: "seite",
    teaser: "Lieferanten, Kunden, Mitarbeiter, Kapitalgeber, der Staat und die Konkurrenz: unsere Partner.",
    seoBeschreibung: "Partner der Altec Elektro GmbH: Protectas, Otto Fischer, Komma3, Heinz von Heiden, ATC Treuhand, Winterhalder Fenner.",
    alteUrls: ["/unsere-partner", "/unsere-partner-b"], quelle: "https://www.altec-elektro.ch/unsere-partner",
    hero: { variante: "kompakt", titel: "Unsere Partner", text: "Hohe Qualitätsansprüche und unterschiedliche Erwartungen aller Interessensgruppen erfordern gute, zuverlässige und faire Partner! Dazu zählen wir unsere Lieferanten, Kunden, Mitarbeiter, Kapitalgeber, den Staat, aber auch die Konkurrenz. Zusammen erkunden wir kontinuierlich allgemeine Entwicklungstendenzen." },
    bausteine: [
      b("partnerBaustein", { anker: "partner" }),
      b("hinweisBaustein", { art: "info", inhalt: pt(`Die Logos stammen von der bisherigen Website. Verlinkt sind nur die Partner, die dort ebenfalls verlinkt waren (Komma3, ATC Treuhand). Die übrigen Partner-Websites können nach Rücksprache ergänzt werden.`) }),
    ],
  },
  {
    slug: "kontakt", titel: "Kontakt", art: "seite",
    teaser: "Telefon, E-Mail, Adresse, Büroöffnungszeiten und Projektanfrage.",
    seoBeschreibung: "Kontakt: Altec Elektro GmbH, Hedwigstrasse 12, 8032 Zürich. Telefon +41 44 840 07 70, info@altec-elektro.ch. Büro Montag bis Freitag 08.00–12.00 und 13.00–17.00 Uhr.",
    alteUrls: ["/kontakt", "/kontakt-b"], quelle: "https://www.altec-elektro.ch/kontakt",
    hero: { variante: "kompakt", titel: "Kontakt", text: "Unser Sekretariat ist von Montag bis Freitag von 08.00 bis 12.00 Uhr und von 13.00 bis 17.00 Uhr geöffnet. Rufen Sie uns an oder schreiben Sie uns eine E-Mail. In Notfällen erreichen Sie uns selbstverständlich auch am Abend und am Wochenende." },
    bausteine: [
      b("kontaktBaustein", { anker: "kontakt", mitFormular: true, mitOeffnungszeiten: true }),
      b("notfallBaustein", { anker: "notfall", mitGebieten: false, kompakt: true }),
    ],
  },
];
