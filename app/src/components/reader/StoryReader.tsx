"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, Moon, X } from "lucide-react";
import { readingMinutes, type Story, type StoryPage } from "@/lib/story-types";
import { StoryScene } from "./StoryScene";

/** Quanto il libro si apre e si sfoglia. */
const APERTURA_MS = 750;
const SFOGLIO_MS = 620;
/** Oltre questa rotazione, al rilascio la pagina gira invece di tornare indietro. */
const SOGLIA_GRADI = 55;
/** Rotazione finale: non 180° pieni, così la pagina non "sbatte" sul dorso. */
const GRADI_FINE = 168;

type Turn = {
  dir: 1 | -1;
  /** Pagina verso cui si sta girando. */
  to: number;
  angle: number;
  dragging: boolean;
  settling: "none" | "commit" | "cancel";
};

const QUERY_MOTO = "(prefers-reduced-motion: reduce)";

/** Chi ha chiesto meno animazioni non deve vedere la pagina ruotare: cambia
 *  pagina di scatto. `useSyncExternalStore` è il modo previsto da React per
 *  leggere uno stato esterno come `matchMedia`, e lato server dà `false`. */
function useMotoRidotto() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(QUERY_MOTO);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(QUERY_MOTO).matches,
    () => false
  );
}

/** Una pagina del libro: a tutto schermo sul telefono, doppia pagina da tablet
 *  in su (illustrazione a sinistra, testo sulla carta a destra). */
