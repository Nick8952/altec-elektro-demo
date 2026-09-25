# Prüfbericht

Stand 25.09.2026. Umgebung für alle lokalen Messungen: macOS (Darwin 25.6), Node 26.8, Google Chrome (stabil) headless über
puppeteer-core 25 bzw. Lighthouse 13.5, statischer Export aus `npm run build:pages`, ausgeliefert durch `scripts/vorschau-server.mjs`
(ohne Kompression, deshalb pessimistischer als GitHub Pages). Keine echten Geräte, kein Safari/iOS, kein Screenreader.

## 1. Build- und Codeprüfungen

| Prüfung | Ergebnis |
|---|---|
| `npm run inhalt:pruefen` | 8 Seiten, 8 Leistungen, 3 Teammitglieder, 6 Partner, 31 interne Links, 0 Fehler, 0 Warnungen |
| `npm run lint` (ESLint, eslint-config-next 16) | 0 Fehler, 0 Warnungen |
| `npm run typecheck` (tsc --noEmit) | 0 Fehler |
| `npm run build:pages` | 19 HTML-Seiten (Start, 7 Seiten, 8 Leistungen, 404, _not-found), robots.txt, sitemap.xml, .nojekyll |
| `npm run export:pruefen` | grün: alle Seiten vorhanden, 1143 interne Verweise unter `/altec-elektro-demo` auf existierende Dateien, keine externen Ressourcen, noindex auf allen Seiten, Canonicals, genau ein h1, Titel ohne doppeltes Suffix, Sprungziele vorhanden |
| Go-Live-Probe `INDEXIERUNG=1 npm run build:pages && INDEXIERUNG=1 npm run export:pruefen` | grün: `index, follow`, robots.txt `Allow: /` + Sitemap, JSON-LD `Electrician` vorhanden; Fehlerseiten bleiben noindex |
| Vercel-Probebuild (`build:vercel` mit Platzhalter-Projekt-ID) | grün: Studio-, Revalidate- und Vorschau-Routen kompilieren, `dynamicParams=true` gesetzt und danach wieder auf `false` zurückgestellt |
| `npm run seed -- --probe` | 27 Dokumente, 16 Bilder vorbereitet (kein Schreibzugriff, kein Projekt) |
| `npm audit --omit=dev` | 15 Meldungen (3 hoch, 12 moderat), alle in transitiven Abhängigkeiten des Sanity-Studios (adm-zip, js-yaml, smol-toml, uuid). Nichts davon ist Teil des statischen Exports; die Pakete laufen nur in der Studio-Werkzeugkette. `npm audit fix --force` würde Sanity brechen; beim Einrichten von Sanity Versionen aktualisieren |

## 2. Browser-Audit (werkzeuge/qa/audit.mjs)

17 Seiten × 4 Breiten (360, 390, 768, 1440 px) = **68 Prüfungen, 0 Befunde**. Geprüft je Seite: HTTP-Status, horizontaler Überlauf
(`scrollWidth` vs. `clientWidth` und Elemente ausserhalb des Viewports), Touch-Ziele < 44 × 44 px (Links, Knöpfe, Felder, Summary),
Bilder ohne `alt`, genau ein `h1` im `main`, Überschriften-Sprünge, `meta robots`, externe Anfragen, Konsolenfehler, localStorage/Cookies,
Skip-Link und `main#inhalt`.

Behobene Befunde aus dem ersten Durchlauf: Footer-Links 36 px hoch (→ 44 px, volle Breite), Nav-Link «Team» 38 px breit (→ `min-w-11`),
H1-Überlauf bei 360/390 px durch lange Wörter («Datenschutzerklärung», «Elektroinstallationen»; → kleinere Stufe, `hyphens: auto`,
`min-w-0`), Überschriften-Sprünge auf /kontakt/ (Formular-h3 → h2) und /sicherheit/ (h3 → h2).

## 3. Funktionsprüfungen (werkzeuge/qa/funktionen.mjs)

