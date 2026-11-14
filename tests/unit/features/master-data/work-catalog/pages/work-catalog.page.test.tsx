import type { WorkCatalogResponse } from "@/features/master-data/work-catalog/data/work-catalog.types";
import { WorkCatalogPage } from "@/features/master-data/work-catalog/pages/work-catalog.page";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { navigate, activateMutate, deactivateMutate, deleteMutate } =
  vi.hoisted(() => ({
    navigate: vi.fn(),
    activateMutate: vi.fn(),
    deactivateMutate: vi.fn(),
    deleteMutate: vi.fn(),
  }));

const mockRow: WorkCatalogResponse = {
  id: 8,
  workType: "Bongkar",
  isActive: true,
  description: "Bongkar muat",
  taxes: [],
};

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return { ...actual, useNavigate: () => navigate };
});

vi.mock("@/features/master-data", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/master-data")>();
  return {
    ...actual,
    useActivateWorkCatalogMutation: (options?: {
      onSuccess?: () => void;
    }) => ({
      mutate: (id: number) => {
        activateMutate(id);
        options?.onSuccess?.();
      },
      isPending: false,
    }),
    useDeactivateWorkCatalogMutation: (options?: {
      onSuccess?: () => void;
    }) => ({
      mutate: (id: number) => {
        deactivateMutate(id);
        options?.onSuccess?.();
      },
      isPending: false,
    }),
    useDeleteWorkCatalogMutation: () => ({
      mutate: deleteMutate,
      isPending: false,
    }),
  };
});

vi.mock("@railfinance/core/components/actions", () => ({
  ActionButton: ({
    variant,
    label,
    onClick,
  }: {
    variant: string;
    label?: string;
    onClick?: () => void;
  }) => (
    <button type="button" data-testid={`action-${variant}`} onClick={onClick}>
      {label ?? variant}
    </button>
  ),
}));

vi.mock("@railfinance/core/components/data-table", () => ({
  ColumnHeader: () => <div />,
  DataTable: ({
    title,
    search,
    columns,
  }: {
    title: string;
    search?: { placeholder?: string };
    columns: Array<{
      id?: string;
      accessorKey?: string;
      cell?: (ctx: {
        row: {
          original: WorkCatalogResponse;
          getValue: (id: string) => unknown;
        };
        column: { id: string };
      }) => ReactNode;
    }>;
  }) => (
    <div
      data-testid="data-table"
      data-title={title}
      data-search={search?.placeholder}
    >
      {columns.map((column) => (
        <div key={column.id ?? column.accessorKey}>
          {column.cell?.({
            row: {
              original: mockRow,
              getValue: (id: string) =>
                mockRow[id as keyof WorkCatalogResponse],
            },
            column: { id: column.accessorKey ?? column.id ?? "" },
          })}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@railfinance/core/components/modal", () => ({
  ConfirmationModal: ({ onConfirm }: { onConfirm?: () => void }) => (
    <button type="button" data-testid="confirm-delete" onClick={onConfirm}>
      Delete
    </button>
  ),
}));

vi.mock("@railfinance/core/components/page-header", () => ({
  PageHeader: ({
    title,
    actions,
  }: {
    title: string;
    actions?: ReactNode;
  }) => (
    <div>
      <h1>{title}</h1>
      {actions}
    </div>
  ),
}));

vi.mock("@railfinance/core/components/page-shell", () => ({
  Page: ({ children }: { children?: ReactNode }) => (
    <div data-testid="page">{children}</div>
  ),
}));

vi.mock("@/shared/components", () => ({
  StatusToggleModal: ({
    open,
    isActive,
    onConfirm,
    onOpenChange,
  }: {
    open: boolean;
    isActive?: boolean;
    onConfirm: () => void;
    onOpenChange: (open: boolean) => void;
  }) =>
    open ? (
      <div data-testid="status-modal" data-active={String(!!isActive)}>
        <button type="button" data-testid="confirm-status" onClick={onConfirm}>
          Confirm
        </button>
        <button
          type="button"
          data-testid="close-status"
          onClick={() => onOpenChange(false)}
        >
          Close
        </button>
      </div>
    ) : null,
}));

describe("WorkCatalogPage", () => {
  beforeEach(() => {
    mockRow.isActive = true;
    vi.clearAllMocks();
  });

  it("renders the list, search, and add action", () => {
    render(<WorkCatalogPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Work Catalog" })).toBeInTheDocument();
    expect(screen.getByTestId("data-table")).toHaveAttribute(
      "data-title",
      "All Work Catalog",
    );
    expect(screen.getByTestId("data-table")).toHaveAttribute(
      "data-search",
      "Search Work Catalog",
    );
    expect(screen.getByTestId("action-add")).toHaveTextContent(
      "Add Work Catalog",
    );
  });

  it("navigates to create, detail, and edit", async () => {
    const user = userEvent.setup();
    render(<WorkCatalogPage />);

    await user.click(screen.getByTestId("action-add"));
    await user.click(screen.getByTestId("action-show"));
    await user.click(screen.getByTestId("action-edit"));

    expect(navigate).toHaveBeenNthCalledWith(
      1,
      "/master-data/work-catalog/create",
    );
    expect(navigate).toHaveBeenNthCalledWith(2, "/master-data/work-catalog/8");
    expect(navigate).toHaveBeenNthCalledWith(
      3,
      "/master-data/work-catalog/8/edit",
    );
  });

  it("deactivates an active row after confirmation", async () => {
    const user = userEvent.setup();
    render(<WorkCatalogPage />);

    await user.click(screen.getByTestId("action-deactivate"));
    expect(screen.getByTestId("status-modal")).toHaveAttribute(
      "data-active",
      "true",
    );

    await user.click(screen.getByTestId("confirm-status"));

    expect(deactivateMutate).toHaveBeenCalledWith(8);
    expect(activateMutate).not.toHaveBeenCalled();
    expect(screen.queryByTestId("status-modal")).not.toBeInTheDocument();
  });

  it("activates an inactive row after confirmation", async () => {
    mockRow.isActive = false;
    const user = userEvent.setup();
    render(<WorkCatalogPage />);

    await user.click(screen.getByTestId("action-activate"));
    expect(screen.getByTestId("status-modal")).toHaveAttribute(
      "data-active",
      "false",
    );

    await user.click(screen.getByTestId("confirm-status"));

    expect(activateMutate).toHaveBeenCalledWith(8);
    expect(deactivateMutate).not.toHaveBeenCalled();
  });

  it("closes the status modal without changing status", async () => {
    const user = userEvent.setup();
    render(<WorkCatalogPage />);

    await user.click(screen.getByTestId("action-deactivate"));
    await user.click(screen.getByTestId("close-status"));

    expect(screen.queryByTestId("status-modal")).not.toBeInTheDocument();
    expect(deactivateMutate).not.toHaveBeenCalled();
  });

  it("does not delete when no row is selected", async () => {
    const user = userEvent.setup();
    render(<WorkCatalogPage />);

    await user.click(screen.getByTestId("confirm-delete"));

    expect(deleteMutate).not.toHaveBeenCalled();
  });
});
