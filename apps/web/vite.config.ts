import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      // Enable polling only when explicitly requested via environment variable
      // Polling impacts performance but may be needed for Docker on some systems
      usePolling: process.env.VITE_USE_POLLING === 'true',
    },
  },
});
