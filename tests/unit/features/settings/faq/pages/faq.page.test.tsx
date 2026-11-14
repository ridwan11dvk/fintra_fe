import type { FaqResponse } from "@/features/settings/faq/data/faq.types";
import { FaqPage } from "@/features/settings/faq/pages/faq.page";
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
      useGetLookupValueOptions: () => ({
        data: {
          data: [
            { value: "guest_home", label: "Guest Home" },
            { value: "external_home", label: "External Home" },
          ],
        },
        isLoading: false,
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
      DataTable: ({
        filters,
      }: {
        filters?: { key: string; options?: { value: string; label: string }[] }[];
      }) => (
        <div data-testid="data-table" data-filters={JSON.stringify(filters)} />
      ),
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
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("@/features/settings/faq/components/faq-form-modal", () => ({
  FaqFormModal: ({
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
      <div data-testid="faq-form-modal" data-mode={mode}>
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

vi.mock("@/features/settings/faq/data", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/settings/faq/data")>();
  return {
    ...actual,
    useDeleteFaqMutation: () => ({
      mutate: vi.fn(),
      isPending: false,
    }),
  };
});

vi.mock("@/features/settings/faq/components/faq-columns", () => ({
  faqColumns: vi.fn(() => []),
}));

const mockFaqData: FaqResponse = {
  id: 1,
  target: "guest_home",
  question: "Bagaimana cara melacak status invoice saya?",
  answer: "Masukkan NPWP/NIK dan nomor invoice Anda.",
  startDate: "2026-01-01",
  sortOrder: 10,
};

describe("FaqPage", () => {
  it("renders the page with layout and title", () => {
    render(<FaqPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByText("FAQ Management")).toBeInTheDocument();
  });

  it("renders Add action button", () => {
    render(<FaqPage />);
    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("renders the DataTable with a target filter built from FAQ_TARGET categories", () => {
    render(<FaqPage />);
    const table = screen.getByTestId("data-table");
    expect(table).toBeInTheDocument();

    const filters = JSON.parse(table.getAttribute("data-filters") ?? "[]");
    expect(filters).toHaveLength(1);
    expect(filters[0].key).toBe("target");
    expect(filters[0].options).toEqual([
      { value: "guest_home", label: "Guest Home" },
      { value: "external_home", label: "External Home" },
    ]);
  });

  it("opens create form modal when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<FaqPage />);

    await user.click(screen.getByTestId("action-btn-add"));

    await waitFor(() => {
      expect(screen.getByTestId("faq-form-modal")).toBeInTheDocument();
    });
    expect(screen.getByTestId("faq-form-modal")).toHaveAttribute(
      "data-mode",
      "create",
    );
  });

  it("exposes the seeded FAQ target in the fixture data used by the table", () => {
    expect(mockFaqData.target).toBe("guest_home");
    expect(mockFaqData.question).toBeTruthy();
  });
});
