import type { RoleDetailResponse } from "@/features/settings";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockPermission = {
  id: 1,
  name: "master-data:bank:list",
  resource: "master-data:bank",
  description: "View bank list",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const mockRole: RoleDetailResponse = {
  id: 1,
  name: "Admin",
  description: "Administrator role",
  moduleId: 1,
  module: { id: 1, name: "Master Data" },
  permissions: [mockPermission],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const { mockRemovePermissions } = vi.hoisted(() => ({
  mockRemovePermissions: vi.fn().mockReturnValue({
    mutate: (_vars: unknown, opts: { onSuccess?: () => void }) => {
      opts?.onSuccess?.();
    },
    isPending: false,
  }),
}));

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
      OfflineDataTable: ({
        title,
        actions,
        badge,
        data,
        columns,
        selectedItems,
        onItemSelect,
      }: {
        title?: string;
        actions?: React.ReactNode;
        badge?: { label?: string };
        data?: unknown[];
        columns?: Array<{
          id?: string;
          cell?: (ctx: { row: { original: unknown } }) => React.ReactNode;
        }>;
        selectedItems?: unknown[];
        onItemSelect?: (items: unknown[]) => void;
      }) => {
        const actionsCol = columns?.find((c) => c.id === "actions");
        return (
          <div data-testid="offline-datatable">
            <div data-testid="table-title">{title}</div>
            <div data-testid="table-badge">{badge?.label}</div>
            <div data-testid="table-data-length">{data?.length}</div>
            <div data-testid="table-actions">{actions}</div>
            {actionsCol?.cell &&
              data?.map((item, i) => (
                <div
                  key={(item as { id: number }).id ?? i}
                  data-testid="permission-row"
                >
                  {actionsCol.cell({
                    row: { original: item, index: i },
                  } as never)}
                </div>
              ))}
          </div>
        );
      },

      ConfirmationModal: ({
        open,
        onConfirm,
        onOpenChange,
        title,
        confirmText,
      }: {
        open?: boolean;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
        title?: string;
        confirmText?: string;
      }) =>
        open ? (
          <div data-testid="confirmation-modal">
            <span data-testid="modal-title">{title}</span>
            <button data-testid="confirm-btn" onClick={onConfirm}>
              {confirmText}
            </button>
            <button
              data-testid="cancel-btn"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </button>
          </div>
        ) : null,
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

vi.mock("@/features/settings", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/settings")>();
  return {
    ...actual,
    useRemovePermissions: mockRemovePermissions,
  };
});

vi.mock("@/features/settings/role/components/permission-manager", () => ({
  PermissionManager: ({ open }: { open: boolean }) =>
    open ? <div data-testid="permission-manager-modal" /> : null,
}));

import { RolePermissionTable } from "@/features/settings/role/components/role-permission-table";

describe("RolePermissionTable", () => {
  it("renders the OfflineDataTable with title", () => {
    render(<RolePermissionTable role={mockRole} />);

    expect(screen.getByTestId("offline-datatable")).toBeInTheDocument();
    expect(screen.getByTestId("table-title")).toHaveTextContent("Permissions");
  });

  it("renders badge with permission count", () => {
    render(<RolePermissionTable role={mockRole} />);

    expect(screen.getByTestId("table-badge")).toHaveTextContent(
      "1 permissions",
    );
  });

  it("renders Change Permission button", () => {
    render(<RolePermissionTable role={mockRole} />);

    expect(screen.getByTestId("action-btn-generate")).toBeInTheDocument();
  });

  it("does not show Remove button when no permissions selected", () => {
    render(<RolePermissionTable role={mockRole} />);

    expect(screen.queryByText(/Remove \(/i)).not.toBeInTheDocument();
  });

  it("opens permission manager modal when Change Permission is clicked", async () => {
    const user = userEvent.setup();
    render(<RolePermissionTable role={mockRole} />);

    expect(
      screen.queryByTestId("permission-manager-modal"),
    ).not.toBeInTheDocument();

    await user.click(screen.getByTestId("action-btn-generate"));

    expect(screen.getByTestId("permission-manager-modal")).toBeInTheDocument();
  });

  it("renders badge with 0 permissions when role has no permissions", () => {
    const roleWithoutPermissions: RoleDetailResponse = {
      ...mockRole,
      permissions: [],
    };

    render(<RolePermissionTable role={roleWithoutPermissions} />);

    expect(screen.getByTestId("table-badge")).toHaveTextContent(
      "0 permissions",
    );
  });

  it("shows single delete confirmation modal and confirms deletion", async () => {
    const user = userEvent.setup();

    render(<RolePermissionTable role={mockRole} />);

    const deleteBtns = screen.getAllByTestId("action-btn-delete");
    await user.click(deleteBtns[0]);

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Delete Permission",
    );

    await user.click(screen.getByTestId("confirm-btn"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("cancels single permission deletion", async () => {
    const user = userEvent.setup();
    render(<RolePermissionTable role={mockRole} />);

    const deleteBtns = screen.getAllByTestId("action-btn-delete");
    await user.click(deleteBtns[0]);

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();

    await user.click(screen.getByTestId("cancel-btn"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal"),
      ).not.toBeInTheDocument();
    });
  });
});
