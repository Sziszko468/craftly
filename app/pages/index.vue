<script setup lang="ts">
import { computed } from 'vue'
import { PRODUCTS, CATEGORIES } from '~/data/products'
import { useLocale } from '~/composables/useLocale'

useHead({ title: 'Craftly – Handmade Marketplace' })

const { t, locale } = useLocale()

const featuredProducts = computed(() =>
  PRODUCTS.filter((p) => p.isFeatured).slice(0, 4)
)
</script>

<template>
  <div class="home">

    <!-- Hero -->
    <section class="hero">
      <div class="hero__grid" aria-hidden="true" />
      <div class="hero__glow-blue" aria-hidden="true" />
      <div class="hero__glow-orange" aria-hidden="true" />

      <div class="container hero__inner">
        <div class="hero__content">
          <span class="hero__eyebrow animate-fade-up stagger-1">
            ✦ {{ locale === 'en' ? 'Unique · Handmade · Yours' : 'Uniek · Handgemaakt · Van jou' }}
          </span>

          <h1 class="hero__title animate-fade-up stagger-2">
            {{ locale === 'en' ? 'Discover goods' : 'Ontdek producten' }}<br />
            <span class="gradient-text">
              {{ locale === 'en' ? 'made with hands' : 'met de hand gemaakt' }}
            </span>
          </h1>

          <p class="hero__desc animate-fade-up stagger-3">
            {{
              locale === 'en'
                ? 'A curated marketplace connecting you directly with independent creators. Every item is one-of-a-kind.'
                : 'Een samengestelde marktplaats die je rechtstreeks verbindt met onafhankelijke makers. Elk item is uniek.'
            }}
          </p>

          <div class="hero__actions animate-fade-up stagger-4">
            <NuxtLink to="/products" class="btn btn--primary">
              {{ locale === 'en' ? 'Explore Shop' : 'Ontdek Winkel' }}
            </NuxtLink>
            <NuxtLink to="/profile" class="btn btn--ghost">
              {{ locale === 'en' ? 'Start Selling' : 'Begin Verkopen' }}
            </NuxtLink>
          </div>

          <!-- Stats -->
          <div class="hero__stats animate-fade-up stagger-5">
            <div class="stat">
              <span class="stat__number">4,200+</span>
              <span class="stat__label">{{ locale === 'en' ? 'Unique products' : 'Unieke producten' }}</span>
            </div>
            <div class="stat">
              <span class="stat__number">840</span>
              <span class="stat__label">{{ locale === 'en' ? 'Creators' : 'Makers' }}</span>
            </div>
            <div class="stat">
              <span class="stat__number">98%</span>
              <span class="stat__label">{{ locale === 'en' ? 'Satisfaction' : 'Tevredenheid' }}</span>
            </div>
          </div>
        </div>

        <!-- Hero images -->
        <div class="hero__images animate-fade-up stagger-3">
          <div class="hero__image-grid">
            <img
              src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80"
              alt="Ceramic mug"
              class="hero__img hero__img--1"
            />
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80"
              alt="Silver ring"
              class="hero__img hero__img--2"
            />
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80"
              alt="Wood board"
              class="hero__img hero__img--3"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ locale === 'en' ? 'Shop by Category' : 'Winkelen per Categorie' }}
          </h2>
          <NuxtLink to="/products" class="section-link">
            {{ locale === 'en' ? 'View all →' : 'Bekijk alles →' }}
          </NuxtLink>
        </div>

        <div class="categories-grid">
          <NuxtLink
            v-for="(cat, i) in CATEGORIES"
            :key="cat.id"
            :to="`/products?category=${cat.slug}`"
            class="category-card animate-fade-up"
            :class="`stagger-${i + 1}`"
          >
            <span class="category-card__icon">{{ cat.icon }}</span>
            <span class="category-card__label">{{ t(cat.label) }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured products -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ locale === 'en' ? 'Featured Picks' : 'Uitgelichte Producten' }}
          </h2>
          <NuxtLink to="/products" class="section-link">
            {{ locale === 'en' ? 'See all →' : 'Zie alles →' }}
          </NuxtLink>
        </div>

        <div class="products-grid">
          <ProductCard
            v-for="(product, i) in featuredProducts"
            :key="product.id"
            :product="product"
            :index="i"
          />
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="container">
      <div class="cta-banner animate-fade-up">
        <div class="cta-banner__text">
          <h2 class="cta-banner__title">
            {{ locale === 'en' ? 'Are you a creator?' : 'Ben jij een maker?' }}
          </h2>
          <p class="cta-banner__desc">
            {{
              locale === 'en'
                ? 'Join 840+ independent artists selling on Craftly.'
                : 'Sluit je aan bij 840+ onafhankelijke kunstenaars op Craftly.'
            }}
          </p>
        </div>
        <NuxtLink to="/profile" class="btn btn--primary">
          {{ locale === 'en' ? 'Apply to Sell' : 'Aanmelden als Verkoper' }}
        </NuxtLink>
      </div>
    </section>

  </div>
