import type { Scene, Silhouette } from "@/lib/story-types";

// Illustrazione a carta stratificata: cielo, bagliore della lampada, stelle,
// due colline, alberi e il personaggio, su piani separati, con grana e
// vignettatura. Tutto è derivato dalla direzione artistica della fiaba (pochi
// colori in `scena:` nel file YAML) più la posizione della pagina, che abbassa
// la luce mano a mano che la storia avanza.
//
// Niente `Math.random()`: il rumore è pseudo-casuale con seme derivato dai
// prop, altrimenti server e client genererebbero SVG diversi e React
// segnalerebbe un errore di hydration.

function seed(testo: string) {
  let h = 2166136261;
  for (let i = 0; i < testo.length; i++) {
    h ^= testo.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(s: number) {
  let x = s || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) % 10000) / 10000;
  };
}

function darken(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = 1 - amount;
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `rgb(${r},${g},${b})`;
}

/** Due impianti compositivi: una scena orizzontale ritagliata su uno schermo
 *  di telefono perderebbe cielo, orizzonte e personaggio insieme. */
const LAYOUTS = {
  tall: {
    w: 1000, h: 1500, starsTo: 820, moonX: 700, moonY: 250, moonR: 50, bigMoonR: 104,
    hillFar: 770, hillNear: 890, treeBase: 900, treeMin: 110, treeVar: 100, figureY: 886, airTo: 1120,
  },
  wide: {
    w: 1000, h: 750, starsTo: 400, moonX: 790, moonY: 132, moonR: 44, bigMoonR: 92,
    hillFar: 470, hillNear: 566, treeBase: 574, treeMin: 88, treeVar: 86, figureY: 562, airTo: 560,
  },
} as const;

function hillPath(y: number, w: number, h: number, amp: number) {
  const r = (n: number) => n.toFixed(0);
  return (
    `M0 ${r(y)}` +
    ` C${r(w * 0.16)} ${r(y - amp)} ${r(w * 0.3)} ${r(y + amp * 0.8)} ${r(w * 0.452)} ${r(y)}` +
    ` C${r(w * 0.6)} ${r(y - amp * 0.7)} ${r(w * 0.8)} ${r(y + amp * 0.4)} ${r(w)} ${r(y - amp * 0.45)}` +
    ` L${r(w)} ${r(h)} L0 ${r(h)} Z`
  );
}

