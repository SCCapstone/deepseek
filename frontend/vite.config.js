import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
    plugins: [
        react(),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
          provider: 'c8',
        },
    },
    server: {
        host: true,
        port: 4000,
    },
    build: {
        outDir: 'build',
    },
});