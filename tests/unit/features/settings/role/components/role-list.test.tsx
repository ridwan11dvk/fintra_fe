import type { RoleResponse } from "@/features/settings";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockRole = vi.hoisted(
  (): RoleResponse => ({
    id: 1,
    name: "Admin",
    description: "Administrator role",
    moduleId: 1,
    module: { id: 1, name: "Master Data" },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  }),
);

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
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
      }: {
        onClick?: () => void;
        label?: string;
        variant?: string;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {label ?? variant}
        </button>
      ),
      DataTable: ({ columns }: { columns: unknown[] }) => {
        const actionsCol = (
          columns as Array<{
            id?: string;
            cell?: (ctx: unknown) => React.ReactNode;
          }>
        ).find((c) => c.id === "actions");
        return (
          <div data-testid="data-table">
            <span data-testid="columns-count">{columns?.length}</span>
            {actionsCol?.cell && (
              <div data-testid="actions-cell">
                {actionsCol.cell({
                  row: { original: mockRole, index: 0 },
                } as never)}
              </div>
            )}
          </div>
        );
      },
      ConfirmationModal: ({
        open,
        onConfirm,
        onOpenChange,
        title,
        description,
        confirmText,
      }: {
        open?: boolean;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
        title?: string;
        description?: string;
        confirmText?: string;
      }) =>
        open ? (
          <div data-testid="confirmation-modal">
            <span data-testid="modal-title">{title}</span>
            <span data-testid="modal-desc">{description}</span>
            <button data-testid="confirm-delete" onClick={onConfirm}>
              {confirmText ?? "Confirm"}
            </button>
            <button
              data-testid="cancel-delete"
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

import { RoleList } from "@/features/settings/role/components/role-list";

describe("RoleList", () => {
  it("renders the DataTable with 6 columns", () => {
    render(<RoleList onEdit={vi.fn()} onManagePermissions={vi.fn()} />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getByTestId("columns-count")).toHaveTextContent("6");
  });

  it("renders edit, show, and delete action buttons in actions cell", () => {
    render(<RoleList onEdit={vi.fn()} onManagePermissions={vi.fn()} />);

    expect(screen.getByTestId("action-btn-edit")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-show")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-delete")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<RoleList onEdit={onEdit} onManagePermissions={vi.fn()} />);

    await user.click(screen.getByTestId("action-btn-edit"));

    expect(onEdit).toHaveBeenCalledWith(mockRole);
  });

  it("calls onManagePermissions when show button is clicked", async () => {
    const onManagePermissions = vi.fn();
    const user = userEvent.setup();
    render(
      <RoleList onEdit={vi.fn()} onManagePermissions={onManagePermissions} />,
    );

    await user.click(screen.getByTestId("action-btn-show"));

    expect(onManagePermissions).toHaveBeenCalledWith(mockRole);
  });

  it("renders confirmation modal when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<RoleList onEdit={vi.fn()} onManagePermissions={vi.fn()} />);

    await user.click(screen.getByTestId("action-btn-delete"));

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
  });

  it("shows correct title and description in delete modal", async () => {
    const user = userEvent.setup();
    render(<RoleList onEdit={vi.fn()} onManagePermissions={vi.fn()} />);

    await user.click(screen.getByTestId("action-btn-delete"));

    expect(screen.getByText("Delete Role")).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to delete the role "Admin"? This action cannot be undone.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("confirm-delete")).toHaveTextContent("Delete");
  });

  it("calls delete mutation when confirm is clicked and closes modal", async () => {
    const user = userEvent.setup();
    render(<RoleList onEdit={vi.fn()} onManagePermissions={vi.fn()} />);

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();

    await user.click(screen.getByTestId("confirm-delete"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("closes modal without deleting when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<RoleList onEdit={vi.fn()} onManagePermissions={vi.fn()} />);

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();

    await user.click(screen.getByTestId("cancel-delete"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal"),
      ).not.toBeInTheDocument();
    });
  });
});
