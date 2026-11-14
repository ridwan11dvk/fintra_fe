import type { ClosePaymentResponse } from "@/features/treasury";
import { ClosePaymentFormModal } from "@/features/treasury/close-payment/components/close-payment-form-modal";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockMutate = vi.fn(
  (
    _data: unknown,
    options?: { onSuccess?: () => void; onError?: (err: Error) => void },
  ) => options?.onSuccess?.(),
);

vi.mock(
  "@/features/treasury/close-payment/data/close-payment.mutation",
  () => ({
    useUpdateClosePaymentMutation: ({
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void;
      onError?: (err: Error) => void;
    }) => ({
      mutate: (data: unknown) => mockMutate(data, { onSuccess, onError }),
      isPending: false,
    }),
  }),
);

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
        <input {...props} />
      ),
      setFormErrorsFromApi: vi.fn(),
      Modal: ({
        open,
        children,
        title,
        onConfirm,
        confirmText,
        isLoading,
      }: {
        open: boolean;
        children: React.ReactNode;
        title?: string;
        onConfirm?: () => void;
        confirmText?: string;
        isLoading?: boolean;
      }) =>
        open ? (
          <div data-testid="modal">
            <h2 data-testid="modal-title">{title}</h2>
            {children}
            <button
              data-testid="confirm-btn"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {confirmText ?? "Confirm"}
            </button>
          </div>
        ) : null,
      Label: ({
        children,
        htmlFor,
      }: {
        children: React.ReactNode;
        htmlFor?: string;
      }) => <label htmlFor={htmlFor}>{children}</label>,
      FileUploadInput: ({
        id,
        label,
        error,
        onChange,
        onBlur,
      }: {
        id?: string;
        label?: string;
        error?: string;
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onBlur?: () => void;
      }) => (
        <div data-testid="file-upload-input">
          <label>{label}</label>
          <input
            id={id}
            type="file"
            data-testid="file-input"
            onChange={onChange}
            onBlur={onBlur}
          />
          {error && <span data-testid="file-upload-error">{error}</span>}
        </div>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/skeleton", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

const defaultValues: Partial<ClosePaymentResponse> = {
  id: 1,
  transId: "TRANS-001",
  paymentDate: "2025-01-15T10:00",
  bankCode: "BNI",
  invoiceNumber: "INV-001",
  ppfNumber: "PPF-001",
  bankRuleId: 1,
};

describe("ClosePaymentFormModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal with title 'Edit Close Payment' when open", () => {
    render(
      <ClosePaymentFormModal
        open={true}
        onOpenChange={vi.fn()}
        defaultValues={defaultValues}
      />,
    );

    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Edit Close Payment",
    );
  });

  it("renders 'Update' confirm button", () => {
    render(
      <ClosePaymentFormModal
        open={true}
        onOpenChange={vi.fn()}
        defaultValues={defaultValues}
      />,
    );

    expect(
      screen.getByRole("button", { name: /^update$/i }),
    ).toBeInTheDocument();
  });

  it("does not render modal when closed", () => {
    render(
      <ClosePaymentFormModal
        open={false}
        onOpenChange={vi.fn()}
        defaultValues={defaultValues}
      />,
    );

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("renders file upload input", () => {
    render(
      <ClosePaymentFormModal
        open={true}
        onOpenChange={vi.fn()}
        defaultValues={defaultValues}
      />,
    );

    expect(screen.getByTestId("file-upload-input")).toBeInTheDocument();
    expect(screen.getByText("Upload Transfer Receipt")).toBeInTheDocument();
  });

  it("pre-fills transId field with defaultValues", async () => {
    render(
      <ClosePaymentFormModal
        open={true}
        onOpenChange={vi.fn()}
        defaultValues={defaultValues}
      />,
    );

    await waitFor(() => {
      const transIdInput = screen.getByPlaceholderText(
        /enter transaction id/i,
      ) as HTMLInputElement;
      expect(transIdInput.value).toBe("TRANS-001");
    });
  });

  it("pre-fills bankCode field with defaultValues", async () => {
    render(
      <ClosePaymentFormModal
        open={true}
        onOpenChange={vi.fn()}
        defaultValues={defaultValues}
      />,
    );

    await waitFor(() => {
      const bankCodeInput = screen.getByPlaceholderText(
        /enter bank code/i,
      ) as HTMLInputElement;
      expect(bankCodeInput.value).toBe("BNI");
    });
  });

  it("pre-fills invoiceNumber field with defaultValues", async () => {
    render(
      <ClosePaymentFormModal
        open={true}
        onOpenChange={vi.fn()}
        defaultValues={defaultValues}
      />,
    );

    await waitFor(() => {
      const invoiceInput = screen.getByPlaceholderText(
        /enter invoice number/i,
      ) as HTMLInputElement;
      expect(invoiceInput.value).toBe("INV-001");
    });
  });

  it("pre-fills ppfNumber field with defaultValues", async () => {
    render(
      <ClosePaymentFormModal
        open={true}
        onOpenChange={vi.fn()}
        defaultValues={defaultValues}
      />,
    );

    await waitFor(() => {
      const ppfInput = screen.getByPlaceholderText(
        /enter ppf number/i,
      ) as HTMLInputElement;
      expect(ppfInput.value).toBe("PPF-001");
    });
  });

  it("calls mutate, closes modal, and calls onSuccess on successful submission", async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();

    render(
      <ClosePaymentFormModal
        open={true}
        onOpenChange={onOpenChange}
        defaultValues={defaultValues}
        onSuccess={onSuccess}
      />,
    );

    await user.click(screen.getByTestId("confirm-btn"));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it("passes correct id and data to mutation", async () => {
    const user = userEvent.setup({ delay: null });
    let capturedData: unknown;

    mockMutate.mockImplementationOnce(
      (
        payload: unknown,
        options?: { onSuccess?: () => void; onError?: (err: Error) => void },
      ) => {
        capturedData = payload;
        options?.onSuccess?.();
      },
    );

    render(
      <ClosePaymentFormModal
        open={true}
        onOpenChange={vi.fn()}
        defaultValues={defaultValues}
      />,
    );

    await user.click(screen.getByTestId("confirm-btn"));

    await waitFor(() => {
      expect(capturedData).toEqual({
        id: 1,
        data: {
          transId: "TRANS-001",
          paymentDate: "2025-01-15T10:00",
          bankCode: "BNI",
          invoiceNumber: "INV-001",
          ppfNumber: "PPF-001",
          bankRuleId: 1,
          transferReceiptFile: undefined,
        },
      });
    });
  });

  it("does not call updateMutation when defaultValues has no id", async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();

    render(
      <ClosePaymentFormModal
        open={true}
        onOpenChange={onOpenChange}
        defaultValues={{ transId: "TRANS-001" }}
      />,
    );

    await user.click(screen.getByTestId("confirm-btn"));

    expect(mockMutate).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("shows validation error for empty required fields", async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <ClosePaymentFormModal
        open={true}
        onOpenChange={vi.fn()}
        defaultValues={{}}
      />,
    );

    await user.click(screen.getByTestId("confirm-btn"));

    await waitFor(() => {
      expect(
        screen.getByText("Transaction ID is required"),
      ).toBeInTheDocument();
    });
    expect(screen.getByText("Payment date is required")).toBeInTheDocument();
    expect(screen.getByText("Bank code is required")).toBeInTheDocument();
    expect(screen.getByText("Invoice number is required")).toBeInTheDocument();
    expect(screen.getByText("PPF number is required")).toBeInTheDocument();
  });
});
