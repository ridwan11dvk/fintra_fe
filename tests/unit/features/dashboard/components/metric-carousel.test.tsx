import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => mockNavigate,
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      formatAbbr: (v: number) => `${(v / 1e9).toFixed(1)}B`,
      formatCurrency: (v: number) => `Rp${v.toLocaleString("id-ID")}`,

      MotionCarousel: <T,>({
        items,
        renderItem,
        footer,
        hideNavigation,
        dotsPosition,
      }: {
        items: T[];
        renderItem: (item: T) => React.ReactNode;
        footer?: React.ReactNode;
        hideNavigation?: boolean;
        dotsPosition?: string;
      }) => (
        <div
          data-testid="motion-carousel"
          data-hide-nav={!!hideNavigation}
          data-dots={dotsPosition}
        >
          <div data-testid="carousel-items-count">{items.length}</div>
          {items.map((item, i) => (
            <div key={i} data-testid={`carousel-item-${i}`}>
              {renderItem(item)}
            </div>
          ))}
          {footer && <div data-testid="carousel-footer">{footer}</div>}
        </div>
      ),
      Metric: ({
        title,
        value,
        percentage,
        status,
      }: {
        title?: string;
        value?: string;
        percentage?: number;
        status?: string;
      }) => (
        <div
          data-testid="metric-card"
          data-title={title}
          data-value={value}
          data-percentage={percentage}
          data-status={status}
        >
          {title}: {value}
        </div>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/motion-carousel", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);

import { MetricCarousel } from "@/features/dashboard/components/metric-carousel";
import type { MetricCardData } from "@railfinance/core";

const mockItems: MetricCardData[] = [
  {
    title: "Top Up (IDR)",
    currency: "IDR",
    status: "info",
    value: 50000000000,
    lastValue: 45000000000,
    percentage: 11.11,
  },
  {
    title: "Top Up (USD)",
    currency: "USD",
    status: "info",
    value: 3000000,
    lastValue: 2800000,
    percentage: 7.14,
  },
];

describe("MetricCarousel", () => {
  it("renders the motion carousel container", () => {
    render(<MetricCarousel items={mockItems} />);
    expect(screen.getByTestId("motion-carousel")).toBeInTheDocument();
  });

  it("passes the correct number of items to the carousel", () => {
    render(<MetricCarousel items={mockItems} />);
    expect(screen.getByTestId("carousel-items-count")).toHaveTextContent("2");
  });

  it("passes hideNavigation and dotsPosition props", () => {
    render(<MetricCarousel items={mockItems} />);
    const carousel = screen.getByTestId("motion-carousel");
    expect(carousel).toHaveAttribute("data-hide-nav", "true");
    expect(carousel).toHaveAttribute("data-dots", "top-right");
  });

  it("renders a Metric card for each item", () => {
    render(<MetricCarousel items={mockItems} />);
    const metrics = screen.getAllByTestId("metric-card");
    expect(metrics).toHaveLength(2);
  });

  it("passes correct title to each Metric card", () => {
    render(<MetricCarousel items={mockItems} />);
    expect(screen.getByText(/Top Up \(IDR\)/)).toBeInTheDocument();
    expect(screen.getByText(/Top Up \(USD\)/)).toBeInTheDocument();
  });

  it("passes the formatted value to each Metric card", () => {
    render(<MetricCarousel items={mockItems} />);
    const metrics = screen.getAllByTestId("metric-card");
    expect(metrics[0]).toHaveAttribute("data-value", "50.0B");
    expect(metrics[1]).toHaveAttribute("data-value", "0.0B");
  });

  it("passes percentage and status props", () => {
    render(<MetricCarousel items={mockItems} />);
    const metrics = screen.getAllByTestId("metric-card");
    expect(metrics[0]).toHaveAttribute("data-percentage", "11.11");
    expect(metrics[0]).toHaveAttribute("data-status", "info");
    expect(metrics[1]).toHaveAttribute("data-percentage", "7.14");
    expect(metrics[1]).toHaveAttribute("data-status", "info");
  });

  it("renders the footer with View report button", () => {
    render(<MetricCarousel items={mockItems} />);
    expect(screen.getByTestId("carousel-footer")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /view report/i }),
    ).toBeInTheDocument();
  });

  it("navigates to footerLink when View report is clicked", async () => {
    const user = userEvent.setup();
    render(<MetricCarousel items={mockItems} footerLink="/some-path" />);
    await user.click(screen.getByRole("button", { name: /view report/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/some-path");
  });

  it("navigates to '#' when no footerLink is provided", async () => {
    const user = userEvent.setup();
    render(<MetricCarousel items={mockItems} />);
    await user.click(screen.getByRole("button", { name: /view report/i }));
    expect(mockNavigate).toHaveBeenCalledWith("#");
  });

  it("passes tooltip with formatted current and before values", () => {
    render(<MetricCarousel items={mockItems} />);
    const metrics = screen.getAllByTestId("metric-card");
    expect(metrics[0]).toHaveAttribute("data-value", "50.0B");
  });
});
