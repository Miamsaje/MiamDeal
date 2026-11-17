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
      className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white pb-[env(safe-area-inset-bottom)] sm:static sm:ml-auto sm:border-0 sm:bg-transparent sm:pb-0"
    >
      <ul className="mx-auto flex max-w-2xl sm:gap-1">
        {LIENS.map((l) => (
          <li key={l.href} className="flex-1 sm:flex-none">
            <Link
              href={l.href}
              aria-current={actif(l.href) ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-bold sm:flex-row sm:gap-1.5 sm:rounded-full sm:text-sm ${
                actif(l.href)
                  ? "text-encre sm:bg-encre sm:text-white"
                  : "text-black/50 sm:text-encre sm:hover:bg-miam-fonce"
              }`}
            >
              <span aria-hidden className={`text-xl sm:text-base ${actif(l.href) ? "" : "grayscale sm:grayscale-0"}`}>
                {l.icone}
              </span>
              <span>
                {l.libelle}
                {l.href === "/favoris" && favoris.length > 0 && ` (${favoris.length})`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
