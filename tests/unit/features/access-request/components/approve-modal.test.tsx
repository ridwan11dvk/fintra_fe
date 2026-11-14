import { ApproveModal } from "@/features/access-request/components/approve-modal";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/unit/mocks/server";
import {
  fireEvent,
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

vi.mock("@/features/settings/role/data/role.query", () => ({
  useFilteredRoles: vi.fn(() => ({
    data: {
      data: [
        { id: 1, name: "Finance User", description: "Finance User" },
        { id: 2, name: "Finance Manager", description: "Finance Manager" },
      ],
    },
    isLoading: false,
  })),
}));

const mockRequest = {
  id: 1,
  userId: 10,
  userType: "INTERNAL",
  userName: "John Doe",
  userNipp: "NIPP001",
  status: "PENDING" as const,
  moduleNames: "Finance",
  roleNames: "",
  roles: [],
  requestNotes: "Need access",
  requestedAt: "2024-06-01T08:00:00Z",
  approvedAt: null,
  responseNotes: null,
  approvedBy: null,
};

const BASE = "http://localhost:3000";

const selectFinanceUserRole = async () => {
  const combobox = screen.getByPlaceholderText("Select roles...");
  const user = userEvent.setup();
  await user.click(combobox);
  await screen.findAllByRole("option");
  await user.keyboard("{ArrowDown}");
  await user.keyboard("{Enter}");
  combobox.addEventListener("keydown", (e) => e.stopPropagation(), {
    once: true,
  });
  fireEvent.keyDown(combobox, { key: "Escape" });
};

describe("ApproveModal", () => {
  it("does not render when open is false", () => {
    render(
      <ApproveModal
        open={false}
        onOpenChange={vi.fn()}
        request={mockRequest}
      />,
    );
    expect(
      screen.queryByText("Approve Access Request"),
    ).not.toBeInTheDocument();
  });

  it("renders the modal title when open", () => {
    render(
      <ApproveModal open={true} onOpenChange={vi.fn()} request={mockRequest} />,
    );
    expect(screen.getByText("Approve Access Request")).toBeInTheDocument();
  });

  it("renders roles select and notes textarea", () => {
    render(
      <ApproveModal open={true} onOpenChange={vi.fn()} request={mockRequest} />,
    );
    expect(screen.getByPlaceholderText("Select roles...")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Enter notes for approving this access request (optional)...",
      ),
    ).toBeInTheDocument();
  });

  it("shows validation error when submitting without selecting roles", async () => {
    const user = userEvent.setup();
    render(
      <ApproveModal open={true} onOpenChange={vi.fn()} request={mockRequest} />,
    );

    await user.click(screen.getByRole("button", { name: "Approve" }));

    await waitFor(() => {
      expect(
        screen.getByText("At least one role is required"),
      ).toBeInTheDocument();
    });
  });

  it("calls onOpenChange(false) after successful approval", async () => {
    const onOpenChange = vi.fn();

    render(
      <ApproveModal
        open={true}
        onOpenChange={onOpenChange}
        request={mockRequest}
      />,
    );

    await selectFinanceUserRole();

    const submitBtn = screen.getByText("Approve").closest("button")!;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("does not close modal when server returns error", async () => {
    server.use(
      http.put(`${BASE}/access-request/:id`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const onOpenChange = vi.fn();

    render(
      <ApproveModal
        open={true}
        onOpenChange={onOpenChange}
        request={mockRequest}
      />,
    );

    await selectFinanceUserRole();
    onOpenChange.mockClear();

    const submitBtn = screen.getByText("Approve").closest("button")!;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onOpenChange).not.toHaveBeenCalledWith(false);
    });
  });

  it("calls onSuccess after successful approval", async () => {
    const onSuccess = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <ApproveModal
        open={true}
        onOpenChange={onOpenChange}
        request={mockRequest}
        onSuccess={onSuccess}
      />,
    );

    await selectFinanceUserRole();

    const submitBtn = screen.getByText("Approve").closest("button")!;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("calls onOpenChange(false) when Cancel is clicked", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ApproveModal
        open={true}
        onOpenChange={onOpenChange}
        request={mockRequest}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows 'Approving...' text while request is pending", async () => {
    let resolveHandler!: () => void;
    const handlerPromise = new Promise<void>((resolve) => {
      resolveHandler = resolve;
    });

    server.use(
      http.put(`${BASE}/access-request/:id`, async () => {
        await handlerPromise;
        return HttpResponse.json(
          { status: "SUCCESS", message: "Approved" },
          { status: 200 },
        );
      }),
    );

    render(
      <ApproveModal open={true} onOpenChange={vi.fn()} request={mockRequest} />,
    );

    await selectFinanceUserRole();

    const submitBtn = screen.getByText("Approve").closest("button")!;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Approving...")).toBeInTheDocument();
    });

    resolveHandler();
  });

  it("shows validation error when response notes exceed 500 characters", async () => {
    const user = userEvent.setup();

    render(
      <ApproveModal open={true} onOpenChange={vi.fn()} request={mockRequest} />,
    );

    const notesInput = screen.getByPlaceholderText(
      "Enter notes for approving this access request (optional)...",
    );

    await user.type(notesInput, "a".repeat(501));

    await user.click(screen.getByRole("button", { name: "Approve" }));

    await waitFor(() => {
      expect(
        screen.getByText("Response notes must be less than 500 characters"),
      ).toBeInTheDocument();
    });
  });
});
