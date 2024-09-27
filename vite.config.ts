import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/todolist/',
  plugins: [vue()],

  // 要求啟動時自動開啟瀏覽器
  server: {
    open: true,
  },
})
