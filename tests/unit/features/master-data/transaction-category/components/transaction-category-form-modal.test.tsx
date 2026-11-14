import { TransactionCategoryFormModal } from "@/features/master-data/transaction-category/components/transaction-category-form-modal";
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

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
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
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe("TransactionCategoryFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <TransactionCategoryFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.queryByText("Create Transaction Category"),
      ).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Create Transaction Category'", () => {
      render(
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByText("Create Transaction Category"),
      ).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <TransactionCategoryFormModal
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
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(
        screen.getByPlaceholderText(/enter transaction category name/i),
      ).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();

      render(
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Transaction category name is required"),
        ).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.type(
        screen.getByPlaceholderText(/enter transaction category name/i),
        "Office Supplies",
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
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      await user.type(
        screen.getByPlaceholderText(/enter transaction category name/i),
        "Office Supplies",
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
      name: "Office Supplies",
      description: "Expenses related to office supplies",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit Transaction Category'", () => {
      render(
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(screen.getByText("Edit Transaction Category")).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <TransactionCategoryFormModal
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
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(
        /enter transaction category name/i,
      ) as HTMLInputElement;
      expect(nameInput.value).toBe("Office Supplies");
    });

    it("pre-fills the description field with defaultValues", () => {
      render(
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const descInput = screen.getByPlaceholderText(
        /enter transaction category description/i,
      ) as HTMLInputElement;
      expect(descInput.value).toBe("Expenses related to office supplies");
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(
        /enter transaction category name/i,
      );
      await user.clear(nameInput);
      await user.type(nameInput, "Office Supplies Updated");

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
        http.post(`${BASE}/master/transaction-category`, () =>
          HttpResponse.json({ message: "Duplicate name" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.type(
        screen.getByPlaceholderText(/enter transaction category name/i),
        "Office Supplies",
      );
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(
        screen.getByText("Create Transaction Category"),
      ).toBeInTheDocument();
    });

    it("does not close modal when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/transaction-category/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const defaultValues = {
        id: 1,
        name: "Office Supplies",
        description: "Test",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      };

      render(
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(
        /enter transaction category name/i,
      );
      await user.clear(nameInput);
      await user.type(nameInput, "Office Supplies Updated");
      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Edit Transaction Category")).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{ name: "Test", isActive: true }}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it("shows validation error for description exceeding max length", async () => {
      const user = userEvent.setup();

      render(
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await user.type(
        screen.getByPlaceholderText(/enter transaction category name/i),
        "Test",
      );

      const descInput = screen.getByPlaceholderText(
        /enter transaction category description/i,
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
        <TransactionCategoryFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-checked", "true");

      await user.click(checkbox);
      expect(checkbox).toHaveAttribute("aria-checked", "false");

      await user.click(checkbox);
      expect(checkbox).toHaveAttribute("aria-checked", "true");
    });
  });
});
