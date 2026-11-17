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
        <div className="anim-apparition mt-6 rounded-3xl border border-dashed border-miam bg-miam-pale p-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" alt="" className="anim-flotte mx-auto h-20 w-20 rounded-3xl" />
          <p className="titre mt-3 text-2xl">Pas encore de favori</p>
          <p className="mt-1 text-sm text-doux">
            Touche le cœur sur une offre pour la retrouver ici.
          </p>
          <Link href="/" className="bouton mt-4">
            Voir les bons plans
          </Link>
        </div>
      )}
      <ul className="mt-4 flex flex-col gap-3 sm:gap-4">
        {children.map((carte, i) => (favoris.includes(ids[i]) ? carte : null))}
      </ul>
      {terminees > 0 && (
        <p className="mt-4 text-sm text-doux">
          {terminees === 1
            ? "1 offre de tes favoris est terminée."
            : `${terminees} offres de tes favoris sont terminées.`}
        </p>
      )}
    </>
  );
}
