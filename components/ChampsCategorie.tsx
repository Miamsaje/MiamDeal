"use client";

import { useState } from "react";
import type { Categorie } from "@/lib/types";

/** Choix de la catégorie ; les dates ne s'affichent que pour une offre éphémère. */
export default function ChampsCategorie({
  categorie: initiale,
  debut,
  fin,
}: {
  categorie: Categorie;
  debut: string;
  fin: string;
}) {
  const [categorie, setCategorie] = useState<Categorie>(initiale);
  return (
    <>
      <label className="etiquette">
        Catégorie *
        <select
          name="categorie"
          value={categorie}
          onChange={(e) => setCategorie(e.target.value as Categorie)}
          className="champ"
        >
          <option value="permanente">Permanente (menu midi, formule étudiante, happy hour…)</option>
          <option value="ephemere">Éphémère (avec date de fin)</option>
        </select>
      </label>

      {categorie === "ephemere" && (
        <fieldset className="rounded-2xl border border-black/15 p-3">
          <legend className="px-1 text-sm font-bold">Dates (heure de Paris)</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="etiquette">
              Début (facultatif)
              <input name="date_debut" type="datetime-local" defaultValue={debut} className="champ" />
            </label>
            <label className="etiquette">
              Fin *
              <input name="date_fin" type="datetime-local" required defaultValue={fin} className="champ" />
            </label>
          </div>
          <p className="mt-2 text-xs text-black/60">
            Passé la date de fin, l&apos;offre disparaît toute seule du site.
          </p>
        </fieldset>
      )}
    </>
  );
}
