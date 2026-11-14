import userEvent from "@testing-library/user-event";
import { mockQuerySelect } from "@tests/unit/mocks/select-mocks";
import { server } from "@tests/unit/mocks/server";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { useEffect, useState } from "react";
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
      useGetProvinceOptions: () => ({
        data: {
          status: "SUCCESS",
          message: "ok",
          data: [
            { value: "1", label: "West Java", description: "West Java" },
            { value: "2", label: "East Java", description: "East Java" },
          ],
        },
        isLoading: false,
      }),
      useGetRegencyOptions: () => ({
        data: {
          status: "SUCCESS",
          message: "ok",
          data: [
            { value: "1", label: "Bandung", description: "Bandung" },
            { value: "2", label: "Garut", description: "Garut" },
          ],
        },
        isLoading: false,
      }),
      QuerySelect: mockQuerySelect("select"),
      Modal: ({
        open,
        title,
        children,
        onConfirm,
        confirmText,
        isLoading,
      }: {
        open?: boolean;
        title?: string;
        children?: React.ReactNode;
        onConfirm?: () => void;
        confirmText?: string;
        isLoading?: boolean;
      }) => {
        const [mounted, setMounted] = useState(false);
        useEffect(() => {
          if (open) setMounted(true);
        }, [open]);
        if (!open || !mounted) return null;
        return (
          <div data-testid="modal">
            <h2>{title}</h2>
            {children}
            <button
              data-testid="confirm-btn"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {confirmText}
            </button>
          </div>
        );
      },
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

import { DistrictFormModal } from "@/features/master-data/district/components/district-form-modal";

describe("DistrictFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <DistrictFormModal open={false} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.queryByText("Add District")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add District'", () => {
      render(
        <DistrictFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByText("Add District")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <DistrictFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("renders the District Name input field", () => {
      render(
        <DistrictFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByPlaceholderText(/bandung city/i)).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();

      render(
        <DistrictFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("District name is required"),
        ).toBeInTheDocument();
      });
    });

    it("shows validation error for province when name is filled but no province selected", async () => {
      const user = userEvent.setup();

      render(
        <DistrictFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      await user.type(
        screen.getByPlaceholderText(/bandung city/i),
        "Test District",
      );
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(screen.getByText("Province is required")).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <DistrictFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.type(
        screen.getByPlaceholderText(/bandung city/i),
        "Bandung City",
      );
      fireEvent.change(screen.getAllByTestId("select")[0], {
        target: { value: "1" },
      });
      fireEvent.change(screen.getAllByTestId("select")[1], {
        target: { value: "1" },
      });
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
        <DistrictFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      await user.type(
        screen.getByPlaceholderText(/bandung city/i),
        "Bandung City",
      );
      fireEvent.change(screen.getAllByTestId("select")[0], {
        target: { value: "1" },
      });
      fireEvent.change(screen.getAllByTestId("select")[1], {
        target: { value: "1" },
      });
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("edit mode", () => {
    const defaultValues = {
      id: 1,
      name: "Bandung City",
      code: "DIST001",
      provinceId: 1,
      regencyId: 1,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit District'", () => {
      render(
        <DistrictFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(screen.getByText("Edit District")).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <DistrictFormModal
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
        <DistrictFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(
        /bandung city/i,
      ) as HTMLInputElement;
      expect(nameInput.value).toBe("Bandung City");
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <DistrictFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(/bandung city/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Bandung City Updated");

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("error handling", () => {
    const BASE = "http://localhost:3000";

    it("modal remains open when create mutation fails with server error", async () => {
      server.use(
        http.post(`${BASE}/master/district`, () =>
          HttpResponse.json({ message: "Duplicate code" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <DistrictFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.type(
        screen.getByPlaceholderText(/bandung city/i),
        "Test District",
      );
      fireEvent.change(screen.getAllByTestId("select")[0], {
        target: { value: "1" },
      });
      fireEvent.change(screen.getAllByTestId("select")[1], {
        target: { value: "1" },
      });
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Add District")).toBeInTheDocument();
    });

    it("modal remains open when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/district/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const defaultValues = {
        id: 1,
        name: "Bandung City",
        code: "DIST001",
        provinceId: 1,
        regencyId: 1,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      };

      render(
        <DistrictFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByPlaceholderText(/bandung city/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated District");
      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Edit District")).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <DistrictFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{ name: "Test District", isActive: true }}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });
  });
});
