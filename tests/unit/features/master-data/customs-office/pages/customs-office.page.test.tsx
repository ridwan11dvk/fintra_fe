import { CustomsOfficePage } from "@/features/master-data/customs-office/pages/customs-office.page";
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
        onClick,
        variant,
        label,
      }: {
        onClick?: () => void;
        variant?: string;
        label?: string;
      }) => (
        <button data-testid={`action-btn-${label ?? variant}`} onClick={onClick}>
          {label ?? variant}
        </button>
      ),
      ActionButton: ({
        onClick,
        variant,
        label,
      }: {
        onClick?: () => void;
        variant?: string;
        label?: string;
      }) => (
        <button data-testid={`action-btn-${label ?? variant}`} onClick={onClick}>
          {label ?? variant}
        </button>
      ),
      ColumnHeader: ({ column }: { column: { id: string } }) => <>{column.id}</>,
      DataTable: ({
        title,
        columns,
      }: {
        title: string;
        columns?: { id?: string; header?: unknown; cell?: unknown }[];
      }) => {
        const rowData: Record<string, unknown> = {
          id: 1,
          name: "KPPBC Jakarta",
          code: "KPPBC-001",
          isActive: true,
        };
        const mockRow = {
          original: rowData,
          index: 0,
          getValue: (key: string) => rowData[key],
        };

        return (
          <div data-testid="data-table">
            <span>{title}</span>
            {columns?.map((col) => (
              <div key={String(col.id ?? "")}>
                {typeof col.header === "function" &&
                  col.header({ column: { id: col.id } })}
                {typeof col.cell === "function" &&
                  col.cell({ row: mockRow, column: { id: col.id } })}
              </div>
            ))}
          </div>
        );
      },

      PageHeader: ({
        title,
        description,
        actions,
      }: {
        title: string;
        description?: string;
        actions?: React.ReactNode;
      }) => (
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          <div data-testid="header-actions">{actions}</div>
        </div>
      ),
      StatusBadge: ({ status }: { status: string }) => <span>{status}</span>,
      ConfirmationModal: ({
        open,
        title,
        description,
        confirmText,
        isLoading,
        onConfirm,
        onOpenChange,
      }: {
        open: boolean;
        title?: string;
        description?: string;
        confirmText?: string;
        isLoading?: boolean;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
      }) => (
        <div>
          {open && (
            <div data-testid="confirmation-modal">
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          )}
          <button
            data-testid="confirm-btn"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {confirmText}
          </button>
          <button data-testid="cancel-btn" onClick={() => onOpenChange?.(false)}>
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
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

vi.mock(
  "@/features/master-data/customs-office/components/customs-office-form-modal",
  () => ({
    CustomsOfficeFormModal: ({
      open,
      mode,
      onSuccess,
      onOpenChange,
    }: {
      open: boolean;
      mode: string;
      onSuccess?: () => void;
      onOpenChange?: (open: boolean) => void;
    }) =>
      open ? (
        <div data-testid="form-modal">
          {mode}
          <button
            data-testid="form-success-btn"
            onClick={() => {
              onSuccess?.();
              onOpenChange?.(false);
            }}
          >
            Trigger Success
          </button>
          <button
            data-testid="form-close-btn"
            onClick={() => onOpenChange?.(false)}
          >
            Close
          </button>
        </div>
      ) : null,
  }),
);

vi.mock(
  "@/features/master-data/customs-office/data/customs-office.query",
  () => ({
    customsOfficeQueryKeys: {
      all: ["customsOffices"],
      lists: () => ["customsOffices", "list"],
      list: (params?: unknown) => ["customsOffices", "list", params],
      details: () => ["customsOffices", "detail"],
      detail: (id: number) => ["customsOffices", "detail", id],
    },
  }),
);

vi.mock(
  "@/features/master-data/customs-office/data/customs-office.mutation",
  () => ({
    useDeleteCustomsOfficeMutation: vi.fn((options) => ({
      mutate: vi.fn(() => options?.onSuccess?.()),
      isPending: false,
    })),
  }),
);

vi.mock(
  "@/features/master-data/customs-office/data/customs-office.service",
  () => ({
    customsOfficeService: {
      listCustomsOffices: vi.fn(),
    },
  }),
);

describe("CustomsOfficePage", () => {
  it("renders the page", () => {
    render(<CustomsOfficePage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders the Customs Office header", () => {
    render(<CustomsOfficePage />);
    expect(screen.getByText("Customs Office")).toBeInTheDocument();
  });

  it("renders the DataTable with All Customs Offices title", () => {
    render(<CustomsOfficePage />);
    const table = screen.getByTestId("data-table");
    expect(table).toBeInTheDocument();
    expect(screen.getByText("All Customs Offices")).toBeInTheDocument();
  });

  it("renders Add action button", () => {
    render(<CustomsOfficePage />);
    expect(screen.getByTestId("action-btn-Add")).toBeInTheDocument();
  });

  it("opens form modal in create mode when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<CustomsOfficePage />);
    expect(screen.queryByTestId("form-modal")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("action-btn-Add"));
    expect(screen.getByTestId("form-modal")).toBeInTheDocument();
  });

  it("opens form modal in edit mode when edit action is clicked", async () => {
    const user = userEvent.setup();
    render(<CustomsOfficePage />);
    expect(screen.queryByTestId("form-modal")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("action-btn-edit"));

    expect(screen.getByTestId("form-modal")).toBeInTheDocument();
    expect(screen.getByTestId("form-modal")).toHaveTextContent("edit");
  });

  it("opens delete confirmation modal when delete action is clicked", async () => {
    const user = userEvent.setup();
    render(<CustomsOfficePage />);

    await user.click(screen.getByTestId("action-btn-delete"));

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
  });

  it("closes delete confirmation modal on confirm", async () => {
    const user = userEvent.setup();
    render(<CustomsOfficePage />);

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();

    await user.click(screen.getByTestId("confirm-btn"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("does not call delete mutation when no item selected", async () => {
    const user = userEvent.setup();
    render(<CustomsOfficePage />);

    await user.click(screen.getByTestId("confirm-btn"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("closes delete confirmation modal on cancel", async () => {
    const user = userEvent.setup();
    render(<CustomsOfficePage />);

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();

    await user.click(screen.getByTestId("cancel-btn"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("closes form modal when form success is triggered", async () => {
    const user = userEvent.setup();
    render(<CustomsOfficePage />);

    await user.click(screen.getByTestId("action-btn-Add"));
    expect(screen.getByTestId("form-modal")).toBeInTheDocument();

    await user.click(screen.getByTestId("form-success-btn"));

    await waitFor(() => {
      expect(screen.queryByTestId("form-modal")).not.toBeInTheDocument();
    });
  });
});
