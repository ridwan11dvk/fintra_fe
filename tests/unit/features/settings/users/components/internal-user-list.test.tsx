import type { InternalUser } from "@/features/settings";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockInternalUser = vi.hoisted(
  (): InternalUser => ({
    id: 1,
    nipp: "12345",
    name: "John Doe",
    email: "john@example.com",
    costCenterName: "CC-A",
    rkipInputPeriodUntil: "2024-12-31",
    password: "",
    companyCode: "C001",
    companyName: "Company A",
    directorateCode: "D001",
    directorateName: "Directorate A",
    personalAreaCode: "PA001",
    personalAreaName: "Personal Area A",
    organizationCode: "O001",
    organizationName: "Organization A",
    jobCode: "J001",
    jobName: "Developer",
    positionCode: "P001",
    positionName: "Senior Developer",
    costCenterCode: "CC001",
    businessAreaCode: "BA001",
    businessAreaName: "Business Area A",
    supervisorLevelOnePosition: "",
    supervisorLevelOnePositionName: "",
    supervisorLevelTwoPosition: "",
    supervisorLevelTwoPositionName: "",
    twoFactorEnabled: false,
    roles: [{ id: 1, name: "Admin" }],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  }),
);

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual: object = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("@/features/settings/role/data/role.query", () => ({
  useFilteredRoles: () => ({
    data: {
      data: [
        { id: 1, name: "Admin" },
        { id: 2, name: "User" },
      ],
    },
    isLoading: false,
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
        hasModule: () => true,
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
      DataTable: ({
        columns,
        title,
        search,
        filters,
      }: {
        columns: unknown[];
        title?: string;
        search?: { placeholder?: string };
        filters?: unknown[];
      }) => {
        const actionsCol = (
          columns as Array<{
            id?: string;
            cell?: (ctx: unknown) => React.ReactNode;
          }>
        ).find((c) => c.id === "actions");
        return (
          <div data-testid="data-table">
            <span data-testid="table-title">{title}</span>
            <span data-testid="columns-count">{columns?.length}</span>
            <span data-testid="filter-count">{filters?.length}</span>
            {search && (
              <span data-testid="search-placeholder">{search.placeholder}</span>
            )}
            {actionsCol?.cell && (
              <div data-testid="actions-cell">
                {actionsCol.cell({
                  row: { original: mockInternalUser, index: 0 },
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
            <button data-testid="confirm-action" onClick={onConfirm}>
              {confirmText ?? "Confirm"}
            </button>
            <button
              data-testid="cancel-action"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </button>
          </div>
        ) : null,
      Modal: ({
        open,
        onOpenChange,
        title,
        description,
        children,
        footer,
      }: {
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
        title?: string;
        description?: string;
        children?: React.ReactNode;
        footer?: React.ReactNode;
      }) =>
        open ? (
          <div data-testid="date-modal">
            <span data-testid="date-modal-title">{title}</span>
            <span data-testid="date-modal-desc">{description}</span>
            <div data-testid="date-modal-content">{children}</div>
            <div data-testid="date-modal-footer">{footer}</div>
          </div>
        ) : null,
      DatePicker: ({
        onChange,
      }: {
        onChange?: (date: Date | undefined) => void;
      }) => (
        <button
          data-testid="date-picker"
          onClick={() => onChange?.(new Date("2024-06-15"))}
        >
          Pick Date
        </button>
      ),
      EllipsisAction: ({
        actions,
      }: {
        actions: Array<{ label: string; onClick: () => void }>;
      }) => (
        <div data-testid="ellipsis-action">
          {actions.map((action, idx) => (
            <button
              key={idx}
              data-testid={`action-${action.label}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      ),
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

import { InternalUserList } from "@/features/settings/users/components/internal-user-list";

describe("InternalUserList", () => {
  it("renders DataTable with correct title and search placeholder", () => {
    render(<InternalUserList />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getByTestId("table-title")).toHaveTextContent(
      "All Internal User",
    );
    expect(screen.getByTestId("search-placeholder")).toHaveTextContent(
      "Search by name, email, or nipp",
    );
  });

  it("renders 8 columns (select + 7 data/action columns)", () => {
    render(<InternalUserList />);

    expect(screen.getByTestId("columns-count")).toHaveTextContent("8");
  });

  it("renders role filter", () => {
    render(<InternalUserList />);

    expect(screen.getByTestId("filter-count")).toHaveTextContent("1");
  });

  it("navigates to detail page on show", async () => {
    const user = userEvent.setup();
    render(<InternalUserList />);

    await user.click(screen.getByTestId("action-Show"));

    expect(mockNavigate).toHaveBeenCalledWith("/setting/user/internal/1");
  });

  it("navigates to edit page on edit", async () => {
    const user = userEvent.setup();
    render(<InternalUserList />);

    await user.click(screen.getByTestId("action-Edit"));

    expect(mockNavigate).toHaveBeenCalledWith("/setting/user/internal/1/edit");
  });

  it("opens update rkip date modal on Change RKIP Input", async () => {
    const user = userEvent.setup();
    render(<InternalUserList />);

    await user.click(screen.getByTestId("action-Change RKIP Input"));

    expect(screen.getByTestId("date-modal")).toBeInTheDocument();
    expect(screen.getByTestId("date-modal-title")).toHaveTextContent(
      "Update RKIP Date Limit",
    );
    expect(screen.getByTestId("date-modal-desc")).toHaveTextContent(
      'Update RKIP input period limit date for user "John Doe".',
    );
  });

  it("renders date picker and action buttons in date modal", async () => {
    const user = userEvent.setup();
    render(<InternalUserList />);

    await user.click(screen.getByTestId("action-Change RKIP Input"));

    expect(screen.getByTestId("date-picker")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Remove Limit")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("opens delete user confirmation modal on Delete", async () => {
    const user = userEvent.setup();
    render(<InternalUserList />);

    await user.click(screen.getByTestId("action-Delete"));

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Delete User");
    expect(screen.getByTestId("modal-desc")).toHaveTextContent(
      'Are you sure you want to delete the user "John Doe"? This action cannot be undone.',
    );
  });
});