/** Sagome in coordinate locali, con l'origine appoggiata alla collina. */
function Figure({ name, fill, glow }: { name: Silhouette; fill: string; glow: string }) {
  switch (name) {
    case "carota":
      return (
        <>
          <path d="M0 -46 L14 -74 M0 -46 L-16 -76 M0 -46 L0 -80" stroke={fill} strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M0 -46 C44 -34 52 24 12 76 C4 88 -6 88 -14 76 C-52 24 -44 -34 0 -46 Z" fill={fill} />
        </>
      );
    case "corvo":
      return (
        <>
          <path d="M-62 26 C-74 -8 -42 -52 8 -46 C48 -42 66 -14 60 6 C80 0 88 16 74 26 C80 42 64 50 52 42 C42 62 14 70 -8 60 C-38 82 -72 66 -62 42 Z" fill={fill} />
          <path d="M60 6 L84 -2 L62 14 Z" fill={fill} />
        </>
      );
    case "germoglio":
      return (
        <>
          <path d="M0 80 C0 26 0 -6 0 -50" stroke={fill} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M0 -6 C-38 -14 -58 -48 -50 -84 C-14 -76 6 -48 0 -6 Z" fill={fill} />
          <path d="M0 -6 C38 -14 58 -48 50 -84 C14 -76 -6 -48 0 -6 Z" fill={fill} />
        </>
      );
    case "lucciola":
      return (
        <>
          <ellipse cx="0" cy="0" rx="22" ry="17" fill={fill} />
          <path d="M-16 -10 C-40 -28 -54 -20 -62 -36" stroke={fill} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M16 -10 C40 -28 54 -20 62 -36" stroke={fill} strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="0" cy="17" r="9" fill={glow} />
        </>
      );
    case "ombrello":
      return (
        <>
          <path d="M-72 -6 A72 72 0 0 1 72 -6 Z" fill={fill} />
          <path d="M0 -6 L0 66" stroke={fill} strokeWidth="7" strokeLinecap="round" />
          <path d="M0 66 C0 84 26 84 26 62" stroke={fill} strokeWidth="7" fill="none" strokeLinecap="round" />
        </>
      );
    case "riccio":
      return (
        <>
          <path d="M-66 34 C-74 4 -46 -22 0 -22 C48 -22 70 6 60 40 C50 66 -56 66 -66 34 Z" fill={fill} />
          <path d="M-52 -18 L-60 -62 L-38 -24 Z M-26 -22 L-32 -70 L-10 -26 Z M2 -22 L-2 -72 L20 -26 Z M30 -20 L30 -66 L48 -22 Z" fill={fill} />
        </>
      );
    case "tartaruga":
      return (
        <>
          <ellipse cx="0" cy="0" rx="68" ry="44" fill={fill} />
          <circle cx="74" cy="-8" r="18" fill={fill} />
          <circle cx="-52" cy="34" r="13" fill={fill} />
          <circle cx="46" cy="38" r="13" fill={fill} />
        </>
      );
    case "gatto":
      return (
        <>
          <path d="M-40 -30 L-24 -70 L-12 -22 Z" fill={fill} />
          <path d="M40 -30 L24 -70 L12 -22 Z" fill={fill} />
          <circle cx="0" cy="-8" r="40" fill={fill} />
          <ellipse cx="0" cy="60" rx="36" ry="32" fill={fill} />
          <path d="M30 68 C74 72 78 20 52 12" stroke={fill} strokeWidth="9" fill="none" strokeLinecap="round" />
        </>
      );
    case "volpe":
      return (
        <>
          <path d="M0 -66 L38 -12 L-38 -12 Z" fill={fill} />
          <path d="M-28 -54 L-42 -90 L-16 -44 Z" fill={fill} />
          <path d="M28 -54 L42 -90 L16 -44 Z" fill={fill} />
          <ellipse cx="0" cy="44" rx="42" ry="38" fill={fill} />
          <path d="M38 58 C86 70 96 16 64 2 C82 28 70 48 38 58 Z" fill={fill} />
        </>
      );
    case "orso":
      return (
        <>
          <circle cx="-32" cy="-46" r="18" fill={fill} />
          <circle cx="32" cy="-46" r="18" fill={fill} />
          <circle cx="0" cy="-12" r="44" fill={fill} />
          <ellipse cx="0" cy="68" rx="52" ry="38" fill={fill} />
        </>
      );
    case "drago":
      return (
        <>
          <path d="M-86 60 C-68 -8 -20 -38 30 -20 C58 -10 64 -40 42 -58 C70 -52 78 -18 56 4 C36 -8 4 -8 -18 28 C-36 56 -58 70 -86 60 Z" fill={fill} />
          <path d="M6 -34 L18 -70 L26 -34 Z" fill={fill} />
          <path d="M-30 -4 L-62 -20 L-36 18 Z" fill={fill} />
        </>
      );
    case "bambina":
      return (
        <>
          <circle cx="0" cy="-52" r="19" fill={fill} />
          <path d="M-26 56 C-22 6 -10 -30 0 -30 C10 -30 22 6 26 56 Z" fill={fill} />
          <path d="M-14 -22 L-34 10 M14 -22 L34 10" stroke={fill} strokeWidth="7" strokeLinecap="round" />
        </>
      );
  }
}

