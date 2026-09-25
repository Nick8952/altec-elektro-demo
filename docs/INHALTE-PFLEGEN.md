# Inhalte später ändern und veröffentlichen

Diese Anleitung richtet sich an Personen ohne Programmierkenntnisse. Es gibt zwei Betriebsarten; in beiden ändern sich die Texte an
derselben Stelle **nicht** im Code, sondern in Inhaltsdateien bzw. im Redaktionssystem.

## Heute: GitHub-Pages-Demo (Inhalte in Dateien)

| Was ändern? | Wo? |
|---|---|
| Adresse, Telefon, Fax, E-Mail, Büroöffnungszeiten, Notfallnummern, Einsatzgebiete | `data/einstellungen.json` |
| Menü, Fusszeile, Beschriftungen von Knöpfen, Formulartexte, Demo-Hinweis | `data/texte.json` |
| Team (Name, Funktion, Reihenfolge) | `data/team.json` |
| Partner (Name, Logo, Website) | `data/partner.json` (Logo zuerst nach `assets/originale/` legen und in `scripts/bilder-liste.json` eintragen, dann `npm run bilder`) |
| Leistungstexte, Bilder der Leistungen | `werkzeuge/inhalte/seiten/01-leistungen.mjs`, danach `npm run inhalte` |
| Startseite, Übersicht, Notfall, Team, Partner, Kontakt (Aufbau und Texte) | `werkzeuge/inhalte/seiten/02-seiten.mjs`, danach `npm run inhalte` |
| Impressum, Datenschutzerklärung | `werkzeuge/inhalte/seiten/03-rechtliches.mjs`, danach `npm run inhalte` |

Ablauf einer Änderung:
1. Datei bearbeiten (Texteditor oder direkt auf GitHub «Edit this file»).
2. Bei Seiten/Leistungen: `npm run inhalte` (erzeugt die JSON-Dateien). Bei Firmendaten/Texten entfällt dieser Schritt.
3. `npm run inhalt:pruefen` meldet fehlende Bilder, falsche Links, Gedankenstriche usw.
4. Lokal ansehen: `npm run build && npm run vorschau:pages` → http://localhost:4321/altec-elektro-demo/
5. Commit und Push auf `main`. GitHub Actions baut und veröffentlicht automatisch (ca. 2 Minuten); der Fortschritt steht unter «Actions».
6. Liegt der Fehler in der Prüfung (rotes Kreuz bei «Actions»), wird nichts veröffentlicht; die alte Version bleibt online.

Regeln beim Schreiben: Schweizer Rechtschreibung (ss statt ß), keine Gedankenstriche («—»), keine Versprechen ohne Beleg (Anfahrtszeiten,
Tarife, Zertifikate), Alt-Text für jedes Bild.

## Später: Sanity (Redaktionssystem im Browser)

Nach der Einrichtung gemäss `docs/SANITY-VERCEL-EINRICHTUNG.md` meldet sich der Kunde unter `https://<domain>/studio` an und bearbeitet
dort «Unternehmensdaten», «Website-Texte», «Seiten», «Leistungen», «Team» und «Partner». Jede Änderung wird als Entwurf gespeichert und mit
«Publish» veröffentlicht. Erst der eingerichtete Webhook sorgt dafür, dass die Website die Änderung innert Sekunden zeigt; ohne Webhook ist ein
«Redeploy» in Vercel nötig. Die GitHub-Pages-Demo ändert sich durch Sanity nicht.

Felder, die es dort gibt (gleiche Namen wie in den JSON-Dateien): Firma, Adresse, Telefon, E-Mail, Bürozeiten (Anzeige + strukturierte
Zeiten für Suchmaschinen), Notfalldienst (Verfügbarkeit, Nummern, Quartiere, Gemeinden, Hinweis), Navigation, Fusszeile, Bedienelemente,
Kontaktformular, Datenschutz-Einstellungen (Kategorien nur eintragen, wenn tatsächlich ein Dienst Dritter eingebunden wird), Seiten mit
Bausteinen (Text, Leistungen, Leitsatz, Spalten, Notfall, Team, Partner, Kontakt, Handlungsaufforderung, Hinweis), Leistungen mit Symbol,
Kurztext, Text und Bild, Team, Partner mit Logo und Website. Pflichtfelder und Formate werden im Studio geprüft (z. B. Alt-Text, Uhrzeiten HH:MM,
erlaubte Linkziele).
