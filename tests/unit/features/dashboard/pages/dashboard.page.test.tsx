import { dashboardUiMocks } from "@tests/unit/mocks/dashboard-components-mock";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      ...dashboardUiMocks,
      Page: ({
        children,
        title,
      }: {
        children: React.ReactNode;
        title?: string;
      }) => (
        <div data-testid="page" data-title={title}>
          {children}
        </div>
      ),
      fmtIDR: (n: number) => `Rp${n.toLocaleString("id-ID")}`,
      fmtCompact: (n: number) => {
        if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
        return `${(n / 1_000_000).toFixed(1)}M`;
      },
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/activity-feed", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/event-calendar", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/motion-carousel", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/scroll-area", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

vi.mock("@/features/dashboard", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/dashboard")>();
  return {
    ...actual,
    CalendarSection: () => <div data-testid="calendar-section" />,
  };
});

import { DashboardPage } from "@/features/dashboard/pages/dashboard.page";

describe("DashboardPage", () => {
  it("renders the page with correct title", () => {
    render(<DashboardPage />);
    const layout = screen.getByTestId("page");
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveAttribute("data-title", "Dashboard");
  });

  it("renders the PageHeader with control tower title", () => {
    render(<DashboardPage />);
    const header = screen.getByTestId("page-header");
    expect(header).toHaveAttribute(
      "data-title",
      "Finance Operations Control Tower",
    );
    expect(header).toHaveAttribute(
      "data-description",
      "Real-time view of payable, receivable, treasury and tax positions.",
    );
    expect(header).toHaveAttribute("data-back-button", "false");
  });

  it("renders four KPI cards", () => {
    render(<DashboardPage />);
    const kpis = screen.getAllByTestId("kpi-card");
    expect(kpis).toHaveLength(4);
  });

  it("renders Cash Position KPI card", () => {
    render(<DashboardPage />);
    const kpis = screen.getAllByTestId("kpi-card");
    expect(kpis[0]).toHaveAttribute("data-label", "Cash Position");
    expect(kpis[0]).toHaveAttribute("data-tone", "primary");
  });

  it("renders Total Payable KPI card with negative delta", () => {
    render(<DashboardPage />);
    const kpis = screen.getAllByTestId("kpi-card");
    expect(kpis[1]).toHaveAttribute("data-label", "Total Payable");
    expect(kpis[1]).toHaveAttribute("data-delta", "-2.1");
    expect(kpis[1]).toHaveAttribute("data-tone", "warning");
  });

  it("renders Total Receivable KPI card", () => {
    render(<DashboardPage />);
    const kpis = screen.getAllByTestId("kpi-card");
    expect(kpis[2]).toHaveAttribute("data-label", "Total Receivable");
    expect(kpis[2]).toHaveAttribute("data-tone", "accent");
  });

  it("renders Tax Liability KPI card", () => {
    render(<DashboardPage />);
    const kpis = screen.getAllByTestId("kpi-card");
    expect(kpis[3]).toHaveAttribute("data-label", "Tax Liability");
    expect(kpis[3]).toHaveAttribute("data-tone", "destructive");
  });

  it("renders the Cash Flow chart section", () => {
    render(<DashboardPage />);
    const chart = screen.getByTestId("chart");
    expect(chart).toHaveAttribute("data-type", "area");
    expect(chart).toHaveAttribute("data-height", "300");
    expect(chart).toHaveAttribute("data-series-count", "2");
  });

  it("renders the CalendarSection", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("calendar-section")).toBeInTheDocument();
  });

  it("renders the Recent Activity section", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("activity-feed")).toBeInTheDocument();
  });

  it("renders the Recent Activity section with 5 items", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("activity-feed")).toHaveAttribute(
      "data-items",
      "5",
    );
  });

  it("renders the Critical Alerts section", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("alert-banner")).toBeInTheDocument();
  });

  it("renders the Critical Alerts section with 3 items", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("alert-banner")).toHaveAttribute(
      "data-items",
      "3",
    );
  });

  it("renders the Top Pending Approvals table", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("simple-table")).toBeInTheDocument();
  });

  it("renders four SectionCards", () => {
    render(<DashboardPage />);
    const sectionCards = screen.getAllByTestId("section-card");
    expect(sectionCards).toHaveLength(4);
  });

  it("renders the Cash Flow section card", () => {
    render(<DashboardPage />);
    const sectionCards = screen.getAllByTestId("section-card");
    expect(sectionCards[0]).toHaveAttribute(
      "data-title",
      "Cash Flow (12 months)",
    );
  });

  it("renders the Recent Activity section card", () => {
    render(<DashboardPage />);
    const sectionCards = screen.getAllByTestId("section-card");
    expect(sectionCards[1]).toHaveAttribute("data-title", "Recent Activity");
  });

  it("renders the Critical Alerts section card", () => {
    render(<DashboardPage />);
    const sectionCards = screen.getAllByTestId("section-card");
    expect(sectionCards[2]).toHaveAttribute("data-title", "Critical Alerts");
  });

  it("renders the Top Pending Approvals section card", () => {
    render(<DashboardPage />);
    const sectionCards = screen.getAllByTestId("section-card");
    expect(sectionCards[3]).toHaveAttribute(
      "data-title",
      "Top Pending Approvals",
    );
  });
});
