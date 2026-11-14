import type { BannerResponse } from "@/features/settings/banner/data/banner.types";
import { BannerPage } from "@/features/settings/banner/pages/banner.page";
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
      DataTable: () => <div data-testid="data-table" />,
      ConfirmationModal: ({
        onConfirm,
        onOpenChange,
      }: {
        open?: boolean;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
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
vi.mock("@railfinance/core/components/image", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("@/features/settings/banner/components/banner-form-modal", () => ({
  BannerFormModal: ({
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
      <div data-testid="banner-form-modal" data-mode={mode}>
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
}));

vi.mock("@/features/settings/banner/data", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/settings/banner/data")>();
  return {
    ...actual,
    bannerColumns: vi.fn(() => []),
    useDeleteBannerMutation: () => ({
      mutate: vi.fn(),
      isPending: false,
    }),
  };
});

const mockBannerData: BannerResponse = {
  id: 1,
  target: "guest_home",
  title: "Simplify Your Financial Operations",
  startDate: "2026-01-01",
  sortOrder: 10,
};

describe("BannerPage", () => {
  it("renders the page with layout and title", () => {
    render(<BannerPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByText("Banner Management")).toBeInTheDocument();
  });

  it("renders Add action button", () => {
    render(<BannerPage />);
    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("does not render Export or Import buttons", () => {
    render(<BannerPage />);
    expect(screen.queryByTestId("action-btn-export")).not.toBeInTheDocument();
    expect(screen.queryByTestId("action-btn-import")).not.toBeInTheDocument();
  });

  it("renders the DataTable", () => {
    render(<BannerPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("opens create form modal when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<BannerPage />);

    await user.click(screen.getByTestId("action-btn-add"));

    await waitFor(() => {
      expect(screen.getByTestId("banner-form-modal")).toBeInTheDocument();
    });
    expect(screen.getByTestId("banner-form-modal")).toHaveAttribute(
      "data-mode",
      "create",
    );
  });
});
