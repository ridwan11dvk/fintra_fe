import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@railfinance/core/components/animated-section", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-section">{children}</div>
  ),
}));

import { SupportSection } from "@/features/guest/components/support-section";

describe("SupportSection", () => {
  it("renders support heading and contact links", () => {
    render(<SupportSection />);

    expect(screen.getByText("Still have questions?")).toBeInTheDocument();
    expect(
      screen.getByText(/if you need assistance regarding invoice or payment status/i),
    ).toBeInTheDocument();

    const emailLink = screen.getByRole("link", {
      name: /support\.railfinance@kai\.id/i,
    });
    expect(emailLink).toHaveAttribute("href", "mailto:support.railfinance@kai.id");

    const phoneLink = screen.getByRole("link", { name: /\+62 8123 4567 89/i });
    expect(phoneLink).toHaveAttribute("href", "tel:+628123456789");
  });
});