**40 von 40 bestanden.** Auszug:
- Erstbesuch: keine externen Anfragen, kein Cookie-Banner, kein Speicher, keine Cookies, kein Footer-Link zu Cookie-Einstellungen, kein JSON-LD (Demo), robots.txt sperrt.
- Tastatur: erster Tab = Skip-Link, Enter setzt Fokus auf `main`; Untermenü mit `aria-expanded`, Enter öffnet, Pfeil nach unten fokussiert ersten Eintrag, Escape schliesst und gibt Fokus zurück; Fokusring ≥ 2 px; `aria-current` auf der aktiven Seite.
- Mobil (360 px): Kontaktleiste mit «Anrufen» und «Projekt anfragen», verdeckt die Fusszeile nicht, fehlt auf /kontakt/; Menüknopf ≥ 44 px, Dialog öffnet mit aufgeklappter aktiver Gruppe und Fokus im Dialog, alle Menüziele ≥ 44 px, Escape schliesst.
- Bewegung: mit `prefers-reduced-motion: reduce` keine Animation und alles sichtbar; sonst Scroll-Timeline aktiv.
- Formular (fiktive Daten, kein Versand): kein `action` (Website sendet nichts), `<noscript>`-E-Mail-Link; nur Name, E-Mail, Telefon, Anliegen, Nachricht; sichtbare Labels; leer absenden → 3 Fehlermeldungen, Fokus im ersten Fehlerfeld, kein mailto; ungültige E-Mail → 1 Fehlermeldung; gültig → `mailto:info@altec-elektro.ch` mit Name und Nachricht im Body (abgefangen über CDP, nicht ausgeführt); Statushinweis nennt das E-Mail-Programm, keine falsche Versandbestätigung; nichts gespeichert, URL unverändert.
- Links: Telefonlinks E.164 (`tel:+41448400770`, `tel:+41796538399`); genau 2 externe Partnerlinks mit `noopener`; 6 Partnerlogos mit Alt-Text; Routenlink extern, kein iframe; mailto auf info@altec-elektro.ch; Leistungs-Nachbarn; Kantonsliste auf /sicherheit/; 404 mit Status 404, gestaltet, noindex.

## 4. Mobile Prüfung (Bericht)

| Breite | Ergebnis |
|---|---|
| 360 px | kein horizontales Scrollen; H1 bricht mit Silbentrennung («ausge-führt»), zwei Zeilen pro Knopf in der Kontaktleiste vermieden (15 px, kein Icon beim zweiten Knopf); Schiene senkrecht links mit Abzweigen; Formularfelder volle Breite, 48 px hoch |
| 390 px | wie 360, ohne Silbentrennung im Hero |
| 768 px | Leistungen zweispaltig mit Schiene oben, Detailseite einspaltig (Text, Bild, Kontaktkasten, Nachbarn), Menü als Seitenblatt 24 rem |
| 1440 px | vierspaltige Schiene in zwei Reihen, Hero-Bild 1216 px (leichtes Hochskalieren des 1241-px-Originals vermieden), Kopfzeile einzeilig |

Zeilenlängen: Lauftext ≤ 65 Zeichen (`max-w-[65ch]`), Hero-Untertitel ≤ 44 Zeichen. Schriftgrössen: Lauftext 17 px, Nebenangaben 15 px,
kleinste Angabe 12 px nur bei «GmbH» im Logo (dekorativ). Kontraste gerechnet: Rot auf Weiss 6.5:1, Tinte-2 10:1, Grau 5.4:1, Weiss auf Rot 6.5:1.

## 5. Lighthouse 13.5 (Chrome headless, lokaler Vorschau-Server ohne Kompression)

