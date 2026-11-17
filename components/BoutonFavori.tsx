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
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition hover:scale-110 active:scale-90 ${
        actif ? "border-red-100 bg-red-50" : "border-trait bg-white/95"
      } ${className}`}
    >
      <svg
        key={String(actif)}
        aria-hidden
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${actif ? "anim-pop fill-red-500 stroke-red-500" : "fill-none stroke-doux"}`}
        strokeWidth={2}
      >
        <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 7 4.5c2.1 0 3.5 1.2 5 3 1.5-1.8 2.9-3 5-3 3.6 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />
      </svg>
    </button>
  );
}
