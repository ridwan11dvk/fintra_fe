import { dashboardUiMocks } from "@tests/unit/mocks/dashboard-components-mock";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/monitoring", () => ({
  MONITORING_DASHBOARD_PAGE_TITLE: "Monitoring Dashboard",
  MONITORING_DASHBOARD_BASE: "dashboard",
  MONITORING_DASHBOARD_URL: "/monitoring/dashboard",
}));

import { MonitoringDashboardPage } from "@/features/monitoring/dashboard/pages/monitoring-dashboard.page";

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
      Card: ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="card">{children}</div>
      ),
      CardContent: ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="card-content">{children}</div>
      ),

      Progress: ({ value }: { value?: number }) => (
        <div data-testid="progress" data-value={value} />
      ),
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

describe("MonitoringDashboardPage", () => {
  it("renders within Page with type='monitoring'", () => {
    render(<MonitoringDashboardPage />);
    const layout = screen.getByTestId("page");
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveAttribute("data-type", "monitoring");
  });

  it("passes page title to MainLayout", () => {
    render(<MonitoringDashboardPage />);
    const layout = screen.getByTestId("page");
    expect(layout).toHaveAttribute("data-title", "Monitoring Dashboard");
  });

  it("renders PageHeader with correct title", () => {
    render(<MonitoringDashboardPage />);
    const header = screen.getByTestId("page-header");
    expect(header).toHaveAttribute("data-title", "Monitoring Dashboard");
  });

  it("renders AlertBanner", () => {
    render(<MonitoringDashboardPage />);
    expect(screen.getByTestId("alert-banner")).toBeInTheDocument();
  });

  it("renders 6 KpiCards with correct labels", () => {
    render(<MonitoringDashboardPage />);
    const cards = screen.getAllByTestId("kpi-card");
    expect(cards).toHaveLength(6);
    expect(cards[0]).toHaveAttribute("data-label", "Pending Invoice Post");
    expect(cards[1]).toHaveAttribute("data-label", "Failed Invoice Post");
    expect(cards[2]).toHaveAttribute("data-label", "Pending Payment Post");
    expect(cards[3]).toHaveAttribute("data-label", "Failed Payment Post");
    expect(cards[4]).toHaveAttribute("data-label", "Success Rate");
    expect(cards[5]).toHaveAttribute("data-label", "SLA Compliance");
  });

  it("renders KpiCard with value 142 for Pending Invoice Post", () => {
    render(<MonitoringDashboardPage />);
    expect(screen.getByText("142")).toBeInTheDocument();
  });

  it("renders 3 donut charts in first row of SectionCards", () => {
    render(<MonitoringDashboardPage />);
    const charts = screen.getAllByTestId("chart");
    expect(charts.length).toBeGreaterThanOrEqual(3);
    expect(charts[0]).toHaveAttribute("data-type", "donut");
    expect(charts[1]).toHaveAttribute("data-type", "donut");
    expect(charts[2]).toHaveAttribute("data-type", "donut");
  });

  it("renders a line chart for posting trend", () => {
    render(<MonitoringDashboardPage />);
    const charts = screen.getAllByTestId("chart");
    const lineChart = charts.find(
      (c) => c.getAttribute("data-type") === "line",
    );
    expect(lineChart).toBeInTheDocument();
  });

  it("renders section cards with correct titles", () => {
    render(<MonitoringDashboardPage />);
    const sections = screen.getAllByTestId("section-card");
    const titles = sections.map((s) => s.getAttribute("data-title"));
    expect(titles).toContain("Invoice Posting Monitoring");
    expect(titles).toContain("Incoming Payment Posting Monitoring");
    expect(titles).toContain("Processing Distribution");
    expect(titles).toContain("Posting Trend");
    expect(titles).toContain("Error Analysis");
    expect(titles).toContain("Real-Time Activity Feed");
    expect(titles).toContain("SLA Monitoring");
    expect(titles).toContain("System Health");
  });

  it("renders SimpleTable for error analysis", () => {
    render(<MonitoringDashboardPage />);
    const tables = screen.getAllByTestId("simple-table");
    expect(tables.length).toBeGreaterThanOrEqual(2);
  });

  it("renders ActivityFeed", () => {
    render(<MonitoringDashboardPage />);
    expect(screen.getByTestId("activity-feed")).toBeInTheDocument();
  });

  it("renders System Health section with 4 Progress bars", () => {
    render(<MonitoringDashboardPage />);
    const progressBars = screen.getAllByTestId("progress");
    expect(progressBars).toHaveLength(4);
    expect(progressBars[0]).toHaveAttribute("data-value", "99");
    expect(progressBars[1]).toHaveAttribute("data-value", "96");
    expect(progressBars[2]).toHaveAttribute("data-value", "92");
    expect(progressBars[3]).toHaveAttribute("data-value", "98");
  });

  it("renders 4 summary cards at the bottom", () => {
    render(<MonitoringDashboardPage />);
    const cards = screen.getAllByTestId("card");
    expect(cards.length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText("1,248")).toBeInTheDocument();
    expect(screen.getByText("682")).toBeInTheDocument();
    expect(screen.getByText("184")).toBeInTheDocument();
    expect(screen.getByText("92")).toBeInTheDocument();
  });
});
