import { dashboardUiMocks } from "@tests/unit/mocks/dashboard-components-mock";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/treasury", () => ({
  TREASURY_DASHBOARD_PAGE_TITLE: "Treasury Dashboard",
  TREASURY_DASHBOARD_BASE: "dashboard",
  TREASURY_DASHBOARD_URL: "/treasury/dashboard",
}));

import { TreasuryDashboardPage } from "@/features/treasury/dashboard/pages/treasury-dashboard.page";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      ...dashboardUiMocks,
      Page: ({
        children,
        type,
        title,
      }: {
        children: React.ReactNode;
        type?: string;
        title?: string;
      }) => (
        <div data-testid="page" data-type={type} data-title={title}>
          {children}
        </div>
      ),
      fmtIDR: (n: number) => `Rp${(n / 1_000_000_000).toFixed(1)}B`,
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

describe("TreasuryDashboardPage", () => {
  it("renders within Page with type='treasury'", () => {
    render(<TreasuryDashboardPage />);
    const layout = screen.getByTestId("page");
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveAttribute("data-type", "treasury");
  });

  it("passes page title to MainLayout", () => {
    render(<TreasuryDashboardPage />);
    const layout = screen.getByTestId("page");
    expect(layout).toHaveAttribute("data-title", "Treasury Dashboard");
  });

  it("renders PageHeader with correct title", () => {
    render(<TreasuryDashboardPage />);
    const header = screen.getByTestId("page-header");
    expect(header).toHaveAttribute("data-title", "Treasury Dashboard");
  });

  it("renders 6 KpiCards with correct labels", () => {
    render(<TreasuryDashboardPage />);
    const cards = screen.getAllByTestId("kpi-card");
    expect(cards).toHaveLength(6);
    expect(cards[0]).toHaveAttribute("data-label", "Bank Balance");
    expect(cards[1]).toHaveAttribute("data-label", "Incoming Today");
    expect(cards[2]).toHaveAttribute("data-label", "Outgoing Today");
    expect(cards[3]).toHaveAttribute("data-label", "Open Payment");
    expect(cards[4]).toHaveAttribute("data-label", "Deposit Box");
    expect(cards[5]).toHaveAttribute("data-label", "Net Cash Position");
  });

  it("renders KpiCard with formatted IDR values", () => {
    render(<TreasuryDashboardPage />);
    const cards = screen.getAllByTestId("kpi-card");
    const getVal = (label: string) =>
      cards.find((c) => c.getAttribute("data-label") === label)?.textContent;
    expect(getVal("Bank Balance")).toBe("Rp284.5B");
    expect(getVal("Incoming Today")).toBe("Rp6.8B");
    expect(getVal("Outgoing Today")).toBe("Rp4.2B");
    expect(getVal("Open Payment")).toBe("Rp12.4B");
    expect(getVal("Deposit Box")).toBe("Rp45.0B");
    expect(getVal("Net Cash Position")).toBe("Rp228.5B");
  });

  it("renders 2 Chart components with correct types", () => {
    render(<TreasuryDashboardPage />);
    const charts = screen.getAllByTestId("chart");
    expect(charts).toHaveLength(2);
    expect(charts[0]).toHaveAttribute("data-type", "line");
    expect(charts[1]).toHaveAttribute("data-type", "donut");
  });

  it("renders bank list rows inside Cash Position Summary", () => {
    render(<TreasuryDashboardPage />);
    expect(screen.getByText("BCA Operasional")).toBeInTheDocument();
    expect(screen.getByText("Mandiri Payroll")).toBeInTheDocument();
    expect(screen.getByText("BNI Treasury")).toBeInTheDocument();
    expect(screen.getByText("BRI Collection")).toBeInTheDocument();
  });

  it("renders bank amounts with fmtIDR", () => {
    render(<TreasuryDashboardPage />);
    expect(screen.getByText("Rp124.0B")).toBeInTheDocument();
    expect(screen.getByText("Rp64.0B")).toBeInTheDocument();
    expect(screen.getByText("Rp52.0B")).toBeInTheDocument();
    expect(screen.getByText("Rp44.5B")).toBeInTheDocument();
  });

  it("renders section cards with correct titles", () => {
    render(<TreasuryDashboardPage />);
    const sections = screen.getAllByTestId("section-card");
    const titles = sections.map((s) => s.getAttribute("data-title"));
    expect(titles).toContain("Cash Position Summary");
    expect(titles).toContain("7-day Cash Flow Trend");
    expect(titles).toContain("House Bank Distribution");
    expect(titles).toContain("Incoming Payment Summary");
    expect(titles).toContain("Outgoing Payment Summary");
    expect(titles).toContain("Open Items");
    expect(titles).toContain("Treasury Alerts");
    expect(titles).toContain("Recent Transactions");
    expect(titles).toContain("Cash Forecast \u2014 Next 7 Days");
  });

  it("renders AlertBanner", () => {
    render(<TreasuryDashboardPage />);
    expect(screen.getByTestId("alert-banner")).toBeInTheDocument();
  });

  it("renders 5 SimpleTables", () => {
    render(<TreasuryDashboardPage />);
    const tables = screen.getAllByTestId("simple-table");
    expect(tables).toHaveLength(5);
  });

  it("renders incoming payment data with formatted amounts", () => {
    render(<TreasuryDashboardPage />);
    const sections = screen.getAllByTestId("section-card");
    const incomingSection = sections.find(
      (s) => s.getAttribute("data-title") === "Incoming Payment Summary",
    );
    expect(incomingSection).toBeInTheDocument();
    expect(screen.getAllByText("Rp0.4B").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Rp0.5B").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Rp1.1B").length).toBeGreaterThanOrEqual(1);
  });

  it("renders recent transactions with positive and negative amounts", () => {
    render(<TreasuryDashboardPage />);
    expect(screen.getAllByText(/Rp0\.4B/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Rp-0.5B").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Rp-0.1B").length).toBeGreaterThanOrEqual(1);
  });

  it("renders Cash Forecast table with 7 rows", () => {
    render(<TreasuryDashboardPage />);
    const rows = screen.getAllByTestId("simple-table-row");
    expect(rows.length).toBeGreaterThanOrEqual(14);
  });

  it("renders forecast day labels", () => {
    render(<TreasuryDashboardPage />);
    expect(screen.getByText("Mon Jun 09")).toBeInTheDocument();
    expect(screen.getByText("Sun Jun 15")).toBeInTheDocument();
  });
});
