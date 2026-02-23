<template>
  <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
    <div class="grid gap-12 lg:gap-16 lg:grid-cols-[1.2fr_1fr] items-center">
      <!-- Hero -->
      <div class="space-y-8">
        <p class="text-xs font-medium uppercase tracking-[0.25em] text-emerald-400/90">
          Projet Développement Fullstack · Nuxt & Supabase
        </p>
        <h1 class="text-4xl font-bold leading-tight tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
          SmartRecipes, ton
          <span class="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            assistant culinaire intelligent
          </span>
          contre le gaspillage.
        </h1>
        <p class="max-w-xl text-base text-slate-400 leading-relaxed">
          Entre les cours, les partiels et les jobs étudiants, tu n'as pas le temps de chercher quoi cuisiner.
          SmartRecipes génère des idées de repas à partir de tes ingrédients, en respectant tes préférences
          alimentaires, et sauvegarde tes meilleures recettes.
        </p>

        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/auth" class="btn-primary">
            Commencer maintenant
          </NuxtLink>
          <NuxtLink to="/dashboard" class="btn-secondary">
            Voir le dashboard
          </NuxtLink>
        </div>

        <ul class="grid gap-2.5 text-sm text-slate-400">
          <li class="flex items-center gap-2">
            <span class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">✓</span>
            Génération de recettes via IA (OpenAI / Mistral).
          </li>
          <li class="flex items-center gap-2">
            <span class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">✓</span>
            Connexion sécurisée via Supabase Auth.
          </li>
          <li class="flex items-center gap-2">
            <span class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">✓</span>
            Sauvegarde de tes recettes, filtrées par utilisateur.
          </li>
        </ul>
      </div>

      <!-- Example card -->
      <div class="card glow-emerald p-6 space-y-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-emerald-400">
          Exemple de génération
        </p>
        <div class="rounded-xl border border-slate-700/80 bg-slate-950/80 p-4 space-y-4">
          <div class="flex gap-3">
            <span class="mt-0.5 shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300">Tu</span>
            <p class="text-sm text-slate-300 leading-relaxed">
              J'ai du riz, deux tomates, un œuf et un reste de poulet. Je peux cuisiner quoi en 20 minutes ?
            </p>
          </div>
          <div class="flex gap-3">
            <span class="mt-0.5 shrink-0 rounded-full bg-sky-500/20 px-2 py-0.5 text-xs font-medium text-sky-300">SmartRecipes</span>
            <p class="text-sm text-slate-300 leading-relaxed">
              Riz sauté express au poulet et tomates, prêt en 18 minutes, avec une seule poêle à laver.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
