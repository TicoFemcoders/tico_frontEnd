import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    environmentOptions: {
      jsdom: { url: "http://localhost" }
    },
    env: {
      VITE_API_URL: "http://localhost:8080"
    }
  }
})