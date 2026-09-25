import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { RichText as RichTextTyp } from "@/lib/content/types";
import { SmartLink } from "./SmartLink";

const komponenten: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ value, children }) => <SmartLink link={{ ziel: (value as { href?: string })?.href ?? "#", extern: (value as { extern?: boolean })?.extern }}>{children}</SmartLink>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
};

export function RichText({ inhalt, className = "rechtstext" }: { inhalt: RichTextTyp; className?: string }) {
  return (
    <div className={className}>
      <PortableText value={inhalt} components={komponenten} />
    </div>
  );
}
