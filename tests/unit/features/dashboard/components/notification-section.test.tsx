import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/notification/components/notification-content", () => ({
  NotificationContent: ({ asChildren }: { asChildren?: boolean }) => (
    <div data-testid="notification-content" data-as-children={asChildren ? "true" : "false"}>
      Mock Notifications
    </div>
  ),
}));

import { NotificationSection } from "@/features/dashboard/components/notification-section";

describe("NotificationSection", () => {
  it("renders the card title", () => {
    render(<NotificationSection />);
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("renders the NotificationContent component", () => {
    render(<NotificationSection />);
    expect(screen.getByTestId("notification-content")).toBeInTheDocument();
  });

  it("passes asChildren prop to NotificationContent", () => {
    render(<NotificationSection />);
    expect(screen.getByTestId("notification-content")).toHaveAttribute("data-as-children", "true");
  });
});
