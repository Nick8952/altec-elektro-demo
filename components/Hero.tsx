import type { Hero as HeroTyp, Texte } from "@/lib/content/types";
import { Bild } from "./Bild";
import { SmartLink } from "./SmartLink";
import { Phone, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { leistungPfad, LEISTUNGEN_BASIS } from "@/lib/content/types";
import { Symbol } from "./Symbol";

/**
 * Drei Varianten:
 * - «verteiler» (Startseite): Titel und Knöpfe links, rechts ein Panel «Direkteinstieg» mit allen Leistungen an der roten
 *   Sammelschiene. Der erste Bildschirm zeigt damit sofort, wohin es weitergeht.
 * - «bildband» (Startseite): Titelblock oben links, darunter das Zürich-Panorama als Band über die volle Containerbreite.
 *   Keine Kacheln, keine Kennzahlen, kein Split-Screen: die Aussage steht oben, das Bild trägt den Ort.
 * - «kompakt» (Unterseiten): Titel, Einleitung, optional ein Knopf.
 */
export function Hero({ hero, texte: t }: { hero: HeroTyp; texte: Texte }) {
  const knoepfe = (
    <div className="flex flex-wrap gap-3">
      {hero.knopf ? (
        <SmartLink link={hero.knopf} className="knopf knopf-primaer">
          {hero.knopf.ziel.startsWith("tel:") ? <Phone size={18} weight="bold" aria-hidden="true" /> : null}
          {hero.knopf.titel}
          {!hero.knopf.ziel.startsWith("tel:") ? <ArrowRight size={18} weight="bold" aria-hidden="true" /> : null}
        </SmartLink>
      ) : null}
      {hero.zweiterKnopf ? (
        <SmartLink link={hero.zweiterKnopf} className="knopf knopf-sekundaer">
          {hero.zweiterKnopf.ziel.startsWith("tel:") ? <Phone size={18} weight="bold" aria-hidden="true" /> : null}
          {hero.zweiterKnopf.titel}
        </SmartLink>
      ) : null}
    </div>
  );

  if (hero.variante === "verteiler") {
    const leistungen = hero.leistungen ?? [];
    return (
      <section className="behaelter pt-10 md:pt-14 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <div className="hero-auftritt grid min-w-0 gap-6">
            <h1 className="titel-1 lg:text-[3.4rem]">{hero.titel}</h1>
            {hero.text ? <p className="max-w-[46ch] text-[1.125rem] leading-[1.5] text-tinte-2 md:text-[1.25rem]">{hero.text}</p> : null}
            {hero.knopf || hero.zweiterKnopf ? knoepfe : null}
          </div>
          {leistungen.length ? (
            <nav aria-label={hero.panelTitel ?? "Leistungen"} className="auftauchen rounded-[var(--radius-mittel)] border border-linie border-t-[3px] border-t-rot bg-papier p-4 sm:p-5">
              <p className="klein font-semibold text-tinte-2">{hero.panelTitel}</p>
              <ul className="mt-3 grid gap-x-4 sm:grid-cols-2">
                {leistungen.map((l) => (
                  <li key={l.id} className="border-t border-linie-hell first:border-t-0 sm:[&:nth-child(2)]:border-t-0">
                    <Link href={leistungPfad(l.slug)} className="group flex min-h-12 items-center gap-3 py-2 text-[0.9375rem] font-semibold text-tinte hover:text-rot">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-klein)] border border-linie text-rot transition-colors group-hover:border-rot" aria-hidden="true">
                        <Symbol art={l.symbol} className="size-5" />
                      </span>
                      {l.titel}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/${LEISTUNGEN_BASIS}/`} className="mt-3 inline-flex min-h-11 items-center gap-1 text-[0.9375rem] font-semibold text-rot hover:underline">
                {t.ui.alleLeistungen}
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </Link>
            </nav>
          ) : null}
        </div>
      </section>
    );
  }

  if (hero.variante === "bildband") {
    return (
      <section className="behaelter pt-10 md:pt-16">
        <div className="hero-auftritt grid min-w-0 gap-6 md:max-w-4xl">
          <h1 className="titel-1">{hero.titel}</h1>
          {hero.text ? <p className="max-w-[44ch] text-[1.125rem] leading-[1.5] text-tinte-2 md:text-[1.25rem]">{hero.text}</p> : null}
          {hero.knopf || hero.zweiterKnopf ? knoepfe : null}
        </div>
        {hero.bild ? (
          <div className="relative mt-10 md:mt-14">
            <div className="overflow-hidden rounded-[var(--radius-mittel)] bg-flaeche" style={{ aspectRatio: `${hero.bild.breite} / ${hero.bild.hoehe}` }}>
              <Bild bild={hero.bild} sizes="(min-width: 1280px) 1216px, 100vw" prioritaet className="h-full w-full object-cover" />
            </div>
            <span aria-hidden="true" className="absolute left-6 top-full h-10 w-[3px] bg-rot md:left-12 md:h-14" />
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="behaelter pt-10 md:pt-16">
      <div className="hero-auftritt grid min-w-0 gap-5 border-l-[3px] border-rot pl-5 md:max-w-3xl md:pl-8">
        <h1 className="titel-1">{hero.titel}</h1>
        {hero.text ? <p className="max-w-[60ch] text-[1.0625rem] leading-[1.6] text-tinte-2 md:text-[1.1875rem]">{hero.text}</p> : null}
        {hero.knopf || hero.zweiterKnopf ? knoepfe : null}
      </div>
    </section>
  );
}
