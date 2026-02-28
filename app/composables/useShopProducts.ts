// Shop products composable – fetch all products from Supabase
import { ref, computed } from 'vue'
import type { UserProduct } from '~/composables/useUserProducts'

export type ShopProduct = UserProduct & {
  profiles: {
    name: string
    avatar_url: string | null
    location: string | null
  } | null
}

export function useShopProducts() {
  const supabase = useSupabaseClient()
  const products = ref<ShopProduct[]>([])
  const isLoading = ref(false)
  const searchQuery = ref('')
  const selectedCategory = ref<string | null>(null)
  const selectedSort = ref<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest')

  async function fetchProducts(): Promise<void> {
    isLoading.value = true

    const { data, error } = await supabase
      .from('products' as never)
      .select(`
        *,
        profiles (
          name,
          avatar_url,
          location
        )
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      products.value = data as ShopProduct[]
    }

    isLoading.value = false
  }

  const filteredProducts = computed(() => {
    let result = [...products.value]

    // Search
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      )
    }

    // Category
    if (selectedCategory.value) {
      result = result.filter((p) => p.category === selectedCategory.value)
    }

    // Sort
    switch (selectedSort.value) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        result.sort((a, b) => b.review_count - a.review_count)
        break
    }

    return result
  })

  return {
    products,
    filteredProducts,
    isLoading,
    searchQuery,
    selectedCategory,
    selectedSort,
    fetchProducts,
  }
}