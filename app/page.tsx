import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import CarteOffre from "@/components/CarteOffre";
import FiltreQuartier from "@/components/FiltreQuartier";
import { categorieParCle } from "@/lib/cuisines";
import {
  cuisinesDe,
  filtrerOffres,
  offresActives,
  quartiersDe,
  trierOffres,
} from "@/lib/donnees";
import type { TypeResto } from "@/lib/types";

export const dynamic = "force-dynamic";

type Recherche = {
  onglet?: string;
  quartier?: string;
  type?: string;
  q?: string;
  cuisine?: string;
  n?: string;
};

const PAR_PAGE = 30;

const TYPES: { valeur: TypeResto | undefined; libelle: string }[] = [
  { valeur: undefined, libelle: "Tous les restos" },
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
  const cuisine = categorieParCle(recherche.cuisine)?.cle;
  const limite = Math.max(PAR_PAGE, Number(recherche.n) || PAR_PAGE);

  const toutes = await offresActives();
  const filtrees = filtrerOffres(toutes, { quartier, type, q, cuisine });
  const permanentes = trierOffres(filtrees, "permanente");
  const ephemeresListe = trierOffres(filtrees, "ephemere");
  const offres = ephemeres ? ephemeresListe : permanentes;
  const visibles = offres.slice(0, limite);
  const cuisines = cuisinesDe(toutes);

  // Construit un lien en gardant les filtres déjà choisis
  const lien = (modifs: Recherche) => {
    const p = new URLSearchParams();
    const tout = { ...recherche, n: undefined, ...modifs };
    if (tout.onglet === "ephemeres") p.set("onglet", "ephemeres");
    for (const cle of ["cuisine", "quartier", "type", "q", "n"] as const)
      if (tout[cle]) p.set(cle, tout[cle]!);
    const chaine = p.toString();
    return chaine ? `/?${chaine}` : "/";
  };

  const onglet = (actif: boolean) =>
    `relative flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-[15px] font-extrabold transition ${
      actif ? "bg-miam text-encre shadow-sm" : "text-doux hover:text-encre"
    }`;
  const compteur = (n: number, actif: boolean) => (
    <span
      className={`rounded-full px-1.5 py-px text-xs font-bold ${actif ? "bg-white/70" : "bg-trait"}`}
    >
      {n}
    </span>
  );
  const filtresActifs = Boolean(quartier || type || q || cuisine);

  return (
    <>
      {/* Bannière d'accueil */}
      <section className="anim-apparition relative overflow-hidden rounded-[2rem] bg-miam-clair px-5 pb-5 pt-6 sm:px-8 sm:pt-8">
        <div aria-hidden className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-miam/30 blur-2xl" />
        <Image
          src="/dragon.png"
          alt=""
          width={640}
          height={368}
          priority
          className="anim-flotte pointer-events-none absolute -right-5 top-3 w-32 [mask-image:linear-gradient(to_bottom,black_70%,transparent)] sm:right-4 sm:top-4 sm:w-64"
        />
        <h1 className="titre relative max-w-[13rem] text-[1.85rem] sm:max-w-md sm:text-5xl">
          Manger bien, payer moins.
        </h1>
        <p className="relative mt-2 max-w-[14rem] text-sm font-medium text-encre/80 sm:max-w-sm sm:text-base">
          Les meilleurs bons plans restos de Paris, vérifiés par l&apos;équipe.
        </p>

        <form action="/" role="search" className="relative mt-5 flex gap-2">
          {ephemeres && <input type="hidden" name="onglet" value="ephemeres" />}
          {cuisine && <input type="hidden" name="cuisine" value={cuisine} />}
          {quartier && <input type="hidden" name="quartier" value={quartier} />}
          {type && <input type="hidden" name="type" value={type} />}
          <div className="relative flex-1">
            <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-doux">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={2.2}>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Burger, menu midi, Belleville…"
              aria-label="Rechercher un bon plan"
              className="w-full rounded-full border border-transparent bg-white py-3 pl-11 pr-4 text-base shadow-sm outline-none transition focus:border-miam focus:ring-4 focus:ring-miam/30"
            />
          </div>
          <button className="bouton shrink-0">Chercher</button>
        </form>
      </section>

      {/* Onglets */}
      <nav
        aria-label="Catégories d'offres"
        className="mt-5 flex gap-1 rounded-full border border-trait bg-white p-1"
      >
        <Link
          href={lien({ onglet: undefined })}
          className={onglet(!ephemeres)}
          aria-current={!ephemeres ? "page" : undefined}
        >
          🍽️ Permanentes {compteur(permanentes.length, !ephemeres)}
        </Link>
        <Link
          href={lien({ onglet: "ephemeres" })}
          className={onglet(ephemeres)}
          aria-current={ephemeres ? "page" : undefined}
        >
          ⏳ Éphémères {compteur(ephemeresListe.length, ephemeres)}
        </Link>
      </nav>

      {/* Cuisines */}
      {cuisines.length > 1 && (
        <div className="sans-barre -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <Link
            href={lien({ cuisine: undefined })}
            className={`puce ${!cuisine ? "puce-active" : "puce-inactive"}`}
          >
            ✨ Tout
          </Link>
          {cuisines.map((c) => (
            <Link
              key={c.cle}
              href={lien({ cuisine: c.cle })}
              aria-current={cuisine === c.cle ? "true" : undefined}
              className={`puce ${cuisine === c.cle ? "puce-active" : "puce-inactive"}`}
            >
              <span aria-hidden className="text-base">
                {c.icone}
              </span>
              {c.libelle}
            </Link>
          ))}
        </div>
      )}

      {/* Type + quartier */}
      <div className="sans-barre -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1">
        <Suspense>
          <FiltreQuartier quartiers={quartiersDe(toutes)} />
        </Suspense>
        {TYPES.map((t) => (
          <Link
            key={t.libelle}
            href={lien({ type: t.valeur })}
            className={`puce ${type === t.valeur ? "puce-active" : "puce-inactive"}`}
          >
            {t.libelle}
          </Link>
        ))}
      </div>

      {(q || filtresActifs) && (
        <p className="mt-3 text-sm text-doux">
          {offres.length} {offres.length > 1 ? "résultats" : "résultat"}
          {q && (
            <>
              {" "}
              pour « <strong className="text-encre">{q}</strong> »
            </>
          )}{" "}
          ·{" "}
          <Link
            href={lien({ quartier: undefined, type: undefined, q: undefined, cuisine: undefined })}
            className="font-semibold text-encre underline decoration-miam decoration-2 underline-offset-2"
          >
            tout effacer
          </Link>
        </p>
      )}

      {visibles.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-3 sm:gap-4">
          {visibles.map((offre, i) => (
            <CarteOffre key={offre.id} offre={offre} index={i} />
          ))}
        </ul>
      ) : (
        <div className="anim-apparition mt-6 rounded-3xl border border-dashed border-miam bg-miam-pale p-8 text-center">
          <Image src="/icon-192.png" alt="" width={88} height={88} className="anim-croque mx-auto rounded-3xl" />
          <p className="titre mt-3 text-2xl">Rien à se mettre sous la dent…</p>
          <p className="mt-1 text-sm text-doux">
            Aucune offre {ephemeres ? "éphémère" : "permanente"} ne correspond pour le moment.
          </p>
          {filtresActifs && (
            <Link
              href={lien({ quartier: undefined, type: undefined, q: undefined, cuisine: undefined })}
              className="bouton mt-4"
            >
              Voir toutes les offres
            </Link>
          )}
        </div>
      )}

      {offres.length > visibles.length && (
        <div className="mt-5 text-center">
          <Link href={lien({ n: String(limite + PAR_PAGE) })} scroll={false} className="bouton">
            Voir plus d&apos;offres ({offres.length - visibles.length})
          </Link>
        </div>
      )}
    </>
  );
}
