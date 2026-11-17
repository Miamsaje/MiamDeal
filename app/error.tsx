"use client";

export default function Erreur({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-10 text-center">
      <p className="text-5xl">🐉💨</p>
      <h1 className="mt-3 font-titre text-2xl font-extrabold">Le dragon a eu un hoquet</h1>
      <p className="mt-1 text-black/60">
        Impossible de charger les offres pour le moment. Réessaie dans un instant.
      </p>
      <button onClick={reset} className="bouton mt-5">
        Réessayer
      </button>
    </div>
  );
}
