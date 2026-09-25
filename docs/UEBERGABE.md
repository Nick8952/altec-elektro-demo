# Übergabe: offene Punkte, benötigte Angaben und Freigaben

Stand 25.09.2026. Die Demo ist vollständig und live, aber sie ist ein **Gestaltungsvorschlag**. Bevor daraus die Website der Altec Elektro
GmbH werden kann, sind folgende Punkte zu klären bzw. freizugeben.

## A. Angaben, die nur das Unternehmen liefern kann

| Nr. | Frage / Angabe | Wo es eingesetzt wird | Stand |
|---|---|---|---|
| 1 | Rechtsform-Details fürs Impressum: Handelsregister-Nummer/UID (CHE-…), Sitz, vertretungsberechtigte Person(en), verantwortliche Person für den Inhalt | `/impressum/` | fehlt in der Quelle (kein Impressum) |
| 2 | Datenschutz-Kontaktstelle des Unternehmens (Name/E-Mail für Auskunftsbegehren nach Art. 25 DSG) | `/datenschutz/` Ziffer 1 | fehlt |
| 3 | Bildrechte: Dürfen die 9 Fotos und 6 Partnerlogos der bisherigen Website weiterverwendet werden? Sind es lizenzierte Stockfotos? | alle Seiten | offen |
| 4 | Vektorlogo (SVG/AI/PDF) und allenfalls Farbvorgaben | `components/Logo.tsx` (heute Nachbau aus einem 186-px-PNG) | offen |
| 5 | Ortsangabe «Küssnacht» im Notfalldienst: gemeint ist vermutlich Küsnacht ZH (Zürichsee). Bestätigen oder korrigieren | `data/einstellungen.json` → `notfall.agglomeration` | wörtlich übernommen, Hinweis sichtbar |
| 6 | Photovoltaik und «Inhousinstallationen» stehen nur in den Meta-Tags der alten Website: Leistung anbieten oder streichen? | evtl. neue Leistung | offen |
| 7 | Partner: Websites von Protectas, Otto Fischer, Heinz von Heiden, Winterhalder Fenner verlinken? Beziehung zu jedem Partner (Lieferant, Sicherheitsdienst, Treuhand …) benennen? «Alle zertifiziert» belegen? | `/partner/` | nur Quell-Links übernommen |
| 8 | Notfalldienst: Gibt es Anfahrtszeiten, Pikett-Tarife oder Zuschläge, die genannt werden sollen? | `/notfalldienst/` | bewusst nichts versprochen |
| 9 | Bürozeiten bestätigen (Mo–Fr 08.00–12.00 / 13.00–17.00), Feiertagsregelung? | Fusszeile, Kontakt, JSON-LD | Quelle, unbestätigt |
| 10 | Teamfotos, Fahrzeug-/Betriebsfotos, Referenzobjekte (mit Freigabe der Bauherrschaft) | Team, Startseite | keine vorhanden |
| 11 | Fax-Nummer noch aktuell? | Fusszeile, Kontakt, Impressum | Quelle |
| 12 | Textfreigabe: alle Texte wurden sprachlich geglättet (`docs/INHALTSMATRIX.md`); Widerspruch möglich | alle Seiten | Freigabe ausstehend |
| 13 | Gewünschte Domain (altec-elektro.ch bleibt bis zum Umzug beim bisherigen Anbieter) und Zugang zum DNS | Go-Live | offen |

## B. Angaben des Demo-Betreibers (Nick)

- Postanschrift im Impressum der Demo ergänzen (heute «auf Anfrage»). Betrifft alle Demos im Workspace.

## C. Was beim Launch geändert werden muss (Checkliste)

1. `INDEXIERUNG=1` setzen (Env oder CI): hebt `noindex, nofollow` auf. Ohne Domain nicht setzen.
2. `public/robots.txt`: `Disallow: /` entfernen, `Sitemap:`-Zeile ergänzen (Sitemap-Erzeugung ist noch nicht eingebaut, siehe D).
3. `data/texte.json` → `footer.demoHinweis` leeren.
4. Impressum und Datenschutzerklärung auf das Unternehmen umschreiben (Betreiber = Altec Elektro GmbH, Hosting-Abschnitt an den
   tatsächlichen Anbieter anpassen: GitHub Pages **oder** Vercel; Sanity-Abschnitt aktivieren, falls genutzt).
5. `SITE_URL=https://www.altec-elektro.ch` (Canonical, Open Graph, JSON-LD) und bei GitHub Pages mit eigener Domain `BASE_PATH=` (leer).
6. Kontaktformular: bleibt `mailto` (kein Server). Soll ein echter Versand her, braucht es einen Dienst (z. B. Formular-API) und einen
   ergänzten Datenschutztext.
7. Weiterleitungen alter Adressen (`data/weiterleitungen.json`) greifen nur auf Vercel; auf GitHub Pages gibt es keine Server-Redirects.
8. Bildrechte (A3) und Rechtstexte (A1, A2) geklärt.

## D. Bekannte Grenzen der Demo

- Kein Sitemap.xml (bei `noindex` sinnlos; für den Launch mit `app/sitemap.ts` ergänzen).
- Keine Server-Redirects auf GitHub Pages (nur auf Vercel).
- Die Quellbilder sind nur 590 px breit; auf grossen Bildschirmen wirken sie klein. Bessere Fotos vom Kunden anfragen.
- Sanity/Vercel nur vorbereitet, nie mit echten Daten getestet (`docs/SANITY-VERCEL-EINRICHTUNG.md`).
- Rechtstexte sind redaktionell, nicht anwaltlich geprüft.
- Tests liefen in Chrome headless (macOS); echte Geräte, Safari/iOS und Screenreader wurden nicht getestet.
