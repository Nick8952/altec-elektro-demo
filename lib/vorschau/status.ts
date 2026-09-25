import "server-only";
import { deployZiel } from "@/lib/deploy-ziel";

/**
 * Ist die Entwurfsvorschau (Draft Mode) aktiv?
 * Im statischen Export gibt es keine Cookies/Draft Mode: dort immer `false`,
 * ohne `draftMode()` überhaupt aufzurufen (das würde den Export brechen).
 */
export async function istVorschau(): Promise<boolean> {
  if (deployZiel !== "vercel") return false;
  try {
    const { draftMode } = await import("next/headers");
    return (await draftMode()).isEnabled;
  } catch {
    // Ausserhalb eines Requests (generateStaticParams, Build) gibt es keinen Draft Mode: veröffentlichte Inhalte.
    return false;
  }
}
