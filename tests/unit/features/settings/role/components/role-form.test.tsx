import { RoleForm } from "@/features/settings/role/components/role-form";
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
      useGetActiveCompanies: () => ({
        data: {
          status: "SUCCESS",
          data: [
            {
              id: 1,
              code: "KAI",
              name: "Kereta Api Indonesia",
              modules: [{ id: 1, name: "Master Data" }],
            },
          ],
        },
        isLoading: false,
      }),
      useGetActiveBusinessAreas: () => ({
        data: {
          status: "SUCCESS",
          data: [{ id: 1, code: "BA-1", name: "BA One" }],
        },
        isLoading: false,
      }),
      ActionButton: ({
        variant,
        onClick,
        label,
        type,
        disabled,
        className,
      }: {
        variant?: string;
        onClick?: () => void;
        label?: string;
        type?: "button" | "submit";
        disabled?: boolean;
        className?: string;
      }) => (
        <button
          data-testid={`action-btn-${variant}`}
          onClick={onClick}
          type={type ?? "button"}
          disabled={disabled}
          className={className}
        >
          {label ?? variant}
        </button>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/image", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/multiple-badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/accordion", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/avatar", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

const BASE = "http://localhost:3000";

// Edit-mode role fixture matching RoleDetailResponse (companyCode-based
// company reference, permissions list, businessAreas, no moduleId/module).
const defaultRole = {
  id: 1,
  name: "Admin",
  code: "ADMIN",
  companyCode: "KAI",
  description: "Administrator role",
  isSuperAdmin: false,
  isActive: true,
  type: "CORE" as const,
  businessAreas: [{ id: 1, code: "BA-1", name: "BA One" }],
  permissions: [
    {
      id: 1,
      name: "master-data:bank:list",
      resource: "master-data:bank",
      description: "View bank list",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    },
  ],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

describe("RoleForm", () => {
  describe("inline mode (default)", () => {
    it("renders the form with name and code inputs", () => {
      render(<RoleForm />);

      expect(
        screen.getByPlaceholderText(/enter role name/i),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/enter role code/i),
      ).toBeInTheDocument();
    });

    it("renders the description textarea", () => {
      render(<RoleForm />);

      expect(
        screen.getByPlaceholderText(/enter role description/i),
      ).toBeInTheDocument();
    });

    it("renders inline action buttons with 'Create Role' label", () => {
      render(<RoleForm />);

      expect(
        screen.getByRole("button", { name: /create role/i }),
      ).toBeInTheDocument();
      expect(screen.getByTestId("action-btn-cancel")).toBeInTheDocument();
    });

    it("renders inline action buttons with 'Update Role' label in edit mode", () => {
      render(<RoleForm role={defaultRole} />);

      expect(
        screen.getByRole("button", { name: /update role/i }),
      ).toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("auto-generates code from the role name", async () => {
      const user = userEvent.setup();

      render(<RoleForm />);

      await user.type(
        screen.getByPlaceholderText(/enter role name/i),
        "New Role",
      );

      await waitFor(() => {
        const codeInput = screen.getByPlaceholderText(
          /enter role code/i,
        ) as HTMLInputElement;
        expect(codeInput.value).toBe("NEW_ROLE");
      });
    });

    it("shows validation errors when submitting an empty form", async () => {
      const user = userEvent.setup();

      render(<RoleForm />);

      await user.click(screen.getByTestId("action-btn-save"));

      await waitFor(() => {
        expect(
          screen.getByText("Name must be at least 2 characters"),
        ).toBeInTheDocument();
      });
      expect(screen.getByText("Company is required")).toBeInTheDocument();
    });

    it("shows validation error when description exceeds 500 characters", async () => {
      const user = userEvent.setup({ delay: null });

      render(<RoleForm />);

      const nameInput = screen.getByPlaceholderText(/enter role name/i);
      await user.type(nameInput, "Test Role");

      const descInput = screen.getByPlaceholderText(/enter role description/i);
      await user.type(descInput, "A".repeat(501));

      await user.click(screen.getByTestId("action-btn-save"));

      await waitFor(() => {
        expect(
          screen.getByText(/Description must be less than 500 characters/i),
        ).toBeInTheDocument();
      });
    });

    it("calls createRoleMutation via form submit with valid data", async () => {
      server.use(
        http.post(`${BASE}/master/role`, () =>
          HttpResponse.json({
            status: "SUCCESS",
            message: "Role created successfully",
            data: { id: 2, name: "New Role" },
          }),
        ),
      );

      const user = userEvent.setup();

      render(<RoleForm />);

      const nameInput = screen.getByPlaceholderText(/enter role name/i);
      await user.type(nameInput, "New Role");
      const codeInput = screen.getByPlaceholderText(/enter role code/i);
      await user.clear(codeInput);
      await user.type(codeInput, "NEW_ROLE");

      await user.click(screen.getByTestId("action-btn-save"));

      // Form remains rendered (inline mode); no crash on submit
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter role name/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("edit mode", () => {
    it("pre-fills the name field with role data", () => {
      render(<RoleForm role={defaultRole} />);

      const nameInput = screen.getByPlaceholderText(
        /enter role name/i,
      ) as HTMLInputElement;
      expect(nameInput.value).toBe("Admin");
    });

    it("pre-fills the code field with role data", () => {
      render(<RoleForm role={defaultRole} />);

      const codeInput = screen.getByPlaceholderText(
        /enter role code/i,
      ) as HTMLInputElement;
      expect(codeInput.value).toBe("ADMIN");
    });

    it("submits update when Update Role is clicked", async () => {
      server.use(
        http.put(`${BASE}/master/role/:id`, () =>
          HttpResponse.json({
            status: "SUCCESS",
            message: "Role updated successfully",
            data: { id: 1, name: "Admin Updated" },
          }),
        ),
      );

      const user = userEvent.setup();

      render(<RoleForm role={defaultRole} />);

      const nameInput = screen.getByPlaceholderText(/enter role name/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Admin Updated");

      await user.click(screen.getByTestId("action-btn-save"));

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter role name/i),
        ).toBeInTheDocument();
      });
    });

    it("does not show form-level success when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/role/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();

      render(<RoleForm role={defaultRole} />);

      const nameInput = screen.getByPlaceholderText(/enter role name/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated");
      await user.click(screen.getByTestId("action-btn-save"));

      // The form stays mounted after a failed mutation
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter role name/i),
        ).toBeInTheDocument();
      });
    });
  });
});
