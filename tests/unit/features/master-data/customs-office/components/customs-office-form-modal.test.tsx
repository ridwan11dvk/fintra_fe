import { CustomsOfficeFormModal } from "@/features/master-data/customs-office/components/customs-office-form-modal";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { useEffect, useState } from "react";
import { describe, expect, it, vi } from "vitest";

const mockSetFormErrorsFromApi = vi.hoisted(() => vi.fn());

const mockCreateMutation = vi.hoisted(() =>
  vi.fn((_options: unknown) => ({
    mutate: vi.fn(() => {}),
    isPending: false,
  })),
);

const mockUpdateMutation = vi.hoisted(() =>
  vi.fn((_options: unknown) => ({
    mutate: vi.fn(() => {}),
    isPending: false,
  })),
);

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      setFormErrorsFromApi: mockSetFormErrorsFromApi,
      Checkbox: ({
        checked,
        onCheckedChange,
        disabled,
        id,
      }: {
        checked?: boolean;
        onCheckedChange?: (c: boolean) => void;
        disabled?: boolean;
        id?: string;
      }) => (
        <input
          type="checkbox"
          data-testid="checkbox-active"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          disabled={disabled}
          id={id}
        />
      ),

      Modal: ({
        children,
        onConfirm,
        title,
        isLoading,
        open,
      }: {
        children: React.ReactNode;
        onConfirm?: () => void;
        title?: string;
        isLoading?: boolean;
        open?: boolean;
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
  "@/features/master-data/customs-office/data/customs-office.mutation",
  () => ({
    useCreateCustomsOfficeMutation: mockCreateMutation,
    useUpdateCustomsOfficeMutation: mockUpdateMutation,
  }),
);

describe("CustomsOfficeFormModal", () => {
  beforeEach(() => {
    mockSetFormErrorsFromApi.mockClear();
    mockCreateMutation.mockImplementation((options) => ({
      mutate: vi.fn(() => options?.onSuccess?.()),
      isPending: false,
    }));
    mockUpdateMutation.mockImplementation((options) => ({
      mutate: vi.fn(() => options?.onSuccess?.()),
      isPending: false,
    }));
  });

  describe("Create Mode", () => {
    it("renders with Add title", () => {
      render(
        <CustomsOfficeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );
      expect(screen.getByText("Add Customs Office")).toBeInTheDocument();
    });

    it("does not render modal content when closed", () => {
      render(
        <CustomsOfficeFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );
      expect(screen.queryByText("Add Customs Office")).not.toBeInTheDocument();
    });

    it("submits and calls onSuccess after mutation", async () => {
      const onSuccess = vi.fn();

      render(
        <CustomsOfficeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      fireEvent.change(screen.getByLabelText(/code/i), {
        target: { value: "KPPBC-001" },
      });

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: "Test Customs Office" },
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
        <CustomsOfficeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={{ id: 1, code: "KPPBC-001", name: "Test" }}
        />,
      );
      expect(screen.getByText("Edit Customs Office")).toBeInTheDocument();
    });

    it("submits and calls onSuccess after update mutation", async () => {
      const onSuccess = vi.fn();

      render(
        <CustomsOfficeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={{ id: 1, code: "KPPBC-001", name: "Test Office" }}
          onSuccess={onSuccess}
        />,
      );

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: "Updated Office" },
      });

      fireEvent.click(screen.getByTestId("modal-confirm"));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it("does not call update mutation when defaultValues has no id", async () => {
      const mutateSpy = vi.fn();
      mockUpdateMutation.mockImplementation(() => ({
        mutate: mutateSpy,
        isPending: false,
      }));

      render(
        <CustomsOfficeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={{ code: "KPPBC-001", name: "Test" }}
        />,
      );

      fireEvent.click(screen.getByTestId("modal-confirm"));

      await waitFor(() => {
        expect(mutateSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("Loading State", () => {
    it("shows loading state via Modal isLoading", async () => {
      mockCreateMutation.mockImplementation(() => ({
        mutate: vi.fn(),
        isPending: true,
      }));

      render(
        <CustomsOfficeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.getByText("Saving...")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("calls setFormErrorsFromApi when create mutation fails", async () => {
      mockCreateMutation.mockImplementation((options) => ({
        mutate: vi.fn(() => options?.onError?.(new Error("test error"))),
        isPending: false,
      }));

      render(
        <CustomsOfficeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      fireEvent.change(screen.getByLabelText(/code/i), {
        target: { value: "KPPBC-001" },
      });

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: "Test Customs Office" },
      });

      fireEvent.click(screen.getByTestId("modal-confirm"));

      await waitFor(() => {
        expect(mockSetFormErrorsFromApi).toHaveBeenCalled();
      });
    });

    it("calls setFormErrorsFromApi when update mutation fails", async () => {
      mockUpdateMutation.mockImplementation((options) => ({
        mutate: vi.fn(() => options?.onError?.(new Error("test error"))),
        isPending: false,
      }));

      render(
        <CustomsOfficeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={{ id: 1, code: "KPPBC-001", name: "Test Office" }}
        />,
      );

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: "Updated Office" },
      });

      fireEvent.click(screen.getByTestId("modal-confirm"));

      await waitFor(() => {
        expect(mockSetFormErrorsFromApi).toHaveBeenCalled();
      });
    });
  });

  describe("Validation", () => {
    it("displays validation errors when submitting empty form", async () => {
      render(
        <CustomsOfficeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      fireEvent.click(screen.getByTestId("modal-confirm"));

      await waitFor(() => {
        expect(
          screen.getByText("Customs office code is required"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Customs office name is required"),
        ).toBeInTheDocument();
      });
    });
  });
});
