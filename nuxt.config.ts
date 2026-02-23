// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
    }
  },
  app: {
    head: {
      title: 'SmartRecipes – Assistant Culinaire Intelligent',
      meta: [
        {
          name: 'description',
          content:
            'SmartRecipes aide les étudiants et jeunes actifs à cuisiner malin à partir de leurs ingrédients, sans gaspillage.'
        }
      ]
    }
  }
})
