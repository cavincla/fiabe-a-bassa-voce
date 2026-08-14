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
      className="mx-auto flex max-w-md flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xs dark:border-white/10 dark:bg-neutral-900"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(index + 1);
        if (e.key === "ArrowLeft") goTo(index - 1);
      }}
      tabIndex={0}
    >
      <div className="aspect-4/3 w-full">
        <PageArt seed={page.artSeed} label={`${title}, pagina ${page.order}`} />
      </div>

      <p className="min-h-24 flex-1 px-6 py-5 text-lg leading-relaxed">
        {page.text}
      </p>

      <div className="flex items-center justify-between border-t border-black/10 px-4 py-3 dark:border-white/10">
        <button
          onClick={() => goTo(index - 1)}
          disabled={isFirst}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-neutral-600 disabled:opacity-30 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10"
          aria-label="Pagina precedente"
        >
          ← Indietro
        </button>

        <div className="flex gap-1.5" aria-label={`Pagina ${index + 1} di ${pages.length}`}>
          {pages.map((p, i) => (
            <span
              key={p.order}
              className={`h-1.5 w-1.5 rounded-full ${
                i === index ? "bg-neutral-800 dark:bg-neutral-200" : "bg-neutral-300 dark:bg-neutral-700"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(index + 1)}
          disabled={isLast}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-neutral-600 disabled:opacity-30 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10"
          aria-label="Pagina successiva"
        >
          Avanti →
        </button>
      </div>
    </div>
  );
}
