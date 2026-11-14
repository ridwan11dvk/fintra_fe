import ComplianceFsscTab from "@/features/settings/setup-configuration/components/compliance-fssc-tab";
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
    useGetComplianceFsscItems: () => ({
      data: { status: "SUCCESS", data: [], message: "ok" },
      isLoading: false,
      isError: false,
    }),
    useSaveComplianceFsscMutation: (
      options?: Parameters<typeof actual.useSaveComplianceFsscMutation>[0],
    ) => ({
      mutate: (payload: { items: unknown[] }) => {
        saveMutate(payload);
        options?.onSuccess?.({
          status: "SUCCESS",
          message: "Compliance & Checklist FSSC saved successfully",
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

describe("ComplianceFsscTab", () => {
  beforeEach(() => {
    saveMutate.mockClear();
    vi.clearAllMocks();
  });

  it("[FSSC-COMP-009] shows empty state before any checklist items exist", async () => {
    render(<ComplianceFsscTab />);

    expect(
      await screen.findByText("Compliance & Checklist FSSC"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No compliance checklist items/i),
    ).toBeInTheDocument();
  });

  it("[FSSC-COMP-010] adds a new checklist card from the add button", async () => {
    const user = userEvent.setup();
    render(<ComplianceFsscTab />);

    await user.click(
      screen.getByRole("button", { name: /Add Compliance & Checklist FSSC/i }),
    );

    expect(screen.getByPlaceholderText("Enter checklist name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter description")).toBeInTheDocument();
  });

  it("[FSSC-COMP-011] saves checklist changes and shows success toast", async () => {
    const user = userEvent.setup();
    const { toast } = await import("@railfinance/core");
    render(<ComplianceFsscTab />);

    await user.click(
      screen.getByRole("button", { name: /Add Compliance & Checklist FSSC/i }),
    );
    await user.type(
      screen.getByPlaceholderText("Enter checklist name"),
      "Vendor compliance",
    );
    await user.click(screen.getByRole("button", { name: /^Save$/i }));

    await waitFor(() =>
      expect(saveMutate).toHaveBeenCalledWith({
        items: [
          expect.objectContaining({
            name: "Vendor compliance",
          }),
        ],
      }),
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Compliance & Checklist FSSC saved successfully",
    );
  });

  it("[FSSC-COMP-016] reverts unsaved changes on Cancel", async () => {
    const user = userEvent.setup();
    const { toast } = await import("@railfinance/core");
    render(<ComplianceFsscTab />);

    await user.click(
      screen.getByRole("button", { name: /Add Compliance & Checklist FSSC/i }),
    );
    await user.type(
      screen.getByPlaceholderText("Enter checklist name"),
      "Temporary item",
    );
    await user.click(screen.getByRole("button", { name: /^Cancel$/i }));

    expect(toast.info).toHaveBeenCalledWith("Changes reverted");
    expect(
      screen.getByText(/No compliance checklist items/i),
    ).toBeInTheDocument();
  });
});