</template>

<style lang="scss" scoped>
// Hero
.hero {
  position: relative;
  overflow: hidden;
  padding: $space-16 0 $space-12;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba($color-border, 0.6) 1px, transparent 1px),
      linear-gradient(90deg, rgba($color-border, 0.6) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%);
  }

  &__glow-blue {
    position: absolute;
    top: -10%;
    left: -10%;
    width: 500px;
    height: 500px;
    border-radius: $radius-full;
    background: radial-gradient(circle, rgba($color-blue, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  &__glow-orange {
    position: absolute;
    top: 20%;
    right: -10%;
    width: 400px;
    height: 400px;
    border-radius: $radius-full;
    background: radial-gradient(circle, rgba($color-orange, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  &__inner {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: $space-16;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $space-6;
  }

  &__eyebrow {
    font-size: $text-sm;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $color-blue-light;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp($text-3xl, 5vw, $text-5xl);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
  }

  &__desc {
    font-size: $text-md;
    color: $color-text-muted;
    max-width: 40ch;
    line-height: 1.75;
  }

  &__actions {
    display: flex;
    gap: $space-4;
    flex-wrap: wrap;
  }

  &__stats {
    display: flex;
    gap: $space-8;
    padding-top: $space-6;
    border-top: 1px solid $color-border;
  }

  &__images {
    @media (max-width: 768px) { display: none; }
  }

  &__image-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    grid-template-rows: 180px 180px;
    gap: $space-3;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $radius-lg;
    border: 1px solid $color-border;

    &--1 {
      grid-row: 1 / 3;
    }
  }
}

.stat {
  display: flex;
  flex-direction: column;
  gap: $space-1;

  &__number {
    font-family: $font-display;
    font-size: $text-2xl;
    font-weight: 800;
    background: linear-gradient(135deg, $color-blue-light, $color-orange);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__label {
    font-size: $text-xs;
    color: $color-text-muted;
    letter-spacing: 0.04em;
  }
}

// Sections
.section {
  padding: $space-16 0;
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: $space-8;
}

.section-title {
  font-family: $font-display;
  font-size: $text-2xl;
  font-weight: 700;
}

.section-link {
  font-size: $text-sm;
  color: $color-blue;
  transition: opacity $duration-fast;
  &:hover { opacity: 0.8; }
}

// Categories
.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: $space-4;

  @media (max-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: repeat(2, 1fr); }
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;
  padding: $space-6 $space-4;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  text-align: center;
  transition: all $duration-base $ease-out;

  &:hover {
    border-color: $color-blue;
    transform: translateY(-4px);
    box-shadow: $shadow-blue;
  }

  &__icon { font-size: 2rem; line-height: 1; }

  &__label {
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: $color-text-muted;
  }
}

// Products grid
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-6;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
}

// Buttons
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $space-3 $space-8;
  border-radius: $radius-full;
  font-size: $text-sm;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: all $duration-fast $ease-out;
  white-space: nowrap;

  &--primary {
    background: linear-gradient(135deg, $color-blue, $color-orange);
    color: #fff;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba($color-blue, 0.35);
    }
  }

  &--ghost {
    background: transparent;
    color: $color-text-muted;
    border: 1px solid $color-border;

    &:hover {
      color: $color-text;
      border-color: $color-border-2;
      transform: translateY(-1px);
    }
  }
}

// CTA
.cta-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-10 $space-12;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-xl;
  position: relative;
  overflow: hidden;
  margin-bottom: $space-16;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba($color-blue, 0.05), rgba($color-orange, 0.05));
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, $color-blue, $color-orange);
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: $space-6;
    text-align: center;
    padding: $space-8;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 700;
    position: relative;
  }

  &__desc {
    font-size: $text-sm;
    color: $color-text-muted;
    margin-top: $space-1;
    position: relative;
  }
}
</style>