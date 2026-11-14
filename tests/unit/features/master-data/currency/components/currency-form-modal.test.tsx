import userEvent from "@testing-library/user-event";
import { mockQuerySelect } from "@tests/unit/mocks/select-mocks";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: (schema: unknown) => {
    return (data: Record<string, unknown>) => {
      const result = (
        schema as {
          safeParse: (d: unknown) => {
            success: boolean;
            data?: unknown;
            error?: {
              issues: Array<{
                path: (string | number)[];
                message: string;
                code: string;
              }>;
            };
          };
        }
      ).safeParse(data);
      if (result.success) {
        return { values: data, errors: {} };
      }
      const errors: Record<string, { message: string; type: string }> = {};
      for (const issue of result.error?.issues ?? []) {
        const key = issue.path.join(".");
        if (!errors[key]) {
          errors[key] = { message: issue.message, type: issue.code };
        }
      }
      return { values: {}, errors };
    };
  },
}));

const mutationState = vi.hoisted(() => ({
  createIsError: false,
  updateIsError: false,
}));

vi.mock("@/features/master-data/currency/data/currency.mutation", () => ({
  useCreateCurrencyMutation: (options: Record<string, unknown>) => ({
    mutate: () => {
      if (mutationState.createIsError) {
        (options.onError as (e: Error) => void)?.(new Error("Server error"));
      } else {
        (options.onSuccess as () => void)?.();
      }
    },
    isPending: false,
  }),
  useUpdateCurrencyMutation: (options: Record<string, unknown>) => ({
    mutate: () => {
      if (mutationState.updateIsError) {
        (options.onError as (e: Error) => void)?.(new Error("Server error"));
      } else {
        (options.onSuccess as () => void)?.();
      }
    },
    isPending: false,
  }),
}));

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
      useGetCountryOptions: () => ({
        data: mockOptionData.countriesData
          ? { data: mockOptionData.countriesData.data }
          : null,
        isLoading: false,
      }),
      QuerySelect: mockQuerySelect("select"),
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

const mockOptionData = vi.hoisted(() => ({
  countriesData: {
    data: [{ value: "1", label: "ID", description: "Indonesia" }],
  },
}));

import { CurrencyFormModal } from "@/features/master-data/currency/components/currency-form-modal";

describe("CurrencyFormModal", () => {
  afterEach(() => {
    mutationState.createIsError = false;
    mutationState.updateIsError = false;
  });

  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <CurrencyFormModal open={false} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.queryByText("Add Currency")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add Currency'", () => {
      render(
        <CurrencyFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByText("Add Currency")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <CurrencyFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();

      render(
        <CurrencyFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(screen.getByText("Country is required")).toBeInTheDocument();
      });
    });

    it("shows code validation when country is selected but code is empty", async () => {
      const user = userEvent.setup();

      render(
        <CurrencyFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      await user.selectOptions(screen.getByTestId("select"), "1");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Currency code must be exactly 3 characters"),
        ).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <CurrencyFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.selectOptions(screen.getByTestId("select"), "1");
      await user.type(screen.getByPlaceholderText(/e\.g\., IDR/i), "IDR");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(
        () => {
          expect(onOpenChange).toHaveBeenCalledWith(false);
        },
        { timeout: 5000 },
      );
    });

    it("calls onSuccess after successful form submission", async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      const onOpenChange = vi.fn();

      render(
        <CurrencyFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      await user.selectOptions(screen.getByTestId("select"), "1");
      await user.type(screen.getByPlaceholderText(/e\.g\., IDR/i), "IDR");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(
        () => {
          expect(onSuccess).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });
  });

  describe("edit mode", () => {
    const defaultValues = {
      id: 1,
      countryId: 1,
      country: {
        id: 1,
        name: "Indonesia",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      },
      code: "IDR",
      name: "Indonesian Rupiah",
      symbol: "Rp",
      lowestValue: 1.0,
      isPrimary: true,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit Currency'", () => {
      render(
        <CurrencyFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(screen.getByText("Edit Currency")).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <CurrencyFormModal
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

    it("pre-fills the code field with defaultValues", () => {
      render(
        <CurrencyFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      const codeInput = screen.getByPlaceholderText(
        /e\.g\., IDR/i,
      ) as HTMLInputElement;
      expect(codeInput.value).toBe("IDR");
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <CurrencyFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(
        () => {
          expect(onOpenChange).toHaveBeenCalledWith(false);
        },
        { timeout: 5000 },
      );
    });
  });

  describe("error handling", () => {
    beforeEach(() => {
      mutationState.createIsError = true;
      mutationState.updateIsError = true;
    });

    it("does not close modal when create mutation fails with server error", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <CurrencyFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.selectOptions(screen.getByTestId("select"), "1");
      await user.type(screen.getByPlaceholderText(/e\.g\., IDR/i), "IDR");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(
        () => {
          expect(onOpenChange).not.toHaveBeenCalledWith(false);
        },
        { timeout: 5000 },
      );
      expect(screen.getByText("Add Currency")).toBeInTheDocument();
    });

    it("does not close modal when update mutation fails with server error", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const defaultValues = {
        id: 1,
        countryId: 1,
        code: "IDR",
        isPrimary: false,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
        updatedBy: "admin",
      };

      render(
        <CurrencyFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(
        () => {
          expect(onOpenChange).not.toHaveBeenCalledWith(false);
        },
        { timeout: 5000 },
      );
      expect(screen.getByText("Edit Currency")).toBeInTheDocument();
    });
  });

  describe("null option data", () => {
    it("renders form with empty country options when countries data is null", () => {
      mockOptionData.countriesData = null as never;

      render(
        <CurrencyFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByText("Add Currency")).toBeInTheDocument();
    });

    it("resets option data to defaults after null data test", () => {
      mockOptionData.countriesData = {
        data: [{ value: "1", label: "ID", description: "Indonesia" }],
      };

      render(
        <CurrencyFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByText("Add Currency")).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("toggles isPrimary checkbox and submits form", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <CurrencyFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      const primaryCheckbox = screen.getByRole("checkbox", {
        name: /primary currency/i,
      });
      expect(primaryCheckbox).toBeInTheDocument();

      await user.click(primaryCheckbox);

      await user.selectOptions(screen.getByTestId("select"), "1");
      await user.type(screen.getByPlaceholderText(/e\.g\., IDR/i), "IDR");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(
        () => {
          expect(onOpenChange).toHaveBeenCalledWith(false);
        },
        { timeout: 5000 },
      );
    });

    it("toggles isActive checkbox and submits form", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <CurrencyFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      const activeCheckbox = screen.getByRole("checkbox", {
        name: /^active$/i,
      });
      expect(activeCheckbox).toBeInTheDocument();

      await user.click(activeCheckbox);

      await user.selectOptions(screen.getByTestId("select"), "1");
      await user.type(screen.getByPlaceholderText(/e\.g\., IDR/i), "IDR");
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(
        () => {
          expect(onOpenChange).toHaveBeenCalledWith(false);
        },
        { timeout: 5000 },
      );
    });

    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <CurrencyFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={
            {
              countryId: 1,
              code: "IDR",
              isPrimary: false,
              isActive: true,
            } as never
          }
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(
        () => {
          expect(onOpenChange).not.toHaveBeenCalledWith(false);
        },
        { timeout: 5000 },
      );
    });
  });
});
