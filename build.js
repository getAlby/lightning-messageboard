import * as esbuild from "esbuild";
import { existsSync, mkdirSync } from "fs";

// Ensure the dist directory exists
if (!existsSync("./dist")) {
  mkdirSync("./dist", { recursive: true });
}

const watch = process.argv.includes("--watch");
const minify = !watch;

// Bundle the component
const buildOptions = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  minify,
  format: "esm",
  target: ["es2019"],
  outfile: "./dist/index.js",
  platform: "browser",
  sourcemap: !minify,
  external: [], // We want to bundle everything
  define: {
    "process.env.NODE_ENV": minify ? '"production"' : '"development"',
  },
  loader: {
    ".css": "text",
    ".svg": "text",
  },
};

if (watch) {
  // Watch mode
  const context = await esbuild.context(buildOptions);
  await context.watch();
  console.log("Watching for changes...");
} else {
  // Build once
  await esbuild.build(buildOptions);
  console.log("Build complete");
}
