import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();
const mockParams = vi.hoisted(() => ({ id: "1" }));

const { mockUseGetInternalUser, mockUseGetProfilePicture } = vi.hoisted(() => ({
  mockUseGetInternalUser: vi.fn(),
  mockUseGetProfilePicture: vi.fn(),
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
    useGetInternalUser: mockUseGetInternalUser,
  };
});

import { ShowInternalUserPage } from "@/features/settings/users/pages/show-internal.page";

const mockUser = {
  id: 1,
  nipp: "12345",
  name: "John Doe",
  email: "john@example.com",
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
  costCenterName: "Cost Center A",
  businessAreaCode: "BA001",
  businessAreaName: "Business Area A",
  supervisorLevelOnePosition: "",
  supervisorLevelOnePositionName: "",
  supervisorLevelTwoPosition: "",
  supervisorLevelTwoPositionName: "",
  twoFactorEnabled: false,
  roles: [{ id: 1, name: "Admin" }],
  genderName: "Male",
  jobFamilyName: "Engineering",
  subJobFamilyName: "Frontend",
  grade: "L4",
  positionNomenclature: "Senior Engineer",
  directorateNomenclature: "Tech",
  organizationNomenclature: "Digital",
  corsaName: "Corsa A",
  corsaNomenclature: "Corsa Nomen",
  workerGroupName: "Worker A",
  subWorkerGroupName: "Sub Worker A",
  employmentStartDate: "2020-01-01",
  mutationDate: "2021-01-01",
  beginningDate: "2020-01-01",
  endingDate: "2023-01-01",
  recordingDate: "2020-01-01",
  rkipInputPeriodUntil: "2024-01-01",
  tempSupervisorName: "Temp Sup",
  tempSupervisorNipp: "99999",
  supervisorLevelOneName: "Sup One",
  supervisorLevelOneNipp: "11111",
  supervisorLevelOnePositionName: "Manager",
  supervisorLevelTwoName: "Sup Two",
  supervisorLevelTwoNipp: "22222",
  supervisorLevelTwoPositionName: "Director",
  stat2: "Active",
  psText: "Permanent",
  psGroup: "PG1",
  phoneNumber: "08123456789",
  photo: "",
  password: "",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

function renderPage() {
  return render(<ShowInternalUserPage />);
}

describe("ShowInternalUserPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseGetInternalUser.mockReturnValue({ data: null, isLoading: true });
    renderPage();
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders invalid data page when userId is missing", () => {
    mockParams.id = undefined as unknown as string;
    renderPage();
    expect(screen.getByTestId("invalid-data-page")).toBeInTheDocument();
  });

  it("renders not found page when user data is null", () => {
    mockParams.id = "1";
    mockUseGetInternalUser.mockReturnValue({ data: null, isLoading: false });
    renderPage();
    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
    expect(screen.getByText("Internal User Not Found")).toBeInTheDocument();
  });

  it("renders user details when data is available", () => {
    mockUseGetInternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText("Senior Developer")).toBeInTheDocument();
  });

  it("renders personal information section", () => {
    mockUseGetInternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Gender")).toBeInTheDocument();
    expect(screen.getByText("Male")).toBeInTheDocument();
  });

  it("renders organization structure section", () => {
    mockUseGetInternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    expect(screen.getByText("Organization Structure")).toBeInTheDocument();
    expect(screen.getByText("Company A")).toBeInTheDocument();
    expect(screen.getByText("Directorate A")).toBeInTheDocument();
  });

  it("renders worker group information when present", () => {
    mockUseGetInternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    expect(screen.getByText("Worker Group Information")).toBeInTheDocument();
    expect(screen.getByText("Worker A")).toBeInTheDocument();
    expect(screen.getByText("Sub Worker A")).toBeInTheDocument();
  });

  it("renders employment details when present", () => {
    mockUseGetInternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    expect(screen.getByText("Employment Details")).toBeInTheDocument();
    expect(screen.getByText("Employment Start Date")).toBeInTheDocument();
  });

  it("does not render worker group when absent", () => {
    const userWithoutWorker = {
      ...mockUser,
      workerGroupName: null,
      subWorkerGroupName: null,
    };
    mockUseGetInternalUser.mockReturnValue({
      data: { data: userWithoutWorker },
      isLoading: false,
    });
    renderPage();

    expect(
      screen.queryByText("Worker Group Information"),
    ).not.toBeInTheDocument();
  });

  it("renders Back button and navigates back", async () => {
    const user = userEvent.setup();
    mockUseGetInternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    await user.click(screen.getByTestId("action-btn-back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("renders Edit button and navigates on click", async () => {
    const user = userEvent.setup();
    mockUseGetInternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    await user.click(screen.getByTestId("action-btn-edit"));
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("renders supervisor information", () => {
    mockUseGetInternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    expect(screen.getByText("Supervisor Information")).toBeInTheDocument();
    expect(screen.getByText("Sup One")).toBeInTheDocument();
    expect(screen.getByText("Sup Two")).toBeInTheDocument();
  });

  it("renders payroll information when present", () => {
    mockUseGetInternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    expect(screen.getByText("Payroll Information")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Permanent")).toBeInTheDocument();
  });

  it("renders audit information", () => {
    mockUseGetInternalUser.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
    });
    renderPage();

    expect(screen.getByText("Audit Information")).toBeInTheDocument();
    expect(screen.getByText("Created At")).toBeInTheDocument();
    expect(screen.getByText("Created By")).toBeInTheDocument();
    expect(screen.getByText("Updated At")).toBeInTheDocument();
    expect(screen.getByText("Updated By")).toBeInTheDocument();
  });
});
