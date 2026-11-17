import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_CLE, SUPABASE_URL } from "./config";

/** Client lié à la session (cookies) : utilisé par l'espace admin. */
export async function clientServeur() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_CLE, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (aPoser) => {
        try {
          aPoser.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Appelé depuis un composant serveur : le proxy rafraîchit déjà la session.
        }
      },
    },
  });
}

/** Renvoie l'utilisateur connecté s'il fait partie de l'équipe, sinon null. */
export async function adminConnecte() {
  const supabase = await clientServeur();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, admin: false };
  const { data } = await supabase
    .from("profils")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return { supabase, user, admin: data?.role === "admin" };
}
