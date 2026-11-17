import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_CLE, SUPABASE_URL, supabaseConfigure } from "@/lib/supabase/config";

// Rafraîchit la session de l'équipe sur les pages /admin.
export async function proxy(request: NextRequest) {
  if (!supabaseConfigure) return NextResponse.next();

  let reponse = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_CLE, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (aPoser) => {
        aPoser.forEach(({ name, value }) => request.cookies.set(name, value));
        reponse = NextResponse.next({ request });
        aPoser.forEach(({ name, value, options }) =>
          reponse.cookies.set(name, value, options),
        );
      },
    },
  });
  await supabase.auth.getUser();
  return reponse;
}

export const config = { matcher: ["/admin/:path*"] };
