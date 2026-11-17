-- =====================================================================
-- MiamDeal — schéma de base de données (à coller dans Supabase > SQL Editor)
-- Peut être relancé sans risque (idempotent).
-- =====================================================================

-- ---------- Profils (auteurs des offres) ----------
-- Un profil est créé automatiquement pour chaque compte Supabase Auth.
-- role = 'admin'       -> équipe MiamDeal (accès à l'espace admin)
-- role = 'utilisateur' -> réservé à la future publication par les membres
create table if not exists public.profils (
  id uuid primary key references auth.users (id) on delete cascade,
  nom_affiche text not null default 'Membre',
  role text not null default 'utilisateur' check (role in ('admin', 'utilisateur')),
  created_at timestamptz not null default now()
);

create or replace function public.creer_profil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profils (id) values (new.id) on conflict do nothing;
  return new;
end $$;

drop trigger if exists a_la_creation_du_compte on auth.users;
create trigger a_la_creation_du_compte
  after insert on auth.users
  for each row execute function public.creer_profil();

create or replace function public.est_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profils where id = auth.uid() and role = 'admin');
$$;

-- ---------- Restaurants ----------
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  type text not null check (type in ('independant', 'chaine')),
  cuisine text,
  quartier text not null,
  adresse text,
  lien_maps text,
  lien_carte text,
  photo_url text,
  archive boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Offres ----------
create table if not exists public.offres (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  categorie text not null check (categorie in ('permanente', 'ephemere')),
  titre text not null,
  description text,
  prix text,
  conditions text,
  date_debut timestamptz,
  date_fin timestamptz,
  verifiee_le date,
  source text,
  statut text not null default 'brouillon'
    check (statut in ('brouillon', 'en_attente', 'publiee', 'archivee')),
  publiee_par uuid references public.profils (id) on delete set null,
  created_at timestamptz not null default now(),
  -- une offre permanente n'a pas de date de fin ; une éphémère en a forcément une
  constraint dates_selon_categorie check (
    (categorie = 'permanente' and date_fin is null)
    or (categorie = 'ephemere' and date_fin is not null)
  )
);

-- offre mise en avant en haut de la liste (« coup de cœur » de l'équipe)
alter table public.offres add column if not exists coup_de_coeur boolean not null default false;

create index if not exists offres_liste_idx on public.offres (statut, categorie, date_fin);
create index if not exists offres_restaurant_idx on public.offres (restaurant_id);

-- ---------- Signalements (un visiteur prévient qu'une offre est fausse ou terminée) ----------
create table if not exists public.signalements (
  id uuid primary key default gen_random_uuid(),
  offre_id uuid not null references public.offres (id) on delete cascade,
  motif text not null check (motif in ('terminee', 'prix', 'erreur', 'autre')),
  message text check (char_length(message) <= 500),
  traite boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists signalements_offre_idx on public.signalements (offre_id);

-- ---------- Sécurité (Row Level Security) ----------
alter table public.signalements enable row level security;
alter table public.profils enable row level security;
alter table public.restaurants enable row level security;
alter table public.offres enable row level security;

-- Profils : lecture publique (nom affiché uniquement, aucune donnée sensible).
-- Personne ne peut modifier son rôle depuis le site : ça se fait en SQL.
drop policy if exists "profils lecture publique" on public.profils;
create policy "profils lecture publique" on public.profils for select using (true);

-- Restaurants : le public voit les restos non archivés, l'équipe voit et modifie tout.
drop policy if exists "restaurants lecture publique" on public.restaurants;
create policy "restaurants lecture publique" on public.restaurants
  for select using (archive = false);
drop policy if exists "restaurants admin" on public.restaurants;
create policy "restaurants admin" on public.restaurants
  for all using (public.est_admin()) with check (public.est_admin());

-- Offres : le public ne voit que les offres publiées et non expirées.
-- => une offre éphémère disparaît toute seule dès que date_fin est passée.
drop policy if exists "offres lecture publique" on public.offres;
create policy "offres lecture publique" on public.offres
  for select using (statut = 'publiee' and (date_fin is null or date_fin > now()));
drop policy if exists "offres admin" on public.offres;
create policy "offres admin" on public.offres
  for all using (public.est_admin()) with check (public.est_admin());

-- Signalements : tout le monde peut en envoyer un, seule l'équipe peut les lire.
drop policy if exists "signalements envoi public" on public.signalements;
create policy "signalements envoi public" on public.signalements
  for insert with check (traite = false);
drop policy if exists "signalements admin" on public.signalements;
create policy "signalements admin" on public.signalements
  for all using (public.est_admin()) with check (public.est_admin());

-- Plus tard (publication par les utilisateurs), il suffira d'ajouter par ex. :
--   create policy "offres proposees par les membres" on public.offres
--     for insert to authenticated
--     with check (publiee_par = auth.uid() and statut = 'en_attente');

-- ---------- Stockage des photos ----------
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "photos envoi admin" on storage.objects;
create policy "photos envoi admin" on storage.objects
  for insert with check (bucket_id = 'photos' and public.est_admin());
drop policy if exists "photos suppression admin" on storage.objects;
create policy "photos suppression admin" on storage.objects
  for delete using (bucket_id = 'photos' and public.est_admin());
