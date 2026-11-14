import { RejectModal } from "@/features/access-request/components/reject-modal";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/unit/mocks/server";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  return {
    ...actual,
    useAuth: () => ({
      can: () => true,
      hasResource: () => true,
      permissions: [],
      roles: [],
      user: {},
      token: null,
      isSuperAdmin: false,
      isAuthenticated: true,
      isLoading: false,
      isRefreshing: false,
      error: null,
      logout: vi.fn(),
      scheduleTokenRefresh: vi.fn(),
    }),
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

const mockRequest = {
  id: 1,
  userId: 10,
  userType: "INTERNAL",
  userName: "John Doe",
  userNipp: "NIPP001",
  status: "PENDING" as const,
  moduleNames: "Finance",
  requestNotes: "Need access",
  requestedAt: "2024-06-01T08:00:00Z",
  approvedAt: null,
  responseNotes: null,
  approvedBy: null,
};

const BASE = "http://localhost:3000";

describe("RejectModal", () => {
  it("does not render when open is false", () => {
    render(
      <RejectModal
        open={false}
        onOpenChange={vi.fn()}
        request={mockRequest}
        onSuccess={vi.fn()}
      />,
    );
    expect(screen.queryByText("Reject Access Request")).not.toBeInTheDocument();
  });

  it("renders the modal title when open", () => {
    render(
      <RejectModal
        open={true}
        onOpenChange={vi.fn()}
        request={mockRequest}
        onSuccess={vi.fn()}
      />,
    );
    expect(screen.getByText("Reject Access Request")).toBeInTheDocument();
  });

  it("renders rejection reason textarea and submit button", () => {
    render(
      <RejectModal
        open={true}
        onOpenChange={vi.fn()}
        request={mockRequest}
        onSuccess={vi.fn()}
      />,
    );
    expect(
      screen.getByPlaceholderText(
        "Enter reason for rejecting this access request...",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    const user = userEvent.setup();
    render(
      <RejectModal
        open={true}
        onOpenChange={vi.fn()}
        request={mockRequest}
        onSuccess={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Reject" }));

    await waitFor(() => {
      expect(
        screen.getByText("Rejection reason is required"),
      ).toBeInTheDocument();
    });
  });

  it("calls onOpenChange(false) after successful rejection", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <RejectModal
        open={true}
        onOpenChange={onOpenChange}
        request={mockRequest}
        onSuccess={vi.fn()}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(
        "Enter reason for rejecting this access request...",
      ),
      "Insufficient documentation",
    );

    await user.click(screen.getByRole("button", { name: "Reject" }));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("calls onSuccess after successful rejection", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(
      <RejectModal
        open={true}
        onOpenChange={vi.fn()}
        request={mockRequest}
        onSuccess={onSuccess}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(
        "Enter reason for rejecting this access request...",
      ),
      "Insufficient documentation",
    );

    await user.click(screen.getByRole("button", { name: "Reject" }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("does not close modal when server returns error", async () => {
    server.use(
      http.put(`${BASE}/access-request/:id`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <RejectModal
        open={true}
        onOpenChange={onOpenChange}
        request={mockRequest}
        onSuccess={vi.fn()}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(
        "Enter reason for rejecting this access request...",
      ),
      "Insufficient documentation",
    );

    await user.click(screen.getByRole("button", { name: "Reject" }));

    await waitFor(() => {
      expect(onOpenChange).not.toHaveBeenCalledWith(false);
    });
  });
});
