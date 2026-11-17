import Link from "next/link";
import BoutonConfirmer from "@/components/BoutonConfirmer";
import { aujourdhuiParis, formaterDate, formaterDateHeure, jourIlYA } from "@/lib/dates";
import { normaliser } from "@/lib/donnees";
import { clientServeur } from "@/lib/supabase/serveur";
import { JOURS_AVANT_REVERIFICATION, LIBELLE_STATUT, type Offre } from "@/lib/types";
import {
  changerStatutOffre,
  dupliquerOffre,
  marquerVerifiee,
  supprimerOffre,
} from "../actions";

const COULEUR_STATUT: Record<string, string> = {
  publiee: "bg-green-100 text-green-800",
  en_attente: "bg-orange-100 text-orange-800",
  brouillon: "bg-gray-200 text-gray-700",
  archivee: "bg-gray-200 text-gray-500",
};

type Ligne = Offre & { restaurant: { nom: string; archive: boolean } | null };

const VUES = [
  { cle: "en_ligne", libelle: "En ligne" },
  { cle: "a_reverifier", libelle: "À revérifier" },
  { cle: "en_attente", libelle: "En attente" },
  { cle: "brouillon", libelle: "Brouillons" },
  { cle: "expiree", libelle: "Expirées" },
  { cle: "archivee", libelle: "Archivées" },
  { cle: "toutes", libelle: "Toutes" },
] as const;
type Vue = (typeof VUES)[number]["cle"];

