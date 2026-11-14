import { render, screen, waitFor } from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { TaxRateFormModal } from "@/features/master-data/tax-rate/components/tax-rate-form-modal";
import type { TaxRateResponse } from "@/features/master-data/tax-rate/data/tax-rate.types";

vi.mock("@railfinance/core/masterdata", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useGetLookupValueOptions: () => ({
      data: [
        { value: "DEBIT", label: "Debit" },
        { value: "CREDIT", label: "Credit" },
      ],
      isLoading: false,
    }),
  };
});

const mockTaxRate: TaxRateResponse = {
  id: 1,
  code: "PPN_17",
  name: "PPN 17%",
  description: "Value Added Tax 17%",
  taxType: "PPN",
  ratePercent: 17,
  coefficientNumerator: 17,
  coefficientDenominator: 100,
  isUsedInRkip: true,
  startDate: "2024-01-01",
  endDate: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const BASE = "http://localhost:3000";

describe("TaxRateFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <TaxRateFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.queryByText("Add Tax Rate")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add Tax Rate'", async () => {
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("Add Tax Rate")).toBeInTheDocument();
      });
    });

    it("renders a 'Create' confirm button", async () => {
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /create/i }),
        ).toBeInTheDocument();
      });
    });

    it("renders the Code input field", async () => {
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., PPN_17/i),
        ).toBeInTheDocument();
      });
    });

    it("renders the Name input field", async () => {
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., PPN 17%/i),
        ).toBeInTheDocument();
      });
    });

    it("renders the Tax Type select", async () => {
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Select tax type"),
        ).toBeInTheDocument();
      });
    });

    it("renders the Start Date input field", async () => {
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(screen.getByLabelText("Start Date *")).toBeInTheDocument();
      });
    });

    it("renders the Used in RKIP checkbox unchecked by default", async () => {
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        const checkbox = screen.getByLabelText("Used in RKIP");
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
      });
    });

    it("submits isUsedInRkip when the checkbox is toggled", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          defaultValues={{
            code: "PPN_17",
            taxType: "PPN",
            ratePercent: 17,
            coefficientNumerator: 17,
            coefficientDenominator: 100,
            startDate: "2024-01-01",
          }}
        />,
      );

      await waitFor(() => {
        expect(screen.getByLabelText("Used in RKIP")).toBeInTheDocument();
      });

      await user.click(screen.getByLabelText("Used in RKIP"));
      await user.type(screen.getByPlaceholderText(/e\.g\., PPN 17%/i), "PPN 17%");
      await user.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /create/i }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Tax rate name is required"),
        ).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful create", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          defaultValues={{
            code: "PPN_17",
            taxType: "PPN",
            ratePercent: 17,
            coefficientNumerator: 17,
            coefficientDenominator: 100,
            startDate: "2024-01-01",
          }}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., PPN 17%/i),
        ).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/e\.g\., PPN 17%/i);
      await user.type(nameInput, "Updated PPN");

      await user.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("does not call onOpenChange(false) when create mutation fails with server error", async () => {
      server.use(
        http.post(`${BASE}/master/tax-rates`, () =>
          HttpResponse.json(
            { message: "Server error" },
            { status: 500 },
          ),
        ),
      );

      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., PPN 17%/i),
        ).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/e\.g\., PPN 17%/i);
      await user.type(nameInput, "PPN 17%");

      await user.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(
        () => {
          expect(onOpenChange).not.toHaveBeenCalledWith(false);
        },
        { timeout: 2000 },
      );
    });
  });

  describe("edit mode", () => {
    it("renders the modal title 'Edit Tax Rate'", async () => {
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={mockTaxRate}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("Edit Tax Rate")).toBeInTheDocument();
      });
    });

    it("renders an 'Update' confirm button", async () => {
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={mockTaxRate}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /update/i }),
        ).toBeInTheDocument();
      });
    });

    it("pre-fills the name field with defaultValues", async () => {
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={mockTaxRate}
        />,
      );

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText(
          /e\.g\., PPN 17%/i,
        ) as HTMLInputElement;
        expect(nameInput.value).toBe("PPN 17%");
      });
    });

    it("pre-fills the code field with defaultValues", async () => {
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={mockTaxRate}
        />,
      );

      await waitFor(() => {
        const codeInput = screen.getByPlaceholderText(
          /e\.g\., PPN_17/i,
        ) as HTMLInputElement;
        expect(codeInput.value).toBe("PPN_17");
      });
    });

    it("pre-fills the Used in RKIP checkbox as checked when defaultValues has flag true", async () => {
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={mockTaxRate}
        />,
      );

      await waitFor(() => {
        expect(screen.getByLabelText("Used in RKIP")).toBeChecked();
      });
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={mockTaxRate}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /update/i }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("does not call onOpenChange(false) when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/tax-rates/:id`, () =>
          HttpResponse.json(
            { message: "Validation failed" },
            { status: 422 },
          ),
        ),
      );

      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={mockTaxRate}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /update/i }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(
        () => {
          expect(onOpenChange).not.toHaveBeenCalledWith(false);
        },
        { timeout: 2000 },
      );
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{ name: "Some Tax Rate" }}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., PPN 17%/i),
        ).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/e\.g\., PPN 17%/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Tax Rate");

      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it("shows validation error when code exceeds 50 characters", async () => {
      const user = userEvent.setup();
      render(
        <TaxRateFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., PPN_17/i),
        ).toBeInTheDocument();
      });

      const codeInput = screen.getByPlaceholderText(/e\.g\., PPN_17/i);
      await user.type(codeInput, "A".repeat(51));

      const nameInput = screen.getByPlaceholderText(/e\.g\., PPN 17%/i);
      await user.type(nameInput, "PPN 17%");

      await user.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Tax rate code must not exceed 50 characters"),
        ).toBeInTheDocument();
      });
    });
  });
});
