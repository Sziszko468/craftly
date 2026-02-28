// User products composable – fetch, create, delete own products
import { ref } from 'vue'

export interface UserProduct {
  id: string
  creator_id: string
  title: string
  description: string | null
  price: number
  category: string
  condition: string
  stock: number
  tags: string[] | null
  images: string[] | null
  is_featured: boolean
  rating: number
  review_count: number
  created_at: string
}

export interface CreateProductPayload {
  title: string
  description: string
  price: number
  category: string
  condition: string
  stock: number
  tags: string[]
  images: string[]
}

export function useUserProducts() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const products = ref<UserProduct[]>([])
  const isLoading = ref(false)

 async function fetchMyProducts(): Promise<void> {
  isLoading.value = true

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    isLoading.value = false
    return
  }

  const { data, error } = await supabase
    .from('products' as never)
    .select('*')
    .eq('creator_id', session.user.id)
    .order('created_at', { ascending: false })

  if (!error && data) {
    products.value = data as UserProduct[]
  }

  isLoading.value = false
}

async function createProduct(payload: CreateProductPayload): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return false

  isLoading.value = true

  const { error } = await supabase
    .from('products' as never)
    .insert({
      ...payload,
      creator_id: session.user.id,
    } as never)

  isLoading.value = false
  if (error) return false

  await fetchMyProducts()
  return true
}
  // Delete product
  async function deleteProduct(productId: string): Promise<boolean> {
    const { error } = await supabase
      .from('products' as never)
      .delete()
      .eq('id', productId)

    if (!error) {
      products.value = products.value.filter((p) => p.id !== productId)
    }

    return !error
  }

  return {
    products,
    isLoading,
    fetchMyProducts,
    createProduct,
    deleteProduct,
  }
}