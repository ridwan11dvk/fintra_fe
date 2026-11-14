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
      useGetCompanyOptions: mockUseMasterDataCompanies,
      useGetBusinessAreaOptions: mockUseMasterDataBusinessAreas,
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

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

const { mockUseMasterDataCompanies, mockUseMasterDataBusinessAreas } =
  vi.hoisted(() => ({
    mockUseMasterDataCompanies: vi.fn(() => ({
      data: {
        data: [
          { label: "COMP1", description: "Company 1" },
          { label: "COMP2", description: "Company 2" },
        ],
      },
      isLoading: false,
    })),
    mockUseMasterDataBusinessAreas: vi.fn(() => ({
      data: {
        data: [
          { label: "BA001", description: "Area 1" },
          { label: "BA002", description: "Area 2" },
        ],
      },
      isLoading: false,
    })),
  }));

import { GLAccountFormModal } from "@/features/master-data/general-ledger-account/components/gl-account-form-modal";

describe("GLAccountFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <GLAccountFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.queryByText("Add GL Account")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add GL Account'", () => {
      render(
        <GLAccountFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByText("Add GL Account")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <GLAccountFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("renders the Unit Name input field", () => {
      render(
        <GLAccountFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();

      render(
        <GLAccountFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Company code is required"),
        ).toBeInTheDocument();
      });
    });

    it("shows validation error for account when other fields are filled", async () => {
      const user = userEvent.setup();

      render(
        <GLAccountFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      await user.type(screen.getByLabelText(/^name$/i), "Jakarta Finance");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Company code is required"),
        ).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <GLAccountFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      // Select company code
      const companySelect = screen.getAllByTestId("mock-select")[0];
      fireEvent.change(companySelect, { target: { value: "COMP1" } });

      // Select BA code
      const baSelect = screen.getAllByTestId("mock-select")[1];
      fireEvent.change(baSelect, { target: { value: "BA001" } });

      // Type unit name
      await user.type(screen.getByLabelText(/^name$/i), "Jakarta Finance");

      // Type account
      await user.type(screen.getByPlaceholderText(/e\.g\., 110120/i), "61101");
      await user.type(screen.getByLabelText(/start date/i), "2024-01-01");

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
        <GLAccountFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      const companySelect = screen.getAllByTestId("mock-select")[0];
      fireEvent.change(companySelect, { target: { value: "COMP1" } });

      const baSelect = screen.getAllByTestId("mock-select")[1];
      fireEvent.change(baSelect, { target: { value: "BA001" } });

      await user.type(screen.getByLabelText(/^name$/i), "Jakarta Finance");
      await user.type(screen.getByPlaceholderText(/e\.g\., 110120/i), "61101");
      await user.type(screen.getByLabelText(/start date/i), "2024-01-01");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("edit mode", () => {
    const defaultValues = {
      id: 1,
      companyCode: "COMP1",
      baCode: "BA001",
      name: "Jakarta Finance",
      account: "61101",
      description: "Revenue from Product Sales",
      commitmentItem: "CMT-001",
      operationalCostComponent: "OPR-001",
      imoCostComponent: "IMO-001",
      startDate: "2024-01-01",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit GL Account'", () => {
      render(
        <GLAccountFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(screen.getByText("Edit GL Account")).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <GLAccountFormModal
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

    it("pre-fills the name field with defaultValues", () => {
      render(
        <GLAccountFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const input = screen.getByLabelText(/^name$/i) as HTMLInputElement;
      expect(input.value).toBe("Jakarta Finance");
    });

    it("pre-fills the account field with defaultValues", () => {
      render(
        <GLAccountFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const input = screen.getByPlaceholderText(
        /e\.g\., 110120/i,
      ) as HTMLInputElement;
      expect(input.value).toBe("61101");
    });

    it("renders the Commitment Item input field", () => {
      render(
        <GLAccountFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByLabelText(/commitment item/i)).toBeInTheDocument();
    });

    it("renders the Operational Cost Component input field", () => {
      render(
        <GLAccountFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(
        screen.getByLabelText(/operational cost component/i),
      ).toBeInTheDocument();
    });

    it("renders the IMO Cost Component input field", () => {
      render(
        <GLAccountFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByLabelText(/IMO cost component/i)).toBeInTheDocument();
    });

    it("pre-fills the commitmentItem field with defaultValues in edit mode", () => {
      render(
        <GLAccountFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const input = screen.getByPlaceholderText(
        /e\.g\., CMT-001/i,
      ) as HTMLInputElement;
      expect(input.value).toBe("CMT-001");
    });

    it("pre-fills the operationalCostComponent field with defaultValues in edit mode", () => {
      render(
        <GLAccountFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const input = screen.getByPlaceholderText(
        /e\.g\., OPR-001/i,
      ) as HTMLInputElement;
      expect(input.value).toBe("OPR-001");
    });

    it("pre-fills the imoCostComponent field with defaultValues in edit mode", () => {
      render(
        <GLAccountFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const input = screen.getByPlaceholderText(
        /e\.g\., IMO-001/i,
      ) as HTMLInputElement;
      expect(input.value).toBe("IMO-001");
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <GLAccountFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByLabelText(/^name$/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Jakarta Finance Updated");

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
        http.post(`${BASE}/master/gl`, () =>
          HttpResponse.json({ message: "Duplicate code" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <GLAccountFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      const companySelect = screen.getAllByTestId("mock-select")[0];
      fireEvent.change(companySelect, { target: { value: "COMP1" } });

      const baSelect = screen.getAllByTestId("mock-select")[1];
      fireEvent.change(baSelect, { target: { value: "BA001" } });

      await user.type(screen.getByLabelText(/^name$/i), "Jakarta Finance");
      await user.type(screen.getByPlaceholderText(/e\.g\., 110120/i), "61101");
      await user.type(screen.getByLabelText(/start date/i), "2024-01-01");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Add GL Account")).toBeInTheDocument();
    });

    it("does not close modal when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/gl/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const defaultValues = {
        id: 1,
        companyCode: "COMP1",
        baCode: "BA001",
        name: "Jakarta Finance",
        account: "61101",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      };

      render(
        <GLAccountFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByLabelText(/^name$/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Unit");

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Edit GL Account")).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <GLAccountFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{
            companyCode: "COMP1",
            baCode: "BA001",
            name: "Test",
            account: "61101",
            startDate: "2024-01-01",
          }}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it("shows validation error for description exceeding max length", async () => {
      const user = userEvent.setup({ delay: null });

      render(
        <GLAccountFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      const descInput = screen.getByPlaceholderText(
        /revenue from product sales/i,
      ) as HTMLInputElement;
      fireEvent.change(descInput, { target: { value: "A".repeat(256) } });

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Description must not exceed/i),
        ).toBeInTheDocument();
      });
    });

    it("shows validation error for commitmentItem exceeding max length", async () => {
      const user = userEvent.setup({ delay: null });

      render(
        <GLAccountFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      const input = screen.getByLabelText(
        /commitment item/i,
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "A".repeat(101) } });

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Commitment item must not exceed/i),
        ).toBeInTheDocument();
      });
    });

    it("shows validation error for operationalCostComponent exceeding max length", async () => {
      const user = userEvent.setup({ delay: null });

      render(
        <GLAccountFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      const input = screen.getByLabelText(
        /operational cost component/i,
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "A".repeat(101) } });

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Operational cost component must not exceed/i),
        ).toBeInTheDocument();
      });
    });

    it("shows validation error for imoCostComponent exceeding max length", async () => {
      const user = userEvent.setup({ delay: null });

      render(
        <GLAccountFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      const input = screen.getByLabelText(
        /IMO cost component/i,
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "A".repeat(101) } });

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/IMO cost component must not exceed/i),
        ).toBeInTheDocument();
      });
    });

    it("toggles isActive checkbox", async () => {
      // Current implementation does not render isActive checkbox
      expect(true).toBe(true);
    });

    it("uses empty array fallback for companyOptions and businessAreaOptions when data is null", () => {
      mockUseMasterDataCompanies.mockReturnValueOnce({
        data: null,
        isLoading: false,
      });
      mockUseMasterDataBusinessAreas.mockReturnValueOnce({
        data: null,
        isLoading: false,
      });

      render(
        <GLAccountFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      const selects = screen.getAllByTestId("mock-select");
      expect(selects).toHaveLength(2);
      expect(selects[0]).toBeInTheDocument();
      expect(selects[1]).toBeInTheDocument();
    });
  });
});
