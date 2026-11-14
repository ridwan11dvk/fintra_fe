import { ChooseJobPositionsDialog } from "@/features/settings/role-position/components/choose-job-positions-dialog";
import { ChooseRolesDialog } from "@/features/settings/role-position/components/choose-roles-dialog";
import { RolePositionDetail } from "@/features/settings/role-position/components/role-position-detail";
import { RolePositionDetailByRole } from "@/features/settings/role-position/components/role-position-detail-by-role";
import { RolePositionGroupedList } from "@/features/settings/role-position/components/role-position-grouped-list";
import { RolePositionList } from "@/features/settings/role-position/components/role-position-list";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockGroupedItem = {
  jobPositionId: 1,
  jobPositionCode: "JP-001",
  jobPositionName: "Manager",
  roles: [{ id: 1, name: "Admin", code: "ADM" }],
};

const mockRoleGroupedItem = {
  roleId: 1,
  roleCode: "ADM",
  roleName: "Admin",
  jobPositions: [{ id: 1, code: "JP-001", name: "Manager" }],
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
        variant,
      }: {
        onClick?: () => void;
        variant?: string;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {variant}
        </button>
      ),
      DataTable: ({
        columns,
        title,
        description,
        footer,
      }: {
        columns: unknown[];
        title?: string;
        description?: string;
        footer?: React.ReactNode;
      }) => {
        const actionsCol = (
          columns as Array<{
            id?: string;
            cell?: (ctx: unknown) => React.ReactNode;
          }>
        ).find((c) => c.id === "actions");
        // The row data is picked from the component's scope via the first
        // column's accessor; both list components pass their own item shape, so
        // mirror whichever list is rendered by inspecting the columns' keys.
        const hasRoleColumns = (columns as Array<{ accessorKey?: string }>).some(
          (c) => c.accessorKey === "roleCode",
        );
        const rowData = hasRoleColumns ? mockRoleGroupedItem : mockGroupedItem;
        return (
          <div data-testid="data-table">
            {title && <span data-testid="table-title">{title}</span>}
            {description && <span data-testid="table-desc">{description}</span>}
            {actionsCol?.cell &&
              actionsCol.cell({
                row: { original: rowData, index: 0 },
              } as never)}
            {footer}
          </div>
        );
      },
      ConfirmationModal: ({
        open,
        onConfirm,
        onOpenChange,
        title,
        description,
      }: {
        open?: boolean;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
        title?: string;
        description?: string;
      }) =>
        open ? (
          <div data-testid="confirmation-modal">
            <span data-testid="modal-title">{title}</span>
            <span data-testid="modal-desc">{description}</span>
            <button data-testid="confirm-delete" onClick={onConfirm}>
              Confirm
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
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/multiple-badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/accordion", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);

vi.mock("@/features/settings/role-position", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/settings/role-position")>();
  return {
    ...actual,
    useDeleteAllRolesFromPosition: () => ({
      mutate: (_id: unknown, opts?: { onSuccess?: () => void }) =>
        opts?.onSuccess?.(),
      isPending: false,
    }),
    useDeleteAllPositionsFromRole: () => ({
      mutate: (_id: unknown, opts?: { onSuccess?: () => void }) =>
        opts?.onSuccess?.(),
      isPending: false,
    }),
  };
});

describe("RolePositionDetail", () => {
  it("renders position and role badges", () => {
    render(
      <RolePositionDetail
        data={{
          jobPosition: { id: 1, code: "JP-001", name: "Manager" },
          roles: [{ id: 1, name: "Admin" }],
        }}
      />,
    );

    expect(screen.getByText("Role Position Information")).toBeInTheDocument();
    expect(screen.getByText("JP-001 - Manager")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders empty state when no roles are assigned", () => {
    render(
      <RolePositionDetail
        data={{
          jobPosition: { id: 1, code: "JP-001", name: "Manager" },
          roles: [],
        }}
      />,
    );

    expect(screen.getByText("No roles assigned")).toBeInTheDocument();
  });
});

describe("RolePositionDetailByRole", () => {
  it("renders role and job position badges", () => {
    render(
      <RolePositionDetailByRole
        data={{
          role: { id: 1, name: "Admin", code: "ADM" },
          jobPositions: [{ id: 1, code: "JP-001", name: "Manager" }],
        }}
      />,
    );

    expect(
      screen.getByText("Role Position Information (By Role)"),
    ).toBeInTheDocument();
    expect(screen.getByText("ADM - Admin")).toBeInTheDocument();
    expect(screen.getByText("JP-001 - Manager")).toBeInTheDocument();
  });

  it("renders empty state when no job positions are assigned", () => {
    render(
      <RolePositionDetailByRole
        data={{ role: { id: 1, name: "Admin", code: "ADM" }, jobPositions: [] }}
      />,
    );

    expect(screen.getByText("No job positions assigned")).toBeInTheDocument();
  });
});

describe("RolePositionList", () => {
  it("renders action buttons and opens the delete modal", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onView = vi.fn();
    render(<RolePositionList onEdit={onEdit} onView={onView} />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();

    await user.click(screen.getByTestId("action-btn-show"));
    expect(onView).toHaveBeenCalledWith(mockGroupedItem);

    await user.click(screen.getByTestId("action-btn-edit"));
    expect(onEdit).toHaveBeenCalledWith(mockGroupedItem);

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Delete Role Position",
    );
    expect(screen.getByTestId("modal-desc")).toHaveTextContent(
      /delete all role assignments/,
    );
  });

  it("confirms delete for the selected item", async () => {
    const user = userEvent.setup();
    render(<RolePositionList onEdit={vi.fn()} onView={vi.fn()} />);

    await user.click(screen.getByTestId("action-btn-delete"));
    const confirmButton = screen.getByTestId("confirm-delete");
    await user.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal"),
      ).not.toBeInTheDocument();
    });
  });
});

describe("RolePositionGroupedList", () => {
  it("renders action buttons and opens the delete modal", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onView = vi.fn();
    render(<RolePositionGroupedList onEdit={onEdit} onView={onView} />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();

    await user.click(screen.getByTestId("action-btn-show"));
    expect(onView).toHaveBeenCalledWith(mockRoleGroupedItem);

    await user.click(screen.getByTestId("action-btn-edit"));
    expect(onEdit).toHaveBeenCalledWith(mockRoleGroupedItem);

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Delete Role Positions",
    );
    expect(screen.getByTestId("modal-desc")).toHaveTextContent(
      /delete all position assignments/,
    );
  });
});

describe("ChooseRolesDialog", () => {
  it("renders dialog and selection description", () => {
    render(
      <ChooseRolesDialog
        open
        onOpenChange={vi.fn()}
        roles={[]}
        onChoose={vi.fn()}
      />,
    );

    expect(screen.getAllByText("Choose Roles").length).toBeGreaterThan(0);
    expect(screen.getByTestId("table-desc")).toHaveTextContent(
      "Choose one or multiple roles",
    );
    expect(screen.getByRole("button", { name: "Choose" })).toBeInTheDocument();
  });
});

describe("ChooseJobPositionsDialog", () => {
  it("renders dialog and selection description", () => {
    render(
      <ChooseJobPositionsDialog
        open
        onOpenChange={vi.fn()}
        jobPositions={[]}
        onChoose={vi.fn()}
      />,
    );

    expect(screen.getAllByText("Choose Job Positions").length).toBeGreaterThan(
      0,
    );
    expect(screen.getByTestId("table-desc")).toHaveTextContent(
      "Choose one or multiple job positions",
    );
    expect(screen.getByRole("button", { name: "Choose" })).toBeInTheDocument();
  });
});
