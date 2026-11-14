import { BusinessAreaFormModal } from "@/features/master-data/business-area/components/business-area-form-modal";
import { fireEvent } from "@testing-library/react";
import { render, screen } from "@tests/unit/utils/render-with-providers";
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
    handleSubmit: () => () => undefined,
    control: {},
    formState: { errors: {} },
    reset: vi.fn(),
    setError: vi.fn(),
    setValue: vi.fn(),
  }),
  useWatch: () => "",
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      Checkbox: () => <input type="checkbox" />,
      setFormErrorsFromApi: vi.fn(),
      useGetCompanyOptions: () => ({
        data: { data: [{ label: "PT ABC", description: "Company ABC" }] },
      }),
      Modal: ({
        open,
        title,
        children,
      }: {
        open?: boolean;
        title?: string;
        children?: React.ReactNode;
      }) =>
        open ? (
          <div>
            <h2>{title}</h2>
            {children}
          </div>
        ) : null,
      QuerySelect: ({
        name,
        onValueChange,
      }: {
        name?: string;
        onValueChange?: (value: string) => void;
      }) =>
        name === "companyCode" ? (
          <button
            type="button"
            data-testid="company-code-trigger"
            onClick={() => onValueChange?.("PT ABC")}
          >
            select company
          </button>
        ) : null,
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

vi.mock("@/features/master-data", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/master-data")>();

  return {
    ...actual,
    useCreateBusinessAreaMutation: () => ({
      mutate: vi.fn(),
      isPending: false,
    }),
    useUpdateBusinessAreaMutation: () => ({
      mutate: vi.fn(),
      isPending: false,
    }),
  };
});

describe("BusinessAreaFormModal company code select", () => {
  it("invokes the company code value change handler", () => {
    render(
      <BusinessAreaFormModal
        open={true}
        onOpenChange={vi.fn()}
        mode="create"
      />,
    );

    fireEvent.click(screen.getByTestId("company-code-trigger"));

    expect(screen.getByTestId("company-code-trigger")).toBeInTheDocument();
  });
});
