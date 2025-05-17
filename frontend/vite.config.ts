import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/static/',  // 重要：讓所有資源路徑都從 /static/ 開始
  plugins: [react()],
})