| Seite | Modus | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| / | Desktop | 97 | 100 | 100 | 66* | 1.3 s | 0 | 0 ms |
| /elektroinstallationen/beleuchtung/ | Desktop | 99 | 100 | 100 | 66* | 0.9 s | 0 | 0 ms |
| /kontakt/ | Desktop | 97 | 100 | 100 | 63* | 1.2 s | 0 | 0 ms |
| / | Mobil (simuliertes langsames 4G) | 77 | 100 | 100 | 66* | 6.1 s | 0.013 | 30 ms |
| /elektroinstallationen/beleuchtung/ | Mobil | 82 | 100 | 100 | 66* | 4.8 s | 0 | 20 ms |
| /kontakt/ | Mobil | 90 | 100 | 100 | 63* | 3.6 s | 0 | 20 ms |

\* SEO-Abzug ausschliesslich wegen `noindex` («is-crawlable»; Demo, beabsichtigt).
Mobile Werte nach dem Wechsel auf `next/font/local` (Schrift-Preload): FCP 1.8 → 1.2 s. Die mobilen LCP-Werte sind durch den lokalen
Server ohne gzip (HTML 126 KB, JS 450 KB unkomprimiert) verzerrt; massgebend ist die Live-Messung in Abschnitt 8.
Einziger Accessibility-Befund im ersten Lauf (`label-content-name-mismatch` am Logo-Link) behoben; danach 100.

## 6. Codex-Reviews

**Review 1 (Architektur, vor der Übergabe):** 30 Befunde, davon 4 «hoch»: `draftMode()` in `generateStaticParams` (behoben: Abfangen ausserhalb
eines Requests), `dynamicParams=false` blockiert neue CMS-Seiten auf Vercel (behoben: Umschaltung je Betriebsart), dauerhaft sperrende
`robots.txt` (behoben: `app/robots.ts` + Sitemap je Freigabe), Bildrechte nicht durch Anweisung des Auftraggebers gedeckt (dokumentiert in
`HERKUNFT.md` und `UEBERGABE.md` A3; Entscheid über öffentliche Bereitstellung liegt beim Auftraggeber). Weitere umgesetzte Punkte: doppeltes
Titel-Suffix, JSON-LD nur bei Freigabe, striktes `CONTENT_SOURCE`, Partner ohne Logo, Sanity-Slug-Validierungen, Skip-Link-Fokus,
Formular-Längen, No-JS-Validierung, Screenreader-Hinweis für neue Tabs, Routenlink-Prüfung, Abschnitte ohne Titel, Notfall-Wiederholung,
Zeilenumbrüche im Impressum, Generator-Aufräumen, atomare Bildoptimierung, CI-Browser-QA, wirkungsloser Test, Origin-Vergleich, Datenschutztext
(Empfänger, Rechte, DPF-Hinweis). Nicht umgesetzt (begründet): Laufzeitvalidierung mit Zod (Umfang; Prüfskript deckt die Demo ab),
echter Sanity-Testlauf (kein Projekt erlaubt), Postanschrift des Betreibers (liefert Nick), statische Redirect-Seiten auf Pages (dokumentiert).

**Review 2 (Abschluss):** siehe Abschnitt 7.

## 7. Abschluss-Review (Codex) und Nacharbeiten

12 Befunde (2 hoch, 5 mittel, 5 niedrig), Kurzurteil «bereit für Übergabe: nein» wegen (1) ungeklärter Bildrechte und (2) einer
Pfad-Traversierung im lokalen Vorschau-Server. Umgesetzt:
- Vorschau-Server: Pfad wird nach dem Dekodieren gegen `out/` geprüft, Bindung an 127.0.0.1 (`scripts/vorschau-server.mjs`).
- `scripts/vercel-routen.mjs` verlangt genau eine Markierungszeile; `build:vercel` läuft über `scripts/build-vercel.mjs` mit garantiertem
  Zurücksetzen von `dynamicParams` (auch bei Build-Fehlern, Exit-Code bleibt erhalten).
