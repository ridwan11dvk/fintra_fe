import { PartnerContactFormModal } from "@/features/master-data/partner/components/partner-contact-form-modal";
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

describe("PartnerContactFormModal - closed state", () => {
  it("does not render when open=false", () => {
    render(<PartnerContactFormModal {...defaultProps} open={false} />);
    expect(screen.queryByText("Add Contact")).not.toBeInTheDocument();
  });
});

describe("PartnerContactFormModal - create mode", () => {
  it("renders the title 'Add Contact'", () => {
    render(<PartnerContactFormModal {...defaultProps} />);
    expect(screen.getByText("Add Contact")).toBeInTheDocument();
  });

  it("renders the Name input", () => {
    render(<PartnerContactFormModal {...defaultProps} />);
    expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument();
  });

  it("renders the Position input", () => {
    render(<PartnerContactFormModal {...defaultProps} />);
    expect(
      screen.getByPlaceholderText(/purchasing manager/i),
    ).toBeInTheDocument();
  });

  it("renders the Department field", () => {
    render(<PartnerContactFormModal {...defaultProps} />);
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
  });

  it("renders the Phone Number input", () => {
    render(<PartnerContactFormModal {...defaultProps} />);
    expect(screen.getByPlaceholderText(/081234567890/i)).toBeInTheDocument();
  });

  it("renders the Email input", () => {
    render(<PartnerContactFormModal {...defaultProps} />);
    expect(
      screen.getByPlaceholderText(/john\.doe@company\.com/i),
    ).toBeInTheDocument();
  });

  it("renders the Preferred Communication Channel input", () => {
    render(<PartnerContactFormModal {...defaultProps} />);
    expect(screen.getByPlaceholderText(/email, whatsapp/i)).toBeInTheDocument();
  });

  it("renders the Confirm button", () => {
    render(<PartnerContactFormModal {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /confirm/i }),
    ).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<PartnerContactFormModal {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /confirm/i }));
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("calls onOpenChange(false) after successful create", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerContactFormModal {...defaultProps} onOpenChange={onOpenChange} />,
    );
    await user.type(screen.getByPlaceholderText(/john doe/i), "Jane Doe");
    await user.click(screen.getByRole("button", { name: /confirm/i }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("calls onSuccess after successful create", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<PartnerContactFormModal {...defaultProps} onSuccess={onSuccess} />);
    await user.type(screen.getByPlaceholderText(/john doe/i), "Jane Doe");
    await user.click(screen.getByRole("button", { name: /confirm/i }));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it("does not close on invalid submission (empty name)", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerContactFormModal {...defaultProps} onOpenChange={onOpenChange} />,
    );
    await user.click(screen.getByRole("button", { name: /confirm/i }));
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe("PartnerContactFormModal - edit mode", () => {
  const editValues = {
    id: 1,
    name: "Contact Edit",
    position: "Manager",
    department: "Sales",
    phoneNumber: "021-9876543",
    email: "jane@test.com",
    preferredCommChannel: "EMAIL",
  };

  it("renders 'Edit Contact' title in edit mode", () => {
    render(
      <PartnerContactFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={editValues}
      />,
    );
    expect(screen.getByText("Edit Contact")).toBeInTheDocument();
  });

  it("pre-fills name in edit mode", () => {
    render(
      <PartnerContactFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={editValues}
      />,
    );
    const input = screen.getByPlaceholderText(/john doe/i) as HTMLInputElement;
    expect(input.value).toBe("Contact Edit");
  });

  it("calls onOpenChange(false) after successful update", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerContactFormModal
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
      <PartnerContactFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={{ name: "No ID Contact" }}
        onOpenChange={onOpenChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: /confirm/i }));
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
