import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // React/Router/Helmet change far less often than app code, so
        // splitting them into their own chunk means a routine content or
        // component edit doesn't bust the cache for a chunk that hasn't
        // actually changed — repeat visitors keep this cached across
        // deploys. Supabase deliberately stays OUT of this shared vendor
        // chunk: it should only ever load for /admin, /student, and
        // /reset-password (see src/routes/), and a manualChunks rule keyed
        // on package name alone would pull it back into whatever chunk
        // first imports it, silently undoing that split.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) return undefined;
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('react-router') || id.includes('react-helmet-async')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
})
