import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{gold.50}",
      100: "{gold.100}",
      200: "{gold.200}",
      300: "{gold.300}",
      400: "{gold.400}",
      500: "{gold.500}",
      600: "{gold.600}",
      700: "{gold.700}",
      800: "{gold.800}",
      900: "{gold.900}",
      950: "{gold.950}",
    },
    colorScheme: {
      dark: {
        surface: {
          0: "#ffffff",
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#262626",
          800: "#1A1A1A",
          900: "#121212",
          950: "#0A0A0A",
        },
      },
    },
  },
  primitive: {
    gold: {
      50: "#fffdf0",
      100: "#fef8c2",
      200: "#fdee85",
      300: "#fcdf47",
      400: "#facc15",
      500: "#D4AF37", // Metallic Gold
      600: "#B8860B",
      700: "#916a08",
      800: "#6d5006",
      900: "#493504",
      950: "#241a02",
    },
  },
});

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
        preset: MyPreset,
        options: {
          darkModeSelector: ".dark",
          cssLayer: false,
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
