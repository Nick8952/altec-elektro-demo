import type { Hero as HeroTyp } from "@/lib/content/types";
import { Bild } from "./Bild";
import { SmartLink } from "./SmartLink";
import { Phone, ArrowRight } from "@phosphor-icons/react/dist/ssr";

/**
 * Zwei Varianten:
 * - «bildband» (Startseite): Titelblock oben links, darunter das Zürich-Panorama als Band über die volle Containerbreite.
 *   Keine Kacheln, keine Kennzahlen, kein Split-Screen: die Aussage steht oben, das Bild trägt den Ort.
 * - «kompakt» (Unterseiten): Titel, Einleitung, optional ein Knopf.
 */
export function Hero({ hero }: { hero: HeroTyp }) {
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
