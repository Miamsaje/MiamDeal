import { signalerOffre } from "@/app/actions";
import { LIBELLE_MOTIF, type Motif } from "@/lib/types";

const RETOURS: Record<string, { texte: string; ok: boolean }> = {
  ok: { texte: "Merci ! L'équipe va vérifier cette offre. 🐉", ok: true },
  demo: { texte: "Mode démo : le signalement n'a pas été envoyé.", ok: true },
  erreur: { texte: "Oups, l'envoi n'a pas fonctionné. Réessaie dans un instant.", ok: false },
};

export default function Signalement({ offreId, etat }: { offreId: string; etat?: string }) {
  const retour = etat ? RETOURS[etat] : undefined;
  return (
    <section id="signalement" className="mt-4 scroll-mt-20">
      {retour && (
        <p
          role="status"
          className={`rounded-xl p-3 text-sm font-semibold ${
            retour.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {retour.texte}
        </p>
      )}
      {!retour?.ok && (
        <details className="mt-6 rounded-3xl border border-trait bg-white p-4 text-sm">
          <summary className="cursor-pointer font-semibold">
            🚩 Cette offre n&apos;est plus valable ? Dis-le-nous
          </summary>
          <form action={signalerOffre} className="mt-3 flex flex-col gap-2">
            <input type="hidden" name="offre_id" value={offreId} />
            {/* champ piège anti-robots, invisible pour les humains */}
            <input name="site" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            <label className="etiquette">
              Qu&apos;est-ce qui cloche ?
              <select name="motif" className="champ">
                {(Object.keys(LIBELLE_MOTIF) as Motif[]).map((m) => (
                  <option key={m} value={m}>
                    {LIBELLE_MOTIF[m]}
                  </option>
                ))}
              </select>
            </label>
            <label className="etiquette">
              Précision (facultatif)
              <textarea
                name="message"
                rows={2}
                maxLength={500}
                placeholder="Ex. : le menu est passé à 16 €"
                className="champ"
              />
            </label>
            <button className="bouton self-start">Envoyer</button>
          </form>
        </details>
      )}
    </section>
  );
}
