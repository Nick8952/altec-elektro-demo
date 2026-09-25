import { SealCheck, Certificate, Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
import type { FaktenBaustein, FaktSymbol } from "@/lib/content/types";

const ICONS: Record<FaktSymbol, React.ComponentType<{ size?: number; weight?: "bold"; "aria-hidden"?: boolean | "true" }>> = { siegel: SealCheck, diplom: Certificate, uhr: Clock, ort: MapPin };

/** Faktenleiste unter dem Hero: belegte Merkmale des Betriebs, keine Kennzahlen. */
export function Fakten({ baustein: b }: { baustein: FaktenBaustein }) {
  return (
    <section id={b.anker} className="behaelter mt-12 md:mt-16" aria-label={b.titel ?? "Merkmale des Betriebs"}>
      <ul className="auftauchen grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-mittel)] border border-linie bg-linie sm:grid-cols-2 lg:grid-cols-4">
        {b.fakten.map((f) => {
          const Icon = ICONS[f.symbol];
          return (
            <li key={f._key} className="flex gap-3 bg-papier p-5">
              <span className="mt-0.5 shrink-0 text-rot" aria-hidden="true"><Icon size={24} weight="bold" /></span>
              <span>
                <span className="block font-bold leading-tight">{f.titel}</span>
                <span className="klein mt-1 block text-tinte-2">{f.text}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
