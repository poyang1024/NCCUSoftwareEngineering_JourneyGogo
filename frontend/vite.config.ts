/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    target: 'esnext'  // 添加這一行來指定目標環境
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTest.ts'],
    coverage: {
      reporter: ['text', 'json', 'html', 'cobertura'],
    },
  },
})
