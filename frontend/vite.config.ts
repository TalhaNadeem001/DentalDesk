import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: ['dentique.ngrok.app'],
    // When using ngrok, set VITE_DEV_ORIGIN=https://dentique.ngrok.app so asset/HMR URLs resolve (fixes gigantic/unstyled UI)
    ...(process.env.VITE_DEV_ORIGIN && { origin: process.env.VITE_DEV_ORIGIN }),
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
