import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (/react(-dom|-router|-router-dom)?/.test(id)) return "react";
          if (id.includes("@mui") || id.includes("@emotion")) return "mui";
          return "vendor";
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    environmentOptions: {
      jsdom: {
        url: "http://localhost"
      }
    },
    env: {
      VITE_API_URL: "http://localhost:8080"
    }
  }
})