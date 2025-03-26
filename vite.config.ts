import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
  base: "/", // ✅ Ensure correct base path for Vercel

  // ✅ Remove dev server settings in production
  ...(mode === "development"
    ? {
        server: {
          host: true,
          port: 3000,
        },
      }
    : {}),
}));
