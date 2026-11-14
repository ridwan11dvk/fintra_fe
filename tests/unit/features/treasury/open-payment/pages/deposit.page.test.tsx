import {
  depositColumns,
  DepositDetailModal,
  DepositFormModal,
  useBulkUpdateSendStatusMutation,
  useUpdateSendStatusMutation,
} from "@/features/treasury";
import { DepositPage } from "@/features/treasury/open-payment/pages/deposit.page";
import { DataTable } from "@railfinance/core/components/data-table";
import { act, render, screen } from "@tests/unit/utils/render-with-providers";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDepositNotSent = {
  id: 1,
  agentCode: "AGT001",
  name: "John Doe",
  sendStatus: 0 as const,
};

const mockDepositSent = {
  id: 2,
  agentCode: "AGT002",
  name: "Jane Smith",
  sendStatus: 1 as const,
};

vi.mock("@/features/treasury", () => ({
  DEPOSIT_LIST_PAGE_TITLE: "Open Payment",
  DEPOSIT_LIST_PERMISSION:
    "treasury:incoming-payment:open-payment:deposit:list",
  DEPOSIT_URL: "/treasury/incoming-payment/open-payment",
  depositColumns: vi.fn(),
  DepositDetailModal: vi.fn(),
  DepositFormModal: vi.fn(),
  DepositSummaryCards: vi.fn(() => <div data-testid="summary-cards" />),
  depositQueryKeys: {
    all: ["deposits"],
    lists: () => ["deposits", "list"],
    details: () => ["deposits", "detail"],
    detail: (id: number) => ["deposits", "detail", id],
    summaries: () => ["deposits", "summary"],
    summary: () => ["deposits", "summary", "stats"],
    countByStatus: () => ["deposits", "summary", "count-by-status"],
  },
  depositService: { listDeposits: vi.fn() },
  useUpdateSendStatusMutation: vi.fn(),
  useBulkUpdateSendStatusMutation: vi.fn(),
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
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

      PageHeader: ({ description }: { title?: string; description?: string }) => (
        <div data-testid="page-header">{description}</div>
      ),
      ConfirmationModal: ({
        open,
        title,
        description,
        onConfirm,
        isLoading,
      }: {
        open?: boolean;
        title?: string;
        description?: string;
        onConfirm?: () => void;
        isLoading?: boolean;
      }) =>
        open ? (
          <div data-testid="confirmation-modal">
            <p>{title}</p>
            <p>{description}</p>
            <button
              data-testid="confirm-action"
              onClick={onConfirm}
              disabled={isLoading}
            >
              Confirm
            </button>
          </div>
        ) : null,
      Button: ({
        children,
        onClick,
        variant,
        size,
      }: {
        children?: React.ReactNode;
        onClick?: () => void;
        variant?: string;
        size?: string;
      }) => (
        <button
          data-testid="button"
          data-variant={variant}
          data-size={size}
          onClick={onClick}
        >
          {children}
        </button>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/skeleton", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("DepositPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUpdateSendStatusMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never);
    vi.mocked(useBulkUpdateSendStatusMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never);
    vi.mocked(DepositDetailModal).mockImplementation(
      ({ isOpen }: { isOpen?: boolean }) =>
        isOpen ? <div data-testid="detail-modal" /> : null,
    );
    vi.mocked(DepositFormModal).mockImplementation(
      ({ isOpen }: { isOpen?: boolean }) =>
        isOpen ? <div data-testid="form-modal" /> : null,
    );
    vi.mocked(depositColumns).mockReturnValue([]);
  });

  it("renders MainLayout with correct title and permission", () => {
    render(<DepositPage />);

    const layout = screen.getByTestId("page");
    expect(layout).toHaveAttribute("data-title", "Open Payment");
    expect(layout).toHaveAttribute(
      "data-permission",
      "treasury:incoming-payment:open-payment:deposit:list",
    );
  });

  it("renders PageHeader with correct description", () => {
    render(<DepositPage />);

    expect(screen.getByTestId("page-header")).toHaveTextContent(
      "Deposit transactions monitoring. View, edit, and manage transmission status for virtual account deposits.",
    );
  });

  it("renders SummaryCards component", () => {
    render(<DepositPage />);

    expect(screen.getByTestId("summary-cards")).toBeInTheDocument();
  });

  it("renders DataTable with correct props", () => {
    render(<DepositPage />);

    const table = screen.getByTestId("data-table");
    expect(table).toHaveAttribute("data-title", "All Deposits");
    expect(table).toHaveAttribute("data-search-key", "search");
  });

  it("passes depositColumns with action handlers to DataTable", () => {
    render(<DepositPage />);

    expect(vi.mocked(depositColumns)).toHaveBeenCalledWith(
      expect.objectContaining({
        onDetail: expect.any(Function),
        onEdit: expect.any(Function),
        onToggleSendStatus: expect.any(Function),
      }),
    );
  });

  it("opens detail modal when onDetail is called", async () => {
    render(<DepositPage />);

    const handlers = vi.mocked(depositColumns).mock.calls[0][0];

    expect(screen.queryByTestId("detail-modal")).not.toBeInTheDocument();

    await act(async () => {
      handlers.onDetail?.(mockDepositNotSent as never);
    });

    expect(screen.getByTestId("detail-modal")).toBeInTheDocument();
  });

  it("closes detail modal when onClose is triggered", async () => {
    render(<DepositPage />);

    const handlers = vi.mocked(depositColumns).mock.calls[0][0];

    await act(async () => {
      handlers.onDetail?.(mockDepositNotSent as never);
    });

    expect(screen.getByTestId("detail-modal")).toBeInTheDocument();

    const detailModalProps = vi.mocked(DepositDetailModal).mock.lastCall?.[0];
    await act(async () => {
      detailModalProps?.onClose?.();
    });

    expect(screen.queryByTestId("detail-modal")).not.toBeInTheDocument();
  });

  it("opens edit modal when onEdit is called", async () => {
    render(<DepositPage />);

    const handlers = vi.mocked(depositColumns).mock.calls[0][0];

    expect(screen.queryByTestId("form-modal")).not.toBeInTheDocument();

    await act(async () => {
      handlers.onEdit?.(mockDepositNotSent as never);
    });

    expect(screen.getByTestId("form-modal")).toBeInTheDocument();
  });

  it("closes edit modal when onClose is triggered", async () => {
    render(<DepositPage />);

    const handlers = vi.mocked(depositColumns).mock.calls[0][0];

    await act(async () => {
      handlers.onEdit?.(mockDepositNotSent as never);
    });

    expect(screen.getByTestId("form-modal")).toBeInTheDocument();

    const formModalProps = vi.mocked(DepositFormModal).mock.lastCall?.[0];
    await act(async () => {
      formModalProps?.onClose?.();
    });

    expect(screen.queryByTestId("form-modal")).not.toBeInTheDocument();
  });

  it("opens confirmation modal when onToggleSendStatus is called", async () => {
    render(<DepositPage />);

    const handlers = vi.mocked(depositColumns).mock.calls[0][0];

    expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();

    await act(async () => {
      handlers.onToggleSendStatus?.(mockDepositNotSent as never);
    });

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
  });

  it("shows correct confirmation text for sendStatus 0 (Mark as Sent)", async () => {
    render(<DepositPage />);

    const handlers = vi.mocked(depositColumns).mock.calls[0][0];

    await act(async () => {
      handlers.onToggleSendStatus?.(mockDepositNotSent as never);
    });

    expect(screen.getByText("Update Send Status")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to mark this deposit as Sent?"),
    ).toBeInTheDocument();
  });

  it("shows correct confirmation text for sendStatus 1 (Mark as Not Sent)", async () => {
    render(<DepositPage />);

    const handlers = vi.mocked(depositColumns).mock.calls[0][0];

    await act(async () => {
      handlers.onToggleSendStatus?.(mockDepositSent as never);
    });

    expect(
      screen.getByText(
        "Are you sure you want to mark this deposit as Not Sent?",
      ),
    ).toBeInTheDocument();
  });

  it("calls updateSendStatusMutation when confirmation is confirmed", async () => {
    const mockMutate = vi.fn();
    vi.mocked(useUpdateSendStatusMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as never);

    render(<DepositPage />);

    const handlers = vi.mocked(depositColumns).mock.calls[0][0];

    await act(async () => {
      handlers.onToggleSendStatus?.(mockDepositNotSent as never);
    });

    await act(async () => {
      screen.getByTestId("confirm-action").click();
    });

    expect(mockMutate).toHaveBeenCalledWith({
      id: mockDepositNotSent.id,
      sendStatus: 1,
    });
  });

  it("handles bulk update send status with selected items", async () => {
    const mockMutate = vi.fn();
    vi.mocked(useBulkUpdateSendStatusMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as never);

    render(<DepositPage />);

    const dtProps = vi.mocked(DataTable).mock.calls[0][0];
    await act(async () => {
      dtProps.onItemSelect?.([mockDepositNotSent]);
    });

    expect(screen.getByText("Mark as Sent")).toBeInTheDocument();
    expect(screen.getByText("Mark as Not Sent")).toBeInTheDocument();

    await act(async () => {
      screen.getByText("Mark as Sent").click();
    });

    expect(mockMutate).toHaveBeenCalledWith({
      ids: [mockDepositNotSent.id],
      sendStatus: 1,
    });
  });

  it("shows description with selected record count", async () => {
    render(<DepositPage />);

    const dtProps = vi.mocked(DataTable).mock.calls[0][0];
    await act(async () => {
      dtProps.onItemSelect?.([mockDepositNotSent]);
    });

    const table = screen.getByTestId("data-table");
    expect(table).toHaveAttribute("data-description", "1 record(s) selected");
  });

  it("shows toast error when bulk update with empty selection", async () => {
    render(<DepositPage />);

    const dtProps = vi.mocked(DataTable).mock.calls[0][0];
    await act(async () => {
      dtProps.onItemSelect?.([]);
    });

    expect(screen.queryByText("Mark as Sent")).not.toBeInTheDocument();
  });
});
