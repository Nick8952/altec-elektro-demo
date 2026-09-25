import type { ZitatBaustein } from "@/lib/content/types";
import { RichText } from "./RichText";

/** Leitsatz des Unternehmens als grosse Zeile, darunter der Text der bisherigen Startseite in zwei Spalten. */
export function Zitat({ baustein: b }: { baustein: ZitatBaustein }) {
  return (
    <section id={b.anker} className="abschnitt border-y border-linie-hell bg-flaeche">
      <div className="behaelter">
        <blockquote className="auftauchen max-w-4xl">
          <p className="titel-2 md:text-[2.5rem] md:leading-[1.15]">«{b.zitat}»</p>
        </blockquote>
        {b.inhalt ? (
          <div className="auftauchen mt-8 md:mt-10">
            <RichText inhalt={b.inhalt} className="rechtstext columns-1 gap-10 md:columns-2 [&_p]:break-inside-avoid [&_p]:text-[1.0625rem]" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
