import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Esto registra el Service Worker automáticamente
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      
      // Archivos que quieres que se guarden en caché para que la app funcione sin internet
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'favicon-32x32.png',
        'favicon-16x16.png'
      ],

      manifest: {
        name: 'Falla Amics de Nàquera',
        short_name: 'AmicsNáquera',
        description: 'Aplicación oficial de la Falla Amics de Nàquera',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Recomendado para que el icono se vea bien en Android
          }
        ]
      },
      // Configuración para el modo desarrollo (opcional, ayuda a probar la PWA localmente)
      devOptions: {
        enabled: true
      }
    })
  ]
})