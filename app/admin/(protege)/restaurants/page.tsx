import Link from "next/link";
import BoutonConfirmer from "@/components/BoutonConfirmer";
import { clientServeur } from "@/lib/supabase/serveur";
import { LIBELLE_TYPE, type Restaurant } from "@/lib/types";
import { archiverRestaurant, supprimerRestaurant } from "../../actions";

export default async function AdminRestaurants({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const supabase = await clientServeur();
  const { data } = await supabase
    .from("restaurants")
    .select("*, offres(count)")
    .order("archive")
    .order("nom");
  const restaurants = (data ?? []) as (Restaurant & { offres: { count: number }[] })[];

  return (
    <>
      {erreur && (
        <p role="alert" className="mb-4 rounded-xl bg-red-100 p-3 text-sm font-semibold text-red-800">
          {erreur}
        </p>
      )}
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-titre text-2xl font-extrabold">Restaurants ({restaurants.length})</h1>
        <Link href="/admin/restaurants/nouveau" className="bouton">
          + Nouveau resto
        </Link>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {restaurants.map((r) => {
          const nb = r.offres[0]?.count ?? 0;
          return (
            <li
              key={r.id}
              className={`rounded-2xl border border-black/10 bg-white p-3 ${
                r.archive ? "opacity-70" : ""
              }`}
            >
              <p className="font-bold">
                {r.nom} {r.archive && <span className="text-xs text-black/50">(archivé)</span>}
              </p>
              <p className="text-sm text-black/60">
                {[LIBELLE_TYPE[r.type], r.cuisine, r.quartier].filter(Boolean).join(" · ")} · {nb}{" "}
                {nb > 1 ? "offres" : "offre"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href={`/admin/restaurants/${r.id}`} className="bouton-discret">
                  Modifier
                </Link>
                {!r.archive && (
                  <Link href={`/restaurants/${r.id}`} className="bouton-discret">
                    Voir
                  </Link>
                )}
                <form action={archiverRestaurant.bind(null, r.id, !r.archive)}>
                  <button className="bouton-discret">{r.archive ? "Restaurer" : "Archiver"}</button>
                </form>
                {r.archive && (
                  <form action={supprimerRestaurant.bind(null, r.id)}>
                    <BoutonConfirmer
                      message={`Supprimer définitivement ${r.nom} et ses ${nb} offre(s) ?`}
                    >
                      Supprimer
                    </BoutonConfirmer>
                  </form>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
