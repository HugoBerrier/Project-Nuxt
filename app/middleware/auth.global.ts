import { useSupabaseUser } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  const protectedRoutes = ['/dashboard', '/generation', '/recipes', '/shopping-list']

  if (protectedRoutes.includes(to.path) && !user.value) {
    return navigateTo('/auth')
  }
})
