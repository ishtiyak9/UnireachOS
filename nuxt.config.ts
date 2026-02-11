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
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b", // Zinc 900
          950: "#09090b", // Zinc 950 (Deep Neutral Black)
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
    unireach_purple: {
      50: "#f4eaff",
      100: "#e9d5ff",
      200: "#d2acfe",
      300: "#bb83fd",
      400: "#a35afc",
      500: "#9651fe", // Brand Base
      600: "#7d3fd4",
      700: "#642da9",
      800: "#4b1e7f",
      900: "#321155",
      950: "#1a082b",
    },
  },
});

export default defineNuxtConfig({
  ssr: true,
  // Nuxt 4 directory structure and features
  future: {
    compatibilityVersion: 4,
  },

  nitro: {
    experimental: {
      websocket: true,
    },
  },

  compatibilityDate: "2025-07-15",

  app: {
    head: {
      htmlAttrs: {
        class: "dark",
      },
      style: [
        {
          children: "html, body { background-color: #09090b; color: #ffffff; }",
        },
      ],
      script: [
        {
          children:
            "if (typeof document !== 'undefined') { document.documentElement.classList.add('dark'); }",
          type: "text/javascript",
        },
      ],
    },
  },

  devtools: { enabled: true },

  // Enable all enterprise modules
  modules: [
    "@primevue/nuxt-module",
    "@prisma/nuxt",
    "nuxt-security",
    "nuxt-auth-utils",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/eslint",
  ],

  // Prisma Configuration
  prisma: {
    autoSetupPrisma: true,
  },

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
      title: "Unireach - Guidance, Strategy, Success",
      titleTemplate: "%s | Unireach",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Unireach serves as your link to a brighter future. We provide expert guidance for student admission, business migration, and job immigration services.",
        },
        {
          name: "keywords",
          content:
            "Unireach, study abroad, business migration, job immigration, visa consultant, education consultancy, student visa, work permit, global migration",
        },
        // Open Graph
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Unireach" },
        {
          property: "og:title",
          content: "Unireach - Guidance, Strategy, Success",
        },
        {
          property: "og:description",
          content:
            "Unireach serves as your link to a brighter future. Expert guidance for student admission, business migration, and job immigration.",
        },
        { property: "og:image", content: "/logo.png" }, // Assuming logo.png is suitable for OG image
        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Unireach - Guidance, Strategy, Success",
        },
        {
          name: "twitter:description",
          content:
            "Unireach serves as your link to a brighter future. Expert guidance for student admission, business migration, and job immigration.",
        },
        { name: "twitter:image", content: "/logo.png" },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/icon.png" }],
    },
  },
});
