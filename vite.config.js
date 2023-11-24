import { defineConfig } from 'vite'
import cesium from "vite-plugin-cesium";
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),cesium()],
  server: {
    port: 7688
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
