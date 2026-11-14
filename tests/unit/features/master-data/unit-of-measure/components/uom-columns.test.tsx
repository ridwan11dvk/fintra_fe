import type { UomResponse } from "@/features/master-data";
import { uomColumns } from "@/features/master-data/unit-of-measure/components/uom-columns";
import type { TableActionHandlers } from "@railfinance/core";
import { flexRender } from "@tanstack/react-table";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      useAuth: () => ({
        can: () => true,
        hasResource: () => true,
        permissions: [],
        roles: [],
        user: {},
        token: null,
        isSuperAdmin: false,
        isAuthenticated: true,
        isLoading: false,
        isRefreshing: false,
        error: null,
        logout: vi.fn(),
        scheduleTokenRefresh: vi.fn(),
      }),
      ColumnHeader: ({ column }: { column: { id: string } }) => (
        <div data-testid={`column-header-${column.id}`} />
      ),
      ActionButton: ({
        variant,
        onClick,
      }: {
        variant: string;
        onClick?: () => void;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {variant}
        </button>
      ),

      StatusBadge: ({ status }: { status: string }) => (
        <div data-testid={`status-badge-${status}`}>{status}</div>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/popover", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

type TestColumnDef = {
  id?: string;
  accessorKey?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  meta?: { title: string };
  cell?: React.ComponentType<never>;
  header?: React.ComponentType<never> | ((ctx: never) => React.ReactNode);
};

const mockHandlers: TableActionHandlers<UomResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

const mockRow: UomResponse = {
  id: 1,
  code: "KG",
  unit: "Kilogram",
  unitEn: "Kilogram",
  unitAlias: "KG",
  isActive: true,
  createdAt: "2024-06-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

describe("uomColumns", () => {
  it("returns an array of 7 columns", () => {
    const columns = uomColumns(mockHandlers);
    expect(columns).toHaveLength(7);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "code",
      "unit",
      "unitEn",
      "unitAlias",
      "isActive",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("isActive column has enableSorting: false", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const isActiveCol = columns.find(
      (col) => (col.accessorKey ?? col.id) === "isActive",
    );
    expect(isActiveCol?.enableSorting).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta).toBeDefined();
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("meta.title values match expected column labels", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Code",
      "Unit",
      "Unit (EN)",
      "Alias",
      "Status",
      "Actions",
    ]);
  });

  it("renders unitEn column cell with EN value when present", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const unitEnCol = columns.find((col) => col.accessorKey === "unitEn");
    if (!unitEnCol?.cell) return;
    render(
      flexRender(unitEnCol.cell, {
        row: {
          index: 0,
          original: { ...mockRow, unitEn: "Kilogram" },
          getValue: () => "Kilogram",
        },
        column: { id: "unitEn" },
        getValue: () => "Kilogram",
        renderValue: () => "Kilogram",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Kilogram")).toBeInTheDocument();
  });

  it("renders unitEn column cell with fallback to unit when EN is empty", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const unitEnCol = columns.find((col) => col.accessorKey === "unitEn");
    if (!unitEnCol?.cell) return;
    render(
      flexRender(unitEnCol.cell, {
        row: {
          index: 0,
          original: { ...mockRow, unitEn: null },
          getValue: () => null,
        },
        column: { id: "unitEn" },
        getValue: () => null,
        renderValue: () => null,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Kilogram")).toBeInTheDocument();
  });

  it("renders unitAlias column cell with alias value", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const aliasCol = columns.find((col) => col.accessorKey === "unitAlias");
    if (!aliasCol?.cell) return;
    render(
      flexRender(aliasCol.cell, {
        row: { index: 0, original: mockRow, getValue: () => "KG" },
        column: { id: "unitAlias" },
        getValue: () => "KG",
        renderValue: () => "KG",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("KG")).toBeInTheDocument();
  });

  it("renders number cell with row index + 1", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => (col.id ?? "") === "number");
    if (!numberCol?.cell) return;
    render(
      flexRender(numberCol.cell, {
        row: { index: 2, original: {} },
        column: { id: "number" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders number column header with 'No.' text", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "number");
    if (!numberCol?.header) return;
    render(flexRender(numberCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders code column header with ColumnHeader component", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "code");
    if (!codeCol?.header) return;
    render(
      flexRender(codeCol.header, {
        column: { id: "code" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header-code")).toBeInTheDocument();
  });

  it("renders code column cell with font-medium value", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "code");
    if (!codeCol?.cell) return;
    render(
      flexRender(codeCol.cell, {
        row: { index: 0, original: mockRow, getValue: () => "KG" },
        column: { id: "code" },
        getValue: () => "KG",
        renderValue: () => "KG",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("KG")).toBeInTheDocument();
  });

  it("renders unit column header with ColumnHeader component", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const unitCol = columns.find((col) => col.accessorKey === "unit");
    if (!unitCol?.header) return;
    render(
      flexRender(unitCol.header, {
        column: { id: "unit" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header-unit")).toBeInTheDocument();
  });

  it("renders unit column cell with unit value", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const unitCol = columns.find((col) => col.accessorKey === "unit");
    if (!unitCol?.cell) return;
    render(
      flexRender(unitCol.cell, {
        row: { index: 0, original: mockRow, getValue: () => "Kilogram" },
        column: { id: "unit" },
        getValue: () => "Kilogram",
        renderValue: () => "Kilogram",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Kilogram")).toBeInTheDocument();
  });

  it("renders isActive column header with ColumnHeader component", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const isActiveCol = columns.find((col) => col.accessorKey === "isActive");
    if (!isActiveCol?.header) return;
    render(
      flexRender(isActiveCol.header, {
        column: { id: "isActive" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header-isActive")).toBeInTheDocument();
  });

  it("renders isActive cell with active StatusBadge when isActive is true", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const isActiveCol = columns.find((col) => col.accessorKey === "isActive");
    if (!isActiveCol?.cell) return;
    render(
      flexRender(isActiveCol.cell, {
        row: { index: 0, original: { ...mockRow, isActive: true } },
        column: { id: "isActive" },
        getValue: () => true,
        renderValue: () => true,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("status-badge-active")).toBeInTheDocument();
  });

  it("renders isActive cell with inactive StatusBadge when isActive is false", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const isActiveCol = columns.find((col) => col.accessorKey === "isActive");
    if (!isActiveCol?.cell) return;
    render(
      flexRender(isActiveCol.cell, {
        row: { index: 0, original: { ...mockRow, isActive: false } },
        column: { id: "isActive" },
        getValue: () => false,
        renderValue: () => false,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("status-badge-inactive")).toBeInTheDocument();
  });

  it("renders actions column header with 'Actions' text", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.header) return;
    render(flexRender(actionsCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders actions cell with edit and delete buttons", () => {
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("action-btn-edit")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-delete")).toBeInTheDocument();
  });

  it("calls onEdit handler when edit button is clicked in actions cell", async () => {
    const user = userEvent.setup();
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    await user.click(screen.getByTestId("action-btn-edit"));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockRow);
  });

  it("calls onDelete handler when delete button is clicked in actions cell", async () => {
    const user = userEvent.setup();
    const columns = uomColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    await user.click(screen.getByTestId("action-btn-delete"));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockRow);
  });
});
