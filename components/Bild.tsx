import { assetUrl } from "@/lib/assets";
import type { Bild as BildTyp } from "@/lib/content/types";

/**
 * Bildausgabe mit srcset aus den vorgerechneten Varianten (lokal) bzw. Sanity-URLs.
 * Kein next/image: der statische Export hat keinen Optimierer; die Varianten liegen fertig vor.
 * width/height reservieren die Fläche (kein Layoutsprung).
 */
export function Bild({ bild, sizes = "100vw", className = "", prioritaet = false, style }: { bild: BildTyp; sizes?: string; className?: string; prioritaet?: boolean; style?: React.CSSProperties }) {
  const groesste = bild.quellen[bild.quellen.length - 1];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- statischer Export ohne Bild-Optimierer; Varianten liegen vorgerechnet vor
    <img
      src={assetUrl(groesste.url)}
      srcSet={bild.quellen.map((q) => `${assetUrl(q.url)} ${q.breite}w`).join(", ")}
      sizes={sizes}
      width={bild.breite}
      height={bild.hoehe}
      alt={bild.alt}
      loading={prioritaet ? "eager" : "lazy"}
      decoding={prioritaet ? "sync" : "async"}
      fetchPriority={prioritaet ? "high" : undefined}
      className={className}
      style={style}
    />
  );
}
