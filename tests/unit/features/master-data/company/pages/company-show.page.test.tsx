import { CompanyShowPage } from "@/features/master-data/company/pages/company-show.page";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockCompany = vi.hoisted(() => ({
  id: 1,
  code: "COMP001",
  name: "PT Mitra Utama",
  address: "Jakarta",
  isActive: true,
  logoFile: null,
  headerDocFile: null,
  footerDocFile: null,
  files: [
    {
      id: 1,
      name: "License",
      alias: "LICENSE",
      filePath: "license.pdf",
      uploadedDate: "2024-01-01T00:00:00Z",
      documentDate: null,
      isActive: true,
      companyId: 1,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
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
        onClick,
        variant,
        label,
      }: {
        onClick?: () => void;
        variant?: string;
        label?: string;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {label ?? variant}
        </button>
      ),
      OfflineDataTable: ({
        title,
        actions,
      }: {
        title: string;
        actions?: React.ReactNode;
      }) => (
        <div data-testid="offline-data-table">
          <span>{title}</span>
          <div data-testid="table-actions">{actions}</div>
        </div>
      ),
      ColumnHeader: () => <div>ColumnHeader</div>,

      PageHeader: ({
        title,
        description,
        actions,
      }: {
        title: string;
        description?: string;
        actions?: React.ReactNode;
      }) => (
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          <div data-testid="header-actions">{actions}</div>
        </div>
      ),
      ProgressLoader: () => <div data-testid="loader">Loading...</div>,
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
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/popover", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("@/features/master-data", async () => {
  const actual = await vi.importActual<typeof import("@/features/master-data")>(
    "@/features/master-data",
  );
  return {
    ...actual,
    useGetCompanyById: vi.fn().mockReturnValue({
      isLoading: false,
      isError: false,
      data: { data: mockCompany },
    }),
    useDeleteCompanyFileMutation: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    }),
    CompanyFileFormModal: ({
      open,
      mode,
    }: {
      open: boolean;
      onOpenChange: (o: boolean) => void;
      mode: string;
    }) =>
      open ? <div data-testid="file-form-modal" data-mode={mode} /> : null,
    CompanyFilePreviewModal: ({ open }: { open: boolean }) =>
      open ? <div data-testid="file-preview-modal" /> : null,
  };
});

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: "1" }),
  };
});

describe("CompanyShowPage", () => {
  it("renders the page", () => {
    render(<CompanyShowPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders company details heading", () => {
    render(<CompanyShowPage />);
    expect(screen.getByText("Company Details")).toBeInTheDocument();
  });

  it("renders company name", () => {
    render(<CompanyShowPage />);
    expect(screen.getByText("PT Mitra Utama")).toBeInTheDocument();
  });

  it("renders company code", () => {
    render(<CompanyShowPage />);
    expect(screen.getByText("COMP001")).toBeInTheDocument();
  });

  it("renders company address", () => {
    render(<CompanyShowPage />);
    expect(screen.getByText("Jakarta")).toBeInTheDocument();
  });

  it("renders active status badge", () => {
    render(<CompanyShowPage />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders edit button in header", () => {
    render(<CompanyShowPage />);
    expect(screen.getByTestId("action-btn-edit")).toBeInTheDocument();
  });

  it("renders offline data table for additional documents", () => {
    render(<CompanyShowPage />);
    expect(screen.getByTestId("offline-data-table")).toBeInTheDocument();
  });

  it("renders add file button in table actions", () => {
    render(<CompanyShowPage />);
    const tableActions = screen.getByTestId("table-actions");
    expect(tableActions).toBeInTheDocument();
  });
});

describe("CompanyShowPage - loading state", () => {
  it("shows loader when data is loading", async () => {
    const { useGetCompanyById } = await import("@/features/master-data");
    vi.mocked(useGetCompanyById).mockReturnValueOnce({
      isLoading: true,
      isError: false,
      data: undefined,
    } as unknown as ReturnType<typeof useGetCompanyById>);

    render(<CompanyShowPage />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });
});

describe("CompanyShowPage - not found state", () => {
  it("shows not found message when company is null", async () => {
    const { useGetCompanyById } = await import("@/features/master-data");
    vi.mocked(useGetCompanyById).mockReturnValueOnce({
      isLoading: false,
      isError: false,
      data: { data: null },
    } as unknown as ReturnType<typeof useGetCompanyById>);

    render(<CompanyShowPage />);
    expect(screen.getByText("Company not found")).toBeInTheDocument();
  });
});
