import type { Baustein, Einstellungen, Texte } from "@/lib/content/types";
import { Text } from "./Text";
import { Leistungen } from "./Leistungen";
import { Zitat } from "./Zitat";
import { Spalten } from "./Spalten";
import { Notfall } from "./Notfall";
import { Team } from "./Team";
import { Partner } from "./Partner";
import { Kontakt } from "./Kontakt";
import { Aufruf } from "./Aufruf";
import { Hinweis } from "./Hinweis";
import { Fakten } from "./Fakten";
import { Zielgruppen } from "./Zielgruppen";
import { Ablauf } from "./Ablauf";

/** Ordnet jedem Bausteintyp seine Darstellung zu. Unbekannte Typen brechen den Build (kein stilles Weglassen). */
export function Bausteine({ bausteine, einstellungen, texte }: { bausteine: Baustein[]; einstellungen: Einstellungen; texte: Texte }) {
  return (
    <>
      {bausteine.map((b) => {
        switch (b._type) {
          case "textBaustein": return <Text key={b._key} baustein={b} />;
          case "leistungenBaustein": return <Leistungen key={b._key} baustein={b} texte={texte} />;
          case "zitatBaustein": return <Zitat key={b._key} baustein={b} />;
          case "spaltenBaustein": return <Spalten key={b._key} baustein={b} />;
          case "notfallBaustein": return <Notfall key={b._key} baustein={b} einstellungen={einstellungen} texte={texte} />;
          case "teamBaustein": return <Team key={b._key} baustein={b} />;
          case "partnerBaustein": return <Partner key={b._key} baustein={b} texte={texte} />;
          case "kontaktBaustein": return <Kontakt key={b._key} baustein={b} einstellungen={einstellungen} texte={texte} />;
          case "aufrufBaustein": return <Aufruf key={b._key} baustein={b} />;
          case "hinweisBaustein": return <Hinweis key={b._key} baustein={b} />;
          case "faktenBaustein": return <Fakten key={b._key} baustein={b} />;
          case "zielgruppenBaustein": return <Zielgruppen key={b._key} baustein={b} />;
          case "ablaufBaustein": return <Ablauf key={b._key} baustein={b} />;
          default: {
            const unbekannt: never = b;
            throw new Error(`Unbekannter Baustein: ${JSON.stringify(unbekannt).slice(0, 80)}`);
          }
        }
      })}
    </>
  );
}
