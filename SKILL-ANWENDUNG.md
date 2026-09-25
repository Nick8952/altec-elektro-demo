# Skill-Anwendung

Ehrliche Übersicht, welche installierten Claude-Code-Skills in diesem Projekt geprüft und wie sie angewendet wurden. «gelesen» heisst: die
SKILL.md wurde in der Sitzung vollständig geladen; «überflogen» heisst: Kopf und Anwendungsregeln gelesen, um die Relevanz zu beurteilen.
Die Skills wurden als Dateien gelesen und ihre Anleitungen manuell befolgt; Plugin-Skills (`design:*`) laufen als Anleitung, nicht als Werkzeug.
Konfliktregel des Auftraggebers: `design-taste-frontend` (v2) ist Standard; widersprechende Designsysteme werden nicht vermischt.

## Vom Auftraggeber genannte Skills

| Skill | Status | Konkrete Umsetzung | Konfliktauflösung | Abschlusskontrolle |
|---|---|---|---|---|
| `design-taste-frontend` (v2) | **angewendet** (gelesen) | Design Read + Dials (5/3/4) in `docs/DESIGN.md`; Hero im Viewport, Untertitel ≤ 20 Wörter, keine Eyebrows, keine drei gleichen Karten, kein Split-Header, ein Akzent, Shape-Lock (4/8 px), Button-Kontrast, kein Inter/Serif-Default, Motion motiviert (nur Einblenden), Copy-Selbstaudit (Satzzeichen-Fehler durch `tabular-nums` behoben) | Standard-System; wo `high-end-visual-design` (Doppelrand, Pill-Buttons, `py-40`) oder `gpt-taste` (GSAP, Bento) widersprechen, gilt v2 mit trust-first-Dials | Pre-Flight: Hero-Titel 2 Zeilen auf Desktop, Nav einzeilig, CTAs einzeilig, ein CTA-Wortlaut je Absicht («Projekt anfragen», «Notfalldienst anrufen») |
| `design-taste-frontend-v1` | nicht angewendet (gelesen) | keine Kompatibilitätsanforderung | v2 ist Standard | – |
| `frontend-design` (Projekt-Skill) | **angewendet** (gelesen) | Plan vor Code: Tokens, Schrift, Signatur «Sammelschiene» aus der Welt des Elektrikers (Verteiler, Schema-Symbole), Selbstkritik gegen die drei KI-Standardlooks, Copy als Gestaltungsmaterial («E-Mail vorbereiten», keine Werbefloskeln) | – | Screenshots 360/768/1440 gesichtet, eine Signatur, Rest ruhig |
| `high-end-visual-design` | **teilweise angewendet** (gelesen) | übernommen: keine harten Schatten, keine generischen Grauränder als Deko, `cubic-bezier`-Easing, Scroll-Reveal, GPU-sichere Animation, Blur nur auf Sticky-Kopfzeile | verworfen: Doppelrand-Karten, Pill-Buttons, «Fluid Island»-Nav, `py-40`, Grain (widersprechen trust-first und der Minimal-Vorgabe) | Kontrolle: keine `shadow-md`, keine `linear`-Transitions |
| `minimalist-ui` | **teilweise angewendet** (gelesen) | Prinzipien: Ränder 1 px, Radien ≤ 8 px, Weissraum, keine Gradienten, keine Emojis, keine Clichés im Text | verworfen: warmes Monochrom (`#F7F6F3`) und Serifen-Headlines, weil Logo-Rot und kühle Neutrale gefordert sind | Kontrolle: keine Gradienten im CSS |
| `redesign-existing-projects` | **angewendet** (gelesen) | Audit der alten Seite (Roboto via Google Fonts, Bootstrap-Karten, Share-Buttons, kein Impressum, kein Favicon, Joomla-IDs in URLs) → Inhaltsmatrix, neue IA, saubere Slugs, Weiterleitungen, Favicon, Rechtsseiten, Skip-Link, 404 | «Do not rewrite from scratch» gilt für bestehenden Code; hier war ein Neubau der Auftrag | Checkliste «Strategic Omissions» abgehakt |
| `full-output-enforcement` | **angewendet** (gelesen) | alle Seiten, Bausteine, Schemas, Skripte und Dokumente vollständig ausgeschrieben; keine Platzhalter, keine «…» | – | Grep nach `TODO`/`…` im Code: keine |
| `gpt-taste` | **nicht relevant** (gelesen) | GSAP-Pinning, Bento, Marquee und Randomisierung widersprechen «keine aufwendigen Scroll-Effekte» und trust-first | ausgeschlossen | – |
| `industrial-brutalist-ui` | **nicht relevant** (gelesen) | Brutalismus nicht erzwingen (Vorgabe); die Idee «Schema/Blueprint» floss nur als Symbolsprache ein, ohne Raw-Grid oder Degradation | ausgeschlossen | – |
| `stitch-design-taste` | **nicht relevant** (gelesen) | kein Google-Stitch-Zugang; `docs/DESIGN.md` erfüllt den Zweck einer DESIGN.md | ausgeschlossen | – |
| `brandkit` | **nicht relevant** (gelesen) | Bildgenerierungs-Skill; Auftraggeber hat Bildgenerierung abgelehnt. Markenanalyse (Logo-Rot gemessen, Würfel-Marke) manuell in `docs/DESIGN.md` | ausgeschlossen | – |
| `image-to-code` | **nicht relevant** (gelesen) | setzt generierte Design-Bilder voraus; keine Bildgenerierung | ausgeschlossen | – |
| `imagegen-frontend-web` / `imagegen-frontend-mobile` | **nicht relevant** (gelesen) | keine Bildgenerierung (Rückfrage 25.09.2026: «Nein») | ausgeschlossen | – |
| `find-skills` | **überflogen** | keine zusätzlichen Skills gesucht oder installiert (keine kostenpflichtigen Werkzeuge ohne Rückfrage) | – | – |

