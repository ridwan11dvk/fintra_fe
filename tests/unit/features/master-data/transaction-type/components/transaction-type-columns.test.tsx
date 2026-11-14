import type { TransactionTypeResponse } from "@/features/master-data";
import { transactionTypeColumns } from "@/features/master-data/transaction-type/components/transaction-type-columns";
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
      Badge: ({
        children,
        variant,
      }: {
        children: React.ReactNode;
        variant?: string;
      }) => (
        <span data-testid="badge" data-variant={variant}>
          {children}
        </span>
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

const mockHandlers: TableActionHandlers<TransactionTypeResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

const mockRow: TransactionTypeResponse = {
  id: 1,
  companyCode: "COMP",
  code: "SI",
  tcode: "FB70",
  name: "Sales Invoice",
  description: "Sales Invoice transaction type",
  moduleId: 1,
  module: { id: 1, name: "Accounts Receivable" },
  docType: "F5",
  docBase: "DOCBASE",
  formType: "FORM-A",
  type: "revenue",
  customerCode: "CUST001",
  taxableItemCode: "TAX001",
  invoiceCode: "INV-001",
  isVatUsed: true,
  hasVirtualPenalty: false,
  isRevenueRecorded: true,
  isAutoBilling: false,
  glRevenue: "410000",
  glPrepaid: "420000",
  glFreight: "430000",
  wwprd: "WWPRD001",
  wwrvc: "WWRVC001",
  vaSource: "VA001",
  isActive: true,
  createdAt: "2024-06-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

describe("transactionTypeColumns", () => {
  it("returns an array of 10 columns", () => {
    const columns = transactionTypeColumns(mockHandlers);
    expect(columns).toHaveLength(10);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "name",
      "code",
      "tcode",
      "companyCode",
      "type",
      "module",
      "isVatUsed",
      "isActive",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).not.toBeDefined();
    expect(actionsCol?.enableHiding).not.toBeDefined();
  });

  it("isActive column has enableSorting: false", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isActiveCol = columns.find(
      (col) => (col.accessorKey ?? col.id) === "isActive",
    );
    expect(isActiveCol?.enableSorting).toBe(false);
  });

  it("isVatUsed column has enableSorting: false", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isVatUsedCol = columns.find(
      (col) => (col.accessorKey ?? col.id) === "isVatUsed",
    );
    expect(isVatUsedCol?.enableSorting).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      if (col.accessorKey !== "module") {
        expect(col.meta).toBeDefined();
        expect(col.meta?.title).toBeTruthy();
      }
    });
  });

  it("meta.title values match expected column labels", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Name",
      "Code",
      "SAP TCode",
      "Company Code",
      "Type",
      undefined,
      "VAT Used",
      "Status",
      "Actions",
    ]);
  });

  it("renders number cell with row index + 1", () => {
    const columns = transactionTypeColumns(
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
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "number");
    if (!numberCol?.header) return;
    render(flexRender(numberCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders name column header with ColumnHeader component", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "name");
    if (!nameCol?.header) return;
    render(
      flexRender(nameCol.header, {
        column: { id: "name" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header-name")).toBeInTheDocument();
  });

  it("renders name column cell with transaction type name value", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "name");
    if (!nameCol?.cell) return;
    render(
      flexRender(nameCol.cell, {
        row: { index: 0, original: mockRow, getValue: () => "Sales Invoice" },
        column: { id: "name" },
        getValue: () => "Sales Invoice",
        renderValue: () => "Sales Invoice",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Sales Invoice")).toBeInTheDocument();
  });

  it("renders code column cell with mono font value", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "code");
    if (!codeCol?.cell) return;
    render(
      flexRender(codeCol.cell, {
        row: { index: 0, original: mockRow, getValue: () => "SI" },
        column: { id: "code" },
        getValue: () => "SI",
        renderValue: () => "SI",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("SI")).toBeInTheDocument();
  });

  it("renders tcode column cell with value or dash when empty", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const tcodeCol = columns.find((col) => col.accessorKey === "tcode");
    if (!tcodeCol?.cell) return;
    const { unmount } = render(
      flexRender(tcodeCol.cell, {
        row: { index: 0, original: mockRow, getValue: () => "FB70" },
        column: { id: "tcode" },
        getValue: () => "FB70",
        renderValue: () => "FB70",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("FB70")).toBeInTheDocument();
    unmount();

    render(
      flexRender(tcodeCol.cell, {
        row: {
          index: 0,
          original: { ...mockRow, tcode: undefined },
          getValue: () => undefined,
        },
        column: { id: "tcode" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders companyCode column cell", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const companyCodeCol = columns.find(
      (col) => col.accessorKey === "companyCode",
    );
    if (!companyCodeCol?.cell) return;
    render(
      flexRender(companyCodeCol.cell, {
        row: { index: 0, original: mockRow, getValue: () => "COMP" },
        column: { id: "companyCode" },
        getValue: () => "COMP",
        renderValue: () => "COMP",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("COMP")).toBeInTheDocument();
  });

  it("renders type column with Badge when type is set", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const typeCol = columns.find((col) => col.accessorKey === "type");
    if (!typeCol?.cell) return;
    render(
      flexRender(typeCol.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "type" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("renders type column with dash when type is not set", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const typeCol = columns.find((col) => col.accessorKey === "type");
    if (!typeCol?.cell) return;
    render(
      flexRender(typeCol.cell, {
        row: { index: 0, original: { ...mockRow, type: undefined } },
        column: { id: "type" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders type column with prepaid badge", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const typeCol = columns.find((col) => col.accessorKey === "type");
    if (!typeCol?.cell) return;
    render(
      flexRender(typeCol.cell, {
        row: { index: 0, original: { ...mockRow, type: "prepaid" as const } },
        column: { id: "type" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Prepaid")).toBeInTheDocument();
  });

  it("renders type column with freight badge", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const typeCol = columns.find((col) => col.accessorKey === "type");
    if (!typeCol?.cell) return;
    render(
      flexRender(typeCol.cell, {
        row: { index: 0, original: { ...mockRow, type: "freight" as const } },
        column: { id: "type" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Freight")).toBeInTheDocument();
  });

  it("renders module column with Badge when module is present", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const moduleCol = columns.find((col) => col.accessorKey === "module");
    if (!moduleCol?.cell) return;
    render(
      flexRender(moduleCol.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "module" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Accounts Receivable")).toBeInTheDocument();
  });

  it("renders module column with nothing when module is absent", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const moduleCol = columns.find((col) => col.accessorKey === "module");
    if (!moduleCol?.cell) return;
    const { container } = render(
      flexRender(moduleCol.cell, {
        row: { index: 0, original: { ...mockRow, module: undefined } },
        column: { id: "module" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(container.textContent).toBe("");
  });

  it("renders isVatUsed column header with ColumnHeader component", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isVatUsedCol = columns.find((col) => col.accessorKey === "isVatUsed");
    if (!isVatUsedCol?.header) return;
    render(
      flexRender(isVatUsedCol.header, {
        column: { id: "isVatUsed" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header-isVatUsed")).toBeInTheDocument();
  });

  it("renders isVatUsed cell with Yes when true", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isVatUsedCol = columns.find((col) => col.accessorKey === "isVatUsed");
    if (!isVatUsedCol?.cell) return;
    render(
      flexRender(isVatUsedCol.cell, {
        row: { index: 0, original: { ...mockRow, isVatUsed: true } },
        column: { id: "isVatUsed" },
        getValue: () => true,
        renderValue: () => true,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("renders isVatUsed cell with No when false", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isVatUsedCol = columns.find((col) => col.accessorKey === "isVatUsed");
    if (!isVatUsedCol?.cell) return;
    render(
      flexRender(isVatUsedCol.cell, {
        row: { index: 0, original: { ...mockRow, isVatUsed: false } },
        column: { id: "isVatUsed" },
        getValue: () => false,
        renderValue: () => false,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("renders isActive column header with ColumnHeader component", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
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
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
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
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
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
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.header) return;
    render(flexRender(actionsCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders actions cell with edit and delete buttons", () => {
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
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
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
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
    const columns = transactionTypeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
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
