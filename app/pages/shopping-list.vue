<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(true)
const error = ref<string | null>(null)
const items = ref<any[]>([])

const newItem = ref('')
const saving = ref(false)

const loadItems = async () => {
  if (!user.value) return
  loading.value = true
  error.value = null
  try {
    const { data, error: selectError } = await supabase
      .from('shopping_list_items')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (selectError) throw selectError
    items.value = data ?? []
  } catch (e: any) {
    error.value = e?.message ?? 'Erreur lors du chargement de la liste.'
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  if (user.value) loadItems()
})

const addItem = async () => {
  if (!user.value) return
  const label = newItem.value.trim()
  if (!label) return

  saving.value = true
  error.value = null
  try {
    const { error: insertError } = await (supabase as any)
      .from('shopping_list_items')
      .insert({ user_id: user.value.id, label })
    if (insertError) throw insertError
    newItem.value = ''
    await loadItems()
  } catch (e: any) {
    error.value = e?.message ?? "Impossible d'ajouter l'élément."
  } finally {
    saving.value = false
  }
}

const toggleItem = async (item: any) => {
  if (!user.value) return
  try {
    const { error: updateError } = await (supabase as any)
      .from('shopping_list_items')
      .update({ checked: !item.checked })
      .eq('id', item.id)
      .eq('user_id', user.value.id)
    if (updateError) throw updateError
    item.checked = !item.checked
  } catch (e: any) {
    error.value = e?.message ?? 'Impossible de mettre à jour.'
  }
}

const deleteItem = async (item: any) => {
  if (!user.value) return
  try {
    const { error: deleteError } = await (supabase as any)
      .from('shopping_list_items')
      .delete()
      .eq('id', item.id)
      .eq('user_id', user.value.id)
    if (deleteError) throw deleteError
    items.value = items.value.filter((i) => i.id !== item.id)
  } catch (e: any) {
    error.value = e?.message ?? 'Impossible de supprimer.'
  }
}

const clearChecked = async () => {
  if (!user.value) return
  try {
    const { error: deleteError } = await (supabase as any)
      .from('shopping_list_items')
      .delete()
      .eq('user_id', user.value.id)
      .eq('checked', true)
    if (deleteError) throw deleteError
    items.value = items.value.filter((i) => !i.checked)
  } catch (e: any) {
    error.value = e?.message ?? 'Impossible de nettoyer la liste.'
  }
}
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <header class="mb-10">
      <h1 class="page-title">Liste de courses</h1>
      <p class="page-subtitle">
        Ajoute des ingrédients à acheter et coche-les au fur et à mesure.
      </p>
    </header>

    <div class="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div class="card p-6 space-y-4">
        <label class="block text-sm font-medium text-slate-300">Nouvel élément</label>
        <div class="flex gap-2">
          <input
            v-model="newItem"
            type="text"
            class="input-field"
            placeholder="ex : tomates, riz, œufs…"
            @keydown.enter.prevent="addItem"
          />
          <button type="button" class="btn-primary !px-4" :disabled="saving" @click="addItem">
            Ajouter
          </button>
        </div>

        <p v-if="error" class="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-300">
          {{ error }}
        </p>

        <button
          type="button"
          class="btn-secondary w-full !rounded-xl py-2.5"
          :disabled="!items.some((i) => i.checked)"
          @click="clearChecked"
        >
          Supprimer les éléments cochés
        </button>
      </div>

      <div class="card p-6">
        <div v-if="loading" class="flex flex-col items-center justify-center py-12 text-slate-400">
          <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-400" />
          <p class="mt-3 text-sm">Chargement…</p>
        </div>

        <div v-else-if="!items.length" class="flex flex-col items-center justify-center py-12 text-center text-slate-500">
          <span class="text-5xl opacity-60">🧺</span>
          <p class="mt-3 text-sm">Ta liste est vide. Ajoute ton premier élément à gauche.</p>
        </div>

        <ul v-else class="space-y-2">
          <li
            v-for="item in items"
            :key="item.id"
            class="flex items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-950/50 px-3 py-2"
          >
            <label class="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" class="h-4 w-4 accent-emerald-500" :checked="item.checked" @change="toggleItem(item)" />
              <span :class="item.checked ? 'line-through text-slate-500' : 'text-slate-200'">
                {{ item.label }}
              </span>
            </label>
            <button type="button" class="text-xs text-slate-400 hover:text-red-300" @click="deleteItem(item)">
              Supprimer
            </button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

