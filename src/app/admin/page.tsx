import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-sm font-medium text-neutral-500">Amministrazione</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        Fiabe a Bassa Voce — pannello
      </h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Da qui si pubblicano le storie. Questa area non è ancora protetta da
        login: va collegata a Supabase Auth prima di andare online (vedi
        README).
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/admin/storie"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Elenco storie
        </Link>
        <Link
          href="/admin/storie/nuova"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium dark:border-neutral-700"
        >
          Nuova storia
        </Link>
      </div>
    </main>
  );
}
