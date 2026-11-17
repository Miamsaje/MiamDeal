export type TypeResto = "independant" | "chaine";
export type Categorie = "permanente" | "ephemere";
export type Statut = "brouillon" | "en_attente" | "publiee" | "archivee";

export type Restaurant = {
  id: string;
  nom: string;
  type: TypeResto;
  cuisine: string | null;
  quartier: string;
  adresse: string | null;
  lien_maps: string | null;
  lien_carte: string | null;
  photo_url: string | null;
  archive: boolean;
  created_at: string;
};

export type Offre = {
  id: string;
  restaurant_id: string;
  categorie: Categorie;
  titre: string;
  description: string | null;
  prix: string | null;
  conditions: string | null;
  date_debut: string | null;
  date_fin: string | null;
  verifiee_le: string | null;
  source: string | null;
  statut: Statut;
  publiee_par: string | null;
  coup_de_coeur: boolean;
  created_at: string;
};

export type OffreComplete = Offre & {
  restaurant: Restaurant;
  auteur: { nom_affiche: string } | null;
};

export const LIBELLE_TYPE: Record<TypeResto, string> = {
  independant: "Indépendant",
  chaine: "Chaîne / fast-food",
};

export const LIBELLE_STATUT: Record<Statut, string> = {
  brouillon: "Brouillon",
  en_attente: "En attente",
  publiee: "Publiée",
  archivee: "Archivée",
};

export const AUTEUR_PAR_DEFAUT = "Équipe MiamDeal";

export type Motif = "terminee" | "prix" | "erreur" | "autre";

export const LIBELLE_MOTIF: Record<Motif, string> = {
  terminee: "L'offre n'existe plus",
  prix: "Le prix a changé",
  erreur: "Une info est fausse",
  autre: "Autre",
};

export type Signalement = {
  id: string;
  offre_id: string;
  motif: Motif;
  message: string | null;
  traite: boolean;
  created_at: string;
};

/** Au-delà de ce nombre de jours, l'admin propose de revérifier l'offre. */
export const JOURS_AVANT_REVERIFICATION = 30;
