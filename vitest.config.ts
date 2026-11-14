import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";

import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  define: {
    // Provide a test base URL for Axios instance
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
      "http://localhost:3000",
    ),
  },
  test: {
    globals: true,
    environment: "jsdom",
    maxWorkers: process.env.MAX_WORKERS ?? "50%",
    testTimeout: 20000,
    setupFiles: ["./tests/unit/setup.ts"],
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "playwright", "dist"],
    reporters: [
      "default",
      ["json", { outputFile: ".output/tests/unit/test-results.json" }],
    ],
    coverage: {
      provider: "v8",
      reportOnFailure: true,
      reporter: ["text", "html", "lcov", "json", "json-summary"],
      reportsDirectory: ".output/tests/coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/main.tsx",
        "src/**/*.handlers.ts",
        "src/**/*.types.ts",
        "src/**/*.nav.ts",
        "src/**/*.schema.ts",
        "src/shared/types/**",
        "src/shared/constants/**",
        "tests/unit/**",
        "src/app/**",
        "src/**/index.ts",
        "src/**/routes.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tests": path.resolve(__dirname, "./tests"),
    },
  },
});
