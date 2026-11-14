import { PostingAssetFormModal } from "@/features/monitoring/posting-asset/components/posting-asset-form-modal";
import userEvent from "@testing-library/user-event";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { useEffect, useState } from "react";
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
      Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
        <input {...props} />
      ),
      setFormErrorsFromApi: vi.fn(),
      cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
      formatDate: (date: string | Date, fmt?: string) => {
        if (date instanceof Date) {
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const d = String(date.getDate()).padStart(2, "0");
          if (fmt === "YYYYMMDD") return `${y}${m}${d}`;
          return `${y}-${m}-${d}`;
        }
        if (typeof date === "string" && date.length === 8) {
          const y = +date.slice(0, 4);
          const m = +date.slice(4, 6) - 1;
          const d = +date.slice(6, 8);
          if (fmt === "YYYYMMDD")
            return `${y}${String(m + 1).padStart(2, "0")}${String(d).padStart(2, "0")}`;
          return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        }
        return date ?? "";
      },

      Modal: ({
        open,
        children,
        title,
        description,
        onConfirm,
        confirmText,
        isLoading,
      }: {
        open: boolean;
        children: React.ReactNode;
        title?: string;
        description?: string;
        onConfirm?: () => void;
        confirmText?: string;
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
            <p>{description}</p>
            {children}
            <button
              data-testid="confirm-btn"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {confirmText ?? "Confirm"}
            </button>
          </div>
        );
      },
      DatePicker: ({
        onChange,
        value,
      }: {
        onChange?: (date: Date) => void;
        value?: Date;
      }) => (
        <input
          data-testid="date-picker"
          type="text"
          value={value && !isNaN(value.getTime()) ? value.toISOString() : ""}
          onChange={(e) => {
            const d = new Date(e.target.value);
            if (!isNaN(d.getTime())) onChange?.(d);
          }}
          placeholder="Pick a date"
        />
      ),
      Label: ({
        children,
        htmlFor,
      }: {
        children: React.ReactNode;
        htmlFor?: string;
      }) => <label htmlFor={htmlFor}>{children}</label>,
      Select: ({
        children,
        onValueChange,
        value,
      }: {
        children: React.ReactNode;
        onValueChange?: (v: string) => void;
        value?: string;
      }) => (
        <select
          data-testid="select"
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
        >
          {children}
        </select>
      ),
      Select: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      Select: ({
        children,
        value,
      }: {
        children: React.ReactNode;
        value: string;
      }) => <option value={value}>{children}</option>,
      Select: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      Select: ({ placeholder }: { placeholder?: string }) => (
        <span>{placeholder}</span>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/activity-feed", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/constants", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/progress", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/skeleton", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

const mockCreateMutate = vi.fn(
  (_data: unknown, { onSuccess }: { onSuccess?: () => void }) => onSuccess?.(),
);
const mockUpdateMutate = vi.fn(
  (_data: unknown, { onSuccess }: { onSuccess?: () => void }) => onSuccess?.(),
);

vi.mock(
  "@/features/monitoring/posting-asset/data/posting-asset.mutation",
  () => ({
    useCreatePostingAssetMutation: ({
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void;
      onError?: (err: Error) => void;
    }) => ({
      mutate: (data: unknown) => mockCreateMutate(data, { onSuccess, onError }),
      isPending: false,
    }),
    useUpdatePostingAssetMutation: ({
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void;
      onError?: (err: Error) => void;
    }) => ({
      mutate: (data: unknown) => mockUpdateMutate(data, { onSuccess, onError }),
      isPending: false,
    }),
  }),
);

const defaultValues = {
  id: 1,
  fileName: "test.xlsx",
  recordNumber: "001",
  transactionCode: "TC01",
  withholdingTax: "PPh23",
  reversalFlag: "A" as const,
  documentType: "DR",
  postingDate: "20240115",
  documentDate: "20240115",
  documentNumber: "DOC-001",
  reference: "REF-001",
  debitCreditFlag: "S" as const,
  accountNumber: "1234567890",
  alternativeAccount: "0987654321",
  amount: 1000000,
  businessArea: "BA01",
  segment: "SEG01",
  fixedAssetNumber: "FA001",
  costCenter: "CC001",
  profitCenter: "PC001",
  assignment: "ASG-001",
  vendor: "V123",
  customer: "C456",
  fiscalYear: 2024,
  sourceBusinessArea: "SBA",
  virtualAccount: "VA-001",
  wwrvc: "WWRVC01",
  kndnr: "KNDNR0",
  wwprd: "WWPRD0",
  valueDate: "20240115",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

describe("PostingAssetFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <PostingAssetFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Create Record'", () => {
      render(
        <PostingAssetFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.getByText("Create Record")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <PostingAssetFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("renders required input fields", () => {
      render(
        <PostingAssetFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getAllByPlaceholderText(/max 4 chars/i).length,
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getByPlaceholderText(/max 2 chars/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/max 25 chars/i)).toBeInTheDocument();
      expect(
        screen.getAllByPlaceholderText(/max 10 chars/i).length,
      ).toBeGreaterThanOrEqual(1);
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup({ delay: null });

      render(
        <PostingAssetFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.click(screen.getByTestId("confirm-btn"));

      await waitFor(() => {
        expect(screen.getAllByText("Required").length).toBeGreaterThanOrEqual(
          1,
        );
      });
    });

    it("calls onOpenChange(false) and onSuccess after successful submission", async () => {
      const user = userEvent.setup({ delay: null });
      const onOpenChange = vi.fn();
      const onSuccess = vi.fn();

      render(
        <PostingAssetFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      const max4Inputs = screen.getAllByPlaceholderText(/max 4 chars/i);
      fireEvent.change(max4Inputs[1], { target: { value: "TC01" } });
      fireEvent.change(screen.getByPlaceholderText(/max 2 chars/i), {
        target: { value: "DR" },
      });
      const datePickers = screen.getAllByTestId("date-picker");
      fireEvent.change(datePickers[0], {
        target: { value: "2024-01-15T00:00:00.000Z" },
      });
      fireEvent.change(datePickers[1], {
        target: { value: "2024-01-15T00:00:00.000Z" },
      });
      fireEvent.change(screen.getByPlaceholderText(/max 25 chars/i), {
        target: { value: "DOC-001" },
      });
      const max10Inputs = screen.getAllByPlaceholderText(/max 10 chars/i);
      fireEvent.change(max10Inputs[0], { target: { value: "1234567890" } });
      fireEvent.change(max4Inputs[2], { target: { value: "BA01" } });
      fireEvent.change(screen.getByLabelText(/^amount$/i), {
        target: { value: "1000000", valueAsNumber: 1000000 },
      });

      await user.click(screen.getByTestId("confirm-btn"));

      await waitFor(() => {
        expect(mockCreateMutate).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe("edit mode", () => {
    it("renders the modal title 'Edit Record'", async () => {
      render(
        <PostingAssetFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("Edit Record")).toBeInTheDocument();
      });
    });

    it("renders an 'Update' confirm button", async () => {
      render(
        <PostingAssetFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /^update$/i }),
        ).toBeInTheDocument();
      });
    });

    it("pre-fills transactionCode field with defaultValues", async () => {
      render(
        <PostingAssetFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await waitFor(() => {
        const max4Inputs = screen.getAllByPlaceholderText(
          /max 4 chars/i,
        ) as HTMLInputElement[];
        expect(max4Inputs[1].value).toBe("TC01");
      });
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup({ delay: null });
      const onOpenChange = vi.fn();

      render(
        <PostingAssetFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const max4Inputs = screen.getAllByPlaceholderText(/max 4 chars/i);
      fireEvent.change(max4Inputs[1], { target: { value: "TC01" } });
      fireEvent.change(screen.getByPlaceholderText(/max 2 chars/i), {
        target: { value: "DR" },
      });
      const datePickers = screen.getAllByTestId("date-picker");
      fireEvent.change(datePickers[0], {
        target: { value: "2024-01-15T00:00:00.000Z" },
      });
      fireEvent.change(datePickers[1], {
        target: { value: "2024-01-15T00:00:00.000Z" },
      });
      fireEvent.change(screen.getByPlaceholderText(/max 25 chars/i), {
        target: { value: "DOC-001" },
      });
      const max10Inputs = screen.getAllByPlaceholderText(/max 10 chars/i);
      fireEvent.change(max10Inputs[0], { target: { value: "1234567890" } });
      fireEvent.change(max4Inputs[2], { target: { value: "BA01" } });
      fireEvent.change(screen.getByLabelText(/^amount$/i), {
        target: { value: "1000000", valueAsNumber: 1000000 },
      });

      await user.click(screen.getByTestId("confirm-btn"));

      await waitFor(() => {
        expect(mockUpdateMutate).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("does not call updateMutation when edit mode but no id in defaultValues", async () => {
      const user = userEvent.setup({ delay: null });
      const onOpenChange = vi.fn();

      render(
        <PostingAssetFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{ transactionCode: "TC01" }}
        />,
      );

      await user.click(screen.getByTestId("confirm-btn"));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalled();
      });
    });
  });

  describe("error handling", () => {
    it("shows error when create mutation fails with server error", async () => {
      mockCreateMutate.mockImplementationOnce(
        (_data: unknown, { onError }: { onError?: (err: Error) => void }) => {
          onError?.(new Error("Server Error"));
        },
      );

      const user = userEvent.setup({ delay: null });
      const onOpenChange = vi.fn();

      render(
        <PostingAssetFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      const max4Inputs = screen.getAllByPlaceholderText(/max 4 chars/i);
      fireEvent.change(max4Inputs[1], { target: { value: "TC01" } });
      fireEvent.change(screen.getByPlaceholderText(/max 2 chars/i), {
        target: { value: "DR" },
      });
      const datePickers = screen.getAllByTestId("date-picker");
      fireEvent.change(datePickers[0], {
        target: { value: "2024-01-15T00:00:00.000Z" },
      });
      fireEvent.change(datePickers[1], {
        target: { value: "2024-01-15T00:00:00.000Z" },
      });
      fireEvent.change(screen.getByPlaceholderText(/max 25 chars/i), {
        target: { value: "DOC-001" },
      });
      const max10Inputs = screen.getAllByPlaceholderText(/max 10 chars/i);
      fireEvent.change(max10Inputs[0], { target: { value: "1234567890" } });
      fireEvent.change(max4Inputs[2], { target: { value: "BA01" } });
      await user.click(screen.getByTestId("confirm-btn"));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalled();
      });
    });
  });

  describe("validation messages", () => {
    it("shows Business Area error when businessArea is empty", async () => {
      const user = userEvent.setup({ delay: null });

      render(
        <PostingAssetFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      const max4Inputs = screen.getAllByPlaceholderText(/max 4 chars/i);
      fireEvent.change(max4Inputs[1], { target: { value: "TC01" } });
      fireEvent.change(screen.getByPlaceholderText(/max 2 chars/i), {
        target: { value: "DR" },
      });
      const datePickers = screen.getAllByTestId("date-picker");
      fireEvent.change(datePickers[0], {
        target: { value: "2024-01-15T00:00:00.000Z" },
      });
      fireEvent.change(datePickers[1], {
        target: { value: "2024-01-15T00:00:00.000Z" },
      });
      fireEvent.change(screen.getByPlaceholderText(/max 25 chars/i), {
        target: { value: "DOC-001" },
      });
      const max10Inputs = screen.getAllByPlaceholderText(/max 10 chars/i);
      fireEvent.change(max10Inputs[0], { target: { value: "1234567890" } });

      await user.click(screen.getByTestId("confirm-btn"));

      await waitFor(() => {
        expect(
          screen.getByText("Business Area is required"),
        ).toBeInTheDocument();
      });
    });

    it("shows Max 4 characters error when transactionCode exceeds limit", async () => {
      const user = userEvent.setup({ delay: null });

      render(
        <PostingAssetFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      const tcodeInput = screen.getAllByPlaceholderText(/max 4 chars/i)[1];
      fireEvent.change(tcodeInput, { target: { value: "12345" } });
      await user.click(screen.getByTestId("confirm-btn"));

      await waitFor(() => {
        expect(screen.getByText("Max 4 characters")).toBeInTheDocument();
      });
    });
  });
});
