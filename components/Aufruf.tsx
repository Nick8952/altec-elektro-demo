import { ArrowRight, Phone } from "@phosphor-icons/react/dist/ssr";
import type { AufrufBaustein } from "@/lib/content/types";
import { SmartLink } from "./SmartLink";

export function Aufruf({ baustein: b }: { baustein: AufrufBaustein }) {
  return (
    <section id={b.anker} className="behaelter pb-14 md:pb-20">
      <div className="auftauchen grid gap-6 rounded-[var(--radius-mittel)] bg-flaeche p-6 md:grid-cols-[1fr_auto] md:items-center md:p-10">
        <div>
          {b.titel ? <h2 className="titel-3">{b.titel}</h2> : null}
          {b.text ? <p className="lauftext mt-2">{b.text}</p> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <SmartLink link={b.knopf} className="knopf knopf-primaer">
            {b.knopf.ziel.startsWith("tel:") ? <Phone size={18} weight="bold" aria-hidden="true" /> : null}
            {b.knopf.titel}
            {!b.knopf.ziel.startsWith("tel:") ? <ArrowRight size={18} weight="bold" aria-hidden="true" /> : null}
          </SmartLink>
          {b.zweiterKnopf ? (
            <SmartLink link={b.zweiterKnopf} className="knopf knopf-sekundaer">
              {b.zweiterKnopf.ziel.startsWith("tel:") ? <Phone size={18} weight="bold" aria-hidden="true" /> : null}
              {b.zweiterKnopf.titel}
            </SmartLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
