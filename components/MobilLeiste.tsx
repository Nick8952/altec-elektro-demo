"use client";

import { usePathname } from "next/navigation";
import { Phone } from "@phosphor-icons/react";
import type { Einstellungen, Texte } from "@/lib/content/types";
import { telLink } from "@/lib/assets";
import { SmartLink } from "./SmartLink";

/**
 * Kompakte Kontaktleiste am unteren Bildschirmrand (nur unter lg): Anrufen + Projekt anfragen.
 * Auf der Kontaktseite ausgeblendet, damit sie das Formular nicht verdeckt. Ein Platzhalter gleicher Höhe
 * verhindert, dass die Leiste Inhalt oder Fusszeile überdeckt.
 */
export function MobilLeiste({ einstellungen: e, texte: t }: { einstellungen: Einstellungen; texte: Texte }) {
  const pfad = usePathname() ?? "";
  if (pfad.startsWith(t.mobilLeiste.anfragen.ziel)) return null;
  return (
    <>
      <div aria-hidden="true" className="h-[calc(4.5rem+env(safe-area-inset-bottom))] lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-linie bg-papier pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="grid grid-cols-2 gap-2 p-3">
          <a href={telLink(e.telefon)} className="knopf knopf-sekundaer px-3 text-[0.9375rem]">
            <Phone size={18} weight="bold" aria-hidden="true" />
            {t.mobilLeiste.anrufen}
          </a>
          <SmartLink link={t.mobilLeiste.anfragen} className="knopf knopf-primaer px-3 text-[0.9375rem]">
            {t.mobilLeiste.anfragen.titel}
          </SmartLink>
        </div>
      </div>
    </>
  );
}
