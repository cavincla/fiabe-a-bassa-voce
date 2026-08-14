import Link from "next/link";
import { db } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminStorieList() {
  let stories: Awaited<ReturnType<typeof loadStories>> = [];
  let dbError: string | null = null;

  try {
    stories = await loadStories();
  } catch {
    dbError =
      "Impossibile raggiungere il database. Configura DATABASE_URL in .env con le credenziali del progetto Supabase.";
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin" className="text-sm text-neutral-500 hover:underline">
        ← Pannello
      </Link>

      <div className="mb-6 mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Storie</h1>
        <Link href="/admin/storie/nuova" className={buttonVariants({ size: "sm" })}>
          + Nuova
        </Link>
      </div>

      {dbError && (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {dbError}
        </p>
      )}

      {!dbError && stories.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nessuna storia ancora. Crea la prima.
        </p>
      )}

      <ul className="divide-y divide-black/10 dark:divide-white/10">
        {stories.map((s) => (
          <li key={s.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{s.translations[0]?.title ?? s.slug}</p>
              <p className="text-xs text-muted-foreground">
                {s.slug} · {s.pages.length} pagine
              </p>
            </div>
            <Badge variant={s.status === "PUBLISHED" ? "default" : "secondary"}>
              {s.status === "PUBLISHED" ? "pubblicata" : "bozza"}
            </Badge>
          </li>
        ))}
      </ul>
    </main>
  );
}

function loadStories() {
  return db.story.findMany({
    orderBy: { createdAt: "desc" },
    include: { translations: true, pages: true },
  });
}
