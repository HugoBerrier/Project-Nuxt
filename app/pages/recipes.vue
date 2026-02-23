<script setup lang="ts">
const supabase = useSupabaseClientTyped()

const loading = ref(true)
const error = ref<string | null>(null)
const recipes = ref<any[]>([])

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    if (!supabase) {
      error.value = 'Supabase non configuré. Configure .env (voir .env.example).'
    } else {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user
      if (!user) {
        throw new Error('Session expirée, reconnecte-toi.')
      }

      const { data, error: selectError } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (selectError) throw selectError
      recipes.value = data ?? []
    }
  } catch (e: any) {
    error.value = e.message ?? 'Erreur lors du chargement des recettes.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <header class="mb-10">
      <h1 class="page-title">Mes recettes</h1>
      <p class="page-subtitle">
        Recettes générées et sauvegardées, filtrées par utilisateur via Row Level Security Supabase.
      </p>
    </header>

    <div v-if="loading" class="flex flex-col items-center justify-center py-16 text-slate-400">
      <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-400" />
      <p class="mt-3 text-sm">Chargement des recettes...</p>
    </div>

    <div v-else-if="error" class="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
      {{ error }}
    </div>

    <div v-else-if="!recipes.length" class="card flex flex-col items-center justify-center py-16 px-6 text-center">
      <span class="text-5xl opacity-60">📖</span>
      <h2 class="mt-4 text-lg font-semibold text-slate-200">Aucune recette</h2>
      <p class="mt-2 max-w-sm text-sm text-slate-400">
        Génère une recette depuis l'onglet « Génération » et sauvegarde-la pour la retrouver ici.
      </p>
      <NuxtLink to="/generation" class="btn-primary mt-6">
        Générer une recette
      </NuxtLink>
    </div>

    <div v-else class="grid gap-5 sm:grid-cols-2">
      <article
        v-for="recipe in recipes"
        :key="recipe.id"
        class="card p-5 space-y-4 transition-all duration-300 hover:border-emerald-500/30"
      >
        <header>
          <h2 class="font-semibold text-lg text-slate-50 leading-tight">
            {{ recipe.title }}
          </h2>
          <p class="mt-1 text-xs text-slate-500">
            {{ new Date(recipe.created_at).toLocaleDateString('fr-FR', { dateStyle: 'medium' }) }}
          </p>
        </header>
        <div class="space-y-3 text-sm">
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Ingrédients</p>
            <p class="whitespace-pre-line text-slate-300 leading-relaxed">
              {{ recipe.ingredients }}
            </p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Étapes</p>
            <p class="whitespace-pre-line text-slate-300 leading-relaxed">
              {{ recipe.instructions }}
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
