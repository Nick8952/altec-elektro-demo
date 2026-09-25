# Inhaltsmatrix: altec-elektro.ch → Demo

Stand der Bestandsaufnahme: **25.09.2026**. Alle Seiten der bestehenden Website wurden mit `curl` abgerufen (HTTP 200), der Text extrahiert
und verglichen. Die Rohaufnahme (HTML aller 19 Adressen, Textauszüge, SHA-256-Prüfsummen, Abrufprotokoll) liegt ausserhalb des öffentlichen
Repos im Workspace unter `00_notes/altec-elektro-quelle-2026-09-25/`. Die Website ist eine Joomla-Seite (Template «meet_gavern», Copyright 2016).
Übernahmestatus: **vollständig** = alle Fakten und Aussagen übernommen; **geglättet** = Rechtschreibung/Zeichensetzung angepasst, Inhalt gleich;
**verschoben** = auf anderer Zielseite/anderem Baustein; **offen** = fehlt in der Quelle oder braucht Rückfrage.

## Seiten

| Quell-URL | Ursprünglicher Inhalt | Neue Zielseite | Status |
|---|---|---|---|
| `/` (Home) | Logo, Hauptmenü (5 Punkte), Bild `zuerich.jpg`, drei Leitsätze (Kerngeschäft; «Wir kümmern uns um alles…»; Lage Seefeld), 4 Teaser-Kacheln (Elektroinstallationen «Stark- & Schwachstrom: Planung und Projektierung, Service und Unterhalt, Beleuchtung, Telekommunikation, Multimedia, Kabelfernseh-Systeme und SAT Anlagen» · Team · Unsere Partner «Alle zertifiziert» · 7x24 Stunden Notfall/Pikett), Fussmenü, «Copyright 2016» | `/` Startseite: Hero (Titel neu formuliert aus den Leitsätzen, Bild), Leistungen (Sammelschiene, Einleitung = Teasertext inkl. Multimedia/Kabelfernseh/SAT), Leitsatz-Abschnitt (Zitat + zwei Leitsätze), Notfall, Team, Partner, Kontakt | vollständig; «Alle zertifiziert» **nicht** übernommen (keine Belege, welche Zertifikate gemeint sind → offen, siehe unten); Hero-Titel und Hero-Untertitel sind redaktionell neu, enthalten aber nur belegte Aussagen |
| `/elektroinstallationen` | 8 Leistungskarten mit Bild, Titel, Kurztext, «Mehr erfahren»; Kontaktblock | `/elektroinstallationen/` Übersicht (Raster mit Bildern) + Kontakt im Footer | vollständig, geglättet |
| `/elektroinstallationen/42-planung-und-projektierung` | Bild, 2 Absätze | `/elektroinstallationen/planung-und-projektierung/` | vollständig, geglättet («Erfahrungen» → «Erfahrung», «gehört … Weitsicht und Qualität» → Plural) |
| `/elektroinstallationen/25-service-und-unterhalt` | Bild, 3 Absätze | `/elektroinstallationen/service-und-unterhalt/` | vollständig, geglättet (Bindestriche bei «7x24 Stunden Notfall/Pikett Service») |
| `/elektroinstallationen/28-neu-und-umbauten` | Bild, 2 Absätze | `/elektroinstallationen/neu-und-umbauten/` | vollständig, geglättet («Altbau Wohnung», «Neubau Objekt», «vernetzen» → «vernetzten») |
| `/elektroinstallationen/26-industrie-und-gewerbe` | Bild, 2 Absätze | `/elektroinstallationen/industrie-und-gewerbe/` | vollständig, geglättet («Wir Wissen», «Frequenzumwandler gesteuerten» → «frequenzumrichtergesteuerten», fehlendes Leerzeichen) |
| `/elektroinstallationen/27-beleuchtung` | Bild, 3 Absätze | `/elektroinstallationen/beleuchtung/` | vollständig, geglättet («Augenflimmer» → «Augenflimmern») |
| `/elektroinstallationen/32-apparateverkauf` | Bild, 3 Absätze | `/elektroinstallationen/apparateverkauf-und-einbau/` | vollständig, geglättet («welche elektrisch betrieben werden», «zur besten Preis-Leistungsverhältnis») |
| `/elektroinstallationen/30-telekommunikation` | Bild, 2 Absätze (Abkürzungsliste) | `/elektroinstallationen/telekommunikation/` | vollständig, geglättet («EDV Vernetzung», Satzzeichen) |
| `/elektroinstallationen/31-sicherheit` | Bild, 3 Absätze inkl. Kantonsliste | `/elektroinstallationen/sicherheit/` (Kantone als Zwischentitel «Unsere Einsatzgebiete») | vollständig, geglättet («Gira Funk Alarmanlagen», «Appenzell Inner- und Ausserrhoden», «Basel Stadt/Land», «St.Gallen») |
| `/7x24-stunden-notfall-pikett` | Text (7x24, 365 Tage, qualifizierte Elektroinstallateure), zwei Nummern, Quartiere und Gemeinden; Twitter/Pinterest-Knöpfe | `/notfalldienst/` (Hero, Notfall-Baustein mit Nummern und Gebieten, Ergänzungstext aus Service-Seite, Hinweis zu fehlenden Tarifen) | vollständig; Social-Share-Knöpfe **bewusst nicht** übernommen (Datenschutz, kein Mehrwert); Ortsnamen wörtlich, «Küssnacht» nicht geändert |
| `/team` | Einleitung (2 Absätze), 3 Personen mit Funktion; Share-Knöpfe | `/team/` | vollständig, geglättet («ausgewiesen Fachleute», «eidgenössische diplomierte») |
| `/unsere-partner` | Einleitung, 6 Logos (2 verlinkt: Komma3 → komma3.ch, ATC Treuhand → atc-treuhand.ch); Share-Knöpfe | `/partner/` | vollständig, geglättet («erkundigen wir … Entwicklungstendenzen» → «erkunden»); nur die zwei Quell-Links verlinkt |
| `/kontakt` | Text (Sekretariat Mo–Fr 08–12/13–17, Notfälle abends/Wochenende), Formular (Name, Email, Betreff, Nachricht), Kontaktblock, Karte (Modul noo_maps, ohne sichtbare Koordinaten) | `/kontakt/` (Hero-Text = Quelltext, Kontaktdaten, Bürozeiten, mailto-Formular mit zusätzlichem Feld Telefon, Notfall kompakt, Karte als externer Link) | vollständig; Formular ohne Backend (mailto), Karte nicht eingebettet (Entscheid) |
| `/kontakt-b`, `/team-b`, `/unsere-partner-b`, `/7x24-stunden-notfall-pikett-b`, `/dienstleistungen-b` | Identische Kopien der Hauptseiten (Fussmenü-Varianten) | in `data/weiterleitungen.json` auf die Zielseiten abgebildet | vollständig (Weiterleitungen greifen erst auf Vercel) |
| Kontaktblock auf jeder Seite | Altec Elektro GmbH, Hedwigstrasse 12, 8032 Zürich, Telefon +41 44 840 07 70, Fax +41 44 840 07 71, info@altec-elektro.ch, Mo–Fr 08.00–12.00 / 13.00–17.00 | Fusszeile (inkl. Fax), Kontaktseite, Impressum, JSON-LD (nur bei Freigabe) | vollständig |
| `<meta description>` / `<meta keywords>` | Nennt zusätzlich «Photovoltaik», «Inhousinstallationen», «Elektromontagen», «elektriker witikon» | nicht als Leistung übernommen | **offen**: Photovoltaik erscheint nur in den Meta-Tags, nirgends im Seiteninhalt → beim Kunden klären |
| Impressum, Datenschutzerklärung, AGB | nicht vorhanden (404 für `/impressum`, `/datenschutz`, `/agb`) | `/impressum/`, `/datenschutz/` neu erstellt (Demo-Betreiber ≠ Unternehmen) | neu; Pflichtangaben des Unternehmens **offen** (siehe UEBERGABE) |
| Favicon | `templates/meet_gavern/favicon.ico` → 404 | eigenes `app/icon.svg` (Würfel-Motiv) | neu |
| Dokumente/PDFs, Preise, Öffnungszeiten-Ausnahmen, Bewertungen, Referenzen | nicht vorhanden | nicht erfunden | keine Quelle |

