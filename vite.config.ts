import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/deploy-Stoirys/',
  plugins: [
    react(),
    nodePolyfills({
      // To exclude specific polyfills, add them to this list
      exclude: [
        // We'll handle these manually
        'process',
        'buffer',
      ],
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill specific modules
      protocolImports: true,
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
  resolve: {
    alias: {
      // Add fallbacks for common Node.js modules
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      _stream_readable: 'readable-stream/readable.js',
      _stream_writable: 'readable-stream/writable.js',
      _stream_transform: 'readable-stream/transform.js',
      _stream_duplex: 'readable-stream/duplex.js',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    include: [
      'buffer', 
      'process', 
      'stream-browserify', 
      'crypto-browserify',
      'readable-stream',
      'browserify-sign'
    ],
  },
  define: {
    global: 'globalThis',
    'process.env': process.env,
  },
})
