import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ZielgruppenBaustein } from "@/lib/content/types";
import { Bild } from "./Bild";
import { SmartLink } from "./SmartLink";

/** Einstiege nach Zielgruppe: drei Kacheln mit Bild, kurzem Text und Link in die passende Leistung. */
export function Zielgruppen({ baustein: b }: { baustein: ZielgruppenBaustein }) {
  return (
    <section id={b.anker} className="abschnitt behaelter">
      {b.titel ? <h2 className="titel-2 auftauchen">{b.titel}</h2> : null}
      {b.einleitung ? <p className="lauftext auftauchen mt-4">{b.einleitung}</p> : null}
      <ul className={`grid gap-6 md:grid-cols-3 ${b.titel || b.einleitung ? "mt-10" : ""}`}>
        {b.gruppen.map((g) => (
          <li key={g._key} className="auftauchen">
            <SmartLink link={g.link} className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-mittel)] border border-linie bg-papier transition-colors hover:border-tinte">
              {g.bild ? (
                <span className="block overflow-hidden bg-flaeche" style={{ aspectRatio: `${g.bild.breite} / ${g.bild.hoehe}` }}>
                  <Bild bild={g.bild} sizes="(min-width: 768px) 33vw, 100vw" className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-heraus)] group-hover:scale-[1.03]" />
                </span>
              ) : null}
              <span className="flex flex-1 flex-col gap-2 p-5">
                <span className="titel-3 block group-hover:text-rot">{g.titel}</span>
                <span className="klein block text-tinte-2">{g.text}</span>
                <span className="mt-auto inline-flex min-h-11 items-center gap-1 pt-2 text-[0.9375rem] font-semibold text-rot">
                  {g.link.titel}
                  <ArrowRight size={16} weight="bold" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </SmartLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
