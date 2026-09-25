import Link from "next/link";
import { ArrowLeft, ArrowRight, Phone } from "@phosphor-icons/react/dist/ssr";
import { leistungPfad, LEISTUNGEN_BASIS, type Einstellungen, type Leistung, type Texte } from "@/lib/content/types";
import { telLink } from "@/lib/assets";
import { Bild } from "./Bild";
import { RichText } from "./RichText";
import { Symbol } from "./Symbol";

/**
 * Leistungs-Detailseite: Titel mit Symbol an der roten Schiene, Text der Quelle, das Originalbild (nur 590 px breit,
 * deshalb nie grösser als seine Spalte), dazu ein Kontaktkasten. Unten die Nachbarn auf der Schiene (vorherige/nächste Leistung).
 */
export function LeistungSeite({ leistung: l, alle, einstellungen: e, texte: t }: { leistung: Leistung; alle: Leistung[]; einstellungen: Einstellungen; texte: Texte }) {
  const i = alle.findIndex((x) => x.id === l.id);
  const vorher = i > 0 ? alle[i - 1] : undefined;
  const nachher = i < alle.length - 1 ? alle[i + 1] : undefined;
  return (
    <article>
      <section className="behaelter pt-10 md:pt-16">
        <p className="klein">
          <Link href={`/${LEISTUNGEN_BASIS}/`} className="inline-flex min-h-11 items-center gap-1 font-semibold text-tinte-2 hover:text-rot">
            <ArrowLeft size={16} weight="bold" aria-hidden="true" />
            {t.ui.zurUebersicht}
          </Link>
        </p>
        <div className="hero-auftritt mt-4 grid min-w-0 gap-5 border-l-[3px] border-rot pl-5 md:pl-8">
          <span className="symbol-box"><Symbol art={l.symbol} /></span>
          <h1 className="titel-1">{l.titel}</h1>
          <p className="max-w-[60ch] text-[1.0625rem] leading-[1.6] text-tinte-2 md:text-[1.1875rem]">{l.kurz}</p>
        </div>
      </section>
      <section className="behaelter py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="auftauchen">
            <RichText inhalt={l.inhalt.slice(1)} className="rechtstext max-w-[65ch] [&_p]:text-[1.0625rem]" />
          </div>
          <aside className="grid content-start gap-6">
            {l.bild ? (
              <figure className="auftauchen overflow-hidden rounded-[var(--radius-mittel)] bg-flaeche" style={{ aspectRatio: `${l.bild.breite} / ${l.bild.hoehe}` }}>
                <Bild bild={l.bild} sizes="(min-width: 1024px) 420px, 100vw" prioritaet className="h-full w-full object-cover" />
              </figure>
            ) : null}
            <div className="auftauchen grid gap-3 rounded-[var(--radius-mittel)] border border-linie p-5">
              <h2 className="titel-3">{t.formular.titel}</h2>
              <p className="klein text-tinte-2">{e.oeffnungszeitenText}</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/kontakt/" className="knopf knopf-primaer knopf-klein">{t.formular.titel}<ArrowRight size={16} weight="bold" aria-hidden="true" /></Link>
                <a href={telLink(e.telefon)} className="knopf knopf-sekundaer knopf-klein"><Phone size={16} weight="bold" aria-hidden="true" />{e.telefon}</a>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <nav aria-label={t.ui.weitereLeistungen} className="behaelter pb-14 md:pb-20">
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-mittel)] border border-linie bg-linie sm:grid-cols-2">
          {[{ l: vorher, label: t.ui.vorherigeLeistung, links: true }, { l: nachher, label: t.ui.naechsteLeistung, links: false }].map(({ l: n, label, links }) => (
            <li key={label} className="bg-papier">
              {n ? (
                <Link href={leistungPfad(n.slug)} className={`group flex min-h-24 items-center gap-4 p-5 hover:bg-flaeche ${links ? "" : "sm:flex-row-reverse sm:text-right"}`}>
                  {links ? <ArrowLeft size={20} weight="bold" aria-hidden="true" className="shrink-0 text-rot" /> : <ArrowRight size={20} weight="bold" aria-hidden="true" className="shrink-0 text-rot" />}
                  <span>
                    <span className="klein block text-grau">{label}</span>
                    <span className="block font-bold group-hover:text-rot">{n.titel}</span>
                  </span>
                </Link>
              ) : (
                <Link href={`/${LEISTUNGEN_BASIS}/`} className={`group flex min-h-24 items-center gap-4 p-5 hover:bg-flaeche ${links ? "" : "sm:flex-row-reverse sm:text-right"}`}>
                  <span><span className="klein block text-grau">{label}</span><span className="block font-bold group-hover:text-rot">{t.ui.alleLeistungen}</span></span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
