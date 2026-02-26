// ============================================================
// CRAFTLY – Core TypeScript Types & Interfaces
// ============================================================

export interface Creator {
  id: string
  name: string
  avatar: string
  bio: LocalizedString
  location: string
  rating: number
  totalSales: number
  joinedYear: number
  verified: boolean
}

export interface ProductCategory {
  id: string
  label: LocalizedString
  icon: string
  slug: string
}

export type ProductCondition = 'new' | 'handmade' | 'vintage'
export type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating'
// Supported locales
export type Locale = 'en' | 'nl'

// Localized string helper – avoids noUncheckedIndexedAccess issues
export interface LocalizedString {
  en: string
  nl: string
}

export interface ProductTag {
  id: string
  label: string
}

export interface ProductReview {
  id: string
  authorName: string
  authorAvatar: string
  rating: number
  comment: string
  date: string
}

export interface Product {
  id: string
  slug: string
  title: LocalizedString
  description: LocalizedString
  longDescription: LocalizedString
  price: number
  currency: string
  images: string[]
  category: ProductCategory
  creator: Creator
  condition: ProductCondition
  tags: ProductTag[]
  rating: number
  reviewCount: number
  reviews: ProductReview[]
  stock: number
  isFeatured: boolean
  isFavorited: boolean
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface FilterState {
  category: string | null
  minPrice: number | null
  maxPrice: number | null
  condition: ProductCondition | null
  sort: SortOption
  search: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
}