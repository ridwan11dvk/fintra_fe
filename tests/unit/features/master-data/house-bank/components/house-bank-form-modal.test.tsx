import { HouseBankFormModal } from "@/features/master-data/house-bank/components/house-bank-form-modal";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/unit/mocks/server";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
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
      useGetBankOptions: () => ({
        data: {
          data: [
            { value: "BCA", label: "BCA", description: "Bank Central Asia" },
          ],
        },
        isLoading: false,
      }),
      useGetCompanyOptions: () => ({
        data: {
          data: [{ value: "FINTRA", label: "FINTRA", description: "PT Fintra" }],
        },
        isLoading: false,
      }),
      useGetCurrencyOptions: () => ({
        data: {
          data: [
            { value: "IDR", label: "IDR", description: "Indonesian Rupiah" },
          ],
        },
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
        options?: Array<{
          value: string;
          label: string;
          description?: string | null;
        }>;
        placeholder?: string;
        disabled?: boolean;
      }) => {
        const selected = options?.find((o) => o.value === value);
        return (
          <button
            type="button"
            data-testid="query-select"
            disabled={disabled}
            onClick={() => {
              const first = options?.[0];
              if (first) onValueChange?.(first.value);
            }}
          >
            {selected ? selected.label : placeholder}
          </button>
        );
      },
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
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe("HouseBankFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <HouseBankFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.queryByText("Add House Bank")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add House Bank'", () => {
      render(
        <HouseBankFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByText("Add House Bank")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <HouseBankFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();

      render(
        <HouseBankFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(screen.getByText("Bank is required")).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <HouseBankFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.click(screen.getByText("Select a bank"));
      await user.click(screen.getByText("Select company..."));
      await user.click(screen.getByText("Select currency..."));
      await user.type(screen.getByPlaceholderText("HB-BCA-001"), "HB-AC-001");
      await user.type(screen.getByPlaceholderText("1234567890"), "9876543210");
      await user.type(
        screen.getByPlaceholderText("PT Fintra - BCA Operasional"),
        "PT Fintra - BCA",
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("calls onSuccess after successful form submission", async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();

      render(
        <HouseBankFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      await user.click(screen.getByText("Select a bank"));
      await user.click(screen.getByText("Select company..."));
      await user.click(screen.getByText("Select currency..."));
      await user.type(screen.getByPlaceholderText("HB-BCA-001"), "HB-AC-001");
      await user.type(screen.getByPlaceholderText("1234567890"), "9876543210");
      await user.type(
        screen.getByPlaceholderText("PT Fintra - BCA Operasional"),
        "PT Fintra - BCA",
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("edit mode", () => {
    const defaultValues = {
      id: 1,
      accountId: "HB-BCA-001",
      accountNumber: "1234567890",
      accountName: "PT Fintra - BCA Operasional",
      companyCode: "FINTRA",
      currencyCode: "IDR",
      erpCode: "ERP-BCA1",
      bankCode: "BCA",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit House Bank'", () => {
      render(
        <HouseBankFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(screen.getByText("Edit House Bank")).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <HouseBankFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(
        screen.getByRole("button", { name: /^update$/i }),
      ).toBeInTheDocument();
    });

    it("pre-fills the accountId field with defaultValues", () => {
      render(
        <HouseBankFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const input = screen.getByPlaceholderText(
        "HB-BCA-001",
      ) as HTMLInputElement;
      expect(input.value).toBe("HB-BCA-001");
    });

    it("pre-fills the accountName field with defaultValues", () => {
      render(
        <HouseBankFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const input = screen.getByPlaceholderText(
        "PT Fintra - BCA Operasional",
      ) as HTMLInputElement;
      expect(input.value).toBe("PT Fintra - BCA Operasional");
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <HouseBankFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(
        "PT Fintra - BCA Operasional",
      );
      await user.clear(nameInput);
      await user.type(nameInput, "PT Fintra - BCA Updated");

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("error handling", () => {
    const BASE = "http://localhost:3000";

    it("does not close modal when create mutation fails with server error", async () => {
      server.use(
        http.post(`${BASE}/master/house-bank`, () =>
          HttpResponse.json({ message: "Duplicate data" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <HouseBankFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.click(screen.getByText("Select a bank"));
      await user.click(screen.getByText("Select company..."));
      await user.click(screen.getByText("Select currency..."));
      await user.type(screen.getByPlaceholderText("HB-BCA-001"), "HB-AC-001");
      await user.type(screen.getByPlaceholderText("1234567890"), "9876543210");
      await user.type(
        screen.getByPlaceholderText("PT Fintra - BCA Operasional"),
        "PT Fintra - BCA",
      );
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Add House Bank")).toBeInTheDocument();
    });

    it("does not close modal when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/house-bank/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const defaultValues = {
        id: 1,
        accountId: "HB-BCA-001",
        accountNumber: "1234567890",
        accountName: "PT Fintra - BCA Operasional",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        bankCode: "BCA",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      };

      render(
        <HouseBankFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(
        "PT Fintra - BCA Operasional",
      );
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Name");
      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Edit House Bank")).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <HouseBankFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{ accountName: "Test Account" } as never}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });
  });
});
