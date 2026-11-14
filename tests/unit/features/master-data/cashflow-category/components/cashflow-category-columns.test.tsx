import type { CashflowCategoryResponse } from "@/features/master-data/cashflow-category/data/cashflow-category.types";
import { cashflowCategoryColumns } from "@/features/master-data/cashflow-category/components/cashflow-category-columns";
import type { TableActionHandlers } from "@railfinance/core/components/data-table";
import { flexRender } from "@tanstack/react-table";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import type { ReactElement, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
  header?: (ctx: { column: { id: string } }) => ReactNode;
  cell?: (ctx: {
    row: {
      original: CashflowCategoryResponse;
      getValue: (id: string) => unknown;
    };
    column: { id: string };
  }) => ReactNode;
};

const handlers: TableActionHandlers<CashflowCategoryResponse> = {
  onShow: vi.fn(),
  onEdit: vi.fn(),
  onActivate: vi.fn(),
  onDeactivate: vi.fn(),
};

const activeRow: CashflowCategoryResponse = {
  id: 1,
  code: "OPEX",
  name: "Operating Expense",
  description: "OPEX category",
  status: "ACTIVE",
};

const inactiveRow: CashflowCategoryResponse = {
  ...activeRow,
  id: 2,
  code: "CAPEX",
  name: "Capital Expense",
  status: "INACTIVE",
};

function columns() {
  return cashflowCategoryColumns(handlers) as unknown as TestColumn[];
}

function renderCell(column: TestColumn, row: CashflowCategoryResponse) {
  if (!column.cell) return;
  render(
    flexRender(column.cell, {
      row: {
        original: row,
        getValue: (id: string) => row[id as keyof CashflowCategoryResponse],
      },
      column: { id: column.accessorKey ?? column.id ?? "" },
    } as never) as ReactElement,
  );
}

describe("cashflowCategoryColumns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("[FSSC-CFC-001] defines code, name, description, and action columns", () => {
    const defs = columns();

    expect(defs.map((column) => column.accessorKey ?? column.id)).toEqual([
      "code",
      "name",
      "description",
      "action",
    ]);
    expect(defs.map((column) => column.meta?.title)).toEqual([
      "Code",
      "Name",
      "Description",
      "Action",
    ]);
    expect(defs.every((column) => column.enableSorting === false)).toBe(true);
    expect(defs.find((column) => column.id === "action")?.enableHiding).toBe(
      false,
    );
  });

  it("[FSSC-CFC-007] renders code and name cell values", () => {
    const [codeColumn, nameColumn, descriptionColumn] = columns();

    renderCell(codeColumn, activeRow);
    expect(screen.getByText("OPEX")).toBeInTheDocument();

    renderCell(nameColumn, activeRow);
    expect(screen.getByText("Operating Expense")).toBeInTheDocument();

    renderCell(descriptionColumn, activeRow);
    expect(screen.getByText("OPEX category")).toBeInTheDocument();
  });

  it("[FSSC-CFC-008] calls show, deactivate, and edit for an active row", async () => {
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
    expect(handlers.onActivate).not.toHaveBeenCalled();
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
