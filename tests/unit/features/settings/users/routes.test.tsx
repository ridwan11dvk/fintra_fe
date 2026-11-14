import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/settings/users/pages/user.page", () => ({
  UserPage: () => <div data-testid="user-page">User Page</div>,
}));

vi.mock("@/features/settings/users/pages/add-internal.page", () => ({
  AddInternalUserPage: () => <div data-testid="add-internal-page">Add Internal</div>,
}));

vi.mock("@/features/settings/users/pages/add-external.page", () => ({
  AddExternalUserPage: () => <div data-testid="add-external-page">Add External</div>,
}));

vi.mock("@/features/settings/users/pages/show-internal.page", () => ({
  ShowInternalUserPage: () => <div data-testid="show-internal-page">Show Internal</div>,
}));

vi.mock("@/features/settings/users/pages/show-external.page", () => ({
  ShowExternalUserPage: () => <div data-testid="show-external-page">Show External</div>,
}));

vi.mock("@/features/settings/users/pages/edit-internal.page", () => ({
  EditInternalUserPage: () => <div data-testid="edit-internal-page">Edit Internal</div>,
}));

vi.mock("@/features/settings/users/pages/edit-external.page", () => ({
  EditExternalUserPage: () => <div data-testid="edit-external-page">Edit External</div>,
}));

import { usersRoutes } from "@/features/settings/users/routes";

describe("usersRoutes", () => {
  it("renders UserPage at /setting/user", async () => {
    render(
      <Suspense fallback={null}>
        <MemoryRouter initialEntries={["/setting/user"]}>
          <Routes>
            <Route path="/setting">{usersRoutes}</Route>
          </Routes>
        </MemoryRouter>
      </Suspense>,
    );
    expect(await screen.findByTestId("user-page")).toBeInTheDocument();
  });

  it("renders AddInternalUserPage at /setting/user/internal/add", async () => {
    render(
      <Suspense fallback={null}>
        <MemoryRouter initialEntries={["/setting/user/internal/add"]}>
          <Routes>
            <Route path="/setting">{usersRoutes}</Route>
          </Routes>
        </MemoryRouter>
      </Suspense>,
    );
    expect(await screen.findByTestId("add-internal-page")).toBeInTheDocument();
  });

  it("renders ShowInternalUserPage at /setting/user/internal/1", async () => {
    render(
      <Suspense fallback={null}>
        <MemoryRouter initialEntries={["/setting/user/internal/1"]}>
          <Routes>
            <Route path="/setting">{usersRoutes}</Route>
          </Routes>
        </MemoryRouter>
      </Suspense>,
    );
    expect(await screen.findByTestId("show-internal-page")).toBeInTheDocument();
  });

  it("renders EditInternalUserPage at /setting/user/internal/1/edit", async () => {
    render(
      <Suspense fallback={null}>
        <MemoryRouter initialEntries={["/setting/user/internal/1/edit"]}>
          <Routes>
            <Route path="/setting">{usersRoutes}</Route>
          </Routes>
        </MemoryRouter>
      </Suspense>,
    );
    expect(await screen.findByTestId("edit-internal-page")).toBeInTheDocument();
  });

  it("renders AddExternalUserPage at /setting/user/external/add", async () => {
    render(
      <Suspense fallback={null}>
        <MemoryRouter initialEntries={["/setting/user/external/add"]}>
          <Routes>
            <Route path="/setting">{usersRoutes}</Route>
          </Routes>
        </MemoryRouter>
      </Suspense>,
    );
    expect(await screen.findByTestId("add-external-page")).toBeInTheDocument();
  });

  it("renders ShowExternalUserPage at /setting/user/external/1", async () => {
    render(
      <Suspense fallback={null}>
        <MemoryRouter initialEntries={["/setting/user/external/1"]}>
          <Routes>
            <Route path="/setting">{usersRoutes}</Route>
          </Routes>
        </MemoryRouter>
      </Suspense>,
    );
    expect(await screen.findByTestId("show-external-page")).toBeInTheDocument();
  });

  it("renders EditExternalUserPage at /setting/user/external/1/edit", async () => {
    render(
      <Suspense fallback={null}>
        <MemoryRouter initialEntries={["/setting/user/external/1/edit"]}>
          <Routes>
            <Route path="/setting">{usersRoutes}</Route>
          </Routes>
        </MemoryRouter>
      </Suspense>,
    );
    expect(await screen.findByTestId("edit-external-page")).toBeInTheDocument();
  });
});
