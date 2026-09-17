import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStories, getStoryBySlug } from "@/lib/stories";
import { readingMinutes } from "@/lib/story-types";
import { StoryReader } from "@/components/reader/StoryReader";

// Una pagina statica per ogni file in content/fiabe/it/.
export function generateStaticParams() {
  return getStories().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return {};
  return {
    title: `${story.title} — Fiabe a Bassa Voce`,
    description: story.description,
    openGraph: { title: story.title, description: story.description, type: "article" },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const minuti = readingMinutes(story);
  const etichette = [...story.moralTopics, ...story.healthTopics];

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/"
        className="text-sm text-muted-foreground transition hover:text-foreground hover:underline"
      >
        ← Tutte le fiabe
      </Link>

      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-balance">
        {story.title}
      </h1>

      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{minuti} minuti di lettura</span>
        <span aria-hidden="true">·</span>
        <span>{story.ageMin}–{story.ageMax} anni</span>
        {etichette.length > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <span>{etichette.join(", ")}</span>
          </>
        )}
      </p>

      <p className="mb-8 mt-4 max-w-prose text-muted-foreground">{story.description}</p>

      <StoryReader story={story} />

      {/* Il testo completo, leggibile anche senza aprire il libro: serve a chi
          preferisce leggere dallo schermo, a chi usa uno screen reader e ai
          motori di ricerca, che per un sito gratuito sono l'unico canale. */}
      <section className="mt-14 border-t border-border pt-8">
        <h2 className="font-heading text-xl font-semibold">Il testo della fiaba</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {story.pages.length} pagine, da leggere ad alta voce.
        </p>
        <div className="mt-6 space-y-5">
          {story.pages.map((p) => (
            <p key={p.order} className="flex gap-4 font-heading text-lg leading-relaxed">
              <span
                aria-hidden="true"
                className="mt-1.5 shrink-0 text-xs font-sans font-semibold tabular-nums text-muted-foreground"
              >
                {p.order}
              </span>
              <span>{p.text}</span>
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
