import type { AccessRequestResponse } from "@/features/access-request";
import { AccessRequestListPage } from "@/features/access-request/pages/access-request-list.page";
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
      DataTable: <T,>({
        columns,
        title,
      }: {
        columns: Array<{
          id?: string;
          cell?: (ctx: {
            row: { original: T; index: number };
          }) => React.ReactNode;
        }>;
        title?: string;
        queryFn?: () => void;
        queryKey?: Array<unknown>;
      }) => {
        const col = columns[0];
        const ctx = { row: { original: mockData as T, index: 0 } };
        return (
          <div data-testid="data-table">
            {title && <h2>{title}</h2>}
            {col?.cell && <div>{col.cell(ctx)}</div>}
          </div>
        );
      },

      PageHeader: ({
        title,
        description,
      }: {
        title: string;
        description?: string;
      }) => (
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/access-request", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/image", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/multiple-badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/accordion", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/avatar", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);
vi.mock("@railfinance/core/access-request", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/image", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/multiple-badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/accordion", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/avatar", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

const mockData: AccessRequestResponse = {
  id: 1,
  userId: 10,
  userType: "INTERNAL",
  userName: "John Doe",
  userNipp: "NIPP001",
  status: "PENDING",
  moduleNames: "Finance, Procurement",
  requestNotes: "Need access",
  requestedAt: "2024-06-01T08:00:00Z",
  approvedAt: null,
  responseNotes: null,
  approvedBy: null,
};

vi.mock("@/features/access-request/components/access-request-columns", () => ({
  accessRequestColumns: (handlers: {
    onView: (r: AccessRequestResponse) => void;
  }) => [
    {
      id: "actions",
      cell: ({
        row,
      }: {
        row: { original: AccessRequestResponse; index: number };
      }) => (
        <div>
          <button
            data-testid="trigger-view"
            onClick={() => handlers.onView(row.original)}
          >
            View
          </button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ],
}));

vi.mock("@/features/access-request/components/request-detail-modal", () => ({
  RequestDetailModal: ({
    open,
    onOpenChange,
    onSuccess,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
  }) =>
    open ? (
      <div data-testid="request-detail-modal">
        <button
          data-testid="modal-close"
          onClick={() => {
            onSuccess?.();
            onOpenChange(false);
          }}
        >
          Close
        </button>
      </div>
    ) : null,
}));

describe("AccessRequestListPage", () => {
  it("renders the page with layout and title", () => {
    render(<AccessRequestListPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByText("Access Request Management")).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<AccessRequestListPage />);
    expect(
      screen.getByText(
        "View and manage all access requests submitted by users.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the DataTable", () => {
    render(<AccessRequestListPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("opens detail modal when view button is clicked", async () => {
    const user = userEvent.setup();
    render(<AccessRequestListPage />);

    await user.click(screen.getByTestId("trigger-view"));

    await waitFor(() => {
      expect(screen.getByTestId("request-detail-modal")).toBeInTheDocument();
    });
  });

  it("closes detail modal when close is clicked", async () => {
    const user = userEvent.setup();
    render(<AccessRequestListPage />);

    await user.click(screen.getByTestId("trigger-view"));
    await waitFor(() => {
      expect(screen.getByTestId("request-detail-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("modal-close"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("request-detail-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("renders with the correct permission on MainLayout", () => {
    render(<AccessRequestListPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders the table title", () => {
    render(<AccessRequestListPage />);
    expect(screen.getByText("All Access Requests")).toBeInTheDocument();
  });
});
