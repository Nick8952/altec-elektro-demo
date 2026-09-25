import type { PartnerBaustein, Texte } from "@/lib/content/types";
import { Bild } from "./Bild";

/** Logowand: nur Logos, keine Kategorie-Etiketten. Verlinkt sind ausschliesslich Partner, die die Quelle verlinkt hat. */
export function Partner({ baustein: b, texte: t }: { baustein: PartnerBaustein; texte: Texte }) {
  const Huelle = b.titel ? "section" : "div";
  return (
    <Huelle id={b.anker} className="abschnitt behaelter">
      {b.titel ? <h2 className="titel-2 auftauchen">{b.titel}</h2> : null}
      {b.einleitung ? <p className="lauftext auftauchen mt-4">{b.einleitung}</p> : null}
      <ul className={`grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-mittel)] border border-linie bg-linie sm:grid-cols-3 lg:grid-cols-6 ${b.titel || b.einleitung ? "mt-10" : ""}`}>
        {b.partner.map((p) => {
          const inhalt = <Bild bild={p.logo} sizes="200px" className="max-h-12 w-auto max-w-[80%] object-contain" />;
          return (
            <li key={p.id} className="auftauchen flex min-h-28 items-center justify-center bg-papier p-5">
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 w-full items-center justify-center rounded-[var(--radius-klein)] transition-opacity hover:opacity-70" aria-label={`${p.name}: ${t.ui.webseite}`}>
                  {inhalt}
                </a>
              ) : (
                inhalt
              )}
            </li>
          );
        })}
      </ul>
    </Huelle>
  );
}
