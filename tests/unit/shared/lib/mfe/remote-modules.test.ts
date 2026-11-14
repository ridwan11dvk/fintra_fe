import {
  recordFailedRemoteModule,
  resolveFailedRemoteModuleApp,
} from "@/shared/lib/mfe/remote-modules";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const PAYABLE_ENTRY = "https://payable-railfinance-alpha.kai.id/remoteEntry.js";
const TAX_ENTRY = "https://tax-railfinance-alpha.kai.id/remoteEntry.js";

describe("remote modules", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubEnv("VITE_PAYABLE_ENTRY_URL", PAYABLE_ENTRY);
    vi.stubEnv("VITE_TAX_ENTRY_URL", TAX_ENTRY);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("resolves a recorded remote module id to its standalone app origin", () => {
    recordFailedRemoteModule("payable/PayableRoutes");

    expect(resolveFailedRemoteModuleApp()).toEqual({
      module: "payable",
      appOrigin: "https://payable-railfinance-alpha.kai.id",
    });
  });

  it("ignores unknown remote module ids", () => {
    recordFailedRemoteModule("treasury/TreasuryRoutes");

    expect(resolveFailedRemoteModuleApp()).toBeNull();
  });

  it("matches the failing module from the error URL when nothing is recorded", () => {
    const error = new TypeError(
      "Failed to fetch dynamically imported module: https://tax-railfinance-alpha.kai.id/assets/chunk-123.js",
    );

    expect(resolveFailedRemoteModuleApp(error)).toEqual({
      module: "tax",
      appOrigin: "https://tax-railfinance-alpha.kai.id",
    });
  });

  it("gives the latest failing module precedence", () => {
    recordFailedRemoteModule("tax/TaxRoutes");
    recordFailedRemoteModule("payable/PayableRoutes");

    expect(resolveFailedRemoteModuleApp()?.module).toBe("payable");
  });

  it("returns null when no module can be determined", () => {
    expect(resolveFailedRemoteModuleApp(new Error("ScriptNetworkError"))).toBeNull();
  });

  it("falls back to the localhost entry of vite.config.ts when env is blank", () => {
    vi.stubEnv("VITE_TAX_ENTRY_URL", "");
    recordFailedRemoteModule("tax/TaxRoutes");

    expect(resolveFailedRemoteModuleApp()?.appOrigin).toBe(
      "http://localhost:3002",
    );
  });
});
