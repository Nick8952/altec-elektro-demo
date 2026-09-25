import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Schibsted Grotesk (SIL OFL) aus dem fontsource-Paket, über next/font/local: Preload, font-display swap, angepasste Fallback-Metriken.
const schrift = localFont({
  // Nur der Latin-Schnitt (deckt Deutsch inkl. Umlaute ab); Latin-Extended würde ein zweites Preload von 47 KB kosten.
  src: "../node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2",
  weight: "400 900",
  style: "normal",
  variable: "--font-schrift",
  display: "swap",
  adjustFontFallback: "Arial",
});
import { inhaltsquelle } from "@/lib/content";
import { siteUrl } from "@/lib/deploy-ziel";
import { betriebJsonLd, indexierungErlaubt, jsonLdSicher } from "@/lib/seo";
import { Kopfzeile } from "@/components/Kopfzeile";
import { Fusszeile } from "@/components/Fusszeile";
import { MobilLeiste } from "@/components/MobilLeiste";
import { Einwilligung } from "@/components/Einwilligung";
import { VisualEditing } from "next-sanity/visual-editing";
import { istVorschau } from "@/lib/vorschau/status";

export async function generateMetadata(): Promise<Metadata> {
  const q = await inhaltsquelle();
  const [e, t] = await Promise.all([q.getEinstellungen(), q.getTexte()]);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${e.firma}: ${e.claim}`, template: `%s | ${t.seo.titelZusatz}` },
    description: t.seo.beschreibung,
    robots: indexierungErlaubt ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const q = await inhaltsquelle();
  const [e, t, team, leistungen, vorschau] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getTeam(), q.getLeistungen(), istVorschau()]);
  return (
    <html lang="de-CH" className={schrift.variable}>
      <body>
        <a href="#inhalt" className="nur-sr focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-klein)] focus:bg-tinte focus:px-4 focus:py-2 focus:text-papier">
          {t.ui.zumInhalt}
        </a>
        {!indexierungErlaubt && t.footer.demoHinweis ? (
          <p className="border-b border-linie bg-flaeche px-4 py-1.5 text-center text-[0.8125rem] text-tinte-2">{t.footer.demoHinweis}</p>
        ) : null}
        <Kopfzeile einstellungen={e} texte={t} />
        <main id="inhalt" tabIndex={-1} className="outline-none">{children}</main>
        <Fusszeile einstellungen={e} texte={t} />
        <MobilLeiste einstellungen={e} texte={t} />
        <Einwilligung texte={t.einwilligung} datenschutzPfad="/datenschutz/" />
        {indexierungErlaubt ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSicher(betriebJsonLd(e, team, leistungen)) }} /> : null}
        {vorschau ? <VisualEditing /> : null}
      </body>
    </html>
  );
}
