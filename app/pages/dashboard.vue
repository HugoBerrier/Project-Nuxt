<script setup lang="ts">
const supabase = useSupabaseClientTyped()
const router = useRouter()

const user = ref<any | null>(null)

onMounted(async () => {
  if (!supabase) return
  const { data } = await supabase.auth.getUser()
  user.value = data.user
})

const logout = async () => {
  if (!supabase) return
  await supabase.auth.signOut()
  await router.push('/auth')
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
    </div>
  </section>
</template>
