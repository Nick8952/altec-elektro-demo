import type { ZitatBaustein } from "@/lib/content/types";
import { RichText } from "./RichText";
import { Bild } from "./Bild";

/** Leitsatz des Unternehmens als grosse Zeile, darunter der Text der bisherigen Startseite; optional das Standort-Bild rechts. */
export function Zitat({ baustein: b }: { baustein: ZitatBaustein }) {
  return (
    <section id={b.anker} className="abschnitt behaelter">
      <div className={b.bild ? "grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16" : ""}>
        <div>
          <blockquote className="auftauchen border-l-[3px] border-rot pl-5 md:pl-8">
            <p className="titel-2">«{b.zitat}»</p>
          </blockquote>
          {b.inhalt ? (
            <div className="auftauchen mt-8">
              <RichText inhalt={b.inhalt} className="rechtstext max-w-[60ch] [&_p]:text-[1.0625rem]" />
            </div>
          ) : null}
        </div>
        {b.bild ? (
          <figure className="auftauchen">
            <div className="overflow-hidden rounded-[var(--radius-mittel)] bg-flaeche" style={{ aspectRatio: `${b.bild.breite} / ${b.bild.hoehe}` }}>
              <Bild bild={b.bild} sizes="(min-width: 1024px) 45vw, 100vw" className="h-full w-full object-cover" />
            </div>
            {b.bildText ? <figcaption className="klein mt-2 text-grau">{b.bildText}</figcaption> : null}
          </figure>
        ) : null}
      </div>
    </section>
  );
}
