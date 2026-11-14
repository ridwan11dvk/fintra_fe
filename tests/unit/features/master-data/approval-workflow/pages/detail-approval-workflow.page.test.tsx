import { DetailApprovalWorkflowPage } from "@/features/master-data/approval-workflow/pages/detail-approval-workflow.page";
import {
  APPROVAL_WORKFLOW_READ_PERMISSION,
  APPROVAL_WORKFLOW_UPDATE_PERMISSION,
  getApprovalWorkflowEditUrl,
} from "@/features/master-data/approval-workflow/data";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "SUPPLIER_PAYMENT" }),
  };
});

describe("DetailApprovalWorkflowPage", () => {
  beforeEach(() => {
    localStorage.setItem(
      "activePermissions",
      JSON.stringify([
        APPROVAL_WORKFLOW_READ_PERMISSION,
        APPROVAL_WORKFLOW_UPDATE_PERMISSION,
      ]),
    );
  });
  it("renders page title and workflow details", async () => {
    render(<DetailApprovalWorkflowPage />);

    expect(
      screen.getByRole("heading", { name: /View Approval Workflow/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getAllByText("Supplier Payment Workflow").length,
      ).toBeGreaterThan(0);
    });

    expect(
      screen.getByText("Workflow for supplier payments"),
    ).toBeInTheDocument();
    expect(screen.getByText("72 day")).toBeInTheDocument();
  });

  it("renders approval levels configured for the workflow", async () => {
    render(<DetailApprovalWorkflowPage />);

    await waitFor(() => {
      expect(
        screen.getAllByText("Supplier Payment Workflow").length,
      ).toBeGreaterThan(0);
    });

    expect(screen.getByText("Financial Approval")).toBeInTheDocument();
    expect(screen.getByText("Approval Step")).toBeInTheDocument();
  });

  it("navigates to edit page when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<DetailApprovalWorkflowPage />);

    await waitFor(() => {
      expect(
        screen.getAllByText("Supplier Payment Workflow").length,
      ).toBeGreaterThan(0);
    });

    const editButton = screen.getByRole("button", {
      name: /^Edit$/i,
    });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      getApprovalWorkflowEditUrl(1),
    );
  });
});
