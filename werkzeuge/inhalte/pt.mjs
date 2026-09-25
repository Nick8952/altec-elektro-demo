// Markdown-ähnlicher Text → Portable Text (für die Demo-Inhalte). Unterstützt: Absätze, ## / ### / #### Titel,
// "- " Aufzählung, "1. " Nummerierung, "> " Zitat, **fett**, *kursiv*, [Text](Ziel).
// Schlüssel sind deterministisch je Aufruf-Reihenfolge; die Ausgabe ist damit reproduzierbar (Git-Diffs bleiben lesbar).
let keyZaehler = 0;
export const key = (p = "k") => `${p}${(++keyZaehler).toString(36)}`;
export const keysZuruecksetzen = () => { keyZaehler = 0; };

function spans(text) {
  const out = []; const defs = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0; let m;
  const push = (t, marks = []) => { if (t) out.push({ _type: "span", _key: key("s"), text: t, marks }); };
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) push(tok.slice(2, -2), ["strong"]);
    else if (tok.startsWith("*")) push(tok.slice(1, -1), ["em"]);
    else { const mm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/); const k = key("l"); defs.push({ _type: "link", _key: k, href: mm[2], extern: /^https?:/.test(mm[2]) }); push(mm[1], [k]); }
    last = m.index + tok.length;
  }
  push(text.slice(last));
  return { children: out, markDefs: defs };
}
const block = (style, text, extra = {}) => ({ _type: "block", _key: key("b"), style, ...spans(text), ...extra });

export function pt(md) {
  const zeilen = md.replace(/\r/g, "").split("\n");
  const blocks = []; let absatz = [];
  // Zeilen ohne Leerzeile dazwischen bleiben Zeilenumbrüche im selben Absatz (Adressen); Portable Text rendert «\n» als <br>.
  const flush = () => { if (absatz.length) { blocks.push(block("normal", absatz.join("\n").trim())); absatz = []; } };
  for (const roh of zeilen) {
    const z = roh.trimEnd();
    if (!z.trim()) { flush(); continue; }
    let m;
    if ((m = z.match(/^(#{2,4}) (.+)$/))) { flush(); blocks.push(block(`h${m[1].length}`, m[2])); }
    else if ((m = z.match(/^[-•] (.+)$/))) { flush(); blocks.push(block("normal", m[1], { listItem: "bullet", level: 1 })); }
    else if ((m = z.match(/^\d+[.)] (.+)$/))) { flush(); blocks.push(block("normal", m[1], { listItem: "number", level: 1 })); }
    else if ((m = z.match(/^> (.+)$/))) { flush(); blocks.push(block("blockquote", m[1])); }
    else absatz.push(z.trim());
  }
  flush();
  return blocks;
}
export const b = (typ, felder) => ({ _type: typ, _key: key("bs"), ...felder });
export const text = (md, felder = {}) => b("textBaustein", { inhalt: pt(md), ...felder });
export const hinweis = (md, art = "info", felder = {}) => b("hinweisBaustein", { inhalt: pt(md), art, ...felder });
export const bild = (id, alt) => ({ bild: id, alt });
