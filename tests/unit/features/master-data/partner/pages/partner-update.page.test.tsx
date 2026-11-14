import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.hoisted(() => vi.fn());
const mockInvalidateQueries = vi.hoisted(() => vi.fn());
const mockGetPartnerById = vi.hoisted(() => vi.fn());
const mockUpdatePartner = vi.hoisted(() => vi.fn());

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "1" }),
  Route: ({ children }: any) => children,
  Routes: ({ children }: any) => children,
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
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
    PARTNER_LIST_PAGE_TITLE: "Partners",
    PARTNER_UPDATE_PAGE_TITLE: "Update Partner",
    PARTNER_UPDATE_PERMISSION: "partner:update",
    PARTNER_URL: "/master-data/partners",
    partnerDetailUrl: (id: number) => `/master-data/partners/${id}`,
    partnerQueryKeys: {
      detail: (id: number) => ["partner", id],
      lists: () => ["partner", "list"],
    },
    useGetPartnerById: (...args: unknown[]) => mockGetPartnerById(...args),
    useUpdatePartnerMutation: ({ onSuccess, onError }: any) => {
      mockUpdatePartner.mockImplementation(({ id, data }: any) => {
        onSuccess?.({ status: "SUCCESS", data: { id } });
      });
      return {
        mutate: mockUpdatePartner,
        isPending: false,
      };
    },
    PartnerForm: ({
      mode,
      onSubmit,
      defaultValues,
      isLoading,
      apiErrors,
    }: any) => (
      <div data-testid="partner-form" data-mode={mode}>
        <span data-testid="default-values">
          {JSON.stringify(defaultValues)}
        </span>
        <button onClick={() => onSubmit({ name: "Updated Partner" })}>
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
      getErrorItems: (error: unknown) => [{ message: (error as Error).message }],
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

import { PartnerUpdatePage } from "@/features/master-data/partner/pages/partner-update.page";

describe("PartnerUpdatePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state when query is loading", () => {
    mockGetPartnerById.mockReturnValue({ isLoading: true });
    render(<PartnerUpdatePage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows error message when query fails", () => {
    mockGetPartnerById.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
    });
    render(<PartnerUpdatePage />);
    expect(screen.getByText("Failed to load partner data")).toBeInTheDocument();
  });

  it("renders PartnerForm with data when query succeeds", () => {
    mockGetPartnerById.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { data: { id: 1, name: "Test Partner" } },
    });
    render(<PartnerUpdatePage />);
    expect(screen.getByTestId("partner-form")).toBeInTheDocument();
    expect(screen.getByTestId("partner-form")).toHaveAttribute(
      "data-mode",
      "edit",
    );
    expect(screen.getByTestId("default-values")).toHaveTextContent(
      JSON.stringify({ id: 1, name: "Test Partner" }),
    );
  });

  it("submits form data and navigates to detail page on success", async () => {
    mockGetPartnerById.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { data: { id: 1, name: "Test Partner" } },
    });
    const user = userEvent.setup();
    render(<PartnerUpdatePage />);
    await user.click(screen.getByText("Submit"));
    expect(mockUpdatePartner).toHaveBeenCalledWith({
      id: 1,
      data: { name: "Updated Partner" },
    });
    expect(mockInvalidateQueries).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenCalledWith("/master-data/partners/1");
  });
});
