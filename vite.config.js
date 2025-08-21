import { defineConfig, normalizePath } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import path from "node:path";
import { terser } from "rollup-plugin-terser";

const pdfjsDistPath = path.dirname(new URL(require.resolve('pdfjs-dist/package.json'), import.meta.url).pathname);
const cMapsDir = normalizePath(path.join(pdfjsDistPath, "cmaps"));

export default defineConfig(async () => {
  const { viteStaticCopy } = await import('vite-plugin-static-copy');

  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: cMapsDir,
            dest: "",
          },
        ],
      }),
    ],
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment",
    },
    server: {
      host: "0.0.0.0",
      port: 3000, // replace with your desired port
      proxy: {
        // ...your proxy settings
      },
      historyApiFallback: true,
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..'],
        // Prevent serving files from the .git directory
        strict: true,
        disallow: ['.git'],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
        },
        plugins: [
          terser({
            compress: {
              drop_console: true, // This option removes console.log statements
            },
          }),
        ],
      },
    },
  };
});
