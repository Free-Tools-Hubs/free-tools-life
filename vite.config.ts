import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom', 'zustand', 'idb-keyval', 'lucide-react'],
          'data-life': ['./src/data/lifeTemplates.json'],
          'data-habits': ['./src/data/habitBank.json']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
