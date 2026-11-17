import Link from "next/link";
import { estFuture, estRecente, formaterDateHeure } from "@/lib/dates";
import type { OffreComplete } from "@/lib/types";
import { BadgePrix, BadgeVerifie } from "./Badges";
import BoutonFavori from "./BoutonFavori";
import CompteARebours from "./CompteARebours";
import PhotoResto from "./PhotoResto";

export default function CarteOffre({ offre }: { offre: OffreComplete }) {
  const r = offre.restaurant;
  const aVenir = Boolean(offre.date_debut && estFuture(offre.date_debut));
  const nouveau = estRecente(offre.created_at, 3);

  return (
    <li className="relative">
      <Link
        href={`/offres/${offre.id}`}
        className={`flex gap-3 rounded-2xl border bg-white p-3 shadow-sm transition hover:border-miam-fonce hover:shadow-md ${
          offre.coup_de_coeur ? "border-miam-fonce ring-2 ring-miam/60" : "border-black/10"
        }`}
      >
        <PhotoResto restaurant={r} className="h-24 w-24 shrink-0 rounded-xl" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-xs font-bold uppercase tracking-wide text-black/50">
            {r.nom} · 📍 {r.quartier}
          </p>
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-titre text-lg font-bold leading-tight">{offre.titre}</h2>
            <BadgePrix prix={offre.prix} />
          </div>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {offre.coup_de_coeur && (
              <span className="rounded-full bg-miam px-2 py-0.5 text-xs font-bold">
                🐉 Coup de cœur
              </span>
            )}
            {nouveau && !offre.coup_de_coeur && (
              <span className="rounded-full bg-encre px-2 py-0.5 text-xs font-bold text-white">
                Nouveau
              </span>
            )}
            {aVenir ? (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                🗓️ Dès le {formaterDateHeure(offre.date_debut!)}
              </span>
            ) : (
              offre.date_fin && <CompteARebours fin={offre.date_fin} />
            )}
            <BadgeVerifie date={offre.verifiee_le} />
          </div>
        </div>
      </Link>
      <BoutonFavori id={offre.id} className="absolute left-1.5 top-1.5" />
    </li>
  );
}
