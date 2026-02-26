// Favorites composable
import { ref, computed } from 'vue'
import type { Product } from '~/types'

const favoriteIds = ref<Set<string>>(new Set())

export function useFavorites() {
  const favoriteCount = computed(() => favoriteIds.value.size)

  function isFavorited(productId: string): boolean {
    return favoriteIds.value.has(productId)
  }

  // Returns true if added, false if removed
  function toggleFavorite(product: Product): boolean {
    if (favoriteIds.value.has(product.id)) {
      favoriteIds.value.delete(product.id)
      return false
    }
    favoriteIds.value.add(product.id)
    return true
  }

  return { favoriteIds, favoriteCount, isFavorited, toggleFavorite }
}