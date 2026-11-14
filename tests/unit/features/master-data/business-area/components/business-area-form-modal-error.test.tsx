import { BusinessAreaFormModal } from "@/features/master-data/business-area/components/business-area-form-modal";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const setErrorMock = vi.hoisted(() => vi.fn());
const setFormErrorsFromApiMock = vi.hoisted(() => vi.fn());
const createMutateMock = vi.hoisted(() => vi.fn());
const updateMutateMock = vi.hoisted(() => vi.fn());

vi.mock("react-hook-form", () => ({
  Controller: ({
    render: renderProp,
  }: {
    render: (args: {
      field: { value: boolean; onChange: (value: boolean) => void };
    }) => React.ReactElement;
  }) => renderProp({ field: { value: true, onChange: vi.fn() } }),
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
    setError: setErrorMock,
    setValue: vi.fn(),
  }),
  useWatch: () => "PT ABC",
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      setFormErrorsFromApi: setFormErrorsFromApiMock,
      Checkbox: () => <input type="checkbox" />,
      useGetCompanyOptions: () => ({
        data: { data: [{ label: "PT ABC", description: "Company ABC" }] },
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
    confirmText,
    cancelText,
    onOpenChange,
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
  default: () => <div />,
}));

const apiError = Object.assign(new Error("Request failed"), {
  response: {
    data: { errors: [{ field: "name", message: "Name already exists" }] },
  },
});

vi.mock(
  "@/features/master-data/business-area/data/business-area.mutation",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/features/master-data/business-area/data/business-area.mutation")
      >();
    return {
      ...actual,
      useCreateBusinessAreaMutation: (options?: {
        onSuccess?: () => void;
        onError?: (error: unknown) => void;
      }) => ({
        mutate: createMutateMock.mockImplementation(() =>
          options?.onError?.(apiError),
        ),
        isPending: false,
      }),
      useUpdateBusinessAreaMutation: (options?: {
        onSuccess?: () => void;
        onError?: (error: unknown) => void;
      }) => ({
        mutate: updateMutateMock.mockImplementation(() =>
          options?.onError?.(apiError),
        ),
        isPending: false,
      }),
    };
  },
);

vi.mock("@/features/master-data", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/master-data")>();
  return { ...actual };
});

describe("BusinessAreaFormModal error handling", () => {
  it("runs create onError and maps API errors", () => {
    createMutateMock.mockClear();
    setFormErrorsFromApiMock.mockClear();

    render(
      <BusinessAreaFormModal
        open={true}
        onOpenChange={vi.fn()}
        mode="create"
      />,
    );

    screen.getByRole("button", { name: /^create$/i }).click();

    expect(createMutateMock).toHaveBeenCalledOnce();
    expect(setFormErrorsFromApiMock).toHaveBeenCalledOnce();
    expect(setFormErrorsFromApiMock).toHaveBeenCalledWith(
      apiError,
      setErrorMock,
    );
  });

  it("runs update onError and maps API errors", () => {
    updateMutateMock.mockClear();
    setFormErrorsFromApiMock.mockClear();

    render(
      <BusinessAreaFormModal
        open={true}
        onOpenChange={vi.fn()}
        mode="edit"
        defaultValues={{
          id: 1,
          companyCode: "PT ABC",
          name: "Business Area Jakarta",
          baCode: "BA-JKT-01",
          isActive: true,
        }}
      />,
    );

    screen.getByRole("button", { name: /^update$/i }).click();

    expect(updateMutateMock).toHaveBeenCalledOnce();
    expect(setFormErrorsFromApiMock).toHaveBeenCalledOnce();
    expect(setFormErrorsFromApiMock).toHaveBeenCalledWith(
      apiError,
      setErrorMock,
    );
  });
});
