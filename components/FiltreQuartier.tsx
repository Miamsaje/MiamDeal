"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function FiltreQuartier({ quartiers }: { quartiers: string[] }) {
  const router = useRouter();
  const chemin = usePathname();
  const params = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-sm font-semibold">
      <span className="sr-only sm:not-sr-only">Quartier</span>
      <select
        value={params.get("quartier") ?? ""}
        onChange={(e) => {
          const suivants = new URLSearchParams(params);
          if (e.target.value) suivants.set("quartier", e.target.value);
          else suivants.delete("quartier");
          router.push(`${chemin}?${suivants}`, { scroll: false });
        }}
        className="w-full rounded-full border border-black/15 bg-white px-3 py-2 text-sm font-semibold"
      >
        <option value="">📍 Tous les quartiers</option>
        {quartiers.map((q) => (
          <option key={q} value={q}>
            {q}
          </option>
        ))}
      </select>
    </label>
  );
}
