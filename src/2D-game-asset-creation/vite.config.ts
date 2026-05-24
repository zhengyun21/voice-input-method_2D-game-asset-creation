import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api/deepseek': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
      },
      '/api/zhipu': {
        target: 'https://open.bigmodel.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/zhipu/, '/api/paas/v4'),
      },
    },
  },
})
