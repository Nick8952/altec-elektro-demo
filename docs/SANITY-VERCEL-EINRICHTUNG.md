# Sanity und Vercel einrichten (später, Schritt für Schritt)

Stand: **nichts davon ist eingerichtet.** Es existieren kein Sanity-Projekt, kein Vercel-Projekt, keine Tokens. Der Code ist so
vorbereitet, dass die Einrichtung ohne Codeänderungen möglich sein sollte. Getestet wurde: Vercel-Probebuild mit Platzhalter-Projekt-ID
(`build:vercel` kompiliert, Studio-Route wird erzeugt), Seed-Skript im Trockenlauf (`seed --probe`, 27 Dokumente, 16 Bilder), Typprüfung der
Schemas. **Nicht getestet**: echte Sanity-Abfragen, Studio im Browser, Draft-Vorschau, Webhook. Rechnen Sie mit Kleinigkeiten, die beim ersten
echten Lauf angepasst werden müssen (siehe Tabelle am Ende).

## Wie es zusammenhängt

```
Redaktion im Sanity Studio (/studio)  →  Publish  →  Sanity-Webhook  →  POST /api/revalidate (Vercel)  →  Cache-Tag «inhalt» geleert
                                                                                   →  nächster Seitenaufruf rendert neu (ISR)
```
Ohne eingerichteten Webhook erscheint eine Änderung **nicht** von selbst; dann hilft nur ein neuer Deploy (Vercel → «Redeploy»). Es gibt
keine sofortige Aktualisierung ohne diesen Ablauf; das wird dem Kunden so kommuniziert.

GitHub Pages bleibt davon unberührt: die Pages-Demo liest immer `data/*.json` und ändert sich nur durch einen Push auf `main`.

## 1. Sanity-Projekt (ca. 20 Minuten)
1. Konto auf sanity.io anlegen (Empfehlung: Konto des Kunden, Nick als Mitglied), Projekt «Altec Elektro Website», Dataset `production`.
2. Projekt-ID notieren. In den Projekteinstellungen unter «API» → «CORS origins» eintragen: `http://localhost:3000` und später die
   Vercel-Domain, jeweils mit Credentials.
3. Tokens anlegen (API → Tokens):
   - `SANITY_API_WRITE_TOKEN` (Editor) nur lokal für den Import (`npm run seed`), danach löschen.
   - `SANITY_API_READ_TOKEN` (Viewer) für die Draft-Vorschau auf Vercel.
4. Lokal `.env.local` anlegen (nie committen), Werte gemäss `.env.example`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=…
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2026-09-25
   SANITY_API_WRITE_TOKEN=…   (nur für Import)
   ```

## 2. Inhalte importieren
```bash
npm run seed -- --probe   # zeigt, welche Dokumente angelegt würden (27: Unternehmensdaten, Texte, 8 Leistungen, 3 Team, 6 Partner, 8 Seiten)
npm run seed              # legt alle Dokumente mit festen IDs an und lädt die 16 Bilder hoch
npm run seed -- --force   # überschreibt bestehende Dokumente (Vorsicht: Redaktionsänderungen gehen verloren)
```
Die IDs sind deterministisch (`leistung-beleuchtung`, `seite-kontakt`, …), ein zweiter Lauf ohne `--force` überspringt vorhandene Dokumente.

## 3. Studio starten und prüfen
```bash
npm run dev:vercel      # kopiert server-routes/app nach app/ und startet im Vercel-Modus
# http://localhost:3000/studio
```
Prüfen: Einzeldokumente «Unternehmensdaten» und «Website-Texte» vorhanden, Seiten mit Bausteinen, Leistungen mit Symbol und Slug,
deutsche Feldnamen und Hilfetexte, Validierungen (Alt-Text Pflicht, Öffnungszeiten HH:MM, Linkziele). Vision-Tool für GROQ-Tests.
Danach `node scripts/vercel-routen.mjs --entfernen` (oder einfach `npm run dev`), damit `app/studio` und `app/api` wieder verschwinden.

## 4. Frontend auf Sanity umschalten (lokal testen)
```
CONTENT_SOURCE=sanity npm run dev:vercel
```
Alle Seiten müssen identisch aussehen wie mit lokalen Daten. Unterschiede deuten auf Lücken im GROQ-Adapter (`lib/content/sanity.ts`) hin.
Danach `CONTENT_SOURCE=sanity npm run build:vercel` als Build-Probe.

## 5. Vercel-Projekt
1. Auf vercel.com «Import Git Repository» → `Nick8952/altec-elektro-demo`. `vercel.json` setzt Build-Command (`npm run build:vercel`)
   und `DEPLOY_TARGET=vercel` automatisch; ein einfacher Import genügt. `SITE_URL` muss nicht gesetzt werden (Fallback `https://<repo>.vercel.app`).
