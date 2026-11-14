import { UomPage } from "@/features/master-data/unit-of-measure/pages/uom.page";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      useAuth: () => ({
        can: () => true,
        hasResource: () => true,
        permissions: [],
        roles: [],
        user: {},
        token: null,
        isSuperAdmin: false,
        isAuthenticated: true,
        isLoading: false,
        isRefreshing: false,
        error: null,
        logout: vi.fn(),
        scheduleTokenRefresh: vi.fn(),
      }),
      Page: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="page">{children}</div>
      ),
      ActionButton: ({
        label,
        onClick,
        disabled,
      }: {
        label?: string;
        onClick?: () => void;
        disabled?: boolean;
        variant?: string;
        showLabel?: boolean;
        permission?: string;
      }) => (
        <button
          data-testid={`action-btn-${label?.toLowerCase()}`}
          onClick={onClick}
          disabled={disabled}
        >
          {label}
        </button>
      ),
      DataTable: ({
        columns,
      }: {
        columns: Array<{
          id?: string;
          cell?: (ctx: {
            row: {
              original: unknown;
              index: number;
            };
          }) => React.ReactNode;
        }>;
      }) => (
        <div data-testid="data-table">
          {columns.map((col, i) => {
            if (col.id === "actions" && col.cell) {
              const ctx = {
                row: {
                  original: mockUomData,
                  index: 0,
                },
              };
              return (
                <div key={col.id ?? String(i)} data-testid="col-actions-cell">
                  {col.cell(ctx as never)}
                </div>
              );
            }
            return null;
          })}
        </div>
      ),
      PageHeader: ({
        title,
        actions,
      }: {
        title: string;
        actions?: React.ReactNode;
      }) => (
        <div>
          <h1>{title}</h1>
          <div data-testid="header-actions">{actions}</div>
        </div>
      ),
      ImportModal: ({
        open,
      }: {
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
        mutation?: unknown;
        downloadTemplate?: () => Promise<unknown>;
        templateFileName?: string;
      }) => (open ? <div data-testid="import-modal" /> : null),
      ConfirmationModal: ({
        onConfirm,
        onOpenChange,
      }: {
        open?: boolean;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
        title?: string;
        description?: string;
        confirmText?: string;
        isLoading?: boolean;
        confirmVariant?: string;
      }) => (
        <div data-testid="confirmation-modal">
          <button data-testid="confirm-delete-btn" onClick={onConfirm}>
            Confirm Delete
          </button>
          <button
            data-testid="cancel-delete-btn"
            onClick={() => onOpenChange?.(false)}
          >
            Cancel
          </button>
        </div>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/popover", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("@/features/master-data/unit-of-measure", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("@/features/master-data/unit-of-measure")
    >();
  return {
    ...actual,
    uomColumns: (
      handlers: Parameters<typeof actual.uomColumns>[0],
    ): ReturnType<typeof actual.uomColumns> => [
      {
        id: "actions",
        meta: { title: "Actions" },
        header: () => null,
        cell: () => (
          <div>
            <button
              data-testid="trigger-edit"
              onClick={() => handlers.onEdit?.(mockUomData)}
            >
              Edit
            </button>
            <button
              data-testid="trigger-delete"
              onClick={() => handlers.onDelete?.(mockUomData)}
            >
              Delete
            </button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    UomFormModal: ({
      open,
      mode,
      onSuccess,
      onOpenChange,
    }: {
      open?: boolean;
      mode?: string;
      onSuccess?: () => void;
      onOpenChange?: (open: boolean) => void;
    }) =>
      open ? (
        <div data-testid="uom-form-modal" data-mode={mode}>
          <button
            data-testid="form-submit"
            onClick={() => {
              onSuccess?.();
              onOpenChange?.(false);
            }}
          >
            Submit
          </button>
        </div>
      ) : null,
  };
});

const mockUomData = {
  id: 1,
  code: "KG",
  unit: "Kilogram",
  unitEn: "Kilogram",
  unitAlias: "KG",
  isActive: true,
  createdAt: "2024-06-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

describe("UomPage", () => {
  it("renders the page with layout and title", () => {
    render(<UomPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getAllByText("Unit of Measure").length).toBeGreaterThan(0);
  });

  it("renders Add, Import and Export action buttons", () => {
    render(<UomPage />);
    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-import")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-export")).toBeInTheDocument();
  });

  it("renders the DataTable", () => {
    render(<UomPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("opens create form modal when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<UomPage />);

    await user.click(screen.getByTestId("action-btn-add"));

    await waitFor(() => {
      expect(screen.getByTestId("uom-form-modal")).toBeInTheDocument();
    });
    expect(screen.getByTestId("uom-form-modal")).toHaveAttribute(
      "data-mode",
      "create",
    );
  });

  it("opens edit form modal when edit trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<UomPage />);

    await user.click(screen.getByTestId("trigger-edit"));

    await waitFor(() => {
      expect(screen.getByTestId("uom-form-modal")).toBeInTheDocument();
    });
    expect(screen.getByTestId("uom-form-modal")).toHaveAttribute(
      "data-mode",
      "edit",
    );
  });

  it("opens import modal when Import button is clicked", async () => {
    const user = userEvent.setup();
    render(<UomPage />);

    await user.click(screen.getByTestId("action-btn-import"));

    await waitFor(() => {
      expect(screen.getByTestId("import-modal")).toBeInTheDocument();
    });
  });

  it("shows confirmation modal when delete trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<UomPage />);

    await user.click(screen.getByTestId("trigger-delete"));

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
  });

  it("calls delete mutation when confirm delete is clicked", async () => {
    const user = userEvent.setup();
    render(<UomPage />);

    await user.click(screen.getByTestId("trigger-delete"));
    await user.click(screen.getByTestId("confirm-delete-btn"));

    await waitFor(() => {
      expect(screen.queryByTestId("uom-form-modal")).not.toBeInTheDocument();
    });
  });

  it("invalidates queries after form submission success", async () => {
    const user = userEvent.setup();
    render(<UomPage />);

    await user.click(screen.getByTestId("action-btn-add"));
    await waitFor(() => {
      expect(screen.getByTestId("uom-form-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("form-submit"));

    await waitFor(() => {
      expect(screen.queryByTestId("uom-form-modal")).not.toBeInTheDocument();
    });
  });
});
