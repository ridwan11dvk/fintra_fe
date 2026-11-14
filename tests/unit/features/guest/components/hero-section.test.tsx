import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@railfinance/core/components/animated-section", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-section">{children}</div>
  ),
}));

vi.mock("@railfinance/core/hooks", () => ({
  useScrollParallax: () => ({
    ref: { current: null },
    style: {},
  }),
}));

vi.mock("@railfinance/core/components/image", () => ({
  Image: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

import { HeroSection } from "@/features/guest/components/hero-section";

describe("HeroSection", () => {
  it("renders hero heading, description, and CTA", () => {
    render(<HeroSection />);

    expect(
      screen.getByRole("heading", { name: /financial transparency for kai partners/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/track invoice progress and monitor payment status/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /track invoice/i }),
    ).toBeInTheDocument();
  });
});
