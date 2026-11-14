import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/settings/menu-management/pages/menu-management.page", () => ({
  MenuManagementPage: () => (
    <div data-testid="menu-management-page">Menu Management Page</div>
  ),
}));

import { menuManagementRoutes } from "@/features/settings/menu-management/routes";

describe("menuManagementRoutes", () => {
  it("renders MenuManagementPage at /setting/menu-management", async () => {
    render(
      <Suspense fallback={null}>
        <MemoryRouter initialEntries={["/setting/menu-management"]}>
          <Routes>
            <Route path="/setting">{menuManagementRoutes}</Route>
          </Routes>
        </MemoryRouter>
      </Suspense>,
    );

    expect(
      await screen.findByTestId("menu-management-page"),
    ).toBeInTheDocument();
  });
});
