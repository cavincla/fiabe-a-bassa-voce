import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoryBySlug, stories } from "@/lib/mock-stories";
import { StoryReader } from "@/components/reader/StoryReader";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/"
        className="text-sm text-muted-foreground transition hover:text-foreground hover:underline"
      >
        ← Tutte le fiabe
      </Link>

      <h1 className="mb-6 mt-2 font-heading text-3xl font-semibold tracking-tight text-balance">
        {story.title}
      </h1>

      <StoryReader title={story.title} pages={story.pages} />
    </main>
  );
}
