import { PartnerCategoryFormModal } from "@/features/master-data/partner-category/components/partner-category-form-modal";
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

describe("PartnerCategoryFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <PartnerCategoryFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.queryByText("Add Partner Category"),
      ).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add Partner Category'", () => {
      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.getByText("Add Partner Category")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("renders the Name input field", () => {
      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    it("renders the Description textarea field", () => {
      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByPlaceholderText(/enter partner category description/i),
      ).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();

      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Partner Category name is required"),
        ).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.type(screen.getByLabelText(/name/i), "Supplier");
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
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      await user.type(screen.getByLabelText(/name/i), "Supplier");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it("toggles the isActive checkbox via Controller", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={onOpenChange}
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
      name: "Supplier",
      description: "Supplier category",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit Partner Category'", () => {
      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(screen.getByText("Edit Partner Category")).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <PartnerCategoryFormModal
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
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      expect(nameInput.value).toBe("Supplier");
    });

    it("pre-fills the description field with defaultValues", () => {
      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const descInput = screen.getByPlaceholderText(
        /enter partner category description/i,
      ) as HTMLTextAreaElement;
      expect(descInput.value).toBe("Supplier category");
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByLabelText(/name/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Supplier Updated");

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("error handling", () => {
    const BASE = "http://localhost:3000";

    it("calls onError handler when create mutation fails with server error", async () => {
      server.use(
        http.post(`${BASE}/master/partner/category`, () =>
          HttpResponse.json({ message: "Duplicate name" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.type(screen.getByLabelText(/name/i), "Supplier");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Add Partner Category")).toBeInTheDocument();
    });

    it("calls onError handler when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/partner/category/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const defaultValues = {
        id: 1,
        name: "Supplier",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      };

      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByLabelText(/name/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Category");
      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Edit Partner Category")).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{
            name: "Test",
            isActive: true,
          }}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it("shows validation error when description exceeds 16000 characters", async () => {
      const user = userEvent.setup();

      render(
        <PartnerCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.type(screen.getByLabelText(/name/i), "Test");

      const descInput = screen.getByPlaceholderText(
        /enter partner category description/i,
      );
      fireEvent.change(descInput, {
        target: { value: "A".repeat(16001) },
      });

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Description must not exceed 16000 characters/i),
        ).toBeInTheDocument();
      });
    });
  });
});
