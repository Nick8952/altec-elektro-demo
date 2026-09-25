import type { Einstellungen, Texte } from "@/lib/content/types";
import { Navigation } from "./Navigation";

export function Kopfzeile({ einstellungen: e, texte: t }: { einstellungen: Einstellungen; texte: Texte }) {
  return <Navigation texte={t} firma={e.firma} />;
}
