import {
  closuredetailUrl,
  DIGITAL_VAULT_LIST_PERMISSION,
  DIGITAL_VAULT_STATION_LIST_PAGE_TITLE,
  StationListCardGrid,
} from "@/features/treasury";
import { StationListPage } from "@/features/treasury/digital-vault/pages/station-list.page";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/treasury", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/features/treasury")>();
  return {
    ...mod,
    TotalSummaryCard: vi.fn(() => <div data-testid="total-summary-card" />),
    StationListCardGrid: vi.fn(
      ({
        title,
        search,
        onView,
      }: {
        title?: string;
        search?: { key: string; placeholder?: string };
        onView: (station: unknown) => void;
      }) => (
        <div
          data-testid="data-table"
          data-title={title}
          data-search-key={search?.key}
        >
          <button
            data-testid="row-click"
            onClick={() => onView({ stationName: "Station A" })}
          >
            Row Click
          </button>
        </div>
      ),
    ),
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
              onClick={() => onRowClick?.({ stationName: "Station A" })}
            >
              Row Click
            </button>
            {actions}
          </div>
        ),
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

let mockNavigateFn: ReturnType<typeof vi.fn> = vi.fn();

const mockedStationListCardGrid = vi.mocked(StationListCardGrid);

vi.mock(import("react-router"), async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigateFn,
  };
});

describe("StationListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigateFn = vi.fn(() => vi.fn());
  });

  it("renders MainLayout with correct title and permission", () => {
    render(<StationListPage />);

    const layout = screen.getByTestId("page");
    expect(layout).toHaveAttribute(
      "data-title",
      DIGITAL_VAULT_STATION_LIST_PAGE_TITLE,
    );
    expect(layout).toHaveAttribute(
      "data-permission",
      DIGITAL_VAULT_LIST_PERMISSION,
    );
  });

  it("renders PageHeader with correct content", () => {
    render(<StationListPage />);

    const header = screen.getByTestId("page-header");
    expect(header).toHaveAttribute("data-title", "Deposit Box");
    expect(
      screen.getByText(
        "Real-time revenue deposit monitoring and reconciliation",
      ),
    ).toBeInTheDocument();
  });

  it("renders TotalSummaryCard inside PageHeader actions", () => {
    render(<StationListPage />);

    expect(screen.getByTestId("total-summary-card")).toBeInTheDocument();
  });

  it("renders DataTable with Station Summary title", () => {
    render(<StationListPage />);

    const table = screen.getByTestId("data-table");
    expect(table).toHaveAttribute("data-title", "Station Summary");
    expect(table).toHaveAttribute("data-search-key", "search");
  });

  it("passes StationListCardGrid an onView handler", () => {
    render(<StationListPage />);

    expect(mockedStationListCardGrid.mock.calls[0][0]).toMatchObject({
      onView: expect.any(Function),
    });
  });

  it("navigates to closure detail on row click", async () => {
    const navigate = vi.fn();
    mockNavigateFn = navigate;

    render(<StationListPage />);

    const btn = screen.getByTestId("row-click");
    btn.click();

    expect(navigate).toHaveBeenCalledWith(closuredetailUrl("Station A"));
  });

  it("renders within Page", () => {
    render(<StationListPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });
});
