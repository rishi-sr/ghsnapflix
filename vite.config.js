import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'https://www.ghsnapflix.buzz',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
});

