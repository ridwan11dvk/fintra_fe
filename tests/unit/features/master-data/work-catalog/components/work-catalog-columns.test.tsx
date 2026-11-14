import type { WorkCatalogResponse } from "@/features/master-data/work-catalog/data/work-catalog.types";
import { workCatalogColumns } from "@/features/master-data/work-catalog/components/work-catalog-columns";
import type { TableActionHandlers } from "@railfinance/core/components/data-table";
import { flexRender } from "@tanstack/react-table";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import type { ReactElement, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@railfinance/core/components", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    Badge: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
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
  header?: (ctx: { column: { id: string } }) => ReactNode;
  cell?: (ctx: {
    row: {
      original: WorkCatalogResponse;
      getValue: (id: string) => unknown;
    };
    column: { id: string };
  }) => ReactNode;
};

const handlers: TableActionHandlers<WorkCatalogResponse> = {
  onShow: vi.fn(),
  onEdit: vi.fn(),
  onActivate: vi.fn(),
  onDeactivate: vi.fn(),
};

const mockRow: WorkCatalogResponse = {
  id: 1,
  workType: "Pengangkutan",
  isActive: true,
  subCategory: {
    id: 1,
    code: "SUB-01.1",
    name: "SUB-01.1: Operasional & Utility",
  },
  groupCategory: { id: 1, name: "Utility & Fasilitas" },
  mainCategory: { id: 1, code: "CASH", name: "Cash" },
  cashflowCategory: { id: 1, code: "CAT-A", name: "Category A" },
  procurementSchema: {
    id: 1,
    code: "GOODS",
    name: "Pengadaan Barang Murni",
  },
  description: "Jasa angkut barang",
};

function columns() {
  return workCatalogColumns(handlers) as unknown as TestColumn[];
}

function renderCell(column: TestColumn, row: WorkCatalogResponse) {
  if (!column.cell) return;
  render(
    flexRender(column.cell, {
      row: {
        original: row,
        getValue: (id: string) => row[id as keyof WorkCatalogResponse],
      },
      column: { id: column.accessorKey ?? column.id },
    } as never) as ReactElement,
  );
}

describe("workCatalogColumns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("defines catalog and action columns", () => {
    const defs = columns();

    expect(defs.map((column) => column.accessorKey ?? column.id)).toEqual([
      "workType",
      "subCategory",
      "groupCategory",
      "mainCategory",
      "cashflowCategory",
      "procurementSchema",
      "actions",
    ]);
    expect(defs.map((column) => column.meta?.title)).toEqual([
      "Work Name",
      "Sub Work Category",
      "Group Work Category",
      "Main Category / Payment Type",
      "Cashflow Category",
      "Procurement Schema",
      "Actions",
    ]);
    expect(defs.every((column) => column.enableSorting === false)).toBe(true);
    expect(defs.find((column) => column.id === "actions")?.enableHiding).toBe(
      false,
    );
  });

  it("renders work type and category values", () => {
    const [
      workTypeColumn,
      subCategoryColumn,
      groupCategoryColumn,
      mainCategoryColumn,
      cashflowCategoryColumn,
      procurementSchemaColumn,
    ] = columns();

    renderCell(workTypeColumn, mockRow);
    expect(screen.getByText("Pengangkutan")).toBeInTheDocument();

    renderCell(subCategoryColumn, mockRow);
    expect(
      screen.getByText("SUB-01.1: Operasional & Utility"),
    ).toBeInTheDocument();

    renderCell(groupCategoryColumn, mockRow);
    expect(screen.getByText("Utility & Fasilitas")).toBeInTheDocument();

    renderCell(mainCategoryColumn, mockRow);
    expect(screen.getByText("Cash")).toBeInTheDocument();

    renderCell(cashflowCategoryColumn, mockRow);
    expect(screen.getByText("Category A")).toBeInTheDocument();

    renderCell(procurementSchemaColumn, mockRow);
    expect(screen.getByText("Pengadaan Barang Murni")).toBeInTheDocument();
  });

  it("renders the actions header", () => {
    const actionColumn = columns().find((column) => column.id === "actions");
    if (!actionColumn?.header) throw new Error("actions column missing");

    render(
      flexRender(actionColumn.header, {
        column: { id: "actions" },
      } as never) as ReactElement,
    );

    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("calls show, deactivate, and edit for an active row", async () => {
    const user = userEvent.setup();
    const actionColumn = columns().find((column) => column.id === "actions");
    if (!actionColumn) throw new Error("actions column missing");

    renderCell(actionColumn, mockRow);

    await user.click(screen.getByTestId("action-show"));
    await user.click(screen.getByTestId("action-deactivate"));
    await user.click(screen.getByTestId("action-edit"));

    expect(handlers.onShow).toHaveBeenCalledWith(mockRow);
    expect(handlers.onDeactivate).toHaveBeenCalledWith(mockRow);
    expect(handlers.onEdit).toHaveBeenCalledWith(mockRow);
    expect(handlers.onActivate).not.toHaveBeenCalled();
  });

  it("calls activate for an inactive row", async () => {
    const user = userEvent.setup();
    const actionColumn = columns().find((column) => column.id === "actions");
    if (!actionColumn) throw new Error("actions column missing");
    const inactiveRow = { ...mockRow, isActive: false };

    renderCell(actionColumn, inactiveRow);

    await user.click(screen.getByTestId("action-activate"));

    expect(handlers.onActivate).toHaveBeenCalledWith(inactiveRow);
  });
});
