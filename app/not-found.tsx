import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { inhaltsquelle } from "@/lib/content";

export default async function NichtGefunden() {
  const q = await inhaltsquelle();
  const t = await q.getTexte();
  return (
    <section className="behaelter py-20 md:py-28">
      <div className="grid gap-5 border-l-[3px] border-rot pl-5 md:max-w-2xl md:pl-8">
        <p className="font-mono text-[0.9375rem] font-semibold text-grau">404</p>
        <h1 className="titel-1">{t.ui.seiteNichtGefunden}</h1>
        <p className="lauftext">{t.ui.seiteNichtGefundenText}</p>
        <Link href="/" className="knopf knopf-primaer justify-self-start">
          {t.ui.zurStartseite}
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
