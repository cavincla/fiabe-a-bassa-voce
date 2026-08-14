function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}

export function PageArt({ seed, label }: { seed: string; label: string }) {
  const gradientId = `art-${seed.replace("#", "")}`;
  return (
    <svg
      viewBox="0 0 400 300"
      className="h-full w-full"
      role="img"
      aria-label={`Illustrazione placeholder per: ${label}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={shade(seed, 40)} />
          <stop offset="100%" stopColor={shade(seed, -30)} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${gradientId})`} />
      <circle cx="320" cy="60" r="34" fill={shade(seed, 70)} opacity="0.7" />
      <circle cx="70" cy="230" r="60" fill={shade(seed, -10)} opacity="0.4" />
    </svg>
  );
}
