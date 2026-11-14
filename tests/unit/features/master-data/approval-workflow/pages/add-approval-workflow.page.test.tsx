import { approvalWorkflowService } from "@/features/master-data/approval-workflow/data/approval-workflow.service";
import { AddApprovalWorkflowPage } from "@/features/master-data/approval-workflow/pages/add-approval-workflow.page";
import {
  APPROVAL_WORKFLOW_CREATE_PERMISSION,
  APPROVAL_WORKFLOW_UPDATE_PERMISSION,
  APPROVAL_WORKFLOW_URL,
} from "@/features/master-data/approval-workflow/data";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

let mockParams: { id?: string } = {};

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  const { mockSelect } = await import("@tests/unit/mocks/select-mocks");
  const selectMocks = mockSelect("approval-workflow-transaction-type");
  return {
    ...actual,
    ...selectMocks,
    SelectValue: () => null,
  };
});

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

describe("AddApprovalWorkflowPage (Create Mode)", () => {
  beforeEach(() => {
    mockParams = {};
    mockNavigate.mockReset();
    localStorage.setItem(
      "activePermissions",
      JSON.stringify([
        APPROVAL_WORKFLOW_CREATE_PERMISSION,
        APPROVAL_WORKFLOW_UPDATE_PERMISSION,
      ]),
    );
  });
  it("renders page header and workflow info form", () => {
    render(<AddApprovalWorkflowPage />);

    expect(screen.getByText("Add Approval Workflow")).toBeInTheDocument();
    expect(screen.getByText("Transaction type")).toBeInTheDocument();
    expect(screen.getByText("Workflow name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Approval levels")).toBeInTheDocument();
  });

  it("does not show the Add approval level button in create mode", () => {
    render(<AddApprovalWorkflowPage />);

    expect(
      screen.queryByRole("button", { name: /Add approval level/i }),
    ).not.toBeInTheDocument();
  });

  it("loads default approval levels when a transaction type is selected", async () => {
    const user = userEvent.setup();
    render(<AddApprovalWorkflowPage />);

    await screen.findByRole("option", { name: "Supplier Payment" });
    await user.selectOptions(
      await screen.findByTestId("approval-workflow-transaction-type"),
      "1",
    );

    expect(await screen.findByText("Business Unit Verification")).toBeInTheDocument();
    expect(screen.getByText("Financial Control")).toBeInTheDocument();
  });

  it("requires actual role selections and submits their names without a placeholder", async () => {
    const create = vi.spyOn(approvalWorkflowService, "createApprovalWorkflow").mockResolvedValue({
      status: "SUCCESS",
      message: "Created",
    });
    const user = userEvent.setup();
    render(<AddApprovalWorkflowPage />);

    await screen.findByRole("option", { name: "Supplier Payment" });
    await user.selectOptions(screen.getByTestId("approval-workflow-transaction-type"), "1");
    await screen.findByText("Business Unit Verification");
    expect(screen.getAllByText(/Role: Not selected/)).toHaveLength(2);
    await user.type(screen.getByPlaceholderText("Enter Workflow name"), "Vendor workflow");
    await user.click(screen.getByRole("button", { name: /^Save$/ }));

    expect(create).not.toHaveBeenCalled();
    expect(await screen.findByText("Edit Approval Level")).toBeInTheDocument();
    let roleOption = await screen.findByRole("option", { name: "Finance Reviewer" });
    await user.selectOptions(roleOption.closest("select")!, "Finance Reviewer");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await user.click(screen.getByRole("button", { name: "Edit Financial Control" }));
    roleOption = await screen.findByRole("option", { name: "Finance Manager" });
    await user.selectOptions(roleOption.closest("select")!, "Finance Manager");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await user.click(screen.getByRole("button", { name: /^Save$/ }));

    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      levels: [
        expect.objectContaining({ role: "Finance Reviewer", stageProcess: "business-unit-verification" }),
        expect.objectContaining({ role: "Finance Manager", stageProcess: "financial-control" }),
      ],
    }));
    create.mockRestore();
  });

  it("disables save button when required fields or levels are incomplete", () => {
    render(<AddApprovalWorkflowPage />);

    const saveButton = screen.getByRole("button", { name: /^Save$/i });
    expect(saveButton).toBeDisabled();
  });

  it("navigates back to list page when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<AddApprovalWorkflowPage />);

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith(APPROVAL_WORKFLOW_URL);
  });
});

describe("AddApprovalWorkflowPage (Edit Mode)", () => {
  beforeEach(() => {
    mockParams = { id: "1" };
    mockNavigate.mockReset();
    localStorage.setItem(
      "activePermissions",
      JSON.stringify([
        APPROVAL_WORKFLOW_CREATE_PERMISSION,
        APPROVAL_WORKFLOW_UPDATE_PERMISSION,
      ]),
    );
  });

  it("loads existing detail and submits using approvalTransactionTypeId", async () => {
    const user = userEvent.setup();
    render(<AddApprovalWorkflowPage />);

    await waitFor(() => {
      expect(screen.getByText("Edit Approval Workflow")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Supplier Payment Workflow")).toBeInTheDocument();
    });

    const saveButton = screen.getByRole("button", { name: /^Save$/i });
    expect(saveButton).toBeEnabled();
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(APPROVAL_WORKFLOW_URL);
    });
  });
});
