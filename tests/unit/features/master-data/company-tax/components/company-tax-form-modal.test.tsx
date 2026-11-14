import userEvent from "@testing-library/user-event";
import { server } from "@tests/unit/mocks/server";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

const { mockUseMasterDataCompanies, mockUseMasterDataTaxRates } = vi.hoisted(
  () => ({
    mockUseMasterDataCompanies: vi.fn().mockReturnValue({
      data: {
        data: [
          { value: "PT. ABC", label: "PT. ABC", description: "Company ABC" },
          { value: "PT. XYZ", label: "PT. XYZ", description: "Company XYZ" },
        ],
      },
      isLoading: false,
    }),
    mockUseMasterDataTaxRates: vi.fn().mockReturnValue({
      data: {
        data: [
          { value: "1", label: "PPN 11%", description: "PPN 11%" },
          { value: "2", label: "PPN 12%", description: "PPN 12%" },
        ],
      },
      isLoading: false,
    }),
  }),
);

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      useGetCompanyOptions: mockUseMasterDataCompanies,
      useGetTaxRateOptions: mockUseMasterDataTaxRates,
      QuerySelect: ({
        onValueChange,
        placeholder,
        name,
        value,
      }: {
        onValueChange?: (v: unknown) => void;
        placeholder?: string;
        name?: string;
        value?: unknown;
      }) => (
        <div>
          <span data-testid={`select-value-${name}`}>{String(value ?? "")}</span>
          <button
            data-testid={`select-trigger-${name}`}
            type="button"
            onClick={() => {
              if (name === "taxRateId") {
                onValueChange?.(1);
              } else {
                onValueChange?.("PT. ABC");
              }
            }}
          >
            {placeholder ?? "Select"}
          </button>
        </div>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);

import { CompanyTaxFormModal } from "@/features/master-data/company-tax/components/company-tax-form-modal";

