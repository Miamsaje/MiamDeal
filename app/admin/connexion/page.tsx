import type { Metadata } from "next";
import { supabaseConfigure } from "@/lib/supabase/config";
import { seConnecter } from "../actions";

export const metadata: Metadata = { title: "Connexion équipe", robots: { index: false } };

export default async function Connexion({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;

  if (!supabaseConfigure) {
    return (
      <div className="rounded-3xl border border-trait bg-white p-5">
        <h1 className="titre text-2xl">Espace équipe</h1>
        <p className="mt-2">
          Supabase n&apos;est pas encore configuré. Crée le fichier <code>.env.local</code> (voir
          le README) pour activer l&apos;espace admin.
        </p>
      </div>
    );
  }

  return (
    <form action={seConnecter} className="mx-auto max-w-sm rounded-3xl border border-trait bg-white p-5">
      <h1 className="titre text-2xl">Espace équipe 🐉</h1>
      <p className="text-sm text-doux">Réservé à l&apos;équipe MiamDeal.</p>
      {erreur && (
        <p role="alert" className="mt-3 rounded-xl bg-red-100 p-3 text-sm font-semibold text-red-800">
          {erreur}
        </p>
      )}
      <label className="etiquette mt-4">
        E-mail
        <input name="email" type="email" required autoComplete="email" className="champ" />
      </label>
      <label className="etiquette mt-3">
        Mot de passe
        <input
          name="mot_de_passe"
          type="password"
          required
          autoComplete="current-password"
          className="champ"
        />
      </label>
      <button className="bouton mt-5 w-full">Se connecter</button>
    </form>
  );
}
