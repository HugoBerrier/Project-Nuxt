export default defineNuxtRouteMiddleware(async (to) => {
  // Le plugin Supabase est uniquement côté client.
  // On sort immédiatement côté serveur pour éviter l'erreur.
  if (import.meta.server) {
    return
  }

  const nuxtApp = useNuxtApp()
  const supabase: any = (nuxtApp as any).$supabase

  if (!supabase) {
    return
  }

  const { data } = await supabase.auth.getSession()
  const user = data.session?.user ?? null

  const protectedRoutes = ['/dashboard', '/generation', '/recipes']

  if (protectedRoutes.includes(to.path) && !user) {
    return navigateTo('/auth')
  }
})

