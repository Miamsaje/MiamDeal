import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegales() {
  return (
    <article className="flex flex-col gap-4">
      <h1 className="titre text-3xl">Mentions légales</h1>

      <section>
        <h2 className="titre text-xl">Éditeur du site</h2>
        <p>
          MiamDeal — [À COMPLÉTER : nom ou raison sociale, statut juridique]
          <br />
          [À COMPLÉTER : adresse]
          <br />
          Contact : [À COMPLÉTER : e-mail]
          <br />
          Directeur de la publication : [À COMPLÉTER]
        </p>
      </section>

      <section>
        <h2 className="titre text-xl">Hébergement</h2>
        <p>
          Site hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis —
          vercel.com.
          <br />
          Base de données hébergée par Supabase Inc. — supabase.com.
        </p>
      </section>

      <section>
        <h2 className="titre text-xl">Offres présentées</h2>
        <p>
          MiamDeal recense des bons plans proposés par des restaurants à Paris. Les offres sont
          vérifiées par l&apos;équipe à la date indiquée sur chaque fiche, mais elles restent sous
          la seule responsabilité des restaurants, qui peuvent les modifier ou les arrêter à tout
          moment. MiamDeal ne vend rien et n&apos;est pas partie à la relation entre le client et
          le restaurant. Pense à vérifier l&apos;offre auprès du restaurant avant de te déplacer.
        </p>
      </section>

      <section>
        <h2 className="titre text-xl">Propriété intellectuelle</h2>
        <p>
          Le nom MiamDeal, le logo et les contenus du site sont protégés. Les noms et marques des
          restaurants cités appartiennent à leurs propriétaires respectifs. Un restaurant qui
          souhaite corriger ou retirer une fiche peut nous écrire à l&apos;adresse de contact
          ci-dessus.
        </p>
      </section>
    </article>
  );
}
