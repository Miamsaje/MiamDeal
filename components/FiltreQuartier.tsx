"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function FiltreQuartier({ quartiers }: { quartiers: string[] }) {
  const router = useRouter();
  const chemin = usePathname();
  const params = useSearchParams();
  const valeur = params.get("quartier") ?? "";

  return (
    <label className="relative block shrink-0">
      <span className="sr-only">Quartier</span>
      <select
        value={valeur}
        onChange={(e) => {
          const suivants = new URLSearchParams(params);
          if (e.target.value) suivants.set("quartier", e.target.value);
          else suivants.delete("quartier");
          suivants.delete("n");
          router.push(`${chemin}?${suivants}`, { scroll: false });
        }}
        className={`puce appearance-none pr-8 ${valeur ? "puce-active" : "puce-inactive"}`}
      >
        <option value="">📍 Tous les quartiers</option>
        {quartiers.map((q) => (
          <option key={q} value={q}>
            📍 {q}
          </option>
        ))}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">
        ▾
      </span>
    </label>
  );
}
