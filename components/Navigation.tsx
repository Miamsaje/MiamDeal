"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavoris } from "@/lib/favoris";

const LIENS = [
  { href: "/", icone: "🔥", libelle: "Bons plans" },
  { href: "/restaurants", icone: "🍴", libelle: "Restos" },
  { href: "/favoris", icone: "❤️", libelle: "Favoris" },
];

/** Barre d'onglets en bas de l'écran sur mobile, dans l'en-tête sur grand écran. */
export default function Navigation() {
  const chemin = usePathname();
  const { favoris } = useFavoris();
  if (chemin.startsWith("/admin")) return null;

  const actif = (href: string) =>
    href === "/" ? chemin === "/" || chemin.startsWith("/offres") : chemin.startsWith(href);

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-trait bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:static sm:ml-auto sm:border-0 sm:bg-transparent sm:pb-0 sm:backdrop-blur-none"
    >
      <ul className="mx-auto flex max-w-3xl sm:gap-1">
        {LIENS.map((l) => {
          const estActif = actif(l.href);
          return (
            <li key={l.href} className="flex-1 sm:flex-none">
              <Link
                href={l.href}
                aria-current={estActif ? "page" : undefined}
                className={`group flex flex-col items-center gap-0.5 px-3 pb-2 pt-2.5 text-[11px] font-bold transition sm:flex-row sm:gap-1.5 sm:rounded-full sm:py-2 sm:text-sm ${
                  estActif ? "text-encre sm:bg-miam-clair" : "text-doux hover:text-encre sm:hover:bg-miam-pale"
                }`}
              >
                <span
                  aria-hidden
                  className={`relative flex h-8 w-12 items-center justify-center rounded-full text-xl transition sm:h-auto sm:w-auto sm:text-base ${
                    estActif ? "bg-miam-clair sm:bg-transparent" : "grayscale group-hover:grayscale-0"
                  }`}
                >
                  {l.icone}
                  {l.href === "/favoris" && favoris.length > 0 && (
                    <span
                      key={favoris.length}
                      className="anim-pop absolute -right-0.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-miam px-1 text-[10px] font-extrabold text-encre grayscale-0 sm:-right-3"
                    >
                      {favoris.length}
                    </span>
                  )}
                </span>
                <span>{l.libelle}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
