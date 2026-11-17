-- À lancer APRÈS avoir créé le compte dans Supabase > Authentication > Users.
-- Remplace l'e-mail par celui du membre de l'équipe.
update public.profils
set role = 'admin', nom_affiche = 'Équipe MiamDeal'
where id = (select id from auth.users where email = 'toi@exemple.fr');
