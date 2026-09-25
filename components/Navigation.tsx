"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { CaretDown, List, Phone, X } from "@phosphor-icons/react";
import type { Texte } from "@/lib/content/types";
import { Logo } from "./Logo";
import { SmartLink } from "./SmartLink";

/**
 * Kopfzeile: Logo links, Hauptnavigation mit einem Untermenü (Leistungen), roter Notfall-Knopf rechts.
 * Untermenü: Knopf mit aria-expanded, Pfeiltasten, Escape, Klick ausserhalb. Mobil: Telefon-Knopf + Menü als natives <dialog>.
 * Kein Kopfzeilen-Band, keine zweite Zeile: die Notfallnummer ist ein Knopf, kein Banner.
 */
export function Navigation({ texte: t, firma }: { texte: Texte; firma: string }) {
  const pfad = usePathname();
  const [offen, setOffen] = useState<string | null>(null);
  const [menueOffen, setMenueOffen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();

  const aktiv = (ziel: string) => (ziel === "/" ? pfad === "/" : (pfad ?? "").startsWith(ziel));

  useEffect(() => {
    if (!offen) return;
    const ausserhalb = (ev: PointerEvent) => { if (navRef.current && !navRef.current.contains(ev.target as Node)) setOffen(null); };
    document.addEventListener("pointerdown", ausserhalb);
    return () => document.removeEventListener("pointerdown", ausserhalb);
  }, [offen]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (menueOffen && !d.open) d.showModal();
    if (!menueOffen && d.open) d.close();
  }, [menueOffen]);

  // Navigation schliesst beim Seitenwechsel (Zustand während des Renderns aus dem Pfad ableiten, kein Effekt nötig)
  const [letzterPfad, setLetzterPfad] = useState(pfad);
  if (pfad !== letzterPfad) { setLetzterPfad(pfad); setOffen(null); setMenueOffen(false); }

  const untermenueTasten = (ev: React.KeyboardEvent, key: string) => {
    const menue = document.getElementById(`${id}-${key}`);
    const eintraege = menue ? [...menue.querySelectorAll<HTMLAnchorElement>("a")] : [];
    const i = eintraege.indexOf(document.activeElement as HTMLAnchorElement);
    if (ev.key === "Escape") { ev.preventDefault(); setOffen(null); (ev.currentTarget.querySelector("button") as HTMLButtonElement | null)?.focus(); }
    else if (ev.key === "ArrowDown") { ev.preventDefault(); if (offen !== key) setOffen(key); requestAnimationFrame(() => (eintraege[Math.min(i + 1, eintraege.length - 1)] ?? document.getElementById(`${id}-${key}`)?.querySelector("a"))?.focus()); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); if (i > 0) eintraege[i - 1].focus(); else { setOffen(null); (ev.currentTarget.querySelector("button") as HTMLButtonElement | null)?.focus(); } }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-linie bg-papier/95 backdrop-blur-sm supports-[backdrop-filter]:bg-papier/85">
      <nav ref={navRef} aria-label={t.ui.hauptnavigation} className="behaelter flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="-ml-1 flex min-h-11 items-center rounded-[var(--radius-klein)] px-1">
          <Logo firma={firma} />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {t.navigation.map((n) =>
            n.kinder?.length ? (
              <li key={n._key} className="relative" onKeyDown={(ev) => untermenueTasten(ev, n._key)}>
                <div className="flex items-center">
                  <Link href={n.ziel} className={`inline-flex min-h-11 min-w-11 items-center rounded-[var(--radius-klein)] px-3 font-semibold transition-colors hover:text-rot ${aktiv(n.ziel) ? "text-rot" : "text-tinte"}`} aria-current={aktiv(n.ziel) ? "page" : undefined}>
                    {n.titel}
                  </Link>
                  <button type="button" className="inline-flex size-11 items-center justify-center rounded-[var(--radius-klein)] text-tinte-2 hover:text-rot" aria-expanded={offen === n._key} aria-controls={`${id}-${n._key}`} aria-label={`${n.titel}: Untermenü ${offen === n._key ? "schliessen" : "öffnen"}`} onClick={() => setOffen(offen === n._key ? null : n._key)}>
                    <CaretDown size={16} weight="bold" aria-hidden="true" className={`transition-transform ${offen === n._key ? "rotate-180" : ""}`} />
                  </button>
                </div>
                <ul id={`${id}-${n._key}`} className={`nav-untermenue absolute left-0 top-full mt-1 w-72 rounded-[var(--radius-mittel)] border border-linie bg-papier p-2 shadow-[0_16px_40px_-20px_rgb(23_26_31/0.35)] ${offen === n._key ? "block" : "hidden"}`}>
                  {n.kinder.map((k) => (
                    <li key={k.ziel}>
                      <SmartLink link={k} className={`block min-h-11 rounded-[var(--radius-klein)] px-3 py-2.5 text-[0.9375rem] font-medium hover:bg-flaeche ${aktiv(k.ziel) ? "text-rot" : "text-tinte"}`} aria-current={aktiv(k.ziel) ? "page" : undefined}>
                        {k.titel}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={n._key}>
                <Link href={n.ziel} className={`inline-flex min-h-11 min-w-11 items-center rounded-[var(--radius-klein)] px-3 font-semibold transition-colors hover:text-rot ${aktiv(n.ziel) ? "text-rot" : "text-tinte"}`} aria-current={aktiv(n.ziel) ? "page" : undefined}>
                  {n.titel}
                </Link>
              </li>
            ),
          )}
        </ul>

        <div className="flex items-center gap-2">
          <SmartLink link={t.kopfKnopf} className="knopf knopf-primaer knopf-klein hidden lg:inline-flex">
            <Phone size={18} weight="bold" aria-hidden="true" />
            {t.kopfKnopf.titel}
          </SmartLink>
          <SmartLink link={t.kopfKnopf} className="inline-flex size-12 items-center justify-center rounded-[var(--radius-klein)] bg-rot text-papier lg:hidden" aria-label={t.kopfKnopf.titel}>
            <Phone size={22} weight="bold" aria-hidden="true" />
          </SmartLink>
          <button type="button" className="inline-flex size-12 items-center justify-center rounded-[var(--radius-klein)] border border-linie text-tinte lg:hidden" aria-expanded={menueOffen} aria-controls={`${id}-menue`} aria-label={t.ui.menue} onClick={() => setMenueOffen(true)}>
            <List size={24} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <dialog
        ref={dialogRef}
        id={`${id}-menue`}
        className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-papier p-0 text-tinte sm:ml-auto sm:w-[24rem]"
        aria-label={t.ui.menue}
        onClose={() => setMenueOffen(false)}
        onCancel={(ev) => { ev.preventDefault(); setMenueOffen(false); }}
        onClick={(ev) => { if (ev.target === ev.currentTarget) setMenueOffen(false); }}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[4.5rem] items-center justify-between border-b border-linie px-4 sm:px-6">
            <Logo firma={firma} />
            <button type="button" className="inline-flex size-12 items-center justify-center rounded-[var(--radius-klein)] border border-linie" aria-label={t.ui.menueSchliessen} onClick={() => setMenueOffen(false)}>
              <X size={24} weight="bold" aria-hidden="true" />
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            {t.navigation.map((n) =>
              n.kinder?.length ? (
                <li key={n._key} className="border-b border-linie-hell">
                  <details open={aktiv(n.ziel)}>
                    <summary className="flex min-h-12 cursor-pointer items-center justify-between py-3 text-[1.125rem] font-bold">
                      {n.titel}
                      <CaretDown size={18} weight="bold" aria-hidden="true" />
                    </summary>
                    <ul className="pb-3">
                      <li>
                        <Link href={n.ziel} className="block min-h-11 py-2.5 pl-4 font-semibold text-rot">{t.ui.alleLeistungen}</Link>
                      </li>
                      {n.kinder.map((k) => (
                        <li key={k.ziel}>
                          <SmartLink link={k} className={`block min-h-11 py-2.5 pl-4 ${aktiv(k.ziel) ? "font-semibold text-rot" : "text-tinte-2"}`} aria-current={aktiv(k.ziel) ? "page" : undefined}>
                            {k.titel}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={n._key} className="border-b border-linie-hell">
                  <Link href={n.ziel} className={`flex min-h-12 items-center py-3 text-[1.125rem] font-bold ${aktiv(n.ziel) ? "text-rot" : ""}`} aria-current={aktiv(n.ziel) ? "page" : undefined}>
                    {n.titel}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="border-t border-linie p-4 sm:p-6">
            <SmartLink link={t.kopfKnopf} className="knopf knopf-primaer w-full">
              <Phone size={18} weight="bold" aria-hidden="true" />
              {t.kopfKnopf.titel}
            </SmartLink>
          </div>
        </div>
      </dialog>
    </header>
  );
}
