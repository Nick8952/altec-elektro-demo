"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { Texte } from "@/lib/content/types";
import { useEinwilligung } from "@/lib/einwilligung-hook";

/**
 * Einwilligungs-Banner («Alle akzeptieren» / «Nur notwendige» / «Einstellungen»), VORBEREITET.
 * Rendert nichts, solange `texte.einwilligung.kategorien` leer ist: die Demo bindet keine Dienste Dritter ein,
 * deshalb gibt es kein Banner. Mit mindestens einer Kategorie erscheinen Banner und Einstellungsdialog (natives <dialog>,
 * Fokusfang, Escape), optionale Kategorien sind standardmässig aus; Ablehnen ist ein Klick wie Zustimmen.
 * `EinwilligungFussLink` öffnet den Dialog erneut (Widerruf).
 */
export function Einwilligung({ texte: t, datenschutzPfad }: { texte: Texte["einwilligung"]; datenschutzPfad: string }) {
  const kennungen = t.kategorien.map((k) => k.kennung);
  const { einwilligung, geladen, setzen, widerrufen } = useEinwilligung(kennungen);
  const [dialogOffen, setDialogOffen] = useState(false);
  const [auswahl, setAuswahl] = useState<Record<string, boolean>>({});
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const oeffnen = () => { setAuswahl(einwilligung?.kategorien ?? {}); setDialogOffen(true); };
    window.addEventListener("altec-elektro-einwilligung-oeffnen", oeffnen);
    return () => window.removeEventListener("altec-elektro-einwilligung-oeffnen", oeffnen);
  }, [einwilligung]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (dialogOffen && !d.open) d.showModal();
    if (!dialogOffen && d.open) d.close();
  }, [dialogOffen]);

  if (!kennungen.length || !geladen) return null;
  const alle = Object.fromEntries(kennungen.map((k) => [k, true]));
  const keine = Object.fromEntries(kennungen.map((k) => [k, false]));
  const speichernUndSchliessen = (k: Record<string, boolean>) => { setzen(k); setDialogOffen(false); };

  return (
    <>
      {!einwilligung ? (
        <div role="region" aria-label={t.bannerTitel} className="fixed inset-x-0 bottom-0 z-50 border-t border-linie bg-papier shadow-[0_-12px_40px_-20px_rgb(23_26_31/0.35)]">
          <div className="behaelter grid gap-4 py-4 sm:py-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-bold">{t.bannerTitel}</p>
              <p className="klein mt-1 max-w-3xl text-tinte-2">
                {t.bannerText} <Link href={datenschutzPfad} className="textlink">{t.datenschutzerklaerung}</Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="knopf knopf-sekundaer knopf-klein" onClick={() => { setAuswahl({}); setDialogOffen(true); }}>{t.einstellungen}</button>
              <button type="button" className="knopf knopf-sekundaer knopf-klein" onClick={() => speichernUndSchliessen(keine)}>{t.nurNotwendige}</button>
              <button type="button" className="knopf knopf-primaer knopf-klein" onClick={() => speichernUndSchliessen(alle)}>{t.alleAkzeptieren}</button>
            </div>
          </div>
        </div>
      ) : null}

      <dialog ref={dialogRef} className="m-auto w-[min(92vw,34rem)] rounded-[var(--radius-mittel)] border border-linie bg-papier p-0 text-tinte" aria-labelledby={`${id}-titel`} onClose={() => setDialogOffen(false)} onCancel={(ev) => { ev.preventDefault(); setDialogOffen(false); }}>
        <form method="dialog" className="grid gap-5 p-6" onSubmit={(ev) => { ev.preventDefault(); speichernUndSchliessen({ ...keine, ...auswahl }); }}>
          <h2 id={`${id}-titel`} className="titel-3">{t.bannerTitel}</h2>
          <div className="grid gap-3">
            <label className="flex items-start gap-3 rounded-[var(--radius-klein)] border border-linie p-3">
              <input type="checkbox" checked disabled className="mt-1 size-5" />
              <span><span className="font-semibold">{t.notwendigTitel}</span><span className="klein block text-tinte-2">{t.notwendigText}</span></span>
            </label>
            {t.kategorien.map((k) => (
              <label key={k.kennung} className="flex items-start gap-3 rounded-[var(--radius-klein)] border border-linie p-3">
                <input type="checkbox" className="mt-1 size-5" checked={auswahl[k.kennung] === true} onChange={(ev) => setAuswahl({ ...auswahl, [k.kennung]: ev.target.checked })} />
                <span><span className="font-semibold">{k.titel}</span><span className="klein block text-tinte-2">{k.beschreibung}</span></span>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="knopf knopf-primaer knopf-klein">{t.auswahlSpeichern}</button>
            <button type="button" className="knopf knopf-sekundaer knopf-klein" onClick={() => speichernUndSchliessen(keine)}>{t.nurNotwendige}</button>
            {einwilligung ? <button type="button" className="knopf knopf-hell knopf-klein" onClick={() => { widerrufen(); setDialogOffen(false); }}>{t.widerrufen}</button> : null}
          </div>
        </form>
      </dialog>
    </>
  );
}

/** Link in der Fusszeile, der den Einstellungsdialog erneut öffnet; erscheint nur mit aktiven Kategorien. */
export function EinwilligungFussLink({ titel, aktiv }: { titel: string; aktiv: boolean }) {
  if (!aktiv) return null;
  return (
    <button type="button" className="textlink min-h-11" onClick={() => window.dispatchEvent(new Event("altec-elektro-einwilligung-oeffnen"))}>
      {titel}
    </button>
  );
}
