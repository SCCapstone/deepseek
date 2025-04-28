import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
    plugins: [
        react(),
    ],
    test: {
        globals: true, // This enables global `describe`, `it`, `expect` functions
        environment: 'jsdom', // Use jsdom for DOM testing
        coverage: {
          provider: 'c8', // Optional: code coverage support
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