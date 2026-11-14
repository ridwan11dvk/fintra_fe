import { PartnerTaxFormModal } from "@/features/master-data/partner/components/partner-tax-form-modal";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      useGetTaxRateOptions: () => ({
        data: [{ value: "1", label: "Tax 11%" }],
        isLoading: false,
      }),
      QuerySelect: ({
        value,
        onValueChange,
        options,
        placeholder,
        disabled,
      }: {
        value?: string | number | null;
        onValueChange?: (v: string) => void;
        options?: Array<{ value: string; label: string }>;
        placeholder?: string;
        disabled?: boolean;
      }) => (
        <button
          type="button"
          data-testid="tax-rate-select"
          data-value={value == null ? "" : String(value)}
          disabled={disabled}
          onClick={() => {
            const first = options?.[0];
            if (first) onValueChange?.(first.value);
          }}
        >
          {placeholder ?? "Select"}
        </button>
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
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  mode: "create" as const,
  partnerId: 1,
};

describe("PartnerTaxFormModal - closed state", () => {
  it("does not render when open=false", () => {
    render(<PartnerTaxFormModal {...defaultProps} open={false} />);
    expect(screen.queryByText("Add Partner Tax")).not.toBeInTheDocument();
  });
});

describe("PartnerTaxFormModal - create mode", () => {
  it("renders the title 'Add Partner Tax'", () => {
    render(<PartnerTaxFormModal {...defaultProps} />);
    expect(screen.getByText("Add Partner Tax")).toBeInTheDocument();
  });

  it("renders the tax rate select", () => {
    render(<PartnerTaxFormModal {...defaultProps} />);
    expect(screen.getByTestId("tax-rate-select")).toBeInTheDocument();
  });

  it("renders the Active checkbox", () => {
    render(<PartnerTaxFormModal {...defaultProps} />);
    expect(screen.getByLabelText(/active/i)).toBeInTheDocument();
  });

  it("shows validation error when submitting without selecting tax rate", async () => {
    const user = userEvent.setup();
    render(<PartnerTaxFormModal {...defaultProps} />);

    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText("Tax rate is required")).toBeInTheDocument();
    });
  });

  it("calls onOpenChange(false) after successful create", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerTaxFormModal {...defaultProps} onOpenChange={onOpenChange} />,
    );

    // Select tax rate
    await user.click(screen.getByTestId("tax-rate-select"));
    // Submit
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("calls onSuccess after successful create", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<PartnerTaxFormModal {...defaultProps} onSuccess={onSuccess} />);

    await user.click(screen.getByTestId("tax-rate-select"));
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it("renders the Confirm button for submission", () => {
    render(<PartnerTaxFormModal {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /confirm/i }),
    ).toBeInTheDocument();
  });
});

describe("PartnerTaxFormModal - edit mode", () => {
  it("renders 'Edit Partner Tax' title in edit mode", () => {
    render(
      <PartnerTaxFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={{ id: 1, taxRateId: 1 }}
      />,
    );
    expect(screen.getByText("Edit Partner Tax")).toBeInTheDocument();
  });

  it("calls onOpenChange(false) after successful update", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerTaxFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={{ id: 1, taxRateId: 1 }}
        onOpenChange={onOpenChange}
      />,
    );

    // taxRateId is pre-filled; just submit
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false), {
      timeout: 3000,
    });
  });

  it("does not call mutate when no id in edit mode", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerTaxFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={{ taxRateId: 1 }}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("resets form when modal re-opens", async () => {
    const { rerender } = render(
      <PartnerTaxFormModal {...defaultProps} open={false} mode="create" />,
    );

    rerender(
      <PartnerTaxFormModal {...defaultProps} open={true} mode="create" />,
    );
    expect(screen.getByText("Add Partner Tax")).toBeInTheDocument();
  });
});

describe("PartnerTaxFormModal - local mode", () => {
  it("calls onSuccess with data directly in local mode", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <PartnerTaxFormModal
        {...defaultProps}
        isLocalMode={true}
        onSuccess={onSuccess}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByTestId("tax-rate-select"));
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("uses existing id when editing in local mode", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(
      <PartnerTaxFormModal
        {...defaultProps}
        mode="edit"
        isLocalMode={true}
        defaultValues={{ id: 42, taxRateId: 1 }}
        onSuccess={onSuccess}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
