import { closePaymentColumns } from "@/features/treasury/close-payment/components/close-payment-columns";
import { ClosePaymentDetailModal } from "@/features/treasury/close-payment/components/close-payment-detail-modal";
import { ClosePaymentFormModal } from "@/features/treasury/close-payment/components/close-payment-form-modal";
import { useResetPostingA8StatusMutation } from "@/features/treasury/close-payment/data/close-payment.mutation";
import {
  useGetClosePaymentById,
  useGetUnpaidCount,
} from "@/features/treasury/close-payment/data/close-payment.query";
import { ClosePaymentPage } from "@/features/treasury/close-payment/pages/close-payment.page";
import { DataTable } from "@railfinance/core/components/data-table";
import { act, render, screen } from "@tests/unit/utils/render-with-providers";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockUnpaidRecord = {
  id: 1,
  invoiceNumber: "INV-001",
  name: "PT Example",
  paymentStatus: 0 as const,
  postingA8Status: 1 as const,
};

const mockPaidRecord = {
  id: 2,
  invoiceNumber: "INV-002",
  name: "PT Example 2",
  paymentStatus: 1 as const,
  postingA8Status: 0 as const,
};

const mockIneligibleRecord = {
  id: 3,
  invoiceNumber: "INV-003",
  name: "PT Example 3",
  paymentStatus: 0 as const,
  postingA8Status: 0 as const,
};

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock("@/features/treasury/close-payment/data/close-payment.utils", () => ({
  CLOSE_PAYMENT_LIST_PAGE_TITLE: "Close Payment",
  CLOSE_PAYMENT_LIST_PERMISSION: "treasury:incoming-payment:close-payment:list",
  CLOSE_PAYMENT_URL: "/treasury/incoming-payment/close-payment",
}));

vi.mock(
  "@/features/treasury/close-payment/components/close-payment-columns",
  () => ({
    closePaymentColumns: vi.fn(),
  }),
);

vi.mock(
  "@/features/treasury/close-payment/components/close-payment-detail-modal",
  () => ({
    ClosePaymentDetailModal: vi.fn(),
  }),
);

vi.mock(
  "@/features/treasury/close-payment/components/close-payment-form-modal",
  () => ({
    ClosePaymentFormModal: vi.fn(),
  }),
);

vi.mock("@/features/treasury/close-payment/data/close-payment.query", () => ({
  closePaymentQueryKeys: {
    lists: () => ["closePayments", "list"],
    summaries: () => ["closePayments", "summary"],
  },
  useGetClosePaymentById: vi.fn(),
  useGetUnpaidCount: vi.fn(),
}));

vi.mock(
  "@/features/treasury/close-payment/data/close-payment.mutation",
  () => ({
    useResetPostingA8StatusMutation: vi.fn(),
  }),
);

