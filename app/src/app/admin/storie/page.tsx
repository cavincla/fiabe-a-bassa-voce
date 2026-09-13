import Link from "next/link";
import { getStories } from "@/lib/stories";
import { Badge } from "@/components/ui/badge";

// Vista di redazione: le fiabe sono file YAML in content/fiabe/it/, quindi qui
// si leggono e si controllano, non si modificano. Si aggiunge una fiaba
// aggiungendo un file (istruzioni in content/fiabe/README.md).
export default function AdminStorieList() {
  const stories = getStories();
  const pagineTotali = stories.reduce((n, s) => n + s.pages.length, 0);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin" className="text-sm text-muted-foreground hover:underline">
        ← Pannello
      </Link>

      <div className="mb-2 mt-2 flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Fiabe</h1>
        <p className="text-sm text-muted-foreground">
          {stories.length} fiabe · {pagineTotali} pagine
        </p>
      </div>

      <p className="mb-6 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
        Le fiabe vivono come file YAML in <code>content/fiabe/it/</code>: una
        fiaba nuova è un file nuovo, e il sito la pubblica al build successivo.
        Lo schema dei campi è in <code>content/fiabe/README.md</code>. Se un file
        è incompleto il build si ferma e indica quale campo manca, quindi questo
        elenco mostra sempre e solo contenuti validi.
      </p>

      <ul className="divide-y divide-border">
        {stories.map((s) => (
          <li key={s.slug} className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-3">
            <div className="min-w-0 flex-1">
              <Link href={`/storie/${s.slug}`} className="font-medium hover:underline">
                {s.title}
              </Link>
              <p className="text-xs break-words text-muted-foreground">
                {s.slug}.yaml · {s.pages.length} pagine · {s.ageMin}–{s.ageMax} anni
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-1">
              {s.moralTopics.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
              {s.healthTopics.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
