import {
  DISPUTE_WORKFLOW_READ_PERMISSION,
  DISPUTE_WORKFLOW_UPDATE_PERMISSION,
} from "@/features/master-data/dispute-workflow/data";
import { EditDisputeWorkflowPage } from "@/features/master-data/dispute-workflow/pages/edit-dispute-workflow.page";
import { server } from "@tests/unit/mocks/server";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockToastSuccess, mockToastError } = vi.hoisted(() => ({
  mockToastSuccess: vi.fn(),
  mockToastError: vi.fn(),
}));

const mockNavigate = vi.fn();

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

vi.mock("@railfinance/core/masterdata", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useGetLookupValueOptions: () => ({
      data: [],
      isLoading: false,
    }),
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

describe("EditDisputeWorkflowPage", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    localStorage.setItem(
      "activePermissions",
      JSON.stringify([
        DISPUTE_WORKFLOW_READ_PERMISSION,
        DISPUTE_WORKFLOW_UPDATE_PERMISSION,
      ]),
    );
  });

  it("renders page header and dropdowns", async () => {
    render(<EditDisputeWorkflowPage />);

    expect(
      screen.getByRole("heading", { name: /Edit Dispute Workflow/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Stage Process Category/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage Process Name/i)).toBeInTheDocument();
  });

  it("loads existing destination cards from detail API", async () => {
    render(<EditDisputeWorkflowPage />);

    await waitFor(() => {
      expect(screen.getByText(/Reject Reason Category/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/^Reject Destination/i)).toBeInTheDocument();
    expect(
      screen.getByText(/After Case Close Destination/i),
    ).toBeInTheDocument();
  });

  it("loads existing destination cards and submits with mapped role and stage codes", async () => {
    let capturedPayload: unknown = null;
    server.use(
      http.put("http://localhost:3000/master/dispute-workflow", async ({ request }) => {
        capturedPayload = await request.json();
        return HttpResponse.json({
          status: "SUCCESS",
          message: "Dispute workflow updated successfully",
        });
      }),
    );

    const user = userEvent.setup();
    render(<EditDisputeWorkflowPage />);

    await waitFor(() => {
      expect(screen.getByText(/Reject Reason Category/i)).toBeInTheDocument();
    });

    const saveButton = screen.getByRole("button", { name: /^Save$/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith("Dispute workflow updated successfully");
    });

    expect(capturedPayload).toEqual(
      expect.objectContaining({
        details: expect.arrayContaining([
          expect.objectContaining({
            nonDisputeRole: "17",
            stageProcess: "budget-approval",
          }),
        ]),
      }),
    );
  });

  it("navigates back to list when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<EditDisputeWorkflowPage />);

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith("/master-data/dispute-workflow");
  });

  it("adds a new reject destination card when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<EditDisputeWorkflowPage />);

    const addButton = screen.getByRole("button", {
      name: /Add Reject Destination/i,
    });
    await user.click(addButton);

    // Cards should now be present
    expect(screen.getAllByText("Reject Reason Category").length).toBeGreaterThanOrEqual(1);
  });

  it("shows unsaved changes modal when Cancel is clicked after form changes, and navigates on Discard", async () => {
    const user = userEvent.setup();
    render(<EditDisputeWorkflowPage />);

    // Make form dirty by adding a destination
    const addButton = screen.getByRole("button", {
      name: /Add Reject Destination/i,
    });
    await user.click(addButton);

    // Click Cancel
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelButton);

    // Modal should appear
    expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
    expect(
      screen.getByText("Do you want to save or discard changes?"),
    ).toBeInTheDocument();

    // Click Discard
    const discardButton = screen.getByRole("button", { name: /Discard/i });
    await user.click(discardButton);

    expect(mockNavigate).toHaveBeenCalledWith("/master-data/dispute-workflow");
  });

  it("displays backend error message in toast when saving fails with duplicate reject reason", async () => {
    server.use(
      http.put("http://localhost:3000/master/dispute-workflow", () => {
        return HttpResponse.json(
          {
            message: "Duplicate reject reason",
            status: "ERROR",
            errors: [
              {
                field: "rejectReasonCategory",
                message: "Duplicate reject reason",
              },
            ],
          },
          { status: 400 },
        );
      }),
    );

    const user = userEvent.setup();
    render(<EditDisputeWorkflowPage />);

    // Wait for initial detail load
    await waitFor(() => {
      expect(screen.getByText(/Reject Reason Category/i)).toBeInTheDocument();
    });

    const saveButton = screen.getByRole("button", { name: /^Save$/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Duplicate reject reason");
    });
  });
});

