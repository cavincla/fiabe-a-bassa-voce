"use client";

import { useState } from "react";
import type { StoryPage } from "@/lib/mock-stories";
import { PageArt } from "./PageArt";

export function StoryReader({
  title,
  pages,
}: {
  title: string;
  pages: StoryPage[];
}) {
  const [index, setIndex] = useState(0);
  const page = pages[index];
  const isFirst = index === 0;
  const isLast = index === pages.length - 1;

  function goTo(next: number) {
    setIndex(Math.min(Math.max(next, 0), pages.length - 1));
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
      <div className="aspect-4/3 w-full">
        <PageArt seed={page.artSeed} label={`${title}, pagina ${page.order}`} />
      </div>

      <p className="min-h-24 flex-1 px-6 py-5 font-heading text-lg leading-relaxed text-card-foreground">
        {page.text}
      </p>

      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <button
          onClick={() => goTo(index - 1)}
          disabled={isFirst}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
          aria-label="Pagina precedente"
        >
          ← Indietro
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
          disabled={isLast}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
          aria-label="Pagina successiva"
        >
          Avanti →
        </button>
      </div>
    </div>
  );
}
