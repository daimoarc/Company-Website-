import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// BASE_PATH is only set by the GitHub Pages workflow, which serves the site from /Company-Website-/.
// Every other build (local and the Namecheap upload) keeps the root path.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
