import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@railfinance/core/components/animated-section", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-section">{children}</div>
  ),
}));

vi.mock("@railfinance/core/components/image", () => ({
  Image: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

vi.mock("@railfinance/core/components/motion-carousel", () => ({
  MotionCarousel: ({
    items,
    renderItem,
  }: {
    items: unknown[];
    renderItem: (item: any) => React.ReactNode;
  }) => (
    <div data-testid="motion-carousel">
      {items.map((item, index) => (
        <div key={index} data-testid={`carousel-item-${index}`}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  ),
}));

import { PromoBanner } from "@/features/guest/components/promo-banner";

describe("PromoBanner", () => {
  it("renders carousel with image and text promo items", () => {
    render(<PromoBanner />);

    expect(screen.getByTestId("motion-carousel")).toBeInTheDocument();
    expect(screen.getByAltText("Promo Grand Opening")).toBeInTheDocument();
    expect(
      screen.getByText("Streamline Your Workflow with Role-Based Access Control"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Operate within defined roles and workflows"),
    ).toBeInTheDocument();
  });
});
