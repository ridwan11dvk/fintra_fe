import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it } from "vitest";
import { ExchangeRateSection } from "@/features/dashboard/components/exchange-rate-section";

describe("ExchangeRateSection", () => {
  it("renders the card title", () => {
    render(<ExchangeRateSection />);
    expect(screen.getByText("Exchange Rate")).toBeInTheDocument();
  });

  it("renders all five currency pairs", () => {
    render(<ExchangeRateSection />);
    expect(screen.getByText("USD/IDR")).toBeInTheDocument();
    expect(screen.getByText("GBP/IDR")).toBeInTheDocument();
    expect(screen.getByText("SGD/IDR")).toBeInTheDocument();
    expect(screen.getByText("AUD/IDR")).toBeInTheDocument();
    expect(screen.getByText("CNY/IDR")).toBeInTheDocument();
  });

  it("renders rates for all pairs", () => {
    render(<ExchangeRateSection />);
    expect(screen.getByText("16,775.00")).toBeInTheDocument();
    expect(screen.getByText("22,525.00")).toBeInTheDocument();
    expect(screen.getByText("12,350.00")).toBeInTheDocument();
    expect(screen.getByText("11,236.50")).toBeInTheDocument();
    expect(screen.getByText("2,405.50")).toBeInTheDocument();
  });

  it("renders change percentages", () => {
    render(<ExchangeRateSection />);
    const changes = screen.getAllByText("+0.12%");
    expect(changes).toHaveLength(5);
  });

  it("renders absolute change values", () => {
    render(<ExchangeRateSection />);
    const absolutes = screen.getAllByText("+26.50");
    expect(absolutes).toHaveLength(5);
  });

  it("shows green text for positive changes", () => {
    render(<ExchangeRateSection />);
    const greenTexts = screen.getAllByText("+0.12%");
    greenTexts.forEach((el) => {
      expect(el.className).toContain("green");
    });
  });
});
