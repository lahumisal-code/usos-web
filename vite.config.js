
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base: '/',
    server: {
      proxy: {
        '/v1/api': {
          target: env.BACKEND_PORT_URL,
          changeOrigin: true,
        },
      },
      watch: {
        usePolling: true,
      },
    },
  }
})
