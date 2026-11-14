import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { MemoryRouter, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/guest/pages/home.page", () => ({
  HomePage: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock("@/features/guest/pages/select-module.page", () => ({
  SelectModulePage: () => (
    <div data-testid="select-module-page">Select Module Page</div>
  ),
}));

import { guestRoutes } from "@/features/guest/routes";

describe("guestRoutes", () => {
  it("renders HomePage at /", async () => {
    render(
      <Suspense fallback={null}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>{guestRoutes}</Routes>
        </MemoryRouter>
      </Suspense>,
    );

    expect(await screen.findByTestId("home-page")).toBeInTheDocument();
  });

  it("renders SelectModulePage at /select-module", async () => {
    render(
      <Suspense fallback={null}>
        <MemoryRouter initialEntries={["/select-module"]}>
          <Routes>{guestRoutes}</Routes>
        </MemoryRouter>
      </Suspense>,
    );

    expect(await screen.findByTestId("select-module-page")).toBeInTheDocument();
  });
});
