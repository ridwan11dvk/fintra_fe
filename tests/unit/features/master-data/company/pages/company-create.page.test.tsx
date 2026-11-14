import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.hoisted(() => vi.fn());
const mockInvalidateQueries = vi.hoisted(() => vi.fn());
const mockCreateMutation = vi.hoisted(() => vi.fn());

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  Route: ({ children }: any) => children,
  Routes: ({ children }: any) => children,
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  useParams: () => ({}),
  useLocation: () => ({ pathname: "/" }),
}));

vi.mock("@tanstack/react-query", () => {
  class QClient {
    invalidateQueries = mockInvalidateQueries;
  }
  return {
    QueryClient: QClient,
    useQueryClient: () => new QClient(),
  };
});

vi.mock("@/features/master-data", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    COMPANY_CREATE_PAGE_TITLE: "Create Company",
    COMPANY_CREATE_PERMISSION: "company:create",
    COMPANY_LIST_PAGE_TITLE: "Companies",
    COMPANY_URL: "/master-data/companies",
    companyCreateUrl: () => "/master-data/companies/create",
    companyQueryKeys: {
      lists: () => ["company", "list"],
    },
    useCreateCompanyMutation: ({ onSuccess }: any) => {
      mockCreateMutation.mockImplementation((_data: any) => {
        onSuccess?.();
      });
      return {
        mutate: mockCreateMutation,
        isPending: false,
      };
    },
    CompanyForm: ({ mode, onSubmit }: any) => (
      <div data-testid="company-form" data-mode={mode}>
        <button onClick={() => onSubmit({ name: "New Company", files: [] })}>
          Submit
        </button>
      </div>
    ),
  };
});

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      Page: ({ children, isLoading, title, permission, breadcrumbs }: any) => (
        <div data-testid="page" data-permission={permission}>
          {isLoading ? <div role="status">Loading...</div> : children}
        </div>
      ),

      PageHeader: ({ title, description }: any) => (
        <div data-testid="page-header">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      ),
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

import { CompanyCreatePage } from "@/features/master-data/company/pages/company-create.page";

describe("CompanyCreatePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders CompanyForm in create mode", () => {
    render(<CompanyCreatePage />);
    const form = screen.getByTestId("company-form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute("data-mode", "create");
  });

  it("submits form data and navigates on success", async () => {
    const user = userEvent.setup();
    render(<CompanyCreatePage />);
    await user.click(screen.getByText("Submit"));
    expect(mockCreateMutation).toHaveBeenCalledWith({
      name: "New Company",
      files: [],
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["company", "list"],
    });
    expect(mockNavigate).toHaveBeenCalledWith("/master-data/companies");
  });
});
