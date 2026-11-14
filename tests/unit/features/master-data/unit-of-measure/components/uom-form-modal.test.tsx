import { UomFormModal } from "@/features/master-data/unit-of-measure/components/uom-form-modal";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/unit/mocks/server";
import {
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

describe("UomFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <UomFormModal open={false} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.queryByText("Add Unit of Measure")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add Unit of Measure'", () => {
      render(<UomFormModal open={true} onOpenChange={vi.fn()} mode="create" />);

      expect(screen.getByText("Add Unit of Measure")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(<UomFormModal open={true} onOpenChange={vi.fn()} mode="create" />);

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("renders required fields (code, unit, alias)", () => {
      render(<UomFormModal open={true} onOpenChange={vi.fn()} mode="create" />);

      expect(screen.getByPlaceholderText("e.g., UM.0001")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("e.g., Kilogram, Liter"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("e.g., Kilogram, Liter (EN)"),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("e.g., KG, LTR")).toBeInTheDocument();
    });

    it("code input is enabled in create mode", () => {
      render(<UomFormModal open={true} onOpenChange={vi.fn()} mode="create" />);

      const codeInput = screen.getByPlaceholderText("e.g., UM.0001");
      expect(codeInput).not.toBeDisabled();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();
      render(<UomFormModal open={true} onOpenChange={vi.fn()} mode="create" />);

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(screen.getByText("Code is required")).toBeInTheDocument();
      });
      expect(screen.getByText("Unit is required")).toBeInTheDocument();
      expect(screen.getByText("Alias is required")).toBeInTheDocument();
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <UomFormModal open={true} onOpenChange={onOpenChange} mode="create" />,
      );

      await user.type(screen.getByPlaceholderText("e.g., UM.0001"), "UM.0001");
      await user.type(
        screen.getByPlaceholderText("e.g., Kilogram, Liter"),
        "Kilogram",
      );
      await user.type(screen.getByPlaceholderText("e.g., KG, LTR"), "KG");

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
        <UomFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      await user.type(screen.getByPlaceholderText("e.g., UM.0001"), "UM.0001");
      await user.type(
        screen.getByPlaceholderText("e.g., Kilogram, Liter"),
        "Kilogram",
      );
      await user.type(screen.getByPlaceholderText("e.g., KG, LTR"), "KG");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it("sends unitEn and unitAlias in the create payload", async () => {
      const capturedBodies: Record<string, unknown>[] = [];
      server.use(
        http.post("http://localhost:3000/master/uom", async ({ request }) => {
          const body = (await request.json()) as Record<string, unknown>;
          capturedBodies.push(body);
          return HttpResponse.json(
            { status: "SUCCESS", data: { ...body, id: 1 } },
            { status: 201 },
          );
        }),
      );
      const user = userEvent.setup();

      render(
        <UomFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
          onSuccess={vi.fn()}
        />,
      );

      await user.type(screen.getByPlaceholderText("e.g., UM.0001"), "UM.0001");
      await user.type(
        screen.getByPlaceholderText("e.g., Kilogram, Liter"),
        "Kilogram",
      );
      await user.type(
        screen.getByPlaceholderText("e.g., Kilogram, Liter (EN)"),
        "Kilogram",
      );
      await user.type(screen.getByPlaceholderText("e.g., KG, LTR"), "kg");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(capturedBodies).toHaveLength(1);
      });
      expect(capturedBodies[0]).toMatchObject({
        code: "UM.0001",
        unit: "Kilogram",
        unitEn: "Kilogram",
        unitAlias: "kg",
      });
    });
  });

  describe("edit mode", () => {
    const defaultValues = {
      id: 1,
      code: "KG",
      unit: "Kilogram",
      unitEn: "Kilogram",
      unitAlias: "KG",
      isActive: true,
      createdAt: "2024-06-01T00:00:00Z",
      updatedAt: "2024-06-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit Unit of Measure'", () => {
      render(
        <UomFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(screen.getByText("Edit Unit of Measure")).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <UomFormModal
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

    it("pre-fills the unit field with defaultValues", async () => {
      render(
        <UomFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await waitFor(() => {
        const unitInput = screen.getByPlaceholderText(
          "e.g., Kilogram, Liter",
        ) as HTMLInputElement;
        expect(unitInput.value).toBe("Kilogram");
      });
    });

    it("pre-fills the unitEn and alias fields with defaultValues", async () => {
      render(
        <UomFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await waitFor(() => {
        const unitEnInput = screen.getByPlaceholderText(
          "e.g., Kilogram, Liter (EN)",
        ) as HTMLInputElement;
        expect(unitEnInput.value).toBe("Kilogram");
      });

      const aliasInput = screen.getByPlaceholderText(
        "e.g., KG, LTR",
      ) as HTMLInputElement;
      expect(aliasInput.value).toBe("KG");
    });

    it("code input is disabled in edit mode", async () => {
      render(
        <UomFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await waitFor(() => {
        const codeInput = screen.getByPlaceholderText("e.g., UM.0001");
        expect(codeInput).toBeDisabled();
      });
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <UomFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("e.g., Kilogram, Liter"),
        ).toBeInTheDocument();
      });

      const unitInput = screen.getByPlaceholderText("e.g., Kilogram, Liter");
      await user.clear(unitInput);
      await user.type(unitInput, "Kilogram (Updated)");

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
        http.post(`${BASE}/master/uom`, () =>
          HttpResponse.json({ message: "Duplicate entry" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <UomFormModal open={true} onOpenChange={onOpenChange} mode="create" />,
      );

      await user.type(screen.getByPlaceholderText("e.g., UM.0001"), "KG");
      await user.type(
        screen.getByPlaceholderText("e.g., Kilogram, Liter"),
        "Kilogram",
      );
      await user.type(screen.getByPlaceholderText("e.g., KG, LTR"), "KG");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Add Unit of Measure")).toBeInTheDocument();
    });

    it("does not close modal when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/uom/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <UomFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{
            id: 1,
            code: "KG",
            unit: "Kilogram",
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
          screen.getByPlaceholderText("e.g., Kilogram, Liter"),
        ).toBeInTheDocument();
      });

      const unitInput = screen.getByPlaceholderText("e.g., Kilogram, Liter");
      await user.clear(unitInput);
      await user.type(unitInput, "Updated Unit");

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Edit Unit of Measure")).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <UomFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{ code: "KG", unit: "Kilogram", isActive: true }}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("toggles isActive checkbox", async () => {
      const user = userEvent.setup();
      render(<UomFormModal open={true} onOpenChange={vi.fn()} mode="create" />);

      const checkboxes = screen.getAllByRole("checkbox");
      const activeCheckbox = checkboxes[checkboxes.length - 1];
      expect(activeCheckbox).toHaveAttribute("aria-checked", "true");

      await user.click(activeCheckbox);
      expect(activeCheckbox).toHaveAttribute("aria-checked", "false");

      await user.click(activeCheckbox);
      expect(activeCheckbox).toHaveAttribute("aria-checked", "true");
    });

    it("displays isActive checkbox as checked when defaultValues.isActive is true", async () => {
      render(
        <UomFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={{
            id: 1,
            code: "KG",
            unit: "Kilogram",
            isActive: true,
            createdAt: "2024-06-01T00:00:00Z",
            updatedAt: "2024-06-01T00:00:00Z",
            createdBy: "admin",
            updatedBy: "admin",
          }}
        />,
      );

      await waitFor(() => {
        const checkboxes = screen.getAllByRole("checkbox");
        const activeCheckbox = checkboxes[checkboxes.length - 1];
        expect(activeCheckbox).toHaveAttribute("aria-checked", "true");
      });
    });

    it("displays isActive checkbox as unchecked when defaultValues.isActive is false", async () => {
      render(
        <UomFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={{
            id: 1,
            code: "KG",
            unit: "Kilogram",
            isActive: false,
            createdAt: "2024-06-01T00:00:00Z",
            updatedAt: "2024-06-01T00:00:00Z",
            createdBy: "admin",
            updatedBy: "admin",
          }}
        />,
      );

      await waitFor(() => {
        const checkboxes = screen.getAllByRole("checkbox");
        const activeCheckbox = checkboxes[checkboxes.length - 1];
        expect(activeCheckbox).toHaveAttribute("aria-checked", "false");
      });
    });

    it("renders Close button", () => {
      render(<UomFormModal open={true} onOpenChange={vi.fn()} mode="create" />);

      expect(
        screen.getByRole("button", { name: /^close$/i }),
      ).toBeInTheDocument();
    });
  });
});
