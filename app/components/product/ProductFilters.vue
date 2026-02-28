<script setup lang="ts">
import { CATEGORIES } from '~/data/products'
import { useLocale } from '~/composables/useLocale'
import type { FilterState, SortOption, ProductCondition } from '~/types'

const props = defineProps<{
  filters: FilterState
  totalCount: number
}>()

const emit = defineEmits<{
  'update:filter': [key: keyof FilterState, value: FilterState[keyof FilterState]]
  'reset': []
}>()

const { t, locale } = useLocale()

const sortOptions: { value: SortOption; label: Record<'en' | 'nl', string> }[] = [
  { value: 'popular',    label: { en: 'Most Popular',       nl: 'Meest Populair'     } },
  { value: 'newest',     label: { en: 'Newest',             nl: 'Nieuwste'           } },
  { value: 'price-asc',  label: { en: 'Price: Low to High', nl: 'Prijs: Laag → Hoog' } },
  { value: 'price-desc', label: { en: 'Price: High to Low', nl: 'Prijs: Hoog → Laag' } },
  { value: 'rating',     label: { en: 'Top Rated',          nl: 'Best Beoordeeld'    } },
]

const conditionOptions: { value: ProductCondition; label: Record<'en' | 'nl', string> }[] = [
  { value: 'handmade', label: { en: 'Handmade', nl: 'Handgemaakt' } },
  { value: 'new',      label: { en: 'New',      nl: 'Nieuw'       } },
  { value: 'vintage',  label: { en: 'Vintage',  nl: 'Vintage'     } },
]

const hasActiveFilters = computed(() =>
  props.filters.category ||
  props.filters.minPrice !== null ||
  props.filters.maxPrice !== null ||
  props.filters.condition ||
  props.filters.search
)
</script>

<template>
  <div class="filters">

    <!-- Header -->
    <div class="filters__header">
      <h2 class="filters__title">
        {{ locale === 'en' ? 'Filters' : 'Filters' }}
      </h2>
      <button
        v-if="hasActiveFilters"
        class="filters__reset"
        @click="emit('reset')"
      >
        {{ locale === 'en' ? 'Clear all' : 'Alles wissen' }}
      </button>
    </div>

    <!-- Search -->
    <div class="filter-group">
      <label class="filter-group__label">
        {{ locale === 'en' ? 'Search' : 'Zoeken' }}
      </label>
      <div class="search-wrap">
        <svg class="search-wrap__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          class="text-input"
          :placeholder="locale === 'en' ? 'Search products...' : 'Producten zoeken...'"
          :value="filters.search"
          @input="emit('update:filter', 'search', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- Categories -->
    <div class="filter-group">
      <label class="filter-group__label">
        {{ locale === 'en' ? 'Category' : 'Categorie' }}
      </label>
      <div class="chips">
        <button
          class="chip"
          :class="{ 'chip--active': filters.category === null }"
          @click="emit('update:filter', 'category', null)"
        >
          {{ locale === 'en' ? 'All' : 'Alles' }}
        </button>
        <button
          v-for="cat in CATEGORIES"
          :key="cat.id"
          class="chip"
          :class="{ 'chip--active': filters.category === cat.slug }"
          @click="emit('update:filter', 'category', cat.slug)"
        >
          {{ cat.icon }} {{ t(cat.label) }}
        </button>
      </div>
    </div>

    <!-- Price range -->
    <div class="filter-group">
      <label class="filter-group__label">
        {{ locale === 'en' ? 'Price range (€)' : 'Prijsbereik (€)' }}
      </label>
      <div class="price-range">
        <input
          type="number"
          class="text-input text-input--sm"
          :placeholder="locale === 'en' ? 'Min' : 'Min'"
          min="0"
          :value="filters.minPrice ?? ''"
          @input="emit('update:filter', 'minPrice', ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : null)"
        />
        <span class="price-range__sep">–</span>
        <input
          type="number"
          class="text-input text-input--sm"
          :placeholder="locale === 'en' ? 'Max' : 'Max'"
          min="0"
          :value="filters.maxPrice ?? ''"
          @input="emit('update:filter', 'maxPrice', ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : null)"
        />
      </div>
    </div>

    <!-- Condition -->
    <div class="filter-group">
      <label class="filter-group__label">
        {{ locale === 'en' ? 'Condition' : 'Staat' }}
      </label>
      <div class="chips">
        <button
          class="chip"
          :class="{ 'chip--active': filters.condition === null }"
          @click="emit('update:filter', 'condition', null)"
        >
          {{ locale === 'en' ? 'Any' : 'Alle' }}
        </button>
        <button
          v-for="opt in conditionOptions"
          :key="opt.value"
          class="chip"
          :class="{ 'chip--active': filters.condition === opt.value }"
          @click="emit('update:filter', 'condition', opt.value)"
        >
          {{ t(opt.label) }}
        </button>
      </div>
    </div>

    <!-- Sort -->
    <div class="filter-group">
      <label class="filter-group__label">
        {{ locale === 'en' ? 'Sort by' : 'Sorteren op' }}
      </label>
      <select
        class="select-input"
        :value="filters.sort"
        @change="emit('update:filter', 'sort', ($event.target as HTMLSelectElement).value as SortOption)"
      >
        <option
          v-for="opt in sortOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ t(opt.label) }}
        </option>
      </select>
    </div>

    <!-- Results count -->
    <div class="filters__results">
      {{ totalCount }} {{ locale === 'en' ? 'products found' : 'producten gevonden' }}
    </div>

  </div>
</template>

<style lang="scss" scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: $space-6;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 700;
  }

  &__reset {
    font-size: $text-xs;
    color: $color-blue;
    font-weight: 500;
    transition: opacity $duration-fast;
    &:hover { opacity: 0.7; }
  }

  &__results {
    font-size: $text-xs;
    color: $color-text-dim;
    padding-top: $space-4;
    border-top: 1px solid $color-border;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  &__label {
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $color-text-muted;
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}

.chip {
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  font-size: $text-xs;
  font-weight: 500;
  border: 1px solid $color-border;
  color: $color-text-muted;
  background: transparent;
  transition: all $duration-fast;
  white-space: nowrap;

  &:hover {
    border-color: $color-blue;
    color: $color-text;
  }

  &--active {
    background: linear-gradient(135deg, $color-blue, $color-orange);
    border-color: transparent;
    color: #fff;
    font-weight: 600;
  }
}

.text-input {
  width: 100%;
  background: $color-surface-2;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: $space-3 $space-4;
  color: $color-text;
  font-size: $text-sm;
  transition: border-color $duration-fast;

  &::placeholder { color: $color-text-dim; }
  &:focus { outline: none; border-color: $color-blue; }

  &--sm {
    padding: $space-2 $space-3;
    flex: 1;
  }
}

.search-wrap {
  position: relative;

  &__icon {
    position: absolute;
    left: $space-3;
    top: 50%;
    transform: translateY(-50%);
    color: $color-text-dim;
    pointer-events: none;
  }

  .text-input { padding-left: $space-8 + $space-2; }
}

.price-range {
  display: flex;
  align-items: center;
  gap: $space-3;

  &__sep { color: $color-text-dim; flex-shrink: 0; }
}

.select-input {
  width: 100%;
  background: $color-surface-2;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: $space-3 $space-4;
  color: $color-text;
  font-size: $text-sm;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%238888A8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right $space-4 center;
  padding-right: $space-10;
  transition: border-color $duration-fast;

  &:focus { outline: none; border-color: $color-blue; }
}
</style>