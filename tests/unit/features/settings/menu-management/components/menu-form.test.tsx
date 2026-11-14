import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MenuForm } from "@/features/settings/menu-management/components/menu-form";
import type { NavigationMenuItem } from "@/features/settings/menu-management/data/menu-management.types";

vi.mock("@railfinance/core/masterdata", () => ({
  useGetAllModules: () => ({
    data: { data: [{ id: 5, name: "Core Module" }] },
    isLoading: false,
  }),
  useGetAllFeatures: () => ({
    data: { data: [{ id: 10, name: "Dashboard Feature" }] },
    isLoading: false,
  }),
}));

vi.mock("@railfinance/core/components/input", () => ({
  QuerySelect: ({
    id,
    value,
    onValueChange,
    options,
    placeholder,
    disabled,
  }: {
    id?: string;
    value?: string;
    onValueChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
    disabled?: boolean;
  }) => (
    <select
      id={id}
      data-testid={id}
      aria-label={id}
      value={value ?? ""}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
    >
      <option value="">{placeholder ?? "Select"}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("@railfinance/core/ui/button", () => ({
  Button: ({ children, onClick, type, disabled, variant }: any) => (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

vi.mock("@railfinance/core/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock("@railfinance/core/ui/label", () => ({
  Label: ({ children, htmlFor }: any) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

vi.mock("@railfinance/core/ui/select", () => ({
  Select: ({ children, onValueChange, value }: any) => (
    <div data-select-value={value} data-onchange={!!onValueChange}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-value={value}>{children}</div>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <button type="button" className={className}>
      {children}
    </button>
  ),
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}));

vi.mock("@railfinance/core/ui/switch", () => ({
  Switch: ({
    id,
    checked,
    onCheckedChange,
  }: {
    id?: string;
    checked?: boolean;
    onCheckedChange: (checked: boolean) => void;
  }) => (
    <input
      id={id}
      type="checkbox"
      role="switch"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  ),
}));

const menus: NavigationMenuItem[] = [
  {
    id: 99,
    code: "PARENT",
    title: "Parent Menu",
    url: "/parent",
    type: "GROUP",
    category: "USER_MENU",
    sortOrder: 0,
    openInNewTab: false,
  },
];

describe("MenuForm", () => {
  it("renders form fields and actions", () => {
    render(
      <MenuForm
        menus={menus}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        isSubmitting={false}
      />,
    );

    expect(screen.getByLabelText(/^Code$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Title$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^URL$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sort Order/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Open in New Tab/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^save$/i })).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <MenuForm menus={menus} onSubmit={vi.fn()} onCancel={onCancel} />,
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("submits transformed values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <MenuForm menus={menus} onSubmit={onSubmit} onCancel={vi.fn()} />,
    );

    await user.clear(screen.getByLabelText(/^Code$/i));
    await user.type(screen.getByLabelText(/^Code$/i), "NEW_CODE");
    await user.clear(screen.getByLabelText(/^Title$/i));
    await user.type(screen.getByLabelText(/^Title$/i), "New Title");
    await user.clear(screen.getByLabelText(/^URL$/i));
    await user.type(screen.getByLabelText(/^URL$/i), "/new-url");

    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted).toMatchObject({
      code: "NEW_CODE",
      title: "New Title",
      url: "/new-url",
      type: "MENU",
      category: "USER_MENU",
      openInNewTab: false,
    });
  });

  it("prefills initial values in edit mode", () => {
    render(
      <MenuForm
        menus={menus}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        initialValues={{
          id: 1,
          code: "EXISTING",
          title: "Existing Menu",
          titleEn: "Existing EN",
          url: "/existing",
          icon: "Home",
          type: "SUBMENU",
          category: "GUEST_HEADER",
          sortOrder: 7,
          openInNewTab: true,
          badge: "Hot",
          parentId: 99,
          featureId: 10,
          moduleId: 5,
        }}
      />,
    );

    expect(screen.getByLabelText(/^Code$/i)).toHaveValue("EXISTING");
    expect(screen.getByLabelText(/^Title$/i)).toHaveValue("Existing Menu");
    expect(screen.getByLabelText(/Title \(EN\)/i)).toHaveValue("Existing EN");
    expect(screen.getByLabelText(/^URL$/i)).toHaveValue("/existing");
    expect(screen.getByLabelText(/Icon \(Lucide\)/i)).toHaveValue("Home");
    expect(screen.getByLabelText(/^Badge$/i)).toHaveValue("Hot");
    expect(screen.getByLabelText(/Sort Order/i)).toHaveValue(7);
    expect(screen.getByLabelText(/Open in New Tab/i)).toBeChecked();
    expect(screen.getByTestId("parentId")).toHaveValue("99");
    expect(screen.getByTestId("featureId")).toHaveValue("10");
    expect(screen.getByTestId("moduleId")).toHaveValue("5");
  });

  it("disables save button when submitting", () => {
    render(
      <MenuForm
        menus={menus}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        isSubmitting
      />,
    );

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });

  it("shows validation errors for required fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <MenuForm menus={menus} onSubmit={onSubmit} onCancel={vi.fn()} />,
    );

    await user.clear(screen.getByLabelText(/^Code$/i));
    await user.clear(screen.getByLabelText(/^Title$/i));
    await user.clear(screen.getByLabelText(/^URL$/i));
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(screen.getByText("Code is required")).toBeInTheDocument();
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("URL is required")).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
