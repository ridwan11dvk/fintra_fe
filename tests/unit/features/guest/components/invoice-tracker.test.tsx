import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";
import { FileText } from "lucide-react";
import { InvoiceTracker, type Step } from "@/features/guest/components/invoice-tracker";

const horizontalSteps: Step[] = [
  { label: "Submitted", status: "completed" },
  { label: "Verification", status: "current" },
  { label: "Paid", status: "pending" },
];

const verticalSteps: Step[] = [
  {
    label: "Submitted",
    status: "completed",
    description: "Received",
    icon: FileText,
  },
  { label: "Verification", status: "current", description: "In progress" },
  { label: "Paid", status: "pending", description: "Waiting" },
];

describe("InvoiceTracker", () => {
  it("renders horizontal tracker with progress and labels", () => {
    render(<InvoiceTracker steps={horizontalSteps} orientation="horizontal" />);

    expect(
      screen.getByLabelText(/invoice progress: 33% complete, 1 of 3 steps completed/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Submitted")).toBeInTheDocument();
    expect(screen.getByText("Verification")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { hidden: true })).toHaveAttribute(
      "aria-valuetext",
      "Invoice progress: 1 of 3 steps completed",
    );
  });

  it("renders vertical tracker with descriptions and current step", () => {
    render(<InvoiceTracker steps={verticalSteps} orientation="vertical" />);

    expect(screen.getByText("Received")).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("Waiting")).toBeInTheDocument();
    const current = screen.getByLabelText(/step 2 of 3: verification, in progress/i);
    expect(current).toHaveAttribute("aria-current", "step");
  });

  it("supports clicking steps when interactive", async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();

    render(
      <InvoiceTracker
        steps={horizontalSteps}
        orientation="horizontal"
        interactive
        onStepClick={onStepClick}
      />,
    );

    await user.click(screen.getByRole("button", { name: /click to view details for submitted/i }));
    expect(onStepClick).toHaveBeenCalledWith(0, horizontalSteps[0]);

    await user.click(screen.getByRole("button", { name: "Submitted" }));
    expect(onStepClick).toHaveBeenCalledWith(0, horizontalSteps[0]);
  });

  it("renders custom aria-label when provided", () => {
    render(
      <InvoiceTracker
        steps={horizontalSteps}
        aria-label="Custom invoice progress"
      />,
    );

    expect(
      screen.getByLabelText("Custom invoice progress"),
    ).toBeInTheDocument();
  });
});
