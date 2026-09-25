import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityPruefen, studioUrl } from "./env";

/**
 * Lese-Client für veröffentlichte Inhalte (CDN, gecacht). `vorschauClient()` liefert einen Client mit Token,
 * Perspektive «drafts» und Stega-Kodierung (Visual Editing).
 * Lazy gebaut: `createClient` wirft sofort, wenn `projectId` leer ist. Das blosse Importieren dieser Datei
 * (z. B. durch die Vorschau-/Revalidate-Routen im Vercel-Build) darf den Build nicht brechen.
 */
let _client: SanityClient | undefined;

export function client(): SanityClient {
  sanityPruefen();
  _client ??= createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published", stega: { enabled: false, studioUrl } });
  return _client;
}

export function vorschauClient(): SanityClient {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) throw new Error("SANITY_API_READ_TOKEN fehlt: nötig für die Entwurfsvorschau.");
  return client().withConfig({ useCdn: false, token, perspective: "drafts", stega: { enabled: true, studioUrl } });
}
