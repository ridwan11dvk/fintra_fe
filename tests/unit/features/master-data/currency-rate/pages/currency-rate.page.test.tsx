import { CurrencyRatePage } from "@/features/master-data/currency-rate/pages/currency-rate.page";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
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
        disabled,
      }: {
        onClick?: () => void;
        variant?: string;
        label?: string;
        disabled?: boolean;
      }) => (
        <button
          data-testid={`action-btn-${label ?? variant}`}
          onClick={onClick}
          disabled={disabled}
        >
          {label ?? variant}
        </button>
      ),
      DataTable: ({ title }: { title: string }) => (
        <div data-testid="data-table">
          <span>{title}</span>
        </div>
      ),

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
      ConfirmationModal: ({
        open,
        title,
        description,
        confirmText,
        isLoading,
        onConfirm,
        onCancel,
      }: {
        open: boolean;
        title?: string;
        description?: string;
        confirmText?: string;
        isLoading?: boolean;
        onConfirm?: () => void;
        onCancel?: () => void;
      }) =>
        open ? (
          <div data-testid="confirmation-modal">
            <h2>{title}</h2>
            <p>{description}</p>
            <button
              data-testid="confirm-btn"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {confirmText}
            </button>
            <button data-testid="cancel-btn" onClick={onCancel}>
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
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

vi.mock(
  "@/features/master-data/currency-rate/components/currency-rate-form-modal",
  () => ({
    CurrencyRateFormModal: ({ open, mode }: { open: boolean; mode: string }) =>
      open ? <div data-testid="form-modal">{mode}</div> : null,
  }),
);

vi.mock(
  "@/features/master-data/currency-rate/data/currency-rate.query",
  () => ({
    currencyRateQueryKeys: {
      all: ["currency-rates"],
      lists: () => ["currency-rates", "list"],
      list: (params?: unknown) => ["currency-rates", "list", params],
      details: () => ["currency-rates", "detail"],
      detail: (id: number) => ["currency-rates", "detail", id],
      byCurrency: () => ["currency-rates", "by-currency"],
      byCurrencyCode: (c: string) => ["currency-rates", "by-currency", c],
    },
  }),
);

vi.mock(
  "@/features/master-data/currency-rate/data/currency-rate.mutation",
  () => ({
    useDeleteCurrencyRateMutation: vi.fn((options) => ({
      mutate: vi.fn(() => options?.onSuccess?.()),
      isPending: false,
    })),
    useSyncCurrencyRatesMutation: vi.fn(() => ({
      mutate: vi.fn(),
      isPending: false,
    })),
  }),
);

vi.mock(
  "@/features/master-data/currency-rate/data/currency-rate.service",
  () => ({
    currencyRateService: {
      listCurrencyRates: vi.fn(),
    },
  }),
);

describe("CurrencyRatePage", () => {
  it("renders the page", () => {
    render(<CurrencyRatePage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders the Currency Rate header", () => {
    render(<CurrencyRatePage />);
    expect(screen.getByText("Currency Rate")).toBeInTheDocument();
  });

  it("renders the DataTable with All Currency Rates title", () => {
    render(<CurrencyRatePage />);
    const table = screen.getByTestId("data-table");
    expect(table).toBeInTheDocument();
    expect(screen.getByText("All Currency Rates")).toBeInTheDocument();
  });

  it("renders Add and Sync Rates action buttons", () => {
    render(<CurrencyRatePage />);
    expect(screen.getByTestId("action-btn-Add")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-Sync Rates")).toBeInTheDocument();
  });

  it("opens form modal in create mode when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<CurrencyRatePage />);
    expect(screen.queryByTestId("form-modal")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("action-btn-Add"));
    expect(screen.getByTestId("form-modal")).toBeInTheDocument();
  });

  it("calls sync mutation when Sync Rates is clicked", async () => {
    const { useSyncCurrencyRatesMutation } =
      await import("@/features/master-data/currency-rate/data/currency-rate.mutation");
    const syncMutate = vi.fn();
    vi.mocked(useSyncCurrencyRatesMutation).mockReturnValue({
      mutate: syncMutate,
      isPending: false,
    } as never);

    const user = userEvent.setup();
    render(<CurrencyRatePage />);
    await user.click(screen.getByTestId("action-btn-Sync Rates"));
    expect(syncMutate).toHaveBeenCalled();
  });

  it("shows confirmation modal when delete is triggered", async () => {
    const { useDeleteCurrencyRateMutation } =
      await import("@/features/master-data/currency-rate/data/currency-rate.mutation");
    vi.mocked(useDeleteCurrencyRateMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never);

    render(<CurrencyRatePage />);
    expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
  });
});
