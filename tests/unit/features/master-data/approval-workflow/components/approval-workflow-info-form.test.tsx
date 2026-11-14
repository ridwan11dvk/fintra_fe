import { ApprovalWorkflowInfoForm } from "@/features/master-data/approval-workflow/components/approval-workflow-info-form";
import type { ApprovalWorkflowFormData } from "@/features/master-data/approval-workflow/data";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

function FormWrapper() {
  const { control } = useForm<ApprovalWorkflowFormData>({
    defaultValues: {
      transactionType: "SUPPLIER_PAYMENT",
      workflowName: "Test Workflow",
      description: "Test Description",
    },
  });

  return <ApprovalWorkflowInfoForm control={control} />;
}

describe("ApprovalWorkflowInfoForm Component", () => {
  it("renders transaction type, workflow name, and description fields", () => {
    render(<FormWrapper />);

    expect(screen.getByText("Transaction type")).toBeInTheDocument();
    expect(screen.getByText("Workflow name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter Workflow name"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter Description"),
    ).toBeInTheDocument();
  });
});
