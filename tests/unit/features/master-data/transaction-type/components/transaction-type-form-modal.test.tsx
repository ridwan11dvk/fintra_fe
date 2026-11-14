import { TransactionTypeFormModal } from "@/features/master-data/transaction-type/components/transaction-type-form-modal";
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
      useGetCompanyOptions: vi.fn(() => ({ data: mockCompaniesData })),
      useGetModuleOptions: vi.fn(() => ({ data: mockModulesData })),
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

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

const mockCompaniesData = {
  data: [
    { label: "COMP", description: "Company COMP - Main Company" },
    { label: "SUBS", description: "Company SUBS - Subsidiary" },
  ],
};

const mockModulesData = {
  data: [
    { value: "1", label: "Accounts Receivable" },
    { value: "2", label: "General Ledger" },
  ],
};

async function selectComboboxOption(
  user: ReturnType<typeof userEvent.setup>,
  placeholder: string,
  optionLabel: string,
) {
  const input = screen.getByPlaceholderText(placeholder);
  await user.click(input);

  const options = await screen.findAllByRole("option");
  const target = options.find((opt) => opt.textContent?.includes(optionLabel));
  if (target) {
    fireEvent.click(target);
  }
  return target;
}

describe("TransactionTypeFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <TransactionTypeFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.queryByText("Add Transaction Type"),
      ).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add Transaction Type'", () => {
      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.getByText("Add Transaction Type")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("renders required fields (companyCode, code, name)", () => {
      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.getByPlaceholderText("Select company")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("e.g., SI")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("e.g., Sales Invoice"),
      ).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();
      render(
        <TransactionTypeFormModal
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
      expect(
        screen.getByText("Transaction type code is required"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Transaction type name is required"),
      ).toBeInTheDocument();
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await selectComboboxOption(user, "Select company", "COMP");

      await user.type(screen.getByPlaceholderText("e.g., SI"), "SI");
      await user.type(
        screen.getByPlaceholderText("e.g., Sales Invoice"),
        "Sales Invoice",
      );

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
        <TransactionTypeFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      await selectComboboxOption(user, "Select company", "COMP");

      await user.type(screen.getByPlaceholderText("e.g., SI"), "SI");
      await user.type(
        screen.getByPlaceholderText("e.g., Sales Invoice"),
        "Sales Invoice",
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("edit mode", () => {
    const defaultValues = {
      id: 1,
      companyCode: "COMP",
      code: "SI",
      tcode: "FB70",
      name: "Sales Invoice",
      description: "Sales Invoice transaction type",
      moduleId: 1,
      module: { id: 1, name: "Accounts Receivable" },
      docType: "F5",
      type: "revenue" as const,
      isVatUsed: true,
      isActive: true,
      hasVirtualPenalty: false,
      isRevenueRecorded: true,
      isAutoBilling: false,
      createdAt: "2024-06-01T00:00:00Z",
      updatedAt: "2024-06-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit Transaction Type'", () => {
      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(screen.getByText("Edit Transaction Type")).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <TransactionTypeFormModal
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

    it("pre-fills the name field with defaultValues", async () => {
      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText(
          "e.g., Sales Invoice",
        ) as HTMLInputElement;
        expect(nameInput.value).toBe("Sales Invoice");
      });
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("e.g., Sales Invoice"),
        ).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText("e.g., Sales Invoice");
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Invoice");

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
        http.post(`${BASE}/master/transaction-type`, () =>
          HttpResponse.json({ message: "Duplicate entry" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await selectComboboxOption(user, "Select company", "COMP");

      await user.type(screen.getByPlaceholderText("e.g., SI"), "SI");
      await user.type(
        screen.getByPlaceholderText("e.g., Sales Invoice"),
        "Sales Invoice",
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Add Transaction Type")).toBeInTheDocument();
    });

    it("does not close modal when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/transaction-type/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{
            id: 1,
            name: "Test",
            companyCode: "COMP",
            code: "SI",
            isActive: true,
            createdAt: "2024-06-01T00:00:00Z",
            updatedAt: "2024-06-01T00:00:00Z",
            createdBy: "admin",
            updatedBy: "admin",
          }}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("e.g., Sales Invoice"),
        ).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText("e.g., Sales Invoice");
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Name");

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Edit Transaction Type")).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{
            name: "Test",
            companyCode: "COMP",
            code: "SI",
            isActive: true,
          }}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("shows validation error for description exceeding max length", async () => {
      const user = userEvent.setup();

      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await selectComboboxOption(user, "Select company", "COMP");

      await user.type(screen.getByPlaceholderText("e.g., SI"), "SI");
      await user.type(screen.getByPlaceholderText("e.g., Sales Invoice"), "SI");

      await selectComboboxOption(user, "Select module", "Accounts Receivable");

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Transaction type description"),
        ).toBeInTheDocument();
      });

      const descInput = screen.getByPlaceholderText(
        "Transaction type description",
      );
      fireEvent.change(descInput, { target: { value: "A".repeat(65536) } });

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Description must not exceed 65535 characters/i),
        ).toBeInTheDocument();
      });
    });

    it("toggles isActive checkbox", async () => {
      const user = userEvent.setup();
      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      const checkboxes = screen.getAllByRole("checkbox");
      const activeCheckbox = checkboxes[checkboxes.length - 1];
      expect(activeCheckbox).toHaveAttribute("aria-checked", "true");

      await user.click(activeCheckbox);
      expect(activeCheckbox).toHaveAttribute("aria-checked", "false");

      await user.click(activeCheckbox);
      expect(activeCheckbox).toHaveAttribute("aria-checked", "true");
    });

    it("shows type dropdown when receivable module is selected", async () => {
      const user = userEvent.setup();
      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await selectComboboxOption(user, "Select module", "Accounts Receivable");

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Select type")).toBeInTheDocument();
      });
    });

    it("does not show type dropdown when non-receivable module is selected", async () => {
      const user = userEvent.setup();
      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await selectComboboxOption(user, "Select module", "General Ledger");

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText("Select type"),
        ).not.toBeInTheDocument();
      });
    });

    it("does not show receivable fields when no module is selected", () => {
      render(
        <TransactionTypeFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.queryByPlaceholderText("Transaction type description"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByPlaceholderText("Select type"),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Virtual Penalty")).not.toBeInTheDocument();
    });
  });
});
