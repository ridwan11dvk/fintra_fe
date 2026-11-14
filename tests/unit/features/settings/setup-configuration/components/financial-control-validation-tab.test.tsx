import FinancialControlValidationTab from "@/features/settings/setup-configuration/components/financial-control-validation-tab";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { beforeEach, describe, expect, it, vi } from "vitest";

const saveMutate = vi.fn();

vi.mock("@/features/settings/setup-configuration/data", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("@/features/settings/setup-configuration/data")
    >();
  return {
    ...actual,
    useGetFinancialControlValidationItems: () => ({
      data: { status: "SUCCESS", data: [], message: "ok" },
      isLoading: false,
      isError: false,
    }),
    useSaveFinancialControlValidationMutation: (
      options?: Parameters<
        typeof actual.useSaveFinancialControlValidationMutation
      >[0],
    ) => ({
      mutate: (payload: { items: unknown[] }) => {
        saveMutate(payload);
        options?.onSuccess?.({
          status: "SUCCESS",
          message: "Financial Control Validation saved successfully",
          data: payload.items as never,
        });
      },
      isPending: false,
    }),
  };
});

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
    },
  };
});

describe("FinancialControlValidationTab", () => {
  beforeEach(() => {
    saveMutate.mockClear();
    vi.clearAllMocks();
  });

  it("[FSSC-FCV-009] shows empty state before any validation parameters exist", async () => {
    render(<FinancialControlValidationTab />);

    expect(
      await screen.findByText("Financial Control Validation"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No financial control validation items/i),
    ).toBeInTheDocument();
  });

  it("[FSSC-FCV-010] adds a new parameter card from the add button", async () => {
    const user = userEvent.setup();
    render(<FinancialControlValidationTab />);

    await user.click(
      screen.getByRole("button", {
        name: /Add Financial Control Validation/i,
      }),
    );

    expect(screen.getByPlaceholderText("Enter title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter sub title")).toBeInTheDocument();
  });

  it("[FSSC-FCV-011] saves parameter changes and shows success toast", async () => {
    const user = userEvent.setup();
    const { toast } = await import("@railfinance/core");
    render(<FinancialControlValidationTab />);

    await user.click(
      screen.getByRole("button", {
        name: /Add Financial Control Validation/i,
      }),
    );
    await user.type(screen.getByPlaceholderText("Enter title"), "Budget check");
    await user.type(
      screen.getByPlaceholderText("Enter sub title"),
      "Monthly limit",
    );
    await user.click(screen.getByRole("button", { name: /^Save$/i }));

    await waitFor(() =>
      expect(saveMutate).toHaveBeenCalledWith({
        items: [
          expect.objectContaining({
            title: "Budget check",
            subTitle: "Monthly limit",
          }),
        ],
      }),
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Financial Control Validation saved successfully",
    );
  });

  it("[FSSC-FCV-016] reverts unsaved changes on Cancel", async () => {
    const user = userEvent.setup();
    const { toast } = await import("@railfinance/core");
    render(<FinancialControlValidationTab />);

    await user.click(
      screen.getByRole("button", {
        name: /Add Financial Control Validation/i,
      }),
    );
    await user.type(screen.getByPlaceholderText("Enter title"), "Temporary");
    await user.click(screen.getByRole("button", { name: /^Cancel$/i }));

    expect(toast.info).toHaveBeenCalledWith("Changes reverted");
    expect(
      screen.getByText(/No financial control validation items/i),
    ).toBeInTheDocument();
  });
});
