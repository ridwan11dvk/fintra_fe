import {
  DISPUTE_WORKFLOW_LIST_PERMISSION,
  DISPUTE_WORKFLOW_READ_PERMISSION,
  DISPUTE_WORKFLOW_UPDATE_PERMISSION,
} from "@/features/master-data/dispute-workflow/data";
import { DisputeWorkflowPage } from "@/features/master-data/dispute-workflow/pages/dispute-workflow.page";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockToastSuccess, mockToastError } = vi.hoisted(() => ({
  mockToastSuccess: vi.fn(),
  mockToastError: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock("@railfinance/core/components/actions", () => ({
  ActionButton: ({
    variant,
    label,
    onClick,
  }: {
    variant: string;
    label?: string;
    onClick?: () => void;
  }) => (
    <button type="button" data-testid={`action-${variant}`} onClick={onClick}>
      {label ?? variant}
    </button>
  ),
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  return {
    ...actual,
    toast: {
      success: mockToastSuccess,
      error: mockToastError,
    },
  };
});

describe("DisputeWorkflowPage", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    localStorage.setItem(
      "activePermissions",
      JSON.stringify([
        DISPUTE_WORKFLOW_LIST_PERMISSION,
        DISPUTE_WORKFLOW_READ_PERMISSION,
        DISPUTE_WORKFLOW_UPDATE_PERMISSION,
      ]),
    );
  });

  it("renders page header and data table", async () => {
    render(<DisputeWorkflowPage />);

    expect(
      screen.getByRole("heading", { name: "Dispute Workflow" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Budget Approval")).toBeInTheDocument();
      expect(screen.getByText("Financial Control")).toBeInTheDocument();
    });
  });

  it("navigates to detail page when view action is clicked", async () => {
    render(<DisputeWorkflowPage />);

    await waitFor(() => {
      expect(screen.getByText("Budget Approval")).toBeInTheDocument();
    });

    const viewButtons = await screen.findAllByTestId("action-show");
    await userEvent.click(viewButtons[0]);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("navigates to edit page when edit action is clicked", async () => {
    render(<DisputeWorkflowPage />);

    await waitFor(() => {
      expect(screen.getByText("Budget Approval")).toBeInTheDocument();
    });

    const editButtons = await screen.findAllByTestId("action-edit");
    await userEvent.click(editButtons[0]);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("does not render toggle active/deactivate buttons on the list", async () => {
    render(<DisputeWorkflowPage />);

    await waitFor(() => {
      expect(screen.getByText("Budget Approval")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("action-activate")).not.toBeInTheDocument();
    expect(screen.queryByTestId("action-deactivate")).not.toBeInTheDocument();
  });
});
