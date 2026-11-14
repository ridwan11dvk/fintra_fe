import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/guest/components", () => ({
  HeroSection: () => <div data-testid="hero-section" />,
  ModuleSelector: () => <div data-testid="module-selector" />,
}));

import { SelectModulePage } from "@/features/guest/pages/select-module.page";

describe("SelectModulePage", () => {
  it("renders hero and module selector", () => {
    render(<SelectModulePage />);

    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("module-selector")).toBeInTheDocument();
  });
});
