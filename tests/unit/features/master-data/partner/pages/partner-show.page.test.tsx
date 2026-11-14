import type { Partner } from "@/features/master-data/partner/data/partner.types";
import {
  PARTNER_BANK_LIST_PERMISSION,
  PARTNER_BUSINESS_FIELD_LIST_PERMISSION,
  PARTNER_CONTACT_LIST_PERMISSION,
  PARTNER_DOCUMENT_LIST_PERMISSION,
  PARTNER_ERP_CODE_LIST_PERMISSION,
  PARTNER_LEGALITY_LIST_PERMISSION,
  PARTNER_ROLE_LIST_PERMISSION,
  PARTNER_TAX_LIST_PERMISSION,
  PARTNER_VA_LIST_PERMISSION,
} from "@/features/master-data";
import { PartnerShowPage } from "@/features/master-data/partner/pages/partner-show.page";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockPartner } = vi.hoisted(() => {
  const mockPartner: Partner = {
    id: 1,
    name: "PT. Test Partner",
    partnerCode: "TST-001",
    partnerClassificationId: 1,
    partnerCategoryId: 2,
    partnerTypeId: 3,
    partnerSubTypeId: null,
    identityNumber: "ID001",
    identityNumberType: "NIK",
    nationality: "Indonesian",
    plans: null,
    companyEmail: "partner@test.com",
    companyPhoneNumber: "021-1234567",
    status: "ACTIVE",
    blacklistReason: null,
    blacklistDocument: null,
    isValidatedByDjp: false,
    integratedToErp: false,
    createdOn: "2024-01-01T00:00:00Z",
    modifiedOn: "2024-01-01T00:00:00Z",
    createdBy: "admin",
    modifiedBy: "admin",
  };
  return { mockPartner };
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
      ActionButton: ({
        onClick,
        label,
      }: {
        variant?: string;
        buttonVariant?: string;
        label?: string;
        showLabel?: boolean;
        onClick?: () => void;
        permission?: string;
      }) => (
        <button data-testid="edit-btn" onClick={onClick}>
          {label}
        </button>
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
      StatusBadge: ({ status }: { status: string }) => (
        <div data-testid={`status-badge-${status}`}>{status}</div>
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
    useGetPartnerById: vi.fn().mockReturnValue({
      isLoading: false,
      isError: false,
      data: { data: mockPartner },
    }),
    PartnerDocuments: ({ partner }: { partner: Partner }) => (
      <div data-testid="partner-documents">{partner.id}</div>
    ),
    PartnerContacts: ({ partnerId }: { partnerId: number }) => (
      <div data-testid="partner-contacts">{partnerId}</div>
    ),
    PartnerTaxProfiles: ({ partnerId }: { partnerId: number }) => (
      <div data-testid="partner-tax-profiles">{partnerId}</div>
    ),
    PartnerTaxes: ({ partnerId }: { partnerId: number }) => (
      <div data-testid="partner-taxes">{partnerId}</div>
    ),
    PartnerBankAccounts: ({ partnerId }: { partnerId: number }) => (
      <div data-testid="partner-bank-accounts">{partnerId}</div>
    ),
    PartnerVirtualAccounts: ({ partnerId }: { partnerId: number }) => (
      <div data-testid="partner-virtual-accounts">{partnerId}</div>
    ),
    PartnerErpCodes: ({ partnerId }: { partnerId: number }) => (
      <div data-testid="partner-erp-codes">{partnerId}</div>
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

describe("PartnerShowPage", () => {
  beforeEach(() => {
    localStorage.setItem(
      "activePermissions",
      JSON.stringify([
        PARTNER_ROLE_LIST_PERMISSION,
        PARTNER_BUSINESS_FIELD_LIST_PERMISSION,
        PARTNER_CONTACT_LIST_PERMISSION,
        PARTNER_LEGALITY_LIST_PERMISSION,
        PARTNER_BANK_LIST_PERMISSION,
        PARTNER_VA_LIST_PERMISSION,
        PARTNER_TAX_LIST_PERMISSION,
        PARTNER_DOCUMENT_LIST_PERMISSION,
        PARTNER_ERP_CODE_LIST_PERMISSION,
      ]),
    );
  });

  it("renders the page", () => {
    render(<PartnerShowPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("renders partner name in heading", () => {
    render(<PartnerShowPage />);
    const headings = screen.getAllByText("PT. Test Partner");
    expect(headings.length).toBeGreaterThan(0);
  });

  it("renders edit button", () => {
    render(<PartnerShowPage />);
    expect(screen.getByTestId("edit-btn")).toBeInTheDocument();
  });

  it("renders status badge for active partner", () => {
    render(<PartnerShowPage />);
    expect(screen.getByTestId("status-badge-active")).toBeInTheDocument();
  });

  it("renders partner code in description", () => {
    render(<PartnerShowPage />);
    expect(screen.getByText("Partner Code: TST-001")).toBeInTheDocument();
  });

  it("renders all sub-entity tab triggers", () => {
    render(<PartnerShowPage />);
    expect(screen.getByRole("tab", { name: "Contacts" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Legality" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Tax Profile" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Bank Accounts" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Virtual Accounts" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Taxes" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Documents" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "ERP Codes" })).toBeInTheDocument();
  });
});

describe("PartnerShowPage - error and loading states", () => {
  it("shows error state when query errors", async () => {
    const { useGetPartnerById } = await import("@/features/master-data");
    vi.mocked(useGetPartnerById).mockReturnValueOnce({
      isLoading: false,
      isError: true,
      data: undefined,
    } as ReturnType<typeof useGetPartnerById>);

    render(<PartnerShowPage />);
    expect(screen.getByText("Failed to load partner data")).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    const { useGetPartnerById } = await import("@/features/master-data");
    vi.mocked(useGetPartnerById).mockReturnValueOnce({
      isLoading: true,
      isError: false,
      data: undefined,
    } as ReturnType<typeof useGetPartnerById>);

    render(<PartnerShowPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });
});
