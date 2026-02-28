<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import { useToast } from '~/composables/useToast'
import { useLocale } from '~/composables/useLocale'

useHead({ title: 'Cart – Craftly' })

const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
const { success } = useToast()
const { locale } = useLocale()

function handleRemove(productId: string, title: string) {
  removeFromCart(productId)
  success(locale.value === 'en' ? `"${title}" removed` : `"${title}" verwijderd`)
}

function handleCheckout() {
  success(locale.value === 'en'
    ? '🎉 Demo only – no real checkout!'
    : '🎉 Alleen demo – geen echte afrekening!'
  )
}
</script>

<template>
  <div class="cart-page">
    <div class="container">

      <h1 class="page-title animate-fade-up stagger-1">
        {{ locale === 'en' ? 'Your Cart' : 'Jouw Winkelwagen' }}
      </h1>

      <!-- Cart has items -->
      <div v-if="cart.itemCount > 0" class="cart-layout">

        <!-- Items list -->
        <div class="cart-items animate-fade-up stagger-2">
          <TransitionGroup name="cart-item" tag="div" class="cart-items__list">
            <div
              v-for="item in cart.items"
              :key="item.product.id"
              class="cart-item"
            >
              <NuxtLink :to="`/products/${item.product.slug}`" class="cart-item__image-wrap">
                <img
                  :src="item.product.images[0]"
                  :alt="item.product.title.en"
                  class="cart-item__image"
                />
              </NuxtLink>

              <div class="cart-item__info">
                <NuxtLink
                  :to="`/products/${item.product.slug}`"
                  class="cart-item__title"
                >
                  {{ locale === 'en' ? item.product.title.en : item.product.title.nl }}
                </NuxtLink>
                <span class="cart-item__creator">
                  {{ locale === 'en' ? 'by' : 'door' }} {{ item.product.creator.name }}
                </span>
                <span class="cart-item__condition">{{ item.product.condition }}</span>
              </div>

              <!-- Quantity -->
              <div class="cart-item__qty">
                <button
                  class="qty-btn"
                  :disabled="item.quantity <= 1"
                  @click="updateQuantity(item.product.id, item.quantity - 1)"
                >−</button>
                <span>{{ item.quantity }}</span>
                <button
                  class="qty-btn"
                  :disabled="item.quantity >= item.product.stock"
                  @click="updateQuantity(item.product.id, item.quantity + 1)"
                >+</button>
              </div>

              <span class="cart-item__price">
                €{{ (item.product.price * item.quantity).toFixed(2) }}
              </span>

              <button
                class="cart-item__remove"
                @click="handleRemove(item.product.id, locale === 'en' ? item.product.title.en : item.product.title.nl)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                </svg>
              </button>
            </div>
          </TransitionGroup>

          <button class="clear-btn" @click="clearCart">
            {{ locale === 'en' ? 'Clear all' : 'Alles verwijderen' }}
          </button>
        </div>

        <!-- Order summary -->
        <div class="summary animate-fade-up stagger-3">
          <h2 class="summary__title">
            {{ locale === 'en' ? 'Order Summary' : 'Besteloverzicht' }}
          </h2>

          <div class="summary__line">
            <span>{{ locale === 'en' ? `Subtotal (${cart.itemCount} items)` : `Subtotaal (${cart.itemCount} artikelen)` }}</span>
            <span>€{{ cart.total.toFixed(2) }}</span>
          </div>

          <div class="summary__line">
            <span>{{ locale === 'en' ? 'Shipping' : 'Verzending' }}</span>
            <span :class="{ 'summary__free': cart.total >= 80 }">
              {{ cart.total >= 80
                ? (locale === 'en' ? 'Free' : 'Gratis')
                : '€5.90'
              }}
            </span>
          </div>

          <!-- Free shipping progress -->
          <div v-if="cart.total < 80" class="shipping-bar">
            <p class="shipping-bar__text">
              {{ locale === 'en'
                ? `Add €${(80 - cart.total).toFixed(2)} more for free shipping`
                : `Voeg €${(80 - cart.total).toFixed(2)} toe voor gratis verzending`
              }}
            </p>
            <div class="shipping-bar__track">
              <div
                class="shipping-bar__fill"
                :style="{ width: `${Math.min((cart.total / 80) * 100, 100)}%` }"
              />
            </div>
          </div>

          <div class="summary__total">
            <span>{{ locale === 'en' ? 'Total' : 'Totaal' }}</span>
            <span>€{{ (cart.total + (cart.total >= 80 ? 0 : 5.90)).toFixed(2) }}</span>
          </div>

          <button class="checkout-btn" @click="handleCheckout">
            {{ locale === 'en' ? 'Proceed to Checkout →' : 'Ga naar Afrekenen →' }}
          </button>

          <NuxtLink to="/products" class="continue-link">
            ← {{ locale === 'en' ? 'Continue shopping' : 'Verder winkelen' }}
          </NuxtLink>
        </div>
      </div>

      <!-- Empty cart -->
      <div v-else class="empty-cart animate-fade-in">
        <span class="empty-cart__icon">🛍️</span>
        <h2 class="empty-cart__title">
          {{ locale === 'en' ? 'Your cart is empty' : 'Je winkelwagen is leeg' }}
        </h2>
        <p class="empty-cart__desc">
          {{ locale === 'en'
            ? 'Discover unique handmade goods from independent creators.'
            : 'Ontdek unieke handgemaakte producten van onafhankelijke makers.'
          }}
        </p>
        <NuxtLink to="/products" class="shop-btn">
          {{ locale === 'en' ? 'Start Shopping' : 'Begin met Winkelen' }}
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart-page {
  padding: $space-12 0 $space-20;
}

