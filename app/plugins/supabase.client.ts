import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string | undefined
  const supabaseAnonKey = config.public.supabaseAnonKey as string | undefined

  const supabase =
    supabaseUrl && supabaseAnonKey
      ? createClient(supabaseUrl, supabaseAnonKey)
      : null

  return {
    provide: {
      supabase
    }
  }
})

