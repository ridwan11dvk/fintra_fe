import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "1" }),
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
      Badge: ({
        children,
        variant,
      }: {
        children: React.ReactNode;
        variant?: string;
      }) => <span data-testid={`badge-${variant}`}>{children}</span>,
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

vi.mock("@/features/errors", () => ({
  DataNotFoundPage: ({ title }: { title: string }) => (
    <div data-testid="not-found-page">{title}</div>
  ),
}));

const mockPermission = {
  id: 1,
  name: "master-data:bank:list",
  featureName: "master-data:bank",
  description: "View bank list",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

// RoleFullDetailResponse shape (module-grouped permissions, no flat `module`)
const mockRoleDetail = {
  id: 1,
  code: "ADMIN",
  name: "Admin",
  description: "Administrator role",
  isSuperAdmin: false,
  isActive: true,
  type: "CORE" as const,
  companyCode: "KAI",
  company: { id: 1, code: "KAI", name: "Kereta Api Indonesia" },
  businessAreas: [{ id: 1, code: "BA-1", name: "Master Data BA" }],
  modulePermissions: [
    {
      module: { id: 1, name: "Master Data" },
      features: [
        {
          feature: "master-data:bank",
          permissions: [mockPermission],
          allIds: [1],
        },
      ],
    },
  ],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

let mockRoleFullDetailQuery: {
  data: { status: string; data: typeof mockRoleDetail | null } | undefined;
  isLoading: boolean;
} = {
  data: { status: "SUCCESS", data: mockRoleDetail },
  isLoading: false,
};

vi.mock("@/features/settings", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/settings")>();
  return {
    ...actual,
    useRoleFullDetail: () => mockRoleFullDetailQuery,
    RolePermissionTable: () => <div data-testid="role-permission-table" />,
  };
});

import { ShowRolePage } from "@/features/settings/role/pages/show-role.page";

describe("ShowRolePage", () => {
  it("shows loading page when data is loading", () => {
    mockRoleFullDetailQuery = { data: undefined, isLoading: true };

    render(<ShowRolePage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("shows not found page when no role data", () => {
    mockRoleFullDetailQuery = {
      data: { status: "SUCCESS", data: null },
      isLoading: false,
    };

    render(<ShowRolePage />);

    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
    expect(screen.getByTestId("not-found-page")).toHaveTextContent(
      "Role Not Found",
    );
  });

  it("renders the role name in layout title", async () => {
    mockRoleFullDetailQuery = {
      data: { status: "SUCCESS", data: mockRoleDetail },
      isLoading: false,
    };

    render(<ShowRolePage />);

    await waitFor(() => {
      expect(screen.getByTestId("layout-title")).toHaveTextContent("Admin");
    });
  });

  it("renders role name as page heading", () => {
    mockRoleFullDetailQuery = {
      data: { status: "SUCCESS", data: mockRoleDetail },
      isLoading: false,
    };

    render(<ShowRolePage />);

    const headings = screen.getAllByText("Admin");
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it("renders role description", async () => {
    mockRoleFullDetailQuery = {
      data: { status: "SUCCESS", data: mockRoleDetail },
      isLoading: false,
    };

    render(<ShowRolePage />);

    await waitFor(() => {
      expect(
        screen.getAllByText("Administrator role").length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders module name from modulePermissions", async () => {
    mockRoleFullDetailQuery = {
      data: { status: "SUCCESS", data: mockRoleDetail },
      isLoading: false,
    };

    render(<ShowRolePage />);

    await waitFor(() => {
      expect(screen.getByText("Master Data")).toBeInTheDocument();
    });
  });

  it("renders Edit Role button", async () => {
    mockRoleFullDetailQuery = {
      data: { status: "SUCCESS", data: mockRoleDetail },
      isLoading: false,
    };

    render(<ShowRolePage />);

    await waitFor(() => {
      expect(screen.getByTestId("action-btn-edit")).toBeInTheDocument();
    });
  });

  it("renders back button", async () => {
    mockRoleFullDetailQuery = {
      data: { status: "SUCCESS", data: mockRoleDetail },
      isLoading: false,
    };

    render(<ShowRolePage />);

    await waitFor(() => {
      expect(screen.getByTestId("action-btn-back")).toBeInTheDocument();
    });
  });

  it("navigates back to role list when back is clicked", async () => {
    mockRoleFullDetailQuery = {
      data: { status: "SUCCESS", data: mockRoleDetail },
      isLoading: false,
    };

    const user = userEvent.setup();
    render(<ShowRolePage />);

    await waitFor(() => {
      expect(screen.getByTestId("action-btn-back")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("action-btn-back"));

    expect(mockNavigate).toHaveBeenCalledWith("/setting/role");
  });

  it("renders permission features from modulePermissions", async () => {
    mockRoleFullDetailQuery = {
      data: { status: "SUCCESS", data: mockRoleDetail },
      isLoading: false,
    };

    render(<ShowRolePage />);

    await waitFor(() => {
      // Permission feature groups render inside the module tab
      expect(screen.getAllByText("master-data:bank").length).toBeGreaterThan(0);
    });
  });

  it("navigates to update page when Edit Role is clicked", async () => {
    mockRoleFullDetailQuery = {
      data: { status: "SUCCESS", data: mockRoleDetail },
      isLoading: false,
    };

    const user = userEvent.setup();
    render(<ShowRolePage />);

    await waitFor(() => {
      expect(screen.getByTestId("action-btn-edit")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("action-btn-edit"));

    expect(mockNavigate).toHaveBeenCalledWith("/setting/role/1/update");
  });

  it("renders empty state when role has no module permissions", async () => {
    mockRoleFullDetailQuery = {
      data: {
        status: "SUCCESS",
        data: { ...mockRoleDetail, modulePermissions: [] },
      },
      isLoading: false,
    };

    render(<ShowRolePage />);

    await waitFor(() => {
      expect(
        screen.getByText("No permissions assigned to this role"),
      ).toBeInTheDocument();
    });
  });
});
