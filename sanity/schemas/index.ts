import { adresseTyp, bildTyp, linkTyp, navEintragTyp, notfallTyp, oeffnungszeitTyp, richTextTyp } from "./objekte";
import { bausteine } from "./bausteine";
import { einstellungenTyp, leistungTyp, partnerTyp, seiteTyp, teammitgliedTyp, texteTyp } from "./dokumente";

export const schemaTypes = [bildTyp, linkTyp, navEintragTyp, richTextTyp, adresseTyp, oeffnungszeitTyp, notfallTyp, ...bausteine, einstellungenTyp, texteTyp, seiteTyp, leistungTyp, teammitgliedTyp, partnerTyp];
