import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MenuManagementPage } from "@/features/settings/menu-management/pages/menu-management.page";
import type { NavigationMenuItem } from "@/features/settings/menu-management/data/menu-management.types";

const mockCreateMutate = vi.fn();
const mockUpdateMutate = vi.fn();
const mockDeleteMutate = vi.fn();

const tree: NavigationMenuItem[] = [
  {
    id: 1,
    code: "DASHBOARD",
    title: "Dashboard",
    url: "/dashboard",
    type: "MENU",
    category: "USER_MENU",
    sortOrder: 1,
    openInNewTab: false,
  },
];

const menus: NavigationMenuItem[] = [
  {
    id: 1,
    code: "DASHBOARD",
    title: "Dashboard",
    url: "/dashboard",
    type: "MENU",
    category: "USER_MENU",
    sortOrder: 1,
    openInNewTab: false,
  },
];

vi.mock("@railfinance/core/components/modal", () => ({
  Modal: ({
    open,
    title,
    children,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    children: React.ReactNode;
  }) =>
    open ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        {children}
      </div>
    ) : null,
}));

vi.mock("@/features/settings/menu-management/components/menu-list", () => ({
  MenuList: ({
    onAdd,
    onEdit,
    onDelete,
  }: {
    menus: NavigationMenuItem[];
    onAdd: () => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
  }) => (
    <div data-testid="menu-list">
      <button onClick={onAdd}>Add</button>
      <button onClick={() => onEdit(1)}>Edit</button>
      <button onClick={() => onDelete(1)}>Delete</button>
    </div>
  ),
}));

vi.mock("@/features/settings/menu-management/components/menu-form", () => ({
  MenuForm: ({
    initialValues,
    onSubmit,
    onCancel,
  }: {
    initialValues?: Partial<NavigationMenuItem>;
    onSubmit: (data: unknown) => void;
    onCancel: () => void;
  }) => (
    <div data-testid="menu-form" data-initial-id={initialValues?.id ?? ""}>
      <button
        onClick={() =>
          onSubmit({
            code: "CODE",
            title: "Title",
            titleEn: "",
            url: "/url",
            icon: "",
            type: "MENU",
            category: "USER_MENU",
            sortOrder: 1,
            openInNewTab: false,
            badge: "",
            parentId: null,
            featureId: null,
            moduleId: null,
          })
        }
      >
        Submit
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

let mockIsLoadingTree = false;
let mockMenu: NavigationMenuItem | undefined = {
  id: 1,
  code: "DASHBOARD",
  title: "Dashboard",
  url: "/dashboard",
  type: "MENU",
  category: "USER_MENU",
  sortOrder: 1,
  openInNewTab: false,
};

vi.mock("@/features/settings/menu-management/data/menu-management.query", () => ({
  useMenuTree: () => ({ data: tree, isLoading: mockIsLoadingTree }),
  useMenus: () => ({ data: menus }),
  useMenu: () => ({ data: mockMenu }),
  useCreateMenu: () => ({ mutate: mockCreateMutate, isPending: false }),
  useUpdateMenu: () => ({ mutate: mockUpdateMutate, isPending: false }),
  useDeleteMenu: () => ({ mutate: mockDeleteMutate, isPending: false }),
}));

describe("MenuManagementPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsLoadingTree = false;
    mockMenu = {
      id: 1,
      code: "DASHBOARD",
      title: "Dashboard",
      url: "/dashboard",
      type: "MENU",
      category: "USER_MENU",
      sortOrder: 1,
      openInNewTab: false,
    };
  });

  it("shows loading spinner when tree is loading", () => {
    mockIsLoadingTree = true;
    render(<MenuManagementPage />);

    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    expect(screen.queryByTestId("menu-list")).not.toBeInTheDocument();
  });

  it("renders menu list when loaded", () => {
    render(<MenuManagementPage />);

    expect(screen.getByTestId("menu-list")).toBeInTheDocument();
  });

  it("opens add modal when add is triggered", async () => {
    const user = userEvent.setup();
    render(<MenuManagementPage />);

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Add Menu")).toBeInTheDocument();
  });

  it("opens edit modal when edit is triggered", async () => {
    const user = userEvent.setup();
    render(<MenuManagementPage />);

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Edit Menu")).toBeInTheDocument();
  });

  it("calls delete mutation when delete is confirmed", async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<MenuManagementPage />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockDeleteMutate).toHaveBeenCalledWith(1);
    confirmSpy.mockRestore();
  });

  it("does not call delete mutation when delete is cancelled", async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<MenuManagementPage />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(mockDeleteMutate).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it("submits create mutation and closes modal on success", async () => {
    const user = userEvent.setup();
    mockCreateMutate.mockImplementation((_data, options?: { onSuccess?: () => void }) => {
      options?.onSuccess?.();
    });

    render(<MenuManagementPage />);

    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(mockCreateMutate).toHaveBeenCalledTimes(1);
    expect(mockCreateMutate.mock.calls[0][0]).toMatchObject({
      code: "CODE",
      title: "Title",
      url: "/url",
      icon: null,
      badge: null,
      parentId: null,
      featureId: null,
      moduleId: null,
    });
    await waitFor(() =>
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument(),
    );
  });

  it("submits update mutation when editing", async () => {
    const user = userEvent.setup();
    mockUpdateMutate.mockImplementation((_payload, options?: { onSuccess?: () => void }) => {
      options?.onSuccess?.();
    });

    render(<MenuManagementPage />);

    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(mockUpdateMutate).toHaveBeenCalledTimes(1);
    expect(mockUpdateMutate.mock.calls[0][0]).toMatchObject({
      id: 1,
      data: expect.objectContaining({ code: "CODE" }),
    });
  });
});
