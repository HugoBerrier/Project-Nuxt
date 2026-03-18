## SmartRecipes – Assistant Culinaire Intelligent

Application fullstack Nuxt 3 + Supabase pour générer et sauvegarder des recettes à partir des ingrédients disponibles, à destination d&apos;étudiants / jeunes actifs.

### Stack

- **Frontend** : Nuxt (template minimal)
- **Backend** : Supabase (Auth + Postgres + RLS)
- **API externe IA** : Mistral (via SDK `@mistralai/mistralai`)

### Modèle de données (Supabase)

1. `recipes`
   - `id` (uuid, primary key, default `uuid_generate_v4()`)
   - `user_id` (uuid, références `auth.users.id`)
   - `title` (text)
   - `ingredients` (text)
   - `instructions` (text)
   - `created_at` (timestamp with time zone, default `now()`)

2. `preferences` (optionnel)
   - `user_id` (uuid, primary key, références `auth.users.id`)
   - `regime` (text)
   - `allergies` (text)

#### Exemple SQL (à exécuter dans Supabase)

```sql
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  ingredients text not null,
  instructions text not null,
  created_at timestamptz not null default now()
);

alter table public.recipes enable row level security;

create policy "Recettes visibles par leur propriétaire"
  on public.recipes
  for select using (auth.uid() = user_id);

create policy "Recettes insérables par leur propriétaire"
  on public.recipes
  for insert with check (auth.uid() = user_id);
```

### Configuration locales (.env)

Copier `.env.example` en `.env` à la racine du projet puis remplir :

```bash
NUXT_PUBLIC_SUPABASE_URL= https://<id-projet>.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY= <clé-anon-publique>
MISTRAL_API_KEY= <clé-api-mistral>
```

### Installation

```bash
npm install
```

### Lancement en développement

```bash
npm run dev
```

L&apos;application tourne sur `http://localhost:3000`.

### Pages principales

- `/` : page d&apos;accueil (contexte du projet, pitch, CTA)
- `/auth` : login / register via Supabase
- `/dashboard` : tableau de bord utilisateur
- `/generation` : génération de recette via l&apos;API IA
- `/recipes` : liste des recettes sauvegardées
- `/shopping-list` : liste de courses (items par utilisateur)

Les routes `/dashboard`, `/generation`, `/recipes`, `/shopping-list` sont protégées par un middleware qui vérifie la session Supabase.

