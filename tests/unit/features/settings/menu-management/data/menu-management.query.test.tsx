import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  const { buildUiResponseMock } =
    await import("@tests/unit/mocks/ui-response-mock");
  return buildUiResponseMock(actual);
});

const BASE = "http://localhost:3000";
const MENU_BASE_URL = `${BASE}/master/navigation`;

import {
  menuManagementQueryKeys,
  useCreateMenu,
  useDeleteMenu,
  useMenu,
  useMenus,
  useMenuTree,
  useReorderMenus,
  useUpdateMenu,
} from "@/features/settings/menu-management/data/menu-management.query";

const payload = {
  code: "NEW_MENU",
  title: "New Menu",
  titleEn: null,
  url: "/new",
  icon: null,
  type: "MENU" as const,
  category: "USER_MENU" as const,
  sortOrder: 1,
  openInNewTab: false,
  badge: null,
  parentId: null,
  featureId: null,
  moduleId: null,
};

function renderWithClient(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("menuManagementQueryKeys", () => {
  it("returns expected keys", () => {
    expect(menuManagementQueryKeys.all).toEqual(["menu-management"]);
    expect(menuManagementQueryKeys.menus()).toEqual(["menu-management", "menus"]);
    expect(menuManagementQueryKeys.menuTree()).toEqual([
      "menu-management",
      "tree",
    ]);
    expect(menuManagementQueryKeys.menu(1)).toEqual([
      "menu-management",
      "menu",
      1,
    ]);
  });
});

function MenuTreeProbe() {
  const query = useMenuTree();
  if (query.isLoading) return <div>loading</div>;
  if (query.isError) return <div>error</div>;
  return <div data-testid="tree-count">{query.data?.length ?? 0}</div>;
}

function MenusProbe() {
  const query = useMenus();
  if (query.isLoading) return <div>loading</div>;
  if (query.isError) return <div>error</div>;
  return <div data-testid="menus-count">{query.data?.length ?? 0}</div>;
}

function MenuProbe({ id, enabled = true }: { id: number; enabled?: boolean }) {
  const query = useMenu(id, enabled);
  if (query.fetchStatus === "idle") return <div data-testid="idle">idle</div>;
  if (query.isLoading) return <div>loading</div>;
  if (query.isError) return <div>error</div>;
  return <div data-testid="menu-id">{query.data?.id}</div>;
}

describe("menu-management queries", () => {
  it("useMenuTree fetches menu tree", async () => {
    renderWithClient(<MenuTreeProbe />);

    await waitFor(() =>
      expect(screen.getByTestId("tree-count")).toHaveTextContent("2"),
    );
  });

  it("useMenus fetches flattened menus", async () => {
    renderWithClient(<MenusProbe />);

    await waitFor(() =>
      expect(screen.getByTestId("menus-count")).toHaveTextContent("3"),
    );
  });

  it("useMenu fetches menu by id when enabled", async () => {
    renderWithClient(<MenuProbe id={1} />);

    await waitFor(() =>
      expect(screen.getByTestId("menu-id")).toHaveTextContent("1"),
    );
  });

  it("useMenu does not fetch when disabled", async () => {
    renderWithClient(<MenuProbe id={1} enabled={false} />);

    expect(screen.getByTestId("idle")).toBeInTheDocument();
  });
});

function CreateProbe() {
  const mutation = useCreateMenu();
  return <button onClick={() => mutation.mutate(payload)}>create</button>;
}

function UpdateProbe() {
  const mutation = useUpdateMenu();
  return (
    <button onClick={() => mutation.mutate({ id: 1, data: payload })}>
      update
    </button>
  );
}

function ReorderProbe() {
  const mutation = useReorderMenus();
  return (
    <button
      onClick={() =>
        mutation.mutate({ items: [{ id: 1, parentId: null, sortOrder: 1 }] })
      }
    >
      reorder
    </button>
  );
}

function DeleteProbe() {
  const mutation = useDeleteMenu();
  return <button onClick={() => mutation.mutate(1)}>delete</button>;
}

describe("menu-management mutations", () => {
  it("useCreateMenu shows success toast on success", async () => {
    const user = userEvent.setup();
    const { toast } = await import("sonner");
    renderWithClient(<CreateProbe />);

    await user.click(screen.getByRole("button", { name: "create" }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Menu created successfully"),
    );
  });

  it("useCreateMenu shows error toast on failure", async () => {
    const user = userEvent.setup();
    const { toast } = await import("sonner");
    server.use(
      http.post(MENU_BASE_URL, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );

    renderWithClient(<CreateProbe />);
    await user.click(screen.getByRole("button", { name: "create" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to create menu"),
    );
  });

  it("useUpdateMenu shows success toast on success", async () => {
    const user = userEvent.setup();
    const { toast } = await import("sonner");
    renderWithClient(<UpdateProbe />);

    await user.click(screen.getByRole("button", { name: "update" }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Menu updated successfully"),
    );
  });

  it("useUpdateMenu shows error toast on failure", async () => {
    const user = userEvent.setup();
    const { toast } = await import("sonner");
    server.use(
      http.put(`${MENU_BASE_URL}/:id`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );

    renderWithClient(<UpdateProbe />);
    await user.click(screen.getByRole("button", { name: "update" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to update menu"),
    );
  });

  it("useReorderMenus shows success toast on success", async () => {
    const user = userEvent.setup();
    const { toast } = await import("sonner");
    renderWithClient(<ReorderProbe />);

    await user.click(screen.getByRole("button", { name: "reorder" }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Menu order updated successfully",
      ),
    );
  });

  it("useReorderMenus shows error toast on failure", async () => {
    const user = userEvent.setup();
    const { toast } = await import("sonner");
    server.use(
      http.post(`${MENU_BASE_URL}/reorder`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );

    renderWithClient(<ReorderProbe />);
    await user.click(screen.getByRole("button", { name: "reorder" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to reorder menus"),
    );
  });

  it("useDeleteMenu shows success toast on success", async () => {
    const user = userEvent.setup();
    const { toast } = await import("sonner");
    renderWithClient(<DeleteProbe />);

    await user.click(screen.getByRole("button", { name: "delete" }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Menu deleted successfully"),
    );
  });

  it("useDeleteMenu shows error toast on failure", async () => {
    const user = userEvent.setup();
    const { toast } = await import("sonner");
    server.use(
      http.delete(`${MENU_BASE_URL}/:id`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );

    renderWithClient(<DeleteProbe />);
    await user.click(screen.getByRole("button", { name: "delete" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to delete menu"),
    );
  });
});
