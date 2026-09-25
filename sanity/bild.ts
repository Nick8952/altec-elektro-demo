import { createImageUrlBuilder, type ImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "./client";
import type { Bild } from "@/lib/content/types";

let _builder: ImageUrlBuilder | undefined;
function builder(): ImageUrlBuilder {
  _builder ??= createImageUrlBuilder(client());
  return _builder;
}
const BREITEN = [480, 960, 1600];

/** Rohform, wie sie die GROQ-Projektion `BILD_PROJEKTION` liefert. */
export interface SanityBildRoh {
  asset?: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number } } };
  hotspot?: Record<string, number>;
  crop?: Record<string, number>;
  alt?: string;
}

export const BILD_PROJEKTION = `{ asset->{ _id, url, metadata { dimensions { width, height } } }, hotspot, crop, alt }`;

/** Wandelt ein Sanity-Bild in die gemeinsame `Bild`-Form um (Hotspot/Crop bleiben erhalten). */
export function sanityBild(roh: SanityBildRoh | null | undefined, fallbackAlt = ""): Bild | undefined {
  if (!roh?.asset) return undefined;
  const dims = roh.asset.metadata?.dimensions ?? { width: 1600, height: 1000 };
  const quelle = { asset: roh.asset, hotspot: roh.hotspot, crop: roh.crop } as SanityImageSource;
  return {
    id: roh.asset._id,
    alt: roh.alt ?? fallbackAlt,
    breite: dims.width,
    hoehe: dims.height,
    quellen: [...new Set(BREITEN.map((b) => Math.min(b, dims.width)))].map((b) => ({ breite: b, url: builder().image(quelle).width(b).auto("format").fit("max").url() })),
  };
}
