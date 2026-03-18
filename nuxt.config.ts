// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    mistralApiKey: process.env.MISTRAL_API_KEY,
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
    }
  },
  supabase: {
    redirect: false
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
