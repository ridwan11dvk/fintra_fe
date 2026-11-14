import type { TaxableItemResponse } from "@/features/master-data";
import { taxableItemColumns } from "@/features/master-data/taxable-item/components/taxable-item-columns";
import type { TableActionHandlers } from "@railfinance/core";
import { flexRender } from "@tanstack/react-table";
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
      ColumnHeader: ({
        column,
        align,
      }: {
        column: { id: string };
        align?: string;
      }) => (
        <div data-testid="column-header" data-align={align}>
          {column.id}
        </div>
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
      Badge: ({
        children,
        variant,
      }: {
        children?: React.ReactNode;
        variant?: string;
      }) => <span data-testid={`badge-${variant}`}>{children}</span>,
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

const mockHandlers: TableActionHandlers<TaxableItemResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("taxableItemColumns", () => {
  it("returns an array of 10 columns", () => {
    const columns = taxableItemColumns(mockHandlers);
    expect(columns).toHaveLength(10);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "code",
      "altCode",
      "name",
      "type",
      "level",
      "parent",
      "module",
      "isActive",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("isActive column has enableSorting: false", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isActiveCol = columns.find(
      (col) => (col.accessorKey ?? col.id) === "isActive",
    );
    expect(isActiveCol?.enableSorting).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      if ((col.id ?? col.accessorKey) === "module") return;
      expect(col.meta).toBeDefined();
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("meta.title values match expected column labels", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Code",
      "Alt Code",
      "Name",
      "Type",
      "Level",
      "Parent",
      undefined,
      "Status",
      "Actions",
    ]);
  });

  it("renders number cell with row index + 1", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
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

  it("renders code cell with tax code value", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "code");
    if (!codeCol?.cell) return;

    render(
      flexRender(codeCol.cell, {
        row: { index: 0, original: {}, getValue: () => "GOODS-001" },
        column: { id: "code" },
        getValue: () => "GOODS-001",
        renderValue: () => "GOODS-001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("GOODS-001")).toBeInTheDocument();
  });

  it("renders code cell with dash when empty", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "code");
    if (!codeCol?.cell) return;

    render(
      flexRender(codeCol.cell, {
        row: { index: 0, original: {}, getValue: () => undefined },
        column: { id: "code" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders name cell with name value", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "name");
    if (!nameCol?.cell) return;

    render(
      flexRender(nameCol.cell, {
        row: { index: 0, original: {}, getValue: () => "Electronic Goods" },
        column: { id: "name" },
        getValue: () => "Electronic Goods",
        renderValue: () => "Electronic Goods",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Electronic Goods")).toBeInTheDocument();
  });

  it("renders type cell with type badge for GOODS", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const typeCol = columns.find((col) => col.accessorKey === "type");
    if (!typeCol?.cell) return;

    render(
      flexRender(typeCol.cell, {
        row: { index: 0, original: { type: "GOODS" } },
        column: { id: "type" },
        getValue: () => "GOODS",
        renderValue: () => "GOODS",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("GOODS")).toBeInTheDocument();
  });

  it("renders type cell with type badge for SERVICE", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const typeCol = columns.find((col) => col.accessorKey === "type");
    if (!typeCol?.cell) return;

    render(
      flexRender(typeCol.cell, {
        row: { index: 0, original: { type: "SERVICE" } },
        column: { id: "type" },
        getValue: () => "SERVICE",
        renderValue: () => "SERVICE",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("SERVICE")).toBeInTheDocument();
  });

  it("renders level cell centered", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const levelCol = columns.find((col) => col.accessorKey === "level");
    if (!levelCol?.cell) return;

    render(
      flexRender(levelCol.cell, {
        row: { index: 0, original: {}, getValue: () => 3 },
        column: { id: "level" },
        getValue: () => 3,
        renderValue: () => 3,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders parent cell with parent name", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const parentCol = columns.find((col) => col.accessorKey === "parent");
    if (!parentCol?.cell) return;

    render(
      flexRender(parentCol.cell, {
        row: {
          index: 0,
          original: {
            parent: { id: 1, name: "Parent Item" },
          },
        },
        column: { id: "parent" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Parent Item")).toBeInTheDocument();
  });

  it("renders parent cell with dash when no parent", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const parentCol = columns.find((col) => col.accessorKey === "parent");
    if (!parentCol?.cell) return;

    render(
      flexRender(parentCol.cell, {
        row: {
          index: 0,
          original: { parent: null },
        },
        column: { id: "parent" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders module cell with badge when module exists", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const moduleCol = columns.find((col) => col.accessorKey === "module");
    if (!moduleCol?.cell) return;

    render(
      flexRender(moduleCol.cell, {
        row: {
          index: 0,
          original: {
            module: { id: 1, name: "Sales", code: "SALES", isActive: true },
          },
        },
        column: { id: "module" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Sales")).toBeInTheDocument();
  });

  it("renders module cell with nothing when module does not exist", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const moduleCol = columns.find((col) => col.accessorKey === "module");
    if (!moduleCol?.cell) return;

    render(
      flexRender(moduleCol.cell, {
        row: {
          index: 0,
          original: {},
        },
        column: { id: "module" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.queryByTestId(/^badge-/)).toBeNull();
  });

  it("renders isActive cell with status badge active", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isActiveCol = columns.find((col) => col.accessorKey === "isActive");
    if (!isActiveCol?.cell) return;

    render(
      flexRender(isActiveCol.cell, {
        row: { index: 0, original: { isActive: true } },
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

  it("renders isActive cell with status badge inactive", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isActiveCol = columns.find((col) => col.accessorKey === "isActive");
    if (!isActiveCol?.cell) return;

    render(
      flexRender(isActiveCol.cell, {
        row: { index: 0, original: { isActive: false } },
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

  it("renders number column header with 'No.' text", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "number");
    if (!numberCol?.header) return;
    render(flexRender(numberCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders header with ColumnHeader component for standard columns", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "code");
    if (!codeCol?.header) return;
    render(
      flexRender(codeCol.header, {
        column: { id: "code" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders module header with 'Module' text", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const moduleCol = columns.find((col) => col.accessorKey === "module");
    if (!moduleCol?.header) return;
    render(flexRender(moduleCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("Module")).toBeInTheDocument();
  });

  it("renders actions header with 'Actions' text", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.header) return;
    render(flexRender(actionsCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders action buttons in actions cell", () => {
    const columns = taxableItemColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;

    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockData },
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

  it("calls onEdit when edit action button is clicked", async () => {
    const onEdit = vi.fn();
    const handlers = { ...mockHandlers, onEdit };
    const columns = taxableItemColumns(handlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;

    const { findByTestId } = render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockData },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    const btn = await findByTestId("action-btn-edit");
    btn.click();
    expect(onEdit).toHaveBeenCalledWith(mockData);
  });

  it("calls onDelete when delete action button is clicked", async () => {
    const onDelete = vi.fn();
    const handlers = { ...mockHandlers, onDelete };
    const columns = taxableItemColumns(handlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;

    const { findByTestId } = render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockData },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    const btn = await findByTestId("action-btn-delete");
    btn.click();
    expect(onDelete).toHaveBeenCalledWith(mockData);
  });
});

const mockData: TaxableItemResponse = {
  id: 1,
  code: "GOODS-001",
  name: "Electronic Goods",
  level: 1,
  type: "GOODS",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};
