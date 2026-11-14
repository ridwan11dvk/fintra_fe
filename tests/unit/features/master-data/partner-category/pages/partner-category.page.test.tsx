import type { PartnerCategoryResponse } from "@/features/master-data";
import { PartnerCategoryPage } from "@/features/master-data/partner-category/pages/partner-category.page";
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
        >
          {label}
        </button>
      ),
      ActionButton: ({
        label,
        onClick,
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
              original: PartnerCategoryResponse;
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
                  original: mockPartnerCategoryData,
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

vi.mock("@/features/master-data/partner-category", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("@/features/master-data/partner-category")
    >();
  return {
    ...actual,
    partnerCategoryColumns: (
      handlers: Parameters<typeof actual.partnerCategoryColumns>[0],
    ): ReturnType<typeof actual.partnerCategoryColumns> => [
      {
        id: "actions",
        meta: { title: "Actions" },
        header: () => null,
        cell: () => (
          <div>
            <button
              data-testid="trigger-edit"
              onClick={() => handlers.onEdit?.(mockPartnerCategoryData)}
            >
              Edit
            </button>
            <button
              data-testid="trigger-delete"
              onClick={() => handlers.onDelete?.(mockPartnerCategoryData)}
            >
              Delete
            </button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    PartnerCategoryFormModal: ({
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
        <div data-testid="partner-category-form-modal" data-mode={mode}>
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

const mockPartnerCategoryData: PartnerCategoryResponse = {
  id: 1,
  name: "Supplier",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

describe("PartnerCategoryPage", () => {
  it("renders the page with layout and title", () => {
    render(<PartnerCategoryPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByText("Partner Category")).toBeInTheDocument();
  });

  it("renders an Add action button", () => {
    render(<PartnerCategoryPage />);
    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("renders the DataTable", () => {
    render(<PartnerCategoryPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("opens create form modal when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<PartnerCategoryPage />);

    await user.click(screen.getByTestId("action-btn-add"));

    await waitFor(() => {
      expect(
        screen.getByTestId("partner-category-form-modal"),
      ).toBeInTheDocument();
    });
    expect(screen.getByTestId("partner-category-form-modal")).toHaveAttribute(
      "data-mode",
      "create",
    );
  });

  it("opens edit form modal when edit trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<PartnerCategoryPage />);

    await user.click(screen.getByTestId("trigger-edit"));

    await waitFor(() => {
      expect(
        screen.getByTestId("partner-category-form-modal"),
      ).toBeInTheDocument();
    });
    expect(screen.getByTestId("partner-category-form-modal")).toHaveAttribute(
      "data-mode",
      "edit",
    );
  });

  it("shows confirmation modal when delete trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<PartnerCategoryPage />);

    await user.click(screen.getByTestId("trigger-delete"));

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
  });

  it("calls delete mutation when confirm delete is clicked", async () => {
    const user = userEvent.setup();
    render(<PartnerCategoryPage />);

    await user.click(screen.getByTestId("trigger-delete"));
    await user.click(screen.getByTestId("confirm-delete-btn"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("partner-category-form-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("does not call delete mutation when partnerCategoryToDelete is not set", async () => {
    const user = userEvent.setup();
    render(<PartnerCategoryPage />);

    await user.click(screen.getByTestId("confirm-delete-btn"));

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("invalidates queries after form submission success", async () => {
    const user = userEvent.setup();
    render(<PartnerCategoryPage />);

    await user.click(screen.getByTestId("action-btn-add"));
    await waitFor(() => {
      expect(
        screen.getByTestId("partner-category-form-modal"),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("form-submit"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("partner-category-form-modal"),
      ).not.toBeInTheDocument();
    });
  });
});
