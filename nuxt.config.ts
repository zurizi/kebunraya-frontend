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
  ssr: false,
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
      runtimeCaching: [
        {
          urlPattern: ({url}) => url.pathname === '/',
          handler: 'StaleWhileRevalidate', // Or 'NetworkFirst' if immediate freshness for the homepage is critical on network
          options: {
            cacheName: 'root-cache',
            expiration: {
              maxEntries: 10, // Usually just one entry (the root)
              maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
            },
            cacheableResponse: {
              statuses: [0, 200] // Cache successful responses and opaque responses
            }
          }
        },
        {
          urlPattern: ({url}) => url.pathname.startsWith('/api/tanaman'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-tanaman-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: ({url}) => url.pathname.startsWith('/api/kegiatan'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-kegiatan-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: ({url}) => url.pathname.startsWith('/api/kategori'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-kategori-cache',
            expiration: {
              maxEntries: 30, // Categories might be fewer
              maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    strategies: "generateSW", // atau 'injectManifest'
    // registerType: 'autoUpdate', // Cara mendaftar service worker
    // Jika menggunakan generateSW, perlu tentukan path service worker
    srcDir: ".nuxt", // atau lokasi generate service worker file
    filename: "sw.js", // nama file service worker yang di-generate
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
