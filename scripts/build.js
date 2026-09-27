import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

async function runBuild() {
  console.log('Building Clearly Extension UI, Background, Side Panel & PDF Reader...');

  // Build Popup, Options, Side Panel, PDF Reader & Background
  await build({
    configFile: false,
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          { src: 'manifest.json', dest: '.' },
          { src: 'public/*', dest: '.' },
          { src: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs', dest: '.' },
        ],
      }),
    ],
    resolve: {
      alias: { '@': resolve('src') },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          popup: resolve('popup.html'),
          options: resolve('options.html'),
          sidepanel: resolve('sidepanel.html'),
          reader: resolve('reader.html'),
          background: resolve('src/background/index.ts'),
        },
        output: {
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === 'background') return 'background.js';
            return 'assets/[name]-[hash].js';
          },
        },
      },
    },
  });

  console.log('Building Standalone Isolated Content Script (IIFE)...');

  // Build Content Script as a standalone single IIFE file with React bundled inline
  await build({
    configFile: false,
    plugins: [react()],
    resolve: {
      alias: { '@': resolve('src') },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      rollupOptions: {
        input: resolve('src/content/index.ts'),
        output: {
          format: 'iife',
          entryFileNames: 'content.js',
          extend: true,
        },
      },
    },
  });

  console.log('Extension build completed successfully!');
}

runBuild().catch((err) => {
  console.error('Build error:', err);
  process.exit(1);
});
