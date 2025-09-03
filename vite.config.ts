import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), svgr()],
  server: {
    https: process.env.HTTPS === 'true' ? {
      key: fs.readFileSync(path.resolve(__dirname, 'mkcert/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'mkcert/cert.pem')),
    } : undefined,
    host: true,
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://api.stopusing.klr.kr',
        changeOrigin: true,
        secure: true,
      },
      '/login': {
        target: 'https://api.stopusing.klr.kr',
        changeOrigin: true,
        secure: true,
      },
      '/oauth2': {
        target: 'https://api.stopusing.klr.kr',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
