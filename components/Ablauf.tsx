import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { AblaufBaustein } from "@/lib/content/types";
import { SmartLink } from "./SmartLink";

/** Ablauf als echte Reihenfolge (planen, ausführen, warten); die Nummern tragen deshalb Information. */
export function Ablauf({ baustein: b }: { baustein: AblaufBaustein }) {
  return (
    <section id={b.anker} className="abschnitt border-y border-linie-hell bg-flaeche">
      <div className="behaelter">
        {b.titel ? <h2 className="titel-2 auftauchen">{b.titel}</h2> : null}
        {b.einleitung ? <p className="lauftext auftauchen mt-4">{b.einleitung}</p> : null}
        <ol className={`grid gap-8 md:grid-cols-3 md:gap-10 ${b.titel || b.einleitung ? "mt-10" : ""}`}>
          {b.schritte.map((s, i) => (
            <li key={s._key} className="auftauchen border-t-[3px] border-rot pt-5">
              <span className="font-mono text-[0.9375rem] font-semibold text-rot">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="titel-3 mt-2">{s.titel}</h3>
              <p className="klein mt-2 text-tinte-2">{s.text}</p>
              {s.link ? (
                <SmartLink link={s.link} className="mt-3 inline-flex min-h-11 items-center gap-1 text-[0.9375rem] font-semibold text-rot hover:underline">
                  {s.link.titel}
                  <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </SmartLink>
              ) : null}
            </li>
          ))}
        </ol>
        {b.knopf ? (
          <div className="auftauchen mt-10">
            <SmartLink link={b.knopf} className="knopf knopf-primaer">
              {b.knopf.titel}
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </SmartLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
