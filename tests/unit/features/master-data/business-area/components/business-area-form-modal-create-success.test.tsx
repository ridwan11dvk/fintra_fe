import { BusinessAreaFormModal } from "@/features/master-data/business-area/components/business-area-form-modal";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-hook-form", () => ({
  Controller: ({
    render,
  }: {
    render: (args: {
      field: { value: boolean; onChange: (value: boolean) => void };
    }) => React.ReactElement;
  }) => render({ field: { value: true, onChange: vi.fn() } }),
  useForm: () => ({
    register: () => ({}),
    handleSubmit:
      (
        onSubmit: (data: {
          companyCode: string;
          name: string;
          baCode: string;
          branchCode?: string;
          email?: string;
          taxEmail?: string;
          nitku?: string;
          npwp?: string;
          clientId?: string;
          clientSecret?: string;
          isActive: boolean;
        }) => void,
      ) =>
      () =>
        onSubmit({
          companyCode: "PT ABC",
          name: "Business Area Jakarta",
          baCode: "BA-JKT-01",
          isActive: true,
        }),
    control: {},
    formState: { errors: {} },
    reset: vi.fn(),
    setError: vi.fn(),
    setValue: vi.fn(),
  }),
  useWatch: () => "PT ABC",
}));

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
  default: ({ placeholder }: { placeholder?: string }) => (
    <div>{placeholder}</div>
  ),
}));

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  return {
    ...actual,
    Checkbox: () => <input type="checkbox" />,
    useGetCompanyOptions: () => ({
      data: { data: [{ label: "PT ABC", description: "Company ABC" }] },
    }),
  };
});

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

describe("BusinessAreaFormModal create success", () => {
  it("calls onOpenChange(false) and onSuccess after successful create submission", async () => {
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();

    render(
      <BusinessAreaFormModal
        open={true}
        onOpenChange={onOpenChange}
        mode="create"
        onSuccess={onSuccess}
      />,
    );

    expect(screen.getByText("Add Business Area")).toBeInTheDocument();

    screen.getByRole("button", { name: /^create$/i }).click();

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });
});
