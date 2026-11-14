import { render, screen, waitFor } from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { RegencyFormModal } from "@/features/master-data/regency/components/regency-form-modal";
import type { RegencyResponse } from "@/features/master-data/regency/data/regency.types";

const mockProvince = {
  id: 1,
  code: "PROV001",
  name: "West Java",
  alias: "Jabar",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const mockRegency: RegencyResponse = {
  id: 1,
  code: "REG001",
  name: "Bandung",
  provinceId: 1,
  province: mockProvince,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const BASE = "http://localhost:3000";

describe("RegencyFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <RegencyFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.queryByText("Add Regency")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add Regency'", async () => {
      render(
        <RegencyFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("Add Regency")).toBeInTheDocument();
      });
    });

    it("renders a 'Create' confirm button", async () => {
      render(
        <RegencyFormModal
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
        <RegencyFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., REG001/i),
        ).toBeInTheDocument();
      });
    });

    it("renders the Name input field", async () => {
      render(
        <RegencyFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., Bandung/i),
        ).toBeInTheDocument();
      });
    });

    it("renders the Province select", async () => {
      render(
        <RegencyFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Select province..."),
        ).toBeInTheDocument();
      });
    });

    it("renders the Active checkbox", async () => {
      render(
        <RegencyFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("Active")).toBeInTheDocument();
      });
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();
      render(
        <RegencyFormModal
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
          screen.getByText("Regency name is required"),
        ).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful create", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <RegencyFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          defaultValues={{ provinceId: 1 }}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., Bandung/i),
        ).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/e\.g\., Bandung/i);
      await user.type(nameInput, "Bandung");

      await user.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("does not call onOpenChange(false) when create mutation fails with server error", async () => {
      server.use(
        http.post(`${BASE}/master/regency`, () =>
          HttpResponse.json(
            { message: "Server error" },
            { status: 500 },
          ),
        ),
      );

      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <RegencyFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          defaultValues={{ provinceId: 1 }}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., Bandung/i),
        ).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/e\.g\., Bandung/i);
      await user.type(nameInput, "Bandung");

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
    it("renders the modal title 'Edit Regency'", async () => {
      render(
        <RegencyFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={mockRegency}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("Edit Regency")).toBeInTheDocument();
      });
    });

    it("renders an 'Update' confirm button", async () => {
      render(
        <RegencyFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={mockRegency}
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
        <RegencyFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={mockRegency}
        />,
      );

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText(
          /e\.g\., Bandung/i,
        ) as HTMLInputElement;
        expect(nameInput.value).toBe("Bandung");
      });
    });

    it("pre-fills the code field with defaultValues", async () => {
      render(
        <RegencyFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={mockRegency}
        />,
      );

      await waitFor(() => {
        const codeInput = screen.getByPlaceholderText(
          /e\.g\., REG001/i,
        ) as HTMLInputElement;
        expect(codeInput.value).toBe("REG001");
      });
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <RegencyFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={mockRegency}
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
        http.put(`${BASE}/master/regency/:id`, () =>
          HttpResponse.json(
            { message: "Validation failed" },
            { status: 422 },
          ),
        ),
      );

      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <RegencyFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={mockRegency}
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
        <RegencyFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{ name: "Some Regency" }}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., Bandung/i),
        ).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/e\.g\., Bandung/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Regency");

      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it("shows validation error when code exceeds 50 characters", async () => {
      const user = userEvent.setup();
      render(
        <RegencyFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., REG001/i),
        ).toBeInTheDocument();
      });

      const codeInput = screen.getByPlaceholderText(/e\.g\., REG001/i);
      await user.type(codeInput, "A".repeat(51));

      const nameInput = screen.getByPlaceholderText(/e\.g\., Bandung/i);
      await user.type(nameInput, "Bandung");

      await user.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Regency code must not exceed 50 characters"),
        ).toBeInTheDocument();
      });
    });
  });
});
