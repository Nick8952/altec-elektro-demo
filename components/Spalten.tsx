import type { SpaltenBaustein } from "@/lib/content/types";
import { RichText } from "./RichText";

export function Spalten({ baustein: b }: { baustein: SpaltenBaustein }) {
  return (
    <section id={b.anker} className="abschnitt behaelter">
      {b.titel ? <h2 className="titel-2 auftauchen">{b.titel}</h2> : null}
      {b.einleitung ? <p className="lauftext auftauchen mt-4">{b.einleitung}</p> : null}
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {b.spalten.map((s) => (
          <div key={s._key} className="auftauchen border-t border-linie pt-5">
            <h3 className="titel-3">{s.titel}</h3>
            <RichText inhalt={s.inhalt} className="rechtstext mt-3" />
          </div>
        ))}
      </div>
    </section>
  );
}
