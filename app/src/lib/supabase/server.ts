import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Va istanziato di nuovo a ogni richiesta (Server Component o route
 * handler), mai tenuto in una variabile globale.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll chiamato da un Server Component: ignorabile perché
            // la sessione viene comunque rinnovata dal proxy.
          }
        },
      },
    }
  );
}
