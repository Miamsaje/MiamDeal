import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgePrix, BadgeVerifie } from "@/components/Badges";
import BoutonFavori from "@/components/BoutonFavori";
import BoutonPartager from "@/components/BoutonPartager";
import CompteARebours from "@/components/CompteARebours";
import PhotoResto from "@/components/PhotoResto";
import Signalement from "@/components/Signalement";
import { estFuture, formaterDateHeure } from "@/lib/dates";
import { offreParId } from "@/lib/donnees";
import { AUTEUR_PAR_DEFAUT, LIBELLE_TYPE } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ signalement?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const offre = await offreParId((await params).id);
  if (!offre) return { title: "Offre introuvable" };
  return {
    title: `${offre.titre} chez ${offre.restaurant.nom}`,
    description:
      [offre.prix, offre.description, `${offre.restaurant.nom}, ${offre.restaurant.quartier}`]
        .filter(Boolean)
        .join(" — ") || undefined,
  };
}

export default async function PageOffre({ params, searchParams }: Props) {
  const offre = await offreParId((await params).id);
  if (!offre) notFound();
  const { signalement } = await searchParams;
  const r = offre.restaurant;
  const aVenir = Boolean(offre.date_debut && estFuture(offre.date_debut));

  return (
    <article>
      <div className="flex items-center gap-2">
        <Link href="/" className="mr-auto text-sm font-semibold underline">
          ← Toutes les offres
        </Link>
        <BoutonPartager titre={`${offre.titre} chez ${r.nom}`} />
        <BoutonFavori id={offre.id} />
      </div>

      <PhotoResto restaurant={r} className="mt-3 h-48 w-full rounded-2xl sm:h-64" />

      <p className="mt-4 text-sm font-bold uppercase tracking-wide text-black/50">
        {offre.categorie === "ephemere" ? "⏳ Offre éphémère" : "🍽️ Offre permanente"}
      </p>
      <div className="mt-1 flex items-start justify-between gap-3">
        <h1 className="font-titre text-3xl font-extrabold leading-tight">{offre.titre}</h1>
        <BadgePrix prix={offre.prix} grand />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {offre.coup_de_coeur && (
          <span className="rounded-full bg-miam px-2 py-0.5 text-xs font-bold">🐉 Coup de cœur</span>
        )}
        {aVenir && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
            🗓️ Pas encore commencée
          </span>
        )}
        {offre.date_fin && !aVenir && <CompteARebours fin={offre.date_fin} />}
        <BadgeVerifie date={offre.verifiee_le} />
      </div>

      {offre.date_fin && (
        <p className="mt-3 text-sm">
          {offre.date_debut && <>Du {formaterDateHeure(offre.date_debut)} </>}
          {offre.date_debut ? "au" : "Jusqu'au"} <strong>{formaterDateHeure(offre.date_fin)}</strong>
        </p>
      )}

      {offre.description && <p className="mt-4 whitespace-pre-line">{offre.description}</p>}

      {offre.conditions && (
        <section className="mt-4 rounded-2xl bg-miam-clair p-4">
          <h2 className="font-titre text-lg font-bold">Conditions</h2>
          <p className="whitespace-pre-line text-sm">{offre.conditions}</p>
        </section>
      )}

      <section className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
        <h2 className="font-titre text-xl font-bold">
          <Link href={`/restaurants/${r.id}`} className="underline decoration-miam decoration-4">
            {r.nom}
          </Link>
        </h2>
        <p className="text-sm text-black/60">
          {[LIBELLE_TYPE[r.type], r.cuisine, r.quartier].filter(Boolean).join(" · ")}
        </p>
        {r.adresse && <p className="mt-1 text-sm">{r.adresse}</p>}
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
              📍 Y aller
            </a>
          )}
        </div>
      </section>

      <p className="mt-4 text-xs text-black/50">
        Publiée par <strong>{offre.auteur?.nom_affiche ?? AUTEUR_PAR_DEFAUT}</strong>
        {offre.source && <> · Source : {offre.source}</>}
        <br />
        Les offres peuvent changer sans préavis : vérifie auprès du restaurant avant de te déplacer.
      </p>

      <Signalement offreId={offre.id} etat={signalement} />
    </article>
  );
}
