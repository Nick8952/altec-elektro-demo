import { Info, Warning } from "@phosphor-icons/react/dist/ssr";
import type { HinweisBaustein } from "@/lib/content/types";
import { RichText } from "./RichText";

export function Hinweis({ baustein: b }: { baustein: HinweisBaustein }) {
  const wichtig = b.art === "wichtig";
  return (
    <section id={b.anker} className="behaelter pb-10">
      <div className={`auftauchen flex max-w-3xl gap-3 rounded-[var(--radius-mittel)] border p-4 md:p-5 ${wichtig ? "border-rot/40 bg-rot-hell" : "border-linie bg-flaeche"}`} role={wichtig ? "note" : undefined}>
        <span className={`mt-0.5 shrink-0 ${wichtig ? "text-rot" : "text-tinte-2"}`} aria-hidden="true">
          {wichtig ? <Warning size={22} weight="bold" /> : <Info size={22} weight="bold" />}
        </span>
        <RichText inhalt={b.inhalt} className="rechtstext klein [&_p]:mb-2 [&_p:last-child]:mb-0" />
      </div>
    </section>
  );
}
