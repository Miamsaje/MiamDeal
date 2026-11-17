"use client";

export default function Erreur({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-10 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon-192.png" alt="" className="anim-croque mx-auto h-24 w-24 rounded-3xl" />
      <h1 className="titre mt-4 text-3xl">Le dragon a eu un hoquet</h1>
      <p className="mt-2 text-doux">
        Impossible de charger les offres pour le moment. Réessaie dans un instant.
      </p>
      <button onClick={reset} className="bouton mt-6">
        Réessayer
      </button>
    </div>
  );
}
