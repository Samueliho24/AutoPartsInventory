import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

<<<<<<< Updated upstream
// https://vite.dev/config/
=======
>>>>>>> Stashed changes
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
  },
})