## Bilder

Alle 16 Bilddateien (1 Hero, 8 Leistungsbanner 590×246, 6 Partnerlogos, Logo-PNG) übernommen, siehe `assets/originale/HERKUNFT.md`.
Das Logo wird als Vektor-Nachbildung (`components/Logo.tsx`) gezeigt, weil die Quelle nur ein 186×98-px-PNG liefert. Teamfotos gibt es nicht;
es wurden keine ergänzt.

## Redaktionelle Ergänzungen (keine neuen Fakten)

- Hero-Titel Startseite «Elektroinstallationen für Zürich.» und Untertitel «Geplant, ausgeführt, gewartet: …» fassen Planung/Ausführung/Service,
  Kerngeschäft und Lage aus den Leitsätzen zusammen; Panel «Direkteinstieg» listet die acht Leistungen (Titel wie in der Quelle).
- Faktenleiste: «konzessionierter Elektroinstallationsbetrieb, Personal laufend aus- und weitergebildet» (Seite Sicherheit), «eidgenössisch
  diplomierter Installateur, technische Aufsicht» (Seite Team), «7×24 Stunden, 365 Tage, qualifizierte Elektroinstallateure» (Notfallseite),
  «zentrale Lage im Zürcher Seefeld, schnell vor Ort» (Startseite).
