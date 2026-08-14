import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "./has-env-vars";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // Con Fluid compute non va tenuto in una variabile globale: va creato
  // di nuovo a ogni richiesta.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Non inserire codice tra createServerClient e getClaims(): un errore
  // qui può disconnettere gli utenti in modo casuale e difficile da
  // diagnosticare (vale anche il contrario: rimuovere getClaims() rompe
  // il refresh della sessione lato server).
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // L'oggetto va restituito così com'è: se serve costruirne uno nuovo,
  // va creato con NextResponse.next({ request }) e le sue cookie vanno
  // copiate da supabaseResponse, altrimenti browser e server perdono la
  // sincronia sulla sessione.
  return supabaseResponse;
}
