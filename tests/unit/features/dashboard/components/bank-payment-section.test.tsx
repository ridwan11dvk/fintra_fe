import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-apexcharts", () => ({
  default: ({
    options,
    series,
    type,
    width,
    height,
  }: {
    options?: unknown;
    series?: unknown;
    type?: string;
    width?: number;
    height?: number;
  }) => (
    <div data-testid="apex-chart" data-type={type} data-width={width} data-height={height}>
      <span data-testid="chart-series-count">{Array.isArray(series) ? series.length : 0}</span>
    </div>
  ),
}));

import { BankPaymentSection } from "@/features/dashboard/components/bank-payment-section";

describe("BankPaymentSection", () => {
  it("renders the card title", () => {
    render(<BankPaymentSection />);
    expect(screen.getByText("Payments by Bank")).toBeInTheDocument();
  });

  it("renders the card description", () => {
    render(<BankPaymentSection />);
    expect(screen.getByText(/Januari 2026/)).toBeInTheDocument();
  });

  it("renders the donut chart via react-apexcharts", () => {
    render(<BankPaymentSection />);
    const chart = screen.getByTestId("apex-chart");
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute("data-type", "donut");
  });

  it("renders all 8 bank entries in the list", () => {
    render(<BankPaymentSection />);
    expect(screen.getByText("BNI")).toBeInTheDocument();
    expect(screen.getByText("BCA")).toBeInTheDocument();
    expect(screen.getByText("BRI")).toBeInTheDocument();
    expect(screen.getByText("BMRI")).toBeInTheDocument();
    expect(screen.getByText("BSI")).toBeInTheDocument();
    expect(screen.getByText("FIN")).toBeInTheDocument();
    expect(screen.getByText("BJTG")).toBeInTheDocument();
    expect(screen.getByText("BSB")).toBeInTheDocument();
  });

  it("renders formatted balances for each bank", () => {
    render(<BankPaymentSection />);
    expect(screen.getByText(/85\.103\.507\.835/)).toBeInTheDocument();
    expect(screen.getByText(/84\.765\.646\.326/)).toBeInTheDocument();
  });

  it("renders the Filter icon button", () => {
    render(<BankPaymentSection />);
    const buttons = screen.getAllByRole("button");
    const filterBtn = buttons.find((btn) =>
      btn.querySelector("svg.lucide-funnel"),
    );
    expect(filterBtn).toBeInTheDocument();
  });

  it("renders the View full report button", () => {
    render(<BankPaymentSection />);
    expect(screen.getByRole("button", { name: /view full report/i })).toBeInTheDocument();
  });
});
