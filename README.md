# Altec Elektro GmbH: Verkaufs-Demo

Gestaltungsvorschlag für die Website der **Altec Elektro GmbH** (Elektroinstallationen und Telekommunikation, Zürich Seefeld),
gebaut auf Grundlage der bestehenden Website altec-elektro.ch. Unverbindliche Demo, nicht die offizielle Website des Unternehmens.

- **Live-Demo:** https://nick8952.github.io/altec-elektro-demo/ (noindex, mit Demo-Hinweis)
- **Stack:** Next.js 16, TypeScript, Tailwind CSS v4, statischer Export auf GitHub Pages. Sanity 6 und Vercel sind vorbereitet, aber nicht eingerichtet.
- **Design:** «Sammelschiene», siehe `docs/DESIGN.md`.

## Schnellstart

```bash
npm ci
npm run dev            # http://localhost:3000/altec-elektro-demo/
npm run pruefen        # Inhalte, Lint, Typen
npm run build          # statischer Export nach out/
npm run export:pruefen # Export prüfen
npm run vorschau:pages # Export lokal wie auf GitHub Pages: http://localhost:4321/altec-elektro-demo/
npm run qa             # Browser-Prüfungen (Vorschau-Server muss laufen)
```

## Dokumentation

| Datei | Inhalt |
|---|---|
| `CLAUDE.md` / `AGENTS.md` | Architektur, Regeln, Befehle für Claude Code und Codex |
| `docs/INHALTSMATRIX.md` | Bestandsaufnahme der alten Website, Zuordnung und Übernahmestatus |
| `docs/DESIGN.md` | Designkonzept, Tokens, Schrift, Bewegung |
| `docs/ENTSCHEIDUNGEN.md` | Wichtige Entscheidungen mit Begründung |
| `docs/SANITY-VERCEL-EINRICHTUNG.md` | Schritt-für-Schritt-Anleitung für Sanity und Vercel (später) |
| `docs/INHALTE-PFLEGEN.md` | Inhalte ändern und veröffentlichen, heute und später |
| `docs/UEBERGABE.md` | Offene Punkte, benötigte Angaben, Freigaben, Launch-Checkliste |
| `docs/PRUEFBERICHT.md` | Prüfergebnisse (Audit, Funktionen, Lighthouse, Codex) |
| `SKILL-ANWENDUNG.md` | Welche Claude-Code-Skills wie angewendet wurden |
| `assets/originale/HERKUNFT.md` | Herkunft aller Bilder |

## Rechte

Texte, Fotos und Logos stammen von altec-elektro.ch und gehören der Altec Elektro GmbH bzw. den jeweiligen Urhebern. Sie werden hier
ausschliesslich zur Präsentation eines Gestaltungsvorschlags verwendet (siehe `docs/UEBERGABE.md`, A3). Der Quellcode dieses Repos
stammt von Nick Holzbecher.
