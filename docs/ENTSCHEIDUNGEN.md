# Entscheidungen (kompakte ADRs)

## 1. Static Export jetzt, Sanity/Vercel vorbereitet (25.09.2026)
Vorgabe des Auftraggebers. Ein Code, zwei Betriebsarten über `DEPLOY_TARGET`; Server-Routen liegen in `server-routes/` und werden nur für
Vercel nach `app/` kopiert. Inhaltsschnittstelle `Inhaltsquelle` mit lokalem und Sanity-Adapter, identische Typen. Kopiermuster aus
`../white-smyle-website` übernommen (dort in zwei Codex-Reviews gehärtet).

## 2. Kein Cookie-Banner, aber Einwilligung vorbereitet
Audit: keine Cookies, kein localStorage, keine Anfragen an Dritte (Schrift lokal, keine Karte, keine Videos, keine Analyse). Ein Banner wäre
irreführend. Die Komponente ist vorhanden und wird durch einen Eintrag in `texte.einwilligung.kategorien` aktiv (Banner, Dialog, Widerruf im Footer).

## 3. Karte als externer Link
Google-Maps-Einbettung würde ohne Einwilligung Daten übertragen; der Kunde wollte beim Vorgängerprojekt Google Maps. Kompromiss: Routenlink
zu Google Maps (Zwei-Klick-Einbettung wäre mit der vorbereiteten Einwilligung nachrüstbar).

## 4. Kontakt per mailto
Statisch = kein Versand. Formular baut eine kodierte E-Mail; Beschriftung «E-Mail vorbereiten», Hinweis statt Bestätigung, keine Speicherung.
Zusätzliches Feld Telefon (optional), Anliegen als Auswahl aus den Leistungsbereichen.

## 5. Eine Schriftfamilie, Logo-Rot als einziger Akzent
Kunden empfinden mehrere Schriften als uneinheitlich (Erfahrung clean-express). Schibsted Grotesk lokal. Rot aus dem Logo gemessen; der
Vorgänger nutzte Kupfer/Schiefer, deshalb hier bewusst Logo-treu.

## 6. Signatur «Sammelschiene» statt Karten
Leistungen hängen an einer Leitung: subjektnah (Verteiler), informativ (alle Abgänge gehören zum selben Betrieb), mobil als senkrechte Schiene.
Verworfen: drei gleiche Karten, Leiterbahnen-Deko (Vorgänger), Kennzahlen (keine Belege).

## 7. Leistungs-URLs ohne Joomla-IDs
`/elektroinstallationen/<slug>/` statt `/elektroinstallationen/42-planung-und-projektierung`; alte Adressen in `data/weiterleitungen.json`
(aktiv nur auf Vercel) und als `alteUrl` je Leistung.

## 8. Logo als Vektor-Nachbau
Quelle liefert nur 186×98 px. Nachbau in `components/Logo.tsx` (isometrische Würfel, drei Rottöne), im Impressum als Nachbildung deklariert;
Vektorlogo beim Kunden angefragt.

## 9. Keine KI-Bilder, keine Bildgenerierung
Entscheid des Auftraggebers (Rückfrage 25.09.2026). Nur Originalmaterial mit Herkunftsnachweis.

## 10. Wörtliche Ortsnamen
«Küssnacht» bleibt wie in der Quelle (vermutlich Küsnacht gemeint), mit sichtbarem Hinweis und offener Frage in `docs/UEBERGABE.md`.

## 11. Repo `altec-elektro-demo` neben `altec-elektro-website`
Das Vorgängerprojekt (statisches HTML auf GitLab) bleibt unverändert als eigener Ordner; dieses Repo ist ein Neubau, kein Reskin.
