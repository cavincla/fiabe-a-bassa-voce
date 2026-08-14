// Finché queste non sono impostate, l'area /admin resta accessibile senza
// login (vedi src/lib/supabase/proxy.ts) — comportamento identico a prima
// dell'introduzione di Supabase Auth, non un blocco silenzioso.
export const hasEnvVars =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
