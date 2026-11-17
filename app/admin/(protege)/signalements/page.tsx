import Link from "next/link";
import { formaterDateHeure } from "@/lib/dates";
import { clientServeur } from "@/lib/supabase/serveur";
import { LIBELLE_MOTIF, type Signalement } from "@/lib/types";
import { traiterSignalement } from "../../actions";

type Ligne = Signalement & {
  offre: { id: string; titre: string; restaurant: { nom: string } | null } | null;
};

export default async function AdminSignalements({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const supabase = await clientServeur();
  const { data } = await supabase
    .from("signalements")
    .select("*, offre:offres(id, titre, restaurant:restaurants(nom))")
    .order("traite")
    .order("created_at", { ascending: false })
    .limit(200);
  const signalements = (data ?? []) as Ligne[];

  return (
    <>
      {erreur && (
        <p role="alert" className="mb-4 rounded-xl bg-red-100 p-3 text-sm font-semibold text-red-800">
          {erreur}
        </p>
      )}
      <h1 className="font-titre text-2xl font-extrabold">Signalements</h1>
      <p className="text-sm text-black/60">
        Envoyés par les visiteurs depuis la page d&apos;une offre.
      </p>
      {signalements.length === 0 && (
        <p className="mt-6 text-center text-sm text-black/60">Aucun signalement. Tout roule ! 🐉</p>
      )}
      <ul className="mt-3 flex flex-col gap-2">
        {signalements.map((s) => (
          <li
            key={s.id}
            className={`rounded-2xl border border-black/10 bg-white p-3 ${s.traite ? "opacity-60" : ""}`}
          >
            <p className="text-xs font-bold uppercase text-black/50">
              {formaterDateHeure(s.created_at)} · {s.offre?.restaurant?.nom}
            </p>
            <p className="font-bold">{s.offre?.titre}</p>
            <p className="mt-1 text-sm">
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                🚩 {LIBELLE_MOTIF[s.motif]}
              </span>
            </p>
            {s.message && <p className="mt-1 whitespace-pre-line text-sm">« {s.message} »</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              {s.offre && (
                <Link href={`/admin/offres/${s.offre.id}`} className="bouton-discret">
                  Ouvrir l&apos;offre
                </Link>
              )}
              <form action={traiterSignalement.bind(null, s.id, !s.traite)}>
                <button className="bouton-discret">
                  {s.traite ? "Rouvrir" : "✓ Marquer comme traité"}
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
