import { render, screen } from "@tests/unit/utils/render-with-providers";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockFaqs } = vi.hoisted(() => ({
  mockFaqs: [] as Array<{ id: number; question: string; answer: string }>,
}));

vi.mock("@railfinance/core/masterdata", () => ({
  useGetPublicFaqs: () => ({ data: { data: mockFaqs } }),
}));

vi.mock("@railfinance/core/components/animated-section", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-section">{children}</div>
  ),
}));

vi.mock("@railfinance/core/ui/accordion", () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="accordion">{children}</div>
  ),
  AccordionItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="accordion-item">{children}</div>
  ),
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  AccordionContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { FAQSection } from "@/features/guest/components/faq-section";

describe("FAQSection", () => {
  beforeEach(() => {
    mockFaqs.length = 0;
  });

  it("returns null when there are no FAQ items", () => {
    const { container } = render(<FAQSection />);

    expect(container.firstChild).toBeNull();
  });

  it("renders FAQ items when data is available", () => {
    mockFaqs.push(
      { id: 1, question: "What is RailFinance?", answer: "A finance platform." },
      { id: 2, question: "How to track invoice?", answer: "Use the form." },
    );

    render(<FAQSection />);

    expect(
      screen.getByRole("heading", { name: /frequently asked questions/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("What is RailFinance?")).toBeInTheDocument();
    expect(screen.getByText("A finance platform.")).toBeInTheDocument();
    expect(screen.getByText("How to track invoice?")).toBeInTheDocument();
    expect(screen.getByText("Use the form.")).toBeInTheDocument();
    expect(screen.getAllByTestId("accordion-item")).toHaveLength(2);
  });
});
