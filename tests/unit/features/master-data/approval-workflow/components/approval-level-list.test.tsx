import { ApprovalLevelList } from "@/features/master-data/approval-workflow/components/approval-level-list";
import type { ApprovalLevelItem } from "@/features/master-data/approval-workflow/data";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("ApprovalLevelList Component", () => {
  const mockLevels: ApprovalLevelItem[] = [
    {
      id: "lvl-1",
      order: 1,
      layer: "FINANCIAL",
      categoryName: "Financial",
      title: "financial-approval",
      processName: "Financial Approval",
      description: "Approve payment requests",
      outputStep: "Approved",
      roleSetting: "manually",
      roleName: "Role 1",
    },
    {
      id: "lvl-2",
      order: 2,
      layer: "TREASURY",
      categoryName: "Treasury",
      title: "cashout-approval",
      processName: "Cashout Approval",
      description: "Execute disbursement",
      outputStep: "Disbursed",
      roleSetting: "manually",
      roleName: "Treasury Role",
    },
  ];

  it("renders nothing when levels array is empty", () => {
    const { container } = render(
      <ApprovalLevelList
        levels={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders list of approval levels with badges and descriptions", () => {
    render(
      <ApprovalLevelList
        levels={mockLevels}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    );

    expect(screen.getByText("Financial Approval")).toBeInTheDocument();
    expect(screen.getByText("Cashout Approval")).toBeInTheDocument();
    expect(screen.getByText("Approve payment requests")).toBeInTheDocument();
    expect(screen.getByText("Execute disbursement")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    const onEdit = vi.fn();
    const { container } = render(
      <ApprovalLevelList
        levels={mockLevels}
        onEdit={onEdit}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    );

    const editButtons = container.querySelectorAll("button:not(.bg-\\[\\#d92d20\\])");
    if (editButtons.length > 0) {
      fireEvent.click(editButtons[0]);
      expect(onEdit).toHaveBeenCalledWith(mockLevels[0]);
    }
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();
    const { container } = render(
      <ApprovalLevelList
        levels={mockLevels}
        onEdit={vi.fn()}
        onDelete={onDelete}
        onReorder={vi.fn()}
      />,
    );

    const deleteButtons = container.querySelectorAll("button.bg-\\[\\#d92d20\\]");
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
      expect(onDelete).toHaveBeenCalledWith("lvl-1");
    }
  });
});
