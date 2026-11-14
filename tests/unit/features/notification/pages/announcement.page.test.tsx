import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      Page: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="page">{children}</div>
      ),
      ActionButton: ({
        onClick,
        label,
        "data-testid": testId,
      }: {
        onClick?: () => void;
        label?: string;
        "data-testid"?: string;
      }) => (
        <button data-testid={testId || `action-btn-${label}`} onClick={onClick}>
          {label}
        </button>
      ),
      DataTable: ({ columns, title }: { columns: unknown[]; title?: string }) => (
        <div data-testid="data-table">
          <span data-testid="columns-count">{columns?.length}</span>
          <span>{title}</span>
        </div>
      ),
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

      PageHeader: ({
        title,
        actions,
      }: {
        title?: string;
        actions?: React.ReactNode;
      }) => (
        <div data-testid="page-header">
          {title}
          {actions && <div data-testid="page-actions">{actions}</div>}
        </div>
      ),
      ConfirmationModal: ({
        open,
        onOpenChange,
        title,
        onConfirm,
        confirmText,
        isLoading,
      }: {
        open: boolean;
        onOpenChange: (v: boolean) => void;
        title?: string;
        onConfirm?: () => void;
        confirmText?: string;
        isLoading?: boolean;
      }) =>
        open ? (
          <div data-testid="confirmation-modal">
            <p>{title}</p>
            <p>{confirmText}</p>
            <button
              data-testid="confirm-delete-btn"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {confirmText}
            </button>
            <button onClick={() => onOpenChange(false)}>Cancel</button>
          </div>
        ) : null,
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/scroll-area", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

vi.mock("@/features/notification/components/notification-form-modal", () => ({
  NotificationFormModal: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="form-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock(
  "@/features/notification/components/notification-bulk-form-modal",
  () => ({
    NotificationBulkFormModal: ({
      isOpen,
      onClose,
    }: {
      isOpen: boolean;
      onClose: () => void;
    }) =>
      isOpen ? (
        <div data-testid="bulk-form-modal">
          <button onClick={onClose}>Close</button>
        </div>
      ) : null,
  }),
);

vi.mock("@/features/notification/components/notification-detail-modal", () => ({
  NotificationDetailModal: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="detail-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

import { AnnouncementPage } from "@/features/notification/pages/announcement.page";

describe("AnnouncementPage", () => {
  it("renders without crashing", () => {
    render(<AnnouncementPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders page title in header", () => {
    render(<AnnouncementPage />);
    expect(screen.getByTestId("page-header")).toHaveTextContent(
      "Notifications",
    );
  });

  it("renders DataTable with correct number of columns", () => {
    render(<AnnouncementPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getByTestId("columns-count")).toHaveTextContent("7");
  });

  it("renders Create action button", () => {
    render(<AnnouncementPage />);
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("renders Bulk Create action button", () => {
    render(<AnnouncementPage />);
    expect(screen.getByText("Bulk Create")).toBeInTheDocument();
  });

  it("opens create form modal when Create button is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    render(<AnnouncementPage />);

    await user.click(screen.getByText("Create"));
    expect(screen.getByTestId("form-modal")).toBeInTheDocument();
  });

  it("opens bulk form modal when Bulk Create button is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    render(<AnnouncementPage />);

    await user.click(screen.getByText("Bulk Create"));
    expect(screen.getByTestId("bulk-form-modal")).toBeInTheDocument();
  });
});
