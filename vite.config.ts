import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Generated traces contain HTML; watching them reloads pages during browser QA.
  server: { watch: { ignored: ['**/output/**', '**/test-results/**', '**/*.tsbuildinfo', '**/docs/**', '**/*.md'] } },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
