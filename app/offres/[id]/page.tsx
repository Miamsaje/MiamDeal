import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgePrix, BadgeVerifie } from "@/components/Badges";
import BoutonFavori from "@/components/BoutonFavori";
import BoutonPartager from "@/components/BoutonPartager";
import CompteARebours from "@/components/CompteARebours";
import PhotoResto from "@/components/PhotoResto";
import Signalement from "@/components/Signalement";
import { categorieCuisine } from "@/lib/cuisines";
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
  const cuisine = categorieCuisine(r.cuisine);
  const aVenir = Boolean(offre.date_debut && estFuture(offre.date_debut));

  return (
    <article className="anim-apparition">
      <div className="flex items-center gap-2">
        <Link href="/" className="bouton-discret mr-auto">
          ← Bons plans
        </Link>
        <BoutonPartager titre={`${offre.titre} chez ${r.nom}`} />
        <BoutonFavori id={offre.id} />
      </div>

      <div className="relative mt-3">
        <PhotoResto restaurant={r} grande className="h-52 w-full rounded-3xl sm:h-72" />
        {offre.coup_de_coeur && (
          <span className="badge absolute left-3 top-3 bg-miam px-3 py-1 text-sm text-encre shadow">
            🐉 Coup de cœur de l&apos;équipe
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        <span className="badge bg-miam-clair text-encre">
          {offre.categorie === "ephemere" ? "⏳ Offre éphémère" : "🍽️ Offre permanente"}
        </span>
        {aVenir && (
          <span className="badge bg-sky-50 text-sky-700">🗓️ Pas encore commencée</span>
        )}
        {offre.date_fin && !aVenir && <CompteARebours fin={offre.date_fin} />}
        <BadgeVerifie date={offre.verifiee_le} />
      </div>

      <h1 className="titre mt-3 text-[2rem] sm:text-5xl">{offre.titre}</h1>
      <p className="mt-2 text-doux">
        <span aria-hidden>{cuisine.icone}</span>{" "}
        <Link href={`/restaurants/${r.id}`} className="font-bold text-encre hover:underline">
          {r.nom}
        </Link>{" "}
        · {r.quartier}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <BadgePrix prix={offre.prix} grand />
        {offre.date_fin && (
          <p className="text-sm text-doux">
            {offre.date_debut && <>Du {formaterDateHeure(offre.date_debut)} </>}
            {offre.date_debut ? "au" : "Jusqu'au"}{" "}
            <strong className="text-encre">{formaterDateHeure(offre.date_fin)}</strong>
          </p>
        )}
      </div>

      {offre.description && (
        <p className="mt-5 whitespace-pre-line text-[17px] leading-relaxed">{offre.description}</p>
      )}

      {offre.conditions && (
        <section className="mt-5 rounded-3xl border border-miam/50 bg-miam-pale p-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wide">📋 Conditions</h2>
          <p className="mt-1 whitespace-pre-line">{offre.conditions}</p>
        </section>
      )}

      <section className="mt-4 flex gap-4 rounded-3xl border border-trait bg-white p-4">
        <PhotoResto restaurant={r} className="h-20 w-20 shrink-0 rounded-2xl !text-4xl" />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold">
            <Link href={`/restaurants/${r.id}`} className="hover:underline">
              {r.nom}
            </Link>
          </h2>
          <p className="text-sm text-doux">
            {[LIBELLE_TYPE[r.type], r.cuisine].filter(Boolean).join(" · ")}
          </p>
          {r.adresse && <p className="mt-0.5 text-sm">{r.adresse}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {r.lien_carte && (
              <a href={r.lien_carte} target="_blank" rel="noopener noreferrer" className="bouton">
                Voir la carte
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
        </div>
      </section>

      <div className="mt-5 flex items-center gap-2 text-sm text-doux">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-192.png" alt="" className="h-8 w-8 rounded-full border border-trait" />
        <p>
          Publié par{" "}
          <strong className="text-encre">{offre.auteur?.nom_affiche ?? AUTEUR_PAR_DEFAUT}</strong>
          {offre.source && <> · Source : {offre.source}</>}
        </p>
      </div>
      <p className="mt-2 text-xs text-doux">
        Les offres peuvent changer sans préavis : vérifie auprès du restaurant avant de te déplacer.
      </p>

      <Signalement offreId={offre.id} etat={signalement} />
    </article>
  );
}
