import { PartnerTaxes } from "@/features/master-data/partner/components/partner-taxes";
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
  "@/features/master-data/partner/components/partner-tax-form-modal",
  () => ({
    PartnerTaxFormModal: ({
      open,
      mode,
      onOpenChange,
    }: {
      open: boolean;
      mode: string;
      onOpenChange: (v: boolean) => void;
    }) =>
      open ? (
        <div data-testid="tax-form-modal" data-mode={mode}>
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
    useDeletePartnerTaxMutation: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    }),
  };
});

describe("PartnerTaxes", () => {
  it("renders the Taxes card", () => {
    render(<PartnerTaxes partnerId={1} />);
    expect(screen.getByText("Partner Taxes")).toBeInTheDocument();
  });

  it("renders the DataTable", () => {
    render(<PartnerTaxes partnerId={1} />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("renders Add Tax button", () => {
    render(<PartnerTaxes partnerId={1} />);
    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("DataTable has 3 columns configured", () => {
    render(<PartnerTaxes partnerId={1} />);
    expect(screen.getByTestId("columns-count").textContent).toBe("3");
  });

  it("opens create form modal when Add Tax is clicked", async () => {
    const user = userEvent.setup();
    render(<PartnerTaxes partnerId={1} />);

    expect(screen.queryByTestId("tax-form-modal")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("action-btn-add"));
    expect(screen.getByTestId("tax-form-modal")).toBeInTheDocument();
    expect(screen.getByTestId("tax-form-modal")).toHaveAttribute(
      "data-mode",
      "create",
    );
  });

  it("closes the form modal when onOpenChange(false) is called", async () => {
    const user = userEvent.setup();
    render(<PartnerTaxes partnerId={1} />);

    await user.click(screen.getByTestId("action-btn-add"));
    await user.click(screen.getByText("Close"));
    expect(screen.queryByTestId("tax-form-modal")).not.toBeInTheDocument();
  });

  it("does not show confirm modal initially", () => {
    render(<PartnerTaxes partnerId={1} />);
    expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
  });

  it("renders with open=false prop without errors", () => {
    render(<PartnerTaxes partnerId={1} open={false} />);
    expect(screen.getByText("Partner Taxes")).toBeInTheDocument();
  });

  it("renders with open=true prop without errors", () => {
    render(<PartnerTaxes partnerId={1} open={true} />);
    expect(screen.getByText("Partner Taxes")).toBeInTheDocument();
  });

  it("mutation onSuccess closes delete modal", async () => {
    const { useDeletePartnerTaxMutation } =
      await import("@/features/master-data");
    let capturedOnSuccess: (() => void) | undefined;
    vi.mocked(useDeletePartnerTaxMutation).mockImplementationOnce(
      (options: any) => {
        capturedOnSuccess = options?.onSuccess;
        return {
          mutate: vi.fn(),
          isPending: false,
        } as unknown as ReturnType<typeof useDeletePartnerTaxMutation>;
      },
    );

    render(<PartnerTaxes partnerId={1} />);
    capturedOnSuccess?.();

    await waitFor(() => {
      expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
    });
  });
});
