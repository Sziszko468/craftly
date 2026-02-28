<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCart } from '~/composables/useCart'
import { useFavorites } from '~/composables/useFavorites'
import { useToast } from '~/composables/useToast'
import { useLocale } from '~/composables/useLocale'
import { useProducts } from '~/composables/useProducts'
import type { ShopProduct } from '~/composables/useShopProducts'

const route = useRoute()
const { addToCart, isInCart } = useCart()
const { isFavorited, toggleFavorite } = useFavorites()
const { success, error: toastError } = useToast()
const { t, locale } = useLocale()
const { getProductBySlug } = useProducts()
const supabase = useSupabaseClient()

// Try mock product first, then Supabase
const mockProduct = computed(() => getProductBySlug(route.params.slug as string))
const supabaseProduct = ref<ShopProduct | null>(null)
const isLoading = ref(false)

onMounted(async () => {
  // If not found in mock data, fetch from Supabase by title slug
  if (!mockProduct.value) {
    isLoading.value = true
    const slug = (route.params.slug as string).replace(/-/g, ' ')

    const { data, error } = await supabase
      .from('products' as never)
      .select(`
        *,
        profiles (
          name,
          avatar_url,
          location,
          bio
        )
      `)
      .ilike('title', `%${slug}%`)
      .single()

    if (!error && data) {
      supabaseProduct.value = data as ShopProduct
    }

    isLoading.value = false
  }
})

// Unified product interface
const product = computed(() => mockProduct.value ?? supabaseProduct.value)

useHead(() => ({
  title: product.value
    ? `${mockProduct.value ? mockProduct.value.title.en : (product.value as ShopProduct).title} – Craftly`
    : 'Product – Craftly',
}))

const selectedImage = ref(0)
const quantity = ref(1)
const activeTab = ref<'description' | 'reviews'>('description')

const inCart = computed(() => {
  if (!product.value) return false
  return isInCart(product.value.id)
})

const favorited = computed(() => {
  if (!product.value) return false
  return isFavorited(product.value.id)
})

function getTitle(): string {
  if (!product.value) return ''
  if (mockProduct.value) return t(mockProduct.value.title)
  return (product.value as ShopProduct).title
}

function getDescription(): string {
  if (!product.value) return ''
  if (mockProduct.value) return t(mockProduct.value.description)
  return (product.value as ShopProduct).description ?? ''
}

function getLongDescription(): string {
  if (!product.value) return ''
  if (mockProduct.value) return t(mockProduct.value.longDescription)
  return (product.value as ShopProduct).description ?? ''
}

function getImages(): string[] {
  if (!product.value) return []
  if (mockProduct.value) return mockProduct.value.images
  return (product.value as ShopProduct).images ?? []
}

function getCreatorName(): string {
  if (!product.value) return ''
  if (mockProduct.value) return mockProduct.value.creator.name
  return (product.value as ShopProduct).profiles?.name ?? 'Unknown'
}

