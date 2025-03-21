
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Provide explicit aliases for problematic modules
      '.prisma/client/index-browser': path.resolve(__dirname, './src/lib/prisma-browser-mock.js'),
      '@prisma/client': path.resolve(__dirname, './src/lib/prisma-browser-mock.js'),
      '.prisma/client': path.resolve(__dirname, './src/lib/prisma-browser-mock.js'),
    },
  },
  optimizeDeps: {
    exclude: ['@prisma/client', '.prisma/client', '.prisma/client/index-browser'], // Exclude Prisma completely from dependency optimization
  },
  build: {
    commonjsOptions: {
      include: [], // Don't try to bundle Prisma into client builds
    },
    rollupOptions: {
      external: ['@prisma/client', '.prisma/client', '.prisma/client/index-browser'], // Explicitly mark Prisma as external
    }
  },
}));
