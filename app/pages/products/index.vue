<script setup lang="ts">
import { onMounted } from 'vue'
import { useShopProducts } from '~/composables/useShopProducts'
import { useLocale } from '~/composables/useLocale'
import { CATEGORIES } from '~/data/products'

useHead({ title: 'Shop – Craftly' })

const { locale } = useLocale()
const {
  filteredProducts,
  isLoading,
  searchQuery,
  selectedCategory,
  selectedSort,
  fetchProducts,
} = useShopProducts()

const route = useRoute()

onMounted(async () => {
  await fetchProducts()
  if (route.query.category) {
    selectedCategory.value = route.query.category as string
  }
})

const sortOptions = [
  { value: 'newest',     label: { en: 'Newest',             nl: 'Nieuwste'           } },
  { value: 'popular',    label: { en: 'Most Popular',       nl: 'Meest Populair'     } },
  { value: 'price-asc',  label: { en: 'Price: Low to High', nl: 'Prijs: Laag → Hoog' } },
  { value: 'price-desc', label: { en: 'Price: High to Low', nl: 'Prijs: Hoog → Laag' } },
]

const allCategories = CATEGORIES
</script>

<template>
  <div class="shop-page">
    <div class="container">

      <!-- Header -->
      <header class="page-header animate-fade-up stagger-1">
        <h1 class="page-title">
          {{ locale === 'en' ? 'Shop' : 'Winkel' }}
        </h1>
        <p class="page-desc">
          {{ filteredProducts.length }}
          {{ locale === 'en' ? 'products available' : 'producten beschikbaar' }}
        </p>
      </header>

      <!-- Toolbar -->
      <div class="toolbar animate-fade-up stagger-2">
        <div class="search-wrap">
          <svg class="search-wrap__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="locale === 'en' ? 'Search products...' : 'Producten zoeken...'"
          />
        </div>

        <select v-model="selectedSort" class="sort-select">
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
            {{ locale === 'en' ? opt.label.en : opt.label.nl }}
          </option>
        </select>
      </div>

      <!-- Categories -->
      <div class="categories animate-fade-up stagger-3">
        <button
          class="cat-chip"
          :class="{ 'cat-chip--active': selectedCategory === null }"
          @click="selectedCategory = null"
        >
          {{ locale === 'en' ? 'All' : 'Alles' }}
        </button>
        <button
          v-for="cat in allCategories"
          :key="cat.id"
          class="cat-chip"
          :class="{ 'cat-chip--active': selectedCategory === cat.slug }"
          @click="selectedCategory = cat.slug"
        >
          {{ cat.icon }} {{ locale === 'en' ? cat.label.en : cat.label.nl }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner-lg" />
      </div>

      <!-- Products grid -->
      <div v-else-if="filteredProducts.length > 0" class="products-grid animate-fade-up stagger-4">
        <div
          v-for="(product, i) in filteredProducts"
          :key="product.id"
          class="shop-card animate-fade-up"
          :class="`stagger-${(i % 6) + 1}`"
          @click="navigateTo(`/products/${product.id}`)"
        >
          <!-- Image -->
          <div class="shop-card__image-wrap">
            <img
              v-if="product.images && product.images.length > 0"
              :src="product.images[0]"
              :alt="product.title"
              class="shop-card__image"
            />
            <div v-else class="shop-card__image-placeholder">
              {{ product.title.charAt(0) }}
            </div>
            <span class="shop-card__category-badge">
              {{ product.category }}
            </span>
          </div>

          <!-- Body -->
          <div class="shop-card__body">
            <p class="shop-card__title">{{ product.title }}</p>
            <p v-if="product.description" class="shop-card__desc">
              {{ product.description.slice(0, 80) }}{{ product.description.length > 80 ? '...' : '' }}
            </p>

            <!-- Creator -->
            <div v-if="product.profiles" class="shop-card__creator">
              <img
                :src="product.profiles.avatar_url ?? `https://api.dicebear.com/7.x/initials/svg?seed=${product.profiles.name}`"
                :alt="product.profiles.name"
                class="shop-card__creator-avatar"
              />
              <span>{{ product.profiles.name }}</span>
            </div>

            <div class="shop-card__footer">
              <span class="shop-card__price">€{{ product.price }}</span>
              <span
                class="shop-card__stock"
                :class="{ 'shop-card__stock--low': product.stock <= 2 }"
              >
                {{ product.stock <= 2
                  ? (locale === 'en' ? `Only ${product.stock} left` : `Nog ${product.stock} over`)
                  : (locale === 'en' ? 'In stock' : 'Op voorraad')
                }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="empty-state animate-fade-in">
        <span>🔍</span>
        <h3>{{ locale === 'en' ? 'No products found' : 'Geen producten gevonden' }}</h3>
        <p>{{ locale === 'en' ? 'Try a different search or category.' : 'Probeer een andere zoekopdracht of categorie.' }}</p>
        <button class="clear-btn" @click="searchQuery = ''; selectedCategory = null">
          {{ locale === 'en' ? 'Clear filters' : 'Filters wissen' }}
        </button>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.shop-page {
  padding: $space-12 0 $space-20;
}

.page-header {
  margin-bottom: $space-8;
}

.page-title {
  font-family: $font-display;
  font-size: $text-4xl;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, $color-text, $color-text-muted);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-desc {
  font-size: $text-sm;
  color: $color-text-muted;
  margin-top: $space-2;
}

.toolbar {
  display: flex;
  gap: $space-4;
  margin-bottom: $space-6;
  align-items: center;

  @media (max-width: 640px) { flex-direction: column; }
}

.search-wrap {
  position: relative;
  flex: 1;

  &__icon {
    position: absolute;
    left: $space-4;
    top: 50%;
    transform: translateY(-50%);
    color: $color-text-dim;
    pointer-events: none;
  }
}

.search-input {
  width: 100%;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-full;
  padding: $space-3 $space-4 $space-3 $space-10;
  color: $color-text;
  font-size: $text-sm;
  transition: border-color $duration-fast;

  &::placeholder { color: $color-text-dim; }
  &:focus { outline: none; border-color: $color-blue; }
}

.sort-select {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-full;
  padding: $space-3 $space-8 $space-3 $space-4;
  color: $color-text;
  font-size: $text-sm;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%238888A8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right $space-4 center;
  transition: border-color $duration-fast;

  &:focus { outline: none; border-color: $color-blue; }
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
  margin-bottom: $space-8;
}

.cat-chip {
  padding: $space-2 $space-4;
  border-radius: $radius-full;
  font-size: $text-xs;
  font-weight: 500;
  border: 1px solid $color-border;
  color: $color-text-muted;
  background: transparent;
  transition: all $duration-fast;
  white-space: nowrap;

  &:hover { border-color: $color-blue; color: $color-text; }

  &--active {
    background: linear-gradient(135deg, $color-blue, $color-orange);
    border-color: transparent;
    color: #fff;
    font-weight: 600;
  }
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-6;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
}

.shop-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $duration-base $ease-out;
  cursor: pointer;

  &:hover {
    border-color: $color-blue;
    transform: translateY(-5px);
    box-shadow: $shadow-blue;

    .shop-card__image { transform: scale(1.05); }
  }

  &__image-wrap {
    position: relative;
    aspect-ratio: 4/3;
    overflow: hidden;
    background: $color-surface-2;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $duration-slow $ease-out;
  }

  &__image-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba($color-blue, 0.12), rgba($color-orange, 0.12));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $font-display;
    font-size: $text-4xl;
    font-weight: 800;
    color: $color-blue-light;
  }

  &__category-badge {
    position: absolute;
    bottom: $space-3;
    left: $space-3;
    background: rgba($color-bg, 0.75);
    backdrop-filter: blur(8px);
    color: $color-text-muted;
    font-size: $text-xs;
    font-weight: 500;
    padding: $space-1 $space-3;
    border-radius: $radius-full;
    border: 1px solid $color-border;
    text-transform: capitalize;
  }

  &__body {
    padding: $space-5;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-md;
    font-weight: 600;
    color: $color-text;
    line-height: 1.3;
  }

  &__desc {
    font-size: $text-xs;
    color: $color-text-muted;
    line-height: 1.6;
  }

  &__creator {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-xs;
    color: $color-text-muted;
    margin-top: $space-1;
  }

  &__creator-avatar {
    width: 20px;
    height: 20px;
    border-radius: $radius-full;
    object-fit: cover;
    border: 1px solid $color-border;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: $space-2;
    padding-top: $space-3;
    border-top: 1px solid $color-border;
  }

  &__price {
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 700;
    background: linear-gradient(135deg, $color-blue-light, $color-orange);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__stock {
    font-size: $text-xs;
    color: $color-success;
    &--low { color: $color-error; }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-20 0;
  text-align: center;
  gap: $space-4;

  span { font-size: 3rem; }

  h3 {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 700;
  }

  p { font-size: $text-sm; color: $color-text-muted; }
}

.clear-btn {
  padding: $space-3 $space-6;
  border: 1px solid $color-border;
  border-radius: $radius-full;
  font-size: $text-sm;
  color: $color-text-muted;
  transition: all $duration-fast;

  &:hover { color: $color-text; border-color: $color-blue; }
}
</style>