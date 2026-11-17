import Link from "next/link";
import { enregistrerOffre } from "@/app/admin/actions";
import ChampsCategorie from "./ChampsCategorie";
import { aujourdhuiParis, isoVersParis } from "@/lib/dates";
import { LIBELLE_STATUT, type Offre, type Restaurant, type Statut } from "@/lib/types";

export default function FormulaireOffre({
  offre,
  restaurants,
  erreur,
}: {
  offre?: Offre;
  restaurants: Pick<Restaurant, "id" | "nom" | "quartier">[];
  erreur?: string;
}) {
  const o = offre;
  return (
    <form action={enregistrerOffre} className="flex flex-col gap-3">
      <h1 className="font-titre text-2xl font-extrabold">
        {o ? "Modifier l'offre" : "Nouvelle offre"}
      </h1>
      {erreur && (
        <p role="alert" className="rounded-xl bg-red-100 p-3 text-sm font-semibold text-red-800">
          {erreur}
        </p>
      )}
      {o && <input type="hidden" name="id" value={o.id} />}

      <label className="etiquette">
        Restaurant *
        <select name="restaurant_id" required defaultValue={o?.restaurant_id ?? ""} className="champ">
          <option value="" disabled>
            Choisir…
          </option>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nom} ({r.quartier})
            </option>
          ))}
        </select>
      </label>
      <ChampsCategorie
        categorie={o?.categorie ?? "permanente"}
        debut={isoVersParis(o?.date_debut ?? null)}
        fin={isoVersParis(o?.date_fin ?? null)}
      />
      <label className="etiquette">
        Titre *
        <input name="titre" required defaultValue={o?.titre} placeholder="Menu midi entrée + plat" className="champ" />
      </label>
      <label className="etiquette">
        Prix
        <input name="prix" defaultValue={o?.prix ?? ""} placeholder="12,90 € · -30 % · 1+1" className="champ" />
      </label>
      <label className="etiquette">
        Description
        <textarea name="description" rows={3} defaultValue={o?.description ?? ""} className="champ" />
      </label>
      <label className="etiquette">
        Conditions
        <textarea name="conditions" rows={2} defaultValue={o?.conditions ?? ""} placeholder="Du lundi au vendredi, sur place…" className="champ" />
      </label>

      <label className="etiquette">
        Vérifiée le
        <input name="verifiee_le" type="date" defaultValue={o ? (o.verifiee_le ?? "") : aujourdhuiParis()} className="champ" />
      </label>
      <label className="etiquette">
        Source
        <input name="source" defaultValue={o?.source ?? ""} placeholder="Site du resto, Instagram, visite sur place…" className="champ" />
      </label>
      <label className="etiquette">
        Statut
        <select name="statut" defaultValue={o?.statut ?? "brouillon"} className="champ">
          {(Object.keys(LIBELLE_STATUT) as Statut[]).map((s) => (
            <option key={s} value={s}>
              {LIBELLE_STATUT[s]}
            </option>
          ))}
        </select>
        <span className="text-xs font-normal text-black/60">
          Seules les offres « Publiée » sont visibles sur le site.
        </span>
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="coup_de_coeur" defaultChecked={o?.coup_de_coeur} className="h-5 w-5 accent-miam-fonce" />
        🐉 Coup de cœur (mise en avant en haut de la liste)
      </label>

      <div className="mt-2 flex gap-2">
        <button className="bouton">Enregistrer</button>
        <Link href="/admin" className="bouton-discret !px-5">
          Annuler
        </Link>
      </div>
    </form>
  );
}
