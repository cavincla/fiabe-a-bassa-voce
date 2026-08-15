function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}

// Posizioni fisse delle stelline: bastano poche per suggerire un cielo
// notturno senza dover generare una texture diversa per ogni seed.
const stars = [
  { cx: 60, cy: 55, r: 2.2 },
  { cx: 140, cy: 30, r: 1.6 },
  { cx: 230, cy: 70, r: 2 },
  { cx: 300, cy: 40, r: 1.6 },
  { cx: 340, cy: 110, r: 2.2 },
  { cx: 190, cy: 130, r: 1.4 },
  { cx: 90, cy: 160, r: 1.8 },
];

export function PageArt({ seed, label }: { seed: string; label: string }) {
  const id = seed.replace("#", "");
  const glowId = `glow-${id}`;
  const baseId = `base-${id}`;

  return (
    <svg
      viewBox="0 0 400 300"
      className="h-full w-full"
      role="img"
      aria-label={`Illustrazione placeholder per: ${label}`}
    >
      <defs>
        <linearGradient id={baseId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={shade(seed, 45)} />
          <stop offset="55%" stopColor={seed} />
          <stop offset="100%" stopColor={shade(seed, -45)} />
        </linearGradient>
        <radialGradient id={glowId} cx="78%" cy="12%" r="55%">
          <stop offset="0%" stopColor={shade(seed, 95)} stopOpacity="0.55" />
          <stop offset="100%" stopColor={shade(seed, 95)} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${baseId})`} />
      <rect width="400" height="300" fill={`url(#${glowId})`} />
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill="white"
          opacity={0.75}
        />
      ))}
    </svg>
  );
}
