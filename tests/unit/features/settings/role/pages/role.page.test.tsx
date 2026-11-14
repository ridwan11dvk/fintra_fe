import type { RoleResponse } from "@/features/settings";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => mockNavigate,
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
      Page: ({
        children,
        title,
      }: {
        children: React.ReactNode;
        title?: string;
      }) => (
        <div data-testid="page">
          <div data-testid="layout-title">{title}</div>
          {children}
        </div>
      ),
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

const mockRoleData: RoleResponse = {
  id: 1,
  name: "Admin",
  description: "Administrator role",
  moduleId: 1,
  module: { id: 1, name: "Master Data" },
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

vi.mock("@/features/settings", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/settings")>();
  return {
    ...actual,
    RoleList: ({
      onEdit,
      onManagePermissions,
    }: {
      onEdit: (r: RoleResponse) => void;
      onManagePermissions: (r: RoleResponse) => void;
    }) => (
      <div data-testid="role-list">
        <button data-testid="trigger-edit" onClick={() => onEdit(mockRoleData)}>
          Edit
        </button>
        <button
          data-testid="trigger-manage-permissions"
          onClick={() => onManagePermissions(mockRoleData)}
        >
          Manage Permissions
        </button>
      </div>
    ),
  };
});

import { RolePage } from "@/features/settings/role/pages/role.page";

describe("RolePage", () => {
  it("renders the page with layout and title", () => {
    render(<RolePage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("layout-title")).toHaveTextContent(
      "Role Management",
    );
  });

  it("renders the page title heading and subtitle", () => {
    render(<RolePage />);

    const headings = screen.getAllByText("Role Management");
    expect(headings.length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText("Manage roles and their permissions"),
    ).toBeInTheDocument();
  });

  it("renders Create Role button", () => {
    render(<RolePage />);

    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("renders the RoleList component", () => {
    render(<RolePage />);

    expect(screen.getByTestId("role-list")).toBeInTheDocument();
  });

  it("navigates to create page when Create Role is clicked", async () => {
    const user = userEvent.setup();
    render(<RolePage />);

    await user.click(screen.getByTestId("action-btn-add"));

    expect(mockNavigate).toHaveBeenCalledWith("/setting/role/create");
  });

  it("navigates to update page when edit is triggered from RoleList", async () => {
    const user = userEvent.setup();
    render(<RolePage />);

    await user.click(screen.getByTestId("trigger-edit"));

    expect(mockNavigate).toHaveBeenCalledWith("/setting/role/1/update");
  });

  it("navigates to role detail when manage permissions is triggered", async () => {
    const user = userEvent.setup();
    render(<RolePage />);

    await user.click(screen.getByTestId("trigger-manage-permissions"));

    expect(mockNavigate).toHaveBeenCalledWith("/setting/role/1");
  });
});
