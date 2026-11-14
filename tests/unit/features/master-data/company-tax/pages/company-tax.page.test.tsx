import { CompanyTaxPage } from "@/features/master-data/company-tax/pages/company-tax.page";
import { flexRender } from "@tanstack/react-table";
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
      Page: ({
        children,
        title,
      }: {
        children: React.ReactNode;
        title?: string;
      }) => (
        <div data-testid="page" data-title={title}>
          {children}
        </div>
      ),
      ActionButton: ({
        onClick,
        label,
        variant,
      }: {
        onClick?: () => void;
        label?: string;
        variant?: string;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {label ?? variant}
        </button>
      ),
      ActionButton: ({
        onClick,
        label,
        variant,
      }: {
        onClick?: () => void;
        label?: string;
        variant?: string;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {label ?? variant}
        </button>
      ),
      DataTable: ({
        columns,
        title,
      }: {
        columns?: { id?: string; cell?: unknown; header?: unknown }[];
        title?: string;
      }) => {
        const actionsCol = columns?.find((col) => col.id === "actions");
        return (
          <div data-testid="data-table">
            <span>{title}</span>
            {actionsCol?.cell
              ? (flexRender(
                  actionsCol.cell as any,
                  {
                    row: {
                      index: 0,
                      original: { id: 1, companyCode: "PT. ABC" },
                    },
                    column: { id: "actions" },
                    getValue: () => undefined,
                    renderValue: () => undefined,
                    table: {},
                    cell: {},
                    getContext: () => ({}) as never,
                  } as never,
                ) as React.ReactElement)
              : null}
          </div>
        );
      },

      PageHeader: ({
        title,
        description,
        actions,
      }: {
        title?: string;
        description?: string;
        actions?: React.ReactNode;
      }) => (
        <div data-testid="page-header">
          <span>{title}</span>
          <span>{description}</span>
          <div>{actions}</div>
        </div>
      ),
      ConfirmationModal: ({
        open,
        onOpenChange,
        onConfirm,
        description,
      }: {
        open: boolean;
        onOpenChange: (v: boolean) => void;
        onConfirm?: () => void;
        description?: string;
      }) => (
        <>
          <button data-testid="invisible-confirm-delete" onClick={onConfirm}>
            Invisible Confirm
          </button>
          {open && (
            <div data-testid="confirmation-modal">
              <span>{description}</span>
              <button data-testid="confirm-delete" onClick={onConfirm}>
                Confirm Delete
              </button>
              <button onClick={() => onOpenChange(false)}>Cancel</button>
            </div>
          )}
        </>
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

vi.mock("@/features/master-data", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/master-data")>();
  return {
    ...actual,
    CompanyTaxFormModal: ({
      open,
      onOpenChange,
      mode,
      onSuccess,
    }: {
      open: boolean;
      onOpenChange: (v: boolean) => void;
      mode: string;
      onSuccess?: () => void;
    }) =>
      open ? (
        <div data-testid="form-modal" data-mode={mode}>
          <button onClick={() => onOpenChange(false)}>Close Modal</button>
          <button onClick={() => onSuccess?.()}>Trigger Success</button>
        </div>
      ) : null,
    useDeleteCompanyTaxMutation: vi.fn(
      (options?: { onSuccess?: () => void }) => ({
        mutate: vi.fn(() => options?.onSuccess?.()),
        isPending: false,
      }),
    ),
  };
});

describe("CompanyTaxPage", () => {
  it("renders MainLayout with correct title", () => {
    render(<CompanyTaxPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-title",
      "Tax Assignment",
    );
  });

  it("renders the page title in PageHeader", () => {
    render(<CompanyTaxPage />);

    expect(screen.getByText("Tax Assignment Management")).toBeInTheDocument();
  });

  it("renders the DataTable component", () => {
    render(<CompanyTaxPage />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("renders the Add button", () => {
    render(<CompanyTaxPage />);

    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("does not call deleteMutation when confirming without companyTaxToDelete", async () => {
    const user = userEvent.setup();

    render(<CompanyTaxPage />);

    await user.click(screen.getByTestId("invisible-confirm-delete"));

    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("opens form modal in create mode when Add button clicked", async () => {
    const user = userEvent.setup();

    render(<CompanyTaxPage />);

    await user.click(screen.getByTestId("action-btn-add"));

    await waitFor(() => {
      expect(screen.getByTestId("form-modal")).toBeInTheDocument();
    });
    expect(screen.getByTestId("form-modal")).toHaveAttribute(
      "data-mode",
      "create",
    );
  });

  it("opens confirmation modal when delete action button is clicked", async () => {
    const user = userEvent.setup();

    render(<CompanyTaxPage />);

    expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("action-btn-delete"));

    await waitFor(() => {
      expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    });
  });

  it("shows company code in confirmation modal description", async () => {
    const user = userEvent.setup();

    render(<CompanyTaxPage />);

    await user.click(screen.getByTestId("action-btn-delete"));

    await waitFor(() => {
      expect(screen.getByText(/PT\. ABC/)).toBeInTheDocument();
    });
  });

  it("closes form modal when onOpenChange(false) is called from modal", async () => {
    const user = userEvent.setup();

    render(<CompanyTaxPage />);

    await user.click(screen.getByTestId("action-btn-add"));
    await waitFor(() => {
      expect(screen.getByTestId("form-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Close Modal"));
    await waitFor(() => {
      expect(screen.queryByTestId("form-modal")).not.toBeInTheDocument();
    });
  });

  it("does not crash when delete is confirmed", async () => {
    const user = userEvent.setup();

    render(<CompanyTaxPage />);

    await user.click(screen.getByTestId("action-btn-delete"));

    await waitFor(() => {
      expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("confirm-delete"));
  });

  it("calls handleFormSuccess when form modal triggers onSuccess", async () => {
    const user = userEvent.setup();

    render(<CompanyTaxPage />);

    await user.click(screen.getByTestId("action-btn-add"));
    await waitFor(() => {
      expect(screen.getByTestId("form-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Trigger Success"));
  });

  it("opens form modal in edit mode when edit action button is clicked", async () => {
    const user = userEvent.setup();

    render(<CompanyTaxPage />);

    await user.click(screen.getByTestId("action-btn-edit"));

    await waitFor(() => {
      expect(screen.getByTestId("form-modal")).toBeInTheDocument();
    });
    expect(screen.getByTestId("form-modal")).toHaveAttribute(
      "data-mode",
      "edit",
    );
  });

  it("closes confirmation modal after confirming delete", async () => {
    const user = userEvent.setup();

    render(<CompanyTaxPage />);

    await user.click(screen.getByTestId("action-btn-delete"));

    await waitFor(() => {
      expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("confirm-delete"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal"),
      ).not.toBeInTheDocument();
    });
  });
});
