import Link from "next/link";
import { istExternerLink, sichererLink } from "@/lib/assets";
import type { Link as LinkTyp } from "@/lib/content/types";

/** Ankündigung für Screenreader; Bedienelement-Text, kein Geschäftsinhalt. */
export const NEUER_TAB = "öffnet in neuem Tab";

/** Interne Ziele über next/link (Unterpfad automatisch), externe/tel/mailto als <a>; nur erlaubte Schemata. */
export function SmartLink({ link, className, children, ...rest }: { link: Pick<LinkTyp, "ziel" | "extern">; className?: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const ziel = sichererLink(link.ziel);
  if (istExternerLink(ziel) || ziel === "#") {
    const neuerTab = link.extern || /^https?:/.test(ziel);
    return (
      <a href={ziel} className={className} {...(neuerTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
        {neuerTab ? <span className="nur-sr"> ({NEUER_TAB})</span> : null}
      </a>
    );
  }
  return (
    <Link href={ziel} className={className} {...rest}>
      {children}
    </Link>
  );
}
