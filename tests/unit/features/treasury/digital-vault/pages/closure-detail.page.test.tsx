import {
  closureDetailColumns,
  DIGITAL_VAULT_READ_PERMISSION,
  TransactionDetailModal,
} from "@/features/treasury";
import { ClosureDetailPage } from "@/features/treasury/digital-vault/pages/closure-detail.page";
import {
  fireEvent,
  render,
  screen,
} from "@tests/unit/utils/render-with-providers";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/treasury", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/features/treasury")>();
  return {
    ...mod,
    closureDetailColumns: vi.fn(),
    TransactionDetailModal: vi.fn(),
    TotalSummaryCard: vi.fn(() => <div data-testid="total-summary-card" />),
  };
});

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
          onRowClick,
        }: {
          title?: string;
          search?: { key: string; placeholder?: string };
          actions?: React.ReactNode;
          description?: string;
          onRowClick?: (row: unknown) => void;
        }) => (
          <div
            data-testid="data-table"
            data-title={title}
            data-search-key={search?.key}
            data-description={description}
          >
            <button
              data-testid="row-click"
              onClick={() => onRowClick?.({ id: 1 })}
            >
              Row Click
            </button>
            {actions}
          </div>
        ),
      ),
      PageHeader: ({
        title,
        description,
        actions,
      }: {
        title?: string;
        description?: string;
        actions?: React.ReactNode;
      }) => (
        <div data-testid="page-header" data-title={title}>
          <p>{description}</p>
          <div>{actions}</div>
        </div>
      ),
      formatDate: (date: string, format: string) => {
        if (format === "MMM DD, YYYY") {
          const d = new Date(date);
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}, ${d.getFullYear()}`;
        }
        if (format === "DD/MM/YYYY") {
          const d = new Date(date);
          return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
        }
        return date;
      },
      getLastThreeMonthDateRange: vi.fn(() => ({
        from: new Date("2025-04-01"),
        to: new Date("2025-06-30"),
      })),
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

vi.mock(import("react-router"), async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useParams: () => ({ stationName: "Station%20A" }),
  };
});

describe("ClosureDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(closureDetailColumns).mockReturnValue([]);
    vi.mocked(TransactionDetailModal).mockImplementation(
      ({ isOpen }: { isOpen?: boolean }) =>
        isOpen ? <div data-testid="transaction-modal" /> : null,
    );
  });

  it("renders MainLayout with correct title and permission", () => {
    render(<ClosureDetailPage />);

    const layout = screen.getByTestId("page");
    expect(layout).toHaveAttribute(
      "data-title",
      "Deposit Box  Station A Station",
    );
    expect(layout).toHaveAttribute(
      "data-permission",
      DIGITAL_VAULT_READ_PERMISSION,
    );
  });

  it("renders PageHeader with station name", () => {
    render(<ClosureDetailPage />);

    const header = screen.getByTestId("page-header");
    expect(header).toHaveAttribute("data-title", "Station A");
    expect(
      screen.getByText("View all closure records and their deposit status"),
    ).toBeInTheDocument();
  });

  it("renders TotalSummaryCard inside PageHeader actions", () => {
    render(<ClosureDetailPage />);

    expect(screen.getByTestId("total-summary-card")).toBeInTheDocument();
  });

  it("renders DataTable with Closure Details title", () => {
    render(<ClosureDetailPage />);

    const table = screen.getByTestId("data-table");
    expect(table).toHaveAttribute("data-title", "Closure Details");
    expect(table).toHaveAttribute("data-search-key", "search");
  });

  it("passes closureDetailColumns with onView handler", () => {
    render(<ClosureDetailPage />);

    expect(vi.mocked(closureDetailColumns)).toHaveBeenCalledWith(
      expect.objectContaining({
        onView: expect.any(Function),
      }),
    );
  });

  it("opens transaction modal on row click", () => {
    render(<ClosureDetailPage />);

    expect(screen.queryByTestId("transaction-modal")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("row-click"));

    expect(screen.getByTestId("transaction-modal")).toBeInTheDocument();
  });

  it("closes transaction modal when onClose is triggered", async () => {
    render(<ClosureDetailPage />);

    fireEvent.click(screen.getByTestId("row-click"));

    expect(screen.getByTestId("transaction-modal")).toBeInTheDocument();

    const modalProps = vi.mocked(TransactionDetailModal).mock.lastCall?.[0];
    act(() => {
      modalProps?.onClose?.();
    });

    expect(screen.queryByTestId("transaction-modal")).not.toBeInTheDocument();
  });

  it("renders within Page", () => {
    render(<ClosureDetailPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });
});
