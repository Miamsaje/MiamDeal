import type { Metadata } from "next";
import CarteOffre from "@/components/CarteOffre";
import ListeFavoris from "@/components/ListeFavoris";
import { offresActives, trierOffres } from "@/lib/donnees";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mes favoris" };

export default async function Favoris() {
  const toutes = await offresActives();
  const offres = [...trierOffres(toutes, "ephemere"), ...trierOffres(toutes, "permanente")];
  return (
    <>
      <h1 className="titre text-[2rem] sm:text-5xl">Mes favoris</h1>
      <p className="mt-1 text-doux">
        Enregistrés sur cet appareil, sans compte. Les offres terminées disparaissent toutes seules.
      </p>
      <ListeFavoris ids={offres.map((o) => o.id)}>
        {offres.map((o, i) => (
          <CarteOffre key={o.id} offre={o} index={i} />
        ))}
      </ListeFavoris>
    </>
  );
}
