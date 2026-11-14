import { PartnerBankAccountFormModal } from "@/features/master-data/partner/components/partner-bank-account-form-modal";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
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
  };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  mode: "create" as const,
  partnerId: 1,
};

describe("PartnerBankAccountFormModal - closed state", () => {
  it("does not render when open=false", () => {
    render(<PartnerBankAccountFormModal {...defaultProps} open={false} />);
    expect(screen.queryByText("Add Bank Account")).not.toBeInTheDocument();
  });
});

describe("PartnerBankAccountFormModal - create mode", () => {
  it("renders the title 'Add Bank Account'", () => {
    render(<PartnerBankAccountFormModal {...defaultProps} />);
    expect(screen.getByText("Add Bank Account")).toBeInTheDocument();
  });

  it("renders the Account Number input", () => {
    render(<PartnerBankAccountFormModal {...defaultProps} />);
    expect(screen.getByLabelText(/account number/i)).toBeInTheDocument();
  });

  it("renders the Account Holder input", () => {
    render(<PartnerBankAccountFormModal {...defaultProps} />);
    expect(screen.getByLabelText(/account holder/i)).toBeInTheDocument();
  });

  it("renders the Bank Center input", () => {
    render(<PartnerBankAccountFormModal {...defaultProps} />);
    expect(screen.getByLabelText(/bank center/i)).toBeInTheDocument();
  });

  it("renders the Bank Branch input", () => {
    render(<PartnerBankAccountFormModal {...defaultProps} />);
    expect(screen.getByLabelText(/bank branch/i)).toBeInTheDocument();
  });

  it("renders the Company input", () => {
    render(<PartnerBankAccountFormModal {...defaultProps} />);
    expect(screen.getByLabelText(/^company$/i)).toBeInTheDocument();
  });

  it("renders the Currency input", () => {
    render(<PartnerBankAccountFormModal {...defaultProps} />);
    expect(screen.getByLabelText(/currency/i)).toBeInTheDocument();
  });

  it("renders the Swift Code input", () => {
    render(<PartnerBankAccountFormModal {...defaultProps} />);
    expect(screen.getByLabelText(/swift code/i)).toBeInTheDocument();
  });

  it("renders the default payment checkbox", () => {
    render(<PartnerBankAccountFormModal {...defaultProps} />);
    expect(
      screen.getByLabelText(/default payment account/i),
    ).toBeInTheDocument();
  });

  it("renders the Active checkbox", () => {
    render(<PartnerBankAccountFormModal {...defaultProps} />);
    expect(
      screen.getByRole("checkbox", { name: /active/i }),
    ).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<PartnerBankAccountFormModal {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Account number is required"),
      ).toBeInTheDocument();
    });
  });

  it("shows holder validation error when only account number is filled", async () => {
    const user = userEvent.setup();
    render(<PartnerBankAccountFormModal {...defaultProps} />);

    await user.type(screen.getByLabelText(/account number/i), "1234567890");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Account holder is required"),
      ).toBeInTheDocument();
    });
  });

  it("calls onOpenChange(false) after successful create", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerBankAccountFormModal
        {...defaultProps}
        onOpenChange={onOpenChange}
      />,
    );

    await user.type(screen.getByLabelText(/account number/i), "1234567890");
    await user.type(screen.getByLabelText(/account holder/i), "PT Test");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("calls onSuccess after successful create", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(
      <PartnerBankAccountFormModal {...defaultProps} onSuccess={onSuccess} />,
    );

    await user.type(screen.getByLabelText(/account number/i), "1234567890");
    await user.type(screen.getByLabelText(/account holder/i), "PT Test");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it("renders the Confirm button for submission", () => {
    render(<PartnerBankAccountFormModal {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /confirm/i }),
    ).toBeInTheDocument();
  });
});

describe("PartnerBankAccountFormModal - edit mode", () => {
  const editValues = {
    id: 1,
    accountNumber: "1234567890",
    holderName: "PT Test",
    bankCenter: "BCA",
    bankBranch: "Jakarta",
    companyCode: "1000",
    currency: "IDR",
    swiftCode: "CENAIDJA",
    isDefaultPayment: true,
    active: true,
  };

  it("renders 'Edit Bank Account' title in edit mode", () => {
    render(
      <PartnerBankAccountFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={editValues}
      />,
    );
    expect(screen.getByText("Edit Bank Account")).toBeInTheDocument();
  });

  it("pre-fills account number in edit mode", () => {
    render(
      <PartnerBankAccountFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={editValues}
      />,
    );
    const input = screen.getByLabelText(/account number/i) as HTMLInputElement;
    expect(input.value).toBe("1234567890");
  });

  it("calls onOpenChange(false) after successful update", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerBankAccountFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={editValues}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("does not call mutate when no id in edit mode", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerBankAccountFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={{
          accountNumber: "1234",
          holderName: "Test",
        }}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
