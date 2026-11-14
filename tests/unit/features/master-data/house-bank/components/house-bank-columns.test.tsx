import type { HouseBankResponse } from "@/features/master-data";
import { houseBankColumns } from "@/features/master-data/house-bank/components/house-bank-columns";
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

const mockHandlers: TableActionHandlers<HouseBankResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("houseBankColumns", () => {
  it("returns an array of 10 columns", () => {
    const columns = houseBankColumns(mockHandlers);
    expect(columns).toHaveLength(10);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "bankCode",
      "accountId",
      "accountName",
      "companyCode",
      "currencyCode",
      "accountNumber",
      "erpCode",
      "isActive",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("each column has a meta.title defined (except actions column which uses header)", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      if ((col.id ?? col.accessorKey) === "actions") return;
      expect(col.meta).toBeDefined();
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("meta.title values match expected column labels (actions has no meta)", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Bank",
      "Account ID",
      "Account Name",
      "Company Code",
      "Currency",
      "Account Number",
      "ERP Code",
      "Status",
      undefined,
    ]);
  });

  it("renders number cell with row index + 1", () => {
    const columns = houseBankColumns(
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

  it("renders bankCode column cell with value", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "bankCode");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: { index: 0, original: { bankCode: "BCA" }, getValue: () => "BCA" },
        column: { id: "bankCode" },
        getValue: () => "BCA",
        renderValue: () => "BCA",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("BCA")).toBeInTheDocument();
  });

  it("renders accountId column cell with value", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "accountId");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { accountId: "HB-BCA-001" },
          getValue: () => "HB-BCA-001",
        },
        column: { id: "accountId" },
        getValue: () => "HB-BCA-001",
        renderValue: () => "HB-BCA-001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("HB-BCA-001")).toBeInTheDocument();
  });

  it("renders accountName column cell with value", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "accountName");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { accountName: "PT Fintra - BCA" },
          getValue: () => "PT Fintra - BCA",
        },
        column: { id: "accountName" },
        getValue: () => "PT Fintra - BCA",
        renderValue: () => "PT Fintra - BCA",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("PT Fintra - BCA")).toBeInTheDocument();
  });

  it("renders companyCode column cell with value", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "companyCode");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { companyCode: "FINTRA" },
          getValue: () => "FINTRA",
        },
        column: { id: "companyCode" },
        getValue: () => "FINTRA",
        renderValue: () => "FINTRA",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("FINTRA")).toBeInTheDocument();
  });

  it("renders currencyCode column cell with value", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "currencyCode");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { currencyCode: "IDR" },
          getValue: () => "IDR",
        },
        column: { id: "currencyCode" },
        getValue: () => "IDR",
        renderValue: () => "IDR",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("IDR")).toBeInTheDocument();
  });

  it("renders accountNumber column cell with value", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "accountNumber");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { accountNumber: "1234567890" },
          getValue: () => "1234567890",
        },
        column: { id: "accountNumber" },
        getValue: () => "1234567890",
        renderValue: () => "1234567890",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("1234567890")).toBeInTheDocument();
  });

  it("renders erpCode column cell with value when present", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "erpCode");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: { index: 0, original: { erpCode: "ERP-BCA1" } },
        column: { id: "erpCode" },
        getValue: () => "ERP-BCA1",
        renderValue: () => "ERP-BCA1",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("ERP-BCA1")).toBeInTheDocument();
  });

  it("renders erpCode column cell with dash when erpCode is falsy", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "erpCode");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: { index: 0, original: { erpCode: null } },
        column: { id: "erpCode" },
        getValue: () => null,
        renderValue: () => null,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders isActive cell with active StatusBadge when isActive is true", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "isActive");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
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

  it("renders isActive cell with inactive StatusBadge when isActive is false", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "isActive");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
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
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "number");
    if (!numberCol?.header) return;
    render(flexRender(numberCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders bankCode column header with ColumnHeader component", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "bankCode");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "bankCode" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders accountId column header with ColumnHeader component", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "accountId");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "accountId" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders accountName column header with ColumnHeader component", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "accountName");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "accountName" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders companyCode column header with ColumnHeader component", () => {
    const columns = houseBankColumns(
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

  it("renders currencyCode column header with ColumnHeader component", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "currencyCode");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "currencyCode" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders accountNumber column header with ColumnHeader component", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "accountNumber");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "accountNumber" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders erpCode column header with ColumnHeader component", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "erpCode");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "erpCode" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders isActive column header with ColumnHeader component", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "isActive");
    if (!col?.header) return;
    render(
      flexRender(col.header, {
        column: { id: "isActive" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders actions column header with 'Actions' text", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.header) return;
    render(flexRender(actionsCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders actions cell with edit and delete buttons", () => {
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockRow: HouseBankResponse = {
      id: 1,
      accountId: "HB-BCA-001",
      accountNumber: "1234567890",
      accountName: "PT Fintra - BCA",
      companyCode: "FINTRA",
      currencyCode: "IDR",
      bankCode: "BCA",
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

  it("calls onEdit handler when edit button is clicked", async () => {
    const user = userEvent.setup();
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockRow: HouseBankResponse = {
      id: 2,
      accountId: "HB-BCA-002",
      accountNumber: "9876543210",
      accountName: "PT Fintra - Mandiri",
      companyCode: "FINTRA",
      currencyCode: "IDR",
      bankCode: "MANDIRI",
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

  it("calls onDelete handler when delete button is clicked", async () => {
    const user = userEvent.setup();
    const columns = houseBankColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockRow: HouseBankResponse = {
      id: 3,
      accountId: "HB-BCA-003",
      accountNumber: "5555555555",
      accountName: "PT Fintra - BNI",
      companyCode: "FINTRA",
      currencyCode: "IDR",
      bankCode: "BNI",
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
