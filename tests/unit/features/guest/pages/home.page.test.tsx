import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/guest/components", () => ({
  HeroSection: () => <div data-testid="hero-section" />,
  PromoBanner: () => <div data-testid="promo-banner" />,
  InvoiceTrackingSection: () => <div data-testid="invoice-tracking-section" />,
  VendorPortalSection: () => <div data-testid="vendor-portal-section" />,
  FAQSection: () => <div data-testid="faq-section" />,
  SupportSection: () => <div data-testid="support-section" />,
}));

import { HomePage } from "@/features/guest/pages/home.page";

describe("HomePage", () => {
  it("renders all guest home sections", () => {
    render(<HomePage />);

    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("promo-banner")).toBeInTheDocument();
    expect(screen.getByTestId("invoice-tracking-section")).toBeInTheDocument();
    expect(screen.getByTestId("vendor-portal-section")).toBeInTheDocument();
    expect(screen.getByTestId("faq-section")).toBeInTheDocument();
    expect(screen.getByTestId("support-section")).toBeInTheDocument();
  });
});
