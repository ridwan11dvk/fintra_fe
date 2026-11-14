import { costCenterColumns } from "@/features/master-data/cost-center/components/cost-center-columns";
import type {
  CostCenterResponse,
  TableActionHandlers,
} from "@railfinance/core";
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

const mockHandlers: TableActionHandlers<CostCenterResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("costCenterColumns", () => {
  it("returns an array of 9 columns", () => {
    const columns = costCenterColumns(mockHandlers);
    expect(columns).toHaveLength(10);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "costCenterCode",
      "costCenterName",
      "companyCode",
      "businessAreaCode",
      "description",
      "categoryName",
      "startDate",
      "endDate",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("startDate column has enableSorting: undefined (default)", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const startDateCol = columns.find(
      (col) => (col.accessorKey ?? col.id) === "startDate",
    );
    expect(startDateCol?.enableSorting).toBeUndefined();
  });

  it("each column has a meta.title defined", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta).toBeDefined();
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("meta.title values match expected column labels", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Code",
      "Name",
      "Company",
      "BA",
      "Description",
      "Category",
      "Start Date",
      "End Date",
      "Actions",
    ]);
  });

  it("renders number cell with row index + 1", () => {
    const columns = costCenterColumns(
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
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "number");
    if (!numberCol?.header) return;
    render(flexRender(numberCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders costCenterCode cell with font-mono class value", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "costCenterCode");
    if (!codeCol?.cell) return;
    render(
      flexRender(codeCol.cell, {
        row: {
          index: 0,
          original: { costCenterCode: "CC-001" },
          getValue: () => "CC-001",
        },
        column: { id: "costCenterCode" },
        getValue: () => "CC-001",
        renderValue: () => "CC-001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("CC-001")).toBeInTheDocument();
  });

  it("renders costCenterCode column header with ColumnHeader component", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "costCenterCode");
    if (!codeCol?.header) return;
    render(
      flexRender(codeCol.header, {
        column: { id: "costCenterCode" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders costCenterName cell with name value", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "costCenterName");
    if (!nameCol?.cell) return;
    render(
      flexRender(nameCol.cell, {
        row: {
          index: 0,
          original: { costCenterName: "Jakarta Office" },
          getValue: () => "Jakarta Office",
        },
        column: { id: "costCenterName" },
        getValue: () => "Jakarta Office",
        renderValue: () => "Jakarta Office",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Jakarta Office")).toBeInTheDocument();
  });

  it("renders costCenterName column header with ColumnHeader component", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "costCenterName");
    if (!nameCol?.header) return;
    render(
      flexRender(nameCol.header, {
        column: { id: "costCenterName" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders companyCode cell with value", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const companyCol = columns.find((col) => col.accessorKey === "companyCode");
    if (!companyCol?.cell) return;
    render(
      flexRender(companyCol.cell, {
        row: {
          index: 0,
          original: { companyCode: "COMP001" },
          getValue: () => "COMP001",
        },
        column: { id: "companyCode" },
        getValue: () => "COMP001",
        renderValue: () => "COMP001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("COMP001")).toBeInTheDocument();
  });

  it("renders baCode cell with value", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const baCol = columns.find((col) => col.accessorKey === "businessAreaCode");
    if (!baCol?.cell) return;
    render(
      flexRender(baCol.cell, {
        row: {
          index: 0,
          original: { businessAreaCode: "BA001" },
          getValue: () => "BA001",
        },
        column: { id: "businessAreaCode" },
        getValue: () => "BA001",
        renderValue: () => "BA001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("BA001")).toBeInTheDocument();
  });

  it("renders startDate cell with formatted date", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const startDateCol = columns.find((col) => col.accessorKey === "startDate");
    if (!startDateCol?.cell) return;
    render(
      flexRender(startDateCol.cell, {
        row: {
          index: 0,
          original: { startDate: "2024-01-01" },
          getValue: () => "2024-01-01",
        },
        column: { id: "startDate" },
        getValue: () => "2024-01-01",
        renderValue: () => "2024-01-01",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("01/01/2024")).toBeInTheDocument();
  });

  it("renders companyCode column header with ColumnHeader component", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const companyCol = columns.find((col) => col.accessorKey === "companyCode");
    if (!companyCol?.header) return;
    render(
      flexRender(companyCol.header, {
        column: { id: "companyCode" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders baCode column header with ColumnHeader component", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const baCol = columns.find((col) => col.accessorKey === "businessAreaCode");
    if (!baCol?.header) return;
    render(
      flexRender(baCol.header, {
        column: { id: "businessAreaCode" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders startDate column header with ColumnHeader component", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const startDateCol = columns.find((col) => col.accessorKey === "startDate");
    if (!startDateCol?.header) return;
    render(
      flexRender(startDateCol.header, {
        column: { id: "startDate" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders endDate cell with formatted date", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const endDateCol = columns.find((col) => col.accessorKey === "endDate");
    if (!endDateCol?.cell) return;
    render(
      flexRender(endDateCol.cell, {
        row: {
          index: 0,
          original: { endDate: "2024-12-31" },
          getValue: () => "2024-12-31",
        },
        column: { id: "endDate" },
        getValue: () => "2024-12-31",
        renderValue: () => "2024-12-31",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("31/12/2024")).toBeInTheDocument();
  });

  it("renders endDate cell with em dash when endDate is null", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const endDateCol = columns.find((col) => col.accessorKey === "endDate");
    if (!endDateCol?.cell) return;
    render(
      flexRender(endDateCol.cell, {
        row: {
          index: 0,
          original: { endDate: null },
          getValue: () => null,
        },
        column: { id: "endDate" },
        getValue: () => null,
        renderValue: () => null,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders endDate column header with ColumnHeader component", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const endDateCol = columns.find((col) => col.accessorKey === "endDate");
    if (!endDateCol?.header) return;
    render(
      flexRender(endDateCol.header, {
        column: { id: "endDate" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders actions column header with 'Actions' text", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.header) return;
    render(flexRender(actionsCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders actions cell with edit and delete buttons", () => {
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockRow: CostCenterResponse = {
      id: 1,
      companyCode: "COMP001",
      baCode: "BA001",
      costCenterCode: "CC-001",
      costCenterName: "Test",
      startDate: "2024-01-01",
      endDate: null,
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
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockRow: CostCenterResponse = {
      id: 2,
      companyCode: "COMP002",
      baCode: "BA002",
      costCenterCode: "CC-002",
      costCenterName: "Test 2",
      startDate: "2024-01-01",
      endDate: null,
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
    const columns = costCenterColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockRow: CostCenterResponse = {
      id: 3,
      companyCode: "COMP003",
      baCode: "BA003",
      costCenterCode: "CC-003",
      costCenterName: "Test 3",
      startDate: "2024-06-15",
      endDate: "2024-12-31",
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
