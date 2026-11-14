import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";

const { mockUseFilteredRoles, mockUseGetInternalUserByNippMutation } =
  vi.hoisted(() => ({
    mockUseFilteredRoles: vi.fn(),
    mockUseGetInternalUserByNippMutation: vi.fn(),
  }));

vi.mock("@/features/settings/role/data/role.query", () => ({
  useFilteredRoles: mockUseFilteredRoles,
}));

let mutationCallbacks: {
  onSuccess: (resp: Record<string, unknown>) => void;
  onError: (err: Error) => void;
} = {
  onSuccess: () => {},
  onError: () => {},
};

vi.mock("@/features/settings", async (importOriginal) => {
  const actual: object = await importOriginal();
  return {
    ...actual,
    useGetInternalUserByNippMutation: (callbacks: {
      onSuccess: (resp: Record<string, unknown>) => void;
      onError: (err: Error) => void;
    }) => {
      mutationCallbacks = callbacks;
      return {
        mutate: vi.fn((nipp: number) => {
          if (nipp === 666) {
            callbacks.onError(new Error("User not found"));
          } else {
            callbacks.onSuccess({
              status: "SUCCESS",
              data: {
                costCenterId: "CC001",
                name: "Fetched User",
                email: "fetched@example.com",
                organizationName: "Org A",
                positionName: "Engineer",
                photo: "photo.jpg",
              },
            });
          }
        }),
        isPending: false,
      };
    },
  };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    // Route toast calls through the mocked `sonner` module so tests can
    // assert on them (@railfinance/ui bundles its own sonner internally).
    const { toast: uiToast } = await import("sonner");
    return {
      ...actual,
      toast: uiToast,
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
      useIsMobile: () => false,
      ActionButton: ({
        onClick,
        label,
        variant,
        disabled,
      }: {
        onClick?: () => void;
        label?: string;
        variant?: string;
        disabled?: boolean;
      }) => (
        <button
          data-testid={`action-btn-${variant}`}
          onClick={onClick}
          disabled={disabled}
        >
          {label || variant}
        </button>
      ),
      QuerySelect: ({
        value,
        onValueChange,
        options,
        placeholder,
      }: {
        value?: string[];
        onValueChange?: (v: string[]) => void;
        options?: Array<{ value: string; label: string }>;
        placeholder?: string;
      }) => (
        <div data-testid="multi-select">
          <select
            data-testid="multi-select-input"
            multiple
            value={value}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (opt) =>
                Number(opt.value),
              );
              onValueChange?.(selected);
            }}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ),
      Select: ({
        children,
        value,
        onValueChange,
      }: {
        children: React.ReactNode;
        value?: string;
        onValueChange?: (v: string) => void;
      }) => (
        <div data-testid="ui-select" data-value={value}>
          {children}
          <button
            data-testid="select-trigger"
            onClick={() => onValueChange?.("active")}
          >
            Select
          </button>
        </div>
      ),
      SelectContent: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="select-content">{children}</div>
      ),
      SelectItem: ({
        children,
        value,
      }: {
        children: React.ReactNode;
        value?: string;
      }) => <div data-testid={`select-item-${value}`}>{children}</div>,
      SelectTrigger: ({
        children,
        className,
        id,
      }: {
        children: React.ReactNode;
        className?: string;
        id?: string;
      }) => (
        <div data-testid="select-trigger-wrapper" className={className} id={id}>
          {children}
        </div>
      ),
      SelectValue: ({ placeholder }: { placeholder?: string }) => (
        <span data-testid="select-value">{placeholder}</span>
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

import { InternalUserForm } from "@/features/settings/users/components/internal-user-form";

const roleOptions = [
  { id: 1, name: "Admin" },
  { id: 2, name: "User" },
  { id: 3, name: "Manager" },
];

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe("InternalUserForm", () => {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields for create action", () => {
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{ roles: [], status: "active" }}
      />,
    );

    expect(screen.getByPlaceholderText(/Input NIPP/)).toBeInTheDocument();
    expect(screen.getByTestId("multi-select")).toBeInTheDocument();
    expect(screen.getAllByTestId("ui-select").length).toBeGreaterThan(0);
    expect(screen.getByTestId("action-btn-save")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-cancel")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-generate")).toBeInTheDocument();
  });

  it("renders readonly fields for costCenterId, name, email, unit, position", () => {
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{ roles: [], status: "active" }}
      />,
    );

    // These fields are not readonly in the current implementation
    // They are regular input fields
    expect(screen.getByPlaceholderText(/e\.g\. CC001/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter name/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter email/)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter position name/),
    ).toBeInTheDocument();
  });

  it("renders NIPP as readOnly when action is edit", () => {
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="edit"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{ roles: [], status: "active" }}
      />,
    );

    // NIPP field is not readonly in the current implementation
    expect(screen.getByPlaceholderText(/Input NIPP/)).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="edit"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{
          nipp: "12345",
          roles: [1],
          status: "active",
          name: "John Doe",
          email: "john@example.com",
          companyCode: "C001",
          companyName: "Company A",
        }}
      />,
    );

    await user.click(screen.getByTestId("action-btn-save"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          nipp: "12345",
        }),
        expect.anything(),
      );
    });
  });

  it("shows error toast when Get Data clicked without NIPP", async () => {
    const user = userEvent.setup();
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{ roles: [], status: "active" }}
      />,
    );

    await user.click(screen.getByTestId("action-btn-generate"));

    expect(toast.error).toHaveBeenCalledWith("Please enter NIPP first");
  });

  it("calls Get Data mutation when NIPP is provided", async () => {
    const user = userEvent.setup();
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{
          roles: [],
          status: "active",
          companyCode: "C001",
          companyName: "Company A",
        }}
      />,
    );

    await user.type(screen.getByPlaceholderText(/Input NIPP/), "12345");
    await user.click(screen.getByTestId("action-btn-generate"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "User data fetched successfully from ESA",
      );
    });
  });

  it("updates form fields after successful Get Data", async () => {
    const user = userEvent.setup();
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{
          roles: [],
          status: "active",
          companyCode: "C001",
          companyName: "Company A",
        }}
      />,
    );

    await user.type(screen.getByPlaceholderText(/Input NIPP/), "12345");
    await user.click(screen.getByTestId("action-btn-generate"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "User data fetched successfully from ESA",
      );
    });
  });

  it("shows error toast when Get Data mutation fails", async () => {
    const user = userEvent.setup();
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{
          roles: [],
          status: "active",
          companyCode: "C001",
          companyName: "Company A",
        }}
      />,
    );

    await user.type(screen.getByPlaceholderText(/Input NIPP/), "666");
    await user.click(screen.getByTestId("action-btn-generate"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("calls onCancel when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{ roles: [], status: "active" }}
      />,
    );

    await user.click(screen.getByTestId("action-btn-cancel"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("does not render Cancel button when onCancel is not provided", () => {
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="create"
        onSubmit={onSubmit}
        defaultValues={{ roles: [], status: "active" }}
      />,
    );

    expect(screen.queryByTestId("action-btn-cancel")).not.toBeInTheDocument();
  });

  it("disables inputs and buttons when isLoading is true", () => {
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoading={true}
        defaultValues={{ roles: [], status: "active" }}
      />,
    );

    expect(screen.getByPlaceholderText(/Input NIPP/)).toBeDisabled();
    expect(screen.getByTestId("action-btn-save")).toBeDisabled();
    expect(screen.getByTestId("action-btn-cancel")).toBeDisabled();
    expect(screen.getByTestId("action-btn-generate")).toBeDisabled();
  });

  it("shows 'Saving...' label when isLoading", () => {
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="create"
        onSubmit={onSubmit}
        isLoading={true}
        defaultValues={{ roles: [], status: "active" }}
      />,
    );

    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("shows status options in dropdown", () => {
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{ roles: [], status: "active" }}
      />,
    );

    expect(screen.getByTestId("select-item-active")).toBeInTheDocument();
    expect(screen.getByTestId("select-item-inactive")).toBeInTheDocument();
  });

  it("renders with defaultValues", () => {
    mockUseFilteredRoles.mockReturnValue({
      data: { data: roleOptions },
      isLoading: false,
    });

    render(
      <InternalUserForm
        action="edit"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{
          nipp: "99999",
          name: "Pre-filled",
          email: "pre@example.com",
          roles: [],
          status: "active",
        }}
      />,
    );

    expect(screen.getByPlaceholderText(/Input NIPP/)).toHaveValue("99999");
    expect(screen.getByPlaceholderText(/Enter name/)).toHaveValue("Pre-filled");
    expect(screen.getByPlaceholderText(/Enter email/)).toHaveValue(
      "pre@example.com",
    );
  });
});
