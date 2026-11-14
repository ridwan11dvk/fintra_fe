import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/dashboard/components/metric-carousel", () => ({
  default: ({ items }: { items: Array<{ title: string }> }) => (
    <div data-testid="metric-carousel-mock">
      {items.map((item, i) => (
        <div key={i} data-testid="carousel-title">
          {item.title}
        </div>
      ))}
    </div>
  ),
}));

const mockRandomValues = vi.fn();
vi.stubGlobal("crypto", {
  getRandomValues: mockRandomValues,
});

import { MetricSection } from "@/features/dashboard/components/metric-section";

describe("MetricSection", () => {
  beforeEach(() => {
    mockRandomValues.mockReset();
  });

  it("renders three MetricCarousel instances", () => {
    mockRandomValues
      .mockReturnValueOnce(new Uint32Array([50000000000]))
      .mockReturnValueOnce(new Uint32Array([45000000000]))
      .mockReturnValueOnce(new Uint32Array([11]))
      .mockReturnValueOnce(new Uint32Array([3000000]))
      .mockReturnValueOnce(new Uint32Array([2800000]))
      .mockReturnValueOnce(new Uint32Array([7]))
      .mockReturnValueOnce(new Uint32Array([100000000000]))
      .mockReturnValueOnce(new Uint32Array([90000000000]))
      .mockReturnValueOnce(new Uint32Array([10]))
      .mockReturnValueOnce(new Uint32Array([5000000]))
      .mockReturnValueOnce(new Uint32Array([4500000]))
      .mockReturnValueOnce(new Uint32Array([8]))
      .mockReturnValueOnce(new Uint32Array([20000000000]))
      .mockReturnValueOnce(new Uint32Array([25000000000]))
      .mockReturnValueOnce(new Uint32Array([-20]))
      .mockReturnValueOnce(new Uint32Array([1000000]))
      .mockReturnValueOnce(new Uint32Array([1200000]))
      .mockReturnValueOnce(new Uint32Array([-16]));

    render(<MetricSection />);

    const carousels = screen.getAllByTestId("metric-carousel-mock");
    expect(carousels).toHaveLength(3);
  });

  it("renders Top Up IDR and USD titles", () => {
    mockRandomValues
      .mockReturnValueOnce(new Uint32Array([50000000000]))
      .mockReturnValueOnce(new Uint32Array([45000000000]))
      .mockReturnValueOnce(new Uint32Array([11]))
      .mockReturnValueOnce(new Uint32Array([3000000]))
      .mockReturnValueOnce(new Uint32Array([2800000]))
      .mockReturnValueOnce(new Uint32Array([7]))
      .mockReturnValueOnce(new Uint32Array([100000000000]))
      .mockReturnValueOnce(new Uint32Array([90000000000]))
      .mockReturnValueOnce(new Uint32Array([10]))
      .mockReturnValueOnce(new Uint32Array([5000000]))
      .mockReturnValueOnce(new Uint32Array([4500000]))
      .mockReturnValueOnce(new Uint32Array([8]))
      .mockReturnValueOnce(new Uint32Array([20000000000]))
      .mockReturnValueOnce(new Uint32Array([25000000000]))
      .mockReturnValueOnce(new Uint32Array([-20]))
      .mockReturnValueOnce(new Uint32Array([1000000]))
      .mockReturnValueOnce(new Uint32Array([1200000]))
      .mockReturnValueOnce(new Uint32Array([-16]));

    render(<MetricSection />);

    const titles = screen.getAllByTestId("carousel-title");
    expect(titles[0]).toHaveTextContent("Top Up (IDR)");
    expect(titles[1]).toHaveTextContent("Top Up (USD)");
  });

  it("renders Paid Billing IDR and USD titles", () => {
    mockRandomValues
      .mockReturnValueOnce(new Uint32Array([50000000000]))
      .mockReturnValueOnce(new Uint32Array([45000000000]))
      .mockReturnValueOnce(new Uint32Array([11]))
      .mockReturnValueOnce(new Uint32Array([3000000]))
      .mockReturnValueOnce(new Uint32Array([2800000]))
      .mockReturnValueOnce(new Uint32Array([7]))
      .mockReturnValueOnce(new Uint32Array([100000000000]))
      .mockReturnValueOnce(new Uint32Array([90000000000]))
      .mockReturnValueOnce(new Uint32Array([10]))
      .mockReturnValueOnce(new Uint32Array([5000000]))
      .mockReturnValueOnce(new Uint32Array([4500000]))
      .mockReturnValueOnce(new Uint32Array([8]))
      .mockReturnValueOnce(new Uint32Array([20000000000]))
      .mockReturnValueOnce(new Uint32Array([25000000000]))
      .mockReturnValueOnce(new Uint32Array([-20]))
      .mockReturnValueOnce(new Uint32Array([1000000]))
      .mockReturnValueOnce(new Uint32Array([1200000]))
      .mockReturnValueOnce(new Uint32Array([-16]));

    render(<MetricSection />);

    const titles = screen.getAllByTestId("carousel-title");
    expect(titles[2]).toHaveTextContent("Paid Billing (IDR)");
    expect(titles[3]).toHaveTextContent("Paid Billing (USD)");
  });

  it("renders Unpaid Billing IDR and USD titles", () => {
    mockRandomValues
      .mockReturnValueOnce(new Uint32Array([50000000000]))
      .mockReturnValueOnce(new Uint32Array([45000000000]))
      .mockReturnValueOnce(new Uint32Array([11]))
      .mockReturnValueOnce(new Uint32Array([3000000]))
      .mockReturnValueOnce(new Uint32Array([2800000]))
      .mockReturnValueOnce(new Uint32Array([7]))
      .mockReturnValueOnce(new Uint32Array([100000000000]))
      .mockReturnValueOnce(new Uint32Array([90000000000]))
      .mockReturnValueOnce(new Uint32Array([10]))
      .mockReturnValueOnce(new Uint32Array([5000000]))
      .mockReturnValueOnce(new Uint32Array([4500000]))
      .mockReturnValueOnce(new Uint32Array([8]))
      .mockReturnValueOnce(new Uint32Array([20000000000]))
      .mockReturnValueOnce(new Uint32Array([25000000000]))
      .mockReturnValueOnce(new Uint32Array([-20]))
      .mockReturnValueOnce(new Uint32Array([1000000]))
      .mockReturnValueOnce(new Uint32Array([1200000]))
      .mockReturnValueOnce(new Uint32Array([-16]));

    render(<MetricSection />);

    const titles = screen.getAllByTestId("carousel-title");
    expect(titles[4]).toHaveTextContent("Unpaid Billing (IDR)");
    expect(titles[5]).toHaveTextContent("Unpaid Billing (USD)");
  });

  it("renders different statuses for each carousel", () => {
    mockRandomValues
      .mockReturnValueOnce(new Uint32Array([50000000000]))
      .mockReturnValueOnce(new Uint32Array([45000000000]))
      .mockReturnValueOnce(new Uint32Array([11]))
      .mockReturnValueOnce(new Uint32Array([3000000]))
      .mockReturnValueOnce(new Uint32Array([2800000]))
      .mockReturnValueOnce(new Uint32Array([7]))
      .mockReturnValueOnce(new Uint32Array([100000000000]))
      .mockReturnValueOnce(new Uint32Array([90000000000]))
      .mockReturnValueOnce(new Uint32Array([10]))
      .mockReturnValueOnce(new Uint32Array([5000000]))
      .mockReturnValueOnce(new Uint32Array([4500000]))
      .mockReturnValueOnce(new Uint32Array([8]))
      .mockReturnValueOnce(new Uint32Array([20000000000]))
      .mockReturnValueOnce(new Uint32Array([25000000000]))
      .mockReturnValueOnce(new Uint32Array([-20]))
      .mockReturnValueOnce(new Uint32Array([1000000]))
      .mockReturnValueOnce(new Uint32Array([1200000]))
      .mockReturnValueOnce(new Uint32Array([-16]));

    render(<MetricSection />);
    expect(screen.getAllByTestId("carousel-title")).toHaveLength(6);
  });
});
