// nuxt.config.ts

import icons from "./public/icons/icons.json";
import mkcert from "vite-plugin-mkcert";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vite-pwa/nuxt",
    "@nuxt/image",
    "@pinia/nuxt",
  ],

  // Konfigurasi PWA
  pwa: {
    registerType: "autoUpdate",
    injectRegister: "auto",
    manifest: {
      name: "Kebun Raya",
      short_name: "Kebun Raya",
      start_url: "/",
      display: "standalone",
      theme_color: "#ffffff",
      icons,
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
  },

  // Konfigurasi Tailwind
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config.js",
  },

  image: {
    quality: 100,
    format: ["webp"],
  },
  runtimeConfig: {
    public: {
      axios: {
        baseURL: "https://backend.kebunrayabundahayati.com/api/",
        // baseURL: "https://back-end-kebunraya.marannu.com/api/",
        // baseURL: "http://backend-kebunraya.test/api/",
      },
      imgURL: "https://backend.kebunrayabundahayati.com/storage",
      // imgURL : "https://back-end-kebunraya.marannu.com"
      // imgURL : "http://backend-kebunraya.test/"
    },
  },
  devServer: {
    port: 2000, // Ganti 8000 dengan port yang Anda inginkan
  },
  // Konfigurasi app
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Kebun Raya Bundahayati",
      link: [
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
        },
      ],
      meta: [
        {
          name: "description",
          content:
            "Selamat datang di Kebun Raya Bulungan, tempat di mana flora endemik, budaya lokal, dan konservasi alam bertemu untuk menciptakan masa depan yang berkelanjutan.",
        },
      ],
    },
  },
  css: ["~/assets/css/global.css"],

  compatibilityDate: "2025-04-10",
});
