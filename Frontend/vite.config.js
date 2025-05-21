// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcssVite from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url"; 

export default defineConfig({
  plugins: [react(), tailwindcssVite()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Or if you used the 'path' module:
      // '@': path.resolve(__dirname, './src')
    },
  },
});
