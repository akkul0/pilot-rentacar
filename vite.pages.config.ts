import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import meta from "./src/app-meta.json";

const base = "/pilot-rentacar/";
const local = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  root: local("./pages"),
  base,
  publicDir: local("./public"),
  resolve: { alias: { "@": local("./src") } },
  build: { outDir: local("./dist-pages"), emptyOutDir: true },
  plugins: [
    {
      name: "pages-asset-paths",
      enforce: "pre",
      transform(code, id) {
        if (!id.replaceAll("\\", "/").includes("/src/") || !/\.[jt]sx?(?:\?|$)/.test(id)) return;
        return { code: code.replace(/(["'`])\/assets\//g, `$1${base}assets/`), map: null };
      },
      transformIndexHtml(html) {
        const escape = (s: string) => s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        return html.replace("<title>Pilot Rent a Car</title>", `<title>${escape(meta.og_title)}</title>\n<meta name="description" content="${escape(meta.og_description)}" />\n<meta property="og:title" content="${escape(meta.og_title)}" />\n<meta property="og:description" content="${escape(meta.og_description)}" />\n<meta property="og:image" content="https://akkul0.github.io${base}assets/brand/og.png" />`);
      },
    },
    react(),
    tailwindcss(),
  ],
});
