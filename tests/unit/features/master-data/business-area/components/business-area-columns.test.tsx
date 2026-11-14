import { businessAreaColumns } from "@/features/master-data/business-area/components/business-area-columns";
import type { BusinessAreaResponse } from "@/features/master-data/business-area/data/business-area.types";
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
      ColumnHeader: () => <div data-testid="column-header" />,

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

const mockHandlers = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

const mockRow = {
  id: 1,
  companyCode: "PTABC",
  name: "Business Area Jakarta",
  baCode: "BA-JKT-01",
  branchCode: "BR-001",
  email: "ba.jakarta@ptabc.com",
  taxEmail: "tax.jakarta@ptabc.com",
  nitku: "0012345678",
  npwp: "123456789012345",
  clientId: "CLIENT_001",
  clientSecret: "SECRET_001",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
} satisfies BusinessAreaResponse;

describe("businessAreaColumns", () => {
  it("returns an array of 8 columns", () => {
    expect(businessAreaColumns(mockHandlers)).toHaveLength(8);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);

    expect(ids).toEqual([
      "number",
      "name",
      "baCode",
      "companyCode",
      "branchCode",
      "email",
      "isActive",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );

    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "actions",
    );

    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];

    columns.forEach((col) => {
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("meta.title values match expected column labels", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);

    expect(titles).toEqual([
      "No.",
      "Name",
      "Business Area Code",
      "Company Code",
      "Branch Code",
      "Email",
      "Status",
      "Actions",
    ]);
  });

  it("renders all column headers", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];

    const numberCol = columns.find((col) => (col.id ?? "") === "number");
    const nameCol = columns.find((col) => (col.accessorKey ?? "") === "name");
    const baCodeCol = columns.find(
      (col) => (col.accessorKey ?? "") === "baCode",
    );
    const companyCodeCol = columns.find(
      (col) => (col.accessorKey ?? "") === "companyCode",
    );
    const branchCodeCol = columns.find(
      (col) => (col.accessorKey ?? "") === "branchCode",
    );
    const emailCol = columns.find((col) => (col.accessorKey ?? "") === "email");
    const statusCol = columns.find(
      (col) => (col.accessorKey ?? "") === "isActive",
    );
    const actionsCol = columns.find((col) => (col.id ?? "") === "actions");

    if (numberCol?.header) {
      render(<>{flexRender(numberCol.header, {} as never)}</>);
      expect(screen.getByText("No.")).toBeInTheDocument();
    }

    [
      nameCol,
      baCodeCol,
      companyCodeCol,
      branchCodeCol,
      emailCol,
      statusCol,
    ].forEach((column) => {
      if (!column?.header) return;
      render(
        <>
          {flexRender(column.header, {
            column: { id: column.id ?? column.accessorKey },
          } as never)}
        </>,
      );
      expect(screen.getAllByTestId("column-header").length).toBeGreaterThan(0);
    });

    if (actionsCol?.header) {
      render(<>{flexRender(actionsCol.header, {} as never)}</>);
      expect(screen.getByText("Actions")).toBeInTheDocument();
    }
  });

  it("renders number cell with row index + 1", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => (col.id ?? "") === "number");

    if (!numberCol?.cell) return;

    render(
      <>
        {flexRender(numberCol.cell, {
          row: { index: 2, original: mockRow },
          column: { id: "number" },
          getValue: () => undefined,
          renderValue: () => undefined,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never)}
      </>,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders branchCode cell with dash when value is missing", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const branchCol = columns.find(
      (col) => (col.accessorKey ?? "") === "branchCode",
    );

    if (!branchCol?.cell) return;

    render(
      <>
        {flexRender(branchCol.cell, {
          row: {
            index: 0,
            original: { ...mockRow, branchCode: undefined },
            getValue: () => undefined,
          },
          column: { id: "branchCode" },
          getValue: () => undefined,
          renderValue: () => undefined,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never)}
      </>,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders name cell with the row value", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => (col.accessorKey ?? "") === "name");

    if (!nameCol?.cell) return;

    render(
      <>
        {flexRender(nameCol.cell, {
          row: { index: 0, original: mockRow, getValue: () => mockRow.name },
          column: { id: "name" },
          getValue: () => mockRow.name,
          renderValue: () => mockRow.name,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never)}
      </>,
    );

    expect(screen.getByText(mockRow.name)).toBeInTheDocument();
  });

  it("renders business area code cell with the row value", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const baCodeCol = columns.find(
      (col) => (col.accessorKey ?? "") === "baCode",
    );

    if (!baCodeCol?.cell) return;

    render(
      <>
        {flexRender(baCodeCol.cell, {
          row: { index: 0, original: mockRow, getValue: () => mockRow.baCode },
          column: { id: "baCode" },
          getValue: () => mockRow.baCode,
          renderValue: () => mockRow.baCode,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never)}
      </>,
    );

    expect(screen.getByText(mockRow.baCode)).toBeInTheDocument();
  });

  it("renders company code cell with the row value", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const companyCodeCol = columns.find(
      (col) => (col.accessorKey ?? "") === "companyCode",
    );

    if (!companyCodeCol?.cell) return;

    render(
      <>
        {flexRender(companyCodeCol.cell, {
          row: {
            index: 0,
            original: mockRow,
            getValue: () => mockRow.companyCode,
          },
          column: { id: "companyCode" },
          getValue: () => mockRow.companyCode,
          renderValue: () => mockRow.companyCode,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never)}
      </>,
    );

    expect(screen.getByText(mockRow.companyCode)).toBeInTheDocument();
  });

  it("renders email cell with dash when value is missing", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const emailCol = columns.find((col) => (col.accessorKey ?? "") === "email");

    if (!emailCol?.cell) return;

    render(
      <>
        {flexRender(emailCol.cell, {
          row: {
            index: 0,
            original: { ...mockRow, email: undefined },
            getValue: () => undefined,
          },
          column: { id: "email" },
          getValue: () => undefined,
          renderValue: () => undefined,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never)}
      </>,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders status cell with active badge", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const statusCol = columns.find(
      (col) => (col.accessorKey ?? "") === "isActive",
    );

    if (!statusCol?.cell) return;

    render(
      <>
        {flexRender(statusCol.cell, {
          row: { index: 0, original: mockRow },
          column: { id: "isActive" },
          getValue: () => true,
          renderValue: () => true,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never)}
      </>,
    );

    expect(screen.getByTestId("status-badge-active")).toBeInTheDocument();
  });

  it("renders status cell with inactive badge", () => {
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const statusCol = columns.find(
      (col) => (col.accessorKey ?? "") === "isActive",
    );

    if (!statusCol?.cell) return;

    render(
      <>
        {flexRender(statusCol.cell, {
          row: { index: 0, original: { ...mockRow, isActive: false } },
          column: { id: "isActive" },
          getValue: () => false,
          renderValue: () => false,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never)}
      </>,
    );

    expect(screen.getByTestId("status-badge-inactive")).toBeInTheDocument();
  });

  it("renders actions and forwards handlers", async () => {
    const user = userEvent.setup();
    const columns = businessAreaColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => (col.id ?? "") === "actions");

    if (!actionsCol?.cell) return;

    render(
      <>
        {flexRender(actionsCol.cell, {
          row: { index: 0, original: mockRow },
          column: { id: "actions" },
          getValue: () => undefined,
          renderValue: () => undefined,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never)}
      </>,
    );

    await user.click(screen.getByTestId("action-btn-edit"));
    await user.click(screen.getByTestId("action-btn-delete"));

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockRow);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockRow);
  });
});