.page-title {
  font-family: $font-display;
  font-size: $text-4xl;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: $space-10;
  background: linear-gradient(135deg, $color-text, $color-text-muted);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: $space-12;
  align-items: start;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
}

.cart-items__list {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.cart-item {
  display: grid;
  grid-template-columns: 88px 1fr auto auto auto;
  align-items: center;
  gap: $space-5;
  padding: $space-5;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  transition: border-color $duration-fast;

  &:hover { border-color: $color-border-2; }

  @media (max-width: 640px) {
    grid-template-columns: 72px 1fr auto;
    grid-template-rows: auto auto;
  }

  &__image-wrap { flex-shrink: 0; }

  &__image {
    width: 88px;
    height: 88px;
    object-fit: cover;
    border-radius: $radius-md;
    border: 1px solid $color-border;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: $space-1;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-base;
    font-weight: 600;
    color: $color-text;
    transition: color $duration-fast;
    &:hover { color: $color-blue-light; }
  }

  &__creator,
  &__condition {
    font-size: $text-xs;
    color: $color-text-muted;
  }

  &__qty {
    display: flex;
    align-items: center;
    gap: $space-2;
    border: 1px solid $color-border;
    border-radius: $radius-full;
    padding: $space-1 $space-2;
    font-size: $text-sm;
    font-weight: 500;
  }

  &__price {
    font-family: $font-display;
    font-size: $text-md;
    font-weight: 700;
    min-width: 64px;
    text-align: right;
  }

  &__remove {
    color: $color-text-dim;
    padding: $space-2;
    border-radius: $radius-sm;
    transition: all $duration-fast;

    &:hover {
      color: $color-error;
      background: rgba($color-error, 0.1);
    }
  }
}

.qty-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-muted;
  font-size: $text-md;
  border-radius: $radius-full;
  transition: all $duration-fast;

  &:not(:disabled):hover {
    color: $color-text;
    background: $color-surface-2;
  }

  &:disabled { opacity: 0.3; cursor: not-allowed; }
}

.clear-btn {
  margin-top: $space-4;
  font-size: $text-xs;
  color: $color-text-dim;
  transition: color $duration-fast;
  &:hover { color: $color-error; }
}

// Summary
.summary {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: $space-6;
  position: sticky;
  top: calc(#{$nav-height} + #{$space-6});
  display: flex;
  flex-direction: column;
  gap: $space-5;

  &__title {
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 700;
    padding-bottom: $space-4;
    border-bottom: 1px solid $color-border;
  }

  &__line {
    display: flex;
    justify-content: space-between;
    font-size: $text-sm;
    color: $color-text-muted;
  }

  &__free { color: $color-success; font-weight: 600; }

  &__total {
    display: flex;
    justify-content: space-between;
    padding-top: $space-4;
    border-top: 1px solid $color-border;
    font-weight: 600;

    span:last-child {
      font-family: $font-display;
      font-size: $text-xl;
      font-weight: 800;
      background: linear-gradient(135deg, $color-blue-light, $color-orange);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
}

.shipping-bar {
  &__text {
    font-size: $text-xs;
    color: $color-text-muted;
    margin-bottom: $space-2;
  }

  &__track {
    height: 4px;
    background: $color-surface-2;
    border-radius: $radius-full;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    background: linear-gradient(90deg, $color-blue, $color-orange);
    border-radius: $radius-full;
    transition: width 0.6s $ease-out;
  }
}

.checkout-btn {
  width: 100%;
  padding: $space-4;
  background: linear-gradient(135deg, $color-blue, $color-orange);
  color: #fff;
  border-radius: $radius-full;
  font-size: $text-sm;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: all $duration-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba($color-blue, 0.35);
  }
}

.continue-link {
  text-align: center;
  font-size: $text-xs;
  color: $color-text-muted;
  transition: color $duration-fast;
  &:hover { color: $color-blue-light; }
}

// Empty cart
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
  padding: $space-20 0;
  text-align: center;

  &__icon { font-size: 3.5rem; }

  &__title {
    font-family: $font-display;
    font-size: $text-2xl;
    font-weight: 700;
  }

  &__desc {
    color: $color-text-muted;
    font-size: $text-sm;
    max-width: 32ch;
  }
}

.shop-btn {
  margin-top: $space-2;
  padding: $space-3 $space-8;
  border-radius: $radius-full;
  background: linear-gradient(135deg, $color-blue, $color-orange);
  color: #fff;
  font-size: $text-sm;
  font-weight: 600;
  transition: all $duration-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba($color-blue, 0.35);
  }
}

// Transition
.cart-item-leave-active { transition: all $duration-base $ease-out; }
.cart-item-leave-to { opacity: 0; transform: translateX(-20px); }
</style>