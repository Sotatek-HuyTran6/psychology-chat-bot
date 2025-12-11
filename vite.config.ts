import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/', // tên repo trên GitHub
  plugins: [react(), tailwindcss()],
  esbuild: {
    // Bỏ qua lỗi TypeScript khi build
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    // Bỏ qua các warning khi build
    rollupOptions: {
      onwarn(warning, warn) {
        // Bỏ qua các warning không quan trọng
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.code === 'UNRESOLVED_IMPORT') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
