import Link from "next/link";
import { Suspense } from "react";
import CarteOffre from "@/components/CarteOffre";
import FiltreQuartier from "@/components/FiltreQuartier";
import { filtrerOffres, offresActives, quartiersDe, trierOffres } from "@/lib/donnees";
import type { TypeResto } from "@/lib/types";

export const dynamic = "force-dynamic";

type Recherche = { onglet?: string; quartier?: string; type?: string; q?: string; n?: string };

const PAR_PAGE = 30;

const TYPES: { valeur: TypeResto | undefined; libelle: string }[] = [
  { valeur: undefined, libelle: "Tous" },
  { valeur: "independant", libelle: "Indépendants" },
  { valeur: "chaine", libelle: "Chaînes & fast-foods" },
];

export default async function Accueil({ searchParams }: { searchParams: Promise<Recherche> }) {
  const recherche = await searchParams;
  const ephemeres = recherche.onglet === "ephemeres";
  const type =
    recherche.type === "independant" || recherche.type === "chaine" ? recherche.type : undefined;
  const quartier = recherche.quartier || undefined;
  const q = recherche.q?.trim() || undefined;
  const limite = Math.max(PAR_PAGE, Number(recherche.n) || PAR_PAGE);

  const toutes = await offresActives();
  const filtrees = filtrerOffres(toutes, { quartier, type, q });
  const permanentes = trierOffres(filtrees, "permanente");
  const ephemeresListe = trierOffres(filtrees, "ephemere");
  const offres = ephemeres ? ephemeresListe : permanentes;
  const visibles = offres.slice(0, limite);

  // Construit un lien en gardant les filtres déjà choisis
  const lien = (modifs: Recherche) => {
    const p = new URLSearchParams();
    const tout = { ...recherche, n: undefined, ...modifs };
    if (tout.onglet === "ephemeres") p.set("onglet", "ephemeres");
    if (tout.quartier) p.set("quartier", tout.quartier);
    if (tout.type) p.set("type", tout.type);
    if (tout.q) p.set("q", tout.q);
    if (tout.n) p.set("n", tout.n);
    const chaine = p.toString();
    return chaine ? `/?${chaine}` : "/";
  };

  const onglet = (actif: boolean) =>
    `flex-1 rounded-full px-3 py-2.5 text-center font-titre text-base font-bold transition ${
      actif ? "bg-encre text-white" : "text-encre hover:bg-miam-clair"
    }`;
  const compteur = (n: number, actif: boolean) => (
    <span
      className={`ml-1.5 rounded-full px-1.5 py-0.5 font-sans text-xs ${
        actif ? "bg-miam text-encre" : "bg-black/10"
      }`}
    >
      {n}
    </span>
  );

  return (
    <>
      <h1 className="font-titre text-3xl font-extrabold leading-tight">
        Manger bien, payer moins. <span className="whitespace-nowrap">Miam ! 🔥</span>
      </h1>

      <form action="/" role="search" className="mt-3 flex gap-2">
        {ephemeres && <input type="hidden" name="onglet" value="ephemeres" />}
        {quartier && <input type="hidden" name="quartier" value={quartier} />}
        {type && <input type="hidden" name="type" value={type} />}
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Burger, menu midi, Belleville…"
          aria-label="Rechercher un bon plan"
          className="champ !mt-0 !rounded-full"
        />
        <button className="bouton shrink-0" aria-label="Rechercher">
          🔍
        </button>
      </form>

      <nav
        aria-label="Catégories d'offres"
        className="mt-3 flex gap-1 rounded-full border border-black/10 bg-white p-1"
      >
        <Link
          href={lien({ onglet: undefined })}
          className={onglet(!ephemeres)}
          aria-current={!ephemeres ? "page" : undefined}
        >
          🍽️ Permanentes
          {compteur(permanentes.length, !ephemeres)}
        </Link>
        <Link
          href={lien({ onglet: "ephemeres" })}
          className={onglet(ephemeres)}
          aria-current={ephemeres ? "page" : undefined}
        >
          ⏳ Éphémères
          {compteur(ephemeresListe.length, ephemeres)}
        </Link>
      </nav>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {TYPES.map((t) => (
            <Link
              key={t.libelle}
              href={lien({ type: t.valeur })}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-bold ${
                type === t.valeur
                  ? "border-miam-fonce bg-miam"
                  : "border-black/15 bg-white hover:bg-miam-clair"
              }`}
            >
              {t.libelle}
            </Link>
          ))}
        </div>
        <Suspense>
          <FiltreQuartier quartiers={quartiersDe(toutes)} />
        </Suspense>
      </div>

      {q && (
        <p className="mt-3 text-sm">
          Résultats pour « <strong>{q}</strong> » ·{" "}
          <Link href={lien({ q: undefined })} className="underline">
            effacer
          </Link>
        </p>
      )}

      {visibles.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-3">
          {visibles.map((offre) => (
            <CarteOffre key={offre.id} offre={offre} />
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center">
          <p className="text-4xl">🐉</p>
          <p className="mt-2 font-titre text-xl font-bold">Rien à se mettre sous la dent…</p>
          <p className="mt-1 text-sm text-black/60">
            Aucune offre {ephemeres ? "éphémère" : "permanente"} ne correspond pour le moment.
          </p>
          {(quartier || type || q) && (
            <Link
              href={lien({ quartier: undefined, type: undefined, q: undefined })}
              className="bouton mt-4"
            >
              Voir toutes les offres
            </Link>
          )}
        </div>
      )}

      {offres.length > visibles.length && (
        <div className="mt-4 text-center">
          <Link href={lien({ n: String(limite + PAR_PAGE) })} scroll={false} className="bouton">
            Voir plus d&apos;offres ({offres.length - visibles.length})
          </Link>
        </div>
      )}
    </>
  );
}
