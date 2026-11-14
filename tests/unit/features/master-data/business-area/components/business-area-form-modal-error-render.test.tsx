import { BusinessAreaFormModal } from "@/features/master-data/business-area/components/business-area-form-modal";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const errorMessages = {
  branchCode: { message: "Branch code must not exceed 50 characters" },
  email: { message: "Email must be valid" },
  taxEmail: { message: "Tax email must be valid" },
  nitku: { message: "NITKU must not exceed 50 characters" },
  npwp: { message: "NPWP must not exceed 50 characters" },
  clientId: { message: "Client ID must not exceed 100 characters" },
  clientSecret: { message: "Client secret must not exceed 255 characters" },
};

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
    formState: { errors: errorMessages },
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
}));

vi.mock("@/shared/components/input/select", () => ({
  default: () => <div />,
}));
vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  return {
    ...actual,
    Checkbox: () => <input type="checkbox" />,
    setFormErrorsFromApi: vi.fn(),
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

describe("BusinessAreaFormModal error rendering", () => {
  it("renders optional field validation messages", () => {
    render(
      <BusinessAreaFormModal
        open={true}
        onOpenChange={vi.fn()}
        mode="create"
      />,
    );

    expect(
      screen.getByText("Branch code must not exceed 50 characters"),
    ).toBeInTheDocument();
    expect(screen.getByText("Email must be valid")).toBeInTheDocument();
    expect(screen.getByText("Tax email must be valid")).toBeInTheDocument();
    expect(
      screen.getByText("NITKU must not exceed 50 characters"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("NPWP must not exceed 50 characters"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Client ID must not exceed 100 characters"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Client secret must not exceed 255 characters"),
    ).toBeInTheDocument();
  });
});
