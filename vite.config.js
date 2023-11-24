import { defineConfig } from 'vite'
import cesium from "vite-plugin-cesium";
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
let Timestamp = (new Date()).getTime()
export default defineConfig({
  plugins: [vue(),cesium()],
  server: {
    port: 7688
  },
  root: "./",
  base: './',
  build: {
    // assetsDir: './',
    rollupOptions: {
      output: {
        chunkFileNames: `static/js/[name].[hash]${Timestamp}.js`,
        entryFileNames: `static/js/[name].[hash]${Timestamp}.js`,
        assetFileNames: `static/[ext]/[name].[hash]${Timestamp}.[ext]`,
      },
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
