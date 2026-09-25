/**
 * Vektor-Nachbildung der Bildmarke (roter Würfelblock mit zwei gelösten Würfeln) und Wortmarke «ALTEC ELEKTRO GmbH».
 * Das Original liegt nur als 186×98-px-PNG vor (assets/originale/Altec_logo.png); ein Vektorlogo ist beim Kunden anzufragen.
 * Die Würfel werden isometrisch aus drei Flächen je Würfel berechnet, in drei Rottönen (oben hell, links mittel, rechts dunkel).
 */
const TOENE = { oben: "#d8323b", links: "#b3161f", rechts: "#7d0f16" };
const S = 7; // Kantenlänge einer Würfelfläche in Bildeinheiten
const COS = 0.866;
const SIN = 0.5;

function ecke(x: number, y: number, z: number): [number, number] {
  // isometrische Projektion: x nach rechts unten, y nach links unten, z nach oben
  return [(x - y) * COS * S, (x + y) * SIN * S - z * S];
}
function wuerfel(x: number, y: number, z: number, key: string) {
  const p = (dx: number, dy: number, dz: number) => ecke(x + dx, y + dy, z + dz).join(",");
  return (
    <g key={key}>
      <polygon points={[p(0, 0, 1), p(1, 0, 1), p(1, 1, 1), p(0, 1, 1)].join(" ")} fill={TOENE.oben} />
      <polygon points={[p(0, 1, 1), p(1, 1, 1), p(1, 1, 0), p(0, 1, 0)].join(" ")} fill={TOENE.links} />
      <polygon points={[p(1, 0, 1), p(1, 1, 1), p(1, 1, 0), p(1, 0, 0)].join(" ")} fill={TOENE.rechts} />
    </g>
  );
}

/** Würfelblock 2×2×2 plus zwei versetzte Würfel; Reihenfolge = Malreihenfolge (hinten zuerst). */
const WUERFEL: [number, number, number][] = [
  [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0],
  [0, 0, 1], [1, 0, 1], [0, 1, 1],
  [2.35, 0.2, 0.55],
  [0.4, 2.3, 0.35],
];

export function Bildmarke({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="-24 -12 52 42" className={className} aria-hidden="true" focusable="false">
      {WUERFEL.map(([x, y, z], i) => wuerfel(x, y, z, `w${i}`))}
    </svg>
  );
}

export function Logo({ firma, className = "" }: { firma: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} title={firma}>
      <Bildmarke />
      <span className="flex flex-col leading-none text-rot">
        <span className="text-[1.05rem] font-extrabold tracking-[0.02em]">ALTEC</span>
        <span className="text-[1.05rem] font-extrabold tracking-[0.02em]">ELEKTRO</span>
        <span className="mt-0.5 text-[0.62rem] font-semibold tracking-[0.04em] text-tinte-2">GmbH</span>
      </span>
    </span>
  );
}
