import { dashboardUiMocks } from "@tests/unit/mocks/dashboard-components-mock";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/receivable", () => ({
  RECEIVABLE_DASHBOARD_PAGE_TITLE: "Receivable Dashboard",
  RECEIVABLE_DASHBOARD_BASE: "dashboard",
  RECEIVABLE_DASHBOARD_URL: "/receivable/dashboard",
}));

import { ReceivableDashboardPage } from "@/features/receivable/dashboard/pages/receivable-dashboard.page";

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
      fmtPct: (n: number, digits?: number) => `${n.toFixed(digits ?? 0)}%`,

      Progress: ({ value }: { value?: number }) => (
        <div data-testid="progress" data-value={value} />
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/activity-feed", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/progress", __railfinanceCoreMock);

describe("ReceivableDashboardPage", () => {
  it("renders within Page with type='receivable'", () => {
    render(<ReceivableDashboardPage />);
    const layout = screen.getByTestId("page");
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveAttribute("data-type", "receivable");
  });

  it("passes page title to MainLayout", () => {
    render(<ReceivableDashboardPage />);
    const layout = screen.getByTestId("page");
    expect(layout).toHaveAttribute("data-title", "Receivable Dashboard");
  });

  it("renders PageHeader with correct title", () => {
    render(<ReceivableDashboardPage />);
    const header = screen.getByTestId("page-header");
    expect(header).toHaveAttribute("data-title", "Receivable Dashboard");
  });

  it("renders AlertBanner", () => {
    render(<ReceivableDashboardPage />);
    expect(screen.getByTestId("alert-banner")).toBeInTheDocument();
  });

  it("renders 6 KpiCards with correct labels", () => {
    render(<ReceivableDashboardPage />);
    const cards = screen.getAllByTestId("kpi-card");
    expect(cards).toHaveLength(6);
    expect(cards[0]).toHaveAttribute("data-label", "Total Receivable");
    expect(cards[1]).toHaveAttribute("data-label", "Monthly Billing");
    expect(cards[2]).toHaveAttribute("data-label", "Collected");
    expect(cards[3]).toHaveAttribute("data-label", "Collection Rate");
    expect(cards[4]).toHaveAttribute("data-label", "Overdue Receivable");
    expect(cards[5]).toHaveAttribute("data-label", "DSO");
  });

  it("renders KpiCard with formatted IDR values", () => {
    render(<ReceivableDashboardPage />);
    expect(screen.getByText("Rp142.8B")).toBeInTheDocument();
    expect(screen.getByText("Rp38.4B")).toBeInTheDocument();
    expect(screen.getByText("Rp28.9B")).toBeInTheDocument();
    expect(screen.getByText("Rp9.2B")).toBeInTheDocument();
  });

  it("renders KpiCard with percentage and days values", () => {
    render(<ReceivableDashboardPage />);
    expect(screen.getByText("75.3%")).toBeInTheDocument();
    expect(screen.getByText("42 days")).toBeInTheDocument();
  });

  it("renders 5 Chart components with correct types", () => {
    render(<ReceivableDashboardPage />);
    const charts = screen.getAllByTestId("chart");
    expect(charts).toHaveLength(5);
    expect(charts[0]).toHaveAttribute("data-type", "bar");
    expect(charts[1]).toHaveAttribute("data-type", "donut");
    expect(charts[2]).toHaveAttribute("data-type", "radialBar");
    expect(charts[3]).toHaveAttribute("data-type", "line");
    expect(charts[4]).toHaveAttribute("data-type", "donut");
  });

  it("renders section cards with correct titles", () => {
    render(<ReceivableDashboardPage />);
    const sections = screen.getAllByTestId("section-card");
    const titles = sections.map((s) => s.getAttribute("data-title"));
    expect(titles).toContain("Billing Pipeline");
    expect(titles).toContain("Receivable Aging");
    expect(titles).toContain("Collection Performance");
    expect(titles).toContain("Monthly Collection Trend");
    expect(titles).toContain("Top Outstanding Customers");
    expect(titles).toContain("Billing Status");
    expect(titles).toContain("Billing Transactions");
    expect(titles).toContain("Collection by Collector");
    expect(titles).toContain("Recent Activities");
  });

  it("renders 2 SimpleTables", () => {
    render(<ReceivableDashboardPage />);
    const tables = screen.getAllByTestId("simple-table");
    expect(tables).toHaveLength(2);
  });

  it("renders ActivityFeed", () => {
    render(<ReceivableDashboardPage />);
    expect(screen.getByTestId("activity-feed")).toBeInTheDocument();
  });

  it("renders 4 Progress bars for collectors", () => {
    render(<ReceivableDashboardPage />);
    const progressBars = screen.getAllByTestId("progress");
    expect(progressBars).toHaveLength(4);
  });

  it("renders collector percentage values via fmtPct", () => {
    render(<ReceivableDashboardPage />);
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("95%")).toBeInTheDocument();
    expect(screen.getByText("62%")).toBeInTheDocument();
    expect(screen.getByText("93%")).toBeInTheDocument();
  });

  it("renders collector formatted IDR amounts", () => {
    render(<ReceivableDashboardPage />);
    expect(screen.getByText("Rp6.4B / Rp8.0B")).toBeInTheDocument();
    expect(screen.getByText("Rp5.7B / Rp6.0B")).toBeInTheDocument();
    expect(screen.getByText("Rp3.1B / Rp5.0B")).toBeInTheDocument();
    expect(screen.getByText("Rp4.2B / Rp4.5B")).toBeInTheDocument();
  });
});
