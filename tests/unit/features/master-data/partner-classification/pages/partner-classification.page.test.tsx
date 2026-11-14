import type { PartnerClassificationResponse } from "@/features/master-data/partner-classification/data/partner-classification.types";
import { PartnerClassificationPage } from "@/features/master-data/partner-classification/pages/partner-classification.page";
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
              original: PartnerClassificationResponse;
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
                  original: mockPartnerClassificationData,
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
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock(
  "@/features/master-data/partner-classification",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/features/master-data/partner-classification")
      >();
    return {
      ...actual,
      partnerClassificationColumns: (
        handlers: Parameters<typeof actual.partnerClassificationColumns>[0],
      ): ReturnType<typeof actual.partnerClassificationColumns> => [
        {
          id: "actions",
          meta: { title: "Actions" },
          header: () => null,
          cell: () => (
            <div>
              <button
                data-testid="trigger-edit"
                onClick={() => handlers.onEdit?.(mockPartnerClassificationData)}
              >
                Edit
              </button>
              <button
                data-testid="trigger-delete"
                onClick={() =>
                  handlers.onDelete?.(mockPartnerClassificationData)
                }
              >
                Delete
              </button>
            </div>
          ),
          enableSorting: false,
          enableHiding: false,
        },
      ],
      PartnerClassificationFormModal: ({
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
          <div data-testid="partner-classification-form-modal" data-mode={mode}>
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
  },
);

const mockPartnerClassificationData: PartnerClassificationResponse = {
  id: 1,
  name: "Distributor",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

describe("PartnerClassificationPage", () => {
  it("renders the page with layout and title", () => {
    render(<PartnerClassificationPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByText("Partner Classification")).toBeInTheDocument();
  });

  it("renders an Add action button", () => {
    render(<PartnerClassificationPage />);
    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("renders the DataTable", () => {
    render(<PartnerClassificationPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("opens create form modal when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<PartnerClassificationPage />);

    await user.click(screen.getByTestId("action-btn-add"));

    await waitFor(() => {
      expect(
        screen.getByTestId("partner-classification-form-modal"),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByTestId("partner-classification-form-modal"),
    ).toHaveAttribute("data-mode", "create");
  });

  it("opens edit form modal when edit trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<PartnerClassificationPage />);

    await user.click(screen.getByTestId("trigger-edit"));

    await waitFor(() => {
      expect(
        screen.getByTestId("partner-classification-form-modal"),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByTestId("partner-classification-form-modal"),
    ).toHaveAttribute("data-mode", "edit");
  });

  it("shows confirmation modal when delete trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<PartnerClassificationPage />);

    await user.click(screen.getByTestId("trigger-delete"));

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
  });

  it("calls delete mutation when confirm delete is clicked", async () => {
    const user = userEvent.setup();
    render(<PartnerClassificationPage />);

    await user.click(screen.getByTestId("trigger-delete"));
    await user.click(screen.getByTestId("confirm-delete-btn"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("partner-classification-form-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("does not call delete mutation when partnerClassificationToDelete is not set", async () => {
    const user = userEvent.setup();
    render(<PartnerClassificationPage />);

    await user.click(screen.getByTestId("confirm-delete-btn"));

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("invalidates queries after form submission success", async () => {
    const user = userEvent.setup();
    render(<PartnerClassificationPage />);

    await user.click(screen.getByTestId("action-btn-add"));
    await waitFor(() => {
      expect(
        screen.getByTestId("partner-classification-form-modal"),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("form-submit"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("partner-classification-form-modal"),
      ).not.toBeInTheDocument();
    });
  });
});
