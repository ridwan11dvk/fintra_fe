import type { CashflowGroupResponse } from "@/features/master-data/cashflow-group/data/cashflow-group.types";
import { cashflowGroupColumns } from "@/features/master-data/cashflow-group/components/cashflow-group-columns";
import type { TableActionHandlers } from "@railfinance/core/components/data-table";
import { flexRender } from "@tanstack/react-table";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import type { ReactElement, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/master-data", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    getCashflowTypeLabel: (value?: string | null) =>
      value === "PROVIDER" ? "Provider" : "Recipient/Target",
    getExceptionLabel: (value?: boolean | null) =>
      value ? "Yes" : value === false ? "No" : "—",
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

vi.mock("@railfinance/core/components/data-table", () => ({
  ColumnHeader: ({ column }: { column: { id: string } }) => (
    <div data-testid={`column-header-${column.id}`} />
  ),
}));

type TestColumn = {
  id?: string;
  accessorKey?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  meta?: { title?: string };
  cell?: (ctx: {
    row: {
      original: CashflowGroupResponse;
      getValue: (id: string) => unknown;
    };
    column: { id: string };
  }) => ReactNode;
};

const handlers: TableActionHandlers<CashflowGroupResponse> = {
  onShow: vi.fn(),
  onEdit: vi.fn(),
  onActivate: vi.fn(),
  onDeactivate: vi.fn(),
};

const activeRow: CashflowGroupResponse = {
  id: 1,
  code: "OPR-01",
  name: "Operating Receipt",
  cashflowGroupId: "1",
  cashflowGroupName: "Operating",
  cashflowType: "RECIPIENT_TARGET",
  exception: true,
  description: "Operating cash inflow",
  status: "ACTIVE",
  canDelete: true,
};

const inactiveRow: CashflowGroupResponse = {
  ...activeRow,
  id: 2,
  status: "INACTIVE",
  cashflowType: "PROVIDER",
  exception: false,
};

function columns() {
  return cashflowGroupColumns(handlers) as unknown as TestColumn[];
}

function renderCell(column: TestColumn, row: CashflowGroupResponse) {
  if (!column.cell) return;
  render(
    flexRender(column.cell, {
      row: {
        original: row,
        getValue: (id: string) => row[id as keyof CashflowGroupResponse],
      },
      column: { id: column.accessorKey ?? column.id ?? "" },
    } as never) as ReactElement,
  );
}

describe("cashflowGroupColumns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("[FSSC-CFG-001] defines group columns and action column", () => {
    const defs = columns();

    expect(defs.map((column) => column.accessorKey ?? column.id)).toEqual([
      "name",
      "cashflowGroupName",
      "cashflowType",
      "exception",
      "description",
      "action",
    ]);
    expect(defs.map((column) => column.meta?.title)).toEqual([
      "Name",
      "Cashflow group",
      "Cashflow type",
      "Exception",
      "Description",
      "Action",
    ]);
  });

  it("[FSSC-CFG-006] renders cashflow type and exception labels", () => {
    const [, , cashflowTypeColumn, exceptionColumn] = columns();

    renderCell(cashflowTypeColumn, activeRow);
    expect(screen.getByText("Recipient/Target")).toBeInTheDocument();

    renderCell(exceptionColumn, activeRow);
    expect(screen.getByText("Yes")).toBeInTheDocument();

    renderCell(cashflowTypeColumn, inactiveRow);
    expect(screen.getByText("Provider")).toBeInTheDocument();

    renderCell(exceptionColumn, inactiveRow);
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("[FSSC-CFG-008] calls show, deactivate, and edit for an active row", async () => {
    const user = userEvent.setup();
    const actionColumn = columns().find((column) => column.id === "action");
    if (!actionColumn) throw new Error("action column missing");

    renderCell(actionColumn, activeRow);

    await user.click(screen.getByTestId("action-show"));
    await user.click(screen.getByTestId("action-deactivate"));
    await user.click(screen.getByTestId("action-edit"));

    expect(handlers.onShow).toHaveBeenCalledWith(activeRow);
    expect(handlers.onDeactivate).toHaveBeenCalledWith(activeRow);
    expect(handlers.onEdit).toHaveBeenCalledWith(activeRow);
  });

  it("calls activate for an inactive row", async () => {
    const user = userEvent.setup();
    const actionColumn = columns().find((column) => column.id === "action");
    if (!actionColumn) throw new Error("action column missing");

    renderCell(actionColumn, inactiveRow);

    await user.click(screen.getByTestId("action-activate"));

    expect(handlers.onActivate).toHaveBeenCalledWith(inactiveRow);
  });
});
