import { pt, bild } from "../pt.mjs";
export const art = "leistungen";

// Reihenfolge und Texte wie auf https://www.altec-elektro.ch/elektroinstallationen und den Detailseiten.
// Sprachliche Glättung (Rechtschreibung, Zeichensetzung) dokumentiert in docs/INHALTSMATRIX.md.
export default [
  {
    id: "leistung-planung", slug: "planung-und-projektierung", titel: "Planung und Projektierung", kurztitel: "Planung", symbol: "plan", reihenfolge: 1,
    kurz: "Wir bieten langjährige Erfahrung im Bereich Planung und Projektierung von elektrischen Installationen an Neu- und Umbauten.",
    inhalt: pt(`Wir bieten langjährige Erfahrung im Bereich Planung und Projektierung von elektrischen Installationen an Neu- und Umbauten.

Schemas und Pläne werden auf CAD gezeichnet und dem Kunden als Farbdruck ausgehändigt. Seit Jahren gehören die planerische Weitsicht und vorbildliche Qualität zu unseren besonderen Stärken.`),
    bild: bild("leistung-planung", "Elektroplan mit Farbstiften und Computermaus"),
    seoBeschreibung: "Planung und Projektierung elektrischer Installationen für Neu- und Umbauten in Zürich: Schemas und Pläne auf CAD, als Farbdruck ausgehändigt.",
    alteUrl: "/elektroinstallationen/42-planung-und-projektierung", quelle: "https://www.altec-elektro.ch/elektroinstallationen/42-planung-und-projektierung",
  },
  {
    id: "leistung-service", slug: "service-und-unterhalt", titel: "Service und Unterhalt", kurztitel: "Service", symbol: "service", reihenfolge: 2,
    kurz: "Selbst den seltensten Phänomenen kommen wir auf die Spur. Wir sind für Sie schnell zur Stelle und finden die passende Lösung für Ihr Problem.",
    inhalt: pt(`Selbst den seltensten Phänomenen kommen wir auf die Spur. Wir sind für Sie schnell zur Stelle und finden die passende Lösung für Ihr Problem.

Ist es dunkel im Raum, oder ist die Heizung kalt? Können Sie mit dem Kochherdschalter das Wohnzimmerlicht regeln, oder klingelt das Telefon nicht mehr?

Wir bieten Ihnen auch einen 7×24-Stunden-Notfall-/Pikettservice an, und das 365 Tage im Jahr. Für den Notfalldienst stellen wir Ihnen nur qualifizierte Elektroinstallateure zur Verfügung.`),
    bild: bild("leistung-service", "Lieferwagen wird an einem Kran über eine Winterlandschaft gehoben"),
    seoBeschreibung: "Service und Unterhalt in Zürich: Störungen finden und beheben, dazu ein 7×24-Stunden-Notfall-/Pikettservice an 365 Tagen im Jahr.",
    alteUrl: "/elektroinstallationen/25-service-und-unterhalt", quelle: "https://www.altec-elektro.ch/elektroinstallationen/25-service-und-unterhalt",
  },
  {
    id: "leistung-neubau", slug: "neu-und-umbauten", titel: "Neu- und Umbauten", kurztitel: "Neu- und Umbau", symbol: "bau", reihenfolge: 3,
    kurz: "Von der Sanierung Ihrer Altbauwohnung bis hin zum Neubauobjekt: Wir planen und führen Ihre Installationen termin- und fachgerecht aus.",
    inhalt: pt(`Von der Sanierung Ihrer Altbauwohnung bis hin zum Neubauobjekt: Wir planen und führen Ihre Installationen termin- und fachgerecht aus.

Vom Küchenumbau bis hin zur Neuerstellung einer digital vernetzten Villa. Wir sind für Sie da!`),
    bild: bild("leistung-neubau", "Rohbau mit Elektroinstallationen"),
    seoBeschreibung: "Elektroinstallationen für Neu- und Umbauten in Zürich: von der Sanierung der Altbauwohnung bis zum Neubauobjekt, termin- und fachgerecht.",
    alteUrl: "/elektroinstallationen/28-neu-und-umbauten", quelle: "https://www.altec-elektro.ch/elektroinstallationen/28-neu-und-umbauten",
  },
  {
    id: "leistung-industrie", slug: "industrie-und-gewerbe", titel: "Industrie und Gewerbe", kurztitel: "Industrie", symbol: "motor", reihenfolge: 4,
    kurz: "Sei es eine Lüftungsanlage oder eine Heizung, eine Förderanlage oder die Infrastruktur für einen Bürokomplex: Wir wissen damit umzugehen.",
    inhalt: pt(`Sei es eine Lüftungsanlage oder eine Heizung, eine Förderanlage oder die Infrastruktur für einen Bürokomplex: Wir wissen damit umzugehen.

Von der guten alten Schützensteuerung bis hin zur modernsten KNX-Steuerung, vom Heugebläsemotor bis zur frequenzumrichtergesteuerten Heizungspumpe. Während unserer langjährigen Tätigkeit im Bereich des Industrieservices haben wir einen grossen Erfahrungsschatz zusammengetragen.`),
    bild: bild("leistung-industrie", "Industrieanlage mit Schaltschrank"),
    seoBeschreibung: "Elektroinstallationen für Industrie und Gewerbe in Zürich: Lüftung, Heizung, Förderanlagen, Bürokomplexe, von der Schützensteuerung bis zur KNX-Steuerung.",
    alteUrl: "/elektroinstallationen/26-industrie-und-gewerbe", quelle: "https://www.altec-elektro.ch/elektroinstallationen/26-industrie-und-gewerbe",
  },
  {
    id: "leistung-beleuchtung", slug: "beleuchtung", titel: "Beleuchtung", kurztitel: "Beleuchtung", symbol: "lampe", reihenfolge: 5,
    kurz: "Im Leben eines Menschen spielt Licht unterdessen eine wichtige Rolle. Richtig eingesetzt kann es für Geborgenheit und Ruhe im Alltag sorgen.",
    inhalt: pt(`Im Leben eines Menschen spielt Licht unterdessen eine wichtige Rolle. Richtig eingesetzt kann es für Geborgenheit und Ruhe im Alltag sorgen.

Brauchen Sie mehr Licht im Wohnzimmer? Wollen Sie die Beleuchtung in der Lagerhalle Ihres Betriebes sanieren? Leiden Sie im Büro oft an Augenflimmern oder Kopfschmerzen?

Fragen Sie uns, wenn es um das Thema Licht geht. Bei uns werden Sie von kompetenten Fachleuten beraten.`),
    bild: bild("leistung-beleuchtung", "Beleuchtung in einem Wohnraum"),
    seoBeschreibung: "Beleuchtung in Zürich: Beratung durch Fachleute für Wohnzimmer, Lagerhalle und Büro, von mehr Licht bis zur Sanierung der Beleuchtung.",
    alteUrl: "/elektroinstallationen/27-beleuchtung", quelle: "https://www.altec-elektro.ch/elektroinstallationen/27-beleuchtung",
  },
  {
    id: "leistung-apparate", slug: "apparateverkauf-und-einbau", titel: "Apparateverkauf und Einbau", kurztitel: "Apparate", symbol: "steckdose", reihenfolge: 6,
    kurz: "Bei uns können Sie alle Geräte beziehen, die elektrisch betrieben werden. Kaufen Sie Qualität zum besten Preis-Leistungs-Verhältnis.",
    inhalt: pt(`Bei uns können Sie alle Geräte beziehen, die elektrisch betrieben werden. Kaufen Sie Qualität zum besten Preis-Leistungs-Verhältnis.

Jedes Gerät wird dem Käufer gebrauchsfertig geliefert und von unseren Fachleuten bei Bedarf auch angeschlossen.

Zentralstaubsauger, Kochherd, Kühlschrank, Warmwasserspeicher, Waschmaschine, Lichtschalter, Schaltschränke? Die Liste wäre unendlich lang! Wir organisieren alles für Sie.`),
    bild: bild("leistung-apparate", "Haushaltsgeräte in einer Küche"),
    seoBeschreibung: "Apparateverkauf und Einbau in Zürich: elektrisch betriebene Geräte gebrauchsfertig geliefert und bei Bedarf von Fachleuten angeschlossen.",
    alteUrl: "/elektroinstallationen/32-apparateverkauf", quelle: "https://www.altec-elektro.ch/elektroinstallationen/32-apparateverkauf",
  },
  {
    id: "leistung-telekom", slug: "telekommunikation", titel: "Telekommunikation", kurztitel: "Telekom", symbol: "antenne", reihenfolge: 7,
    kurz: "Suchen Sie ein einfaches Tischtelefon oder eine komplexe EDV-Vernetzung im Büro? Wir finden für Sie eine individuelle Lösung.",
    inhalt: pt(`Suchen Sie ein einfaches Tischtelefon oder eine komplexe EDV-Vernetzung im Büro? Wir finden für Sie eine individuelle Lösung.

ISDN, ADSL, POTS, LAN, UKV, USV, TV, DECT, GAP, Multimedia, Switch, Hub, Router, Modem, Patchpanel: Vor solchen Abkürzungen brauchen Sie nicht mehr zurückzuschrecken. Wir helfen prompt und sprechen Deutsch mit Ihnen.`),
    bild: bild("leistung-telekom", "Netzwerkkabel in einem Patchpanel"),
    seoBeschreibung: "Telekommunikation in Zürich: vom Tischtelefon bis zur EDV-Vernetzung im Büro, LAN, UKV, USV, TV, DECT, Router und Patchpanel.",
    alteUrl: "/elektroinstallationen/30-telekommunikation", quelle: "https://www.altec-elektro.ch/elektroinstallationen/30-telekommunikation",
  },
  {
    id: "leistung-sicherheit", slug: "sicherheit", titel: "Sicherheit", kurztitel: "Sicherheit", symbol: "alarm", reihenfolge: 8,
    kurz: "Denken Sie bei Sicherheit an Gebäudesicherheit wie Brandalarm oder Einbruchschutz, oder denken Sie mehr an elektrische Gefahren?",
    inhalt: pt(`Denken Sie bei Sicherheit an Gebäudesicherheit wie Brandalarm oder Einbruchschutz, oder denken Sie mehr an elektrische Gefahren?

Wir sind ein konzessionierter Elektroinstallationsbetrieb, der sein Personal laufend aus- und weiterbildet. Zudem sind wir autorisierter Fachhändler für die bewährten Gira-Funk-Alarmanlagen. Fragen Sie uns, wenn es um Ihre Sicherheit geht!

## Unsere Einsatzgebiete

Aargau, Appenzell Innerrhoden und Ausserrhoden, Basel-Stadt, Basel-Landschaft, Bern, Graubünden, Glarus, Luzern, Schaffhausen, Schwyz, St. Gallen, Thurgau, Uri, Zug, Zürich.`),
    bild: bild("leistung-sicherheit", "Bedienfeld einer Alarmanlage"),
    seoBeschreibung: "Sicherheit: konzessionierter Elektroinstallationsbetrieb in Zürich, autorisierter Fachhändler für Gira-Funk-Alarmanlagen, Brandalarm und Einbruchschutz.",
    alteUrl: "/elektroinstallationen/31-sicherheit", quelle: "https://www.altec-elektro.ch/elektroinstallationen/31-sicherheit",
  },
];
