// Standalone app locations of the Module Federation remotes consumed by this
// host. Keep `REMOTE_MODULES` in sync with the `remotes` block in
// vite.config.ts: a module's standalone app lives at the origin of its remote
// entry URL, e.g. VITE_PAYABLE_ENTRY_URL=https://payable-railfinance-alpha.kai.id/remoteEntry.js
// → https://payable-railfinance-alpha.kai.id

export type RemoteModuleName = "payable" | "tax";

const REMOTE_MODULES: readonly RemoteModuleName[] = ["payable", "tax"];

// Mirrors the localhost fallback ports of the remotes in vite.config.ts.
// Entry URLs are read from env when present (the exact VITE_ key per module),
// see .env.example.
const FALLBACK_PORTS: Record<RemoteModuleName, number> = {
  payable: 3001,
  tax: 3002,
};

// Reads the module entry URL on every call (instead of freezing it at module
// load): env values are static after the Vite build, but vitest stubs
// import.meta.env per test.
function entryUrlFromEnv(module: RemoteModuleName): string | undefined {
  if (module === "payable") return import.meta.env.VITE_PAYABLE_ENTRY_URL;
  return import.meta.env.VITE_TAX_ENTRY_URL;
}

// Last remote module the MF runtime reported as failed. sessionStorage keeps
// it across the recovery reloads, for the exhausted fallback to explain which
// module's standalone app the user can fall back to.
const LAST_FAILED_REMOTE_MODULE_KEY = "fintra.mf.lastFailedRemote";

export interface FailedRemoteModuleInfo {
  module: RemoteModuleName;
  appOrigin: string;
}

function entryUrlFor(module: RemoteModuleName): string {
  const fromEnv = entryUrlFromEnv(module);
  if (fromEnv) {
    try {
      return new URL(fromEnv).toString();
    } catch {
      // Invalid configured value — use the vite.config localhost fallback.
    }
  }
  return `http://localhost:${FALLBACK_PORTS[module]}/remoteEntry.js`;
}

function extractRemoteModuleName(moduleId: string): RemoteModuleName | null {
  const name = moduleId.split("/")[0]?.trim().toLowerCase();
  return name === "payable" || name === "tax" ? name : null;
}

// Records the remote module whose load failed (MF runtime id like
// "payable/PayableRoutes"). Unknown module names are ignored.
export function recordFailedRemoteModule(moduleId: string): void {
  const module = extractRemoteModuleName(moduleId);
  if (!module) return;
  try {
    sessionStorage.setItem(LAST_FAILED_REMOTE_MODULE_KEY, module);
  } catch {
    // sessionStorage may be unavailable (Safari private mode); the fallback
    // simply cannot target a module app then — not a reason to break recovery.
  }
}

function remoteModuleFromMessage(error: unknown): RemoteModuleName | null {
  const message = error instanceof Error ? error.message : "";
  const urlMatch = /https?:\/\/\S+/i.exec(message);
  if (!urlMatch) return null;
  let urlHost: string;
  try {
    urlHost = new URL(urlMatch[0]).host;
  } catch {
    return null;
  }
  return (
    REMOTE_MODULES.find((module) => {
      try {
        return new URL(entryUrlFor(module)).host === urlHost;
      } catch {
        return false;
      }
    }) ?? null
  );
}

// Resolves which remote module's standalone app the user can open when the
// recovery attempts are exhausted: prefers the module recorded by the MF
// runtime plugin, and falls back to matching the failing URL in the error
// message against the configured entry URLs. Returns null when no module
// can be determined.
export function resolveFailedRemoteModuleApp(
  error?: Error | null,
): FailedRemoteModuleInfo | null {
  const recorded = sessionStorage.getItem(LAST_FAILED_REMOTE_MODULE_KEY) ?? "";
  const module =
    extractRemoteModuleName(recorded) ?? remoteModuleFromMessage(error);
  if (!module) return null;
  let appOrigin: string;
  try {
    appOrigin = new URL(entryUrlFor(module)).origin;
  } catch {
    return null;
  }
  return { module, appOrigin };
}
