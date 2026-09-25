import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/client";
import { studioUrl } from "@/sanity/env";

/**
 * Draft Mode einschalten: wird vom Presentation-Tool im Studio aufgerufen (Geheimnisprüfung durch next-sanity).
 * Der Client wird erst beim tatsächlichen Aufruf gebaut, nicht beim Laden des Moduls, damit der Vercel-Build
 * auch ohne eingerichtetes Sanity-Projekt durchläuft.
 */
export async function GET(req: Request) {
  const { GET: handler } = defineEnableDraftMode({
    client: client().withConfig({ token: process.env.SANITY_API_READ_TOKEN, useCdn: false, perspective: "drafts", stega: { enabled: true, studioUrl } }),
  });
  return handler(req);
}
