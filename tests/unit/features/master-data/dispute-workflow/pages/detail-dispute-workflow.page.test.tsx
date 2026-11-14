import {
  DISPUTE_WORKFLOW_READ_PERMISSION,
  DISPUTE_WORKFLOW_UPDATE_PERMISSION,
} from "@/features/master-data/dispute-workflow/data";
import { DetailDisputeWorkflowPage } from "@/features/master-data/dispute-workflow/pages/detail-dispute-workflow.page";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "budget-approval" }),
    useLocation: () => ({
      state: {
        stageProcessCategory: "BUSINESS_LAYER",
        stageProcessCategoryName: "Business Layer",
        stageProcess: "budget-approval",
        stageProcessName: "Budget Approval",
        disputeWorkflowActive: true,
      },
    }),
  };
});

describe("DetailDisputeWorkflowPage", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    localStorage.setItem(
      "activePermissions",
      JSON.stringify([
        DISPUTE_WORKFLOW_READ_PERMISSION,
        DISPUTE_WORKFLOW_UPDATE_PERMISSION,
      ]),
    );
  });

  it("renders page title and stage process details", async () => {
    render(<DetailDisputeWorkflowPage />);

    expect(
      screen.getByRole("heading", { name: /View Dispute Workflow/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Business Layer")).toBeInTheDocument();
    expect(screen.getByText("Budget Approval")).toBeInTheDocument();
  });

  it("renders reject reason table data from API detail", async () => {
    render(<DetailDisputeWorkflowPage />);

    await waitFor(() => {
      expect(screen.getByText("Policy Violation")).toBeInTheDocument();
    });

    expect(screen.getByText("Non Dispute")).toBeInTheDocument();
    expect(screen.getByText("Tax Staff")).toBeInTheDocument();
    expect(screen.getByText("Another stage")).toBeInTheDocument();
    expect(screen.getAllByText("Budget Approval").length).toBe(2);
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("navigates back to list when Back button is clicked", async () => {
    const user = userEvent.setup();
    render(<DetailDisputeWorkflowPage />);

    const backButton = screen.getByRole("button", { name: /Back/i });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/master-data/dispute-workflow");
  });

  it("navigates to edit page when Edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<DetailDisputeWorkflowPage />);

    const editButton = screen.getByRole("button", { name: /Edit/i });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/master-data/dispute-workflow/budget-approval/edit",
      expect.objectContaining({
        state: expect.objectContaining({ stageProcess: "budget-approval" }),
      }),
    );
  });
});