function getCreatorAvatar(): string {
  if (!product.value) return ''
  if (mockProduct.value) return mockProduct.value.creator.avatar
  const name = (product.value as ShopProduct).profiles?.name ?? 'U'
  return (product.value as ShopProduct).profiles?.avatar_url
    ?? `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
}

function getCreatorBio(): string {
  if (!product.value) return ''
  if (mockProduct.value) return t(mockProduct.value.creator.bio)
  return ''
}

function handleAddToCart() {
  if (!product.value || inCart.value) return
  if (quantity.value > product.value.stock) {
    toastError(locale.value === 'en'
      ? `Only ${product.value.stock} in stock.`
      : `Nog maar ${product.value.stock} op voorraad.`
    )
    return
  }
  // For mock products use full Product type, for Supabase use minimal cart item
  if (mockProduct.value) {
    addToCart(mockProduct.value, quantity.value)
  } else {
    // Cast Supabase product to cart-compatible format
    addToCart({
      id: product.value.id,
      slug: route.params.slug as string,
      title: { en: getTitle(), nl: getTitle() },
      description: { en: getDescription(), nl: getDescription() },
      longDescription: { en: getLongDescription(), nl: getLongDescription() },
      price: product.value.price,
      currency: 'EUR',
      images: getImages(),
      category: { id: '0', slug: product.value.category, icon: '', label: { en: product.value.category, nl: product.value.category } },
      creator: { id: '0', name: getCreatorName(), avatar: getCreatorAvatar(), bio: { en: '', nl: '' }, location: '', rating: 0, totalSales: 0, joinedYear: 2024, verified: false },
      condition: product.value.condition as 'new' | 'handmade' | 'vintage',
      tags: (product.value.tags ?? []).map((t, i) => ({ id: String(i), label: t })),
      rating: product.value.rating,
      reviewCount: product.value.review_count,
      reviews: [],
      stock: product.value.stock,
      isFeatured: product.value.is_featured,
      createdAt: product.value.created_at,
    }, quantity.value)
  }
  success(locale.value === 'en' ? 'Added to cart!' : 'Toegevoegd aan winkelwagen!')
}

function handleFavorite() {
  if (!product.value) return
  if (mockProduct.value) {
    const added = toggleFavorite(mockProduct.value)
    success(added
      ? (locale.value === 'en' ? 'Added to favorites ♥' : 'Toegevoegd aan favorieten ♥')
      : (locale.value === 'en' ? 'Removed from favorites' : 'Verwijderd uit favorieten')
    )
  }
}
</script>

<template>
  <div class="product-page">
    <div class="container">

      <!-- Loading -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner-lg" />
      </div>

      <!-- Product found -->
      <template v-else-if="product">

        <!-- Breadcrumb -->
        <nav class="breadcrumb animate-fade-up stagger-1">
          <NuxtLink to="/">{{ locale === 'en' ? 'Home' : 'Home' }}</NuxtLink>
          <span>/</span>
          <NuxtLink to="/products">{{ locale === 'en' ? 'Shop' : 'Winkel' }}</NuxtLink>
          <span>/</span>
          <span>{{ getTitle() }}</span>
        </nav>

        <div class="product-grid">

          <!-- Images -->
          <div class="product-images animate-fade-up stagger-2">
            <div class="main-image-wrap">
              <img
                v-if="getImages().length > 0"
                :src="getImages()[selectedImage]"
                :alt="getTitle()"
                class="main-image"
              />
              <div v-else class="main-image-placeholder">
                {{ getTitle().charAt(0) }}
              </div>

              <button
                class="fav-btn"
                :class="{ 'fav-btn--active': favorited }"
                @click="handleFavorite"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>

            <!-- Thumbnails -->
            <div v-if="getImages().length > 1" class="thumbnails">
              <button
                v-for="(img, i) in getImages()"
                :key="i"
                class="thumbnail"
                :class="{ 'thumbnail--active': selectedImage === i }"
                @click="selectedImage = i"
              >
                <img :src="img" :alt="`View ${i + 1}`" />
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="product-info animate-fade-up stagger-3">

            <div class="product-info__top">
              <span class="product-category">{{ product.category }}</span>
              <span v-if="product.is_featured ?? (mockProduct?.isFeatured)" class="featured-badge">
                {{ locale === 'en' ? 'Featured' : 'Uitgelicht' }}
              </span>
            </div>

            <h1 class="product-title">{{ getTitle() }}</h1>

            <!-- Price -->
            <div class="product-price">
              <span class="price">€{{ product.price }}</span>
              <span class="price-note">
                {{ locale === 'en' ? 'Free shipping over €80' : 'Gratis verzending boven €80' }}
              </span>
            </div>

            <p class="product-desc">{{ getDescription() }}</p>

            <!-- Stock -->
            <div
              class="product-stock"
              :class="{ 'product-stock--low': product.stock <= 2 }"
            >
              <span class="stock-dot" />
              <span v-if="product.stock > 5">
                {{ locale === 'en' ? 'In stock' : 'Op voorraad' }}
              </span>
              <span v-else-if="product.stock > 0">
                {{ locale === 'en' ? `Only ${product.stock} left` : `Nog ${product.stock} over` }}
              </span>
              <span v-else>
                {{ locale === 'en' ? 'Out of stock' : 'Uitverkocht' }}
              </span>
            </div>

            <!-- Quantity + Add to cart -->
            <div class="product-actions">
              <div class="qty-input">
                <button
                  class="qty-btn"
                  :disabled="quantity <= 1"
                  @click="quantity = Math.max(1, quantity - 1)"
                >−</button>
                <span class="qty-value">{{ quantity }}</span>
                <button
                  class="qty-btn"
                  :disabled="quantity >= product.stock"
                  @click="quantity = Math.min(product.stock, quantity + 1)"
                >+</button>
              </div>

              <button
                class="add-btn"
                :class="{ 'add-btn--added': inCart }"
                :disabled="product.stock === 0"
                @click="handleAddToCart"
              >
                {{ inCart
                  ? (locale === 'en' ? '✓ In cart' : '✓ In winkelwagen')
                  : (locale === 'en' ? 'Add to cart' : 'Voeg toe aan winkelwagen')
                }}
              </button>
            </div>

            <!-- Tags -->
            <div v-if="(product.tags ?? mockProduct?.tags)?.length" class="product-tags">
              <span
                v-for="(tag, i) in (mockProduct ? mockProduct.tags.map(t => t.label) : product.tags ?? [])"
                :key="i"
                class="tag"
              >
                #{{ tag }}
              </span>
            </div>

            <!-- Creator -->
            <div class="creator-card">
              <img
                :src="getCreatorAvatar()"
                :alt="getCreatorName()"
                class="creator-card__avatar"
              />
              <div class="creator-card__info">
                <div class="creator-card__name">{{ getCreatorName() }}</div>
                <p v-if="getCreatorBio()" class="creator-card__bio">{{ getCreatorBio() }}</p>
              </div>
            </div>

          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs animate-fade-up stagger-4">
          <div class="tab-nav">
            <button
              class="tab-btn"
              :class="{ 'tab-btn--active': activeTab === 'description' }"
              @click="activeTab = 'description'"
            >
              {{ locale === 'en' ? 'Full Description' : 'Volledige Beschrijving' }}
            </button>
            <button
              class="tab-btn"
              :class="{ 'tab-btn--active': activeTab === 'reviews' }"
              @click="activeTab = 'reviews'"
            >
              {{ locale === 'en' ? 'Reviews' : 'Beoordelingen' }}
            </button>
          </div>

          <div class="tab-content">
            <div v-if="activeTab === 'description'" class="tab-panel">
              <p>{{ getLongDescription() }}</p>
            </div>
            <div v-else class="tab-panel">
              <p class="no-reviews">
                {{ locale === 'en' ? 'No reviews yet.' : 'Nog geen beoordelingen.' }}
              </p>
            </div>
          </div>
        </div>

      </template>

      <!-- 404 -->
      <div v-else class="not-found">
        <h1>{{ locale === 'en' ? 'Product not found' : 'Product niet gevonden' }}</h1>
        <NuxtLink to="/products" class="back-link">
          ← {{ locale === 'en' ? 'Back to shop' : 'Terug naar winkel' }}
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-page {
  padding: $space-8 0 $space-20;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: $space-20 0;
}

.spinner-lg {
  width: 40px;
  height: 40px;
  border: 3px solid $color-border;
  border-top-color: $color-blue;
  border-radius: $radius-full;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.breadcrumb {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $text-xs;
  color: $color-text-dim;
  margin-bottom: $space-8;

  a {
    color: $color-text-muted;
    transition: color $duration-fast;
    &:hover { color: $color-text; }
  }

  span:last-child { color: $color-text; }
}

.product-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: $space-12;
  align-items: start;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
}

.main-image-wrap {
  position: relative;
  border-radius: $radius-lg;
  overflow: hidden;
  aspect-ratio: 1;
  background: $color-surface;
  border: 1px solid $color-border;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform $duration-slow $ease-out;
  &:hover { transform: scale(1.03); }
}

.main-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba($color-blue, 0.12), rgba($color-orange, 0.12));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $font-display;
  font-size: 6rem;
  font-weight: 800;
  color: $color-blue-light;
}

.fav-btn {
  position: absolute;
  top: $space-4;
  right: $space-4;
  width: 44px;
  height: 44px;
  border-radius: $radius-full;
  background: rgba($color-bg, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-muted;
  transition: all $duration-fast;

  &:hover { color: $color-text; transform: scale(1.05); }
  &--active { color: $color-orange; }
}

.thumbnails {
  display: flex;
  gap: $space-3;
  margin-top: $space-3;
}

.thumbnail {
  width: 70px;
  height: 70px;
  border-radius: $radius-md;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color $duration-fast;
  flex-shrink: 0;

  img { width: 100%; height: 100%; object-fit: cover; }
  &--active { border-color: $color-blue; }
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: $space-5;

  &__top {
    display: flex;
    align-items: center;
    gap: $space-3;
  }
}

.product-category {
  font-size: $text-xs;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: $color-text-muted;
  font-weight: 500;
}

.featured-badge {
  font-size: $text-xs;
  background: linear-gradient(135deg, rgba($color-blue, 0.15), rgba($color-orange, 0.15));
  color: $color-blue-light;
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  border: 1px solid rgba($color-blue, 0.3);
  font-weight: 600;
}

.product-title {
  font-family: $font-display;
  font-size: $text-3xl;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: $space-4;
}

.price {
  font-family: $font-display;
  font-size: $text-3xl;
  font-weight: 800;
  background: linear-gradient(135deg, $color-blue-light, $color-orange);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.price-note {
  font-size: $text-xs;
  color: $color-text-muted;
}

.product-desc {
  font-size: $text-base;
  color: $color-text-muted;
  line-height: 1.75;
}

.product-stock {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $text-sm;
  color: $color-success;

  &--low { color: $color-error; }
}

.stock-dot {
  width: 8px;
  height: 8px;
  border-radius: $radius-full;
  background: currentColor;
  flex-shrink: 0;
}

.product-actions {
  display: flex;
  gap: $space-4;
  align-items: center;
}

.qty-input {
  display: flex;
  align-items: center;
  border: 1px solid $color-border;
  border-radius: $radius-full;
  overflow: hidden;
}

.qty-btn {
  width: 40px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $text-lg;
  color: $color-text-muted;
  transition: all $duration-fast;

  &:not(:disabled):hover {
    color: $color-text;
    background: $color-surface-2;
  }

  &:disabled { opacity: 0.3; cursor: not-allowed; }
}

.qty-value {
  min-width: 32px;
  text-align: center;
  font-size: $text-sm;
  font-weight: 600;
}

.add-btn {
  flex: 1;
  padding: $space-3 $space-6;
  border-radius: $radius-full;
  background: linear-gradient(135deg, $color-blue, $color-orange);
  color: #fff;
  font-size: $text-sm;
  font-weight: 600;
  min-height: 44px;
  transition: all $duration-fast;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba($color-blue, 0.35);
  }

  &--added {
    background: $color-surface-2;
    color: $color-success;
    border: 1px solid rgba($color-success, 0.4);
  }

  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}

.tag {
  font-size: $text-xs;
  color: $color-text-dim;
  border: 1px solid $color-border;
  border-radius: $radius-full;
  padding: $space-1 $space-3;
  transition: all $duration-fast;

  &:hover {
    color: $color-blue-light;
    border-color: $color-blue;
  }
}

.creator-card {
  display: flex;
  gap: $space-4;
  padding: $space-5;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  transition: border-color $duration-fast;

  &:hover { border-color: $color-blue; }

  &__avatar {
    width: 52px;
    height: 52px;
    border-radius: $radius-full;
    object-fit: cover;
    flex-shrink: 0;
    border: 2px solid $color-border-2;
  }

  &__name {
    font-weight: 600;
    font-size: $text-sm;
  }

  &__bio {
    font-size: $text-sm;
    color: $color-text-muted;
    margin-top: $space-2;
    line-height: 1.6;
  }
}

.tabs { margin-top: $space-16; }

.tab-nav {
  display: flex;
  border-bottom: 1px solid $color-border;
  margin-bottom: $space-8;
}

.tab-btn {
  padding: $space-3 $space-6;
  font-size: $text-sm;
  font-weight: 500;
  color: $color-text-muted;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all $duration-fast;

  &:hover { color: $color-text; }
  &--active { color: $color-text; border-bottom-color: $color-blue; }
}

.tab-content { max-width: 72ch; }

.tab-panel {
  font-size: $text-base;
  color: $color-text-muted;
  line-height: 1.8;
}

.no-reviews {
  color: $color-text-dim;
  font-size: $text-sm;
}

.not-found {
  padding: $space-20 0;
  text-align: center;

  h1 {
    font-family: $font-display;
    font-size: $text-2xl;
    margin-bottom: $space-4;
  }
}

.back-link {
  color: $color-blue;
  font-size: $text-sm;
  transition: opacity $duration-fast;
  &:hover { opacity: 0.8; }
}
</style>