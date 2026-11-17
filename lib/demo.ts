// Données d'exemple (restaurants fictifs) affichées tant que Supabase
// n'est pas configuré. Elles ne sont jamais utilisées en production.
import type { OffreComplete, Restaurant } from "./types";

const dansHeures = (h: number) => new Date(Date.now() + h * 3600_000).toISOString();
const ilYAJours = (j: number) => new Date(Date.now() - j * 86400_000).toISOString();

const resto = (
  id: string,
  nom: string,
  type: Restaurant["type"],
  cuisine: string,
  quartier: string,
  adresse: string,
): Restaurant => ({
  id,
  nom,
  type,
  cuisine,
  quartier,
  adresse,
  lien_maps: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(adresse),
  lien_carte: "https://example.com/carte",
  photo_url: null,
  archive: false,
  created_at: ilYAJours(30),
});

export const RESTOS_DEMO: Restaurant[] = [
  resto("demo-r1", "Chez Dragonnet", "independant", "Bistrot", "Oberkampf", "12 rue Exemple, 75011 Paris"),
  resto("demo-r2", "Bao Bao Club", "independant", "Taïwanais", "Belleville", "3 rue Fictive, 75020 Paris"),
  resto("demo-r3", "Burger Flamme", "chaine", "Burgers", "Châtelet", "8 boulevard Imaginaire, 75001 Paris"),
  resto("demo-r4", "Pasta Presto", "chaine", "Italien", "Quartier Latin", "21 rue Inventée, 75005 Paris"),
];

const offre = (
  id: string,
  r: number,
  categorie: OffreComplete["categorie"],
  titre: string,
  prix: string,
  description: string,
  conditions: string,
  finDansHeures?: number,
): OffreComplete => ({
  id,
  restaurant_id: RESTOS_DEMO[r].id,
  categorie,
  titre,
  description,
  prix,
  conditions,
  date_debut: categorie === "ephemere" ? ilYAJours(1) : null,
  date_fin: finDansHeures ? dansHeures(finDansHeures) : null,
  verifiee_le: ilYAJours(2).slice(0, 10),
  source: "Exemple de démonstration",
  statut: "publiee",
  publiee_par: null,
  coup_de_coeur: id === "demo-o2",
  created_at: ilYAJours(3),
  restaurant: RESTOS_DEMO[r],
  auteur: null,
});

export const OFFRES_DEMO: OffreComplete[] = [
  offre("demo-o1", 0, "permanente", "Menu midi entrée + plat + café", "14,90 €", "Le menu du jour change chaque matin selon le marché.", "Du lundi au vendredi, 12h–14h30."),
  offre("demo-o2", 1, "permanente", "Formule étudiante : 2 baos + boisson", "8,50 €", "Deux baos au choix et une boisson maison.", "Sur présentation de la carte étudiante."),
  offre("demo-o3", 2, "permanente", "Happy hour : frites offertes", "Gratuit", "Une portion de frites offerte pour tout burger acheté.", "Tous les jours de 15h à 18h."),
  offre("demo-o4", 3, "ephemere", "Pâtes à volonté", "11 €", "Toutes les pâtes de la carte à volonté, sur place.", "Sur place uniquement, hors boissons.", 60),
  offre("demo-o5", 2, "ephemere", "1 burger acheté = 1 offert", "1+1", "Pour fêter la nouvelle recette, le deuxième burger est offert.", "Le moins cher des deux est offert.", 5),
  offre("demo-o6", 1, "ephemere", "-30 % sur toute la carte", "-30 %", "Semaine anniversaire du Bao Bao Club.", "Sur place et à emporter.", 0.4),
];
