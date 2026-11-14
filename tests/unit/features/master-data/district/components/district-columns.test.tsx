import type { DistrictResponse } from "@/features/master-data";
import { districtColumns } from "@/features/master-data/district/components/district-columns";
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

const mockHandlers: TableActionHandlers<DistrictResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("districtColumns", () => {
  it("returns an array of 6 columns", () => {
    const columns = districtColumns(mockHandlers);
    expect(columns).toHaveLength(6);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "code",
      "name",
      "regency",
      "isActive",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta).toBeDefined();
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("meta.title values match expected column labels", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Code",
      "Name",
      "Regency",
      "Status",
      "Actions",
    ]);
  });

  it("renders number cell with row index + 1", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
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
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "number");
    if (!numberCol?.header) return;
    render(flexRender(numberCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders code column header with ColumnHeader component", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "code");
    if (!codeCol?.header) return;
    render(
      flexRender(codeCol.header, {
        column: { id: "code" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders code column cell with district code value", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "code");
    if (!codeCol?.cell) return;
    render(
      flexRender(codeCol.cell, {
        row: {
          index: 0,
          original: { code: "DIST001" },
          getValue: () => "DIST001",
        },
        column: { id: "code" },
        getValue: () => "DIST001",
        renderValue: () => "DIST001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("DIST001")).toBeInTheDocument();
  });

  it("renders code column cell with dash when code is null", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "code");
    if (!codeCol?.cell) return;
    render(
      flexRender(codeCol.cell, {
        row: {
          index: 0,
          original: {},
          getValue: () => null,
        },
        column: { id: "code" },
        getValue: () => null,
        renderValue: () => null,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders name column header with ColumnHeader component", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "name");
    if (!nameCol?.header) return;
    render(
      flexRender(nameCol.header, {
        column: { id: "name" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders name column cell with district name value", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "name");
    if (!nameCol?.cell) return;
    render(
      flexRender(nameCol.cell, {
        row: {
          index: 0,
          original: { name: "Bandung City" },
          getValue: () => "Bandung City",
        },
        column: { id: "name" },
        getValue: () => "Bandung City",
        renderValue: () => "Bandung City",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Bandung City")).toBeInTheDocument();
  });

  it("renders regency column header with ColumnHeader component", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const regencyCol = columns.find((col) => col.accessorKey === "regency");
    if (!regencyCol?.header) return;
    render(
      flexRender(regencyCol.header, {
        column: { id: "regency" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders regency column cell with regency name", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const regencyCol = columns.find((col) => col.accessorKey === "regency");
    if (!regencyCol?.cell) return;
    render(
      flexRender(regencyCol.cell, {
        row: {
          index: 0,
          original: {
            regency: { id: 1, name: "Bandung", code: "BDG" },
          },
        },
        column: { id: "regency" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Bandung")).toBeInTheDocument();
  });

  it("renders regency column cell with dash when regency is null", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const regencyCol = columns.find((col) => col.accessorKey === "regency");
    if (!regencyCol?.cell) return;
    render(
      flexRender(regencyCol.cell, {
        row: {
          index: 0,
          original: { regency: null },
        },
        column: { id: "regency" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders isActive column header with ColumnHeader component", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
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
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
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
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
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
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.header) return;
    render(flexRender(actionsCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders actions cell with edit and delete buttons", () => {
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockDistrictRow: DistrictResponse = {
      id: 1,
      name: "Test District",
      code: "DIST001",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };
    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockDistrictRow },
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
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockDistrictRow: DistrictResponse = {
      id: 2,
      name: "District 2",
      code: "DIST002",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };
    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockDistrictRow },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    await user.click(screen.getByTestId("action-btn-edit"));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockDistrictRow);
  });

  it("calls onDelete handler when delete button is clicked in actions cell", async () => {
    const user = userEvent.setup();
    const columns = districtColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const mockDistrictRow: DistrictResponse = {
      id: 3,
      name: "District 3",
      code: "DIST003",
      isActive: false,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };
    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockDistrictRow },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    await user.click(screen.getByTestId("action-btn-delete"));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockDistrictRow);
  });
});
