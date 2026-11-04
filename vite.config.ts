import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: isSsrBuild
        ? undefined
        : {
            manualChunks: {
              'vendor': ['react', 'react-dom', 'react-router-dom', 'zustand', 'idb-keyval', 'lucide-react']
            }
          }
    },
    chunkSizeWarningLimit: 1000
  }
}))
