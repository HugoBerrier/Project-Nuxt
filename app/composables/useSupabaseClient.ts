export const useSupabaseClientTyped = () => {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$supabase
}

