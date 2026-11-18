import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Admin berjalan di port 5174 supaya bisa dibuka berdampingan dengan toko (5173).
export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
})
