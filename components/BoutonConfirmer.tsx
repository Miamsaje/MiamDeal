"use client";

/** Bouton d'envoi de formulaire qui demande confirmation avant une action irréversible. */
export default function BoutonConfirmer({
  message,
  children,
}: {
  message: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className="bouton-discret !border-red-200 !text-red-700 hover:!bg-red-50"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
