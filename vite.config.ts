import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@sharedComponents": path.resolve(__dirname, "src/shared"), // Adjust if needed
      "@scss": path.resolve(__dirname, "src/scss"),
      "@context": path.resolve(__dirname, "src/context"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@generator": path.resolve(__dirname, "src/generator"),
      "@api": path.resolve(__dirname, "src/api"),
      "@lib": path.resolve(__dirname, "src/lib"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "@scss/root.scss";`, // Auto-import a global SCSS file
      },
    },
  },
});
