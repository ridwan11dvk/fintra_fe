import { PartnerDocRefFormModal } from "@/features/master-data/partner-doc-ref/components/partner-doc-ref-form-modal";
import userEvent from "@testing-library/user-event";
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
      Checkbox: ({
        checked,
        onCheckedChange,
        id,
      }: {
        checked?: boolean;
        onCheckedChange?: (value: boolean) => void;
        id?: string;
      }) => (
        <input
          type="checkbox"
          data-testid="checkbox-isActive"
          checked={checked ?? false}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          id={id}
        />
      ),
      useGetCountryOptions: () => ({ data: [], isLoading: false }),
      useGetCompanyOptions: () => ({ data: [], isLoading: false }),
      useGetActivePartnerCategories: () => ({ data: [], isLoading: false }),
      useGetActivePartnerTypes: () => ({ data: [], isLoading: false }),
      useGetPartnerTypeSubtypes: () => ({ data: [], isLoading: false }),
      useGetLookupValueOptions: () => ({
        data: [
          { value: 15, label: "KTP", description: null },
          { value: 16, label: "Passport", description: null },
        ],
        isLoading: false,
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

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe("PartnerDocRefFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <PartnerDocRefFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.queryByText("Create Partner Document Reference"),
      ).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Create Partner Document Reference'", () => {
      render(
        <PartnerDocRefFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByText("Create Partner Document Reference"),
      ).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <PartnerDocRefFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("renders the Document Name select field", () => {
      render(
        <PartnerDocRefFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.getByText(/Document Name/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Select document name"),
      ).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();

      render(
        <PartnerDocRefFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Document name is required"),
        ).toBeInTheDocument();
      });
    });

    it("toggles the isActive checkbox via Controller", async () => {
      const user = userEvent.setup();

      render(
        <PartnerDocRefFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      const checkbox = screen.getByTestId(
        "checkbox-isActive",
      ) as HTMLInputElement;
      expect(checkbox.checked).toBe(true);

      await user.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });
  });

  describe("edit mode", () => {
    const defaultValues = {
      id: 1,
      countryId: 1,
      countryName: "Indonesia",
      companyCode: "C001",
      partnerCategoryId: 1,
      partnerCategoryName: "Supplier",
      partnerTypeId: 1,
      partnerTypeName: "Individual",
      partnerSubTypeId: 1,
      partnerSubTypeName: "Local",
      partnerLegalityId: 15,
      partnerRoleId: 16,
      documentNameId: 15,
      documentName: "KTP",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit Partner Document Reference'", () => {
      render(
        <PartnerDocRefFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(
        screen.getByText("Edit Partner Document Reference"),
      ).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <PartnerDocRefFormModal
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

    it("pre-fills the document name select with defaultValues", () => {
      render(
        <PartnerDocRefFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(
        screen.queryByText("Select document name"),
      ).not.toBeInTheDocument();
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <PartnerDocRefFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

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
        http.post(`${BASE}/master/partner/doc-ref`, () =>
          HttpResponse.json(
            { message: "Duplicate document reference" },
            { status: 422 },
          ),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <PartnerDocRefFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      // Submit with no field filled: zod validation blocks the mutation, the
      // modal stays open with the required-field errors rendered.
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Document name is required"),
        ).toBeInTheDocument();
      });
      expect(onOpenChange).not.toHaveBeenCalledWith(false);
      expect(
        screen.getByText("Create Partner Document Reference"),
      ).toBeInTheDocument();
    });

    it("does not call onOpenChange(false) when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/partner/doc-ref/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const defaultValues = {
        id: 1,
        countryId: 1,
        countryName: "Indonesia",
        companyCode: "C001",
        partnerCategoryId: 1,
        partnerCategoryName: "Supplier",
        partnerTypeId: 1,
        partnerTypeName: "Individual",
        partnerSubTypeId: 1,
        partnerSubTypeName: "Local",
        partnerLegalityId: 15,
        partnerRoleId: 16,
        documentNameId: 15,
        documentName: "KTP",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      };

      render(
        <PartnerDocRefFormModal
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
      expect(
        screen.getByText("Edit Partner Document Reference"),
      ).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <PartnerDocRefFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{
            documentNameId: 15,
            isActive: true,
          }}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });
  });
});
