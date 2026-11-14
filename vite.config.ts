import { federation } from "@module-federation/vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // .env* files are NOT loaded automatically while vite.config.ts is evaluated,
  // so we load them explicitly (VITE_ prefixed variables only).
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
      federation({
        name: "railfinance",
        // Keep the host React/renderer pair when remote containers register.
        // Eager remote negotiation can replace React after the renderer loads.
        shareStrategy: "loaded-first",
        filename: "remoteEntry.js",
        dts: false,
        runtimePlugins: [
          "./src/shared/lib/mfe/stale-remote-recovery-plugin.ts",
        ],
        remotes: {
          payable: {
            type: "module",
            name: "payable",
            entry:
              env.VITE_PAYABLE_ENTRY_URL ??
              "http://localhost:3001/remoteEntry.js",
            entryGlobalName: "payable",
            shareScope: "default",
          },
          tax: {
            type: "module",
            name: "tax",
            entry:
              env.VITE_TAX_ENTRY_URL ?? "http://localhost:3002/remoteEntry.js",
            entryGlobalName: "tax",
            shareScope: "default",
          },
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: "*",
          },
          "react-dom": {
            singleton: true,
            requiredVersion: "*",
          },

          sonner: {
            singleton: true,
            requiredVersion: "*",
          },
          "react-router": { singleton: true },
          "@tanstack/react-query": { singleton: true },
          "@tanstack/react-table": { singleton: true },

          // @railfinance/core/runtime TIDAK di-share: MF-vite meng-inline semua
          // dependency bare (react, @tanstack/react-query, axios, i18next, lucide,
          // zod) ke dalam fallback loadShare + membuat duplikat react/query per
          // paket. State lintas-bundle tetap aman karena context & singleton core
          // di-globalize (Symbol.for / globalThis), dan react/query/i18n tetap
          // singleton via shared config di bawah ini.

          "react-i18next": {
            singleton: true,
            eager: true,
          },
          i18next: {
            singleton: true,
            eager: true,
          },
          clsx: { singleton: true },
          "tailwind-merge": { singleton: true },
          // @railfinance/core chunks read shared bindings at module top-level
          // (e.g. `var p = Combobox.Root`, `var d = Direction.useDirection`,
          // `await i18n.use(initReactI18next).init()`), so these shares must be
          // populated synchronously — the async loadShare fallback leaves
          // exports undefined during module evaluation.
          "radix-ui": {
            singleton: true,
            requiredVersion: "*",
          },
          // "@base-ui/react": {
          //   singleton: true,
          //   requiredVersion: "*",
          // },
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: {
      port: env.VITE_PORT ? Number(env.VITE_PORT) : 5173,
      origin: env.VITE_ORIGIN ?? "http://localhost:5173",
    },
    build: {
      target: "esnext",
    },
    optimizeDeps: {
      include: [
        "i18next",
        "react-i18next",
        // CJS proxy files (conditional require) must be esbuild-prebundled,
        // otherwise named exports (useSyncExternalStore) are lost when the
        // dev server serves them raw for importers like @base-ui/utils/store.
        "use-sync-external-store/shim",
        "use-sync-external-store/shim/with-selector",
      ],
      exclude: ["react", "react-dom"],
    },
  };
});
