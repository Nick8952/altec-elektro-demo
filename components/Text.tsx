import type { TextBaustein } from "@/lib/content/types";
import { RichText } from "./RichText";
import { Bild } from "./Bild";

export function Text({ baustein: b }: { baustein: TextBaustein }) {
  const schmal = b.breite === "schmal" || !b.bild;
  return (
    <section id={b.anker} className="behaelter py-10 md:py-14">
      <div className={b.bild ? `grid gap-8 md:grid-cols-2 md:items-start ${b.bildPosition === "links" ? "md:[&>*:first-child]:order-2" : ""}` : ""}>
        <div className={`auftauchen ${schmal ? "max-w-3xl" : ""}`}>
          {b.titel ? <h2 className="titel-2 mb-6">{b.titel}</h2> : null}
          <RichText inhalt={b.inhalt} />
        </div>
        {b.bild ? (
          <div className="auftauchen overflow-hidden rounded-[var(--radius-mittel)] bg-flaeche" style={{ aspectRatio: `${b.bild.breite} / ${b.bild.hoehe}` }}>
            <Bild bild={b.bild} sizes="(min-width: 768px) 50vw, 100vw" className="h-full w-full object-cover" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
