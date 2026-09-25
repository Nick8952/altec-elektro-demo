import { ArrowRight, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { Einstellungen, KontaktBaustein, Texte } from "@/lib/content/types";
import { sichererLink, telLink } from "@/lib/assets";
import { Anfrageformular } from "./Anfrageformular";

/**
 * Kontakt: Adresse, Telefon, Fax, E-Mail als Liste; Büroöffnungszeiten getrennt vom Notfalldienst; Karte nur als externer Link.
 * Mit Formular (Kontaktseite) oder mit Verweis auf die Kontaktseite (Startseite).
 */
export function Kontakt({ baustein: b, einstellungen: e, texte: t }: { baustein: KontaktBaustein; einstellungen: Einstellungen; texte: Texte }) {
  return (
    <section id={b.anker} className="abschnitt behaelter">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div className="auftauchen">
          {b.titel ? <h2 className="titel-2">{b.titel}</h2> : null}
          {b.einleitung ? <p className="lauftext mt-4">{b.einleitung}</p> : null}
          <dl className={`grid gap-4 ${b.titel || b.einleitung ? "mt-8" : ""}`}>
            <div className="grid gap-1 border-t border-linie pt-4 sm:grid-cols-[8.5rem_1fr] sm:gap-3">
              <dt className="klein font-semibold text-grau">{t.ui.adresse}</dt>
              <dd>
                <address className="not-italic">{e.firma}<br />{e.adresse.strasse}<br />{e.adresse.plz} {e.adresse.ort}</address>
                <a href={sichererLink(e.routenlink)} target="_blank" rel="noopener noreferrer" className="textlink mt-2 inline-flex min-h-11 items-center gap-1 text-[0.9375rem]">
                  {t.ui.route}
                  <ArrowSquareOut size={16} weight="bold" aria-hidden="true" />
                </a>
              </dd>
            </div>
            <div className="grid gap-1 border-t border-linie pt-4 sm:grid-cols-[8.5rem_1fr] sm:gap-3">
              <dt className="klein font-semibold text-grau">{t.ui.telefon}</dt>
              <dd><a href={telLink(e.telefon)} className="inline-flex min-h-11 items-center text-[1.125rem] font-bold hover:text-rot">{e.telefon}</a></dd>
            </div>
            {e.fax ? (
              <div className="grid gap-1 border-t border-linie pt-4 sm:grid-cols-[8.5rem_1fr] sm:gap-3">
                <dt className="klein font-semibold text-grau">{t.ui.fax}</dt>
                <dd className="inline-flex min-h-11 items-center">{e.fax}</dd>
              </div>
            ) : null}
            <div className="grid gap-1 border-t border-linie pt-4 sm:grid-cols-[8.5rem_1fr] sm:gap-3">
              <dt className="klein font-semibold text-grau">{t.ui.email}</dt>
              <dd><a href={`mailto:${e.email}`} className="inline-flex min-h-11 items-center break-all font-bold hover:text-rot">{e.email}</a></dd>
            </div>
            {b.mitOeffnungszeiten ? (
              <div className="grid gap-1 border-t border-linie pt-4 sm:grid-cols-[8.5rem_1fr] sm:gap-3">
                <dt className="klein font-semibold text-grau">{t.ui.buerozeiten}</dt>
                <dd>
                  {e.oeffnungszeiten.map((z) => (
                    <p key={z._key}><span className="font-semibold">{z.tage}</span><br />{z.zeiten}</p>
                  ))}
                  <p className="klein mt-2 text-tinte-2">{t.ui.notfalldienst}: {e.notfall.verfuegbarkeit}, <Link href="/notfalldienst/" className="textlink">{e.notfall.nummern[0]}</Link></p>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
        <div className="auftauchen">
          {b.mitFormular ? (
            <Anfrageformular einstellungen={e} texte={t} />
          ) : (
            <div className="grid gap-4 rounded-[var(--radius-mittel)] bg-flaeche p-6 md:p-8">
              <h3 className="titel-3">{t.formular.titel}</h3>
              <p className="lauftext">{t.formular.nachrichtHilfe}</p>
              <Link href="/kontakt/" className="knopf knopf-primaer justify-self-start">
                {t.formular.titel}
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
