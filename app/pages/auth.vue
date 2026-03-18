<script setup lang="ts">
import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()
const router = useRouter()
const user = useSupabaseUser()

watchEffect(() => {
  if (user.value) {
    router.replace('/dashboard')
  }
})

const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const error = ref<string | null>(null)
const info = ref<string | null>(null)

const email = ref('')
const password = ref('')
const username = ref('')

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
const passwordHelp =
  'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = null
  info.value = null
}

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
      if (!username.value.trim()) {
        throw new Error("Le nom d'utilisateur est obligatoire.")
      }
      if (!passwordRegex.test(password.value)) {
        throw new Error(passwordHelp)
      }
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          data: {
            username: username.value.trim()
          }
        }
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
    console.error('Erreur Supabase auth', e)
    const message =
      e?.message ||
      e?.error_description ||
      e?.error?.message ||
      (typeof e === 'object' ? JSON.stringify(e) : String(e)) ||
      'Erreur inattendue.'
    error.value = message
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
        <div v-if="mode === 'register'" class="space-y-2">
          <label class="block text-sm font-medium text-slate-300">Nom d'utilisateur</label>
          <input
            v-model="username"
            type="text"
            required
            minlength="3"
            maxlength="24"
            class="input-field"
            placeholder="ex : hugo_berrier"
          />
          <p class="text-xs text-slate-500">
            3–24 caractères. Ce nom s’affichera en haut à droite une fois connecté.
          </p>
        </div>

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
            minlength="8"
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}"
            :title="passwordHelp"
            :autocomplete="mode === 'register' ? 'new-password' : 'current-password'"
            class="input-field"
            placeholder="••••••••"
          />
          <p v-if="mode === 'register'" class="text-xs text-slate-500">
            {{ passwordHelp }}
          </p>
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
        @click="toggleMode"
      >
        {{ mode === 'login' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter' }}
      </button>
    </div>
  </section>
</template>
