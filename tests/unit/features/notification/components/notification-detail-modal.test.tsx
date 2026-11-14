import { render, screen } from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NotificationDetailModal } from "@/features/notification/components/notification-detail-modal";
import type { NotificationResponse } from "@/features/notification";

const mockNotification: NotificationResponse = {
  id: 1,
  categoryId: 1,
  categoryName: "System Alert",
  title: "Test Notification",
  message: "This is a test message",
  status: "SENT",
  channel: "IN_APP",
  userId: 1,
  userType: "INTERNAL",
  recipientEmail: null,
  recipientPhone: null,
  scheduledAt: null,
  sentAt: "2024-01-01T12:00:00Z",
  metadata: {
    url: "https://example.com",
    links: [{ key: "docs", value: "https://example.com/docs" }],
    actions: [{ key: "view", label: "View Details", icon: "eye", url: "https://example.com" }],
    variables: { key1: "value1", count: 42, active: true },
  },
  retryCount: 0,
  maxRetries: 3,
  nextRetryAt: null,
  errorMessage: null,
  isRead: false,
  readAt: null,
  createdAt: "2024-01-01T12:00:00Z",
  updatedAt: "2024-01-01T12:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const mockReadNotification: NotificationResponse = {
  ...mockNotification,
  id: 2,
  isRead: true,
  readAt: "2024-01-02T12:00:00Z",
  recipientEmail: "user@example.com",
  recipientPhone: "+62812345678",
  scheduledAt: "2024-01-03T12:00:00Z",
  nextRetryAt: "2024-01-04T12:00:00Z",
  errorMessage: "Something went wrong",
  updatedBy: "moderator",
};

describe("NotificationDetailModal", () => {
  describe("when notification is null", () => {
    it("does not render notification content when notification is null", () => {
      render(
        <NotificationDetailModal
          notification={null}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(
        screen.queryByText("Notification Content"),
      ).not.toBeInTheDocument();
    });
  });

  describe("when notification is provided", () => {
    it("renders modal title 'Notification Detail'", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByText("Notification Detail")).toBeInTheDocument();
    });

    it("renders notification category name", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByText("System Alert")).toBeInTheDocument();
    });

    it("renders notification title", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByText("Test Notification")).toBeInTheDocument();
    });

    it("renders notification message", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(
        screen.getByText("This is a test message"),
      ).toBeInTheDocument();
    });

    it("renders channel badge", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByText("IN_APP")).toBeInTheDocument();
    });

    it("renders status badge", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByText("SENT")).toBeInTheDocument();
    });

    it("renders retry count", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByText("0 / 3")).toBeInTheDocument();
    });

    it('renders "Mark as Read" button when notification is unread and onMarkAsRead is provided', () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
          onMarkAsRead={vi.fn()}
        />,
      );
      expect(
        screen.getByRole("button", { name: /mark as read/i }),
      ).toBeInTheDocument();
    });

    it("does not render Mark as Read button when notification is read", () => {
      render(
        <NotificationDetailModal
          notification={mockReadNotification}
          isOpen={true}
          onClose={vi.fn()}
          onMarkAsRead={vi.fn()}
        />,
      );
      expect(
        screen.queryByRole("button", { name: /mark as read/i }),
      ).not.toBeInTheDocument();
    });

    it("does not render Mark as Read button when onMarkAsRead is not provided", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(
        screen.queryByRole("button", { name: /mark as read/i }),
      ).not.toBeInTheDocument();
    });

    it("renders Delete button when onDelete is provided", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
          onDelete={vi.fn()}
        />,
      );
      expect(
        screen.getByRole("button", { name: /delete/i }),
      ).toBeInTheDocument();
    });

    it("does not render Delete button when onDelete is not provided", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(
        screen.queryByRole("button", { name: /delete/i }),
      ).not.toBeInTheDocument();
    });

    it("renders Close button", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      const closeButtons = screen.getAllByRole("button", { name: /close/i });
      expect(closeButtons.length).toBeGreaterThanOrEqual(1);
    });

    it("calls onMarkAsRead when Mark as Read is clicked", async () => {
      const user = userEvent.setup({ delay: null });
      const onMarkAsRead = vi.fn();

      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
          onMarkAsRead={onMarkAsRead}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: /mark as read/i }),
      );
      expect(onMarkAsRead).toHaveBeenCalledWith(1);
    });

    it("calls onDelete when Delete is clicked", async () => {
      const user = userEvent.setup({ delay: null });
      const onDelete = vi.fn();

      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
          onDelete={onDelete}
        />,
      );

      await user.click(screen.getByRole("button", { name: /delete/i }));
      expect(onDelete).toHaveBeenCalledWith(1);
    });

    it("calls onClose when Close (footer) button is clicked", async () => {
      const user = userEvent.setup({ delay: null });
      const onClose = vi.fn();

      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={onClose}
        />,
      );

      const closeTexts = screen.getAllByText("Close");
      const closeBtn = closeTexts[closeTexts.length - 1].closest("button");
      expect(closeBtn).toBeInTheDocument();
      await user.click(closeBtn!);
      expect(onClose).toHaveBeenCalled();
    });

    it("renders metadata links section when metadata has links", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByText("Links")).toBeInTheDocument();
    });

    it("renders metadata actions section when metadata has actions", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    it("renders metadata variables section when metadata has variables", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByText("Variables")).toBeInTheDocument();
    });
  });

  describe("with read notification (extra fields)", () => {
    it("renders recipient email when present", () => {
      render(
        <NotificationDetailModal
          notification={mockReadNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(
        screen.getByText("user@example.com"),
      ).toBeInTheDocument();
    });

    it("renders recipient phone when present", () => {
      render(
        <NotificationDetailModal
          notification={mockReadNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(
        screen.getByText("+62812345678"),
      ).toBeInTheDocument();
    });

    it("renders read status as Read", () => {
      render(
        <NotificationDetailModal
          notification={mockReadNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByText("Read")).toBeInTheDocument();
    });

    it("renders error message when present", () => {
      render(
        <NotificationDetailModal
          notification={mockReadNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(
        screen.getByText("Something went wrong"),
      ).toBeInTheDocument();
    });

    it("renders updatedBy when present", () => {
      render(
        <NotificationDetailModal
          notification={mockReadNotification}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByText("moderator")).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("renders a loader when isLoading is true", () => {
      render(
        <NotificationDetailModal
          notification={mockNotification}
          isOpen={true}
          onClose={vi.fn()}
          isLoading={true}
        />,
      );
      const svgs = document.querySelectorAll(".animate-spin");
      expect(svgs.length).toBeGreaterThan(0);
    });
  });
});
