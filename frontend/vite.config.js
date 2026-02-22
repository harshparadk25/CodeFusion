import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Target modern browsers for smaller output
    target: "es2020",
    // Enable minification
    minify: "esbuild",
    // Split vendor chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached long-term
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Animation libraries
          "vendor-animation": ["framer-motion", "gsap"],
          // UI utilities
          "vendor-ui": [
            "sonner",
            "lucide-react",
            "clsx",
            "tailwind-merge",
            "class-variance-authority",
          ],
          // Syntax highlighting (heavy, only needed in Project screen)
          "vendor-highlight": ["react-syntax-highlighter"],
          // Socket + HTTP
          "vendor-network": ["axios", "socket.io-client"],
        },
      },
    },
    // Increase chunk size warning limit (manual chunks are intentional)
    chunkSizeWarningLimit: 600,
  },
})