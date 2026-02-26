import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: 'http://localhost:5000',
=======
        // The front end can read a VITE_API_URL env variable (set in
        // `frontend/.env`). If not provided, fall back to localhost plus
        // PORT (default 5000) so the config is not hardcoded.
        target: process.env.VITE_API_URL || `http://localhost:${process.env.PORT || 5000}`,
>>>>>>> bce18cd (atlas updates)
        changeOrigin: true,
      },
    },
  },
})
