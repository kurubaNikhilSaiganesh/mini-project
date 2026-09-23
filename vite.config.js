import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages deployment needs the repo name as base path
// Set GITHUB_PAGES=true in the deploy workflow env
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // When deploying to GitHub Pages, set base to your repo name
  // e.g. if your repo is github.com/yourname/mini-project → base: '/mini-project/'
  base: isGitHubPages ? '/mini-project/' : '/',

  server: {
    host: true,
    port: 5173,
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
