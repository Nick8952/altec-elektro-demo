/** Eigenes, leeres Layout für das Studio (ohne Kopf-/Fusszeile der Website). */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: "100dvh" }}>{children}</div>;
}