export default async function AdminOffres({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; vue?: string; q?: string }>;
}) {
  const { erreur, vue: vueDemandee, q = "" } = await searchParams;
  const supabase = await clientServeur();
  const [{ data }, { count: nbRestos }] = await Promise.all([
    supabase
      .from("offres")
      .select("*, restaurant:restaurants(nom, archive)")
      .order("created_at", { ascending: false }),
    supabase.from("restaurants").select("id", { count: "exact", head: true }),
  ]);
  const offres = (data ?? []) as Ligne[];

  const maintenant = new Date().toISOString();
  const seuil = jourIlYA(JOURS_AVANT_REVERIFICATION);
  const aujourdhui = aujourdhuiParis();

  const expiree = (o: Ligne) => Boolean(o.date_fin && o.date_fin <= maintenant);
  const enLigne = (o: Ligne) => o.statut === "publiee" && !expiree(o);
  const aReverifier = (o: Ligne) => enLigne(o) && (!o.verifiee_le || o.verifiee_le < seuil);
  const dans: Record<Vue, (o: Ligne) => boolean> = {
    en_ligne: enLigne,
    a_reverifier: aReverifier,
    en_attente: (o) => o.statut === "en_attente",
    brouillon: (o) => o.statut === "brouillon",
    expiree: (o) => expiree(o) && o.statut !== "archivee",
    archivee: (o) => o.statut === "archivee",
    toutes: () => true,
  };

  const vue: Vue = VUES.some((v) => v.cle === vueDemandee) ? (vueDemandee as Vue) : "toutes";
  const mots = normaliser(q).split(/\s+/).filter(Boolean);
  const visibles = offres.filter(dans[vue]).filter((o) => {
    const texte = normaliser(`${o.titre} ${o.restaurant?.nom ?? ""}`);
    return mots.every((m) => texte.includes(m));
  });

  return (
    <>
      {erreur && (
        <p role="alert" className="mb-4 rounded-xl bg-red-100 p-3 text-sm font-semibold text-red-800">
          {erreur}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <h1 className="font-titre text-2xl font-extrabold">Offres</h1>
        {(nbRestos ?? 0) > 0 ? (
          <Link href="/admin/offres/nouvelle" className="bouton">
            + Nouvelle offre
          </Link>
        ) : (
          <Link href="/admin/restaurants/nouveau" className="bouton">
            + Ajouter un premier resto
          </Link>
        )}
      </div>

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {VUES.map((v) => {
          const n = offres.filter(dans[v.cle]).length;
          const alerte = v.cle === "a_reverifier" && n > 0;
          return (
            <Link
              key={v.cle}
              href={`/admin?vue=${v.cle}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-bold ${
                vue === v.cle
                  ? "border-miam-fonce bg-miam"
                  : alerte
                    ? "border-orange-300 bg-orange-50 text-orange-800"
                    : "border-black/15 bg-white hover:bg-miam-clair"
              }`}
            >
              {v.libelle} · {n}
            </Link>
          );
        })}
      </div>

      <form action="/admin" className="mt-2 flex gap-2">
        <input type="hidden" name="vue" value={vue} />
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Chercher une offre ou un resto…"
          aria-label="Chercher une offre"
          className="champ !mt-0 !rounded-full"
        />
        <button className="bouton-discret shrink-0">Chercher</button>
      </form>

      {visibles.length === 0 && (
        <p className="mt-6 text-center text-sm text-black/60">Aucune offre dans cette vue.</p>
      )}
      <ul className="mt-3 flex flex-col gap-2">
        {visibles.map((o) => (
          <li
            key={o.id}
            className={`rounded-2xl border border-black/10 bg-white p-3 ${
              o.statut === "archivee" || expiree(o) ? "opacity-70" : ""
            }`}
          >
            <p className="text-xs font-bold uppercase text-black/50">
              {o.restaurant?.nom}
              {o.restaurant?.archive && " (resto archivé)"} ·{" "}
              {o.categorie === "ephemere" ? "Éphémère" : "Permanente"}
            </p>
            <p className="font-bold">
              {o.coup_de_coeur && "🐉 "}
              {o.titre} {o.prix && <span className="text-black/60">· {o.prix}</span>}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <span className={`rounded-full px-2 py-0.5 ${COULEUR_STATUT[o.statut]}`}>
                {LIBELLE_STATUT[o.statut]}
              </span>
              {o.date_fin && (
                <span
                  className={`rounded-full px-2 py-0.5 ${
                    expiree(o) ? "bg-red-100 text-red-700" : "bg-miam-clair"
                  }`}
                >
                  {expiree(o) ? "Expirée le" : "Fin le"} {formaterDateHeure(o.date_fin)}
                </span>
              )}
              <span
                className={`rounded-full px-2 py-0.5 ${
                  aReverifier(o) ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-black/60"
                }`}
              >
                {o.verifiee_le ? `Vérifiée le ${formaterDate(o.verifiee_le)}` : "Jamais vérifiée"}
                {aReverifier(o) && " — à revérifier"}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link href={`/admin/offres/${o.id}`} className="bouton-discret">
                Modifier
              </Link>
              {enLigne(o) && !o.restaurant?.archive && (
                <Link href={`/offres/${o.id}`} className="bouton-discret">
                  Voir
                </Link>
              )}
              {o.statut !== "archivee" && o.verifiee_le !== aujourdhui && (
                <form action={marquerVerifiee.bind(null, o.id)}>
                  <button className="bouton-discret">✓ Vérifiée aujourd&apos;hui</button>
                </form>
              )}
              {o.statut !== "publiee" && (
                <form action={changerStatutOffre.bind(null, o.id, "publiee")}>
                  <button className="bouton-discret">Publier</button>
                </form>
              )}
              <form action={dupliquerOffre.bind(null, o.id)}>
                <button className="bouton-discret">Dupliquer</button>
              </form>
              {o.statut !== "archivee" ? (
                <form action={changerStatutOffre.bind(null, o.id, "archivee")}>
                  <button className="bouton-discret">Archiver</button>
                </form>
              ) : (
                <form action={supprimerOffre.bind(null, o.id)}>
                  <BoutonConfirmer message={`Supprimer définitivement « ${o.titre} » ?`}>
                    Supprimer
                  </BoutonConfirmer>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
