import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();
const mockParams = vi.hoisted(() => ({ id: "1" }));

const { mockUseGetExternalUser } = vi.hoisted(() => ({
  mockUseGetExternalUser: vi.fn(),
}));

vi.mock("react-router", async (importOriginal) => {
  const actual: object = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
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
        variant,
      }: {
        onClick?: () => void;
        variant?: string;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {variant}
        </button>
      ),
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
  };
});

import { ShowExternalUserPage } from "@/features/settings/users/pages/show-external.page";

const mockUser = {
  id: 1,
  userType: "PERSONAL",
  name: "Jane Doe",
  email: "jane@example.com",
  username: "jane_doe",
  phoneNumber: "08123456789",
  twoFactorEnabled: false,
  roles: [{ id: 2, name: "User" }],
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
};

function renderPage() {
  return render(<ShowExternalUserPage />);
}

describe("ShowExternalUserPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseGetExternalUser.mockReturnValue({ data: null, isLoading: true });
    renderPage();
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders invalid data page when userId is missing", () => {
    mockParams.id = undefined as unknown as string;
    mockUseGetExternalUser.mockReturnValue({ data: null, isLoading: false });
    renderPage();
    expect(screen.getByTestId("invalid-data-page")).toBeInTheDocument();
  });

  it("renders not found page when user data is null", () => {
    mockParams.id = "1";
    mockUseGetExternalUser.mockReturnValue({ data: null, isLoading: false });
    renderPage();
    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
    expect(screen.getByText("External User Not Found")).toBeInTheDocument();
  });

  it("renders user details when data is available", () => {
    mockParams.id = "1";
    mockUseGetExternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane_doe")).toBeInTheDocument();
    expect(screen.getByText("08123456789")).toBeInTheDocument();
    expect(screen.getByText("PERSONAL")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });

  it("renders Edit button and navigates on click", async () => {
    const user = userEvent.setup();
    mockUseGetExternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    const editBtn = screen.getByTestId("action-btn-edit");
    expect(editBtn).toBeInTheDocument();

    await user.click(editBtn);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("renders Back button and navigates back", async () => {
    const user = userEvent.setup();
    mockUseGetExternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    const backBtn = screen.getByTestId("action-btn-back");
    expect(backBtn).toBeInTheDocument();

    await user.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("omits the phone number row when the value is missing", () => {
    mockUseGetExternalUser.mockReturnValue({
      data: {
        data: { ...mockUser, phoneNumber: null },
      },
      isLoading: false,
    });
    renderPage();
    expect(screen.queryByText("Phone Number")).not.toBeInTheDocument();
  });

  it("renders audit information", () => {
    mockUseGetExternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    expect(screen.getByText("Created At")).toBeInTheDocument();
    expect(screen.getByText("Created By")).toBeInTheDocument();
    expect(screen.getByText("Updated At")).toBeInTheDocument();
    expect(screen.getByText("Updated By")).toBeInTheDocument();
    expect(screen.getAllByText("admin").length).toBe(2);
  });
});
