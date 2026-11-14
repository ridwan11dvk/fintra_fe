import userEvent from "@testing-library/user-event";
import { mockQuerySelect } from "@tests/unit/mocks/select-mocks";
import { server } from "@tests/unit/mocks/server";
import {
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
      useGetCompanyOptions: () => ({
        data: mockOptionData.companiesData
          ? { data: mockOptionData.companiesData.data }
          : null,
        isLoading: false,
      }),
      useGetBusinessAreaOptions: () => ({
        data: mockOptionData.businessAreasData
          ? { data: mockOptionData.businessAreasData.data }
          : null,
        isLoading: false,
      }),
      useGetLookupValueOptions: () => ({
        data: [],
        isLoading: false,
      }),
      LOOKUP_VALUE_TYPE_CODES: {
        ...(actual.LOOKUP_VALUE_TYPE_CODES as Record<string, string> | undefined),
        ASSET_CATEGORY: "ASSET_CATEGORY",
      },
      QuerySelect: mockQuerySelect("select"),
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

const mockOptionData = vi.hoisted(() => ({
  companiesData: {
    data: [{ value: "COMP1", label: "COMP1", description: "Company 1" }],
  },
  businessAreasData: {
    data: [{ value: "BA001", label: "BA001", description: "BA 001" }],
  },
}));

import { CostCenterFormModal } from "@/features/master-data/cost-center/components/cost-center-form-modal";

describe("CostCenterFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <CostCenterFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.queryByText("Add Cost Center")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add Cost Center'", () => {
      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.getByText("Add Cost Center")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();

      render(
        <CostCenterFormModal
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
    });

    it("shows cost center code validation when company code is filled but code is empty", async () => {
      const user = userEvent.setup();

      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.selectOptions(screen.getAllByTestId("select")[0], "COMP1");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Cost center code is required"),
        ).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.selectOptions(screen.getAllByTestId("select")[0], "COMP1");
      await user.selectOptions(screen.getAllByTestId("select")[1], "BA001");
      await user.type(screen.getByPlaceholderText(/e\.g\., 10091200/i), "CC-001");
      await user.type(
        screen.getByPlaceholderText(/e\.g\., Jakarta Head Office Cost Center/i),
        "Jakarta Head Office Cost Center",
      );
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
        <CostCenterFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      await user.selectOptions(screen.getAllByTestId("select")[0], "COMP1");
      await user.selectOptions(screen.getAllByTestId("select")[1], "BA001");
      await user.type(screen.getByPlaceholderText(/e\.g\., 10091200/i), "CC-001");
      await user.type(
        screen.getByPlaceholderText(/e\.g\., Jakarta Head Office Cost Center/i),
        "Jakarta Head Office Cost Center",
      );
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
      costCenterCode: "CC-001",
      costCenterName: "Jakarta Head Office Cost Center",
      startDate: "2024-01-01",
      endDate: null,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit Cost Center'", () => {
      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(screen.getByText("Edit Cost Center")).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <CostCenterFormModal
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

    it("pre-fills the costCenterCode field with defaultValues", () => {
      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const codeInput = screen.getByPlaceholderText(
        /e\.g\., 10091200/i,
      ) as HTMLInputElement;
      expect(codeInput.value).toBe("CC-001");
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(
        /e\.g\., Jakarta Head Office Cost Center/i,
      );
      await user.clear(nameInput);
      await user.type(nameInput, "Jakarta Head Office Cost Center Updated");

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
        http.post(`${BASE}/master/cost-center`, () =>
          HttpResponse.json({ message: "Duplicate code" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.selectOptions(screen.getAllByTestId("select")[0], "COMP1");
      await user.selectOptions(screen.getAllByTestId("select")[1], "BA001");
      await user.type(screen.getByPlaceholderText(/e\.g\., 10091200/i), "CC-001");
      await user.type(
        screen.getByPlaceholderText(/e\.g\., Jakarta Head Office Cost Center/i),
        "Test",
      );
      await user.type(screen.getByLabelText(/start date/i), "2024-01-01");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Add Cost Center")).toBeInTheDocument();
    });

    it("does not close modal when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/cost-center/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const defaultValues = {
        id: 1,
        companyCode: "COMP1",
        baCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test",
        startDate: "2024-01-01",
        endDate: null,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      };

      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(
        /e\.g\., Jakarta Head Office Cost Center/i,
      );
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Cost Center");
      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Edit Cost Center")).toBeInTheDocument();
    });
  });

  describe("null option data", () => {
    it("renders form with empty company options when companies data is null", () => {
      mockOptionData.companiesData = null as never;

      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.getByText("Add Cost Center")).toBeInTheDocument();
    });

    it("renders form with empty business area options when BA data is null", () => {
      mockOptionData.companiesData = {
        data: [
          { value: "COMP1", label: "COMP1", description: "Company 001" },
        ],
      };
      mockOptionData.businessAreasData = null as never;

      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.getByText("Add Cost Center")).toBeInTheDocument();
    });

    it("resets option data to defaults after null data test", () => {
      mockOptionData.companiesData = {
        data: [
          { value: "COMP1", label: "COMP1", description: "Company 001" },
        ],
      };
      mockOptionData.businessAreasData = {
        data: [{ value: "BA001", label: "BA001", description: "BA 001" }],
      };

      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.getByText("Add Cost Center")).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("fills in start date and submits form", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      const startDateInput = screen.getByLabelText(/start date/i);
      expect(startDateInput).toBeInTheDocument();

      await user.type(startDateInput, "2024-01-01");

      await user.selectOptions(screen.getAllByTestId("select")[0], "COMP1");
      await user.selectOptions(screen.getAllByTestId("select")[1], "BA001");
      await user.type(screen.getByPlaceholderText(/e\.g\., 10091200/i), "CC-001");
      await user.type(
        screen.getByPlaceholderText(/e\.g\., Jakarta Head Office Cost Center/i),
        "Test",
      );
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <CostCenterFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={
            {
              companyCode: "COMP1",
              baCode: "BA001",
              costCenterCode: "CC-001",
              costCenterName: "Test",
              startDate: "2024-01-01",
            } as never
          }
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });
  });
});
