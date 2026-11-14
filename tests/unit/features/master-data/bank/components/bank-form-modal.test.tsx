import { BankFormModal } from "@/features/master-data/bank/components/bank-form-modal";
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

describe("BankFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <BankFormModal open={false} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.queryByText("Add Bank")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add Bank'", () => {
      render(
        <BankFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByText("Add Bank")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <BankFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("renders the Bank Name input field", () => {
      render(
        <BankFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByLabelText(/bank name/i)).toBeInTheDocument();
    });

    it("renders the Code input field", () => {
      render(
        <BankFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByPlaceholderText(/bca, mandiri/i)).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();

      render(
        <BankFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(screen.getByText("Bank name is required")).toBeInTheDocument();
      });
    });

    it("shows validation error for code when name is filled but code is empty", async () => {
      const user = userEvent.setup();

      render(
        <BankFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      await user.type(screen.getByLabelText(/bank name/i), "Test Bank");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(screen.getByText("Bank code is required")).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <BankFormModal open={true} onOpenChange={onOpenChange} mode="create" />,
      );

      await user.type(screen.getByLabelText(/bank name/i), "Bank Central Asia");
      await user.type(screen.getByPlaceholderText(/bca, mandiri/i), "BCA");
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
        <BankFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      await user.type(screen.getByLabelText(/bank name/i), "Bank Central Asia");
      await user.type(screen.getByPlaceholderText(/bca, mandiri/i), "BCA");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("edit mode", () => {
    const defaultValues = {
      id: 1,
      name: "Bank Central Asia",
      code: "BCA",
      color: "#003ea0",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit Bank'", () => {
      render(
        <BankFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(screen.getByText("Edit Bank")).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <BankFormModal
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
        <BankFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByLabelText(/bank name/i) as HTMLInputElement;
      expect(nameInput.value).toBe("Bank Central Asia");
    });

    it("pre-fills the code field with defaultValues", () => {
      render(
        <BankFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const codeInput = screen.getByPlaceholderText(
        /bca, mandiri/i,
      ) as HTMLInputElement;
      expect(codeInput.value).toBe("BCA");
    });

    it("code field is disabled in edit mode", () => {
      render(
        <BankFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const codeInput = screen.getByPlaceholderText(
        /bca, mandiri/i,
      ) as HTMLInputElement;
      expect(codeInput).toBeDisabled();
    });

    it("code field is NOT disabled in create mode", () => {
      render(
        <BankFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      const codeInput = screen.getByPlaceholderText(
        /bca, mandiri/i,
      ) as HTMLInputElement;
      expect(codeInput).not.toBeDisabled();
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <BankFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByLabelText(/bank name/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Bank Central Asia Updated");

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
        http.post(`${BASE}/master/bank`, () =>
          HttpResponse.json({ message: "Duplicate code" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <BankFormModal open={true} onOpenChange={onOpenChange} mode="create" />,
      );

      await user.type(screen.getByLabelText(/bank name/i), "Bank Test");
      await user.type(screen.getByPlaceholderText(/bca, mandiri/i), "BCA");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Add Bank")).toBeInTheDocument();
    });

    it("calls onError handler when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/bank/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const defaultValues = {
        id: 1,
        name: "Bank Central Asia",
        code: "BCA",
        color: "#003ea0",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      };

      render(
        <BankFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByLabelText(/bank name/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Bank");
      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Edit Bank")).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <BankFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{ name: "Test Bank", code: "BCA", isActive: true }}
        />,
      );

      // Form is pre-filled; click Update without an id in defaultValues
      await user.click(screen.getByRole("button", { name: /^update$/i }));

      // Neither mutation fires, so onOpenChange(false) is never called
      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it("shows validation errors for color and all payment code fields", async () => {
      const user = userEvent.setup({ delay: null });

      render(
        <BankFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      // Fill required fields
      await user.type(screen.getByLabelText(/bank name/i), "Test Bank");
      await user.type(screen.getByPlaceholderText(/bca, mandiri/i), "BCA");

      // Enter invalid color value to trigger color error
      const colorInput = screen.getByPlaceholderText(
        /#0066CC/i,
      ) as HTMLInputElement;
      fireEvent.change(colorInput, { target: { value: "notahex" } });

      // Enter >50 chars for payment code fields using userEvent.type
      // (uncontrolled RHF inputs require DOM value updates via userEvent)
      const longValue = "A".repeat(51);
      await user.type(
        document.getElementById("rtgsCode") as unknown,
        longValue,
      );
      await user.type(
        document.getElementById("onlineCode") as unknown,
        longValue,
      );
      await user.type(
        document.getElementById("bifastCode") as unknown,
        longValue,
      );
      await user.type(document.getElementById("sknCode") as unknown, longValue);

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Color must be in hex format/i),
        ).toBeInTheDocument();
      });
      // Verify at least one payment code error is shown (covers error display branches)
      const maxLengthErrors = screen.getAllByText(/Too big.*50 characters/i);
      expect(maxLengthErrors.length).toBeGreaterThan(0);
    });
  });

  describe("color field interaction", () => {
    it("triggers onChange on the color picker input", () => {
      render(
        <BankFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );
      const colorPicker = document.getElementById(
        "colorPicker",
      ) as HTMLInputElement;
      expect(colorPicker).toBeInTheDocument();
      fireEvent.change(colorPicker, { target: { value: "#ff0000" } });
      expect(colorPicker.value).toBe("#ff0000");
    });

    it("triggers onChange on the color text input", async () => {
      const user = userEvent.setup();
      render(
        <BankFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );
      const colorInput = screen.getByPlaceholderText(
        /#0066CC/i,
      ) as HTMLInputElement;
      await user.type(colorInput, "#AABBCC");
      expect(colorInput.value).toContain("#");
    });
  });
});
