// Locale switcher composable – EN / NL
import { ref, computed } from 'vue'
import type { Locale, LocalizedString } from '~/types'

// Helper: get translated value from a LocalizedString
function t(record: LocalizedString): string {
  return record[currentLocale.value]
}
const currentLocale = ref<Locale>('en')

export function useLocale() {
  function setLocale(locale: Locale): void {
    currentLocale.value = locale
  }

  function toggleLocale(): void {
    currentLocale.value = currentLocale.value === 'en' ? 'nl' : 'en'
  }

  // Helper: get translated value from a Record<Locale, string>
  function t(record: Record<Locale, string>): string {
    return record[currentLocale.value]
  }

  const isEN = computed(() => currentLocale.value === 'en')
  const isNL = computed(() => currentLocale.value === 'nl')

  return {
    locale: currentLocale,
    isEN,
    isNL,
    setLocale,
    toggleLocale,
    t,
  }
}