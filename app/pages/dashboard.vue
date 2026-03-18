<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const recipesCount = ref<number | null>(null)

const loadRecipesCount = async () => {
  if (!user.value) {
    recipesCount.value = null
    return
  }

  const { count, error } = await supabase
    .from('recipes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.value.id)

  if (!error) {
    recipesCount.value = count ?? 0
  }
}

watchEffect(() => {
  if (user.value) loadRecipesCount()
})

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/auth')
}
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">
          Vue d'ensemble de ton assistant culinaire.
        </p>
      </div>
      <button
        type="button"
        class="btn-secondary self-start sm:self-center"
        @click="logout"
      >
        Se déconnecter
      </button>
    </header>

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Profil -->
      <div class="card p-5 space-y-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/80 text-xl">
          👤
        </div>
        <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Profil</p>
        <p class="font-medium text-slate-100 truncate">
          {{ user?.email }}
        </p>
        <p class="text-xs text-slate-400">
          Utilisateur Supabase
        </p>
      </div>

      <!-- Compteur -->
      <NuxtLink
        to="/recipes"
        class="card-hover group flex flex-col p-5"
      >
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/80 text-xl transition-colors group-hover:bg-emerald-500/20">
          🔢
        </div>
        <p class="mt-3 text-xs font-medium uppercase tracking-wider text-slate-400 group-hover:text-emerald-400">Statistiques</p>
        <p class="mt-1 font-semibold text-slate-100">Recettes sauvegardées</p>
        <p class="mt-2 text-sm text-slate-400">
          <span v-if="recipesCount === null">Chargement…</span>
          <span v-else>{{ recipesCount }} recette{{ recipesCount > 1 ? 's' : '' }}</span>
        </p>
      </NuxtLink>

      <!-- Générer une recette -->
      <NuxtLink
        to="/generation"
        class="card-hover group flex flex-col p-5"
      >
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-xl transition-colors group-hover:bg-emerald-500/30">
          ✨
        </div>
        <p class="mt-3 text-xs font-medium uppercase tracking-wider text-emerald-400">Assistant IA</p>
        <p class="mt-1 font-semibold text-slate-100">Générer une recette</p>
        <p class="mt-2 text-sm text-slate-400">
          À partir des ingrédients disponibles, de tes contraintes et du temps dont tu disposes.
        </p>
      </NuxtLink>

      <!-- Mes recettes -->
      <NuxtLink
        to="/recipes"
        class="card-hover group flex flex-col p-5"
      >
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/80 text-xl transition-colors group-hover:bg-emerald-500/20">
          📖
        </div>
        <p class="mt-3 text-xs font-medium uppercase tracking-wider text-slate-400 group-hover:text-emerald-400">Historique</p>
        <p class="mt-1 font-semibold text-slate-100">Mes recettes sauvegardées</p>
        <p class="mt-2 text-sm text-slate-400">
          Retrouve les recettes générées que tu souhaites refaire.
        </p>
      </NuxtLink>

      <!-- Liste de courses -->
      <NuxtLink
        to="/shopping-list"
        class="card-hover group flex flex-col p-5"
      >
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/80 text-xl transition-colors group-hover:bg-emerald-500/20">
          🧺
        </div>
        <p class="mt-3 text-xs font-medium uppercase tracking-wider text-slate-400 group-hover:text-emerald-400">Organisation</p>
        <p class="mt-1 font-semibold text-slate-100">Liste de courses</p>
        <p class="mt-2 text-sm text-slate-400">
          Prépare ta prochaine recette : ajoute et coche tes achats.
        </p>
      </NuxtLink>
    </div>
  </section>
</template>
