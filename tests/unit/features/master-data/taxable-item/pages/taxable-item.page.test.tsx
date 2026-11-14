import type {
  TaxableItemResponse,
  TaxableItemRow,
} from "@/features/master-data";
import { TaxableItemPage } from "@/features/master-data/taxable-item/pages/taxable-item.page";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockListRows, mockDeleteMutation } = vi.hoisted(() => ({
  mockListRows: vi.fn(),
  mockDeleteMutation: vi.fn(),
}));

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
        permission,
        variant,
      }: {
        label?: string;
        onClick?: () => void;
        permission?: string;
        variant?: string;
        showLabel?: boolean;
        buttonVariant?: string;
        size?: string;
        tooltip?: string;
      }) => (
        <button
          data-testid={`action-btn-${permission ?? variant ?? "default"}`}
          onClick={onClick}
        >
          {label ?? variant ?? "action"}
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
        onConfirm,
        onOpenChange,
        open,
      }: {
        open?: boolean;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
        title?: string;
        description?: string;
        confirmText?: string;
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
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </button>
          </div>
        ) : null,
      useGetCostCenterOptions: () => ({
        data: {
          data: [
            { value: "CC001", label: "CC001", description: "Cost Center 001" },
          ],
        },
        isLoading: false,
      }),
      SearchInput: ({
        value,
        onSearch,
        onClear,
        placeholder,
      }: {
        value?: string;
        onSearch?: (value: string) => void;
        onClear?: () => void;
        placeholder?: string;
        className?: string;
      }) => (
        <div data-testid="search-input">
          <input
            data-testid="search-field"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onSearch?.(e.target.value)}
          />
          <button data-testid="search-clear-btn" onClick={onClear}>
            Clear
          </button>
        </div>
      ),
      Popover: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
      PopoverTrigger: ({
        children,
        asChild,
      }: {
        children: React.ReactNode;
        asChild?: boolean;
      }) => <div data-testid="popover-trigger">{children}</div>,
      PopoverContent: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="popover-content">{children}</div>
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

const mockLevel1: TaxableItemResponse = {
  id: 1,
  code: "GOODS-001",
  altCode: "",
  fullCode: "",
  fullAltCode: "",
  name: "Electronic Goods",
  level: 1,
  parentId: null,
  parent: null,
  type: "GOODS",
  moduleId: null,
  module: null,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const mockLevel2: TaxableItemResponse = {
  id: 2,
  code: "ELEC-001",
  altCode: "",
  fullCode: "",
  fullAltCode: "",
  name: "Consumer Electronics",
  level: 2,
  parentId: 1,
  parent: mockLevel1,
  type: "GOODS",
  moduleId: null,
  module: null,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const mockRow: TaxableItemRow = {
  level1: mockLevel1,
  level2: mockLevel2,
  level3: null,
  level4: null,
};

const defaultRowsData = {
  data: {
    status: "SUCCESS",
    message: "Rows fetched successfully",
    data: {
      content: [mockRow],
      pagination: {
        total: 1,
        pageSize: 10,
        pageNumber: 1,
        totalPages: 3,
        currentPage: 1,
        from: 1,
        to: 1,
      },
    },
  },
  isLoading: false,
  isError: false,
};

vi.mock("@/features/master-data", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/master-data")>();
  return {
    ...actual,
    useListTaxableItemRows: mockListRows,
    useDeleteTaxableItemMutation: mockDeleteMutation,
    TaxableItemFormModal: ({
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
        <div data-testid="taxable-item-form-modal" data-mode={mode}>
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

describe("TaxableItemPage", () => {
  beforeEach(() => {
    mockListRows.mockReturnValue(defaultRowsData);
    mockDeleteMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("renders the page with layout and title", () => {
    render(<TaxableItemPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByText("Taxable Item")).toBeInTheDocument();
  });

  it("renders Add action button in header", () => {
    render(<TaxableItemPage />);
    expect(
      screen.getByTestId("action-btn-master-data:taxable-item:create"),
    ).toBeInTheDocument();
  });

  it("renders hierarchy table headers", () => {
    render(<TaxableItemPage />);
    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText("Level 2")).toBeInTheDocument();
    expect(screen.getByText("Level 3")).toBeInTheDocument();
    expect(screen.getByText("Level 4")).toBeInTheDocument();
  });

  it("renders hierarchy cells with item names", () => {
    render(<TaxableItemPage />);
    expect(
      screen.getAllByText("Electronic Goods").length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("Consumer Electronics").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders the search input", () => {
    render(<TaxableItemPage />);
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });

  it("renders pagination when totalPages > 1", () => {
    render(<TaxableItemPage />);
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });

  it("opens create form modal when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<TaxableItemPage />);

    await user.click(
      screen.getByTestId("action-btn-master-data:taxable-item:create"),
    );

    await waitFor(() => {
      expect(screen.getByTestId("taxable-item-form-modal")).toBeInTheDocument();
    });
    expect(screen.getByTestId("taxable-item-form-modal")).toHaveAttribute(
      "data-mode",
      "create",
    );
  });

  it("invalidates queries after form submission success", async () => {
    const user = userEvent.setup();
    render(<TaxableItemPage />);

    await user.click(
      screen.getByTestId("action-btn-master-data:taxable-item:create"),
    );
    await waitFor(() => {
      expect(screen.getByTestId("taxable-item-form-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("form-submit"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("taxable-item-form-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("shows confirmation modal when delete is triggered", () => {
    render(<TaxableItemPage />);
    expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
  });

  it("does not render pagination when totalPages is 0", () => {
    mockListRows.mockReturnValueOnce({
      data: {
        status: "SUCCESS",
        message: "Rows fetched successfully",
        data: {
          content: [],
          pagination: {
            total: 0,
            pageSize: 10,
            pageNumber: 1,
            totalPages: 0,
            currentPage: 1,
            from: 0,
            to: 0,
          },
        },
      },
      isLoading: false,
      isError: false,
    });

    render(<TaxableItemPage />);
    expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
  });

  it("renders loading state", () => {
    mockListRows.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<TaxableItemPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders empty state when no rows", () => {
    mockListRows.mockReturnValueOnce({
      data: {
        status: "SUCCESS",
        message: "Rows fetched successfully",
        data: {
          content: [],
          pagination: {
            total: 0,
            pageSize: 10,
            pageNumber: 1,
            totalPages: 0,
            currentPage: 1,
            from: 0,
            to: 0,
          },
        },
      },
      isLoading: false,
      isError: false,
    });

    render(<TaxableItemPage />);
    expect(screen.getByText("No taxable items found.")).toBeInTheDocument();
  });

  it("handles search input change", async () => {
    const user = userEvent.setup();
    render(<TaxableItemPage />);

    const searchInput = screen.getByTestId("search-field") as HTMLInputElement;
    await user.type(searchInput, "electronics");

    expect(searchInput.value).toBe("electronics");
  });

  it("handles search clear", async () => {
    const user = userEvent.setup();
    render(<TaxableItemPage />);

    const searchInput = screen.getByTestId("search-field") as HTMLInputElement;
    await user.type(searchInput, "electronics");
    expect(searchInput.value).toBe("electronics");

    await user.click(screen.getByTestId("search-clear-btn"));
    expect(searchInput.value).toBe("");
  });
});
