import { RequestDetailModal } from "@/features/access-request/components/request-detail-modal";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
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

vi.mock("@/features/access-request/components/reject-modal", () => ({
  RejectModal: ({
    open,
    onOpenChange,
    onSuccess,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
  }) =>
    open ? (
      <div data-testid="reject-modal">
        <button
          data-testid="reject-success"
          onClick={() => {
            onSuccess();
            onOpenChange(false);
          }}
        >
          Reject Success
        </button>
      </div>
    ) : null,
}));

vi.mock("@/features/access-request/components/approve-modal", () => ({
  ApproveModal: ({
    open,
    onOpenChange,
    onSuccess,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
  }) =>
    open ? (
      <div data-testid="approve-modal">
        <button
          data-testid="approve-success"
          onClick={() => {
            onSuccess();
            onOpenChange(false);
          }}
        >
          Approve Success
        </button>
      </div>
    ) : null,
}));

const mockPendingRequest = {
  id: 1,
  userId: 10,
  userType: "INTERNAL",
  userName: "John Doe",
  userNipp: "NIPP001",
  status: "PENDING" as const,
  moduleNames: "Finance, Procurement",
  requestNotes: "Need access for monthly reports",
  requestedAt: "2024-06-01T08:00:00Z",
  approvedAt: null,
  responseNotes: null,
  approvedBy: null,
  modules: [
    {
      moduleId: 1,
      moduleName: "Finance",
      availableRoles: [{ id: 1, name: "Finance User" }],
    },
  ],
};

const mockApprovedRequest = {
  ...mockPendingRequest,
  status: "APPROVED" as const,
  approvedAt: "2024-06-02T10:00:00Z",
  approvedBy: "Admin User",
  responseNotes: "Access granted",
};

const mockRejectedRequest = {
  ...mockPendingRequest,
  status: "REJECTED" as const,
  responseNotes: "Insufficient documentation",
};

describe("RequestDetailModal", () => {
  it("does not render when open is false", () => {
    render(
      <RequestDetailModal
        open={false}
        onOpenChange={vi.fn()}
        request={mockPendingRequest}
      />,
    );
    expect(
      screen.queryByText("Access Request Details"),
    ).not.toBeInTheDocument();
  });

  it("does not render when request is null", () => {
    render(
      <RequestDetailModal open={true} onOpenChange={vi.fn()} request={null} />,
    );
    expect(
      screen.queryByText("Access Request Details"),
    ).not.toBeInTheDocument();
  });

  it("renders request details for a pending request", () => {
    render(
      <RequestDetailModal
        open={true}
        onOpenChange={vi.fn()}
        request={mockPendingRequest}
      />,
    );
    expect(screen.getByText("Access Request Details")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("NIPP001")).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByText("Procurement")).toBeInTheDocument();
    expect(
      screen.getByText("Need access for monthly reports"),
    ).toBeInTheDocument();
  });

  it("shows Reject and Approve buttons for pending requests", () => {
    render(
      <RequestDetailModal
        open={true}
        onOpenChange={vi.fn()}
        request={mockPendingRequest}
      />,
    );
    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
  });

  it("opens reject modal when Reject button is clicked", async () => {
    const user = { click: vi.fn() };
    render(
      <RequestDetailModal
        open={true}
        onOpenChange={vi.fn()}
        request={mockPendingRequest}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Reject" }));

    await waitFor(() => {
      expect(screen.getByTestId("reject-modal")).toBeInTheDocument();
    });
  });

  it("opens approve modal when Approve button is clicked", async () => {
    render(
      <RequestDetailModal
        open={true}
        onOpenChange={vi.fn()}
        request={mockPendingRequest}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));

    await waitFor(() => {
      expect(screen.getByTestId("approve-modal")).toBeInTheDocument();
    });
  });

  it("does not show action buttons for approved requests", () => {
    render(
      <RequestDetailModal
        open={true}
        onOpenChange={vi.fn()}
        request={mockApprovedRequest}
      />,
    );
    expect(screen.queryByText("Reject")).not.toBeInTheDocument();
    expect(screen.queryByText("Approve")).not.toBeInTheDocument();
  });

  it("shows approved info for approved requests", () => {
    render(
      <RequestDetailModal
        open={true}
        onOpenChange={vi.fn()}
        request={mockApprovedRequest}
      />,
    );
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("Access granted")).toBeInTheDocument();
  });

  it("shows requestNotes section when present", () => {
    render(
      <RequestDetailModal
        open={true}
        onOpenChange={vi.fn()}
        request={mockPendingRequest}
      />,
    );
    expect(screen.getByText("Request Notes")).toBeInTheDocument();
    expect(
      screen.getByText("Need access for monthly reports"),
    ).toBeInTheDocument();
  });

  it("shows response notes for rejected requests", () => {
    render(
      <RequestDetailModal
        open={true}
        onOpenChange={vi.fn()}
        request={mockRejectedRequest}
      />,
    );
    expect(screen.getByText("Insufficient documentation")).toBeInTheDocument();
  });
});