- Launch-Dokumentation an `app/robots.ts`/`app/sitemap.ts` angepasst (`docs/UEBERGABE.md`, `docs/SANITY-VERCEL-EINRICHTUNG.md`).
- `aria-current="page"` nur bei exakter Seite; der Elterneintrag «Elektroinstallationen» bleibt auf Leistungsseiten nur farblich markiert.
- Demo-Hinweis zusätzlich als schmale Zeile über der Navigation (verschwindet mit `INDEXIERUNG=1`).
- Quellaufnahme (HTML, Textauszüge, SHA-256, Abrufprotokoll) ausserhalb des Repos archiviert: `../00_notes/altec-elektro-quelle-2026-09-25/`.
- Bildaustausch mit Rückfall (alter Bestand bleibt bei Fehler erhalten).
- Inhaltsprüfung: Seiten-IDs, Kopfknopf = erste Notfallnummer, E-Mail-Adressen in Texten = Einstellungen.
- Partnerlinks über `SmartLink` (Screenreader-Hinweis «öffnet in neuem Tab»).
- Fax in der Fusszeile; Notfalltext ohne Wiederholung der Verfügbarkeit.
- Zusätzlich aus der Live-Lighthouse-Messung: `action="mailto:"` am Formular entfernt (Lighthouse wertete es als unsicheren Request);
  ohne JavaScript zeigt ein `<noscript>`-Link die E-Mail-Adresse.
Nicht behebbar durch den Code, an den Auftraggeber übergeben: **Bildrechte** (UEBERGABE A3). Der Auftraggeber hat das Repository ausdrücklich
als «public» gewünscht; die Entscheidung, das Material bis zur Freigabe zu entfernen oder die Demo zugangsbeschränkt zu zeigen, liegt bei ihm.

## 8. Live-Prüfung GitHub Pages

Repository https://github.com/Nick8952/altec-elektro-demo (public), Pages-Quelle «GitHub Actions», Workflow-Lauf 36133399285:
Jobs `build` (inkl. Inhalt, Lint, Typen, Export-Prüfung, Browser-QA 68/68 + 40/40 auf dem Runner), `vercel-probe`, `deploy` alle grün.

Live-URL https://nick8952.github.io/altec-elektro-demo/: Startseite 200, tiefe Adresse `/elektroinstallationen/beleuchtung/` 200,
unbekannte Adresse 404 mit gestalteter Seite. Browser-Audit gegen die Live-URL (360 + 1440 px, 17 Seiten): 34/34 ohne Befund.
Funktionsprüfungen gegen die Live-URL: 40/40. Screenshots 390/1440 px gesichtet.

Lighthouse 13.5 gegen die Live-URL (Chrome headless, Standard-Drosselung):

| Seite | Modus | Performance | Accessibility | Best Practices | SEO | FCP | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|---|
| / | Mobil | 96 | 100 | 100 | 66* | 0.9 s | 2.7 s | 0 | 20 ms |
| /elektroinstallationen/beleuchtung/ | Mobil | 97 | 100 | 100 | 66* | 0.9 s | 2.6 s | 0 | 30 ms |
| /kontakt/ | Mobil | 100 | 100 | 77** | 63* | 0.9 s | 1.9 s | 0 | 10 ms |
| / | Desktop | 100 | 100 | 100 | 66* | 0.3 s | 0.5 s | 0 | 0 ms |
| /elektroinstallationen/beleuchtung/ | Desktop | 100 | 100 | 100 | 66* | 0.2 s | 0.4 s | 0 | 0 ms |
| /kontakt/ | Desktop | 100 | 100 | 77** | 63* | 0.2 s | 0.4 s | 0 | 0 ms |

\* nur `noindex` (Demo). \*\* `form action="mailto:"` als «insecure request» gewertet; danach entfernt (Abschnitt 7), Messung nach dem
zweiten Deploy: siehe unten.

## 9. Nicht durchführbare Prüfungen

- Echte Geräte (iOS Safari, Android Chrome), Screenreader (VoiceOver/NVDA): nicht verfügbar in dieser Umgebung.
- Sanity-Adapter, Studio, Draft-Vorschau, Webhook: kein Projekt (Vorgabe). Nur Typprüfung, Probebuild und Seed-Trockenlauf.
- Versand einer echten Anfrage an das Unternehmen: ausdrücklich nicht erlaubt; mailto nur abgefangen.
