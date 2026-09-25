import type { TeamBaustein } from "@/lib/content/types";

/**
 * Team als Liste mit Trennlinien: Name gross, Funktion darunter. Keine Fotos (die Quelle hat keine),
 * keine Initialen-Avatare, keine erfundenen Beschreibungen.
 */
export function Team({ baustein: b }: { baustein: TeamBaustein }) {
  const Huelle = b.titel ? "section" : "div";
  return (
    <Huelle id={b.anker} className="abschnitt behaelter">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="auftauchen">
          {b.titel ? <h2 className="titel-2">{b.titel}</h2> : null}
          {b.einleitung ? <p className="lauftext mt-4">{b.einleitung}</p> : null}
        </div>
        <ul className="auftauchen divide-y divide-linie border-y border-linie">
          {b.team.map((p) => (
            <li key={p.id} className="grid gap-1 py-5 sm:grid-cols-[1.2fr_1fr] sm:items-baseline sm:gap-6">
              <p className="text-[1.375rem] font-bold leading-tight md:text-[1.625rem]">{p.name}</p>
              <p className="text-tinte-2">{p.funktion}</p>
            </li>
          ))}
        </ul>
      </div>
    </Huelle>
  );
}
