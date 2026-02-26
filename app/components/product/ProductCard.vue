<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '~/types'
import { useCart } from '~/composables/useCart'
import { useFavorites } from '~/composables/useFavorites'
import { useToast } from '~/composables/useToast'
import { useLocale } from '~/composables/useLocale'

const props = defineProps<{
  product: Product
  index?: number
}>()

const { addToCart, isInCart } = useCart()
const { isFavorited, toggleFavorite } = useFavorites()
const { success } = useToast()
const { t, locale } = useLocale()

const isImageLoaded = ref(false)
const isAdding = ref(false)

const inCart = computed(() => isInCart(props.product.id))
const favorited = computed(() => isFavorited(props.product.id))

async function handleAddToCart() {
  if (inCart.value || isAdding.value) return
  isAdding.value = true
  await new Promise((r) => setTimeout(r, 300))
  addToCart(props.product)
  success(locale.value === 'en' ? `Added to cart!` : `Toegevoegd aan winkelwagen!`)
  isAdding.value = false
}

function handleFavorite() {
  const added = toggleFavorite(props.product)
  success(
    added
      ? (locale.value === 'en' ? 'Added to favorites ♥' : 'Toegevoegd aan favorieten ♥')
      : (locale.value === 'en' ? 'Removed from favorites' : 'Verwijderd uit favorieten')
  )
}
</script>

<template>
  <article
    class="card animate-fade-up"
    :class="`stagger-${(index ?? 0) % 6 + 1}`"
  >
    <!-- Image -->
    <NuxtLink :to="`/products/${product.slug}`" class="card__image-wrap">
      <div v-if="!isImageLoaded" class="card__image-bg skeleton" />
      <img
        :src="product.images[0]"
        :alt="t(product.title)"
        class="card__image"
        :class="{ 'card__image--loaded': isImageLoaded }"
        loading="lazy"
        @load="isImageLoaded = true"
      />

      <!-- Badges -->
      <span v-if="product.isFeatured" class="card__badge">
        {{ locale === 'en' ? 'Featured' : 'Uitgelicht' }}
      </span>
      <span v-if="product.stock <= 2" class="card__stock-badge">
        {{ locale === 'en' ? `Only ${product.stock} left` : `Nog ${product.stock} over` }}
      </span>

      <!-- Favorite overlay -->
      <div class="card__overlay">
        <button
          class="overlay-btn"
          :class="{ 'overlay-btn--active': favorited }"
          :aria-label="locale === 'en' ? 'Toggle favorite' : 'Favoriet wisselen'"
          @click.prevent="handleFavorite"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>
    </NuxtLink>

    <!-- Body -->
    <div class="card__body">
      <div class="card__meta">
        <span class="card__category">
          {{ product.category.icon }} {{ t(product.category.label) }}
        </span>
        <div class="card__rating">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>{{ product.rating }}</span>
          <span class="card__review-count">({{ product.reviewCount }})</span>
        </div>
      </div>

      <NuxtLink :to="`/products/${product.slug}`" class="card__title">
        {{ t(product.title) }}
      </NuxtLink>

      <div class="card__creator">
        <img
          :src="product.creator.avatar"
          :alt="product.creator.name"
          class="card__creator-avatar"
        />
        <span>{{ product.creator.name }}</span>
        <svg v-if="product.creator.verified" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="card__verified">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>

      <div class="card__footer">
        <span class="card__price">€{{ product.price }}</span>
        <button
          class="card__cart-btn"
          :class="{
            'card__cart-btn--added': inCart,
            'card__cart-btn--loading': isAdding,
          }"
          :disabled="inCart || isAdding"
          @click="handleAddToCart"
        >
          <span v-if="isAdding" class="spinner" />
          <template v-else-if="inCart">
            ✓ {{ locale === 'en' ? 'In cart' : 'In winkelwagen' }}
          </template>
          <template v-else>
            {{ locale === 'en' ? 'Add to cart' : 'Voeg toe' }}
          </template>
        </button>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: transform $duration-base $ease-out, border-color $duration-base, box-shadow $duration-base;

  &:hover {
    transform: translateY(-6px);
    border-color: $color-blue;
    box-shadow: $shadow-blue;

    .card__image { transform: scale(1.05); }
    .card__overlay { opacity: 1; }
  }

  &__image-wrap {
    position: relative;
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: $color-surface-2;
  }

  &__image-bg {
    position: absolute;
    inset: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity $duration-slow $ease-out, transform $duration-slow $ease-out;

    &--loaded { opacity: 1; }
  }

  &__badge {
    position: absolute;
    top: $space-3;
    left: $space-3;
    background: linear-gradient(135deg, $color-blue, $color-orange);
    color: #fff;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: $space-1 $space-3;
    border-radius: $radius-full;
  }

  &__stock-badge {
    position: absolute;
    bottom: $space-3;
    left: $space-3;
    background: rgba($color-error, 0.9);
    color: #fff;
    font-size: $text-xs;
    padding: $space-1 $space-3;
    border-radius: $radius-full;
  }

  &__overlay {
    position: absolute;
    top: $space-3;
    right: $space-3;
    opacity: 0;
    transition: opacity $duration-base;
  }

  &__body {
    padding: $space-5;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__category {
    font-size: $text-xs;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: $text-xs;
    color: $color-orange;
  }

  &__review-count { color: $color-text-dim; }

  &__title {
    font-family: $font-display;
    font-size: $text-md;
    font-weight: 600;
    color: $color-text;
    line-height: 1.35;
    transition: color $duration-fast;

    &:hover { color: $color-blue-light; }
  }

  &__creator {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-xs;
    color: $color-text-muted;
  }

  &__creator-avatar {
    width: 20px;
    height: 20px;
    border-radius: $radius-full;
    object-fit: cover;
    border: 1px solid $color-border-2;
  }

  &__verified { color: $color-blue; }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: $space-1;
  }

  &__price {
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 700;
  }

  &__cart-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.04em;
    background: linear-gradient(135deg, $color-blue, $color-orange);
    color: #fff;
    min-width: 96px;
    min-height: 32px;
    transition: all $duration-fast;

    &:hover:not(:disabled) {
      transform: scale(1.03);
      box-shadow: 0 4px 16px rgba($color-blue, 0.4);
    }

    &:active:not(:disabled) { transform: scale(0.97); }

    &--added {
      background: $color-surface-2;
      color: $color-success;
      border: 1px solid rgba($color-success, 0.4);
    }

    &--loading,
    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  }
}

.overlay-btn {
  width: 34px;
  height: 34px;
  border-radius: $radius-full;
  background: rgba($color-bg, 0.75);
  backdrop-filter: blur(8px);
  color: $color-text-muted;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $duration-fast;

  &:hover { color: $color-text; transform: scale(1.1); }
  &--active { color: $color-orange; }
}

.spinner {
  display: inline-block;
  width: 13px;
  height: 13px;
  border: 2px solid rgba(#fff, 0.3);
  border-top-color: #fff;
  border-radius: $radius-full;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>