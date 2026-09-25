/**
 * Einziger Ort, an dem der GitHub-Pages-Unterpfad vor Datei-URLs gesetzt wird.
 * `next/link` erledigt das für Seitenlinks selbst; Bilder und CSS-Hintergründe brauchen diesen Helfer.
 * Nur das Sanity-CDN ist als fremder Host erlaubt (wie `images.remotePatterns` in next.config.ts).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetUrl(pfad: string): string {
  if (/^https:\/\/cdn\.sanity\.io\//.test(pfad)) return pfad;
  if (/^([a-z]+:)?\/\//i.test(pfad) || /^[a-z]+:/i.test(pfad)) throw new Error(`assetUrl: nur lokale Pfade oder https://cdn.sanity.io/ sind erlaubt, nicht «${pfad.slice(0, 60)}».`);
  if (!pfad.startsWith("/")) return `${basePath}/${pfad}`;
  return `${basePath}${pfad}`;
}

/** Interne Links («/kontakt/») bleiben; externe/Sonder-Links werden erkannt. */
export function istExternerLink(ziel: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(ziel);
}

/**
 * Erlaubte Linkziele (auch aus dem CMS): interner Pfad («/kontakt/», nicht «//host»), http(s)://, mailto:, tel:.
 * http:// ist erlaubt, weil die Partner-Websites der Quelle teils nur über http verlinkt sind.
 * Alles andere (javascript:, data:, protokollrelative URLs) wird abgewiesen; dieselbe Regel gilt im Sanity-Schema.
 */
export function istErlaubtesLinkziel(ziel: string): boolean {
  return /^\/(?!\/)/.test(ziel) || /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:\+?[\d\s()-]+)$/.test(ziel);
}

/** Liefert das Ziel unverändert oder «#», wenn es nicht erlaubt ist (Schutz vor javascript:-Links aus Inhalten). */
export function sichererLink(ziel: string): string {
  return istErlaubtesLinkziel(ziel) ? ziel : "#";
}

/** «044 840 07 70» → «tel:+41448400770» */
export function telLink(nummer: string): string {
  const ziffern = nummer.replace(/\D/g, "");
  if (ziffern.startsWith("00")) return `tel:+${ziffern.slice(2)}`;
  if (ziffern.startsWith("0")) return `tel:+41${ziffern.slice(1)}`;
  return `tel:+${ziffern}`;
}
