import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import WindiCSS from "vite-plugin-windicss";
import analyze from "rollup-plugin-analyzer";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), WindiCSS()],
  build: {
    rollupOptions: {
      plugins: [analyze({ summaryOnly: true })],
    },
  },
});
