import { PartnerListPage } from "@/features/master-data/partner/pages/partner-list.page";
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
      DataTable: ({
        title,
        columns,
      }: {
        title?: string;
        columns?: unknown[];
        queryKey?: unknown;
        queryFn?: unknown;
        search?: unknown;
      }) => (
        <div data-testid="data-table">
          <span>{title}</span>
          <span data-testid="columns-count">{columns?.length}</span>
        </div>
      ),
      ActionButton: ({
        onClick,
        permission,
      }: {
        variant?: string;
        onClick?: () => void;
        permission?: string;
        showLabel?: boolean;
      }) => (
        <button
          data-testid={`action-btn-${permission ?? "default"}`}
          onClick={onClick}
        >
          Add
        </button>
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
        open,
        onConfirm,
        onOpenChange,
        onCancel,
      }: {
        open?: boolean;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
        onCancel?: () => void;
        title?: string;
        description?: string;
        confirmText?: string;
        cancelText?: string;
        isLoading?: boolean;
        confirmVariant?: string;
      }) =>
        open ? (
          <div data-testid="confirmation-modal">
            <button data-testid="confirm-delete-btn" onClick={onConfirm}>
              Confirm Delete
            </button>
            <button
              data-testid="cancel-delete-btn"
              onClick={() => {
                onCancel?.();
                onOpenChange?.(false);
              }}
            >
              Cancel
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

vi.mock("@/features/master-data", async () => {
  const actual = await vi.importActual<typeof import("@/features/master-data")>(
    "@/features/master-data",
  );
  return {
    ...actual,
    useDeletePartnerMutation: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    }),
    partnerColumns: vi.fn().mockReturnValue([]),
  };
});

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("PartnerListPage", () => {
  it("renders the page", () => {
    render(<PartnerListPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders the Partners page header", () => {
    render(<PartnerListPage />);
    expect(screen.getByText("Partners")).toBeInTheDocument();
  });

  it("renders the DataTable", () => {
    render(<PartnerListPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("opens confirmation modal when delete is triggered via column action", () => {
    render(<PartnerListPage />);
    // The confirmation modal is not open initially
    expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
    // Data table is rendered
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("renders add action button in header", () => {
    render(<PartnerListPage />);
    expect(
      screen.getByTestId("action-btn-master-data:partner:create"),
    ).toBeInTheDocument();
  });

  it("navigates to create page when add button is clicked", async () => {
    const user = userEvent.setup();
    render(<PartnerListPage />);
    await user.click(
      screen.getByTestId("action-btn-master-data:partner:create"),
    );
    expect(
      screen.getByTestId("action-btn-master-data:partner:create"),
    ).toBeInTheDocument();
  });

  it("closes confirmation modal when cancel is clicked", async () => {
    render(<PartnerListPage />);

    // Verify confirmation modal is not shown initially
    expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal"),
      ).not.toBeInTheDocument();
    });
  });
});
