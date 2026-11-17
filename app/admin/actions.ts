"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { aujourdhuiParis, parisVersISO } from "@/lib/dates";
import { adminConnecte, clientServeur } from "@/lib/supabase/serveur";
import type { Statut } from "@/lib/types";

const texte = (f: FormData, cle: string) => {
  const v = String(f.get(cle) ?? "").trim();
  return v === "" ? null : v;
};

const erreur = (chemin: string, message: string): never =>
  redirect(`${chemin}?erreur=${encodeURIComponent(message)}`);

async function exigerAdmin() {
  const session = await adminConnecte();
  if (!session.user || !session.admin) redirect("/admin/connexion");
  return session;
}

export async function seConnecter(f: FormData) {
  const supabase = await clientServeur();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(f.get("email") ?? ""),
    password: String(f.get("mot_de_passe") ?? ""),
  });
  if (error) erreur("/admin/connexion", "E-mail ou mot de passe incorrect.");
  redirect("/admin");
}

export async function seDeconnecter() {
  const supabase = await clientServeur();
  await supabase.auth.signOut();
  redirect("/admin/connexion");
}

export async function enregistrerRestaurant(f: FormData) {
  const { supabase } = await exigerAdmin();
  const id = texte(f, "id");
  const retour = id ? `/admin/restaurants/${id}` : "/admin/restaurants/nouveau";

  const fiche: Record<string, unknown> = {
    nom: texte(f, "nom"),
    type: texte(f, "type"),
    cuisine: texte(f, "cuisine"),
    quartier: texte(f, "quartier"),
    adresse: texte(f, "adresse"),
    lien_maps: texte(f, "lien_maps"),
    lien_carte: texte(f, "lien_carte"),
    photo_url: texte(f, "photo_url"),
  };
  if (!fiche.nom || !fiche.quartier) erreur(retour, "Le nom et le quartier sont obligatoires.");

  // Photo envoyée depuis l'ordinateur : elle remplace l'URL éventuelle
  const photo = f.get("photo");
  if (photo instanceof File && photo.size > 0) {
    if (!photo.type.startsWith("image/")) erreur(retour, "La photo doit être une image.");
    const extension = photo.name.split(".").pop()?.toLowerCase() || "jpg";
    const chemin = `restaurants/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from("photos")
      .upload(chemin, photo, { contentType: photo.type });
    if (error) erreur(retour, `Envoi de la photo impossible : ${error.message}`);
    fiche.photo_url = supabase.storage.from("photos").getPublicUrl(chemin).data.publicUrl;
  }

  const { error } = id
    ? await supabase.from("restaurants").update(fiche).eq("id", id)
    : await supabase.from("restaurants").insert(fiche);
  if (error) erreur(retour, error.message);

  revalidatePath("/", "layout");
  redirect("/admin/restaurants");
}

export async function archiverRestaurant(id: string, archive: boolean) {
  const { supabase } = await exigerAdmin();
  const { error } = await supabase.from("restaurants").update({ archive }).eq("id", id);
  if (error) erreur("/admin/restaurants", error.message);
  revalidatePath("/", "layout");
}

/** Suppression définitive : uniquement pour un resto déjà archivé (ses offres partent avec). */
export async function supprimerRestaurant(id: string) {
  const { supabase } = await exigerAdmin();
  const { error } = await supabase.from("restaurants").delete().eq("id", id).eq("archive", true);
  if (error) erreur("/admin/restaurants", error.message);
  revalidatePath("/", "layout");
}

export async function enregistrerOffre(f: FormData) {
  const { supabase, user } = await exigerAdmin();
  const id = texte(f, "id");
  const retour = id ? `/admin/offres/${id}` : "/admin/offres/nouvelle";

  const categorie = texte(f, "categorie");
  const ephemere = categorie === "ephemere";
  const fiche: Record<string, unknown> = {
    restaurant_id: texte(f, "restaurant_id"),
    categorie,
    titre: texte(f, "titre"),
    description: texte(f, "description"),
    prix: texte(f, "prix"),
    conditions: texte(f, "conditions"),
    // une offre permanente n'a jamais de dates
    date_debut: ephemere ? parisVersISO(texte(f, "date_debut") ?? "") : null,
    date_fin: ephemere ? parisVersISO(texte(f, "date_fin") ?? "") : null,
    verifiee_le: texte(f, "verifiee_le"),
    source: texte(f, "source"),
    statut: texte(f, "statut") ?? "brouillon",
    coup_de_coeur: f.get("coup_de_coeur") === "on",
  };
  if (!fiche.restaurant_id || !fiche.titre)
    erreur(retour, "Le restaurant et le titre sont obligatoires.");
  if (ephemere && !fiche.date_fin)
    erreur(retour, "Une offre éphémère doit avoir une date de fin.");
  if (
    fiche.date_debut &&
    fiche.date_fin &&
    (fiche.date_debut as string) >= (fiche.date_fin as string)
  )
    erreur(retour, "La date de fin doit être après la date de début.");

  // L'auteur est fixé à la création et ne change plus ensuite
  const { error } = id
    ? await supabase.from("offres").update(fiche).eq("id", id)
    : await supabase.from("offres").insert({ ...fiche, publiee_par: user!.id });
  if (error) erreur(retour, error.message);

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function changerStatutOffre(id: string, statut: Statut) {
  const { supabase } = await exigerAdmin();
  const { error } = await supabase.from("offres").update({ statut }).eq("id", id);
  if (error) erreur("/admin", error.message);
  revalidatePath("/", "layout");
}

/** Un clic après avoir revérifié l'offre auprès du resto : met la date du jour. */
export async function marquerVerifiee(id: string) {
  const { supabase } = await exigerAdmin();
  const { error } = await supabase
    .from("offres")
    .update({ verifiee_le: aujourdhuiParis() })
    .eq("id", id);
  if (error) erreur("/admin", error.message);
  revalidatePath("/", "layout");
}

/** Copie une offre en brouillon (pratique pour relancer une offre éphémère). */
export async function dupliquerOffre(id: string) {
  const { supabase, user } = await exigerAdmin();
  const { data: source } = await supabase.from("offres").select("*").eq("id", id).maybeSingle();
  if (!source) erreur("/admin", "Offre introuvable.");
  const { id: _id, created_at: _creation, ...copie } = source;
  void _id;
  void _creation;
  const { data, error } = await supabase
    .from("offres")
    .insert({
      ...copie,
      titre: `${source.titre} (copie)`,
      statut: "brouillon",
      coup_de_coeur: false,
      publiee_par: user!.id,
    })
    .select("id")
    .single();
  if (error) erreur("/admin", error.message);
  redirect(`/admin/offres/${data!.id}`);
}

/** Suppression définitive : uniquement pour une offre déjà archivée. */
export async function supprimerOffre(id: string) {
  const { supabase } = await exigerAdmin();
  const { error } = await supabase.from("offres").delete().eq("id", id).eq("statut", "archivee");
  if (error) erreur("/admin", error.message);
  revalidatePath("/", "layout");
}

export async function traiterSignalement(id: string, traite: boolean) {
  const { supabase } = await exigerAdmin();
  const { error } = await supabase.from("signalements").update({ traite }).eq("id", id);
  if (error) erreur("/admin/signalements", error.message);
  revalidatePath("/admin", "layout");
}
