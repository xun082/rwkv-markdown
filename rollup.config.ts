/**
 * Rollup Configuration for RWKV Markdown
 *
 * This configuration builds the package in multiple formats:
 * - CommonJS (for Node.js and older bundlers)
 * - ES Module (for modern bundlers and tree-shaking)
 */

import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

// External dependencies that should not be bundled
const external = [
  "react",
  "react/jsx-runtime",
  "hast-util-to-jsx-runtime",
  "html-url-attributes",
  "remark-parse",
  "remark-rehype",
  "unified",
  "unist-util-visit",
  "vfile",
  // Include all dependencies from package.json
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
];

// Banner comment for all output files
const banner = `/**
 * RWKV Markdown v${packageJson.version}
 * ${packageJson.description}
 * 
 * @license MIT
 * @author ${packageJson.author}
 */`;

export default defineConfig([
  // CommonJS build
  {
    input: "src/index.tsx",
    output: {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
      banner,
    },
    external,
    plugins: [
      resolve({
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false, // We'll generate .d.ts separately with tsc
        declarationMap: false,
        exclude: [
          "**/*.test.ts",
          "**/*.test.tsx",
          "**/*.spec.ts",
          "**/*.spec.tsx",
        ],
      }),
      terser({
        format: {
          comments: /^!/,
          preamble: banner,
        },
        compress: {
          drop_console: false,
          pure_funcs: ["console.log"],
        },
      }),
    ],
  },

  // ES Module build
  {
    input: "src/index.tsx",
    output: {
      file: "dist/index.mjs",
      format: "es",
      sourcemap: true,
      exports: "named",
      banner,
    },
    external,
    plugins: [
      resolve({
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        exclude: [
          "**/*.test.ts",
          "**/*.test.tsx",
          "**/*.spec.ts",
          "**/*.spec.tsx",
        ],
      }),
      terser({
        format: {
          comments: /^!/,
          preamble: banner,
        },
        compress: {
          drop_console: false,
          pure_funcs: ["console.log"],
        },
      }),
    ],
  },
]);
