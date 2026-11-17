import Link from "next/link";
import { categorieCuisine } from "@/lib/cuisines";
import { estFuture, estRecente, formaterDateHeure } from "@/lib/dates";
import type { OffreComplete } from "@/lib/types";
import { BadgePrix, BadgeVerifie } from "./Badges";
import BoutonFavori from "./BoutonFavori";
import CompteARebours from "./CompteARebours";
import PhotoResto from "./PhotoResto";

/** Carte d'une offre, façon Dealabs : vignette à gauche, titre, prix, infos et bouton. */
export default function CarteOffre({ offre, index = 0 }: { offre: OffreComplete; index?: number }) {
  const r = offre.restaurant;
  const cuisine = categorieCuisine(r.cuisine);
  const aVenir = Boolean(offre.date_debut && estFuture(offre.date_debut));
  const nouveau = estRecente(offre.created_at, 3);

  return (
    <li className="anim-apparition relative" style={{ "--i": Math.min(index, 8) } as React.CSSProperties}>
      <Link
        href={`/offres/${offre.id}`}
        className={`group flex gap-3 rounded-3xl border bg-white p-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(43,26,16,0.25)] sm:gap-4 sm:p-4 ${
          offre.coup_de_coeur ? "border-miam bg-gradient-to-br from-miam-pale to-white" : "border-trait"
        }`}
      >
        <div className="relative shrink-0">
          <PhotoResto
            restaurant={r}
            className="h-28 w-28 rounded-2xl transition duration-300 group-hover:scale-[1.03] sm:h-40 sm:w-40"
          />
          {offre.coup_de_coeur && (
            <span className="badge absolute -left-1.5 -top-1.5 bg-miam text-encre shadow-sm">
              🐉 Coup de cœur
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap gap-1.5 pr-10">
            {nouveau && !offre.coup_de_coeur && (
              <span className="badge bg-encre text-white">Nouveau</span>
            )}
            {aVenir ? (
              <span className="badge bg-sky-50 text-sky-700">
                🗓️ Dès le {formaterDateHeure(offre.date_debut!)}
              </span>
            ) : (
              offre.date_fin && <CompteARebours fin={offre.date_fin} />
            )}
          </div>

          <h2 className="mt-1 line-clamp-2 pr-8 text-[17px] font-extrabold leading-snug sm:text-xl">
            {offre.titre}
          </h2>

          <p className="mt-0.5 truncate text-sm text-doux">
            <span aria-hidden>{cuisine.icone}</span> <span className="font-semibold text-encre">{r.nom}</span>{" "}
            · {r.quartier}
          </p>

          <div className="mt-2">
            <BadgePrix prix={offre.prix} />
          </div>

          <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
            <BadgeVerifie date={offre.verifiee_le} />
            <span className="hidden shrink-0 items-center gap-1 rounded-full bg-miam px-4 py-2 text-sm font-bold transition group-hover:gap-2 sm:inline-flex">
              Voir le bon plan <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </Link>
      <BoutonFavori id={offre.id} className="absolute right-3 top-3 sm:right-4 sm:top-4" />
    </li>
  );
}
