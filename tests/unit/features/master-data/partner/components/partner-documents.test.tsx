import { PartnerDocuments } from "@/features/master-data/partner/components/partner-documents";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import React from "react";
import { describe, expect, it, vi } from "vitest";

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
      ActionButton: ({
        onClick,
        label,
        variant,
      }: {
        onClick?: () => void;
        label?: string;
        variant?: string;
        disabled?: boolean;
        permission?: string | string[];
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {label ?? variant}
        </button>
      ),
      ActionButton: ({
        onClick,
        label,
        variant,
      }: {
        onClick?: () => void;
        label?: string;
        variant?: string;
        disabled?: boolean;
        permission?: string | string[];
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {label ?? variant}
        </button>
      ),
      DataTable: ({ columns }: { columns: unknown[] }) => (
        <div data-testid="data-table">
          <span data-testid="columns-count">{columns?.length}</span>
        </div>
      ),

      Visibility: ({
        children,
      }: {
        children: React.ReactNode;
        permission?: string | string[];
      }) => <>{children}</>,
      ConfirmationModal: ({
        open,
        onConfirm,
        onOpenChange,
      }: {
        open?: boolean;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
      }) =>
        open ? (
          <div data-testid="confirm-modal">
            <button data-testid="confirm-btn" onClick={onConfirm}>
              Confirm
            </button>
            <button
              data-testid="cancel-btn"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </button>
          </div>
        ) : null,
      FilePreview: () => <div data-testid="file-preview" />,
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
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

vi.mock(
  "@/features/master-data/partner/components/partner-document-form-modal",
  () => ({
    PartnerDocumentFormModal: ({
      open,
      mode,
      onOpenChange,
    }: {
      open: boolean;
      mode: string;
      onOpenChange: (v: boolean) => void;
    }) =>
      open ? (
        <div data-testid="document-form-modal" data-mode={mode}>
          <button onClick={() => onOpenChange(false)}>Close</button>
        </div>
      ) : null,
  }),
);

vi.mock("@/features/master-data", async () => {
  const actual = await vi.importActual<typeof import("@/features/master-data")>(
    "@/features/master-data",
  );
  return {
    ...actual,
    useDeletePartnerDocumentMutation: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    }),
  };
});

const mockPartner = {
  id: 1,
  name: "PT. Test",
  partnerCode: "TST-001",
  companyCode: "COMP-001",
  countryId: 1,
  partnerCategoryId: 1,
  partnerTypeId: 1,
  partnerSubTypeId: 1,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

describe("PartnerDocuments", () => {
  it("renders the Documents card", () => {
    render(<PartnerDocuments partner={mockPartner} />);
    expect(screen.getByText("Partner Documents")).toBeInTheDocument();
  });

  it("renders the DataTable", () => {
    render(<PartnerDocuments partner={mockPartner} />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("renders Add Document button", () => {
    render(<PartnerDocuments partner={mockPartner} />);
    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("opens create form modal when Add Document is clicked", async () => {
    const user = userEvent.setup();
    render(<PartnerDocuments partner={mockPartner} />);

    expect(screen.queryByTestId("document-form-modal")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("action-btn-add"));
    expect(screen.getByTestId("document-form-modal")).toBeInTheDocument();
    expect(screen.getByTestId("document-form-modal")).toHaveAttribute(
      "data-mode",
      "create",
    );
  });

  it("closes the form modal when onOpenChange(false) is called", async () => {
    const user = userEvent.setup();
    render(<PartnerDocuments partner={mockPartner} />);

    await user.click(screen.getByTestId("action-btn-add"));
    await user.click(screen.getByText("Close"));
    expect(screen.queryByTestId("document-form-modal")).not.toBeInTheDocument();
  });

  it("does not show confirm modal initially", () => {
    render(<PartnerDocuments partner={mockPartner} />);
    expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
  });

  it("mutation onSuccess closes delete modal", async () => {
    const { useDeletePartnerDocumentMutation } =
      await import("@/features/master-data");
    let capturedOnSuccess: (() => void) | undefined;
    vi.mocked(useDeletePartnerDocumentMutation).mockImplementationOnce(
      (options: any) => {
        capturedOnSuccess = options?.onSuccess;
        return {
          mutate: vi.fn(),
          isPending: false,
        } as unknown as ReturnType<typeof useDeletePartnerDocumentMutation>;
      },
    );

    render(<PartnerDocuments partner={mockPartner} />);
    capturedOnSuccess?.();

    await waitFor(() => {
      expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
    });
  });
});
