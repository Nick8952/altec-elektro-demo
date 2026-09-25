# Design «Sammelschiene»

**Design Read** (design-taste-frontend, Abschnitt 0): Neuaufbau (Overhaul) der Website eines Zürcher Elektroinstallateurs für
Eigentümer, Verwaltungen und Gewerbe; Sprache «präzise, kompetent, zugänglich»; Tailwind v4 + lokale Grotesk + zurückhaltende Bewegung.
Dials: DESIGN_VARIANCE 5, MOTION_INTENSITY 3, VISUAL_DENSITY 4 (trust-first, kein Agentur-Feuerwerk).

## Signatur

Die **Sammelschiene**: Im Verteiler hängen alle Abgänge an einer gemeinsamen Schiene. Auf der Startseite und der Übersicht hängen die
acht Leistungen als Abgänge an einer roten Leitung (`components/Leistungen.tsx`, CSS `.schiene*` in `app/globals.css`): Desktop zwei Reihen
mit je einer Schiene oben, mobil eine senkrechte Schiene links mit Abzweigen nach rechts. Die rote Linie taucht als **Abgang** unter dem
Hero-Bild wieder auf und als Leitschiene links an jedem Seitentitel (Variante «kompakt», Leistungs-Detailseiten, 404). Jede Leistung hat ein
schematisches Zeichen (`components/Symbol.tsx`: Plan, Schalter, Sicherung, Motor, Lampe, Steckdose, Antenne, Glocke), angelehnt an
Symbole aus Elektroschemas, eine Strichstärke, rein dekorativ. Das ist die eine Stelle, an der das Design «laut» ist; alles andere bleibt ruhig.

Abgrenzung zum Vorgängerprojekt `altec-elektro-website` (2026-08): dort Zilla Slab + Figtree, Kupfer/Schieferblau, Topbar mit Notfallnummer,
Split-Hero mit überlappender Notfallkarte, Leiterbahnen-Grafik hinter Leistungskarten, Stepper. Hier: eine Schriftfamilie, Logo-Rot, kein Topbar
(Notfall als Knopf in der Kopfzeile), Hero mit Bildband, Leistungen als Schiene statt Karten, Team als Liste, Footer «Klemmleiste».

## Farben (`@theme` in `app/globals.css`)

| Token | Wert | Rolle |
|---|---|---|
| `--color-rot` | `#b3161f` | Akzent (aus dem Logo gemessen: rgb 176/24/32), Knöpfe, Schiene, Notfall; Kontrast auf Weiss 6.5:1 |
| `--color-rot-dunkel` | `#8c1018` | Hover |
| `--color-rot-hell` | `#fbecec` | Fläche für wichtige Hinweise, Textauswahl |
| `--color-tinte` | `#171a1f` | Text, Überschriften |
| `--color-tinte-2` | `#3f4650` | Lauftext (Kontrast 10:1) |
| `--color-grau` | `#5f6670` | Nebenangaben (Kontrast 5.4:1) |
| `--color-linie`, `--color-linie-hell` | `#d6dbe1`, `#e8ecf0` | Trennlinien, Ränder |
| `--color-flaeche` | `#f2f4f6` | ruhige Flächen (Leitsatz, Fusszeile, Aufruf) |
| `--color-papier` | `#ffffff` | Grund |

Kühle Neutraltöne, keine warmen Cremes, kein zweiter Akzent. Helles Theme fix.

## Schrift

**Schibsted Grotesk** (variable, 400–900, lokal über `@fontsource-variable/schibsted-grotesk`, SIL OFL). Eine Familie für alles:
Titel fett mit engem Durchschuss und negativer Laufweite (`.titel-1` 2–3.75 rem fluid, `.titel-2`, `.titel-3`), Lauftext 1.0625 rem / 1.6,
Nebenangaben `.klein` 0.9375 rem. Kein `tabular-nums` (verbreitert in dieser Schrift Punkt und Komma). Monospace nur für die «404».

## Raster, Abstände, Radien

Container 76 rem, Seitenränder 16/24/32 px, Abschnitte `py-14/20/24`. Eckenradien: 4 px Bedienelemente/Eingaben, 8 px Flächen/Karten.
Karten nur, wo sie Hierarchie tragen (Notfall-Block, Formular, Aufruf); sonst Linien und Weissraum. Maximal ein Layout-Muster pro Seite doppelt.

## Seitenrhythmus Startseite

1. Hero «Bildband»: Titel oben links, Untertitel ≤ 20 Wörter, zwei Knöpfe, darunter das Zürich-Panorama über die volle Breite, roter Abgang.
2. Leistungen an der Sammelschiene (2 × 4).
3. Leitsatz auf grauer Fläche, darunter die zwei Leitsätze der Quelle in zwei Spalten.
4. Notfall-Block (rote Leitschiene, zwei grosse Nummern, Quartiere/Gemeinden).
5. Team als Liste mit Linien.
6. Partner-Logowand (nur Logos).
7. Kontakt (Adresse/Zeiten links, Verweis aufs Formular rechts).

## Bewegung

Nur Einblenden beim Scrollen (`.auftauchen`, CSS `animation-timeline: view()`, 0.7 s, ohne JavaScript) und ein gestaffelter Hero-Auftritt.
Beides nur bei `prefers-reduced-motion: no-preference`; ohne Unterstützung oder mit reduzierter Bewegung ist alles sofort sichtbar.
Hover: Farbwechsel, Pfeil rückt 2 px, Bild im Raster skaliert 3 %. `:active` drückt 1 px. Keine Parallaxe, keine Scroll-Hijacks.

## Navigation und Erreichbarkeit

Kopfzeile 72 px, sticky, leicht transparent. Desktop: Logo, fünf Punkte (Elektroinstallationen mit Untermenü der acht Leistungen), roter
Notfall-Knopf mit Nummer. Mobil: roter Telefonknopf, Menüknopf → natives `<dialog>` als Seitenblatt (Fokusfang, Escape), unten die mobile
Kontaktleiste «Anrufen / Projekt anfragen» (nicht auf /kontakt/, Platzhalter verhindert Überdecken). Fusszeile «Klemmleiste»: vier Felder,
rote Oberkante, Bürozeiten und Notfall getrennt.

## Logo

Vektor-Nachbau der Bildmarke: isometrischer Würfelblock 2×2×2 plus zwei gelöste Würfel in drei Rottönen (`components/Logo.tsx`),
Wortmarke «ALTEC ELEKTRO GmbH» in der Website-Schrift. Das Original-PNG dient nur als Referenz. Vektorlogo beim Kunden anfragen.

## Selbstkritik (frontend-design)

Verworfen: dunkle Hero-Fläche mit Glow (Standard), drei gleiche Feature-Karten (Standard), Kupfer-Palette (Vorgänger), Serifen-Display
(nicht zur Marke), Kennzahlen-Leiste (keine belegten Zahlen), Karten-Einbettung (Datenschutz). Behalten: ein Signaturelement, sonst Ruhe.
