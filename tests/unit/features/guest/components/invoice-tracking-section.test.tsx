import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@railfinance/core/components/animated-section", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-section">{children}</div>
  ),
}));

vi.mock("@railfinance/core/components/errors", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/features/guest/components/invoice-tracker", () => ({
  InvoiceTracker: ({ orientation }: { orientation: string }) => (
    <div data-testid={`invoice-tracker-${orientation}`} />
  ),
}));

import { InvoiceTrackingSection } from "@/features/guest/components/invoice-tracking-section";

describe("InvoiceTrackingSection", () => {
  it("renders tracking form, status details, and invoice trackers", () => {
    render(<InvoiceTrackingSection />);

    expect(
      screen.getByRole("heading", { name: /track your invoice status/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/check the progress of invoice submitted to kai/i),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/nik\/npwp/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/invoice number \/ brp number/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /check status/i })).toBeInTheDocument();

    expect(screen.getByText("PT. ABC Logistik")).toBeInTheDocument();
    expect(screen.getByText("02 March 2026")).toBeInTheDocument();
    expect(screen.getByText("12 March 2026")).toBeInTheDocument();

    expect(screen.getByTestId("invoice-tracker-horizontal")).toBeInTheDocument();
    expect(screen.getByTestId("invoice-tracker-vertical")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /view full details/i }),
    ).toBeInTheDocument();
  });
});
