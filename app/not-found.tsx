import Image from "next/image";
import Link from "next/link";

export default function Introuvable() {
  return (
    <div className="anim-apparition py-10 text-center">
      <Image src="/dragon.png" alt="" width={640} height={368} className="anim-croque mx-auto w-56" />
      <h1 className="titre mt-4 text-3xl">Le dragon a tout mangé !</h1>
      <p className="mt-2 text-doux">Cette page n&apos;existe pas, ou l&apos;offre est terminée.</p>
      <Link href="/" className="bouton mt-6">
        Voir les offres en cours
      </Link>
    </div>
  );
}
