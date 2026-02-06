import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  // Nuxt 4 directory structure and features
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2025-07-15",

  devtools: { enabled: true },

  // Enable all enterprise modules
  modules: [
    "@primevue/nuxt-module",
    "nuxt-security",
    "nuxt-auth-utils",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/eslint",
  ],

  // PrimeVue Configuration
  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".dark",
          cssLayer: false, // Matches Tailwind 4 behavior better for initial setup
        },
      },
      ripple: true,
    },
    autoImport: true,
  },

  // Security Configuration (Permissive for development)
  security: {
    corsHandler: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
    headers: {
      contentSecurityPolicy: false, // Disabled during dev to avoid flickering/blocked scripts
    },
  },

  // Icon Configuration
  icon: {
    serverBundle: "remote",
  },

  // Tailwind 4 via PostCSS
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
      autoprefixer: {},
    },
  },

  css: ["~/assets/css/main.css"],

  // App defaults
  app: {
    head: {
      title: "UniReach CRM - Enterprise Education Solutions",
      meta: [
        {
          name: "description",
          content:
            "Advanced CRM for student recruitment and migration services.",
        },
      ],
    },
  },
});
