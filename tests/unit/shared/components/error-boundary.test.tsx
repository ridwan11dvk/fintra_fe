import { ErrorBoundary } from "@/shared/components/error-boundary";
import { recordFailedRemoteModule } from "@/shared/lib/mfe/remote-modules";
import { render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const RELOAD_STATE_KEY = "fintra.mf.updateReload";

function Thrower({ error }: { error: Error }): never {
  throw error;
}

const REMOTE_LOAD_ERROR = new TypeError(
  "Failed to fetch dynamically imported module: https://remote/remoteEntry.js",
);

describe("ErrorBoundary fallbacks", () => {
  let consoleErrorMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});
    sessionStorage.clear();
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
    vi.unstubAllEnvs();
  });

  it("shows the generic fallback for unrelated runtime errors", () => {
    render(
      <ErrorBoundary>
        <Thrower error={new TypeError("cannot read props of undefined")} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("cannot read props of undefined")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Back to dashboard" }),
    ).toBeInTheDocument();
  });

  it("shows the remote update fallback for remote load failures", () => {
    render(
      <ErrorBoundary>
        <Thrower error={REMOTE_LOAD_ERROR} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("New version available")).toBeInTheDocument();
    expect(
      screen.getByText(/Reloading automatically to get the latest version/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/may be down or unreachable/),
    ).not.toBeInTheDocument();
  });

  it("explains an unreachable update server once reload attempts are exhausted", () => {
    sessionStorage.setItem(
      RELOAD_STATE_KEY,
      JSON.stringify({ count: 2, at: Date.now() }),
    );

    render(
      <ErrorBoundary>
        <Thrower error={REMOTE_LOAD_ERROR} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Trouble loading the update")).toBeInTheDocument();
    expect(
      screen.getByText(/may be down or unreachable/),
    ).toBeInTheDocument();
    expect(screen.queryByText("New version available")).not.toBeInTheDocument();
  });

  it("links the failing module's standalone app when exhausted and known", () => {
    vi.stubEnv(
      "VITE_PAYABLE_ENTRY_URL",
      "https://payable-railfinance-alpha.kai.id/remoteEntry.js",
    );
    sessionStorage.setItem(
      RELOAD_STATE_KEY,
      JSON.stringify({ count: 2, at: Date.now() }),
    );
    recordFailedRemoteModule("payable/PayableRoutes");

    render(
      <ErrorBoundary>
        <Thrower error={REMOTE_LOAD_ERROR} />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("button", { name: "Go to payable app" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reload application" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Back to dashboard" }),
    ).toBeInTheDocument();
  });

  it("resolves the module app from the error URL when nothing was recorded", () => {
    vi.stubEnv(
      "VITE_TAX_ENTRY_URL",
      "https://tax-railfinance-alpha.kai.id/remoteEntry.js",
    );
    sessionStorage.setItem(
      RELOAD_STATE_KEY,
      JSON.stringify({ count: 2, at: Date.now() }),
    );

    render(
      <ErrorBoundary>
        <Thrower
          error={new TypeError(
            "Failed to fetch dynamically imported module: https://tax-railfinance-alpha.kai.id/assets/chunk.js",
          )}
        />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("button", { name: "Go to tax app" }),
    ).toBeInTheDocument();
  });

  it("hides the module app link when exhausted without a known module", () => {
    sessionStorage.setItem(
      RELOAD_STATE_KEY,
      JSON.stringify({ count: 2, at: Date.now() }),
    );

    render(
      <ErrorBoundary>
        <Thrower error={REMOTE_LOAD_ERROR} />
      </ErrorBoundary>,
    );

    expect(
      screen.queryByRole("button", { name: /Go to .*app/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Back to dashboard" }),
    ).toBeInTheDocument();
  });
});
