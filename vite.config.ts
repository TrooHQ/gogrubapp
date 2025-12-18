import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Change this to your desired port
    host: true,
    open: false, // Disable auto-open to prevent clipboard operations
  },
  preview: {
    port: 5174,
    host: true,
    open: false,
  },
})
