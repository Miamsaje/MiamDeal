import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CarteOffre from "@/components/CarteOffre";
import PhotoResto from "@/components/PhotoResto";
import { restaurantParId } from "@/lib/donnees";
import { LIBELLE_TYPE } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fiche = await restaurantParId((await params).id);
  if (!fiche) return { title: "Restaurant introuvable" };
  const r = fiche.restaurant;
  return {
    title: `${r.nom} — bons plans`,
    description: `Les bons plans de ${r.nom} (${[r.cuisine, r.quartier].filter(Boolean).join(", ")}) à Paris.`,
  };
}

export default async function PageRestaurant({ params }: Props) {
  const fiche = await restaurantParId((await params).id);
  if (!fiche) notFound();
  const { restaurant: r, offres } = fiche;

  return (
    <article>
      {/* Données structurées pour les moteurs de recherche */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: r.nom,
            servesCuisine: r.cuisine ?? undefined,
            address: r.adresse ?? undefined,
            image: r.photo_url ?? undefined,
            hasMenu: r.lien_carte ?? undefined,
            hasMap: r.lien_maps ?? undefined,
          }).replace(/</g, "\\u003c"),
        }}
      />
      <Link href="/restaurants" className="text-sm font-semibold underline">
        ← Tous les restos
      </Link>

      <PhotoResto restaurant={r} className="mt-3 h-48 w-full rounded-2xl sm:h-64" />

      <h1 className="mt-4 font-titre text-3xl font-extrabold leading-tight">{r.nom}</h1>
      <p className="text-sm text-black/60">
        {[LIBELLE_TYPE[r.type], r.cuisine, r.quartier].filter(Boolean).join(" · ")}
      </p>
      {r.adresse && <p className="mt-2">{r.adresse}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {r.lien_carte && (
          <a href={r.lien_carte} target="_blank" rel="noopener noreferrer" className="bouton">
            Voir la carte officielle
          </a>
        )}
        {r.lien_maps && (
          <a
            href={r.lien_maps}
            target="_blank"
            rel="noopener noreferrer"
            className="bouton-discret !px-5 !py-2.5 !text-base"
          >
            📍 Google Maps
          </a>
        )}
      </div>

      <h2 className="mt-6 font-titre text-xl font-bold">
        {offres.length > 0 ? "Les bons plans du moment" : "Pas de bon plan en ce moment"}
      </h2>
      <ul className="mt-3 flex flex-col gap-3">
        {offres.map((offre) => (
          <CarteOffre key={offre.id} offre={offre} />
        ))}
      </ul>
    </article>
  );
}
