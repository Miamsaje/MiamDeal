import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CarteOffre from "@/components/CarteOffre";
import PhotoResto from "@/components/PhotoResto";
import { categorieCuisine } from "@/lib/cuisines";
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
  const cuisine = categorieCuisine(r.cuisine);

  return (
    <article className="anim-apparition">
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
      <Link href="/restaurants" className="bouton-discret">
        ← Tous les restos
      </Link>

      <PhotoResto restaurant={r} grande className="mt-3 h-52 w-full rounded-3xl sm:h-72" />

      <div className="mt-5 flex flex-wrap gap-1.5">
        <span className="badge bg-miam-clair text-encre">
          {cuisine.icone} {r.cuisine ?? cuisine.libelle}
        </span>
        <span className="badge bg-gray-100 text-encre">{LIBELLE_TYPE[r.type]}</span>
        <span className="badge bg-gray-100 text-encre">📍 {r.quartier}</span>
      </div>
      <h1 className="titre mt-3 text-[2rem] sm:text-5xl">{r.nom}</h1>
      {r.adresse && <p className="mt-2 text-doux">{r.adresse}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
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

      <h2 className="titre mt-8 text-2xl">
        {offres.length > 0
          ? `${offres.length} ${offres.length > 1 ? "bons plans" : "bon plan"} en ce moment`
          : "Pas de bon plan en ce moment"}
      </h2>
      {offres.length === 0 && (
        <p className="mt-1 text-sm text-doux">Repasse bientôt, le dragon surveille. 🐉</p>
      )}
      <ul className="mt-3 flex flex-col gap-3 sm:gap-4">
        {offres.map((offre, i) => (
          <CarteOffre key={offre.id} offre={offre} index={i} />
        ))}
      </ul>
    </article>
  );
}
