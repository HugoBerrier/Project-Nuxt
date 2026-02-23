<script setup lang="ts">
const { $supabase } = useNuxtApp()
const needsSupabaseConfig = computed(() => $supabase === null)
const route = useRoute()

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/generation', label: 'Générer' },
  { to: '/recipes', label: 'Mes recettes' }
]
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col bg-mesh">
    <!-- Banner config -->
    <div
      v-if="needsSupabaseConfig"
      class="bg-amber-500/15 border-b border-amber-500/40 text-amber-200 text-center py-2.5 px-4 text-sm"
    >
      Configure Supabase : crée un fichier <code class="bg-slate-800/80 px-1.5 py-0.5 rounded text-amber-100">.env</code> avec
      <code class="bg-slate-800/80 px-1.5 py-0.5 rounded text-amber-100">NUXT_PUBLIC_SUPABASE_URL</code> et
      <code class="bg-slate-800/80 px-1.5 py-0.5 rounded text-amber-100">NUXT_PUBLIC_SUPABASE_ANON_KEY</code> (voir <code class="bg-slate-800/80 px-1.5 py-0.5 rounded text-amber-100">.env.example</code>).
    </div>

    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <nav class="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        <NuxtLink
          to="/"
          class="flex items-center gap-2.5 font-semibold tracking-tight text-slate-50 transition-opacity hover:opacity-90"
        >
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-lg shadow-lg shadow-emerald-500/25">
            🍽️
          </span>
          <span class="text-lg">SmartRecipes</span>
        </NuxtLink>

        <div class="flex items-center gap-1 sm:gap-2">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/80 hover:text-emerald-300"
            :class="{ 'text-emerald-400 bg-slate-800/60': route.path === link.to }"
          >
            {{ link.label }}
          </NuxtLink>
          <NuxtLink
            to="/auth"
            class="btn-secondary ml-2 !py-2 !px-4 text-xs sm:text-sm"
          >
            Connexion
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main class="flex-1">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </main>

    <footer class="border-t border-slate-800/80 bg-slate-900/50 backdrop-blur-sm">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
        <span>SmartRecipes – Projet Développement Fullstack</span>
        <span class="flex items-center gap-1.5">
          <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
          Nuxt · Supabase · IA
        </span>
      </div>
    </footer>
  </div>
</template>
