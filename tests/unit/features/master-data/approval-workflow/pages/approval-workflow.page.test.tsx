import { ApprovalWorkflowPage } from "@/features/master-data/approval-workflow/pages/approval-workflow.page";
import {
  APPROVAL_WORKFLOW_CREATE_PERMISSION,
  APPROVAL_WORKFLOW_CREATE_URL,
  APPROVAL_WORKFLOW_LIST_PERMISSION,
  APPROVAL_WORKFLOW_READ_PERMISSION,
  APPROVAL_WORKFLOW_UPDATE_PERMISSION,
  getApprovalWorkflowDetailUrl,
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
  };
});

describe("ApprovalWorkflowPage", () => {
  beforeEach(() => {
    localStorage.setItem(
      "activePermissions",
      JSON.stringify([
        APPROVAL_WORKFLOW_LIST_PERMISSION,
        APPROVAL_WORKFLOW_READ_PERMISSION,
        APPROVAL_WORKFLOW_CREATE_PERMISSION,
        APPROVAL_WORKFLOW_UPDATE_PERMISSION,
      ]),
    );
  });
  it("renders page header and add button", async () => {
    render(<ApprovalWorkflowPage />);

    expect(
      screen.getByText("Approval Workflow Configuration"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Approval Workflow/i }),
    ).toBeInTheDocument();
  });

  it("navigates to create page when add button is clicked", async () => {
    const user = userEvent.setup();
    render(<ApprovalWorkflowPage />);

    const addButton = screen.getByRole("button", {
      name: /Add Approval Workflow/i,
    });
    await user.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith(APPROVAL_WORKFLOW_CREATE_URL);
  });

  it("renders workflow list items retrieved from api", async () => {
    render(<ApprovalWorkflowPage />);

    await waitFor(() => {
      expect(screen.getByText("Supplier Payment")).toBeInTheDocument();
    });

    expect(screen.getByText("Advance Payment")).toBeInTheDocument();
    expect(screen.getByText("Role 1")).toBeInTheDocument();
  });

  it("navigates to detail page when view detail button is clicked", async () => {
    const user = userEvent.setup();
    render(<ApprovalWorkflowPage />);

    await waitFor(() => {
      expect(screen.getByText("Supplier Payment")).toBeInTheDocument();
    });

    const viewDetailButtons = screen.getAllByRole("button", {
      name: /View Detail/i,
    });
    await user.click(viewDetailButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      getApprovalWorkflowDetailUrl("SUPPLIER_PAYMENT"),
    );
  });

  it("navigates to edit page when edit flow button is clicked", async () => {
    const user = userEvent.setup();
    render(<ApprovalWorkflowPage />);

    await waitFor(() => {
      expect(screen.getByText("Supplier Payment")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole("button", {
      name: /Edit Flow/i,
    });
    await user.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      getApprovalWorkflowEditUrl("SUPPLIER_PAYMENT"),
    );
  });
});