- «Für Wohnung, Büro und Betrieb»: Texte aus den Leistungsseiten Neu- und Umbauten, Apparateverkauf, Telekommunikation, Beleuchtung
  (Beratung zu Licht im Büro), Industrie und Gewerbe; Zuordnung zu Zielgruppen ist redaktionell.
- «Geplant. Ausgeführt. Gewartet.»: Schritte aus Planung (CAD, Farbdruck, planerische Weitsicht), Neu- und Umbauten (termin- und fachgerecht),
  Service und Unterhalt (seltenste Phänomene, 7×24). Einleitungssatz «Planung, Ausführung und Service: drei Bereiche …» ist redaktionell
  und verspricht keine durchgängige Zuständigkeit (Codex-Befund).
- Bildzeile beim Leitsatz: «Zürich, Limmatquai. Die Altec Elektro GmbH ist an der Hedwigstrasse 12 im Seefeld zuhause.» (Bildmotiv
  erkennbar; Adresse und Seefeld laut Quelle).
- Handlungsaufforderungen: «Projekt anfragen», «Notfalldienst anrufen», «Kontakt» (keine Offerte-/Antwortzeit-Versprechen).
- Auswahl «Anliegen» im Formular leitet sich aus den acht Leistungsbereichen ab.
- Hinweise auf der Notfall- und Partnerseite erklären, was die Quelle nicht hergibt (Tarife, weitere Partner-Websites).
- SEO-Titel/-Beschreibungen je Seite sind neu formuliert, enthalten nur belegte Angaben.

## Nicht übernommen (mit Grund)

| Element | Grund |
|---|---|
| Twitter-/Pinterest-Share-Knöpfe | laden Skripte Dritter; kein Nutzen für einen Elektrobetrieb |
| Google-Fonts-Einbindung (Roboto) | Datenschutz; Schrift liegt lokal |
| Karten-Modul `noo_maps` | keine Einbettung ohne Einwilligung; Routenlink stattdessen |
| «Alle zertifiziert» (Partner-Teaser) | nicht belegbar, welche Zertifikate gemeint sind |
| «Copyright 2016» | durch dynamisches Jahr ersetzt |
