import { render, screen, waitFor } from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { ProvinceFormModal } from "@/features/master-data/province/components/province-form-modal";
import type { ProvinceResponse } from "@/features/master-data/province/data/province.types";

const mockProvince: ProvinceResponse = {
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

const BASE = "http://localhost:3000";

describe("ProvinceFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <ProvinceFormModal
          open={false}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      expect(screen.queryByText("Add Province")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add Province'", async () => {
      render(
        <ProvinceFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("Add Province")).toBeInTheDocument();
      });
    });

    it("renders a 'Create' confirm button", async () => {
      render(
        <ProvinceFormModal
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
        <ProvinceFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., PROV001/i),
        ).toBeInTheDocument();
      });
    });

    it("renders the Name input field", async () => {
      render(
        <ProvinceFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., West Java/i),
        ).toBeInTheDocument();
      });
    });

    it("renders the Alias input field", async () => {
      render(
        <ProvinceFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., Jabar/i),
        ).toBeInTheDocument();
      });
    });

    it("renders the Active checkbox", async () => {
      render(
        <ProvinceFormModal
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
        <ProvinceFormModal
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
          screen.getByText("Province name is required"),
        ).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful create", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <ProvinceFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., West Java/i),
        ).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/e\.g\., West Java/i);
      await user.type(nameInput, "West Java");

      await user.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("does not call onOpenChange(false) when create mutation fails with server error", async () => {
      server.use(
        http.post(`${BASE}/master/province`, () =>
          HttpResponse.json(
            { message: "Server error" },
            { status: 500 },
          ),
        ),
      );

      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <ProvinceFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., West Java/i),
        ).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/e\.g\., West Java/i);
      await user.type(nameInput, "West Java");

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
    it("renders the modal title 'Edit Province'", async () => {
      render(
        <ProvinceFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={mockProvince}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("Edit Province")).toBeInTheDocument();
      });
    });

    it("renders an 'Update' confirm button", async () => {
      render(
        <ProvinceFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={mockProvince}
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
        <ProvinceFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={mockProvince}
        />,
      );

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText(
          /e\.g\., West Java/i,
        ) as HTMLInputElement;
        expect(nameInput.value).toBe("West Java");
      });
    });

    it("pre-fills the code field with defaultValues", async () => {
      render(
        <ProvinceFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={mockProvince}
        />,
      );

      await waitFor(() => {
        const codeInput = screen.getByPlaceholderText(
          /e\.g\., PROV001/i,
        ) as HTMLInputElement;
        expect(codeInput.value).toBe("PROV001");
      });
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <ProvinceFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={mockProvince}
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
        http.put(`${BASE}/master/province/:id`, () =>
          HttpResponse.json(
            { message: "Validation failed" },
            { status: 422 },
          ),
        ),
      );

      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <ProvinceFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={mockProvince}
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
        <ProvinceFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{ name: "Some Province" }}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., West Java/i),
        ).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/e\.g\., West Java/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Province");

      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it("shows validation error when code exceeds 50 characters", async () => {
      const user = userEvent.setup();
      render(
        <ProvinceFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="create"
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/e\.g\., PROV001/i),
        ).toBeInTheDocument();
      });

      const codeInput = screen.getByPlaceholderText(/e\.g\., PROV001/i);
      await user.type(codeInput, "A".repeat(51));

      const nameInput = screen.getByPlaceholderText(/e\.g\., West Java/i);
      await user.type(nameInput, "West Java");

      await user.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Code must not exceed 50 characters"),
        ).toBeInTheDocument();
      });
    });
  });
});
