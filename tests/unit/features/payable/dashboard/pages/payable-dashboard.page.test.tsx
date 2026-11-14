import { dashboardUiMocks } from "@tests/unit/mocks/dashboard-components-mock";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/payable", () => ({
  PAYABLE_DASHBOARD_PAGE_TITLE: "Payable Dashboard",
  PAYABLE_DASHBOARD_BASE: "dashboard",
  PAYABLE_DASHBOARD_URL: "/payable/dashboard",
}));

import { PayableDashboardPage } from "@/features/payable/dashboard/pages/payable-dashboard.page";

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

      Button: ({
        children,
        className,
        variant,
      }: {
        children?: React.ReactNode;
        className?: string;
        variant?: string;
      }) => (
        <button
          data-testid="button"
          data-variant={variant}
          data-classname={className}
        >
          {children}
        </button>
      ),
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
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/progress", __railfinanceCoreMock);

describe("PayableDashboardPage", () => {
  it("renders within Page with type='payable'", () => {
    render(<PayableDashboardPage />);
    const layout = screen.getByTestId("page");
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveAttribute("data-type", "payable");
  });

  it("passes page title to MainLayout", () => {
    render(<PayableDashboardPage />);
    const layout = screen.getByTestId("page");
    expect(layout).toHaveAttribute("data-title", "Payable Dashboard");
  });

  it("renders PageHeader with correct title", () => {
    render(<PayableDashboardPage />);
    const header = screen.getByTestId("page-header");
    expect(header).toHaveAttribute("data-title", "Payable Dashboard");
  });

  it("renders 6 KpiCards with correct labels", () => {
    render(<PayableDashboardPage />);
    const cards = screen.getAllByTestId("kpi-card");
    expect(cards).toHaveLength(6);
    expect(cards[0]).toHaveAttribute("data-label", "Outstanding Payables");
    expect(cards[1]).toHaveAttribute("data-label", "Due Today");
    expect(cards[2]).toHaveAttribute("data-label", "Overdue Amount");
    expect(cards[3]).toHaveAttribute("data-label", "Cash Advance Out.");
    expect(cards[4]).toHaveAttribute("data-label", "Reimbursement Pending");
    expect(cards[5]).toHaveAttribute("data-label", "Avg. Payment Cycle");
  });

  it("renders KpiCard with formatted IDR values", () => {
    render(<PayableDashboardPage />);
    expect(screen.getByText("Rp98.2B")).toBeInTheDocument();
    expect(screen.getByText("Rp4.8B")).toBeInTheDocument();
    expect(screen.getByText("Rp2.1B")).toBeInTheDocument();
    expect(screen.getByText("Rp1.4B")).toBeInTheDocument();
    expect(screen.getByText("Rp0.2B")).toBeInTheDocument();
  });

  it("renders KpiCard with '18 days' for avg payment cycle", () => {
    render(<PayableDashboardPage />);
    expect(screen.getByText("18 days")).toBeInTheDocument();
  });

  it("renders 5 Chart components with correct types", () => {
    render(<PayableDashboardPage />);
    const charts = screen.getAllByTestId("chart");
    expect(charts).toHaveLength(5);
    expect(charts[0]).toHaveAttribute("data-type", "area");
    expect(charts[1]).toHaveAttribute("data-type", "donut");
    expect(charts[2]).toHaveAttribute("data-type", "donut");
    expect(charts[3]).toHaveAttribute("data-type", "bar");
    expect(charts[4]).toHaveAttribute("data-type", "line");
  });

  it("renders section cards with correct titles", () => {
    render(<PayableDashboardPage />);
    const sections = screen.getAllByTestId("section-card");
    const titles = sections.map((s) => s.getAttribute("data-title"));
    expect(titles).toContain("Outstanding Payables Trend");
    expect(titles).toContain("Payable Composition");
    expect(titles).toContain("Cash Advance Monitoring");
    expect(titles).toContain("Workflow Status");
    expect(titles).toContain("Top 10 Due Payments");
    expect(titles).toContain("Pending by Approver");
    expect(titles).toContain("Approval Bottleneck Trend");
    expect(titles).toContain("Recent Activity");
    expect(titles).toContain("Alerts & Exceptions");
    expect(titles).toContain("Quick Actions");
  });

  it("renders 2 SimpleTables", () => {
    render(<PayableDashboardPage />);
    const tables = screen.getAllByTestId("simple-table");
    expect(tables).toHaveLength(2);
  });

  it("renders ActivityFeed", () => {
    render(<PayableDashboardPage />);
    expect(screen.getByTestId("activity-feed")).toBeInTheDocument();
  });

  it("renders AlertBanner", () => {
    render(<PayableDashboardPage />);
    expect(screen.getByTestId("alert-banner")).toBeInTheDocument();
  });

  it("renders 4 Quick Action buttons", () => {
    render(<PayableDashboardPage />);
    const buttons = screen.getAllByTestId("button");
    expect(buttons.length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText("New Payable")).toBeInTheDocument();
    expect(screen.getByText("Reimbursement")).toBeInTheDocument();
    expect(screen.getByText("Cash Advance")).toBeInTheDocument();
    expect(screen.getByText("Bulk Payment")).toBeInTheDocument();
  });

  it("renders Progress bar with value 68", () => {
    render(<PayableDashboardPage />);
    const progress = screen.getByTestId("progress");
    expect(progress).toHaveAttribute("data-value", "68");
  });

  it("renders monthly budget percentage text", () => {
    render(<PayableDashboardPage />);
    expect(screen.getByText("68%")).toBeInTheDocument();
  });
});
