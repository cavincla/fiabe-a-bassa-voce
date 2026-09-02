export type ArtIcon =
  | "carrot"
  | "raven"
  | "sprout"
  | "firefly"
  | "umbrella"
  | "hedgehog"
  | "turtle"
  | "cat"
  | "fox"
  | "bear"
  | "dragon"
  | "moon";

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

// Sagome minimaliste, una per storia: non illustrazioni realistiche, ma
// abbastanza riconoscibili da rendere ogni pagina "sua" invece di un
// gradiente anonimo. Ogni icona vive in un riquadro locale 0..170 e viene
// posizionata dal chiamante.
function IconShape({ icon, fill, glow }: { icon: ArtIcon; fill: string; glow: string }) {
  switch (icon) {
    case "carrot":
      return (
        <g>
          <path d="M85 20 L100 -5 M85 20 L70 -8 M85 20 L85 -10" stroke={fill} strokeWidth="6" strokeLinecap="round" />
          <path d="M85 20 C130 30 140 90 100 145 C90 158 80 158 70 145 C30 90 40 30 85 20 Z" fill={fill} />
        </g>
      );
    case "raven":
      return (
        <g>
          <path d="M20 90 C10 60 40 20 90 25 C130 28 150 55 145 75 C165 70 172 85 158 95 C165 110 150 118 138 110 C128 130 100 138 78 128 C50 150 15 135 20 105 Z" fill={fill} />
          <circle cx="112" cy="55" r="5" fill={glow} />
        </g>
      );
    case "sprout":
      return (
        <g>
          <path d="M70 150 C70 100 70 70 70 30" stroke={fill} strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M70 70 C38 64 22 36 28 6 C56 12 74 34 70 70 Z" fill={fill} />
          <path d="M70 70 C102 64 118 36 112 6 C84 12 66 34 70 70 Z" fill={fill} />
        </g>
      );
    case "firefly":
      return (
        <g>
          <circle cx="75" cy="95" r="30" fill={glow} opacity="0.4" />
          <path d="M55 85 C35 72 26 78 20 66" stroke={fill} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M95 85 C115 72 124 78 130 66" stroke={fill} strokeWidth="4" strokeLinecap="round" fill="none" />
          <ellipse cx="75" cy="92" rx="18" ry="14" fill={fill} />
          <circle cx="75" cy="106" r="7" fill={glow} />
        </g>
      );
    case "umbrella":
      return (
        <g>
          <path d="M10 75 A65 65 0 0 1 140 75 Z" fill={fill} />
          <path d="M10 75 Q30 86 52 75 Q75 86 98 75 Q120 86 140 75" stroke={glow} strokeWidth="3" fill="none" opacity="0.5" />
          <path d="M75 75 L75 138" stroke={fill} strokeWidth="6" strokeLinecap="round" />
          <path d="M75 138 C75 154 97 154 97 135" stroke={fill} strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      );
    case "hedgehog":
      return (
        <g>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const x = 25 + i * 15;
            return (
              <path
                key={i}
                d={`M${x} 65 L${x - 6} 20 L${x + 10} 60 Z`}
                fill={fill}
              />
            );
          })}
          <path d="M15 100 C10 75 30 55 75 55 C120 55 138 80 128 108 C118 130 25 130 15 100 Z" fill={fill} />
          <circle cx="112" cy="82" r="4" fill={glow} />
        </g>
      );
    case "turtle":
      return (
        <g>
          <ellipse cx="75" cy="95" rx="58" ry="40" fill={fill} />
          <path d="M20 95 H130 M75 58 V132 M40 70 L110 120 M40 120 L110 70" stroke={glow} strokeWidth="2.5" opacity="0.45" fill="none" />
          <circle cx="132" cy="88" r="15" fill={fill} />
          <circle cx="20" cy="118" r="10" fill={fill} />
          <circle cx="130" cy="128" r="10" fill={fill} />
        </g>
      );
    case "cat":
      return (
        <g>
          <path d="M38 40 L54 8 L64 46 Z" fill={fill} />
          <path d="M112 40 L96 8 L86 46 Z" fill={fill} />
          <circle cx="75" cy="70" r="36" fill={fill} />
          <ellipse cx="75" cy="132" rx="32" ry="27" fill={fill} />
          <path d="M100 138 C138 140 140 96 118 90" stroke={fill} strokeWidth="7" fill="none" strokeLinecap="round" />
          <circle cx="63" cy="68" r="3.5" fill={glow} />
          <circle cx="87" cy="68" r="3.5" fill={glow} />
        </g>
      );
    case "fox":
      return (
        <g>
          <path d="M75 25 L108 68 L42 68 Z" fill={fill} />
          <path d="M52 35 L40 5 L62 42 Z" fill={fill} />
          <path d="M98 35 L110 5 L88 42 Z" fill={fill} />
          <ellipse cx="75" cy="122" rx="36" ry="32" fill={fill} />
          <path d="M106 132 C150 142 158 96 130 84 C146 106 136 124 106 132 Z" fill={fill} />
          <circle cx="75" cy="62" r="3.5" fill={glow} />
        </g>
      );
    case "bear":
      return (
        <g>
          <circle cx="48" cy="32" r="16" fill={fill} />
          <circle cx="102" cy="32" r="16" fill={fill} />
          <circle cx="75" cy="66" r="42" fill={fill} />
          <ellipse cx="75" cy="140" rx="46" ry="34" fill={fill} />
          <circle cx="75" cy="76" r="10" fill={glow} opacity="0.55" />
        </g>
      );
    case "dragon":
      return (
        <g>
          <path
            d="M8 128 C22 66 66 40 112 56 C136 64 142 38 122 22 C146 26 152 54 134 72 C118 62 90 62 70 92 C54 116 32 132 8 128 Z"
            fill={fill}
          />
          <path d="M62 32 L72 4 L78 32 Z" fill={fill} />
          <path d="M40 82 L14 70 L36 100 Z" fill={fill} />
          <circle cx="118" cy="40" r="3.5" fill={glow} />
        </g>
      );
    case "moon":
      return (
        <g>
          <mask id="moon-crescent-mask">
            <rect x="0" y="0" width="170" height="170" fill="white" />
            <circle cx="96" cy="56" r="42" fill="black" />
          </mask>
          <circle cx="75" cy="75" r="46" fill={fill} mask="url(#moon-crescent-mask)" />
          {[
            { x: 20, y: 130, r: 2 },
            { x: 135, y: 115, r: 1.6 },
            { x: 145, y: 45, r: 1.8 },
          ].map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={glow} opacity="0.85" />
          ))}
        </g>
      );
    default:
      return null;
  }
}

export function PageArt({
  seed,
  label,
  icon,
}: {
  seed: string;
  label: string;
  icon?: ArtIcon;
}) {
  const id = seed.replace("#", "");
  const glowId = `glow-${id}`;
  const baseId = `base-${id}`;
  const iconFill = icon === "moon" ? "#f4e6bd" : "rgba(255,255,255,0.92)";
  const iconGlow = icon === "firefly" || icon === "moon" ? "#f4e6bd" : "rgba(255,255,255,0.85)";

  return (
    <svg
      viewBox="0 0 400 300"
      className="h-full w-full"
      role="img"
      aria-label={`Illustrazione per: ${label}`}
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
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={0.75} />
      ))}
      {icon && (
        <g transform="translate(198,72)">
          <IconShape icon={icon} fill={iconFill} glow={iconGlow} />
        </g>
      )}
    </svg>
  );
}
