import Link from "next/link";

export default function Introuvable() {
  return (
    <div className="py-10 text-center">
      <p className="text-5xl">🐉</p>
      <h1 className="mt-3 font-titre text-2xl font-extrabold">Le dragon a tout mangé !</h1>
      <p className="mt-1 text-black/60">
        Cette page n&apos;existe pas, ou l&apos;offre est terminée.
      </p>
      <Link href="/" className="bouton mt-5">
        Voir les offres en cours
      </Link>
    </div>
  );
}
