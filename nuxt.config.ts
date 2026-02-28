export default defineNuxtConfig({
  compatibilityDate: '2024-08-14',
  devtools: { enabled: true },

  supabase: {
  redirect: false,
  url: 'https://mofmmhtbwprbotwizrzg.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZm1taHRid3ByYm90d2l6cnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzA4NzEsImV4cCI6MjA4Nzg0Njg3MX0.VcrMVsPAR5mKJSaAC8U2soBZiS9lE2t3sAGZChpiC8M',
  types: '~/types/database.types.ts',
  },

  modules: [
    '@nuxtjs/supabase',
  ],

 
  components: [
    { path: '~/components', pathPrefix: false },
  ],

  css: [
    '~/assets/scss/main.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/assets/scss/_variables.scss" as *;`,
        },
      },
    },
  },

  app: {
    head: {
      title: 'Craftly – Handmade Marketplace',
      meta: [
        { name: 'description', content: 'Discover unique handmade goods.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  typescript: {
    strict: true,
    shim: false,
  },
})

