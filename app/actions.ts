"use server";

import { redirect } from "next/navigation";
import { supabaseConfigure } from "@/lib/supabase/config";
import { clientPublic } from "@/lib/supabase/public";
import { LIBELLE_MOTIF } from "@/lib/types";

/** Un visiteur signale une offre fausse ou terminée (sans compte). */
export async function signalerOffre(f: FormData) {
  const id = String(f.get("offre_id") ?? "");
  const motif = String(f.get("motif") ?? "");
  const message = String(f.get("message") ?? "").trim().slice(0, 500);
  const retour = (etat: string): never =>
    redirect(`/offres/${encodeURIComponent(id)}?signalement=${etat}#signalement`);

  // Champ piège invisible : seuls les robots le remplissent.
  if (f.get("site")) retour("ok");
  if (!(motif in LIBELLE_MOTIF)) retour("erreur");
  if (!supabaseConfigure) retour("demo");

  const { error } = await clientPublic()
    .from("signalements")
    .insert({ offre_id: id, motif, message: message || null });
  retour(error ? "erreur" : "ok");
}
