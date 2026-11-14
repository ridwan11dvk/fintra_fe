import type { TermOfPaymentResponse } from "@/features/master-data";
import { termOfPaymentColumns } from "@/features/master-data/term-of-payment/components/term-of-payment-columns";
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
      Badge: ({
        children,
        className,
      }: {
        children: React.ReactNode;
        className?: string;
      }) => <span className={className}>{children}</span>,
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

const mockHandlers: TableActionHandlers<TermOfPaymentResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("termOfPaymentColumns", () => {
  it("returns an array of 8 columns", () => {
    const columns = termOfPaymentColumns(mockHandlers);
    expect(columns).toHaveLength(8);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "code",
      "name",
      "numberOfDays",
      "calculationType",
      "discount",
      "isActive",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("discount column has enableSorting: false", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const discountCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "discount",
    );
    expect(discountCol?.enableSorting).toBe(false);
  });

  it("isActive column has enableSorting: false", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isActiveCol = columns.find(
      (col) => (col.accessorKey ?? col.id) === "isActive",
    );
    expect(isActiveCol?.enableSorting).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta).toBeDefined();
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("meta.title values match expected column labels", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Code",
      "Name",
      "Days",
      "Calculation",
      "Discount",
      "Status",
      "Actions",
    ]);
  });

  it("renders number cell with row index + 1", () => {
    const columns = termOfPaymentColumns(
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
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "number");
    if (!numberCol?.header) return;
    render(flexRender(numberCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders code column header with ColumnHeader component", () => {
    const columns = termOfPaymentColumns(
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

  it("renders code column cell with font-mono class", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "code");
    if (!codeCol?.cell) return;
    render(
      flexRender(codeCol.cell, {
        row: {
          index: 0,
          original: { code: "NET_30" },
          getValue: () => "NET_30",
        },
        column: { id: "code" },
        getValue: () => "NET_30",
        renderValue: () => "NET_30",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("NET_30")).toBeInTheDocument();
  });

  it("renders name column header with ColumnHeader component", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "name");
    if (!nameCol?.header) return;
    render(
      flexRender(nameCol.header, {
        column: { id: "name" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders name column cell with name value", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "name");
    if (!nameCol?.cell) return;
    render(
      flexRender(nameCol.cell, {
        row: {
          index: 0,
          original: { name: "Net 30" },
          getValue: () => "Net 30",
        },
        column: { id: "name" },
        getValue: () => "Net 30",
        renderValue: () => "Net 30",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Net 30")).toBeInTheDocument();
  });

  it("renders days column header with ColumnHeader component", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const daysCol = columns.find((col) => col.accessorKey === "numberOfDays");
    if (!daysCol?.header) return;
    render(
      flexRender(daysCol.header, {
        column: { id: "numberOfDays" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders days column cell with 'days' suffix", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const daysCol = columns.find((col) => col.accessorKey === "numberOfDays");
    if (!daysCol?.cell) return;
    render(
      flexRender(daysCol.cell, {
        row: {
          index: 0,
          original: { numberOfDays: 30 },
          getValue: () => 30,
        },
        column: { id: "numberOfDays" },
        getValue: () => 30,
        renderValue: () => 30,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("30 days")).toBeInTheDocument();
  });

  it("renders calculation column header with ColumnHeader component", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const calcCol = columns.find(
      (col) => col.accessorKey === "calculationType",
    );
    if (!calcCol?.header) return;
    render(
      flexRender(calcCol.header, {
        column: { id: "calculationType" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders calculation cell with 'Calendar Days' for CALENDAR_DAYS", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const calcCol = columns.find(
      (col) => col.accessorKey === "calculationType",
    );
    if (!calcCol?.cell) return;
    render(
      flexRender(calcCol.cell, {
        row: {
          index: 0,
          original: { calculationType: "CALENDAR_DAYS" },
          getValue: () => "CALENDAR_DAYS",
        },
        column: { id: "calculationType" },
        getValue: () => "CALENDAR_DAYS",
        renderValue: () => "CALENDAR_DAYS",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Calendar Days")).toBeInTheDocument();
  });

  it("renders calculation cell with 'Working Days' for WORKING_DAYS", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const calcCol = columns.find(
      (col) => col.accessorKey === "calculationType",
    );
    if (!calcCol?.cell) return;
    render(
      flexRender(calcCol.cell, {
        row: {
          index: 0,
          original: { calculationType: "WORKING_DAYS" },
          getValue: () => "WORKING_DAYS",
        },
        column: { id: "calculationType" },
        getValue: () => "WORKING_DAYS",
        renderValue: () => "WORKING_DAYS",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Working Days")).toBeInTheDocument();
  });

  it("renders discount column header with 'Discount' text", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const discountCol = columns.find((col) => col.id === "discount");
    if (!discountCol?.header) return;
    render(flexRender(discountCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("Discount")).toBeInTheDocument();
  });

  it("renders discount cell with 'None' when discount is null", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const discountCol = columns.find((col) => col.id === "discount");
    if (!discountCol?.cell) return;
    render(
      flexRender(discountCol.cell, {
        row: {
          index: 0,
          original: { discount: null, discountType: null },
          getValue: () => undefined,
        },
        column: { id: "discount" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("renders discount cell with 'None' when discount is 0", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const discountCol = columns.find((col) => col.id === "discount");
    if (!discountCol?.cell) return;
    render(
      flexRender(discountCol.cell, {
        row: {
          index: 0,
          original: { discount: 0, discountType: "PERCENTAGE" },
          getValue: () => 0,
        },
        column: { id: "discount" },
        getValue: () => 0,
        renderValue: () => 0,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("renders discount cell with percentage format when discountType is PERCENTAGE", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const discountCol = columns.find((col) => col.id === "discount");
    if (!discountCol?.cell) return;
    render(
      flexRender(discountCol.cell, {
        row: {
          index: 0,
          original: { discount: 5, discountType: "PERCENTAGE" },
          getValue: () => 5,
        },
        column: { id: "discount" },
        getValue: () => 5,
        renderValue: () => 5,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("5%")).toBeInTheDocument();
  });

  it("renders discount cell with plain value when discountType is VALUE", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const discountCol = columns.find((col) => col.id === "discount");
    if (!discountCol?.cell) return;
    render(
      flexRender(discountCol.cell, {
        row: {
          index: 0,
          original: { discount: 10000, discountType: "VALUE" },
          getValue: () => 10000,
        },
        column: { id: "discount" },
        getValue: () => 10000,
        renderValue: () => 10000,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("10000")).toBeInTheDocument();
  });

  it("renders isActive column header with ColumnHeader component", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isActiveCol = columns.find((col) => col.accessorKey === "isActive");
    if (!isActiveCol?.header) return;
    render(
      flexRender(isActiveCol.header, {
        column: { id: "isActive" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders isActive cell with active StatusBadge when isActive is true", () => {
    const columns = termOfPaymentColumns(
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

  it("renders isActive cell with inactive StatusBadge when isActive is false", () => {
    const columns = termOfPaymentColumns(
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

  it("renders actions column header with 'Actions' text", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.header) return;
    render(flexRender(actionsCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders actions cell with edit and delete buttons", () => {
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockRow: TermOfPaymentResponse = {
      id: 1,
      code: "NET_30",
      name: "Net 30",
      description: "Test",
      numberOfDays: 30,
      calculationType: "CALENDAR_DAYS",
      discount: null,
      discountType: null,
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
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockRow: TermOfPaymentResponse = {
      id: 2,
      code: "NET_15",
      name: "Net 15",
      numberOfDays: 15,
      calculationType: "CALENDAR_DAYS",
      discount: null,
      discountType: null,
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
    const columns = termOfPaymentColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockRow: TermOfPaymentResponse = {
      id: 3,
      code: "NET_60",
      name: "Net 60",
      numberOfDays: 60,
      calculationType: "WORKING_DAYS",
      discount: null,
      discountType: null,
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
