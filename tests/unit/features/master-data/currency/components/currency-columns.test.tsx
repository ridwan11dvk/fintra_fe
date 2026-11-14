import type { CurrencyResponse } from "@/features/master-data";
import { currencyColumns } from "@/features/master-data/currency/components/currency-columns";
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
        variant,
        children,
      }: {
        variant?: string;
        children?: React.ReactNode;
      }) => <div data-testid={`badge-${variant}`}>{children}</div>,
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

const mockHandlers: TableActionHandlers<CurrencyResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("currencyColumns", () => {
  it("returns an array of 8 columns", () => {
    const columns = currencyColumns(mockHandlers);
    expect(columns).toHaveLength(8);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "code",
      "name",
      "symbol",
      "country",
      "isPrimary",
      "isActive",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("isPrimary column has enableSorting: false", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const isPrimaryCol = columns.find(
      (col) => (col.accessorKey ?? col.id) === "isPrimary",
    );
    expect(isPrimaryCol?.enableSorting).toBe(false);
  });

  it("isActive column has enableSorting: false", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const isActiveCol = columns.find(
      (col) => (col.accessorKey ?? col.id) === "isActive",
    );
    expect(isActiveCol?.enableSorting).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta).toBeDefined();
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("meta.title values match expected column labels", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Code",
      "Name",
      "Symbol",
      "Country",
      "Primary",
      "Status",
      "Actions",
    ]);
  });

  it("renders number cell with row index + 1", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
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
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "number");
    if (!numberCol?.header) return;
    render(flexRender(numberCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders code cell with font-mono value", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "code");
    if (!codeCol?.cell) return;
    render(
      flexRender(codeCol.cell, {
        row: {
          index: 0,
          original: { code: "IDR" },
          getValue: () => "IDR",
        },
        column: { id: "code" },
        getValue: () => "IDR",
        renderValue: () => "IDR",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("IDR")).toBeInTheDocument();
  });

  it("renders name cell with name value or dash", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "name");
    if (!nameCol?.cell) return;
    render(
      flexRender(nameCol.cell, {
        row: {
          index: 0,
          original: { name: "Indonesian Rupiah" },
          getValue: () => "Indonesian Rupiah",
        },
        column: { id: "name" },
        getValue: () => "Indonesian Rupiah",
        renderValue: () => "Indonesian Rupiah",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Indonesian Rupiah")).toBeInTheDocument();
  });

  it("renders dash when name is empty", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "name");
    if (!nameCol?.cell) return;
    render(
      flexRender(nameCol.cell, {
        row: {
          index: 0,
          original: { name: "" },
          getValue: () => "",
        },
        column: { id: "name" },
        getValue: () => "",
        renderValue: () => "",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders symbol cell with bold centered value or dash", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const symbolCol = columns.find((col) => col.accessorKey === "symbol");
    if (!symbolCol?.cell) return;
    render(
      flexRender(symbolCol.cell, {
        row: {
          index: 0,
          original: { symbol: "Rp" },
          getValue: () => "Rp",
        },
        column: { id: "symbol" },
        getValue: () => "Rp",
        renderValue: () => "Rp",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Rp")).toBeInTheDocument();
  });

  it("renders country cell with country name", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const countryCol = columns.find((col) => col.accessorKey === "country");
    if (!countryCol?.cell) return;
    render(
      flexRender(countryCol.cell, {
        row: {
          index: 0,
          original: {
            country: {
              id: 1,
              name: "Indonesia",
              isActive: true,
              createdAt: "",
              updatedAt: "",
              createdBy: "",
              updatedBy: "",
            },
          },
          getValue: () => ({
            id: 1,
            name: "Indonesia",
            isActive: true,
            createdAt: "",
            updatedAt: "",
            createdBy: "",
            updatedBy: "",
          }),
        },
        column: { id: "country" },
        getValue: () => ({
          id: 1,
          name: "Indonesia",
          isActive: true,
          createdAt: "",
          updatedAt: "",
          createdBy: "",
          updatedBy: "",
        }),
        renderValue: () => ({
          id: 1,
          name: "Indonesia",
          isActive: true,
          createdAt: "",
          updatedAt: "",
          createdBy: "",
          updatedBy: "",
        }),
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Indonesia")).toBeInTheDocument();
  });

  it("renders isPrimary cell with Primary badge when true", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const isPrimaryCol = columns.find(
      (col) => (col.accessorKey ?? "") === "isPrimary",
    );
    if (!isPrimaryCol?.cell) return;
    render(
      flexRender(isPrimaryCol.cell, {
        row: {
          index: 0,
          original: { isPrimary: true },
        },
        column: { id: "isPrimary" },
        getValue: () => true,
        renderValue: () => true,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Primary")).toBeInTheDocument();
  });

  it("renders isPrimary cell with Secondary badge when false", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const isPrimaryCol = columns.find(
      (col) => (col.accessorKey ?? "") === "isPrimary",
    );
    if (!isPrimaryCol?.cell) return;
    render(
      flexRender(isPrimaryCol.cell, {
        row: {
          index: 0,
          original: { isPrimary: false },
        },
        column: { id: "isPrimary" },
        getValue: () => false,
        renderValue: () => false,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Secondary")).toBeInTheDocument();
  });

  it("renders isActive cell with StatusBadge", () => {
    const columns = currencyColumns(mockHandlers) as unknown as TestColumnDef[];
    const isActiveCol = columns.find(
      (col) => (col.accessorKey ?? "") === "isActive",
    );
    if (!isActiveCol?.cell) return;
    render(
      flexRender(isActiveCol.cell, {
        row: {
          index: 0,
          original: { isActive: true },
        },
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

  it("calls onEdit handler when edit action is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <div>
        {(
          currencyColumns({ onEdit, onDelete: vi.fn() })[7] as unknown as {
            cell: (ctx: {
              row: { original: CurrencyResponse };
            }) => React.ReactNode;
          }
        ).cell({
          row: {
            original: {
              id: 1,
              countryId: 1,
              code: "IDR",
              isPrimary: false,
              isActive: true,
              createdAt: "",
              updatedAt: "",
              createdBy: "",
              updatedBy: "",
            },
          },
        } as never)}
      </div>,
    );

    await user.click(screen.getByTestId("action-btn-edit"));
    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, code: "IDR" }),
    );
  });

  it("calls onDelete handler when delete action is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <div>
        {(
          currencyColumns({ onEdit: vi.fn(), onDelete })[7] as unknown as {
            cell: (ctx: {
              row: { original: CurrencyResponse };
            }) => React.ReactNode;
          }
        ).cell({
          row: {
            original: {
              id: 1,
              countryId: 1,
              code: "IDR",
              isPrimary: false,
              isActive: true,
              createdAt: "",
              updatedAt: "",
              createdBy: "",
              updatedBy: "",
            },
          },
        } as never)}
      </div>,
    );

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(onDelete).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, code: "IDR" }),
    );
  });
});
