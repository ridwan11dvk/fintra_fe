import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: () => (data: any) => ({ values: data, errors: {} }),
}));

const mockUseFilteredRoles = vi.hoisted(() =>
  vi.fn(() => ({
    data: {
      data: [
        { id: 1, name: "Admin", description: "Administrator" },
        { id: 2, name: "User", description: "Regular user" },
      ],
    },
    isLoading: false,
  })),
);

vi.mock("@/features/settings", () => ({
  externalUserSchema: { _type: "ZodSchema" } as any,
  twoFactorOptions: [
    { value: true, label: "Enabled" },
    { value: false, label: "Disabled" },
  ],
  useFilteredRoles: mockUseFilteredRoles,
  USER_CREATE_PERMISSION: "user:create",
  USER_UPDATE_PERMISSION: "user:update",
  userTypeOptions: [
    { value: "internal", label: "Internal" },
    { value: "external", label: "External" },
  ],
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      ActionButton: ({
        onClick,
        label,
        disabled,
        type,
        permission,
        variant,
      }: any) => (
        <button
          onClick={onClick}
          disabled={disabled}
          type={type}
          data-permission={permission}
          data-variant={variant}
        >
          {label || variant}
        </button>
      ),
      Card: ({ children }: any) => <div data-testid="card">{children}</div>,
      CardContent: ({ children }: any) => <div>{children}</div>,
      cn: (...classes: (string | undefined | null | false)[]) =>
        classes.filter(Boolean).join(" "),
      DatePicker: ({ value, onChange, placeholder, disabled }: any) => (
        <input
          data-testid="date-picker"
          placeholder={placeholder}
          disabled={disabled}
          value={value ? value.toISOString() : ""}
          onChange={(e) => onChange(new Date(e.target.value))}
        />
      ),
      Label: ({ children, htmlFor, className }: any) => (
        <label htmlFor={htmlFor} className={className}>
          {children}
        </label>
      ),
      Select: ({ children, value, onValueChange }: any) => (
        <select
          data-testid="ui-select"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
        >
          {children}
        </select>
      ),
      SelectTrigger: ({ children, className, id }: any) => (
        <div data-testid="select-trigger" className={className} id={id}>
          {children}
        </div>
      ),
      SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
      SelectContent: ({ children }: any) => <>{children}</>,
      SelectItem: ({ children, value }: any) => (
        <option value={value}>{children}</option>
      ),
      QuerySelect: ({ placeholder, disabled, multiple }: any) => (
        <div data-testid="combobox" data-multiple={multiple}>
          {placeholder}
        </div>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/image", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/multiple-badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/accordion", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/avatar", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

import { ExternalUserForm } from "@/features/settings/users/components/external-user-form";

describe("ExternalUserForm", () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form with create mode", () => {
    render(
      <ExternalUserForm
        action="create"
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />,
    );
    expect(screen.getByText("Account Information")).toBeInTheDocument();
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Identity Information")).toBeInTheDocument();
    expect(screen.getByText("Organization Information")).toBeInTheDocument();
    expect(
      screen.getByText("Responsible Person Information"),
    ).toBeInTheDocument();
  });

  it("renders password field in create mode", () => {
    render(<ExternalUserForm action="create" onSubmit={mockSubmit} />);
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("does not render password field in edit mode", () => {
    render(<ExternalUserForm action="edit" onSubmit={mockSubmit} />);
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });

  it("renders cancel button when onCancel is provided", () => {
    render(
      <ExternalUserForm
        action="create"
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />,
    );
    expect(screen.getByText("cancel")).toBeInTheDocument();
  });

  it("does not render cancel button when onCancel is not provided", () => {
    render(<ExternalUserForm action="create" onSubmit={mockSubmit} />);
    expect(screen.queryByText("cancel")).not.toBeInTheDocument();
  });

  it("shows 'Saving...' when isLoading is true", () => {
    render(
      <ExternalUserForm
        action="create"
        onSubmit={mockSubmit}
        isLoading={true}
      />,
    );
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ExternalUserForm
        action="create"
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />,
    );
    await user.click(screen.getByText("cancel"));
    expect(mockCancel).toHaveBeenCalled();
  });

  it("renders ui select components", () => {
    render(<ExternalUserForm action="create" onSubmit={mockSubmit} />);
    const selects = screen.getAllByTestId("ui-select");
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });

  it("renders combobox components for multi-select", () => {
    render(<ExternalUserForm action="create" onSubmit={mockSubmit} />);
    const comboboxes = screen.getAllByTestId("combobox");
    expect(comboboxes.length).toBeGreaterThan(0);
  });

  it("renders with default values when provided", () => {
    render(
      <ExternalUserForm
        action="edit"
        onSubmit={mockSubmit}
        defaultValues={{ name: "John Doe", username: "johndoe" }}
      />,
    );
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("johndoe")).toBeInTheDocument();
  });

  it("disables all inputs when isLoading is true", () => {
    render(
      <ExternalUserForm
        action="create"
        onSubmit={mockSubmit}
        isLoading={true}
      />,
    );
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("renders date picker fields", () => {
    render(<ExternalUserForm action="create" onSubmit={mockSubmit} />);
    const datePickers = screen.getAllByTestId("date-picker");
    expect(datePickers.length).toBeGreaterThanOrEqual(2);
  });

  it("renders all section headings", () => {
    render(
      <ExternalUserForm
        action="create"
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />,
    );
    expect(screen.getByText("Account Information")).toBeInTheDocument();
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Identity Information")).toBeInTheDocument();
    expect(screen.getByText("Organization Information")).toBeInTheDocument();
    expect(
      screen.getByText("Responsible Person Information"),
    ).toBeInTheDocument();
  });

  it("renders email input", () => {
    render(<ExternalUserForm action="create" onSubmit={mockSubmit} />);
    expect(
      screen.getByPlaceholderText("Enter email address"),
    ).toBeInTheDocument();
  });
});
