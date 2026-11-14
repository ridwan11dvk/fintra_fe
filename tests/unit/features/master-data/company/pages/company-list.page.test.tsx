import { CompanyListPage } from "@/features/master-data/company/pages/company-list.page";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockBlob = vi.hoisted(
  () =>
    new Blob(["test"], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
);

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    // Route toast calls through the mocked `sonner` module so tests can
    // assert on them (@railfinance/ui bundles its own sonner internally).
    const { toast } = await import("sonner");
    return {
      ...actual,
      toast,
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
        disabled,
      }: {
        onClick?: () => void;
        variant?: string;
        label?: string;
        disabled?: boolean;
      }) => (
        <button
          data-testid={`action-btn-${label ?? variant}`}
          onClick={onClick}
          disabled={disabled}
        >
          {label ?? variant}
        </button>
      ),
      DataTable: ({ title }: { title: string }) => (
        <div data-testid="data-table">
          <span>{title}</span>
        </div>
      ),

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
      ConfirmationModal: ({
        open,
        title,
        description,
        confirmText,
        isLoading,
        onConfirm,
        onCancel,
      }: {
        open: boolean;
        title?: string;
        description?: string;
        confirmText?: string;
        isLoading?: boolean;
        onConfirm?: () => void;
        onCancel?: () => void;
      }) =>
        open ? (
          <div data-testid="confirmation-modal">
            <h2>{title}</h2>
            <p>{description}</p>
            <button
              data-testid="confirm-btn"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {confirmText}
            </button>
            <button data-testid="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        ) : null,
      ImportModal: ({
        open,
        onOpenChange,
      }: {
        open: boolean;
        onOpenChange: (o: boolean) => void;
      }) =>
        open ? (
          <div data-testid="import-modal">
            <button
              data-testid="close-import-btn"
              onClick={() => onOpenChange(false)}
            >
              Close
            </button>
          </div>
        ) : null,
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

vi.mock("@/features/master-data/company/data/company.query", () => ({
  companyQueryKeys: {
    all: ["companies"],
    lists: () => ["companies", "list"],
    list: (params?: unknown) => ["companies", "list", params],
    details: () => ["companies", "detail"],
    detail: (id: number) => ["companies", "detail", id],
  },
}));

vi.mock("@/features/master-data/company/data/company.mutation", () => ({
  useDeleteCompanyMutation: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  }),
  useImportCompaniesMutation: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@/features/master-data/company/data/company.service", () => ({
  companyService: {
    listCompanies: vi.fn(),
    getCompanyById: vi.fn(),
    createCompany: vi.fn(),
    updateCompany: vi.fn(),
    deleteCompany: vi.fn(),
    uploadCompanyFile: vi.fn(),
    updateCompanyFile: vi.fn(),
    deleteCompanyFile: vi.fn(),
    getLogoPresignedUrl: vi.fn(),
    getHeaderPresignedUrl: vi.fn(),
    getFooterPresignedUrl: vi.fn(),
    getCompanyFilePresignedUrl: vi.fn(),
    exportCompanies: vi.fn().mockResolvedValue(mockBlob),
    downloadImportTemplate: vi.fn().mockResolvedValue(mockBlob),
    importCompanies: vi.fn(),
  },
}));

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("CompanyListPage", () => {
  it("renders the page", () => {
    render(<CompanyListPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders the Companies header", () => {
    render(<CompanyListPage />);
    expect(screen.getByText("Companies")).toBeInTheDocument();
  });

  it("renders the DataTable with All Companies title", () => {
    render(<CompanyListPage />);
    const table = screen.getByTestId("data-table");
    expect(table).toBeInTheDocument();
    expect(screen.getByText("All Companies")).toBeInTheDocument();
  });

  it("renders export, import, and add action buttons in header", () => {
    render(<CompanyListPage />);
    const headerActions = screen.getByTestId("header-actions");
    expect(headerActions).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-Export")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-Import")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("shows confirmation modal when delete is triggered", () => {
    render(<CompanyListPage />);
    expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
  });

  it("shows import modal when import button is clicked", async () => {
    const user = userEvent.setup();
    render(<CompanyListPage />);
    await user.click(screen.getByTestId("action-btn-Import"));
    expect(screen.getByTestId("import-modal")).toBeInTheDocument();
  });
});

describe("CompanyListPage - export button", () => {
  it("calls exportCompanies when export button is clicked", async () => {
    const { companyService } =
      await import("@/features/master-data/company/data/company.service");
    const exportSpy = vi
      .mocked(companyService.exportCompanies)
      .mockResolvedValue(mockBlob);

    const user = userEvent.setup();
    render(<CompanyListPage />);
    await user.click(screen.getByTestId("action-btn-Export"));
    expect(exportSpy).toHaveBeenCalled();
  });

  it("shows error toast when export fails", async () => {
    const { companyService } =
      await import("@/features/master-data/company/data/company.service");
    vi.mocked(companyService.exportCompanies).mockRejectedValueOnce(
      new Error("Export failed"),
    );

    const { toast } = await import("sonner");

    const user = userEvent.setup();
    render(<CompanyListPage />);
    await user.click(screen.getByTestId("action-btn-Export"));
    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to export data");
    });
  });
});
