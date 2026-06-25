import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router')) return 'vendor'
            if (id.includes('framer-motion') || id.includes('lucide')) return 'ui'
            if (id.includes('supabase')) return 'supabase'
            if (id.includes('@tanstack')) return 'query'
            if (id.includes('hookform') || id.includes('zod')) return 'forms'
          }
        },
      },
    },
  },
})
