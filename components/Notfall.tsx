import { Phone } from "@phosphor-icons/react/dist/ssr";
import type { Einstellungen, NotfallBaustein, Texte } from "@/lib/content/types";
import { telLink } from "@/lib/assets";

/**
 * Notfalldienst, deutlich getrennt von den Büroöffnungszeiten: Verfügbarkeit, beide Nummern gross und wählbar,
 * Einsatzgebiete als Quartier- und Gemeindelisten (wörtlich aus der Quelle). Keine Anfahrtszeiten, keine Tarife.
 */
export function Notfall({ baustein: b, einstellungen: e, texte: t }: { baustein: NotfallBaustein; einstellungen: Einstellungen; texte: Texte }) {
  const n = e.notfall;
  return (
    <section id={b.anker} className={b.kompakt ? "behaelter pb-14 md:pb-20" : "abschnitt behaelter"}>
      <div className="auftauchen grid gap-8 rounded-[var(--radius-mittel)] border border-linie border-l-[6px] border-l-rot bg-papier p-6 md:grid-cols-[1.2fr_1fr] md:p-10">
        <div>
          <h2 className="titel-2">{b.titel ?? n.titel}</h2>
          <p className="mt-1 font-semibold text-rot">{n.verfuegbarkeit}</p>
          <p className="lauftext mt-4">{b.einleitung ?? n.text}</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2" aria-label={t.ui.notfallnummern}>
            {n.nummern.map((num) => (
              <li key={num}>
                <a href={telLink(num)} className="inline-flex min-h-14 w-full items-center gap-3 rounded-[var(--radius-klein)] bg-rot px-4 text-[1.25rem] font-bold text-papier transition-colors hover:bg-rot-dunkel">
                  <Phone size={22} weight="bold" aria-hidden="true" />
                  {num}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {b.mitGebieten ? (
          <div className="grid content-start gap-5 md:border-l md:border-linie md:pl-8">
            <div>
              <h3 className="text-[0.9375rem] font-bold">{t.ui.quartiere}</h3>
              <p className="klein mt-1 text-tinte-2">{n.quartiere.join(", ")}</p>
            </div>
            <div>
              <h3 className="text-[0.9375rem] font-bold">{t.ui.agglomeration}</h3>
              <p className="klein mt-1 text-tinte-2">{n.agglomeration.join(", ")}</p>
            </div>
            {n.hinweis ? <p className="klein text-grau">{n.hinweis}</p> : null}
          </div>
        ) : (
          <div className="grid content-center md:border-l md:border-linie md:pl-8">
            <h3 className="text-[0.9375rem] font-bold">{t.ui.buerozeiten}</h3>
            {e.oeffnungszeiten.map((z) => (
              <p key={z._key} className="klein mt-1 text-tinte-2">{z.tage}: {z.zeiten}</p>
            ))}
            <p className="klein mt-3 text-grau">{t.ui.notfalldienst}: {n.verfuegbarkeit}.</p>
          </div>
        )}
      </div>
    </section>
  );
}
