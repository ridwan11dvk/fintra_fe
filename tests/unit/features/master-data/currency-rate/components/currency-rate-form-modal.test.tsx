import { CurrencyRateFormModal } from "@/features/master-data/currency-rate/components/currency-rate-form-modal";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { useEffect, useState } from "react";
import { describe, expect, it, vi } from "vitest";

const mockSetFormErrorsFromApi = vi.hoisted(() => vi.fn());

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      setFormErrorsFromApi: mockSetFormErrorsFromApi,
      useGetCurrencyOptions: vi.fn(() => ({
        data: {
          data: [
            { label: "USD", value: "USD", description: "US Dollar" },
            { label: "EUR", value: "EUR", description: "Euro" },
          ],
        },
        isLoading: false,
      })),
      Modal: ({
        open,
        children,
        title,
        onConfirm,
        isLoading,
      }: {
        open: boolean;
        children: React.ReactNode;
        title?: string;
        onConfirm?: () => void;
        isLoading?: boolean;
      }) => {
        const [mounted, setMounted] = useState(false);
        useEffect(() => {
          if (open) setMounted(true);
        }, [open]);
        if (!open || !mounted) return null;
        return (
          <div data-testid="modal">
            <h2>{title}</h2>
            <div data-testid="modal-content">{children}</div>
            <button
              data-testid="modal-confirm"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Confirm"}
            </button>
          </div>
        );
      },
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
      }) => (
        <select
          data-testid={
            placeholder?.toLowerCase().includes("currency")
              ? "select-currency"
              : "select-rate-type"
          }
          value={value == null ? "" : String(value)}
          onChange={(e) => onValueChange?.(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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

vi.mock(
  "@/features/master-data/currency-rate/data/currency-rate.mutation",
  () => ({
    useCreateCurrencyRateMutation: vi.fn((options) => ({
      mutate: vi.fn(() => options?.onSuccess?.()),
      isPending: false,
    })),
    useUpdateCurrencyRateMutation: vi.fn((options) => ({
      mutate: vi.fn(() => options?.onSuccess?.()),
      isPending: false,
    })),
  }),
);

describe("CurrencyRateFormModal", () => {
  beforeEach(() => {
    mockSetFormErrorsFromApi.mockClear();
  });

  describe("Create Mode", () => {
    it("renders with Add title", () => {
      render(
        <CurrencyRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );
      expect(screen.getByText("Add Currency Rate")).toBeInTheDocument();
    });

    it("submits and calls onSuccess after mutation", async () => {
      const onSuccess = vi.fn();

      render(
        <CurrencyRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      fireEvent.change(screen.getByTestId("select-currency"), {
        target: { value: "USD" },
      });

      fireEvent.change(screen.getByLabelText(/^rate/i), {
        target: { value: "15500.5" },
      });

      fireEvent.change(screen.getByLabelText(/start date/i), {
        target: { value: "2024-01-01" },
      });

      fireEvent.click(screen.getByTestId("modal-confirm"));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("Edit Mode", () => {
    it("renders with Edit title", () => {
      render(
        <CurrencyRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={{ id: 1, currencyCode: "USD" }}
        />,
      );
      expect(screen.getByText("Edit Currency Rate")).toBeInTheDocument();
    });

    it("submits and calls onSuccess after update mutation", async () => {
      const onSuccess = vi.fn();

      render(
        <CurrencyRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={{ id: 1, currencyCode: "USD", rateType: "KMK" }}
          onSuccess={onSuccess}
        />,
      );

      fireEvent.change(screen.getByLabelText(/^rate/i), {
        target: { value: "15600" },
      });

      fireEvent.change(screen.getByLabelText(/start date/i), {
        target: { value: "2024-06-01" },
      });

      fireEvent.click(screen.getByTestId("modal-confirm"));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("Loading State", () => {
    it("shows loading state via Modal isLoading", async () => {
      const { useCreateCurrencyRateMutation: mockCreate } =
        await import("@/features/master-data/currency-rate/data/currency-rate.mutation");
      vi.mocked(mockCreate).mockReturnValue({
        mutate: vi.fn(),
        isPending: true,
      } as never);

      render(
        <CurrencyRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.getByText("Saving...")).toBeInTheDocument();
    });
  });
});