describe("CompanyTaxFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <CompanyTaxFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.queryByText("Add Company Tax Assignment"),
      ).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add Company Tax Assignment'", () => {
      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByText("Add Company Tax Assignment"),
      ).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("shows validation errors when submitting empty form", async () => {
      const user = userEvent.setup();

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Company code is required"),
        ).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.getByText("Tax rate is required")).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.getByText("Start date is required")).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup({ delay: null });
      const onOpenChange = vi.fn();

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.click(screen.getByTestId("select-trigger-companyCode"));
      await user.click(screen.getByTestId("select-trigger-taxRateId"));

      const startDateInput = screen.getByLabelText(/start date/i);
      await user.type(startDateInput, "2024-01-01");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("calls onSuccess after successful form submission", async () => {
      const user = userEvent.setup({ delay: null });
      const onSuccess = vi.fn();
      const onOpenChange = vi.fn();

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      await user.click(screen.getByTestId("select-trigger-companyCode"));
      await user.click(screen.getByTestId("select-trigger-taxRateId"));

      const startDateInput = screen.getByLabelText(/start date/i);
      await user.type(startDateInput, "2024-01-01");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("edit mode", () => {
    const defaultValues = {
      id: 1,
      companyCode: "PT. ABC",
      taxRateId: 1,
      glAccount: "2103",
      startDate: "2024-01-01T00:00:00Z",
      endDate: "2024-12-31T00:00:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
      taxRate: {
        id: 1,
        code: "PPN-11",
        name: "PPN 11%",
        description: "PPN 11%",
        taxType: "VAT",
        ratePercent: 11,
        coefficientNumerator: 11,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
        endDate: null,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      },
    };

    it("renders the modal title 'Edit Company Tax Assignment'", () => {
      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(
        screen.getByText("Edit Company Tax Assignment"),
      ).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <CompanyTaxFormModal
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

    it("pre-fills the GL Account field with defaultValues", () => {
      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const glInput = screen.getByPlaceholderText(
        /e\.g\., 2103/i,
      ) as HTMLInputElement;
      expect(glInput.value).toBe("2103");
    });

    it("pre-fills the Start Date field with defaultValues", () => {
      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const startDateInput = screen.getByLabelText(
        /start date/i,
      ) as HTMLInputElement;
      expect(startDateInput.value).toBe("2024-01-01");
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup({ delay: null });
      const onOpenChange = vi.fn();

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const glInput = screen.getByPlaceholderText(/e\.g\., 2103/i);
      await user.clear(glInput);
      await user.type(glInput, "2104");

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("error handling", () => {
    const BASE = "http://localhost:3000";

    it("does not call onOpenChange(false) when create mutation fails with server error", async () => {
      server.use(
        http.post(`${BASE}/master/company-tax`, () =>
          HttpResponse.json({ message: "Duplicate entry" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup({ delay: null });
      const onOpenChange = vi.fn();

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.click(screen.getByTestId("select-trigger-companyCode"));
      await user.click(screen.getByTestId("select-trigger-taxRateId"));

      const startDateInput = screen.getByLabelText(/start date/i);
      await user.type(startDateInput, "2024-01-01");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it("does not call onOpenChange(false) when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/company-tax/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup({ delay: null });
      const onOpenChange = vi.fn();
      const defaultValues = {
        id: 1,
        companyCode: "PT. ABC",
        taxRateId: 1,
        glAccount: "2103",
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-12-31T00:00:00Z",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
        taxRate: {
          id: 1,
          code: "PPN-11",
          name: "PPN 11%",
          description: "PPN 11%",
          taxType: "VAT",
          ratePercent: 11,
          coefficientNumerator: 11,
          coefficientDenominator: 100,
          startDate: "2024-01-01",
          endDate: null,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          createdBy: "admin",
          updatedBy: "admin",
        },
      };

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it("calls onError with setFormErrorsFromApi when mutation returns field errors", async () => {
      server.use(
        http.post(`${BASE}/master/company-tax`, () =>
          HttpResponse.json(
            {
              errors: [
                {
                  field: "companyCode",
                  message: "Company code already exists",
                },
              ],
            },
            { status: 422 },
          ),
        ),
      );

      const user = userEvent.setup({ delay: null });
      const onOpenChange = vi.fn();

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.click(screen.getByTestId("select-trigger-companyCode"));
      await user.click(screen.getByTestId("select-trigger-taxRateId"));

      const startDateInput = screen.getByLabelText(/start date/i);
      await user.type(startDateInput, "2024-01-01");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Company code already exists"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup({ delay: null });
      const onOpenChange = vi.fn();

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={
            {
              companyCode: "PT. ABC",
              taxRateId: 1,
              startDate: "2024-01-01T00:00:00Z",
            } as never
          }
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it("shows validation error for glAccount exceeding max length", async () => {
      const user = userEvent.setup({ delay: null });

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.click(screen.getByTestId("select-trigger-companyCode"));
      await user.click(screen.getByTestId("select-trigger-taxRateId"));

      const startDateInput = screen.getByLabelText(/start date/i);
      await user.type(startDateInput, "2024-01-01");

      const glInput = screen.getByPlaceholderText(
        /e\.g\., 2103/i,
      ) as HTMLInputElement;
      const longValue = "A".repeat(51);
      fireEvent.change(glInput, { target: { value: longValue } });

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/GL account must not exceed 50 characters/i),
        ).toBeInTheDocument();
      });
    });

    it("shows endDate validation error when API returns endDate field error", async () => {
      server.use(
        http.post("http://localhost:3000/master/company-tax", () =>
          HttpResponse.json(
            {
              errors: [
                { field: "endDate", message: "End date must be in the future" },
              ],
            },
            { status: 422 },
          ),
        ),
      );

      const user = userEvent.setup({ delay: null });

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.click(screen.getByTestId("select-trigger-companyCode"));
      await user.click(screen.getByTestId("select-trigger-taxRateId"));

      const startDateInput = screen.getByLabelText(/start date/i);
      await user.type(startDateInput, "2024-01-01");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("End date must be in the future"),
        ).toBeInTheDocument();
      });
    });

    it("handles empty tax rates data from API", async () => {
      mockUseMasterDataTaxRates.mockReturnValueOnce({
        data: { data: [] },
        isLoading: false,
      });

      const user = userEvent.setup({ delay: null });

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.click(screen.getByTestId("select-trigger-companyCode"));
      await user.click(screen.getByTestId("select-trigger-taxRateId"));

      const startDateInput = screen.getByLabelText(/start date/i);
      await user.type(startDateInput, "2024-01-01");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(screen.queryByText("Select tax rate...")).toBeInTheDocument();
      });
    });

    it("handles null tax rates data gracefully", async () => {
      mockUseMasterDataTaxRates.mockReturnValueOnce({
        data: null,
        isLoading: false,
      });

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByTestId("select-trigger-taxRateId"),
      ).toBeInTheDocument();
    });

    it("handles null companies data gracefully", async () => {
      mockUseMasterDataCompanies.mockReturnValueOnce({
        data: null,
        isLoading: false,
      });

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByTestId("select-trigger-companyCode"),
      ).toBeInTheDocument();
    });

    it("renders in edit mode with defaultValues that have no endDate", async () => {
      const user = userEvent.setup({ delay: null });
      const onOpenChange = vi.fn();

      render(
        <CompanyTaxFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={
            {
              id: 1,
              companyCode: "PT. ABC",
              taxRateId: 1,
              glAccount: "2103",
              startDate: "2024-06-15T00:00:00Z",
            } as never
          }
        />,
      );

      const glInput = screen.getByPlaceholderText(
        /e\.g\., 2103/i,
      ) as HTMLInputElement;
      expect(glInput.value).toBe("2103");

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });
});
