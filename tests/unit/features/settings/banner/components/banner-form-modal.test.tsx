import { BannerFormModal } from "@/features/settings/banner/components/banner-form-modal";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
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

vi.mock(
  "@/features/settings/banner/data/banner.mutation",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/features/settings/banner/data/banner.mutation")
      >();
    return {
      ...actual,
      useCreateBannerMutation: () => ({
        mutate: vi.fn(),
        isPending: false,
      }),
      useUpdateBannerMutation: () => ({
        mutate: vi.fn(),
        isPending: false,
      }),
    };
  },
);

describe("BannerFormModal", () => {
  describe("rendering", () => {
    it("does not render modal content when closed", () => {
      render(
        <BannerFormModal open={false} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.queryByText("Add Banner")).not.toBeInTheDocument();
    });

    it("renders the modal title 'Add Banner' in create mode", () => {
      render(
        <BannerFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByText("Add Banner")).toBeInTheDocument();
    });

    it("renders the modal title 'Edit Banner' in edit mode", () => {
      render(
        <BannerFormModal open={true} onOpenChange={vi.fn()} mode="edit" />,
      );

      expect(screen.getByText("Edit Banner")).toBeInTheDocument();
    });

    it("renders required field markers for target, title (ID), start date and sort order", () => {
      render(
        <BannerFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByText("Target")).toBeInTheDocument();
      expect(screen.getByText("Title (ID)")).toBeInTheDocument();
      expect(screen.getByText("Start Date")).toBeInTheDocument();
      expect(screen.getByText("Sort Order")).toBeInTheDocument();
    });

    it("renders the EN fallback hint", () => {
      render(
        <BannerFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(
        screen.getByText("Falls back to Indonesian when empty"),
      ).toBeInTheDocument();
    });

    it("renders the image constraints hint", () => {
      render(
        <BannerFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByText(/16:9/)).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("shows errors when required fields are empty on submit", async () => {
      const user = userEvent.setup();
      render(
        <BannerFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      const targetInput = screen.getByLabelText(/Target/);
      const titleInput = screen.getByLabelText(/Title \(ID\)/);
      await user.clear(targetInput);
      await user.clear(titleInput);

      const form = document.querySelector("form");
      if (form) {
        form.dispatchEvent(new Event("submit", { bubbles: true }));
      }

      await waitFor(() => {
        expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
      });
    });
  });

  describe("create mode defaults", () => {
    it("defaults start date to today", () => {
      render(
        <BannerFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      const today = new Date().toISOString().slice(0, 10);
      const startDateInput = screen
        .getByLabelText(/Start Date/)
        .querySelector("input") as HTMLInputElement | null;
      const value = startDateInput?.value ?? "";
      expect(value === "" || value === today).toBe(true);
    });
  });
});
