// Catégories de cuisine : icône + mots-clés reconnus dans le champ « cuisine » du resto.
import { normaliser } from "./texte";

export type CategorieCuisine = { cle: string; libelle: string; icone: string; mots: string[] };

export const CUISINES: CategorieCuisine[] = [
  { cle: "burgers", libelle: "Burgers", icone: "🍔", mots: ["burger", "smash"] },
  { cle: "pizza", libelle: "Pizza & italien", icone: "🍕", mots: ["pizza", "italien", "pasta", "pates", "trattoria"] },
  { cle: "japonais", libelle: "Japonais", icone: "🍣", mots: ["japon", "sushi", "ramen", "udon", "maki"] },
  { cle: "asiatique", libelle: "Asiatique", icone: "🥟", mots: ["chinois", "taiwan", "bao", "dim sum", "coreen", "thai", "asiat", "wok"] },
  { cle: "vietnamien", libelle: "Vietnamien", icone: "🍜", mots: ["vietnam", "pho", "bo bun", "banh"] },
  { cle: "indien", libelle: "Indien", icone: "🍛", mots: ["indien", "inde", "curry", "nepal", "pakistan"] },
  { cle: "kebab", libelle: "Kebab & libanais", icone: "🥙", mots: ["kebab", "libanais", "falafel", "grec", "turc", "shawarma", "tacos fr"] },
  { cle: "mexicain", libelle: "Mexicain", icone: "🌮", mots: ["mexic", "tacos", "burrito", "tex"] },
  { cle: "poulet", libelle: "Poulet", icone: "🍗", mots: ["poulet", "chicken", "fried"] },
  { cle: "africain", libelle: "Africain", icone: "🍲", mots: ["afric", "senegal", "maroc", "couscous", "ethiop", "antill"] },
  { cle: "healthy", libelle: "Healthy & veggie", icone: "🥗", mots: ["healthy", "salade", "poke", "vegan", "vegetarien", "veggie", "bowl"] },
  { cle: "francais", libelle: "Bistrot & français", icone: "🍷", mots: ["bistrot", "brasserie", "francais", "creperie", "crepe", "galette", "bouchon"] },
  { cle: "boulangerie", libelle: "Boulangerie & brunch", icone: "🥐", mots: ["boulang", "brunch", "sandwich", "patiss", "viennois"] },
  { cle: "cafe", libelle: "Café & bar", icone: "☕", mots: ["cafe", "bar", "coffee", "the", "bubble"] },
  { cle: "dessert", libelle: "Desserts", icone: "🍦", mots: ["dessert", "glace", "gauf", "donut", "cookie"] },
];

export const AUTRE: CategorieCuisine = { cle: "autre", libelle: "Autres", icone: "🍽️", mots: [] };

export function categorieCuisine(cuisine: string | null | undefined): CategorieCuisine {
  if (!cuisine) return AUTRE;
  const texte = normaliser(cuisine);
  return CUISINES.find((c) => c.mots.some((m) => texte.includes(m))) ?? AUTRE;
}

export const iconeCuisine = (cuisine: string | null | undefined) => categorieCuisine(cuisine).icone;

export function categorieParCle(cle: string | undefined) {
  if (!cle) return undefined;
  return cle === AUTRE.cle ? AUTRE : CUISINES.find((c) => c.cle === cle);
}
