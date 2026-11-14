import { BusinessAreaFormModal } from "@/features/master-data/business-area/components/business-area-form-modal";
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
      Checkbox: ({
        id,
        checked,
        onCheckedChange,
        disabled,
      }: {
        id?: string;
        checked?: boolean;
        onCheckedChange?: (value: boolean) => void;
        disabled?: boolean;
      }) => (
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onCheckedChange?.(event.target.checked)}
        />
      ),
      useGetCompanyOptions: () => ({
        data: {
          data: [
            { label: "PT ABC", description: "Company ABC" },
            { label: "PT XYZ", description: "Company XYZ" },
          ],
        },
      }),
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

vi.mock("@/shared/components/modal", () => ({
  default: ({
    open,
    title,
    onConfirm,
    onOpenChange,
    confirmText,
    cancelText,
    children,
  }: {
    open?: boolean;
    title?: string;
    onConfirm?: () => void;
    onOpenChange?: (open: boolean) => void;
    confirmText?: string;
    cancelText?: string;
    children?: React.ReactNode;
  }) =>
    open ? (
      <div>
        <h2>{title}</h2>
        {children}
        <button type="button" onClick={onConfirm}>
          {confirmText}
        </button>
        <button type="button" onClick={() => onOpenChange?.(false)}>
          {cancelText}
        </button>
      </div>
    ) : null,
}));

vi.mock("@/shared/components/input/select", () => ({
  default: ({
    name,
    value,
    onValueChange,
    options = [],
    placeholder,
  }: {
    name: string;
    value?: string;
    onValueChange?: (value: string) => void;
    options?: Array<{ value: string; label: string; description?: string }>;
    placeholder?: string;
  }) => (
    <select
      aria-label={placeholder}
      data-testid={`select-${name}`}
      value={value}
      onChange={(event) => onValueChange?.(event.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("@/features/master-data", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/master-data")>();

  return {
    ...actual,
    useCreateBusinessAreaMutation: (options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }) => ({
      mutate: () => options?.onSuccess?.(),
      isPending: false,
    }),
    useUpdateBusinessAreaMutation: (options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }) => ({
      mutate: () => options?.onSuccess?.(),
      isPending: false,
    }),
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe("BusinessAreaFormModal", () => {
  it("does not render modal content when closed", () => {
    render(
      <BusinessAreaFormModal
        open={false}
        onOpenChange={vi.fn()}
        mode="create"
      />,
    );

    expect(screen.queryByText("Add Business Area")).not.toBeInTheDocument();
  });

  it("renders create mode and validates required fields", async () => {
    const user = userEvent.setup();

    render(
      <BusinessAreaFormModal
        open={true}
        onOpenChange={vi.fn()}
        mode="create"
      />,
    );

    expect(screen.getByText("Add Business Area")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^create$/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^create$/i }));

    await waitFor(() => {
      expect(screen.getByText("Company code is required")).toBeInTheDocument();
      expect(
        screen.getByText("Business area name is required"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Business area code is required"),
      ).toBeInTheDocument();
    });
  });

  it("renders edit mode with prefilled values and updates successfully", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const defaultValues = {
      id: 1,
      companyCode: "PT ABC",
      name: "Business Area Jakarta",
      baCode: "BA-JKT-01",
      branchCode: "BR-001",
      email: "ba.jakarta@ptabc.com",
      taxEmail: "tax.jakarta@ptabc.com",
      nitku: "0012345678",
      npwp: "123456789012345",
      clientId: "CLIENT_001",
      clientSecret: "SECRET_001",
      isActive: true,
    };

    render(
      <BusinessAreaFormModal
        open={true}
        onOpenChange={onOpenChange}
        mode="edit"
        defaultValues={defaultValues}
      />,
    );

    expect(screen.getByText("Edit Business Area")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^update$/i }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("PT ABC")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Business Area Jakarta"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("BA-JKT-01")).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/business area name/i));
    await user.type(
      screen.getByLabelText(/business area name/i),
      "Business Area Jakarta Updated",
    );
    await user.click(screen.getByRole("button", { name: /^update$/i }));

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("does not submit update when edit mode has no id", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const defaultValues = {
      companyCode: "PT ABC",
      name: "Business Area Jakarta",
      baCode: "BA-JKT-01",
      branchCode: "BR-001",
      email: "ba.jakarta@ptabc.com",
      taxEmail: "tax.jakarta@ptabc.com",
      nitku: "0012345678",
      npwp: "123456789012345",
      clientId: "CLIENT_001",
      clientSecret: "SECRET_001",
      isActive: true,
    };

    render(
      <BusinessAreaFormModal
        open={true}
        onOpenChange={onOpenChange}
        mode="edit"
        defaultValues={defaultValues}
      />,
    );

    await user.click(screen.getByRole("button", { name: /^update$/i }));

    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
