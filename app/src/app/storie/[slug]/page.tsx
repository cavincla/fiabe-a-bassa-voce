import Link from "next/link";
import { notFound } from "next/navigation";
import { getStories, getStoryBySlug } from "@/lib/stories";
import { StoryReader } from "@/components/reader/StoryReader";

// Una pagina statica per ogni file in content/fiabe/it/.
export function generateStaticParams() {
  return getStories().map((s) => ({ slug: s.slug }));
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

      <StoryReader story={story} />
    </main>
  );
}
