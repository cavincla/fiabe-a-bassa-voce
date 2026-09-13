"use client";

import { useEffect, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import type { Story, StoryPage } from "@/lib/story-types";
import { PageArt } from "./PageArt";

type FlipState = {
  dir: "next" | "prev";
  from: number;
  to: number;
  started: boolean;
};

function PageSurface({ title, page }: { title: string; page: StoryPage }) {
  return (
    <div className="absolute inset-0 flex h-full flex-col bg-card">
      <div className="h-[58%] w-full shrink-0">
        <PageArt seed={page.artSeed} label={`${title}, pagina ${page.order}`} icon={page.icon} />
      </div>
      <p className="flex-1 overflow-y-auto px-6 py-5 font-heading text-lg leading-relaxed text-card-foreground">
        {page.text}
      </p>
    </div>
  );
}

export function StoryReader({ story }: { story: Story }) {
  const { title, pages, coverSeed, coverIcon, description } = story;
  const [phase, setPhase] = useState<"cover" | "reading">("cover");
  const [opening, setOpening] = useState(false);
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState<FlipState | null>(null);

  const isFirst = index === 0;
  const isLast = index === pages.length - 1;
  const animating = flip !== null;

  // Il flip parte a rotazione 0 e solo dopo il primo frame passa alla
  // rotazione finale, altrimenti la transizione CSS non avrebbe un punto
  // di partenza da cui animare.
  useEffect(() => {
    if (flip && !flip.started) {
      const raf = requestAnimationFrame(() => setFlip((f) => (f ? { ...f, started: true } : f)));
      return () => cancelAnimationFrame(raf);
    }
  }, [flip]);

  function goTo(target: number) {
    if (animating) return;
    const clamped = Math.min(Math.max(target, 0), pages.length - 1);
    if (clamped === index) return;
    setFlip({ dir: clamped > index ? "next" : "prev", from: index, to: clamped, started: false });
  }

  function handleFlipEnd() {
    if (!flip) return;
    setIndex(flip.to);
    setFlip(null);
  }

  if (phase === "cover") {
    return (
      <div className="mx-auto max-w-md" style={{ perspective: "1600px" }}>
        <button
          type="button"
          onClick={() => setOpening(true)}
          onTransitionEnd={() => opening && setPhase("reading")}
          aria-label={`Apri il libro: ${title}`}
          className="group relative block aspect-4/3 w-full overflow-hidden rounded-2xl border border-border text-left shadow-[0_20px_46px_-20px_rgba(23,20,51,0.35)]"
          style={{
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            transform: opening ? "rotateY(-112deg)" : "rotateY(0deg)",
            opacity: opening ? 0 : 1,
            transition: "transform 750ms cubic-bezier(.45,0,.2,1), opacity 750ms ease-in",
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 z-10 w-3 bg-black/25"
            style={{ boxShadow: "inset -3px 0 6px rgba(0,0,0,0.35)" }}
          />
          <PageArt seed={coverSeed} label={title} icon={coverIcon} />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6">
            <span className="font-heading text-2xl font-semibold leading-tight text-white text-balance">
              {title}
            </span>
            {description && (
              <span className="line-clamp-2 text-sm text-white/75">{description}</span>
            )}
            <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur transition group-hover:bg-white/25">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Apri il libro
            </span>
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="mx-auto flex max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_20px_46px_-20px_rgba(23,20,51,0.35)]"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(index + 1);
        if (e.key === "ArrowLeft") goTo(index - 1);
      }}
      tabIndex={0}
    >
      <div
        className="relative h-[420px] w-full sm:h-[440px]"
        style={{ perspective: "1600px" }}
      >
        <PageSurface title={title} page={pages[flip ? flip.to : index]} />

        {flip && (
          <div
            className="absolute inset-0"
            onTransitionEnd={handleFlipEnd}
            style={{
              transformOrigin: flip.dir === "next" ? "left center" : "right center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              boxShadow: "inset 0 0 70px rgba(0,0,0,0.28)",
              transform: flip.started
                ? `rotateY(${flip.dir === "next" ? "-180deg" : "180deg"})`
                : "rotateY(0deg)",
              transition: "transform 550ms cubic-bezier(.45,0,.2,1)",
            }}
          >
            <PageSurface title={title} page={pages[flip.from]} />
          </div>
        )}

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={isFirst || animating}
          aria-label="Pagina precedente"
          className="absolute inset-y-0 left-0 z-10 w-1/4 cursor-w-resize disabled:cursor-default"
        />
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={isLast || animating}
          aria-label="Pagina successiva"
          className="absolute inset-y-0 right-0 z-10 w-1/4 cursor-e-resize disabled:cursor-default"
        />
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <button
          onClick={() => goTo(index - 1)}
          disabled={isFirst || animating}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
          aria-label="Pagina precedente"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Indietro
        </button>

        <div className="flex gap-1.5" aria-label={`Pagina ${index + 1} di ${pages.length}`}>
          {pages.map((p, i) => (
            <span
              key={p.order}
              className={`star-marker h-2.5 w-2.5 ${
                i === index ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(index + 1)}
          disabled={isLast || animating}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
          aria-label="Pagina successiva"
        >
          Avanti
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
