<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const ingredients = ref('')
const constraints = ref('')
const preferences = ref('')

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const result = ref<{ title: string; ingredients: string; instructions: string } | null>(null)

const generateRecipe = async () => {
  loading.value = true
  error.value = null
  success.value = null
  result.value = null

  try {
    if (!user.value) {
      throw new Error('Tu dois être connecté pour générer une recette.')
    }

    const { data, error: apiError } = await useFetch('/api/generate-recipe', {
      method: 'POST',
      body: {
        ingredients: ingredients.value,
        constraints: constraints.value,
        preferences: preferences.value
      }
    })

    if (apiError.value) {
      throw apiError.value
    }

    result.value = data.value as any
  } catch (e: any) {
    error.value = e.message ?? e.data?.message ?? 'Erreur lors de la génération de la recette.'
  } finally {
    loading.value = false
  }
}

const saveRecipe = async () => {
  if (!result.value || !supabase) return
  success.value = null
  if (!user.value) {
    error.value = 'Session expirée, merci de te reconnecter.'
    return
  }

  const payload = {
    user_id: user.value.id,
    title: result.value.title,
    ingredients: result.value.ingredients,
    instructions: result.value.instructions
  }

  const { error: insertError } = await (supabase as any).from('recipes').insert(payload)

  if (insertError) {
    error.value = insertError.message
  } else {
    error.value = null
    success.value = 'Recette sauvegardée dans “Mes recettes”.'
  }
}
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <header class="mb-10">
      <h1 class="page-title">Génération de recette</h1>
      <p class="page-subtitle">
        L'IA adapte la recette à partir de tes ingrédients et préférences.
      </p>
    </header>

    <div class="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <!-- Formulaire -->
      <div class="card p-6 space-y-5">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-300">Ingrédients disponibles</label>
          <textarea
            v-model="ingredients"
            rows="4"
            class="input-field resize-y min-h-[100px]"
            placeholder="ex : riz, œufs, tomates, poulet, oignon..."
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-300">Contraintes (temps, matériel…)</label>
          <textarea
            v-model="constraints"
            rows="2"
            class="input-field"
            placeholder="ex : max 20 minutes, une seule poêle..."
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-300">Préférences / régime</label>
          <textarea
            v-model="preferences"
            rows="2"
            class="input-field"
            placeholder="ex : halal, éviter les produits laitiers..."
          />
        </div>

        <div v-if="error" class="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-300">
          {{ error }}
        </div>
        <div
          v-if="success"
          class="rounded-lg bg-emerald-500/10 border border-emerald-500/40 px-3 py-2 text-sm text-emerald-200"
        >
          {{ success }}
        </div>

        <button
          type="button"
          class="btn-primary w-full !rounded-xl py-3 disabled:opacity-50"
          :disabled="loading"
          @click="generateRecipe"
        >
          <span v-if="loading" class="inline-flex items-center gap-2">
            <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
            Génération en cours...
          </span>
          <span v-else>Générer une recette</span>
        </button>
      </div>

      <!-- Résultat -->
      <div class="card p-6 space-y-4 min-h-[320px]">
        <p class="text-xs font-semibold uppercase tracking-wider text-emerald-400">
          Résultat
        </p>

        <div v-if="!result" class="flex flex-col items-center justify-center flex-1 py-12 text-center text-slate-500">
          <span class="text-4xl opacity-50">✨</span>
          <p class="mt-3 text-sm">
            La recette générée apparaîtra ici.
          </p>
        </div>

        <div v-else class="space-y-4">
          <h2 class="text-xl font-bold text-emerald-300 leading-tight">
            {{ result.title }}
          </h2>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Ingrédients</p>
            <p class="text-sm whitespace-pre-line text-slate-300 leading-relaxed">
              {{ result.ingredients }}
            </p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Étapes</p>
            <p class="text-sm whitespace-pre-line text-slate-300 leading-relaxed">
              {{ result.instructions }}
            </p>
          </div>
          <button
            type="button"
            class="btn-secondary w-full !rounded-xl py-2.5"
            @click="saveRecipe"
          >
            Sauvegarder cette recette
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
