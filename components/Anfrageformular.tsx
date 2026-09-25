"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { EnvelopeSimple } from "@phosphor-icons/react";
import type { Einstellungen, Texte } from "@/lib/content/types";

/**
 * «E-Mail vorbereiten»: baut aus Name, E-Mail, optionaler Telefonnummer, Anliegen und Nachricht einen mailto:-Link
 * und öffnet das E-Mail-Programm der Nutzerin. Die Website sendet, speichert und protokolliert nichts; es gibt keine
 * Versandbestätigung, nur den Hinweis, dass sich das E-Mail-Programm öffnen sollte. Ohne JavaScript: direkter E-Mail-Link (<noscript>).
 */
export function Anfrageformular({ einstellungen: e, texte: t }: { einstellungen: Einstellungen; texte: Texte }) {
  const f = t.formular;
  const id = useId();
  // Mit JavaScript: eigene, beschriftete Fehlermeldungen (noValidate). Ohne JavaScript: das Formular sendet nichts (kein action=mailto,
  // weil Browser/Lighthouse eine mailto-Formularaktion als unsicheren Request werten); stattdessen zeigt <noscript> einen direkten E-Mail-Link.
  const geladen = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [betreff, setBetreff] = useState(f.betreffOptionen[0]?.wert ?? "");
  const [nachricht, setNachricht] = useState("");
  const [fehler, setFehler] = useState<{ name?: string; email?: string; nachricht?: string }>({});
  const [vorbereitet, setVorbereitet] = useState(false);

  const betreffTitel = f.betreffOptionen.find((o) => o.wert === betreff)?.titel ?? betreff;
  const emailGueltig = (w: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(w.trim());
  const text = [`Name: ${name.trim()}`, `E-Mail: ${email.trim()}`, telefon.trim() ? `Telefon: ${telefon.trim()}` : null, `Anliegen: ${betreffTitel}`, "", nachricht.trim()].filter((z) => z !== null).join("\n");
  const mailto = `mailto:${e.email}?subject=${encodeURIComponent(`Anfrage über die Website: ${betreffTitel}`)}&body=${encodeURIComponent(text)}`;

  return (
    <form
      className="grid gap-5 rounded-[var(--radius-mittel)] border border-linie bg-papier p-6 sm:p-8"
      noValidate={geladen}
      onSubmit={(ev) => {
        ev.preventDefault();
        const neu: typeof fehler = {};
        if (!name.trim()) neu.name = f.fehlerName;
        if (!emailGueltig(email)) neu.email = f.fehlerEmail;
        if (!nachricht.trim()) neu.nachricht = f.fehlerNachricht;
        setFehler(neu);
        const erstes = (["name", "email", "nachricht"] as const).find((k) => neu[k]);
        if (erstes) { document.getElementById(`${id}-${erstes}`)?.focus(); return; }
        window.location.href = mailto;
        setVorbereitet(true);
      }}
    >
      <div>
        <h2 className="titel-3">{f.titel}</h2>
        <p className="klein mt-2 text-tinte-2">{f.einleitung}</p>
        <noscript>
          <p className="klein mt-2 text-tinte-2">
            <a href={`mailto:${e.email}?subject=${encodeURIComponent("Anfrage über die Website")}`} className="textlink">{f.emailVorbereiten}: {e.email}</a>
          </p>
        </noscript>
      </div>
      <div className="feld">
        <label htmlFor={`${id}-name`}>{f.name} <span aria-hidden="true">*</span></label>
        <input id={`${id}-name`} name="Name" type="text" autoComplete="name" maxLength={100} required aria-required="true" aria-invalid={fehler.name ? "true" : undefined} aria-describedby={fehler.name ? `${id}-name-fehler` : undefined} value={name} onChange={(ev) => setName(ev.target.value)} />
        {fehler.name ? <p id={`${id}-name-fehler`} className="fehler klein" role="alert">{fehler.name}</p> : null}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="feld">
          <label htmlFor={`${id}-email`}>{f.email} <span aria-hidden="true">*</span></label>
          <input id={`${id}-email`} name="E-Mail" type="email" autoComplete="email" inputMode="email" maxLength={120} required aria-required="true" aria-invalid={fehler.email ? "true" : undefined} aria-describedby={fehler.email ? `${id}-email-fehler` : undefined} value={email} onChange={(ev) => setEmail(ev.target.value)} />
          {fehler.email ? <p id={`${id}-email-fehler`} className="fehler klein" role="alert">{fehler.email}</p> : null}
        </div>
        <div className="feld">
          <label htmlFor={`${id}-telefon`}>{f.telefon}</label>
          <input id={`${id}-telefon`} name="Telefon" type="tel" autoComplete="tel" inputMode="tel" maxLength={40} value={telefon} onChange={(ev) => setTelefon(ev.target.value)} />
        </div>
      </div>
      <div className="feld">
        <label htmlFor={`${id}-betreff`}>{f.betreff}</label>
        <select id={`${id}-betreff`} name="Anliegen" value={betreff} onChange={(ev) => setBetreff(ev.target.value)}>
          {f.betreffOptionen.map((o) => (
            <option key={o.wert} value={o.wert}>{o.titel}</option>
          ))}
        </select>
      </div>
      <div className="feld">
        <label htmlFor={`${id}-nachricht`}>{f.nachricht} <span aria-hidden="true">*</span></label>
        <textarea id={`${id}-nachricht`} name="Nachricht" rows={5} maxLength={1500} required aria-required="true" aria-invalid={fehler.nachricht ? "true" : undefined} aria-describedby={`${id}-hilfe${fehler.nachricht ? ` ${id}-nachricht-fehler` : ""}`} value={nachricht} onChange={(ev) => setNachricht(ev.target.value)} />
        <p id={`${id}-hilfe`} className="feld-hilfe">{f.nachrichtHilfe} ({nachricht.length}/1500)</p>
        {fehler.nachricht ? <p id={`${id}-nachricht-fehler`} className="fehler klein" role="alert">{fehler.nachricht}</p> : null}
      </div>
      <p className="klein text-grau">{f.pflicht} {f.datenschutzHinweis}</p>
      <div className="grid gap-3">
        <button type="submit" className="knopf knopf-primaer justify-self-start">
          <EnvelopeSimple size={20} weight="bold" aria-hidden="true" />
          {f.emailVorbereiten}
        </button>
        <p role="status" aria-live="polite" className="klein text-tinte-2">{vorbereitet ? f.hinweisNachher : ""}</p>
      </div>
    </form>
  );
}
