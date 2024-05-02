import path from 'path';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

export default defineConfig({
  base: './',
  plugins: [
    externalizeDeps(),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'PlumeJS-Router',
      fileName: 'index',
      formats: ['es']
    }
  }
});
