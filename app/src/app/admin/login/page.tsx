import { LoginForm } from "@/components/login-form";
import { hasEnvVars } from "@/lib/supabase/has-env-vars";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {hasEnvVars ? (
          <LoginForm />
        ) : (
          <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            Supabase non è ancora configurato (mancano{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
            <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> in{" "}
            <code>.env</code>), quindi il login non è ancora attivo — l&apos;area
            admin resta aperta senza restrizioni.
          </p>
        )}
      </div>
    </div>
  );
}
