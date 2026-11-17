/** Minuscules sans accents, pour une recherche tolérante. */
export const normaliser = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
