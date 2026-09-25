import type { Einstellungen, Seite as SeiteTyp, Texte } from "@/lib/content/types";
import { Hero } from "@/components/Hero";
import { Bausteine } from "@/components/Bausteine";

export function Seite({ seite, einstellungen, texte }: { seite: SeiteTyp; einstellungen: Einstellungen; texte: Texte }) {
  return (
    <>
      {seite.hero ? <Hero hero={seite.hero} texte={texte} /> : null}
      {seite.art === "rechtliches" && seite.stand ? (
        <p className="behaelter klein mt-4 text-grau">{texte.ui.stand}: {seite.stand}</p>
      ) : null}
      <Bausteine bausteine={seite.bausteine} einstellungen={einstellungen} texte={texte} />
    </>
  );
}
