import type { Metadata } from "next";
import Link from "next/link";
import PhotoResto from "@/components/PhotoResto";
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
  const restaurants = (await listerRestaurants()).filter((r) => {
    const texte = normaliser([r.nom, r.cuisine, r.quartier].filter(Boolean).join(" "));
    return mots.every((m) => texte.includes(m));
  });

  return (
    <>
      <h1 className="font-titre text-3xl font-extrabold">Les restos 🍴</h1>
      <form action="/restaurants" role="search" className="mt-3 flex gap-2">
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
        <p className="mt-6 text-center text-black/60">Aucun resto ne correspond à ta recherche.</p>
      )}
      <ul className="mt-4 flex flex-col gap-3">
        {restaurants.map((r) => (
          <li key={r.id}>
            <Link
              href={`/restaurants/${r.id}`}
              className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white p-3 shadow-sm transition hover:border-miam-fonce hover:shadow-md"
            >
              <PhotoResto restaurant={r} className="h-16 w-16 shrink-0 rounded-xl !text-2xl" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-titre text-lg font-bold leading-tight">{r.nom}</h2>
                <p className="truncate text-sm text-black/60">
                  {[LIBELLE_TYPE[r.type], r.cuisine].filter(Boolean).join(" · ")}
                </p>
                <p className="text-sm">📍 {r.quartier}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                  r.nbOffres > 0 ? "bg-miam" : "bg-gray-100 text-black/50"
                }`}
              >
                {r.nbOffres} {r.nbOffres > 1 ? "bons plans" : "bon plan"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