2. Sanity-Umgebungsvariablen erst ergänzen, wenn ein echtes Projekt existiert (Production + Preview): `CONTENT_SOURCE=sanity`,
   `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`,
   `SANITY_REVALIDATE_SECRET` (zufällige Zeichenkette); eigene Domain zusätzlich `SITE_URL=https://<domain>`; `INDEXIERUNG=1` erst beim Go-Live.
   Ohne diese Variablen läuft die Website mit den lokalen Daten weiter.
3. Deploy auslösen. Prüfen: Startseite, tiefe URL direkt laden, alte Adressen (`/team-b` → `/team/`, Weiterleitungen aus `data/weiterleitungen.json`).
   `/studio` und `/api/vorschau/aktivieren` liefern ohne echtes Sanity-Projekt einen Fehler (erwartet, betrifft nur diese Routen).
4. Webhook in Sanity (API → Webhooks): URL `https://<domain>/api/revalidate`, Trigger create/update/delete, Projection
   `{ "_type": _type }`, **Secret = derselbe Wert wie `SANITY_REVALIDATE_SECRET`**. Danach eine Änderung im Studio veröffentlichen und prüfen,
   ob die Seite ohne Redeploy aktualisiert.
5. Presentation-Tool: `sanity.config.ts` verwendet relative Pfade (`/api/vorschau/aktivieren|beenden`), weil das Studio unter derselben
   Domain läuft. Im Draft Mode rendert `app/layout.tsx` die `<VisualEditing />`-Komponente.

## 6. Domain und Go-Live
Eigene Domain in Vercel hinzufügen, DNS beim Registrar (CNAME `www` → `cname.vercel-dns.com`, A-Record Apex gemäss Vercel-Anleitung).
`SITE_URL` anpassen, Sanity-CORS ergänzen. Erst nach Freigabe durch das Unternehmen: `INDEXIERUNG=1` (hebt `noindex` auf),
`footer.demoHinweis` in den Website-Texten leeren, `public/robots.txt` auf `Allow` umstellen, Impressum/Datenschutz auf das Unternehmen
umschreiben (siehe `docs/UEBERGABE.md`). Bis dahin bleibt alles `noindex`.

## Was nur vorbereitet ist (Kennzeichnung)
| Bereich | Stand |
|---|---|
| Sanity-Schemas (`sanity/schemas/`) | geschrieben, typgeprüft, nie gegen ein echtes Studio geladen |
| Studio-Config (Struktur, Presentation, Vision, de-DE) | geschrieben, Probebuild ok, nicht im Browser geöffnet |
| GROQ-Adapter (`lib/content/sanity.ts`) | geschrieben, Typen konsistent zum lokalen Adapter, **nie mit Daten ausgeführt** |
| Seed-Skript | Trockenlauf ok, Upload nie ausgeführt |
| Draft Mode / Visual Editing (stega) | Routen vorhanden, nicht getestet |
| Webhook-Revalidierung | Route vorhanden, Cache-Tag `inhalt`, nicht getestet |
| Weiterleitungen alt→neu | `next.config.ts` `redirects()` nur im Vercel-Modus, nicht getestet |
