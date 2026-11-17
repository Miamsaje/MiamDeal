"use client";

import { useFavoris } from "@/lib/favoris";

export default function BoutonFavori({ id, className = "" }: { id: string; className?: string }) {
  const { favoris, basculer } = useFavoris();
  const actif = favoris.includes(id);
  return (
    <button
      type="button"
      onClick={() => basculer(id)}
      aria-pressed={actif}
      aria-label={actif ? "Retirer des favoris" : "Ajouter aux favoris"}
      title={actif ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/95 text-lg shadow-sm transition active:scale-90 ${className}`}
    >
      <span aria-hidden className={actif ? "" : "opacity-40 grayscale"}>
        ❤️
      </span>
    </button>
  );
}
