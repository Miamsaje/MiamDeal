"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavAdmin({ signalements }: { signalements: number }) {
  const chemin = usePathname();
  const liens = [
    { href: "/admin", libelle: "Offres", actif: chemin === "/admin" || chemin.startsWith("/admin/offres") },
    { href: "/admin/restaurants", libelle: "Restaurants", actif: chemin.startsWith("/admin/restaurants") },
    {
      href: "/admin/signalements",
      libelle: `Signalements${signalements > 0 ? ` (${signalements})` : ""}`,
      actif: chemin.startsWith("/admin/signalements"),
    },
  ];
  return (
    <nav aria-label="Sections de l'admin" className="mb-4 flex gap-1 overflow-x-auto rounded-full border border-trait bg-white p-1">
      {liens.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={l.actif ? "page" : undefined}
          className={`flex-1 whitespace-nowrap rounded-full px-3 py-2 text-center text-sm font-bold ${
            l.actif ? "bg-miam" : "text-doux hover:bg-miam-pale hover:text-encre"
          }`}
        >
          {l.libelle}
        </Link>
      ))}
    </nav>
  );
}
