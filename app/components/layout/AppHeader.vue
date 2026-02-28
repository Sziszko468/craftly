<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCart } from '~/composables/useCart'
import { useLocale } from '~/composables/useLocale'

const { cart } = useCart()
const { locale, setLocale } = useLocale()

const isMenuOpen = ref(false)
const isScrolled = ref(false)

const navLinks = [
  { label: { en: 'Shop',    nl: 'Winkel'      }, to: '/products' },
  { label: { en: 'Profile', nl: 'Profiel'     }, to: '/profile'  },
  { label: { en: 'Login',   nl: 'Inloggen'    }, to: '/auth'     },
]

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  }, { passive: true })
})
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }">
    <div class="container header__inner">

      <!-- Logo -->
      <NuxtLink to="/" class="logo">
        <span class="logo__icon">✦</span>
        <span class="logo__text">Craftly</span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="nav">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav__link"
          active-class="nav__link--active"
        >
          {{ locale === 'en' ? link.label.en : link.label.nl }}
        </NuxtLink>
      </nav>

      <!-- Actions -->
      <div class="header__actions">

        <!-- Language toggle -->
        <div class="lang-toggle">
          <button
            class="lang-btn"
            :class="{ 'lang-btn--active': locale === 'en' }"
            @click="setLocale('en')"
          >
            EN
          </button>
          <span class="lang-sep">|</span>
          <button
            class="lang-btn"
            :class="{ 'lang-btn--active': locale === 'nl' }"
            @click="setLocale('nl')"
          >
            NL
          </button>
        </div>

        <!-- Cart icon -->
        <NuxtLink to="/cart" class="cart-btn" aria-label="Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <span v-if="cart.itemCount > 0" class="cart-btn__badge">
            {{ cart.itemCount }}
          </span>
        </NuxtLink>

        <!-- Mobile menu button -->
        <button
          class="menu-btn"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="menu-btn__bar" :class="{ 'menu-btn__bar--open': isMenuOpen }" />
        </button>

      </div>
    </div>

    <!-- Mobile nav -->
    <Transition name="mobile-nav">
      <div v-if="isMenuOpen" class="mobile-nav">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="mobile-nav__link"
          @click="isMenuOpen = false"
        >
          {{ locale === 'en' ? link.label.en : link.label.nl }}
        </NuxtLink>
      </div>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: $nav-height;
  display: flex;
  align-items: center;
  transition: background $duration-base $ease-out, border-color $duration-base;
  border-bottom: 1px solid transparent;

  &--scrolled {
    background: rgba($color-bg, 0.85);
    backdrop-filter: blur(20px);
    border-color: $color-border;
  }

  &__inner {
    display: flex;
    align-items: center;
    gap: $space-8;
  }

  &__actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: $space-4;
  }
}

// Logo
.logo {
  display: flex;
  align-items: center;
  gap: $space-2;
  flex-shrink: 0;

  &__icon {
    font-size: $text-lg;
    background: linear-gradient(135deg, $color-blue, $color-orange);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__text {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 800;
    color: $color-text;
    letter-spacing: -0.02em;
  }
}

// Nav
.nav {
  display: flex;
  gap: $space-6;

  @media (max-width: 768px) { display: none; }

  &__link {
    font-size: $text-sm;
    font-weight: 500;
    color: $color-text-muted;
    letter-spacing: 0.02em;
    transition: color $duration-fast;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, $color-blue, $color-orange);
      border-radius: $radius-full;
      transition: width $duration-base $ease-out;
    }

    &:hover,
    &--active {
      color: $color-text;
      &::after { width: 100%; }
    }
  }
}

// Language toggle
.lang-toggle {
  display: flex;
  align-items: center;
  gap: $space-1;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-full;
  padding: $space-1 $space-3;
}

.lang-btn {
  font-size: $text-xs;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: $color-text-dim;
  transition: color $duration-fast;
  padding: 2px $space-1;

  &--active { color: $color-blue; }
  &:hover:not(&--active) { color: $color-text-muted; }
}

.lang-sep {
  color: $color-border-2;
  font-size: $text-xs;
}

// Cart button
.cart-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: $radius-full;
  color: $color-text-muted;
  transition: color $duration-fast, background $duration-fast;

  &:hover {
    color: $color-text;
    background: $color-surface;
  }

  &__badge {
    position: absolute;
    top: 4px;
    right: 4px;
    min-width: 18px;
    height: 18px;
    border-radius: $radius-full;
    background: linear-gradient(135deg, $color-blue, $color-orange);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 $space-1;
    animation: fade-in $duration-base $ease-out;
  }
}

// Mobile menu button
.menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) { display: flex; }

  &__bar {
    position: relative;
    width: 22px;
    height: 2px;
    background: $color-text;
    border-radius: 2px;
    transition: background $duration-fast;

    &::before, &::after {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background: currentColor;
      border-radius: 2px;
      transition: transform $duration-base $ease-out;
    }

    &::before { top: -7px; }
    &::after  { top:  7px; }

    &--open {
      background: transparent;
      &::before { transform: rotate(45deg) translate(5px, 5px); }
      &::after  { transform: rotate(-45deg) translate(5px, -5px); }
    }
  }
}

// Mobile nav
.mobile-nav {
  position: absolute;
  top: $nav-height;
  left: 0;
  right: 0;
  background: $color-surface;
  border-bottom: 1px solid $color-border;
  padding: $space-4;
  display: flex;
  flex-direction: column;
  gap: $space-1;

  &__link {
    padding: $space-3 $space-4;
    border-radius: $radius-md;
    font-size: $text-md;
    color: $color-text-muted;
    transition: color $duration-fast, background $duration-fast;

    &:hover {
      color: $color-text;
      background: $color-surface-2;
    }
  }
}

.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: opacity $duration-base $ease-out, transform $duration-base $ease-out;
}
.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>