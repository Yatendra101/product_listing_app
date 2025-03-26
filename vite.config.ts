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
  base: "/", // ✅ Fix for Vercel

  // ✅ Only enable `server` settings for development
  ...(mode === "development" && {
    server: {
      host: true,
      port: 3000,
    },
  }),
}));
