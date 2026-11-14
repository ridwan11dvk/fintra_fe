import { PartnerErpCodeFormModal } from "@/features/master-data/partner/components/partner-erp-code-form-modal";
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

    Select: ({
      onValueChange,
      value,
      placeholder,
    }: {
      onValueChange?: (v: string) => void;
      value?: string | null;
      placeholder?: string;
      disabled?: boolean;
      options?: unknown[];
      id?: string;
    }) => (
      <input
        data-testid="select-input"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onValueChange?.(e.target.value)}
      />
    ),
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

describe("PartnerErpCodeFormModal - closed state", () => {
  it("does not render when open=false", () => {
    render(<PartnerErpCodeFormModal {...defaultProps} open={false} />);
    expect(screen.queryByText("Add ERP Code")).not.toBeInTheDocument();
  });
});

describe("PartnerErpCodeFormModal - create mode", () => {
  it("renders the title 'Add ERP Code'", () => {
    render(<PartnerErpCodeFormModal {...defaultProps} />);
    expect(screen.getByText("Add ERP Code")).toBeInTheDocument();
  });

  it("renders the ERP Code input field", () => {
    render(<PartnerErpCodeFormModal {...defaultProps} />);
    expect(screen.getByPlaceholderText(/erp code/i)).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<PartnerErpCodeFormModal {...defaultProps} />);

    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/erp code is required/i),
      ).toBeInTheDocument();
    });
  });

  it("calls onOpenChange(false) after successful submission", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerErpCodeFormModal {...defaultProps} onOpenChange={onOpenChange} />,
    );

    await user.type(screen.getByPlaceholderText(/erp code/i), "ERP-001");
    await user.type(screen.getByLabelText(/start date/i), "2024-01-01");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("calls onSuccess after successful submission", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<PartnerErpCodeFormModal {...defaultProps} onSuccess={onSuccess} />);

    await user.type(screen.getByPlaceholderText(/erp code/i), "ERP-001");
    await user.type(screen.getByLabelText(/start date/i), "2024-01-01");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it("renders the Confirm button for submission", () => {
    render(<PartnerErpCodeFormModal {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /confirm/i }),
    ).toBeInTheDocument();
  });
});

describe("PartnerErpCodeFormModal - edit mode", () => {
  const editDefaultValues = {
    id: 1,
    erpCode: "ERP-EDIT",
    companyCode: null,
    startDate: "2024-01-01",
    isActive: true,
  };

  it("renders the title 'Edit ERP Code'", () => {
    render(
      <PartnerErpCodeFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={editDefaultValues}
      />,
    );
    expect(screen.getByText("Edit ERP Code")).toBeInTheDocument();
  });

  it("pre-fills the erpCode field with default value", () => {
    render(
      <PartnerErpCodeFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={editDefaultValues}
      />,
    );
    const input = screen.getByPlaceholderText(/erp code/i) as HTMLInputElement;
    expect(input.value).toBe("ERP-EDIT");
  });

  it("calls onOpenChange(false) after successful update", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerErpCodeFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={{ ...editDefaultValues, startDate: "2024-01-01" }}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("resets form when modal re-opens", async () => {
    const { rerender } = render(
      <PartnerErpCodeFormModal
        {...defaultProps}
        open={false}
        mode="edit"
        defaultValues={editDefaultValues}
      />,
    );

    rerender(
      <PartnerErpCodeFormModal
        {...defaultProps}
        open={true}
        mode="edit"
        defaultValues={editDefaultValues}
      />,
    );

    const input = screen.getByPlaceholderText(/erp code/i) as HTMLInputElement;
    expect(input.value).toBe("ERP-EDIT");
  });

  it("does not call mutate when no id in edit mode", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerErpCodeFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={{ erpCode: "ERP-NO-ID" }}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    // Without an id, the edit mutation should not be called
    // onOpenChange should NOT be called either
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
