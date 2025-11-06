import path from "path";
import fs from "fs";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
    base: "./", // 👈 Esto es CLAVE para que funcione en Netlify
  };
});

// 🔧 Crear automáticamente el archivo _redirects en /dist
const redirectsPath = path.resolve(__dirname, "dist", "_redirects");
const redirectsContent = "/*    /index.html   200";
fs.mkdirSync(path.dirname(redirectsPath), { recursive: true });
fs.writeFileSync(redirectsPath, redirectsContent);
console.log("✅ Archivo _redirects generado en /dist");
