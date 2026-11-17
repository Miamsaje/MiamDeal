"use client";

import Link from "next/link";
import { useFavoris } from "@/lib/favoris";

/**
 * Affiche uniquement les cartes dont l'offre est en favori.
 * Les cartes sont rendues côté serveur ; ici on ne fait que masquer les autres.
 */
export default function ListeFavoris({
  ids,
  children,
}: {
  ids: string[];
  children: React.ReactNode[];
}) {
  const { favoris } = useFavoris();
  const visibles = ids.filter((id) => favoris.includes(id));
  const terminees = favoris.filter((id) => !ids.includes(id)).length;

  return (
    <>
      {visibles.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center">
          <p className="text-4xl">❤️</p>
          <p className="mt-2 font-titre text-xl font-bold">Pas encore de favori</p>
          <p className="mt-1 text-sm text-black/60">
            Touche le cœur sur une offre pour la retrouver ici.
          </p>
          <Link href="/" className="bouton mt-4">
            Voir les bons plans
          </Link>
        </div>
      )}
      <ul className="mt-4 flex flex-col gap-3">
        {children.map((carte, i) => (favoris.includes(ids[i]) ? carte : null))}
      </ul>
      {terminees > 0 && (
        <p className="mt-4 text-sm text-black/60">
          {terminees === 1
            ? "1 offre de tes favoris est terminée."
            : `${terminees} offres de tes favoris sont terminées.`}
        </p>
      )}
    </>
  );
}
