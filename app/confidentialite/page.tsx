import type { Metadata } from "next";

export const metadata: Metadata = { title: "Confidentialité" };

export default function Confidentialite() {
  return (
    <article className="flex flex-col gap-4">
      <h1 className="font-titre text-3xl font-extrabold">Politique de confidentialité</h1>

      <section>
        <h2 className="font-titre text-xl font-bold">En bref</h2>
        <p>
          MiamDeal se consulte librement, sans compte. Nous ne te demandons aucune donnée
          personnelle et nous n&apos;utilisons ni publicité ciblée ni traceur de mesure
          d&apos;audience.
        </p>
      </section>

      <section>
        <h2 className="font-titre text-xl font-bold">Données collectées</h2>
        <p>
          Comme tout site web, notre hébergeur (Vercel) traite des données techniques nécessaires
          à l&apos;affichage des pages et à la sécurité du service (adresse IP, type de
          navigateur, pages demandées). Nous n&apos;exploitons pas ces données pour t&apos;identifier.
        </p>
      </section>

      <section>
        <h2 className="font-titre text-xl font-bold">Favoris et signalements</h2>
        <p>
          Tes favoris sont enregistrés uniquement dans ton navigateur : ils ne nous sont jamais
          envoyés et tu peux les effacer en vidant les données du site. Si tu signales une offre,
          nous conservons le motif et le message que tu écris, sans aucune information
          permettant de t&apos;identifier. Évite d&apos;y mettre des données personnelles.
        </p>
      </section>

      <section>
        <h2 className="font-titre text-xl font-bold">Cookies</h2>
        <p>
          Le site public ne dépose aucun cookie. Seul l&apos;espace réservé à l&apos;équipe
          MiamDeal utilise un cookie de session, strictement nécessaire à la connexion.
        </p>
      </section>

      <section>
        <h2 className="font-titre text-xl font-bold">Liens externes</h2>
        <p>
          Les fiches renvoient vers les sites des restaurants et vers Google Maps. Ces sites ont
          leurs propres politiques de confidentialité.
        </p>
      </section>

      <section>
        <h2 className="font-titre text-xl font-bold">Tes droits</h2>
        <p>
          Conformément au RGPD, tu peux nous écrire pour toute question ou demande concernant tes
          données : [À COMPLÉTER : e-mail de contact]. Tu peux aussi adresser une réclamation à la
          CNIL (cnil.fr).
        </p>
      </section>
    </article>
  );
}
