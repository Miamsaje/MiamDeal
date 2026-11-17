"use client";

import { useEffect, useState } from "react";

function texte(ms: number) {
  if (ms <= 0) return "Offre terminée";
  const s = Math.floor(ms / 1000);
  const j = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (j > 0) return `Plus que ${j} j ${h} h`;
  if (h > 0) return `Plus que ${h} h ${String(m).padStart(2, "0")} min`;
  return `Plus que ${m} min ${String(s % 60).padStart(2, "0")} s`;
}

export default function CompteARebours({ fin }: { fin: string }) {
  const cible = new Date(fin).getTime();
  const [maintenant, setMaintenant] = useState(() => Date.now());

  useEffect(() => {
    const minuteur = setInterval(() => setMaintenant(Date.now()), 1000);
    return () => clearInterval(minuteur);
  }, []);

  const reste = cible - maintenant;
  const urgent = reste < 24 * 3600_000;

  return (
    <span
      suppressHydrationWarning
      className={`badge tabular-nums ${
        urgent ? "anim-urgent bg-red-50 text-red-600" : "bg-miam-clair text-encre"
      }`}
    >
      ⏳ {texte(reste)}
    </span>
  );
}
