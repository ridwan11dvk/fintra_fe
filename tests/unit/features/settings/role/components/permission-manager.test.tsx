import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockUseMutation = vi.hoisted(() =>
  vi.fn().mockReturnValue({ mutate: vi.fn(), isPending: false }),
);

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useMutation: mockUseMutation,
  };
});

const mockRole = {
  id: 1,
  name: "Admin",
  description: "Administrator role",
  moduleId: 1,
  module: { id: 1, name: "Master Data" },
  permissions: [
    {
      id: 1,
      name: "master-data:bank:list",
      resource: "master-data:bank",
      description: "View bank list",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    },
  ],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
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
      ActionButton: ({
        onClick,
        label,
        variant,
        disabled,
      }: {
        onClick?: () => void;
        label?: string;
        variant?: string;
        disabled?: boolean;
      }) => (
        <button
          data-testid={`action-btn-${variant}`}
          onClick={onClick}
          disabled={disabled}
        >
          {label ?? variant}
        </button>
      ),
      ActionButton: ({
        onClick,
        label,
        variant,
        disabled,
      }: {
        onClick?: () => void;
        label?: string;
        variant?: string;
        disabled?: boolean;
      }) => (
        <button
          data-testid={`action-btn-${variant}`}
          onClick={onClick}
          disabled={disabled}
        >
          {label ?? variant}
        </button>
      ),
      DataTable: ({
        title,
        actions,
      }: {
        title?: string;
        actions?: React.ReactNode;
      }) => (
        <div data-testid="permissions-datatable">
          <div data-testid="table-title">{title}</div>
          <div data-testid="table-actions">{actions}</div>
        </div>
      ),

      Modal: ({
        open,
        children,
      }: {
        open: boolean;
        children: React.ReactNode;
      }) => (open ? <div data-testid="modal-wrapper">{children}</div> : null),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/image", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/multiple-badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/accordion", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/avatar", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

import { PermissionManager } from "@/features/settings/role/components/permission-manager";

describe("PermissionManager", () => {
  it("renders nothing when open is false", () => {
    render(
      <PermissionManager open={false} onOpenChange={vi.fn()} role={mockRole} />,
    );

    expect(screen.queryByTestId("modal-wrapper")).not.toBeInTheDocument();
  });

  it("renders the DataTable when open is true", () => {
    render(
      <PermissionManager open={true} onOpenChange={vi.fn()} role={mockRole} />,
    );

    expect(screen.getByTestId("modal-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("permissions-datatable")).toBeInTheDocument();
    expect(screen.getByTestId("table-title")).toHaveTextContent("Permissions");
  });

  it("renders Save Changes and Close action buttons", () => {
    render(
      <PermissionManager open={true} onOpenChange={vi.fn()} role={mockRole} />,
    );

    expect(screen.getByTestId("action-btn-save")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-cancel")).toBeInTheDocument();
  });

  it("calls onOpenChange(false) when Save Changes is clicked", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    mockUseMutation.mockReturnValueOnce({
      mutate: (_args: unknown, opts: { onSuccess?: () => void }) => {
        toast.success("Permissions assigned successfully");
        opts?.onSuccess?.();
      },
      isPending: false,
    });

    render(
      <PermissionManager
        open={true}
        onOpenChange={onOpenChange}
        role={mockRole}
      />,
    );

    await user.click(screen.getByTestId("action-btn-save"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(expect.any(String));
    });
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("calls onOpenChange(false) when Close button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <PermissionManager
        open={true}
        onOpenChange={onOpenChange}
        role={mockRole}
      />,
    );

    await user.click(screen.getByTestId("action-btn-cancel"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("disables Save button when mutation is pending", () => {
    mockUseMutation.mockReturnValueOnce({
      mutate: vi.fn(),
      isPending: true,
    });

    render(
      <PermissionManager open={true} onOpenChange={vi.fn()} role={mockRole} />,
    );

    const saveBtn = screen.getByTestId("action-btn-save");
    expect(saveBtn).toBeDisabled();
  });
});
