import Link from "next/link";
import { enregistrerRestaurant } from "@/app/admin/actions";
import type { Restaurant } from "@/lib/types";

export default function FormulaireRestaurant({
  restaurant,
  erreur,
}: {
  restaurant?: Restaurant;
  erreur?: string;
}) {
  const r = restaurant;
  return (
    <form action={enregistrerRestaurant} className="flex flex-col gap-3">
      <h1 className="font-titre text-2xl font-extrabold">
        {r ? `Modifier ${r.nom}` : "Nouveau restaurant"}
      </h1>
      {erreur && (
        <p role="alert" className="rounded-xl bg-red-100 p-3 text-sm font-semibold text-red-800">
          {erreur}
        </p>
      )}
      {r && <input type="hidden" name="id" value={r.id} />}

      <label className="etiquette">
        Nom *
        <input name="nom" required defaultValue={r?.nom} className="champ" />
      </label>
      <label className="etiquette">
        Type *
        <select name="type" defaultValue={r?.type ?? "independant"} className="champ">
          <option value="independant">Indépendant</option>
          <option value="chaine">Chaîne / fast-food</option>
        </select>
      </label>
      <label className="etiquette">
        Cuisine
        <input name="cuisine" defaultValue={r?.cuisine ?? ""} placeholder="Italien, burgers…" className="champ" />
      </label>
      <label className="etiquette">
        Quartier *
        <input name="quartier" required defaultValue={r?.quartier} placeholder="Oberkampf, Châtelet…" className="champ" />
        <span className="text-xs font-normal text-black/60">
          Écris-le toujours de la même façon : il sert de filtre sur l&apos;accueil.
        </span>
      </label>
      <label className="etiquette">
        Adresse
        <input name="adresse" defaultValue={r?.adresse ?? ""} className="champ" />
      </label>
      <label className="etiquette">
        Lien Google Maps
        <input name="lien_maps" type="url" defaultValue={r?.lien_maps ?? ""} placeholder="https://maps.app.goo.gl/…" className="champ" />
      </label>
      <label className="etiquette">
        Lien vers la carte officielle
        <input name="lien_carte" type="url" defaultValue={r?.lien_carte ?? ""} placeholder="https://…" className="champ" />
      </label>
      {r?.photo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={r.photo_url} alt="Photo actuelle" className="h-32 w-full rounded-xl object-cover" />
      )}
      <label className="etiquette">
        Photo (fichier, 4 Mo max)
        <input name="photo" type="file" accept="image/*" className="champ" />
      </label>
      <label className="etiquette">
        … ou adresse web de la photo
        <input name="photo_url" type="url" defaultValue={r?.photo_url ?? ""} placeholder="https://…" className="champ" />
      </label>

      <div className="mt-2 flex gap-2">
        <button className="bouton">Enregistrer</button>
        <Link href="/admin/restaurants" className="bouton-discret !px-5">
          Annuler
        </Link>
      </div>
    </form>
  );
}
