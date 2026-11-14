import { PortFormModal } from "@/features/master-data/port/components/port-form-modal";
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

describe("PortFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <PortFormModal open={false} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.queryByText("Add Port")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add Port'", () => {
      render(
        <PortFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByText("Add Port")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <PortFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("renders the Code input field", () => {
      render(
        <PortFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(
        screen.getByPlaceholderText(/e\.g\., PORT-CGK-001/i),
      ).toBeInTheDocument();
    });

    it("renders the Name input field", () => {
      render(
        <PortFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(
        screen.getByPlaceholderText(
          /e\.g\., Pelabuhan Soekarno-Hatta Jakarta/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders the Customs Office select placeholder", async () => {
      render(
        <PortFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Select a customs office"),
        ).toBeInTheDocument();
      });
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();

      render(
        <PortFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(screen.getByText("Port name is required")).toBeInTheDocument();
      });
    });
  });

  describe("edit mode", () => {
    const defaultValues = {
      id: 1,
      customsOfficeId: 1,
      customsOffice: {
        id: 1,
        code: "KPPBC-001",
        name: "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      },
      code: "PORT-CGK-001",
      name: "Pelabuhan Soekarno-Hatta Jakarta",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit Port'", () => {
      render(
        <PortFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(screen.getByText("Edit Port")).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <PortFormModal
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
        <PortFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(
        /e\.g\., Pelabuhan Soekarno-Hatta Jakarta/i,
      ) as HTMLInputElement;
      expect(nameInput.value).toBe("Pelabuhan Soekarno-Hatta Jakarta");
    });

    it("pre-fills the code field with defaultValues", () => {
      render(
        <PortFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const codeInput = screen.getByPlaceholderText(
        /e\.g\., PORT-CGK-001/i,
      ) as HTMLInputElement;
      expect(codeInput.value).toBe("PORT-CGK-001");
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <PortFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(
        /e\.g\., Pelabuhan Soekarno-Hatta Jakarta/i,
      );
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Port Name");

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
        http.post(`${BASE}/master/port`, () =>
          HttpResponse.json({ message: "Duplicate code" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <PortFormModal open={true} onOpenChange={onOpenChange} mode="create" />,
      );

      const codeInput = screen.getByPlaceholderText(/e\.g\., PORT-CGK-001/i);
      await user.type(codeInput, "PORT-CGK-001");

      const nameInput = screen.getByPlaceholderText(
        /e\.g\., Pelabuhan Soekarno-Hatta Jakarta/i,
      );
      await user.type(nameInput, "Pelabuhan Soekarno-Hatta Jakarta");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Add Port")).toBeInTheDocument();
    });

    it("does not call onOpenChange(false) when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/port/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const defaultValues = {
        id: 1,
        customsOfficeId: 1,
        customsOffice: {
          id: 1,
          code: "KPPBC-001",
          name: "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          createdBy: "admin",
          updatedBy: "admin",
        },
        code: "PORT-CGK-001",
        name: "Pelabuhan Soekarno-Hatta Jakarta",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      };

      render(
        <PortFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(
        /e\.g\., Pelabuhan Soekarno-Hatta Jakarta/i,
      );
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Port");
      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Edit Port")).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <PortFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{
            customsOfficeId: 1,
            code: "PORT-CGK-001",
            name: "Pelabuhan Soekarno-Hatta Jakarta",
            isActive: true,
          }}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it("shows validation error when code exceeds 50 characters", async () => {
      const user = userEvent.setup();

      render(
        <PortFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      const codeInput = screen.getByPlaceholderText(/e\.g\., PORT-CGK-001/i);
      await user.type(codeInput, "A".repeat(51));

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Port code must not exceed 50 characters"),
        ).toBeInTheDocument();
      });
    });
  });
});
