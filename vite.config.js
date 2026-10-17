
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/usos-web/',
  server: {
    port: 8090,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8091',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
    },
  },
})
