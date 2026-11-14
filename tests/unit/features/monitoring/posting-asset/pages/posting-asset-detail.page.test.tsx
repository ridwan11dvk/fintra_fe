import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockDeleteMutate = vi.fn();

const mockData = vi.hoisted(() => ({
  records: [
    {
      id: 1,
      fileName: null,
      recordNumber: "001",
      transactionCode: "TC01",
      withholdingTax: null,
      reversalFlag: "A",
      documentType: "DR",
      postingDate: "20240115",
      documentDate: "20240115",
      documentNumber: "DOC-001",
      reference: "REF-001",
      debitCreditFlag: "S",
      accountNumber: "123",
      alternativeAccount: null,
      amount: 1000000,
      businessArea: "BA01",
      segment: "",
      fixedAssetNumber: "",
      costCenter: "",
      profitCenter: "",
      internalOrderFlag: null,
      assignment: null,
      vendor: null,
      customer: null,
      postingStatus: 0,
      postingTimestamp: null,
      sapStatus: null,
      sapDocumentNumber: null,
      fiscalYear: null,
      virtualAccount: null,
      recordIndex: null,
      totalIndex: null,
      assetAccountFlag: null,
      wwrvc: null,
      kndnr: null,
      wwprd: null,
      createdAt: null,
      updatedAt: null,
    },
  ],
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
      Page: ({
        children,
        isLoading,
        isError,
        isEmpty,
      }: {
        children: React.ReactNode;
        isLoading?: boolean;
        isError?: boolean;
        isEmpty?: boolean;
      }) => (
        <div
          data-testid="page"
          data-loading={isLoading}
          data-error={isError}
          data-empty={isEmpty}
        >
          {children}
        </div>
      ),
      PageHeader: ({
        title,
        actions,
        description,
      }: {
        title?: string;
        actions?: React.ReactNode;
        description?: string;
      }) => (
        <div data-testid="page-header">
          <h1>{title}</h1>
          <p data-testid="page-description">{description}</p>
          <div data-testid="header-actions">{actions}</div>
        </div>
      ),
      ActionButton: ({
        onClick,
        variant,
        visible,
      }: {
        onClick?: () => void;
        variant?: string;
        visible?: boolean;
      }) =>
        visible !== false ? (
          <button data-testid={`action-btn-${variant}`} onClick={onClick}>
            {variant}
          </button>
        ) : null,
      SapStatusBadge: ({ status }: { status: string }) => (
        <div data-testid={`sap-badge-${status}`}>{status}</div>
      ),
      ConfirmationModal: ({
        open,
        onConfirm,
        onOpenChange,
      }: {
        open?: boolean;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
      }) =>
        open ? (
          <div data-testid="confirmation-modal">
            <button data-testid="confirm-delete" onClick={onConfirm}>
              Confirm Delete
            </button>
            <button
              data-testid="cancel-delete"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </button>
          </div>
        ) : null,
      OfflineDataTable: ({
        data,
        columns,
      }: {
        data: unknown[];
        columns: unknown[];
      }) => (
        <div data-testid="offline-data-table">
          <span data-testid="records-count">{data?.length}</span>
          <span data-testid="columns-count">{columns?.length}</span>
        </div>
      ),
      formatDate: (date: string) => date ?? "",
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/activity-feed", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/constants", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/progress", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/skeleton", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useParams: () => ({
      reversalFlag: "A",
      documentNumber: "DOC-001",
      reference: "REF-001",
    }),
  };
});

vi.mock("@/features/monitoring", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/monitoring")>();
  return {
    ...actual,
    usePostingAssetByTransaction: () => ({
      data: {
        status: "SUCCESS",
        message: "ok",
        data: mockData.records,
      },
      isLoading: false,
      isError: false,
    }),
    useDeletePostingAssetMutation: ({
      onSuccess,
    }: {
      onSuccess?: () => void;
    }) => ({
      mutate: (id: number) => {
        mockDeleteMutate(id);
        onSuccess?.();
      },
      isPending: false,
    }),
    postingAssetDetailColumns: () => [
      { id: "no", meta: { title: "No." } },
      { id: "actions", meta: { title: "Actions" } },
    ],
    PostingAssetFormModal: ({
      open,
      mode,
      onOpenChange,
      onSuccess,
    }: {
      open?: boolean;
      mode?: string;
      onOpenChange?: (open: boolean) => void;
      onSuccess?: () => void;
    }) =>
      open ? (
        <div data-testid="form-modal" data-mode={mode}>
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

import { PostingAssetDetailPage } from "@/features/monitoring/posting-asset/pages/posting-asset-detail.page";

describe("PostingAssetDetailPage", () => {
  beforeEach(() => {
    mockData.records[0].sapStatus = null;
  });

  it("renders the detail page with layout", () => {
    render(<PostingAssetDetailPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders page header with title", () => {
    render(<PostingAssetDetailPage />);
    expect(screen.getByTestId("page-header")).toBeInTheDocument();
    expect(screen.getByText("Posting Detail")).toBeInTheDocument();
  });

  it("renders document number, reference and reversal flag in header", () => {
    render(<PostingAssetDetailPage />);
    expect(screen.getByText("DOC-001")).toBeInTheDocument();
    expect(screen.getByText("REF-001")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders OfflineDataTable with records", () => {
    render(<PostingAssetDetailPage />);
    expect(screen.getByTestId("offline-data-table")).toBeInTheDocument();
    expect(screen.getByTestId("records-count")).toHaveTextContent("1");
  });

  it("renders Add button in actions", () => {
    render(<PostingAssetDetailPage />);
    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("opens form modal when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<PostingAssetDetailPage />);

    await user.click(screen.getByTestId("action-btn-add"));

    await waitFor(() => {
      expect(screen.getByTestId("form-modal")).toBeInTheDocument();
    });
  });

  it("opens form modal in create mode when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<PostingAssetDetailPage />);

    await user.click(screen.getByTestId("action-btn-add"));

    await waitFor(() => {
      expect(screen.getByTestId("form-modal")).toHaveAttribute(
        "data-mode",
        "create",
      );
    });
  });

  it("closes form modal after successful form submission", async () => {
    const user = userEvent.setup();
    render(<PostingAssetDetailPage />);

    await user.click(screen.getByTestId("action-btn-add"));
    await waitFor(() => {
      expect(screen.getByTestId("form-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("form-submit"));

    await waitFor(() => {
      expect(screen.queryByTestId("form-modal")).not.toBeInTheDocument();
    });
  });

  it("renders SAP Status with dash when firstRecord has no sapStatus", () => {
    render(<PostingAssetDetailPage />);
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("does not render Add button when sapStatus is S", () => {
    mockData.records[0].sapStatus = "S";
    render(<PostingAssetDetailPage />);
    expect(screen.queryByTestId("action-btn-add")).not.toBeInTheDocument();
  });

  it("renders SAP Status badge when firstRecord has sapStatus", () => {
    mockData.records[0].sapStatus = "E";
    render(<PostingAssetDetailPage />);
    expect(screen.getByTestId("sap-badge-E")).toBeInTheDocument();
  });
});
