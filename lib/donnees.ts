// Lecture des données pour les pages publiques.
import { cache } from "react";
import { OFFRES_DEMO, RESTOS_DEMO } from "./demo";
import { clientPublic } from "./supabase/public";
import { supabaseConfigure } from "./supabase/config";
import type { Categorie, OffreComplete, Restaurant, TypeResto } from "./types";

const SELECTION = "*, restaurant:restaurants!inner(*), auteur:profils(nom_affiche)";

const nonExpiree = () => `date_fin.is.null,date_fin.gt.${new Date().toISOString()}`;

/**
 * Toutes les offres visibles : publiées, non expirées, resto non archivé.
 * La V1 charge tout d'un coup puis filtre ici : simple et largement suffisant
 * jusqu'à quelques centaines d'offres.
 */
export const offresActives = cache(async (): Promise<OffreComplete[]> => {
  if (!supabaseConfigure) {
    const maintenant = new Date().toISOString();
    return OFFRES_DEMO.filter((o) => !o.date_fin || o.date_fin > maintenant);
  }
  const { data, error } = await clientPublic()
    .from("offres")
    .select(SELECTION)
    .eq("statut", "publiee")
    .eq("restaurant.archive", false)
    .or(nonExpiree())
    .limit(1000);
  if (error) throw new Error(error.message);
  return data as OffreComplete[];
});

/** Minuscules sans accents, pour une recherche tolérante. */
export const normaliser = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

export type Filtres = { quartier?: string; type?: TypeResto; q?: string };

export function filtrerOffres(offres: OffreComplete[], filtres: Filtres) {
  const mots = normaliser(filtres.q ?? "")
    .split(/\s+/)
    .filter(Boolean);
  return offres.filter((o) => {
    if (filtres.quartier && o.restaurant.quartier !== filtres.quartier) return false;
    if (filtres.type && o.restaurant.type !== filtres.type) return false;
    if (mots.length === 0) return true;
    const texte = normaliser(
      [o.titre, o.description, o.restaurant.nom, o.restaurant.cuisine, o.restaurant.quartier]
        .filter(Boolean)
        .join(" "),
    );
    return mots.every((m) => texte.includes(m));
  });
}

/** Coups de cœur d'abord ; éphémères par fin la plus proche, permanentes par nouveauté. */
export function trierOffres(offres: OffreComplete[], categorie: Categorie) {
  return [...offres]
    .filter((o) => o.categorie === categorie)
    .sort(
      (a, b) =>
        Number(b.coup_de_coeur) - Number(a.coup_de_coeur) ||
        (categorie === "ephemere"
          ? (a.date_fin ?? "").localeCompare(b.date_fin ?? "")
          : b.created_at.localeCompare(a.created_at)),
    );
}

export function quartiersDe(offres: OffreComplete[]) {
  return [...new Set(offres.map((o) => o.restaurant.quartier))].sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
}

export async function offreParId(id: string): Promise<OffreComplete | null> {
  if (!supabaseConfigure) return (await offresActives()).find((o) => o.id === id) ?? null;
  const { data } = await clientPublic()
    .from("offres")
    .select(SELECTION)
    .eq("id", id)
    .eq("statut", "publiee")
    .eq("restaurant.archive", false)
    .or(nonExpiree())
    .maybeSingle();
  return (data as OffreComplete | null) ?? null;
}

export async function restaurantParId(
  id: string,
): Promise<{ restaurant: Restaurant; offres: OffreComplete[] } | null> {
  let restaurant: Restaurant | null;
  if (!supabaseConfigure) {
    restaurant = RESTOS_DEMO.find((r) => r.id === id) ?? null;
  } else {
    const { data } = await clientPublic()
      .from("restaurants")
      .select("*")
      .eq("id", id)
      .eq("archive", false)
      .maybeSingle();
    restaurant = data as Restaurant | null;
  }
  if (!restaurant) return null;
  const offres = (await offresActives()).filter((o) => o.restaurant_id === id);
  return {
    restaurant,
    offres: [...trierOffres(offres, "ephemere"), ...trierOffres(offres, "permanente")],
  };
}

/** Tous les restos visibles, avec leur nombre de bons plans en cours. */
export async function listerRestaurants(): Promise<(Restaurant & { nbOffres: number })[]> {
  let restaurants: Restaurant[];
  if (!supabaseConfigure) {
    restaurants = RESTOS_DEMO;
  } else {
    const { data, error } = await clientPublic()
      .from("restaurants")
      .select("*")
      .eq("archive", false)
      .order("nom")
      .limit(1000);
    if (error) throw new Error(error.message);
    restaurants = data as Restaurant[];
  }
  const offres = await offresActives();
  return restaurants.map((r) => ({
    ...r,
    nbOffres: offres.filter((o) => o.restaurant_id === r.id).length,
  }));
}
