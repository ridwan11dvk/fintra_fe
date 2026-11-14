import { toast } from "@railfinance/core";
import { ApprovalLevelModal } from "@/features/master-data/approval-workflow/components/approval-level-modal";
import type { ApprovalLevelItem } from "@/features/master-data/approval-workflow/data";
import { fireEvent } from "@testing-library/react";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  };
});

describe("ApprovalLevelModal Component", () => {
  it("renders modal content when open is true", async () => {
    render(
      <ApprovalLevelModal
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        totalLevels={1}
      />,
    );

    expect(screen.getByText("Add Approval Level")).toBeInTheDocument();
    expect(screen.getByText("Stage Process Category")).toBeInTheDocument();
    expect(screen.getByText("Stage Process Name")).toBeInTheDocument();
    expect(screen.getByText("Output Step")).toBeInTheDocument();
    expect(screen.getByText("Role Setting")).toBeInTheDocument();
  });

  it("populates fields when editing an existing level", async () => {
    const existingLevel: ApprovalLevelItem = {
      id: "lvl-1",
      order: 1,
      layer: "FINANCIAL",
      categoryName: "Financial",
      title: "financial-approval",
      processName: "Financial Approval",
      description: "Approve payment requests",
      outputStep: "Approved Step",
      roleSetting: "manually",
      roleName: "Role 1",
    };

    render(
      <ApprovalLevelModal
        open={true}
        onOpenChange={vi.fn()}
        editingLevel={existingLevel}
        onSave={vi.fn()}
        totalLevels={1}
      />,
    );

    expect(screen.getByText("Edit Approval Level")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Approved Step")).toBeInTheDocument();
    const fields = screen.getAllByRole("combobox");
    expect(fields[0]).toBeDisabled();
    expect(fields[1]).toBeDisabled();
    expect(fields[2]).toBeEnabled();
  });

  it("rejects a legacy placeholder role that is absent from active role options", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<ApprovalLevelModal
      open={true}
      onOpenChange={vi.fn()}
      onSave={onSave}
      totalLevels={1}
      editingLevel={{
        id: "legacy", order: 1, layer: "FINANCIAL", title: "financial-approval",
        description: "Approved", outputStep: "Approved", roleSetting: "manually", roleName: "ROLE_1",
      }}
    />);
    await user.click(screen.getAllByRole("combobox").at(-1)!);
    await screen.findByRole("option", { name: "Finance Manager" });
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSave).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Please select an active Role Name");
  });

  it("allows switching role setting to limit-based", async () => {
    const user = userEvent.setup();
    render(
      <ApprovalLevelModal
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        totalLevels={1}
      />,
    );

    const limitBasedRadio = screen.getByLabelText(/Limit Based/i);
    await user.click(limitBasedRadio);

    await waitFor(() => {
      expect(screen.getByText("Limit Amount")).toBeInTheDocument();
      expect(screen.getByText("Add Limit")).toBeInTheDocument();
    });
  });

  it("calls onOpenChange(false) when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <ApprovalLevelModal
        open={true}
        onOpenChange={onOpenChange}
        onSave={vi.fn()}
        totalLevels={1}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("loads role options from useGetRoleOptions and renders in dropdown", async () => {
    render(
      <ApprovalLevelModal
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        totalLevels={1}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Select Role")).toBeInTheDocument();
    });

    const roleTrigger = screen.getByText("Select Role").closest("button");
    expect(roleTrigger).toBeInTheDocument();
    if (roleTrigger) {
      fireEvent.pointerDown(roleTrigger, { button: 0 });
      fireEvent.keyDown(roleTrigger, { key: "ArrowDown" });
    }

    await waitFor(() => {
      expect(screen.getByText("Department Head")).toBeInTheDocument();
      expect(screen.getByText("Finance Reviewer")).toBeInTheDocument();
    });
  });

  it("automatically formats limit amount with commas when typing", async () => {
    const user = userEvent.setup();
    render(
      <ApprovalLevelModal
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        totalLevels={1}
      />,
    );

    const limitBasedRadio = screen.getByLabelText(/Limit Based/i);
    await user.click(limitBasedRadio);

    await waitFor(() => {
      expect(screen.getByDisplayValue("5,000,000,000")).toBeInTheDocument();
    });

    const maxInput = screen.getByDisplayValue("5,000,000,000");
    await user.clear(maxInput);
    await user.type(maxInput, "2000000");

    expect(screen.getByDisplayValue("2,000,000")).toBeInTheDocument();

    const addLimitBtn = screen.getByRole("button", { name: /Add Limit/i });
    await user.click(addLimitBtn);

    await waitFor(() => {
      expect(screen.getByDisplayValue("2,000,001")).toBeInTheDocument();
    });
  });

  it("RF-BUG-103: adds +1 rupiah to minAmount for row 2 and subsequent limit rows", async () => {
    const user = userEvent.setup();
    render(
      <ApprovalLevelModal
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        totalLevels={1}
      />,
    );

    const limitBasedRadio = screen.getByLabelText(/Limit Based/i);
    await user.click(limitBasedRadio);

    // Initial limit has min: 0 and max: 5,000,000,000
    await waitFor(() => {
      expect(screen.getByDisplayValue("5,000,000,000")).toBeInTheDocument();
    });

    const addLimitBtn = screen.getByRole("button", { name: /Add Limit/i });
    await user.click(addLimitBtn);

    // Row 2 minAmount must be 5,000,000,001 (+1 rupiah)
    await waitFor(() => {
      expect(screen.getByDisplayValue("5,000,000,001")).toBeInTheDocument();
    });

    // Enter Row 2 maxAmount: 10,000,000,000
    const inputs = screen.getAllByRole("textbox");
    // Find the empty maxAmount input for row 2
    const row2Max = inputs[inputs.length - 1];
    await user.type(row2Max, "10000000000");
    expect(screen.getByDisplayValue("10,000,000,000")).toBeInTheDocument();

    // Click Add Limit again for Row 3
    await user.click(addLimitBtn);

    // Row 3 minAmount must be 10,000,000,001 (+1 rupiah)
    await waitFor(() => {
      expect(screen.getByDisplayValue("10,000,000,001")).toBeInTheDocument();
    });
  });

    it("disables stage process name until a stage process category is selected", async () => {
      render(
        <ApprovalLevelModal
          open={true}
          onOpenChange={vi.fn()}
          onSave={vi.fn()}
          totalLevels={1}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("Select Category first")).toBeInTheDocument();
      });

      const processTrigger = screen.getByText("Select Category first").closest("button");
      expect(processTrigger).toBeInTheDocument();
      expect(processTrigger).toBeDisabled();
    });
  });
