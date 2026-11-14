import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

const { mockUseGetExternalUser, mockUseUpdateExternalUserMutation } =
  vi.hoisted(() => ({
    mockUseGetExternalUser: vi.fn(),
    mockUseUpdateExternalUserMutation: vi.fn(),
  }));

vi.mock("react-router", async (importOriginal) => {
  const actual: object = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
  };
});

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
  DataNotFoundPage: ({ title }: { title?: string }) => (
    <div data-testid="not-found-page">{title}</div>
  ),
  InvalidDataPage: ({
    title,
    message,
  }: {
    title?: string;
    message?: string;
  }) => (
    <div data-testid="invalid-data-page">
      <div>{title}</div>
      <div>{message}</div>
    </div>
  ),
}));

vi.mock("@/features/settings", async (importOriginal) => {
  const actual: object = await importOriginal();
  return {
    ...actual,
    useGetExternalUser: mockUseGetExternalUser,
    useUpdateExternalUserMutation: () => ({
      mutate: mockUseUpdateExternalUserMutation,
      isPending: false,
    }),
    ExternalUserForm: ({
      onSubmit,
    }: {
      onSubmit: (data: Record<string, unknown>) => void;
    }) => (
      <div data-testid="external-user-form">
        <button
          data-testid="submit-form"
          onClick={() =>
            onSubmit({
              userType: "PERSONAL",
              name: "Jane Doe",
              email: "jane@example.com",
              username: "jane_doe",
              roles: [1],
              twoFactorEnabled: false,
            })
          }
        >
          Submit Form
        </button>
      </div>
    ),
  };
});

import { EditExternalUserPage } from "@/features/settings/users/pages/edit-external.page";

const mockUser = {
  data: {
    id: 1,
    userType: "PERSONAL",
    name: "Jane Doe",
    email: "jane@example.com",
    username: "jane_doe",
    phoneNumber: "08123456789",
    twoFactorEnabled: false,
    roles: [{ id: 1, name: "Admin" }],
    photo: "",
    nik: "",
    npwp: "",
    ktpFile: "",
    npwpFile: "",
    address: "",
    companyCode: "",
    purpose: "",
    startDate: "",
    endDate: "",
    responsibleName: "",
    responsibleEmail: "",
    responsibleNik: "",
    responsibleAddress: "",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
};

describe("EditExternalUserPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseGetExternalUser.mockReturnValue({ data: null, isLoading: true });
    render(<EditExternalUserPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders not found when user data is null", () => {
    mockUseGetExternalUser.mockReturnValue({ data: null, isLoading: false });
    render(<EditExternalUserPage />);
    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
  });

  it("renders form when user data is available", () => {
    mockUseGetExternalUser.mockReturnValue({
      data: mockUser,
      isLoading: false,
    });
    render(<EditExternalUserPage />);
    expect(screen.getByTestId("external-user-form")).toBeInTheDocument();
  });

  it("calls mutation on form submit", async () => {
    const user = userEvent.setup();
    mockUseGetExternalUser.mockReturnValue({
      data: mockUser,
      isLoading: false,
    });
    render(<EditExternalUserPage />);

    await user.click(screen.getByTestId("submit-form"));
    expect(mockUseUpdateExternalUserMutation).toHaveBeenCalled();
  });
});
