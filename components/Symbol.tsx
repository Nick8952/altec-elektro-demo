import type { Symbol as SymbolTyp } from "@/lib/content/types";

/**
 * Schematische Zeichen für die acht Leistungen, angelehnt an Symbole aus Elektroschemas (Lampe = Kreis mit Kreuz,
 * Motor = Kreis mit M, Steckdose, Schalter, Sicherung, Antenne, Glocke, Plan). Einfache Geometrie, eine Strichstärke,
 * rein dekorativ (aria-hidden); die Bedeutung trägt immer der Text daneben.
 */
const PFADE: Record<SymbolTyp, React.ReactNode> = {
  plan: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M4 10h16M10 4v16M14 10v10M4 15h6" />
    </>
  ),
  service: (
    <>
      <path d="M3 12h5M16 12h5" />
      <path d="M8 12l7-5" />
      <circle cx="8" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  bau: (
    <>
      <path d="M3 12h3M18 12h3" />
      <rect x="6" y="8" width="12" height="8" rx="1" />
      <path d="M6 12h12" />
    </>
  ),
  motor: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 15V9l3.5 4 3.5-4v6" />
    </>
  ),
  lampe: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7" />
    </>
  ),
  steckdose: (
    <>
      <path d="M6 12a6 6 0 0 1 12 0" />
      <path d="M6 12h12M12 12v7" />
    </>
  ),
  antenne: (
    <>
      <path d="M12 21V9M5 4l7 5 7-5" />
      <path d="M8 9l4 3 4-3" />
    </>
  ),
  alarm: (
    <>
      <path d="M5 14a7 7 0 0 1 14 0v2H5v-2Z" />
      <path d="M12 7V4M9 19h6" />
    </>
  ),
};

export function Symbol({ art, className = "size-6" }: { art: SymbolTyp; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {PFADE[art]}
    </svg>
  );
}
