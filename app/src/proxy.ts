import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

// Next.js 16 ha rinominato "middleware" in "proxy" (stesso meccanismo,
// nome diverso): questo file sostituisce il precedente middleware.ts.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Solo l'area admin richiede login; il sito pubblico resta intoccato.
  matcher: ["/admin/:path*"],
};
