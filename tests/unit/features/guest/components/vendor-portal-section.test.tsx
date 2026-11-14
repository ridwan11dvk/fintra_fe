import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@railfinance/core/components/animated-section", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-section">{children}</div>
  ),
}));

import { VendorPortalSection } from "@/features/guest/components/vendor-portal-section";

describe("VendorPortalSection", () => {
  it("renders vendor portal copy and sign in button", () => {
    render(<VendorPortalSection />);

    expect(
      screen.getByRole("heading", { name: /access your vendor portal/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/manage receivable and payable transactions securely/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});
