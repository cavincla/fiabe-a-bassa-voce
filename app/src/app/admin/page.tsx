import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import { buttonVariants } from "@/components/ui/button";
import { hasEnvVars } from "@/lib/supabase/has-env-vars";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHome() {
  const user = hasEnvVars ? await getUser() : null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">Amministrazione</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Fiabe a Bassa Voce — pannello
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && <LogoutButton />}
        </div>
      </div>

      {hasEnvVars ? (
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Connesso come <span className="font-medium">{user?.email}</span>.
        </p>
      ) : (
        <p className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          Supabase non è ancora configurato: quest&apos;area resta aperta
          senza login finché non imposti <code>NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          e <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> in{" "}
          <code>.env</code> (vedi README).
        </p>
      )}

      <div className="mt-8 flex gap-3">
        <Link href="/admin/storie" className={buttonVariants()}>
          Elenco storie
        </Link>
        <Link
          href="/admin/storie/nuova"
          className={buttonVariants({ variant: "outline" })}
        >
          Nuova storia
        </Link>
      </div>
    </main>
  );
}

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
