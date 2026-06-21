import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      ceorl: resolve(__dirname, '../../packages/ceorl/src/index.ts'),
    },
  },
})
