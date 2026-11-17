import type { Metadata } from "next";
import Link from "next/link";
import PhotoResto from "@/components/PhotoResto";
import { categorieCuisine } from "@/lib/cuisines";
import { listerRestaurants, normaliser } from "@/lib/donnees";
import { LIBELLE_TYPE } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Les restos",
  description: "Tous les restaurants parisiens suivis par MiamDeal et leurs bons plans.",
};

export default async function Restaurants({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const mots = normaliser(q).split(/\s+/).filter(Boolean);
  const restaurants = (await listerRestaurants())
    .filter((r) => {
      const texte = normaliser([r.nom, r.cuisine, r.quartier].filter(Boolean).join(" "));
      return mots.every((m) => texte.includes(m));
    })
    .sort((a, b) => b.nbOffres - a.nbOffres || a.nom.localeCompare(b.nom, "fr"));

  return (
    <>
      <h1 className="titre text-[2rem] sm:text-5xl">Les restos</h1>
      <p className="mt-1 text-doux">Tous les restos suivis par l&apos;équipe MiamDeal.</p>
      <form action="/restaurants" role="search" className="mt-4 flex gap-2">
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Nom, cuisine, quartier…"
          aria-label="Rechercher un restaurant"
          className="champ !mt-0 !rounded-full"
        />
        <button className="bouton shrink-0">Chercher</button>
      </form>

      {restaurants.length === 0 && (
        <p className="mt-8 text-center text-doux">Aucun resto ne correspond à ta recherche.</p>
      )}
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {restaurants.map((r, i) => (
          <li key={r.id} className="anim-apparition" style={{ "--i": Math.min(i, 8) } as React.CSSProperties}>
            <Link
              href={`/restaurants/${r.id}`}
              className="group flex h-full items-center gap-3 rounded-3xl border border-trait bg-white p-3 transition hover:-translate-y-0.5 hover:border-miam hover:shadow-[0_10px_30px_-12px_rgba(43,26,16,0.25)]"
            >
              <PhotoResto restaurant={r} className="h-20 w-20 shrink-0 rounded-2xl !text-4xl" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-extrabold leading-tight">{r.nom}</h2>
                <p className="truncate text-sm text-doux">
                  {categorieCuisine(r.cuisine).icone} {[r.cuisine, LIBELLE_TYPE[r.type]].filter(Boolean).join(" · ")}
                </p>
                <p className="text-sm text-doux">📍 {r.quartier}</p>
                <span
                  className={`badge mt-1.5 ${r.nbOffres > 0 ? "bg-miam text-encre" : "bg-gray-100 text-doux"}`}
                >
                  {r.nbOffres} {r.nbOffres > 1 ? "bons plans" : "bon plan"}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
