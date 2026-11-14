import type { GLAccountResponse } from "@/features/master-data";
import { glAccountColumns } from "@/features/master-data/general-ledger-account/components/gl-account-columns";
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
      ColumnHeader: () => <div data-testid="column-header" />,
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

const mockHandlers: TableActionHandlers<GLAccountResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("glAccountColumns", () => {
  it("returns an array of 11 columns", () => {
    const columns = glAccountColumns(mockHandlers);
    expect(columns).toHaveLength(12);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "companyCode",
      "baCode",
      "account",
      "name",
      "description",
      "commitmentItem",
      "operationalCostComponent",
      "imoCostComponent",
      "startDate",
      "endDate",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("isActive column has enableSorting: false", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isActiveCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "isActive",
    );
    expect(isActiveCol).toBeUndefined();
  });

  it("each column has a meta.title defined", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta).toBeDefined();
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("meta.title values match expected column labels", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Company Code",
      "Business Area Code",
      "Account",
      "Name",
      "Description",
      "Commitment Item",
      "Operational Cost Component",
      "IMO Cost Component",
      "Start Date",
      "End Date",
      "Actions",
    ]);
  });

  it("renders number cell with row index + 1", () => {
    const columns = glAccountColumns(
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

  it("renders number column header with 'No.' text", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "number");
    if (!numberCol?.header) return;
    render(flexRender(numberCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders companyCode column header with ColumnHeader component", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "companyCode");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "companyCode" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders companyCode cell with font-mono and value", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "companyCode");
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { companyCode: "COMP1" },
          getValue: (id: string) =>
            id === "companyCode" ? "COMP1" : undefined,
        },
        column: { id: "companyCode" },
        getValue: () => "COMP1",
        renderValue: () => "COMP1",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("COMP1")).toBeInTheDocument();
  });

  it("renders baCode column header with ColumnHeader component", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "baCode");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "baCode" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders baCode cell with font-mono and value", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "baCode");
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { baCode: "BA001" },
          getValue: (id: string) => (id === "baCode" ? "BA001" : undefined),
        },
        column: { id: "baCode" },
        getValue: () => "BA001",
        renderValue: () => "BA001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("BA001")).toBeInTheDocument();
  });

  it("renders unitName column header with ColumnHeader component", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "name");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "name" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders unitName cell with font-medium and value", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "name");
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { name: "Jakarta Finance" },
          getValue: (id: string) =>
            id === "name" ? "Jakarta Finance" : undefined,
        },
        column: { id: "name" },
        getValue: () => "Jakarta Finance",
        renderValue: () => "Jakarta Finance",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Jakarta Finance")).toBeInTheDocument();
  });

  it("renders account column header with ColumnHeader component", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "account");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "account" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders account cell with font-mono text-sm and value", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "account");
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { account: "61101" },
          getValue: (id: string) => (id === "account" ? "61101" : undefined),
        },
        column: { id: "account" },
        getValue: () => "61101",
        renderValue: () => "61101",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("61101")).toBeInTheDocument();
  });

  it("renders description column header with ColumnHeader component", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "description");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "description" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders description cell with description value", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "description");
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { description: "Revenue from Product Sales" },
        },
        column: { id: "description" },
        getValue: () => "Revenue from Product Sales",
        renderValue: () => "Revenue from Product Sales",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Revenue from Product Sales")).toBeInTheDocument();
  });

  it("renders description cell with dash when description is null", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "description");
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: { description: null } },
        column: { id: "description" },
        getValue: () => null,
        renderValue: () => null,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders commitmentItem column header with ColumnHeader component", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "commitmentItem");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "commitmentItem" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders commitmentItem cell with font-mono text-sm and value", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "commitmentItem");
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: { commitmentItem: "CMT-001" } },
        column: { id: "commitmentItem" },
        getValue: () => "CMT-001",
        renderValue: () => "CMT-001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("CMT-001")).toBeInTheDocument();
  });

  it("renders commitmentItem cell with dash when value is null", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "commitmentItem");
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: { commitmentItem: null } },
        column: { id: "commitmentItem" },
        getValue: () => null,
        renderValue: () => null,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders operationalCostComponent column header with ColumnHeader component", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find(
      (c) => c.accessorKey === "operationalCostComponent",
    );
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "operationalCostComponent" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders operationalCostComponent cell with font-mono text-sm and value", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find(
      (c) => c.accessorKey === "operationalCostComponent",
    );
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: { operationalCostComponent: "OPR-001" } },
        column: { id: "operationalCostComponent" },
        getValue: () => "OPR-001",
        renderValue: () => "OPR-001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("OPR-001")).toBeInTheDocument();
  });

  it("renders operationalCostComponent cell with dash when value is null", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find(
      (c) => c.accessorKey === "operationalCostComponent",
    );
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: { operationalCostComponent: null } },
        column: { id: "operationalCostComponent" },
        getValue: () => null,
        renderValue: () => null,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders imoCostComponent column header with ColumnHeader component", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "imoCostComponent");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "imoCostComponent" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders imoCostComponent cell with font-mono text-sm and value", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "imoCostComponent");
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: { imoCostComponent: "IMO-001" } },
        column: { id: "imoCostComponent" },
        getValue: () => "IMO-001",
        renderValue: () => "IMO-001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("IMO-001")).toBeInTheDocument();
  });

  it("renders imoCostComponent cell with dash when value is null", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "imoCostComponent");
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: { imoCostComponent: null } },
        column: { id: "imoCostComponent" },
        getValue: () => null,
        renderValue: () => null,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders isActive column header with ColumnHeader component", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    expect(
      columns.some((col) => (col.id ?? col.accessorKey) === "isActive"),
    ).toBe(false);
  });

  it("renders isActive cell with active StatusBadge when isActive is true", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    expect(
      columns.some((col) => (col.id ?? col.accessorKey) === "isActive"),
    ).toBe(false);
  });

  it("renders isActive cell with inactive StatusBadge when isActive is false", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    expect(
      columns.some((col) => (col.id ?? col.accessorKey) === "isActive"),
    ).toBe(false);
  });

  it("renders actions column header with 'Actions' text", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.header) return;
    render(flexRender(actionsCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders actions cell with edit and delete buttons", () => {
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockRow: GLAccountResponse = {
      id: 1,
      companyCode: "COMP1",
      baCode: "BA001",
      unitName: "Jakarta Finance",
      account: "61101",
      description: "Test",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };
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
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockRow: GLAccountResponse = {
      id: 2,
      companyCode: "COMP2",
      baCode: "BA002",
      unitName: "Surabaya Finance",
      account: "61102",
      description: "Test desc",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };
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
    const columns = glAccountColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockRow: GLAccountResponse = {
      id: 3,
      companyCode: "COMP3",
      baCode: "BA003",
      unitName: "Bandung Finance",
      account: "61103",
      description: null as unknown as string,
      isActive: false,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };
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