function Pagina({
  story,
  page,
  dim,
}: {
  story: Story;
  page: StoryPage;
  dim: number;
}) {
  return (
    <div className="absolute inset-0 bg-[#0C0A1E] lg:grid lg:place-items-center">
      <div className="relative h-full w-full overflow-hidden lg:h-[min(40rem,82vh)] lg:w-[min(64rem,92vw)] lg:rounded-xl lg:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]">
        <div className="absolute inset-0 lg:right-1/2">
          <StoryScene
            scene={story.scene}
            silhouette={page.silhouette}
            uid={`${story.slug}-p${page.order}`}
            label={`${story.title}, pagina ${page.order}`}
            dim={dim}
            grain
            className="h-full w-full"
          />
        </div>

        {/* La carta della pagina destra, solo su schermo largo */}
        <div className="absolute inset-y-0 left-1/2 right-0 hidden bg-[#1A1533] lg:block" />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 hidden w-10 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/45 to-transparent lg:block"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#08061290] from-10% via-[#08061266] via-50% to-transparent px-6 pb-24 pt-20 lg:inset-y-0 lg:left-1/2 lg:right-0 lg:flex lg:items-center lg:bg-none lg:px-12 lg:py-12">
          <p className="mx-auto max-h-[46vh] max-w-[34rem] overflow-y-auto font-heading text-[clamp(1.25rem,4.6vw,1.5rem)] leading-[1.55] text-[#F6E9CE] [text-shadow:0_2px_18px_rgba(0,0,0,0.5)] lg:max-h-none lg:text-[1.4rem] lg:[text-shadow:none]">
            {page.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export function StoryReader({ story }: { story: Story }) {
  const { pages, scene, title, description, slug } = story;
  const ultima = pages.length - 1;

  const [phase, setPhase] = useState<"cover" | "reading">("cover");
  const [opening, setOpening] = useState(false);
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [ended, setEnded] = useState(false);
  const [lightsOut, setLightsOut] = useState(false);

  const motoRidotto = useMotoRidotto();
  const drag = useRef<{ x: number; active: boolean } | null>(null);

  /** 0 in prima pagina, ~1 in ultima: la lampada che si abbassa. */
  const buio = (i: number) => (ultima === 0 ? 0 : i / ultima);

  const chiudi = useCallback(
    (passaDallaCronologia = true) => {
      if (passaDallaCronologia && window.history.state?.fiabaReader) {
        window.history.back(); // il popstate qui sotto richiama chiudi(false)
        return;
      }
      setPhase("cover");
      setOpening(false);
      setTurn(null);
      setEnded(false);
      setLightsOut(false);
      setIndex(0);
    },
    []
  );

  const gira = useCallback(
    (dir: 1 | -1) => {
      if (turn || ended) return;
      const meta = index + dir;
      if (meta > ultima) {
        setEnded(true);
        return;
      }
      if (meta < 0) return;
      if (motoRidotto) {
        setIndex(meta);
        return;
      }
      setTurn({ dir, to: meta, angle: 0, dragging: false, settling: "none" });
    },
    [turn, ended, index, ultima, motoRidotto]
  );

  // Il flip parte da 0° e solo al frame successivo va alla rotazione finale:
  // senza questo passaggio la transizione CSS non avrebbe un punto di partenza.
  useEffect(() => {
    if (!turn || turn.dragging || turn.settling !== "none") return;
    const raf = requestAnimationFrame(() =>
      setTurn((t) => (t && t.settling === "none" && !t.dragging ? { ...t, settling: "commit", angle: -t.dir * GRADI_FINE } : t))
    );
    return () => cancelAnimationFrame(raf);
  }, [turn]);

  // Tasto "indietro" del telefono: chiude il libro invece di uscire dal sito.
  useEffect(() => {
    if (phase !== "reading") return;
    window.history.pushState({ fiabaReader: true }, "");
    const onPop = () => chiudi(false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [phase, chiudi]);

  // Tastiera e blocco dello scorrimento mentre si legge.
  useEffect(() => {
    if (phase !== "reading") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") gira(1);
      else if (e.key === "ArrowLeft") gira(-1);
      else if (e.key === "Escape") {
        if (lightsOut) setLightsOut(false);
        else chiudi();
      }
    };
    window.addEventListener("keydown", onKey);
    const precedente = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = precedente;
    };
  }, [phase, gira, chiudi, lightsOut]);

  function onPointerDown(e: React.PointerEvent) {
    if (turn || ended || motoRidotto) return;
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    drag.current = { x: e.clientX, active: true };
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d?.active) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) < 6) return;

    const dir: 1 | -1 = dx < 0 ? 1 : -1;
    const meta = index + dir;
    if (meta < 0 || meta > ultima) return; // niente da girare in quella direzione

    const largo = (e.currentTarget as HTMLElement).clientWidth || 1;
    const frazione = Math.min(1, Math.abs(dx) / (largo * 0.7));
    const angle = -dir * frazione * GRADI_FINE;
    setTurn({ dir, to: meta, angle, dragging: true, settling: "none" });
  }

  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (!d?.active) return;
    setTurn((t) => {
      if (!t?.dragging) return t;
      const superato = Math.abs(t.angle) > SOGLIA_GRADI;
      return superato
        ? { ...t, dragging: false, settling: "commit", angle: -t.dir * GRADI_FINE }
        : { ...t, dragging: false, settling: "cancel", angle: 0 };
    });
  }

  function onTurnEnd() {
    setTurn((t) => {
      if (!t || t.settling === "none") return t;
      if (t.settling === "commit") setIndex(t.to);
      return null;
    });
  }

  // ─── Copertina: il libro chiuso, nel flusso della pagina ───
  if (phase === "cover") {
    const minuti = readingMinutes(story);
    return (
      <div className="mx-auto max-w-md" style={{ perspective: "1600px" }}>
        <button
          type="button"
          onClick={() => setOpening(true)}
          onTransitionEnd={(e) => {
            if (opening && e.propertyName === "transform") setPhase("reading");
          }}
          aria-label={`Apri il libro: ${title}`}
          className="group relative block aspect-4/3 w-full overflow-hidden rounded-2xl border border-white/10 text-left shadow-[0_24px_60px_-24px_rgba(23,20,51,0.6)]"
          style={{
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            transform: opening ? "rotateY(-112deg)" : "rotateY(0deg)",
            opacity: opening ? 0 : 1,
            transition: motoRidotto
              ? "opacity 200ms linear"
              : `transform ${APERTURA_MS}ms cubic-bezier(.45,0,.2,1), opacity ${APERTURA_MS}ms ease-in`,
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 z-10 w-3 bg-black/25"
            style={{ boxShadow: "inset -3px 0 6px rgba(0,0,0,0.35)" }}
          />
          <StoryScene scene={scene} uid={`${slug}-cover`} label={title} shape="wide" className="h-full w-full" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <span className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6">
            <span className="font-heading text-2xl font-semibold leading-tight text-white text-balance">
              {title}
            </span>
            <span className="line-clamp-2 text-sm text-white/75">{description}</span>
            <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition group-hover:bg-white/25">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Apri il libro · {minuti} min
            </span>
          </span>
        </button>
      </div>
    );
  }

  // ─── Lettura immersiva ───
  // Passato il mezzo giro la pagina di destinazione è già in vista: contatore
  // e costellazione seguono quella, non quella che sta uscendo.
  const mostrata = turn ? turn.to : index;

  const pagineDaMostrare = turn
    ? { sotto: pages[turn.to], sopra: pages[index], dimSotto: buio(turn.to) }
    : { sotto: pages[index], sopra: null, dimSotto: buio(index) };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-[#0C0A1E] [touch-action:pan-y]"
      style={{ perspective: "1600px" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="dialog"
      aria-modal="true"
      aria-label={`${title}, lettura`}
    >
      <Pagina story={story} page={pagineDaMostrare.sotto} dim={pagineDaMostrare.dimSotto} />

      {turn && pagineDaMostrare.sopra && (
        <div
          className="absolute inset-0"
          onTransitionEnd={onTurnEnd}
          style={{
            transformOrigin: turn.dir === 1 ? "left center" : "right center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            transform: `rotateY(${turn.angle}deg)`,
            transition: turn.dragging ? "none" : `transform ${SFOGLIO_MS}ms cubic-bezier(.42,.02,.22,1)`,
            boxShadow: turn.angle !== 0 ? "0 0 90px rgba(0,0,0,.55)" : undefined,
          }}
        >
          <Pagina story={story} page={pagineDaMostrare.sopra} dim={buio(index)} />
        </div>
      )}

      {/* La luce che si abbassa col procedere della fiaba */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#05040F] transition-opacity duration-700"
        style={{ opacity: buio(turn ? turn.to : index) * 0.28 }}
      />

      {/* Zone da toccare per sfogliare */}
      <button
        type="button"
        onClick={() => gira(-1)}
        disabled={index === 0 || !!turn}
        aria-label="Pagina precedente"
        className="absolute inset-y-0 left-0 z-10 w-[22%] cursor-w-resize disabled:cursor-default"
      />
      <button
        type="button"
        onClick={() => gira(1)}
        disabled={!!turn}
        aria-label="Pagina successiva"
        className="absolute inset-y-0 right-0 z-10 w-[22%] cursor-e-resize disabled:cursor-default"
      />

      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between gap-3 bg-gradient-to-b from-black/50 to-transparent p-4">
          <button
            type="button"
            data-no-drag
            onClick={() => chiudi()}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-[#F6E9CE] backdrop-blur transition hover:bg-white/20"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Chiudi il libro
          </button>
          <p className="rounded-full bg-black/30 px-3 py-1.5 text-xs font-medium text-white/60 backdrop-blur">
            {mostrata + 1} di {pages.length}
          </p>
        </div>

        <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-4 pb-5">
          <button
            type="button"
            data-no-drag
            onClick={() => gira(-1)}
            disabled={index === 0 || !!turn}
            aria-label="Pagina precedente"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/10 p-2.5 text-[#F6E9CE] backdrop-blur transition hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex flex-1 items-center justify-center gap-1.5" aria-hidden="true">
            {pages.map((p, i) => (
              <span
                key={p.order}
                className={`star-marker h-2.5 w-2.5 transition ${
                  i === mostrata
                    ? "scale-125 bg-[#e8a23c]"
                    : i < mostrata
                      ? "bg-[#e8a23c]/50"
                      : "bg-[#F6E9CE]/25"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            data-no-drag
            onClick={() => gira(1)}
            disabled={!!turn}
            aria-label={index === ultima ? "Finisci la fiaba" : "Pagina successiva"}
            className="inline-flex items-center rounded-full border border-white/20 bg-white/10 p-2.5 text-[#F6E9CE] backdrop-blur transition hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Fine della fiaba: la luce si spegne */}
      {ended && (
        <div
          className="absolute inset-0 z-30 grid place-items-center px-6 py-10 text-center"
          style={{
            backgroundColor: "#0A0818",
            backgroundImage:
              "radial-gradient(60% 50% at 50% 42%, rgba(232,162,60,0.16), transparent 70%)",
          }}
        >
          <div className="grid max-w-sm justify-items-center gap-5">
            <Moon className="h-12 w-12 text-[#F4E6BD]" aria-hidden="true" />
            <h2 className="font-heading text-[clamp(2rem,8vw,2.75rem)] font-normal italic text-[#F6E9CE]">
              Buonanotte
            </h2>
            <p className="text-[#F6E9CE]/70">
              È finita «{title}». {readingMinutes(story)} minuti insieme, e la luce è già bassa.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                data-no-drag
                onClick={() => setLightsOut(true)}
                className="rounded-full bg-[#e8a23c] px-5 py-2.5 text-sm font-semibold text-[#2A1606] transition hover:bg-[#f4b968]"
              >
                Spegni la luce
              </button>
              <button
                type="button"
                data-no-drag
                onClick={() => {
                  setEnded(false);
                  setIndex(0);
                }}
                className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-[#F6E9CE] transition hover:border-white/60"
              >
                Rileggila
              </button>
              <Link
                href="/"
                data-no-drag
                className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-[#F6E9CE] transition hover:border-white/60"
              >
                Un&apos;altra fiaba
              </Link>
            </div>
          </div>
        </div>
      )}

      {lightsOut && (
        <button
          type="button"
          data-no-drag
          onClick={() => chiudi()}
          aria-label="Riaccendi la luce"
          className="absolute inset-0 z-40 grid place-items-center bg-[#040309] text-sm text-[#F6E9CE]/35"
        >
          <span className="grid justify-items-center gap-3">
            <Moon className="h-6 w-6" aria-hidden="true" />
            tocca per riaccendere
          </span>
        </button>
      )}
    </div>
  );
}
