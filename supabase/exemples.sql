-- Facultatif : quelques restaurants et offres FICTIFS pour essayer le site.
-- À lancer après schema.sql. Pour tout effacer ensuite :
--   delete from public.restaurants where adresse like '%(exemple)';
with r as (
  insert into public.restaurants (nom, type, cuisine, quartier, adresse, lien_carte) values
    ('Chez Dragonnet', 'independant', 'Bistrot', 'Oberkampf', '12 rue Exemple, 75011 Paris (exemple)', 'https://example.com/carte'),
    ('Bao Bao Club', 'independant', 'Taïwanais', 'Belleville', '3 rue Fictive, 75020 Paris (exemple)', 'https://example.com/carte'),
    ('Burger Flamme', 'chaine', 'Burgers', 'Châtelet', '8 boulevard Imaginaire, 75001 Paris (exemple)', 'https://example.com/carte')
  returning id, nom
)
insert into public.offres
  (restaurant_id, categorie, titre, description, prix, conditions, date_debut, date_fin, verifiee_le, source, statut)
select r.id, o.categorie, o.titre, o.description, o.prix, o.conditions,
       case when o.jours is not null then now() end,
       now() + make_interval(days => o.jours),
       current_date, 'Exemple', 'publiee'
from r
join (values
  ('Chez Dragonnet', 'permanente', 'Menu midi entrée + plat + café', 'Le menu du jour change chaque matin.', '14,90 €', 'Du lundi au vendredi, 12h–14h30.', null::int),
  ('Bao Bao Club', 'permanente', 'Formule étudiante : 2 baos + boisson', 'Deux baos au choix et une boisson maison.', '8,50 €', 'Sur présentation de la carte étudiante.', null),
  ('Burger Flamme', 'permanente', 'Happy hour : frites offertes', 'Une portion de frites offerte pour tout burger acheté.', 'Gratuit', 'Tous les jours de 15h à 18h.', null),
  ('Burger Flamme', 'ephemere', '1 burger acheté = 1 offert', 'Pour fêter la nouvelle recette.', '1+1', 'Le moins cher des deux est offert.', 3),
  ('Bao Bao Club', 'ephemere', '-30 % sur toute la carte', 'Semaine anniversaire.', '-30 %', 'Sur place et à emporter.', 7)
) as o (resto, categorie, titre, description, prix, conditions, jours) on o.resto = r.nom;
