import { RolePositionPage } from "@/features/settings/role-position/pages/role-position.page";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

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
      Page: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="page">{children}</div>
      ),
      ActionButton: ({
        label,
        onClick,
      }: {
        label?: string;
        onClick?: () => void;
        variant?: string;
        showLabel?: boolean;
        permission?: string;
      }) => (
        <button
          data-testid={`action-btn-${label?.toLowerCase().replace(/\s+/g, "-")}`}
          onClick={onClick}
        >
          {label}
        </button>
      ),
      Tabs: ({
        value,
        onValueChange,
        children,
      }: {
        value: string;
        onValueChange: (v: string) => void;
        children: React.ReactNode;
      }) => (
        <div data-testid="tabs" data-value={value}>
          <button data-testid="tab-role" onClick={() => onValueChange("role")}>
            switch role
          </button>
          {children}
        </div>
      ),
      TabsList: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="tabs-list">{children}</div>
      ),
      TabsTrigger: ({
        value,
        children,
      }: {
        value: string;
        children: React.ReactNode;
      }) => <div data-testid={`tab-trigger-${value}`}>{children}</div>,
      TabsContent: ({
        value,
        children,
      }: {
        value: string;
        children: React.ReactNode;
      }) => <div data-testid={`tab-content-${value}`}>{children}</div>,
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

vi.mock(
  "@/features/settings/role-position/components/role-position-list",
  () => ({
    RolePositionList: () => (
      <div data-testid="role-position-list">By Position List</div>
    ),
  }),
);

vi.mock(
  "@/features/settings/role-position/components/role-position-grouped-list",
  () => ({
    RolePositionGroupedList: () => (
      <div data-testid="role-position-grouped-list">By Role List</div>
    ),
  }),
);

describe("RolePositionPage", () => {
  it("renders page with heading and both tab contents", () => {
    render(<RolePositionPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByText("Role Position Management")).toBeInTheDocument();
    expect(screen.getByTestId("tab-content-position")).toBeInTheDocument();
    expect(screen.getByTestId("tab-content-role")).toBeInTheDocument();
    expect(screen.getByTestId("role-position-list")).toBeInTheDocument();
    expect(
      screen.getByTestId("role-position-grouped-list"),
    ).toBeInTheDocument();
  });

  it("renders By Position tab as active with position add button", () => {
    render(<RolePositionPage />);

    expect(screen.getByTestId("tabs")).toHaveAttribute(
      "data-value",
      "position",
    );
    expect(
      screen.getByTestId("action-btn-add-role-position"),
    ).toBeInTheDocument();
  });

  it("switches to By Role view when tab changes", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<RolePositionPage />);

    await user.click(screen.getByTestId("tab-role"));

    expect(screen.getByTestId("tabs")).toHaveAttribute("data-value", "role");
    expect(
      screen.getByTestId("action-btn-add-role-position-(by-role)"),
    ).toBeInTheDocument();
  });
});
