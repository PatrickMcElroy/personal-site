import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import posts from "./src/writing/posts.json" with { type: "json" };

// Emit an index.html for every client-side route so static hosts serve
// /writing/<slug> and /reading directly without rewrite rules.
function staticRoutes() {
  const routes = ["/reading", "/writing", ...posts.map((post) => `/writing/${post.slug}`)];
  let outDir = "dist";
  return {
    name: "static-routes",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const html = readFileSync(resolve(outDir, "index.html"), "utf8");
      for (const route of routes) {
        const dir = resolve(outDir, `.${route}`);
        mkdirSync(dir, { recursive: true });
        writeFileSync(resolve(dir, "index.html"), html);
      }
      writeFileSync(resolve(outDir, "404.html"), html);
    },
  };
}

export default defineConfig({
  plugins: [react(), staticRoutes()],
});
