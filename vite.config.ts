import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Aumentar el límite de tamaño de archivos a 10MB
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,avif,webp}'],
        // Excluir archivos muy grandes del precache, pero permitir cache on-demand
        globIgnores: [
          '**/Desktop_3.png',
          '**/W4 - GR W15 Blueprint.jpg',
          '**/Singapore GP 2025 Desktop Wallpaper 4.jpg'
        ],
        runtimeCaching: [
          // Cache para imágenes locales grandes (on-demand)
          {
            urlPattern: /.*\.(png|jpg|jpeg|svg|avif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              }
            }
          },
          // Cache para API de OpenF1
          {
            urlPattern: /^https:\/\/api\.openf1\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'f1-api-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
              },
              plugins: [
                {
                  cacheKeyWillBeUsed: async ({ request }: { request: Request }) => {
                    return `${request.url}`
                  }
                }
              ]
            }
          },
          // Cache para banderas
          {
            urlPattern: /^https:\/\/flagcdn\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'flags-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              }
            }
          },
          // Cache para Wikipedia
          {
            urlPattern: /^https:\/\/upload\.wikimedia\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'wikipedia-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              }
            }
          },
          // Cache para avatars
          {
            urlPattern: /^https:\/\/ui-avatars\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'avatars-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
              }
            }
          }
        ]
      },
      includeAssets: [
        'favicon.ico', 
        'apple-touch-icon.png', 
        'robots.txt',
        'red-bull-hero.avif',
        'red-bull-hero.jpg',
        '1291046782.avif',
        'Mexico City GP 2024 Desktop Wallpaper 2.jpg'
      ],
      manifest: {
        name: 'Formula 1 - La Máxima Velocidad',
        short_name: 'F1 Dashboard',
        description: 'Experimenta la emoción de la Fórmula 1 con datos en tiempo real desde OpenF1',
        theme_color: '#ef4444',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['sports', 'entertainment'],
        lang: 'es',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'  
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: 'screenshot-wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'F1 Dashboard Desktop'
          },
          {
            src: 'screenshot-narrow.png',
            sizes: '640x1136',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'F1 Dashboard Mobile'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
