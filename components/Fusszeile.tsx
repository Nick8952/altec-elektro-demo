import Link from "next/link";
import type { Einstellungen, Texte } from "@/lib/content/types";
import { telLink } from "@/lib/assets";
import { Logo } from "./Logo";
import { SmartLink } from "./SmartLink";
import { EinwilligungFussLink } from "./Einwilligung";

/**
 * Fusszeile «Klemmleiste»: vier Felder nebeneinander (Firma, Leistungen, Unternehmen, Erreichbarkeit),
 * darunter die rechtlichen Links und der Demo-Hinweis. Büroöffnungszeiten und Notfalldienst stehen getrennt.
 */
export function Fusszeile({ einstellungen: e, texte: t }: { einstellungen: Einstellungen; texte: Texte }) {
  const jahr = new Date().getFullYear();
  return (
    <footer className="border-t-[3px] border-rot bg-flaeche">
      <div className="behaelter grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-8 lg:py-16">
        <div>
          <Link href="/" className="inline-flex min-h-11 items-center">
            <Logo firma={e.firma} />
          </Link>
          <p className="klein mt-4 max-w-xs text-tinte-2">{e.claim}</p>
          <address className="klein mt-4 not-italic text-tinte-2">
            {e.adresse.strasse}<br />
            {e.adresse.plz} {e.adresse.ort}
          </address>
        </div>
        {t.footer.gruppen.map((g) => (
          <nav key={g.titel} aria-label={g.titel}>
            <h2 className="text-[0.9375rem] font-bold">{g.titel}</h2>
            <ul className="mt-2 grid">
              {g.links.map((l) => (
                <li key={l.ziel}>
                  <SmartLink link={l} className="klein flex min-h-11 items-center text-tinte-2 transition-colors hover:text-rot">{l.titel}</SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className="grid gap-5">
          <div>
            <h2 className="text-[0.9375rem] font-bold">{t.ui.buerozeiten}</h2>
            <dl className="klein mt-3 grid gap-1 text-tinte-2">
              {e.oeffnungszeiten.map((z) => (
                <div key={z._key}>
                  <dt className="font-semibold text-tinte">{z.tage}</dt>
                  <dd>{z.zeiten}</dd>
                </div>
              ))}
            </dl>
            <p className="klein mt-2 text-tinte-2">
              <a href={telLink(e.telefon)} className="inline-flex min-h-11 items-center font-semibold text-tinte hover:text-rot">{e.telefon}</a>
              <br />
              <a href={`mailto:${e.email}`} className="inline-flex min-h-11 items-center font-semibold text-tinte hover:text-rot">{e.email}</a>
              {e.fax ? <><br /><span className="inline-flex min-h-9 items-center">{t.ui.fax} {e.fax}</span></> : null}
            </p>
          </div>
          <div className="rounded-[var(--radius-mittel)] border-l-[3px] border-rot bg-papier p-4">
            <h2 className="text-[0.9375rem] font-bold">{e.notfall.titel}</h2>
            <p className="klein text-tinte-2">{e.notfall.verfuegbarkeit}</p>
            <ul className="mt-1 grid">
              {e.notfall.nummern.map((n) => (
                <li key={n}>
                  <a href={telLink(n)} className="inline-flex min-h-11 items-center text-[1.0625rem] font-bold text-rot">{n}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-linie">
        <div className="behaelter flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {t.footer.rechtslinks.map((l) => (
              <li key={l.ziel}>
                <SmartLink link={l} className="klein inline-flex min-h-11 items-center text-tinte-2 hover:text-rot">{l.titel}</SmartLink>
              </li>
            ))}
            <li>
              <EinwilligungFussLink titel={t.einwilligung.bannerTitel} aktiv={t.einwilligung.kategorien.length > 0} />
            </li>
          </ul>
          <p className="klein text-grau">© {jahr} {e.firma}{t.footer.demoHinweis ? ` · ${t.footer.demoHinweis}` : ""}</p>
        </div>
      </div>
    </footer>
  );
}
