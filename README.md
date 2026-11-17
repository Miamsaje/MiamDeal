# MiamDeal 🐉

Les bons plans restos à Paris. Site Next.js + Supabase, déployé sur Vercel.

- **Offres permanentes** (menu midi, formule étudiante, happy hour…) et **offres éphémères**
  (avec date de fin : elles disparaissent toutes seules une fois expirées).
- **Recherche**, filtres par quartier et par type, **favoris** (enregistrés sur l'appareil,
  sans compte), bouton **Partager**, liste des restos.
- **Signalement** : un visiteur peut prévenir qu'une offre n'est plus valable.
- **Espace admin** sur `/admin`, réservé à l'équipe : offres, restos, signalements,
  rappel des offres à revérifier (plus de 30 jours), duplication, coup de cœur.

## Étape 1 — Lancer le site sur ton ordinateur (mode démo)

Il te faut [Node.js](https://nodejs.org) version 20 ou plus.

```bash
npm install
```

```bash
npm run dev
```

Ouvre http://localhost:3000. Sans configuration, le site affiche des **offres fictives**
(bandeau « Mode démo ») : pratique pour voir le rendu tout de suite.

## Étape 2 — Créer la base de données Supabase

1. Crée un compte sur https://supabase.com puis un projet (région : Europe, par ex. Paris).
2. Menu **SQL Editor** → colle tout le contenu de `supabase/schema.sql` → **Run**.
   Cela crée les tables `restaurants`, `offres`, `profils`, les règles de sécurité et
   l'espace de stockage des photos.
3. Menu **Authentication → Users → Add user** : crée le compte de l'équipe
   (e-mail + mot de passe, coche « Auto Confirm User »).
4. Retour au **SQL Editor** : ouvre `supabase/admin.sql`, remplace l'e-mail par celui du
   compte créé, puis **Run**. Ce compte devient « Équipe MiamDeal » avec les droits admin.
5. Facultatif : lance `supabase/exemples.sql` pour avoir quelques restos fictifs à tester.
6. Conseillé : **Authentication → Sign In / Providers** → désactive « Allow new users to
   sign up » (il n'y a pas de comptes publics dans cette V1). Même si tu l'oublies, un
   compte créé par un inconnu n'a aucun droit.

## Étape 3 — Relier le site à Supabase

1. Dans Supabase : **Project Settings → API** (ou bouton **Connect**). Note l'**URL du
   projet** et la clé **anon / publishable** (jamais la clé `service_role` / `secret`).
2. Copie le fichier d'exemple puis remplis les deux valeurs :

```bash
cp .env.example .env.local
```

3. Relance `npm run dev`. Le bandeau « Mode démo » disparaît.
4. Va sur http://localhost:3000/admin, connecte-toi, ajoute un restaurant puis une offre
   avec le statut **Publiée** : elle apparaît sur l'accueil.

## Étape 4 — Mettre en ligne sur Vercel

1. Mets le code sur GitHub (crée un dépôt vide sur github.com, puis) :

```bash
git init && git add . && git commit -m "MiamDeal V1"
```

```bash
git remote add origin https://github.com/TON-COMPTE/miamdeal.git && git push -u origin main
```

2. Sur https://vercel.com : **Add New → Project** → importe le dépôt `miamdeal`.
3. Avant de cliquer sur Deploy, ouvre **Environment Variables** et ajoute les deux mêmes
   variables que dans `.env.local` :
   `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   Quand tu auras ton nom de domaine, ajoute aussi `NEXT_PUBLIC_SITE_URL`
   (ex. `https://miamdeal.fr`) : il sert au sitemap et aux aperçus de partage.
4. **Deploy**. Le site est en ligne sur une adresse `…vercel.app`.
   Ensuite, chaque `git push` met le site à jour automatiquement.
5. Nom de domaine (optionnel) : Vercel → projet → **Settings → Domains**.

## À personnaliser

- **Logo** : `public/logo.png` (en-tête), `public/dragon.png` (bannière d'accueil),
  `app/icon.png` et `app/apple-icon.png` (icône d'onglet et d'iPhone),
  `public/icon-*.png` (application installée) et `assets/logo-og.png` (image de partage).
- **Couleurs** : en haut de `app/globals.css` (`--color-miam` = jaune vif,
  `--color-miam-clair` = jaune clair, `--color-encre` = brun du logo).
- **Typo** : les titres utilisent Archivo extra-gras italique (gratuite, Google Fonts),
  proche de la typo fournie. Pour la vraie typo, si tu as acheté la licence web :
  dépose ses fichiers `.woff2` dans `app/fonts/` et remplace `Archivo(...)` dans
  `app/layout.tsx` par `localFont({ src: "./fonts/ta-typo.woff2", variable: "--font-titre" })`
  (import : `import localFont from "next/font/local"`).
- **Icônes de cuisine** : `lib/cuisines.ts` (emoji + mots-clés reconnus dans le champ
  « cuisine » du resto).
- **Mentions légales et confidentialité** : complète les passages `[À COMPLÉTER]` dans
  `app/mentions-legales/page.tsx` et `app/confidentialite/page.tsx`.

## Mettre à jour la base plus tard

`supabase/schema.sql` peut être relancé à tout moment sans rien casser : si une nouvelle
version du site ajoute une table ou une colonne, recolle-le dans le SQL Editor et **Run**.

## Vérifier que tout va bien

```bash
npm run lint
```

```bash
npm test
```

```bash
npm run build
```

## Comment ça marche

| Besoin | Où |
| --- | --- |
| Pages publiques | `app/page.tsx`, `app/offres/[id]`, `app/restaurants/[id]` |
| Lecture des données | `lib/donnees.ts` |
| Favoris, partage, signalement | `lib/favoris.ts`, `components/`, `app/actions.ts` |
| Référencement | `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, image de partage dans `app/offres/[id]/opengraph-image.tsx` |
| Espace admin | `app/admin/` (actions dans `app/admin/actions.ts`) |
| Base de données et sécurité | `supabase/schema.sql` |

- **Statuts d'une offre** : brouillon, en attente, publiée, archivée. Seules les offres
  publiées et non expirées sont visibles ; c'est la base de données elle-même qui
  l'impose (RLS), pas seulement le site.
- **Auteur** : chaque offre garde son auteur (`publiee_par`). Le statut « en attente » et
  le rôle « utilisateur » de la table `profils` sont déjà là pour ouvrir plus tard la
  publication aux membres avec modération.
- **Signalements** : envoyés sans compte, visibles uniquement par l'équipe. Il n'y a pas
  de limite anti-abus en V1 (seulement un champ piège contre les robots) ; à surveiller.
- **Dates** : saisies et affichées à l'heure de Paris.
