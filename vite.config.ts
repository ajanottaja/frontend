import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import WindiCSS from 'vite-plugin-windicss'
import analyze from "rollup-plugin-analyzer";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    WindiCSS(),
  ],
  build: {
    rollupOptions: {
      plugins: [analyze({summaryOnly: true})]
    }
  }
})
