import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), svgr()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@constants": "/src/constants",
      "@config": "/src/config",
      "@pages": "/src/pages",
      "@types": "/src/types",
      "@store": "/src/store",
      "app.route": "/src/app.route.tsx",
    },
  },
});
