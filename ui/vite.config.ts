import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),

VitePWA({
      registerType: 'autoUpdate', // Automatically updates SW on changes
       workbox: {
        cleanupOutdatedCaches: false,
        globIgnores: ['index.html'],
      },
      injectManifest: {
        injectionPoint: undefined, // Use default Workbox injection
      },
      devOptions: {
        enabled: true, // Enable SW in dev mode for testing
      },
      manifest: {
         "name": "سامانه تیکتینک و نوبت دهی سازمان نظام مهندسی خوزستان",
  "short_name": "سامانه تیکتینک و نوبت دهی نظام مهندسی خوزستان",
        description: 'سامانه تیکتینگ و نوبت دهی سازمان مهندسی خوزستان ',
        theme_color: '#ffffff',
         start_url: "/",
        display: "standalone",
  background_color: "#ffffff",
"icons": [
    {
      "src": "icons/icon.svg",
      "sizes": "any",
      "type": "image/png"
    }
  ],
     
      },
    }),

  ],
  define: {
    global: 'window', 
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    }
  }
})