## Weitere geprüfte Skills (Projekt-/Plugin-Skills)

| Skill | Status | Anwendung |
|---|---|---|
| `ui-ux-pro-max` | teilweise (überflogen) | Prioritäten 1–9 als Checkliste: Kontrast ≥ 4.5:1 (gerechnet), Touch ≥ 44 px (Audit), CLS-Reservierung (width/height, aspect-ratio), Labels sichtbar, Fehler am Feld, keine Emoji-Icons. Suchskript nicht ausgeführt (Python-Tool; Markenfarben und Schrift standen bereits fest) |
| `design:accessibility-review` | angewendet als Prüfliste | Kontrast, Tastatur, Touch-Ziele, Fokus, Überschriften, Alt-Texte, Dialog-Fokus: siehe `docs/PRUEFBERICHT.md` |
| `design:ux-copy` | angewendet | CTA-Wortlaut konsistent, Fehlermeldungen direkt und ohne «Oops», Statusmeldung ohne falsche Bestätigung, Sie-Form |
| `design:design-critique` / `design:design-handoff` / `design:design-system` | teilweise | Selbstkritik in `docs/DESIGN.md`; Tokens in `app/globals.css` (`@theme`); Handoff = `CLAUDE.md` + `docs/` |
| `frontend-ui-engineering` | angewendet | Skip-Link mit Fokus, `aria-expanded`/`aria-controls`, Pfeiltasten/Escape, natives `<dialog>`, `aria-current`, `role="alert"`/`aria-live` |
| `api-and-interface-design` | angewendet | `Inhaltsquelle`-Schnittstelle mit zwei Adaptern, deutsche Typen, `Baustein`-Union, strikte Env-Validierung |
| `security-and-hardening` | angewendet | Link-Allowlist (`sichererLink`), `rel=noopener`, JSON-LD-Escaping, keine Geheimnisse, mailto-Kodierung, `contents: read` in CI, `npm audit` (siehe Prüfbericht) |
| `ci-cd-and-automation` | angewendet | Workflow: Inhalte → Lint → Typen → Build → Export-Prüfung → Browser-QA → Pages-Deploy; Vercel-Probebuild als zweiter Job |
| `code-review-and-quality`, `doubt-driven-development` | angewendet | zwei Codex-Reviews (Architektur, Abschluss), Befunde umgesetzt bzw. begründet abgelehnt (`docs/PRUEFBERICHT.md`) |
| `performance-optimization` | angewendet | Lighthouse gemessen (nicht geraten), Schrift per `next/font/local` vorgeladen, Bilder vorgerendert, keine externen Requests |
| `shipping-and-launch`, `deprecation-and-migration` | angewendet | Launch-Checkliste und Alt-URL-Weiterleitungen in `docs/UEBERGABE.md`, `data/weiterleitungen.json` |
| `documentation-and-adrs`, `context-engineering` | angewendet | `docs/ENTSCHEIDUNGEN.md`, `CLAUDE.md` nach Kontext-Hierarchie |
| `test-driven-development`, `debugging-and-error-recovery` | teilweise | Funktionsprüfungen vor Fixes geschrieben (Skip-Link-Fokus, Touch-Ziele); Ursachenanalyse bei Tailwind-`@apply`, `dynamicParams`, Satzzeichen |
| `source-driven-development` | teilweise | Rechtsgrundlagen aus Fedlex (UWG Art. 3 Abs. 1 Bst. s, DSG) geprüft; Next-APIs gegen installierte Typen |
| `browser-testing-with-devtools` | ersetzt | puppeteer-core statt DevTools-MCP (nicht konfiguriert) |
| `git-workflow-and-versioning` | angewendet | thematisch getrennte Erstcommits, `main` deploybar |
| `constraint-driven-development`, `interview-me`, `idea-refine`, `spec-driven-development`, `planning-and-task-breakdown`, `incremental-implementation` | überflogen | Spezifikation kam vollständig vom Auftraggeber; Rückfragen gebündelt (Bilder, Repo, Bildgenerierung); Aufbau in Scheiben |
| `observability-and-instrumentation` | nicht angewendet | bewusst keine Telemetrie |
| `banner-design`, `brand`, `design`, `design-system`, `slides`, `ui-styling`, `dataviz`, `vercel:*`, `anthropic-skills:*` | nicht relevant | keine Banner, Slides, Charts; Vercel-Plugin nicht genutzt, weil kein Vercel-Projekt angelegt werden darf |

## Ergebnis der Abschlusskontrolle

Siehe `docs/PRUEFBERICHT.md`: DOM-Audit 68/68 ohne Befund (17 Seiten × 4 Breiten), Funktionsprüfungen 40/40, Export-Prüfung grün,
Lighthouse gemessen (Werte im Prüfbericht), zwei Codex-Reviews mit umgesetzten Befunden.
