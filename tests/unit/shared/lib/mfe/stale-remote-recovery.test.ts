import staleRemoteRecoveryPlugin from "@/shared/lib/mfe/stale-remote-recovery-plugin";
import { isRemoteLoadFailure } from "@/shared/lib/mfe/remote-load-failure";
import { resolveFailedRemoteModuleApp } from "@/shared/lib/mfe/remote-modules";
import {
  installRemoteLoadFailureRecovery,
  readRemoteUpdateReloadStatus,
  recordRemoteUpdateManualReload,
  requestRemoteUpdateReload,
  resetReloadPage,
  setReloadPage,
} from "@/shared/lib/mfe/pending-update-reload";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const STALE_VITE_ERROR = new TypeError(
  "Failed to fetch dynamically imported module: https://payable-railfinance-alpha.kai.id/assets/unit-verification-list.page-BWGILfDt.js",
);
const PAYABLE_ENTRY_URL =
  "https://payable-railfinance-alpha.kai.id/remoteEntry.js";

describe("isRemoteLoadFailure", () => {
  it("matches the stale dynamic import error from Vite", () => {
    expect(isRemoteLoadFailure(STALE_VITE_ERROR)).toBe(true);
  });

  it("matches MF runtime wrapped errors", () => {
    expect(isRemoteLoadFailure(new Error("ScriptNetworkError: remoteEntry"))).toBe(
      true,
    );
    expect(isRemoteLoadFailure(new Error("RUNTIME-001"))).toBe(true);
    expect(isRemoteLoadFailure(new Error("ChunkLoadError: Loading chunk 1"))).toBe(
      true,
    );
  });

  it("matches plain error strings", () => {
    expect(
      isRemoteLoadFailure(
        "Failed to fetch dynamically imported module: https://payable/remoteEntry.js",
      ),
    ).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(isRemoteLoadFailure(new TypeError("cannot read props"))).toBe(false);
    expect(isRemoteLoadFailure(new Error("network error"))).toBe(false);
    expect(isRemoteLoadFailure(undefined)).toBe(false);
    expect(isRemoteLoadFailure({ message: "RUNTIME-001" })).toBe(false);
  });
});

describe("requestRemoteUpdateReload", () => {
  const reloadMock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllTimers();
    sessionStorage.clear();
    reloadMock.mockClear();
    resetReloadPage();
    setReloadPage(reloadMock);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    resetReloadPage();
    document.getElementById("fintra-mf-update-banner")?.remove();
  });

  it("schedules one reload and shows the update banner", () => {
    expect(requestRemoteUpdateReload()).toBe(true);

    expect(
      document.getElementById("fintra-mf-update-banner")?.textContent,
    ).toContain("new version of Railfinance");

    vi.advanceTimersByTime(1_200);
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it("rate-limits right after a reload was scheduled", () => {
    expect(requestRemoteUpdateReload()).toBe(true);
    expect(requestRemoteUpdateReload()).toBe(false);
  });

  it("allows a second attempt after the cooldown", () => {
    expect(requestRemoteUpdateReload()).toBe(true);
    expect(requestRemoteUpdateReload()).toBe(false);

    vi.advanceTimersByTime(31_000);
    expect(requestRemoteUpdateReload()).toBe(true);

    expect(requestRemoteUpdateReload()).toBe(false);
  });

  it("stops scheduling after two attempts", () => {
    expect(requestRemoteUpdateReload()).toBe(true);
    vi.advanceTimersByTime(31_000);
    expect(requestRemoteUpdateReload()).toBe(true);

    vi.advanceTimersByTime(31_000);
    expect(requestRemoteUpdateReload()).toBe(false);
    expect(reloadMock).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(1_200);
  });
});

