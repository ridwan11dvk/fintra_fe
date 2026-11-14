import type { StageCatalogItem } from "@/features/master-data/dispute-workflow/data/dispute-workflow.types";
import {
  DISPUTE_WORKFLOW_READ_PERMISSION,
  DISPUTE_WORKFLOW_UPDATE_PERMISSION,
} from "@/features/master-data/dispute-workflow/data/dispute-workflow.utils";
import {
  disputeWorkflowColumns,
  type DisputeWorkflowColumnHandlers,
} from "@/features/master-data/dispute-workflow/components/dispute-workflow-columns";
import { flexRender, type ColumnDef } from "@tanstack/react-table";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import type { ReactElement, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    ColumnHeader: ({ column }: { column?: { id?: string } }) => (
      <div data-testid={`column-header-${column?.id}`}>Column Header</div>
    ),
  };
});

vi.mock("@railfinance/core/components/actions", () => ({
  ActionButton: ({
    variant,
    onClick,
  }: {
    variant: string;
    onClick?: () => void;
  }) => (
    <button type="button" data-testid={`action-${variant}`} onClick={onClick}>
      {variant}
    </button>
  ),
}));

type TestColumn = ColumnDef<StageCatalogItem> & {
  accessorKey?: string;
  meta?: { title?: string };
};

const mockItemActive: StageCatalogItem = {
  stageProcessCategory: "BUSINESS_LAYER",
  stageProcessCategoryName: "Business Layer",
  stageProcess: "budget-approval",
  stageProcessName: "Budget Approval",
  disputeWorkflowActive: true,
};

const mockItemInactive: StageCatalogItem = {
  stageProcessCategory: "FINANCIAL",
  stageProcessCategoryName: "Financial",
  stageProcess: "financial-control",
  stageProcessName: "Financial Control",
  disputeWorkflowActive: false,
};

function renderCell(column: TestColumn, row: StageCatalogItem) {
  if (!column.cell) return;
  render(
    flexRender(column.cell, {
      row: {
        original: row,
        getValue: (id: string) => row[id as keyof StageCatalogItem],
      },
      column: { id: column.id ?? column.accessorKey },
    } as never) as ReactElement,
  );
}

function renderHeader(column: TestColumn) {
  if (!column.header) return;
  render(
    flexRender(column.header, {
      column: { id: column.id ?? column.accessorKey },
    } as never) as ReactElement,
  );
}

describe("disputeWorkflowColumns", () => {
  const handlers: DisputeWorkflowColumnHandlers = {
    onView: vi.fn(),
    onToggle: vi.fn(),
    onEdit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem(
      "activePermissions",
      JSON.stringify([
        DISPUTE_WORKFLOW_READ_PERMISSION,
        DISPUTE_WORKFLOW_UPDATE_PERMISSION,
      ]),
    );
  });

  it("defines the expected table columns", () => {
    const cols = disputeWorkflowColumns(handlers) as TestColumn[];
    expect(cols).toHaveLength(3);

    expect(cols[0].accessorKey).toBe("stageProcessCategoryName");
    expect(cols[0].meta?.title).toBe("Stage Process Category");
    expect(cols[0].enableSorting).toBe(false);

    expect(cols[1].accessorKey).toBe("stageProcessName");
    expect(cols[1].meta?.title).toBe("Stage Process Name");
    expect(cols[1].enableSorting).toBe(false);

    expect(cols[2].id).toBe("actions");
    expect(cols[2].meta?.title).toBe("Actions");
    expect(cols[2].enableSorting).toBe(false);
  });

  it("renders header contents properly", () => {
    const cols = disputeWorkflowColumns(handlers) as TestColumn[];

    renderHeader(cols[0]);
    renderHeader(cols[1]);
    renderHeader(cols[2]);

    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders category name and process name in cells", () => {
    const cols = disputeWorkflowColumns(handlers) as TestColumn[];

    renderCell(cols[0], mockItemActive);
    expect(screen.getByText("Business Layer")).toBeInTheDocument();

    renderCell(cols[1], mockItemActive);
    expect(screen.getByText("Budget Approval")).toBeInTheDocument();
  });

  it("triggers onView and onEdit on action buttons click and does not render toggle", async () => {
    const user = userEvent.setup();
    const cols = disputeWorkflowColumns(handlers) as TestColumn[];

    renderCell(cols[2], mockItemActive);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    // Click View
    await user.click(buttons[0]);
    expect(handlers.onView).toHaveBeenCalledWith(mockItemActive);

    // Click Edit
    await user.click(buttons[1]);
    expect(handlers.onEdit).toHaveBeenCalledWith(mockItemActive);

    // Ensure activate/deactivate toggle button is not present
    expect(screen.queryByTestId("action-activate")).not.toBeInTheDocument();
    expect(screen.queryByTestId("action-deactivate")).not.toBeInTheDocument();
  });

  it("handles missing handler callbacks safely without throwing", async () => {
    const user = userEvent.setup();
    const cols = disputeWorkflowColumns({}) as TestColumn[];

    renderCell(cols[2], mockItemActive);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    for (const btn of buttons) {
      await user.click(btn);
    }
  });
});
