import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  const { buildUiResponseMock } =
    await import("@tests/unit/mocks/ui-response-mock");
  return buildUiResponseMock(actual);
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => mockNavigate,
}));

import { NotificationContent } from "@/features/notification/components/notification-content";

describe("NotificationContent", () => {
  it("renders loading state initially", () => {
    const { container } = render(<NotificationContent />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders notifications list when data loads", async () => {
    render(<NotificationContent />);

    const notificationItems = await screen.findAllByRole("button");
    expect(notificationItems.length).toBeGreaterThan(0);
  });

  it("renders notification title and message", async () => {
    render(<NotificationContent />);

    const titles = await screen.findAllByText("Test Notification");
    expect(titles.length).toBeGreaterThan(0);
    const messages = await screen.findAllByText(
      "This is a test notification message",
    );
    expect(messages.length).toBeGreaterThan(0);
  });

  it("shows unread indicator for unread notifications", async () => {
    render(<NotificationContent />);

    await screen.findAllByRole("button");
    const unreadDots = document.querySelectorAll(".rounded-full.bg-blue-600");
    expect(unreadDots.length).toBeGreaterThan(0);
  });

  it("clicking a notification calls navigate", async () => {
    const user = userEvent.setup({ delay: null });
    render(<NotificationContent />);

    const notificationItems = await screen.findAllByRole("button");
    const notificationBtns = notificationItems.filter((b) =>
      b.className.includes("cursor-pointer hover:bg-slate-100"),
    );
    expect(notificationBtns.length).toBeGreaterThan(0);
    await user.click(notificationBtns[0]);

    expect(mockNavigate).toHaveBeenCalledWith("https://example.com");
  });
});
