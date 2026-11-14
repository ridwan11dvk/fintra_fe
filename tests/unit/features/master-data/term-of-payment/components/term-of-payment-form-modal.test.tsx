import userEvent from "@testing-library/user-event";
import { mockQuerySelect } from "@tests/unit/mocks/select-mocks";
import { server } from "@tests/unit/mocks/server";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
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

      QuerySelect: mockQuerySelect("mock-select"),
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

import { TermOfPaymentFormModal } from "@/features/master-data/term-of-payment/components/term-of-payment-form-modal";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe("TermOfPaymentFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <TermOfPaymentFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.queryByText("Add Payment Term")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add Payment Term'", () => {
      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.getByText("Add Payment Term")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("renders the Code input field", () => {
      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByPlaceholderText(/e\.g\., NET_30/i),
      ).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(screen.getByText("Code is required")).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.type(screen.getByPlaceholderText(/e\.g\., NET_30/i), "NET_30");
      await user.type(screen.getByPlaceholderText(/e\.g\., Net 30/i), "Net 30");
      const daysInput = document.getElementById(
        "numberOfDays",
      ) as HTMLInputElement;
      await user.clear(daysInput);
      await user.type(daysInput, "30");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("calls onSuccess after successful form submission", async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      const onOpenChange = vi.fn();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      await user.type(screen.getByPlaceholderText(/e\.g\., NET_30/i), "NET_30");
      await user.type(screen.getByPlaceholderText(/e\.g\., Net 30/i), "Net 30");
      const daysInput = document.getElementById(
        "numberOfDays",
      ) as HTMLInputElement;
      await user.clear(daysInput);
      await user.type(daysInput, "30");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("edit mode", () => {
    const defaultValues = {
      id: 1,
      code: "NET_30",
      name: "Net 30",
      description: "Payment due within 30 days",
      numberOfDays: 30,
      calculationType: "CALENDAR_DAYS",
      discount: null,
      discountType: null,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit Payment Term'", () => {
      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(screen.getByText("Edit Payment Term")).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <TermOfPaymentFormModal
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

    it("pre-fills the code field with defaultValues", () => {
      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const codeInput = screen.getByPlaceholderText(
        /e\.g\., NET_30/i,
      ) as HTMLInputElement;
      expect(codeInput.value).toBe("NET_30");
    });

    it("pre-fills the name field with defaultValues", () => {
      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(
        /e\.g\., Net 30/i,
      ) as HTMLInputElement;
      expect(nameInput.value).toBe("Net 30");
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(/e\.g\., Net 30/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Net 30 Updated");

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("error handling", () => {
    const BASE = "http://localhost:3000";

    it("does not close modal when create mutation fails with server error", async () => {
      server.use(
        http.post(`${BASE}/master/term-of-payment`, () =>
          HttpResponse.json({ message: "Duplicate code" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.type(screen.getByPlaceholderText(/e\.g\., NET_30/i), "NET_30");
      await user.type(screen.getByPlaceholderText(/e\.g\., Net 30/i), "Net 30");
      const daysInputErr = document.getElementById(
        "numberOfDays",
      ) as HTMLInputElement;
      await user.clear(daysInputErr);
      await user.type(daysInputErr, "30");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Add Payment Term")).toBeInTheDocument();
    });

    it("shows field error from API for calculationType", async () => {
      server.use(
        http.post(`${BASE}/master/term-of-payment`, () =>
          HttpResponse.json(
            {
              message: "Validation failed",
              errors: [
                {
                  field: "calculationType",
                  message: "Calculation type is invalid",
                },
              ],
            },
            { status: 422 },
          ),
        ),
      );

      const user = userEvent.setup();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.type(
        screen.getByPlaceholderText(/e\.g\., NET_30/i),
        "NET_API_ERR",
      );
      await user.type(
        screen.getByPlaceholderText(/e\.g\., Net 30/i),
        "Net API Error",
      );
      const ndInput = document.getElementById(
        "numberOfDays",
      ) as HTMLInputElement;
      await user.clear(ndInput);
      await user.type(ndInput, "30");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Calculation type is invalid"),
        ).toBeInTheDocument();
      });
    });

    it("shows field error from API for discountType", async () => {
      server.use(
        http.post(`${BASE}/master/term-of-payment`, () =>
          HttpResponse.json(
            {
              message: "Validation failed",
              errors: [
                {
                  field: "discountType",
                  message: "Discount type is invalid",
                },
              ],
            },
            { status: 422 },
          ),
        ),
      );

      const user = userEvent.setup();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.type(
        screen.getByPlaceholderText(/e\.g\., NET_30/i),
        "NET_DT_ERR",
      );
      await user.type(
        screen.getByPlaceholderText(/e\.g\., Net 30/i),
        "Net Discount Type Err",
      );
      const ndInput2 = document.getElementById(
        "numberOfDays",
      ) as HTMLInputElement;
      await user.clear(ndInput2);
      await user.type(ndInput2, "30");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Discount type is invalid"),
        ).toBeInTheDocument();
      });
    });

    it("does not close modal when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/term-of-payment/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const defaultValues = {
        id: 1,
        code: "NET_30",
        name: "Net 30",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        discount: null,
        discountType: null,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      };

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(/e\.g\., Net 30/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Term");

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Edit Payment Term")).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{
            name: "Net 30",
            code: "NET_30",
            isActive: true,
          }}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it("shows validation errors for required fields", async () => {
      const user = userEvent.setup();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.type(
        screen.getByPlaceholderText(/e\.g\., NET_30/i),
        "TEST_CODE",
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(screen.getByText("Name is required")).toBeInTheDocument();
      });
    });

    it("selects calculation type and submits successfully", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.type(screen.getByPlaceholderText(/e\.g\., NET_30/i), "NW_15");
      await user.type(
        screen.getByPlaceholderText(/e\.g\., Net 30/i),
        "Net 15 Working",
      );
      const daysInput2 = document.getElementById(
        "numberOfDays",
      ) as HTMLInputElement;
      await user.clear(daysInput2);
      await user.type(daysInput2, "15");

      const calcSelect = screen.getAllByTestId("mock-select");
      fireEvent.change(calcSelect[0], {
        target: { value: "WORKING_DAYS" },
      });

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("toggles isActive checkbox", async () => {
      const user = userEvent.setup();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      const isActiveCheckbox = screen.getByLabelText(
        "Active",
      ) as HTMLInputElement;
      expect(isActiveCheckbox.checked).toBe(true);

      await user.click(isActiveCheckbox);
      expect(isActiveCheckbox.checked).toBe(false);

      await user.click(isActiveCheckbox);
      expect(isActiveCheckbox.checked).toBe(true);
    });

    it("fills discount type select and discount amount", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.type(
        screen.getByPlaceholderText(/e\.g\., NET_30/i),
        "NET_30_DISC",
      );
      await user.type(
        screen.getByPlaceholderText(/e\.g\., Net 30/i),
        "Net 30 with Discount",
      );
      const daysInput3 = document.getElementById(
        "numberOfDays",
      ) as HTMLInputElement;
      await user.clear(daysInput3);
      await user.type(daysInput3, "30");

      const discountSelect = screen.getAllByTestId("mock-select");
      fireEvent.change(discountSelect[1], {
        target: { value: "PERCENTAGE" },
      });

      const discountInput = document.getElementById(
        "discount",
      ) as HTMLInputElement;
      await user.clear(discountInput);
      await user.type(discountInput, "10");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("submits form with zero discount via fireEvent", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.type(
        screen.getByPlaceholderText(/e\.g\., NET_30/i),
        "NET_ZERO",
      );
      await user.type(
        screen.getByPlaceholderText(/e\.g\., Net 30/i),
        "Net Zero Discount",
      );
      const daysInput = document.getElementById(
        "numberOfDays",
      ) as HTMLInputElement;
      await user.clear(daysInput);
      await user.type(daysInput, "30");

      const discountInput = document.getElementById(
        "discount",
      ) as HTMLInputElement;
      await user.clear(discountInput);
      fireEvent.change(discountInput, { target: { value: "0" } });

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("shows validation error for empty calculationType", async () => {
      const user = userEvent.setup();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.type(
        screen.getByPlaceholderText(/e\.g\., NET_30/i),
        "TEST_CALC",
      );
      await user.type(
        screen.getByPlaceholderText(/e\.g\., Net 30/i),
        "Test Calc",
      );
      const ndInput = document.getElementById(
        "numberOfDays",
      ) as HTMLInputElement;
      await user.clear(ndInput);
      await user.type(ndInput, "30");
      const calcSelect = screen.getAllByTestId("mock-select");
      fireEvent.change(calcSelect[0], {
        target: { value: "" },
      });

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Calculation type is required"),
        ).toBeInTheDocument();
      });
    });

    it("shows error for negative discount amount", async () => {
      const user = userEvent.setup();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.type(screen.getByPlaceholderText(/e\.g\., NET_30/i), "TEST");
      await user.type(
        screen.getByPlaceholderText(/e\.g\., Net 30/i),
        "Test Name",
      );
      const daysInput4 = document.getElementById(
        "numberOfDays",
      ) as HTMLInputElement;
      await user.clear(daysInput4);
      await user.type(daysInput4, "30");

      const discountInput = document.getElementById(
        "discount",
      ) as HTMLInputElement;
      await user.clear(discountInput);
      await user.type(discountInput, "-5");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Discount must be 0 or greater"),
        ).toBeInTheDocument();
      });
    });

    it("shows error for negative numberOfDays", async () => {
      const user = userEvent.setup();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.type(screen.getByPlaceholderText(/e\.g\., NET_30/i), "TEST");
      await user.type(
        screen.getByPlaceholderText(/e\.g\., Net 30/i),
        "Test Name",
      );
      const ndInput = document.getElementById(
        "numberOfDays",
      ) as HTMLInputElement;
      await user.clear(ndInput);
      await user.type(ndInput, "-1");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Number of days must be 0 or greater"),
        ).toBeInTheDocument();
      });
    });

    it("shows error for description exceeding max length", async () => {
      const user = userEvent.setup();

      render(
        <TermOfPaymentFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.type(screen.getByPlaceholderText(/e\.g\., NET_30/i), "TEST");
      await user.type(
        screen.getByPlaceholderText(/e\.g\., Net 30/i),
        "Test Name",
      );
      const descInput = screen.getByPlaceholderText(
        /payment term description/i,
      ) as HTMLInputElement;
      fireEvent.change(descInput, {
        target: { value: "x".repeat(1001) },
      });

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Description must not exceed 1000 characters"),
        ).toBeInTheDocument();
      });
    });
  });
});
