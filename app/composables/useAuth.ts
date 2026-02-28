// Authentication composable – login, register, logout
import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const isLoading = ref(false)
  const authError = ref<string | null>(null)

  // Register with email + password
  async function register(email: string, password: string, name: string): Promise<boolean> {
    isLoading.value = true
    authError.value = null

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    isLoading.value = false

    if (error) {
      authError.value = error.message
      return false
    }

    return true
  }

  // Login with email + password
  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true
    authError.value = null

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    isLoading.value = false

    if (error) {
      authError.value = error.message
      return false
    }

    return true
  }

  // Logout
  async function logout(): Promise<void> {
    await supabase.auth.signOut()
  }

  return {
    user,
    isLoading,
    authError,
    register,
    login,
    logout,
  }
}