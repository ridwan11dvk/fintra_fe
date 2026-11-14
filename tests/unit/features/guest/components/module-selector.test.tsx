import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  isAuthenticated: true,
  moduleLinks: [] as Array<{ id: number; name: string; url: string }>,
}));

vi.mock("@railfinance/core", () => ({
  useAuth: () => ({ isAuthenticated: state.isAuthenticated }),
}));

vi.mock("@railfinance/core/access-request", () => ({
  RequestAccessForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <button onClick={onSuccess}>Request Access Form</button>
  ),
}));

vi.mock("@railfinance/core/lib", () => ({
  getModuleLink: () => state.moduleLinks,
}));

import { ModuleSelector } from "@/features/guest/components/module-selector";

function renderWithRoutes() {
  return render(
    <Routes>
      <Route path="/select-module" element={<ModuleSelector />} />
      <Route path="/login" element={<div data-testid="login-page">Login</div>} />
      <Route path="/" element={<div data-testid="home-page">Home</div>} />
      <Route path="/m1" element={<div data-testid="m1-page">M1</div>} />
      <Route path="/m2" element={<div data-testid="m2-page">M2</div>} />
    </Routes>,
    { initialEntries: ["/select-module"] },
  );
}

describe("ModuleSelector", () => {
  beforeEach(() => {
    state.isAuthenticated = true;
    state.moduleLinks = [];
  });

  it("redirects to login when not authenticated", () => {
    state.isAuthenticated = false;

    renderWithRoutes();

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("renders request access form when authenticated but has no modules", async () => {
    const user = userEvent.setup();

    renderWithRoutes();

    expect(screen.getByText("Request Access Form")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /request access form/i }));
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("redirects to the only module when exactly one module is available", () => {
    state.moduleLinks = [{ id: 1, name: "Module 1", url: "/m1" }];

    renderWithRoutes();

    expect(screen.getByTestId("m1-page")).toBeInTheDocument();
  });

  it("renders module chooser when multiple modules are available", () => {
    state.moduleLinks = [
      { id: 1, name: "Module 1", url: "/m1" },
      { id: 2, name: "Module 2", url: "/m2" },
    ];

    renderWithRoutes();

    expect(screen.getByText("Choose your module")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /module 1/i })).toHaveAttribute(
      "href",
      "/m1",
    );
    expect(screen.getByRole("link", { name: /module 2/i })).toHaveAttribute(
      "href",
      "/m2",
    );
  });
});
