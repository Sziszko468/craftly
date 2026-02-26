// Products filtering, sorting and pagination composable
import { ref, computed } from 'vue'
import type { Product, FilterState, SortOption, PaginatedResponse } from '~/types'
import { PRODUCTS } from '~/data/products'

const PER_PAGE = 6

export function useProducts() {
  const filters = ref<FilterState>({
    category: null,
    minPrice: null,
    maxPrice: null,
    condition: null,
    sort: 'popular',
    search: '',
  })

  const currentPage = ref(1)

  const filteredProducts = computed<Product[]>(() => {
    let result = [...PRODUCTS]

    // Search filter
if (filters.value.search.trim()) {
  const q = filters.value.search.toLowerCase()
  result = result.filter((p) =>
    p.title.en.toLowerCase().includes(q) ||
    p.title.nl.toLowerCase().includes(q) ||
    p.tags.some((t) => t.label.toLowerCase().includes(q))
  )
}

    // Category filter
    if (filters.value.category) {
      result = result.filter((p) => p.category.slug === filters.value.category)
    }

    // Price filter
    if (filters.value.minPrice !== null) {
      result = result.filter((p) => p.price >= filters.value.minPrice!)
    }
    if (filters.value.maxPrice !== null) {
      result = result.filter((p) => p.price <= filters.value.maxPrice!)
    }

    // Condition filter
    if (filters.value.condition) {
      result = result.filter((p) => p.condition === filters.value.condition)
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.value.sort as SortOption) {
        case 'popular':    return b.reviewCount - a.reviewCount
        case 'newest':     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'price-asc':  return a.price - b.price
        case 'price-desc': return b.price - a.price
        case 'rating':     return b.rating - a.rating
        default:           return 0
      }
    })

    return result
  })

  const paginated = computed<PaginatedResponse<Product>>(() => {
    const total = filteredProducts.value.length
    const totalPages = Math.ceil(total / PER_PAGE)
    const start = (currentPage.value - 1) * PER_PAGE
    return {
      data: filteredProducts.value.slice(start, start + PER_PAGE),
      total,
      page: currentPage.value,
      perPage: PER_PAGE,
      totalPages,
    }
  })

  function setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]): void {
    filters.value[key] = value
    currentPage.value = 1
  }

  function resetFilters(): void {
    filters.value = {
      category: null,
      minPrice: null,
      maxPrice: null,
      condition: null,
      sort: 'popular',
      search: '',
    }
    currentPage.value = 1
  }

  function getProductBySlug(slug: string): Product | undefined {
    return PRODUCTS.find((p) => p.slug === slug)
  }

  return {
    filters,
    currentPage,
    filteredProducts,
    paginated,
    setFilter,
    resetFilters,
    getProductBySlug,
  }
}