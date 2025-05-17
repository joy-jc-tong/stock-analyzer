import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/static/' : '/', // 開發用 `/`，部署用 `/static/`
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000', // 將 /api 請求轉發給 FastAPI
    },
  },
}))
