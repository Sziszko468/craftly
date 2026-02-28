// Profile composable – fetch and update user profile
import { ref } from 'vue'

export interface Profile {
  id: string
  name: string
  avatar_url: string | null
  bio: string | null
  location: string | null
  created_at: string
}

export function useProfile() {
  const supabase = useSupabaseClient()
  const profile = ref<Profile | null>(null)
  const isLoading = ref(false)

  async function fetchProfile(): Promise<void> {
    isLoading.value = true

    // Get current session directly from supabase
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      isLoading.value = false
      return
    }

    const { data, error } = await supabase
      .from('profiles' as never)
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (!error && data) {
      profile.value = data as Profile
    }

    isLoading.value = false
  }

  async function updateProfile(updates: Partial<Omit<Profile, 'id' | 'created_at'>>): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return false

    isLoading.value = true

    const { error } = await supabase
      .from('profiles' as never)
      .update(updates as never)
      .eq('id', session.user.id)

    isLoading.value = false
    return !error
  }

  return {
    profile,
    isLoading,
    fetchProfile,
    updateProfile,
  }
}