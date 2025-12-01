import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/psychology-chat-bot/', // tên repo trên GitHub
  plugins: [react(), tailwindcss()],
});
