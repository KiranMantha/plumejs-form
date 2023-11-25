import path from "path";

import { defineConfig } from "vite";
export default defineConfig({
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "PlumeJS-Forms",
      fileName: () => "index.js",
      formats: ["es"],
    },
  },
});
