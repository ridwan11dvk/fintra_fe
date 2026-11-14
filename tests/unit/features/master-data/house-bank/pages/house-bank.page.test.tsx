import type { HouseBankResponse } from "@/features/master-data";
import { HouseBankPage } from "@/features/master-data/house-bank/pages/house-bank.page";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

// --- Mocks ---

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    // Route toast calls through the mocked `sonner` module so tests can
    // assert on them (@railfinance/ui bundles its own sonner internally).
    const { toast } = await import("sonner");
    return {
      ...actual,
      toast,
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
            row: { original: HouseBankResponse; index: number };
          }) => React.ReactNode;
        }>;
      }) => (
        <div data-testid="data-table">
          {columns.map((col, i) => {
            if (col.id === "actions" && col.cell) {
              const ctx = {
                row: {
                  original: mockHouseBankData,
                  index: 0,
                },
              };
              return (
                <div key={col.id ?? String(i)} data-testid="col-actions-cell">
                  {col.cell(ctx)}
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
      ImportModal: ({
        open,
        onOpenChange,
        downloadTemplate,
        mutation,
      }: {
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
        mutation?: { mutate?: (file: File) => void };
        downloadTemplate?: () => Promise<Blob>;
        templateFileName?: string;
      }) =>
        open ? (
          <div data-testid="import-modal">
            <button
              data-testid="close-import-btn"
              onClick={() => onOpenChange?.(false)}
            >
              Close Import
            </button>
            <button
              data-testid="download-template-btn"
              onClick={() => downloadTemplate?.()}
            >
              Download Template
            </button>
            <button
              data-testid="trigger-import-btn"
              onClick={() => {
                const file = new File(["test"], "house_banks.xlsx", {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                mutation?.mutate?.(file);
              }}
            >
              Import
            </button>
          </div>
        ) : null,
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

vi.mock("@/features/master-data", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/master-data")>();
  return {
    ...actual,
    houseBankColumns: (
      handlers: Parameters<typeof actual.houseBankColumns>[0],
    ): ReturnType<typeof actual.houseBankColumns> => [
      {
        id: "actions",
        meta: { title: "Actions" },
        header: () => null,
        cell: () => (
          <div>
            <button
              data-testid="trigger-edit"
              onClick={() => handlers.onEdit?.(mockHouseBankData)}
            >
              Edit
            </button>
            <button
              data-testid="trigger-delete"
              onClick={() => handlers.onDelete?.(mockHouseBankData)}
            >
              Delete
            </button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    HouseBankFormModal: ({
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
        <div data-testid="house-bank-form-modal" data-mode={mode}>
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

// Mock URL methods (not available in jsdom)
globalThis.URL.createObjectURL = vi.fn(() => "blob:mock-url");
globalThis.URL.revokeObjectURL = vi.fn();

const mockHouseBankData: HouseBankResponse = {
  id: 1,
  accountId: "HB-BCA-001",
  accountNumber: "1234567890",
  accountName: "PT Fintra - BCA Operasional",
  companyCode: "FINTRA",
  currencyCode: "IDR",
  bankCode: "BCA",
  erpCode: "ERP-BCA1",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

// --- Tests ---

describe("HouseBankPage", () => {
  it("renders the page with layout and title", () => {
    render(<HouseBankPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByText("House Bank")).toBeInTheDocument();
  });

  it("renders Export, Import, and Add action buttons", () => {
    render(<HouseBankPage />);
    expect(screen.getByTestId("action-btn-export")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-import")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("renders the DataTable", () => {
    render(<HouseBankPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("opens create form modal when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<HouseBankPage />);

    await user.click(screen.getByTestId("action-btn-add"));

    await waitFor(() => {
      expect(screen.getByTestId("house-bank-form-modal")).toBeInTheDocument();
    });
    expect(screen.getByTestId("house-bank-form-modal")).toHaveAttribute(
      "data-mode",
      "create",
    );
  });

  it("opens edit form modal when edit trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<HouseBankPage />);

    await user.click(screen.getByTestId("trigger-edit"));

    await waitFor(() => {
      expect(screen.getByTestId("house-bank-form-modal")).toBeInTheDocument();
    });
    expect(screen.getByTestId("house-bank-form-modal")).toHaveAttribute(
      "data-mode",
      "edit",
    );
  });

  it("shows confirmation modal when delete trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<HouseBankPage />);

    await user.click(screen.getByTestId("trigger-delete"));

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
  });

  it("calls delete mutation when confirm delete is clicked", async () => {
    const user = userEvent.setup();
    render(<HouseBankPage />);

    await user.click(screen.getByTestId("trigger-delete"));
    await user.click(screen.getByTestId("confirm-delete-btn"));

    await waitFor(() => {
      expect(screen.queryByTestId("import-modal")).not.toBeInTheDocument();
    });
  });

  it("does not call delete mutation when bankToDelete is not set", async () => {
    const user = userEvent.setup();
    render(<HouseBankPage />);

    await user.click(screen.getByTestId("confirm-delete-btn"));

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("opens import modal when Import button is clicked", async () => {
    const user = userEvent.setup();
    render(<HouseBankPage />);

    await user.click(screen.getByTestId("action-btn-import"));

    await waitFor(() => {
      expect(screen.getByTestId("import-modal")).toBeInTheDocument();
    });
  });

  it("closes import modal when closed", async () => {
    const user = userEvent.setup();
    render(<HouseBankPage />);

    await user.click(screen.getByTestId("action-btn-import"));
    await waitFor(() => {
      expect(screen.getByTestId("import-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("close-import-btn"));
    await waitFor(() => {
      expect(screen.queryByTestId("import-modal")).not.toBeInTheDocument();
    });
  });

  it("invalidates queries after form submission success", async () => {
    const user = userEvent.setup();
    render(<HouseBankPage />);

    await user.click(screen.getByTestId("action-btn-add"));
    await waitFor(() => {
      expect(screen.getByTestId("house-bank-form-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("form-submit"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("house-bank-form-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("calls export and triggers file download on Export button click", async () => {
    const user = userEvent.setup();
    render(<HouseBankPage />);

    await user.click(screen.getByTestId("action-btn-export"));

    await waitFor(() => {
      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
      expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith(
        "blob:mock-url",
      );
    });
  });

  it("calls downloadTemplate when download template button is clicked", async () => {
    const user = userEvent.setup();
    render(<HouseBankPage />);

    await user.click(screen.getByTestId("action-btn-import"));
    await waitFor(() => {
      expect(screen.getByTestId("import-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("download-template-btn"));
    expect(screen.getByTestId("import-modal")).toBeInTheDocument();
  });

  it("invalidates queries after successful import", async () => {
    const user = userEvent.setup();
    render(<HouseBankPage />);

    await user.click(screen.getByTestId("action-btn-import"));
    await waitFor(() => {
      expect(screen.getByTestId("import-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("trigger-import-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("data-table")).toBeInTheDocument();
    });
  });

  it("shows error toast when export fails", async () => {
    const { server } = await import("@tests/unit/mocks/server");
    const { http, HttpResponse } = await import("msw");
    const { toast } = await import("sonner");

    server.use(
      http.get("http://localhost:3000/master/house-bank/export", () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const user = userEvent.setup();
    render(<HouseBankPage />);

    await user.click(screen.getByTestId("action-btn-export"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to export data");
    });
  });
});