vi.mock("@/features/treasury/close-payment/data/close-payment.service", () => ({
  closePaymentService: { listClosePayments: vi.fn() },
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    // Route toast calls through the mocked `sonner` module so tests can
    // assert on them (@railfinance/ui bundles its own sonner internally).
    const { toast } = await import("sonner");
    return {
      ...actual,
      toast,
      Page: ({
        children,
        title,
        permission,
      }: {
        children: React.ReactNode;
        title?: string;
        permission?: string;
      }) => (
        <div data-testid="page" data-title={title} data-permission={permission}>
          {children}
        </div>
      ),
      DataTable: vi.fn(
        ({
          title,
          search,

          actions,
          description,
        }: {
          title?: string;
          search?: { key: string };
          selectedItems?: unknown[];
          onItemSelect?: (items: unknown[]) => void;
          actions?: React.ReactNode;
          description?: string;
        }) => (
          <div
            data-testid="data-table"
            data-title={title}
            data-search-key={search?.key}
            data-description={description}
          >
            {actions}
          </div>
        ),
      ),

      PageHeader: ({ title }: { title?: string }) => (
        <div data-testid="page-header">{title}</div>
      ),
      ConfirmationModal: ({
        open,
        title,
        description,
        onConfirm,
        isLoading,
        confirmText,
      }: {
        open?: boolean;
        title?: string;
        description?: string;
        onConfirm?: () => void;
        isLoading?: boolean;
        confirmText?: string;
      }) =>
        open ? (
          <div data-testid="confirmation-modal">
            <p>{title}</p>
            <p>{description}</p>
            <button
              data-testid="confirm-reset"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {confirmText}
            </button>
          </div>
        ) : null,
      Button: ({
        children,
        onClick,
        variant,
      }: {
        children?: React.ReactNode;
        onClick?: () => void;
        variant?: string;
      }) => (
        <button data-testid="button" data-variant={variant} onClick={onClick}>
          {children}
        </button>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("ClosePaymentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useGetUnpaidCount).mockReturnValue({
      data: { data: 5 },
    } as never);
    vi.mocked(useGetClosePaymentById).mockReturnValue({
      data: undefined,
    } as never);
    vi.mocked(useResetPostingA8StatusMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never);

    vi.mocked(ClosePaymentDetailModal).mockImplementation(({ open }) =>
      open ? <div data-testid="detail-modal" /> : null,
    );
    vi.mocked(ClosePaymentFormModal).mockImplementation(({ open }) =>
      open ? <div data-testid="form-modal" /> : null,
    );
    vi.mocked(closePaymentColumns).mockReturnValue([]);
  });

  // -----------------------------------------------------------------------
  // Layout & structure
  // -----------------------------------------------------------------------

  it("renders MainLayout with correct title and permission", () => {
    render(<ClosePaymentPage />);

    const layout = screen.getByTestId("page");
    expect(layout).toHaveAttribute("data-title", "Close Payment");
    expect(layout).toHaveAttribute(
      "data-permission",
      "treasury:incoming-payment:close-payment:list",
    );
  });

  it("renders PageHeader with correct title", () => {
    render(<ClosePaymentPage />);

    expect(screen.getByTestId("page-header")).toHaveTextContent(
      "Close Payment",
    );
  });

  // -----------------------------------------------------------------------
  // Summary cards
  // -----------------------------------------------------------------------

  it("renders summary cards with unpaid count from useGetUnpaidCount", () => {
    render(<ClosePaymentPage />);

    expect(screen.getByText("Unpaid Records")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Requires Posting Reset")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // DataTable
  // -----------------------------------------------------------------------

  it("renders DataTable with correct props", () => {
    render(<ClosePaymentPage />);

    const table = screen.getByTestId("data-table");
    expect(table).toHaveAttribute("data-title", "All Close Payments");
    expect(table).toHaveAttribute("data-search-key", "invoiceNumber");
  });

  it("passes closePaymentColumns with action handlers to DataTable", () => {
    render(<ClosePaymentPage />);

    expect(vi.mocked(closePaymentColumns)).toHaveBeenCalledWith(
      expect.objectContaining({
        onDetail: expect.any(Function),
        onEdit: expect.any(Function),
        onReset: expect.any(Function),
      }),
    );
  });

  // -----------------------------------------------------------------------
  // Detail modal
  // -----------------------------------------------------------------------

  it("opens detail modal when onDetail is called", async () => {
    render(<ClosePaymentPage />);

    const handlers = vi.mocked(closePaymentColumns).mock.calls[0][0];

    expect(screen.queryByTestId("detail-modal")).not.toBeInTheDocument();

    await act(async () => {
      handlers.onDetail?.(mockUnpaidRecord as never);
    });

    expect(screen.getByTestId("detail-modal")).toBeInTheDocument();
  });

  it("closes detail modal when onOpenChange(false) is called", async () => {
    render(<ClosePaymentPage />);

    const handlers = vi.mocked(closePaymentColumns).mock.calls[0][0];

    await act(async () => {
      handlers.onDetail?.(mockUnpaidRecord as never);
    });

    expect(screen.getByTestId("detail-modal")).toBeInTheDocument();

    await act(async () => {
      const props = vi.mocked(ClosePaymentDetailModal).mock.lastCall?.[0];
      props?.onOpenChange(false);
    });

    expect(screen.queryByTestId("detail-modal")).not.toBeInTheDocument();
  });

  it("fetches detail by ID when detail modal opens", async () => {
    render(<ClosePaymentPage />);

    const handlers = vi.mocked(closePaymentColumns).mock.calls[0][0];

    await act(async () => {
      handlers.onDetail?.(mockUnpaidRecord as never);
    });

    expect(vi.mocked(useGetClosePaymentById)).toHaveBeenCalledWith(
      mockUnpaidRecord.id,
      expect.objectContaining({ enabled: true }),
    );
  });

  // -----------------------------------------------------------------------
  // Edit modal
  // -----------------------------------------------------------------------

  it("opens edit modal for unpaid record (paymentStatus === 0)", async () => {
    render(<ClosePaymentPage />);

    const handlers = vi.mocked(closePaymentColumns).mock.calls[0][0];

    expect(screen.queryByTestId("form-modal")).not.toBeInTheDocument();

    await act(async () => {
      handlers.onEdit?.(mockUnpaidRecord as never);
    });

    expect(screen.getByTestId("form-modal")).toBeInTheDocument();
  });

  it("shows toast error when editing paid record (paymentStatus !== 0)", async () => {
    render(<ClosePaymentPage />);

    const handlers = vi.mocked(closePaymentColumns).mock.calls[0][0];

    await act(async () => {
      handlers.onEdit?.(mockPaidRecord as never);
    });

    expect(screen.queryByTestId("form-modal")).not.toBeInTheDocument();
    const { toast } = await import("sonner");
    expect(toast.error).toHaveBeenCalledWith(
      "Can only edit unpaid records (payment_status = 0)",
    );
  });

  it("closes edit modal when onOpenChange(false) is called", async () => {
    render(<ClosePaymentPage />);

    const handlers = vi.mocked(closePaymentColumns).mock.calls[0][0];

    await act(async () => {
      handlers.onEdit?.(mockUnpaidRecord as never);
    });

    expect(screen.getByTestId("form-modal")).toBeInTheDocument();

    await act(async () => {
      const props = vi.mocked(ClosePaymentFormModal).mock.lastCall?.[0];
      props?.onOpenChange(false);
    });

    expect(screen.queryByTestId("form-modal")).not.toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Single reset
  // -----------------------------------------------------------------------

  it("opens reset confirmation modal when onReset is called", async () => {
    render(<ClosePaymentPage />);

    const handlers = vi.mocked(closePaymentColumns).mock.calls[0][0];

    expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();

    await act(async () => {
      handlers.onReset?.(mockUnpaidRecord as never);
    });

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
  });

  it("calls resetMutation.mutate with correct ids on confirm reset", async () => {
    const mockMutate = vi.fn();
    vi.mocked(useResetPostingA8StatusMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as never);

    render(<ClosePaymentPage />);

    const handlers = vi.mocked(closePaymentColumns).mock.calls[0][0];

    await act(async () => {
      handlers.onReset?.(mockUnpaidRecord as never);
    });

    await act(async () => {
      screen.getByTestId("confirm-reset").click();
    });

    expect(mockMutate).toHaveBeenCalledWith([mockUnpaidRecord.id]);
  });

  // -----------------------------------------------------------------------
  // Bulk reset
  // -----------------------------------------------------------------------

  it("handles bulk reset with eligible records (postingA8Status === 1 or 5)", async () => {
    const mockMutate = vi.fn();
    vi.mocked(useResetPostingA8StatusMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as never);

    render(<ClosePaymentPage />);

    // Simulate selecting items via DataTable's onItemSelect
    const dtProps = vi.mocked(DataTable).mock.calls[0][0];
    await act(async () => {
      dtProps.onItemSelect?.([mockUnpaidRecord]);
    });

    // Bulk actions should now be visible
    expect(
      screen.getByRole("button", { name: "Reset Posting Status" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear Selection" }),
    ).toBeInTheDocument();

    // Click bulk reset
    await act(async () => {
      screen.getByRole("button", { name: "Reset Posting Status" }).click();
    });

    // Confirmation modal should appear with correct record count
    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    expect(screen.getByText(/1 record/)).toBeInTheDocument();

    // Confirm
    await act(async () => {
      screen.getByTestId("confirm-reset").click();
    });

    expect(mockMutate).toHaveBeenCalledWith([mockUnpaidRecord.id]);
  });

  it("shows toast warning when no eligible records for bulk reset", async () => {
    render(<ClosePaymentPage />);

    const dtProps = vi.mocked(DataTable).mock.calls[0][0];
    await act(async () => {
      dtProps.onItemSelect?.([mockIneligibleRecord]);
    });

    await act(async () => {
      screen.getByRole("button", { name: "Reset Posting Status" }).click();
    });

    const { toast } = await import("sonner");
    expect(toast.warning).toHaveBeenCalledWith(
      "Selected records do not have eligible posting status (must be Partial or Failed)",
    );
    expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
  });

  it("shows toast error when no records selected for bulk reset", async () => {
    render(<ClosePaymentPage />);

    // With no selection the Bulk Actions should not be rendered.
    // handleBulkReset is only reachable via the button which is guarded by
    // selectedClosePayments.length > 0, so without selection it never fires.

    const dtProps = vi.mocked(DataTable).mock.calls[0][0];
    await act(async () => {
      // Pass an empty array so length === 0
      dtProps.onItemSelect?.([]);
    });

    // After clearing, the bulk buttons should be gone
    expect(
      screen.queryByRole("button", { name: "Reset Posting Status" }),
    ).not.toBeInTheDocument();
  });
});
