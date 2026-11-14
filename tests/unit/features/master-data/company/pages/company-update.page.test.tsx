import { CompanyUpdatePage } from "@/features/master-data/company/pages/company-update.page";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockCompany = vi.hoisted(() => ({
  id: 1,
  code: "COMP001",
  name: "PT Mitra Utama",
  address: "Jakarta",
  isActive: true,
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

      PageHeader: ({
        title,
        description,
      }: {
        title: string;
        description?: string;
      }) => (
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      ),
      ProgressLoader: () => <div data-testid="loader">Loading...</div>,
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
    useUpdateCompanyMutation: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    }),
    CompanyForm: ({
      mode,
      onSubmit,
      isLoading,
    }: {
      mode: string;
      onSubmit?: (data: unknown) => void;
      isLoading?: boolean;
    }) => (
      <div data-testid="company-form" data-mode={mode} data-loading={isLoading}>
        <button
          data-testid="submit-form-btn"
          onClick={() =>
            onSubmit?.({ code: "COMP001", name: "Updated", isActive: true })
          }
        >
          Submit
        </button>
      </div>
    ),
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

describe("CompanyUpdatePage", () => {
  it("renders the page", () => {
    render(<CompanyUpdatePage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders the Edit Company header", () => {
    render(<CompanyUpdatePage />);
    expect(screen.getByText("Edit Company")).toBeInTheDocument();
  });

  it("renders the CompanyForm with mode=edit", () => {
    render(<CompanyUpdatePage />);
    const form = screen.getByTestId("company-form");
    expect(form).toHaveAttribute("data-mode", "edit");
  });

  it("submits the update form", async () => {
    const mutate = vi.fn();
    const { useUpdateCompanyMutation } = await import("@/features/master-data");
    vi.mocked(useUpdateCompanyMutation).mockReturnValueOnce({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateCompanyMutation>);

    render(<CompanyUpdatePage />);
    const submitBtn = screen.getByTestId("submit-form-btn");
    submitBtn.click();
    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });
});

describe("CompanyUpdatePage - loading state", () => {
  it("shows loader when data is loading", async () => {
    const { useGetCompanyById } = await import("@/features/master-data");
    vi.mocked(useGetCompanyById).mockReturnValueOnce({
      isLoading: true,
      isError: false,
      data: undefined,
    } as unknown as ReturnType<typeof useGetCompanyById>);

    render(<CompanyUpdatePage />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });
});
