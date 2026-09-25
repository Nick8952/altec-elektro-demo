import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { leistungPfad, type LeistungenBaustein, type Texte } from "@/lib/content/types";
import { Symbol } from "./Symbol";
import { Bild } from "./Bild";

/**
 * Signatur «Sammelschiene»: Die acht Leistungen hängen als Abgänge an einer roten Leitung, wie Abgänge an der
 * Sammelschiene eines Verteilers. Desktop: zwei Reihen à vier Abgänge, jede Reihe mit eigener Schiene oben.
 * Mobil: eine senkrechte Schiene links, die Abgänge zweigen nach rechts ab. Die Anordnung ist Information
 * (alle Leistungen hängen am selben Betrieb), nicht Dekoration.
 * Darstellung «raster» (Übersichtsseite): dieselben Abgänge, zusätzlich mit dem Bild der Quelle.
 */
export function Leistungen({ baustein: b, texte: t }: { baustein: LeistungenBaustein; texte: Texte }) {
  const reihen = b.darstellung === "schiene" ? [b.leistungen.slice(0, 4), b.leistungen.slice(4)] : [b.leistungen];
  return (
    <section id={b.anker} className="abschnitt behaelter">
      {b.titel ? <h2 className="titel-2 auftauchen">{b.titel}</h2> : null}
      {b.einleitung ? <p className="lauftext auftauchen mt-4 text-[1.0625rem]">{b.einleitung}</p> : null}
      <div className={`schiene ${b.titel || b.einleitung ? "mt-10 md:mt-12" : ""} grid gap-y-10 md:gap-y-14`}>
        {reihen.filter((r) => r.length).map((reihe, i) => (
          <ul key={i} className={`schiene-reihe grid gap-x-6 gap-y-8 ${b.darstellung === "schiene" ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-4"}`}>
            {reihe.map((l) => (
              <li key={l.id} className="schiene-eintrag auftauchen">
                <Link href={leistungPfad(l.slug)} className="group grid gap-3 rounded-[var(--radius-klein)]">
                  <span className="symbol-box transition-colors group-hover:border-rot">
                    <Symbol art={l.symbol} />
                  </span>
                  {b.darstellung === "raster" && l.bild ? (
                    <span className="block overflow-hidden rounded-[var(--radius-klein)] bg-flaeche" style={{ aspectRatio: `${l.bild.breite} / ${l.bild.hoehe}` }}>
                      <Bild bild={l.bild} sizes="(min-width: 1024px) 280px, (min-width: 768px) 45vw, 100vw" className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-heraus)] group-hover:scale-[1.03]" />
                    </span>
                  ) : null}
                  <span className="titel-3 block group-hover:text-rot">{l.titel}</span>
                  <span className="klein block text-tinte-2">{l.kurz}</span>
                  <span className="inline-flex min-h-11 items-center gap-1 text-[0.9375rem] font-semibold text-rot">
                    {t.ui.mehrErfahren}
                    <ArrowRight size={16} weight="bold" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
