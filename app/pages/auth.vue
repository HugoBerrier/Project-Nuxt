<script setup lang="ts">
const supabase = useSupabaseClientTyped()
const router = useRouter()

const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const error = ref<string | null>(null)
const info = ref<string | null>(null)

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  if (!supabase) {
    error.value = 'Supabase non configuré. Ajoute NUXT_PUBLIC_SUPABASE_URL et NUXT_PUBLIC_SUPABASE_ANON_KEY dans un fichier .env (voir .env.example).'
    return
  }
  loading.value = true
  error.value = null
  info.value = null
  try {
    if (mode.value === 'register') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      })
      if (signUpError) throw signUpError
      // Si la confirmation d'email est activée, il n'y a pas forcément de session tout de suite
      if (!data.session) {
        info.value =
          "Compte créé. Vérifie ta boîte mail et clique sur le lien de validation, puis connecte-toi avec ton email et ton mot de passe."
        mode.value = 'login'
        return
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })
      if (signInError) throw signInError
    }
    await router.push('/dashboard')
  } catch (e: any) {
    error.value = e.message ?? 'Erreur inattendue.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="max-w-md mx-auto px-4 py-16">
    <div class="card p-8 space-y-6">
      <div class="space-y-2 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-2xl">
          🔐
        </div>
        <h1 class="page-title">
          {{ mode === 'login' ? 'Connexion' : 'Création de compte' }}
        </h1>
        <p class="page-subtitle">
          Authentification gérée par Supabase (email + mot de passe).
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-300">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="input-field"
            placeholder="tu@exemple.fr"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-300">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            class="input-field"
            placeholder="••••••••"
          />
        </div>

        <p v-if="error" class="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-300">
          {{ error }}
        </p>
        <p v-if="info" class="rounded-lg bg-emerald-500/10 border border-emerald-500/40 px-3 py-2 text-sm text-emerald-200">
          {{ info }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="btn-primary w-full !rounded-xl py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire" }}
        </button>
      </form>

      <button
        type="button"
        class="w-full text-center text-sm text-slate-400 underline underline-offset-4 transition-colors hover:text-emerald-400"
        @click="mode = mode === 'login' ? 'register' : 'login'"
      >
        {{ mode === 'login' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter' }}
      </button>
    </div>
  </section>
</template>
