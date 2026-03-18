-- Schéma Supabase pour SmartRecipes
-- À exécuter dans l'onglet SQL de ton projet Supabase.

-- 1) Table des recettes
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  ingredients text not null,
  instructions text not null,
  created_at timestamptz not null default now()
);

alter table public.recipes enable row level security;

-- On supprime les policies existantes si jamais le script est relancé
drop policy if exists "Recettes visibles par leur propriétaire" on public.recipes;
drop policy if exists "Recettes insérables par leur propriétaire" on public.recipes;

-- L'utilisateur ne voit que ses propres recettes
create policy "Recettes visibles par leur propriétaire"
  on public.recipes
  for select
  using (auth.uid() = user_id);

-- L'utilisateur ne peut insérer que des recettes à son nom
create policy "Recettes insérables par leur propriétaire"
  on public.recipes
  for insert
  with check (auth.uid() = user_id);


-- 2) Table des préférences utilisateur (optionnelle mais recommandée)
create table if not exists public.preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  regime text null,     -- ex : 'vegan', 'halal', 'sans lactose'
  allergies text null,  -- ex : 'arachides, gluten'
  updated_at timestamptz not null default now()
);

alter table public.preferences enable row level security;

drop policy if exists "Préférences visibles par leur propriétaire" on public.preferences;
drop policy if exists "Préférences modifiables par leur propriétaire" on public.preferences;
drop policy if exists "Préférences updatables par leur propriétaire" on public.preferences;

create policy "Préférences visibles par leur propriétaire"
  on public.preferences
  for select
  using (auth.uid() = user_id);

create policy "Préférences modifiables par leur propriétaire"
  on public.preferences
  for insert
  with check (auth.uid() = user_id);

create policy "Préférences updatables par leur propriétaire"
  on public.preferences
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 3) Liste de courses (items)
create table if not exists public.shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  checked boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.shopping_list_items enable row level security;

drop policy if exists "Courses visibles par leur propriétaire" on public.shopping_list_items;
drop policy if exists "Courses insérables par leur propriétaire" on public.shopping_list_items;
drop policy if exists "Courses modifiables par leur propriétaire" on public.shopping_list_items;
drop policy if exists "Courses supprimables par leur propriétaire" on public.shopping_list_items;

create policy "Courses visibles par leur propriétaire"
  on public.shopping_list_items
  for select
  using (auth.uid() = user_id);

create policy "Courses insérables par leur propriétaire"
  on public.shopping_list_items
  for insert
  with check (auth.uid() = user_id);

create policy "Courses modifiables par leur propriétaire"
  on public.shopping_list_items
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Courses supprimables par leur propriétaire"
  on public.shopping_list_items
  for delete
  using (auth.uid() = user_id);