export function StoryScene({
  scene,
  label,
  uid,
  shape = "tall",
  silhouette,
  dim = 0,
  grain = false,
  className,
}: {
  scene: Scene;
  label: string;
  /** Rende univoci gli id dei gradienti: deve essere stabile, non casuale. */
  uid: string;
  shape?: "tall" | "wide";
  silhouette?: Silhouette;
  /** 0 = piena luce, 1 = notte fonda. Cresce col procedere della fiaba. */
  dim?: number;
  grain?: boolean;
  className?: string;
}) {
  const L = LAYOUTS[shape];
  const rnd = rng(seed(uid + shape));
  const id = uid.replace(/[^a-zA-Z0-9_-]/g, "");

  const skyTop = dim ? darken(scene.sky[0], dim * 0.55) : scene.sky[0];
  const skyBottom = dim ? darken(scene.sky[1], dim * 0.5) : scene.sky[1];
  const hillFar = dim ? darken(scene.hills[0], dim * 0.45) : scene.hills[0];
  const hillNear = dim ? darken(scene.hills[1], dim * 0.4) : scene.hills[1];
  const figureFill = darken(scene.hills[1], 0.45 + dim * 0.2);

  const moonR = scene.bigMoon ? L.bigMoonR : L.moonR;
  const moonX = scene.bigMoon ? L.w * 0.68 : L.moonX;
  const moonY = L.moonY;

  const stars = scene.night
    ? Array.from({ length: 38 }, () => ({
        cx: rnd() * L.w,
        cy: rnd() * L.starsTo,
        r: 0.8 + rnd() * 2,
        o: 0.35 + rnd() * 0.5,
      }))
    : [];

  const flakes =
    scene.weather === "neve"
      ? Array.from({ length: 44 }, () => ({ cx: rnd() * L.w, cy: rnd() * L.airTo, r: 1.4 + rnd() * 2.4, o: 0.3 + rnd() * 0.45 }))
      : [];

  const drops =
    scene.weather === "pioggia"
      ? Array.from({ length: 50 }, () => ({ x: rnd() * (L.w + 50), y: rnd() * L.airTo, o: 0.18 + rnd() * 0.3 }))
      : [];

  const fireflies =
    scene.weather === "lucciole"
      ? Array.from({ length: 12 }, () => ({
          cx: L.w * 0.08 + rnd() * L.w * 0.84,
          cy: L.starsTo * 0.45 + rnd() * (L.hillNear - L.starsTo * 0.45) * 0.9,
          r: 4 + rnd() * 4,
          o: 0.1 + rnd() * 0.12,
        }))
      : [];

  const trees = Array.from({ length: 6 }, (_, i) => {
    const x = L.w * 0.06 + i * (L.w * 0.165) + rnd() * (L.w * 0.07);
    const h = L.treeMin + rnd() * L.treeVar;
    const w = h * 0.36;
    return `M${x.toFixed(0)} ${(L.treeBase - 14 - h).toFixed(0)} L${(x + w).toFixed(0)} ${L.treeBase} L${(x - w).toFixed(0)} ${L.treeBase} Z`;
  });

  const figure = silhouette ?? scene.silhouette;
  const figureScale = shape === "tall" ? 1.2 : 1;

  return (
    <svg
      viewBox={`0 0 ${L.w} ${L.h}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`Illustrazione: ${label}`}
    >
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="1" stopColor={skyBottom} />
        </linearGradient>
        <radialGradient id={`lamp-${id}`} cx="70%" cy="14%" r="66%">
          <stop offset="0" stopColor={scene.light} stopOpacity={(0.5 - dim * 0.3).toFixed(2)} />
          <stop offset="1" stopColor={scene.light} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`halo-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#F6E8C0" stopOpacity="0.3" />
          <stop offset="1" stopColor="#F6E8C0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`hill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={hillFar} />
          <stop offset="1" stopColor={hillNear} />
        </linearGradient>
        <radialGradient id={`vignette-${id}`} cx="50%" cy="44%" r="74%">
          <stop offset="0.45" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
        {scene.night && (
          <mask id={`crescent-${id}`}>
            <rect x="0" y="0" width={L.w} height={L.h} fill="#fff" />
            <circle cx={(moonX + moonR * 0.9).toFixed(0)} cy={(moonY - moonR * 0.62).toFixed(0)} r={(moonR * 0.9).toFixed(0)} fill="#000" />
          </mask>
        )}
        {grain && (
          <filter id={`grain-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        )}
      </defs>

      <rect width={L.w} height={L.h} fill={`url(#sky-${id})`} />
      <rect width={L.w} height={L.h} fill={`url(#lamp-${id})`} />

      {stars.map((s, i) => (
        <circle key={`s${i}`} cx={s.cx.toFixed(0)} cy={s.cy.toFixed(0)} r={s.r.toFixed(1)} fill="#F6E9CE" opacity={s.o.toFixed(2)} />
      ))}

      {scene.night && (
        <>
          <circle cx={moonX.toFixed(0)} cy={moonY} r={(moonR * 2.4).toFixed(0)} fill={`url(#halo-${id})`} />
          <circle cx={moonX.toFixed(0)} cy={moonY} r={moonR} fill="#F6E8C0" mask={`url(#crescent-${id})`} />
        </>
      )}

      {flakes.map((f, i) => (
        <circle key={`n${i}`} cx={f.cx.toFixed(0)} cy={f.cy.toFixed(0)} r={f.r.toFixed(1)} fill="#fff" opacity={f.o.toFixed(2)} />
      ))}
      {drops.map((d, i) => (
        <path key={`p${i}`} d={`M${d.x.toFixed(0)} ${d.y.toFixed(0)} l-7 20`} stroke="#EDF6FC" strokeWidth="1.7" opacity={d.o.toFixed(2)} strokeLinecap="round" />
      ))}
      {fireflies.map((f, i) => (
        <g key={`l${i}`}>
          <circle cx={f.cx.toFixed(0)} cy={f.cy.toFixed(0)} r={(f.r * 3.4).toFixed(0)} fill={scene.light} opacity={f.o.toFixed(2)} />
          <circle cx={f.cx.toFixed(0)} cy={f.cy.toFixed(0)} r={f.r.toFixed(1)} fill={scene.light} opacity="0.85" />
        </g>
      ))}

      <path d={hillPath(L.hillFar, L.w, L.h, 42)} fill={`url(#hill-${id})`} opacity="0.95" />
      {trees.map((d, i) => (
        <path key={`t${i}`} d={d} fill={hillNear} opacity="0.92" />
      ))}
      <path d={hillPath(L.hillNear, L.w, L.h, 40)} fill={hillNear} />

      <g transform={`translate(${L.w / 2},${L.figureY}) scale(${figureScale})`}>
        <Figure name={figure} fill={figureFill} glow={scene.light} />
      </g>

      {grain && (
        <rect width={L.w} height={L.h} filter={`url(#grain-${id})`} opacity="0.085" style={{ mixBlendMode: "overlay" }} />
      )}
      <rect width={L.w} height={L.h} fill={`url(#vignette-${id})`} />
    </svg>
  );
}