describe("remote update reload attempts", () => {
  const reloadMock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllTimers();
    sessionStorage.clear();
    reloadMock.mockClear();
    resetReloadPage();
    setReloadPage(reloadMock);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    resetReloadPage();
    document.getElementById("fintra-mf-update-banner")?.remove();
  });

  it("reports a fresh session as not exhausted", () => {
    expect(readRemoteUpdateReloadStatus()).toEqual({
      attempts: 0,
      exhausted: false,
    });
  });

  it("reports exhausted after the bounded automatic attempts", () => {
    expect(requestRemoteUpdateReload()).toBe(true);
    vi.advanceTimersByTime(1_200);
    expect(requestRemoteUpdateReload()).toBe(false);
    vi.advanceTimersByTime(31_000);
    expect(requestRemoteUpdateReload()).toBe(true);
    vi.advanceTimersByTime(1_200);

    expect(readRemoteUpdateReloadStatus()).toEqual({
      attempts: 2,
      exhausted: true,
    });
  });

  it("counts user-triggered manual reloads toward the exhausted state", () => {
    recordRemoteUpdateManualReload();
    vi.advanceTimersByTime(2_000);
    recordRemoteUpdateManualReload();

    expect(readRemoteUpdateReloadStatus()).toEqual({
      attempts: 2,
      exhausted: true,
    });
    expect(requestRemoteUpdateReload()).toBe(false);
  });

  it("rate-limits automatic reloads right after a manual reload", () => {
    recordRemoteUpdateManualReload();
    expect(requestRemoteUpdateReload()).toBe(false);
  });

  it("resets exhausted attempts once the last one is stale", () => {
    expect(requestRemoteUpdateReload()).toBe(true);
    vi.advanceTimersByTime(1_200);
    expect(requestRemoteUpdateReload()).toBe(false);
    vi.advanceTimersByTime(31_000);
    expect(requestRemoteUpdateReload()).toBe(true);
    vi.advanceTimersByTime(1_200);

    vi.advanceTimersByTime(310_000);
    expect(readRemoteUpdateReloadStatus()).toEqual({
      attempts: 0,
      exhausted: false,
    });
    expect(requestRemoteUpdateReload()).toBe(true);
    vi.advanceTimersByTime(1_200);
  });
});

describe("installRemoteLoadFailureRecovery", () => {
  const reloadMock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllTimers();
    sessionStorage.clear();
    reloadMock.mockClear();
    resetReloadPage();
    setReloadPage(reloadMock);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    resetReloadPage();
    document.getElementById("fintra-mf-update-banner")?.remove();
  });

  it("recovers on a global dynamic import failure", () => {
    const uninstall = installRemoteLoadFailureRecovery();
    window.dispatchEvent(
      new ErrorEvent("error", {
        message:
          "Failed to fetch dynamically imported module: https://payable-railfinance-alpha.kai.id/remoteEntry.js",
      }),
    );

    expect(vi.getTimerCount()).toBeGreaterThan(0);
    uninstall();
    vi.advanceTimersByTime(1_200);
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it("ignores unrelated window errors", () => {
    const timersBefore = vi.getTimerCount();
    const uninstall = installRemoteLoadFailureRecovery();
    window.dispatchEvent(
      new ErrorEvent("error", { message: "Uncaught TypeError: x is undefined" }),
    );

    expect(vi.getTimerCount()).toBe(timersBefore);
    uninstall();
  });
});

describe("staleRemoteRecoveryPlugin", () => {
  const reloadMock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllTimers();
    sessionStorage.clear();
    reloadMock.mockClear();
    resetReloadPage();
    setReloadPage(reloadMock);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    resetReloadPage();
    document.getElementById("fintra-mf-update-banner")?.remove();
  });

  it("registers under a stable plugin name", () => {
    const plugin = staleRemoteRecoveryPlugin();
    expect(plugin.name).toBe("stale-remote-recovery-plugin");
    expect(plugin.errorLoadRemote).toBeTypeOf("function");
  });

  it("requests recovery for remote load failures", async () => {
    const plugin = staleRemoteRecoveryPlugin();

    await plugin.errorLoadRemote({
      id: "payable/PayableRoutes",
      error: STALE_VITE_ERROR,
      from: "runtime",
      lifecycle: "onLoad",
    } as never);

    expect(vi.getTimerCount()).toBeGreaterThan(0);
    vi.advanceTimersByTime(1_200);
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it("records the failing remote module for the fallback", async () => {
    vi.stubEnv("VITE_PAYABLE_ENTRY_URL", PAYABLE_ENTRY_URL);
    const plugin = staleRemoteRecoveryPlugin();

    await plugin.errorLoadRemote({
      id: "payable/PayableRoutes",
      error: STALE_VITE_ERROR,
      from: "runtime",
      lifecycle: "onLoad",
    } as never);

    expect(resolveFailedRemoteModuleApp()).toEqual({
      module: "payable",
      appOrigin: "https://payable-railfinance-alpha.kai.id",
    });
    vi.unstubAllEnvs();
    sessionStorage.removeItem("fintra.mf.lastFailedRemote");
    vi.advanceTimersByTime(1_200);
  });

  it("keeps unrelated load errors flowing to the boundary", async () => {
    const timersBefore = vi.getTimerCount();
    const plugin = staleRemoteRecoveryPlugin();

    const result = await plugin.errorLoadRemote({
      id: "payable/PayableRoutes",
      error: new Error("Data source refused the connection"),
      from: "runtime",
      lifecycle: "onLoad",
    } as never);

    expect(result).toBeUndefined();
    expect(vi.getTimerCount()).toBe(timersBefore);
  });
});
