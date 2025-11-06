import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ⚙️ Configuración principal de Vite
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0', // permite acceder desde la red local
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'), // permite usar @ para rutas relativas
    },
  },
  build: {
    outDir: 'dist', // carpeta final del build
  },
  base: './', // 👈 Clave para Netlify: usa rutas relativas
});

// 🛠️ Post-build: crea automáticamente el archivo _redirects dentro de dist
// Esto evita errores 404 en Netlify al recargar rutas
const redirectsPath = path.resolve(__dirname, 'dist', '_redirects');
const redirectsContent = '/*    /index.html   200\n';
try {
  fs.mkdirSync(path.dirname(redirectsPath), { recursive: true });
  fs.writeFileSync(redirectsPath, redirectsContent);
  console.log('✅ Archivo _redirects generado correctamente en /dist');
} catch (error) {
  console.error('⚠️ Error al generar _redirects:', error);
}
