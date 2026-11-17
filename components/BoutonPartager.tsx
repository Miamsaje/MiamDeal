"use client";

import { useState } from "react";

export default function BoutonPartager({ titre }: { titre: string }) {
  const [copie, setCopie] = useState(false);

  async function partager() {
    const url = window.location.href.split("?")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title: titre, text: `${titre} — vu sur MiamDeal`, url });
      } catch {
        // partage annulé par l'utilisateur
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {}
  }

  return (
    <button type="button" onClick={partager} className="bouton-discret h-9">
      {copie ? "✓ Lien copié" : "📤 Partager"}
    </button>
  );
}
