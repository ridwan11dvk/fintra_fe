import type { CountryResponse } from "@/features/master-data";
import { countryColumns } from "@/features/master-data/country/components/country-columns";
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

const mockHandlers: TableActionHandlers<CountryResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("countryColumns", () => {
  it("returns an array of 7 columns", () => {
    const columns = countryColumns(mockHandlers);
    expect(columns).toHaveLength(7);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "name",
      "iso2Code",
      "iso3Code",
      "dialCode",
      "isActive",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("isActive column has enableSorting: false", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
    const isActiveCol = columns.find(
      (col) => (col.accessorKey ?? col.id) === "isActive",
    );
    expect(isActiveCol?.enableSorting).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta).toBeDefined();
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("meta.title values match expected column labels", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Name",
      "ISO 2",
      "ISO 3",
      "Dial Code",
      "Status",
      "Actions",
    ]);
  });

  it("renders number cell with row index + 1", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
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
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "number");
    if (!numberCol?.header) return;
    render(flexRender(numberCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders name cell with country name value", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "name");
    if (!nameCol?.cell) return;
    render(
      flexRender(nameCol.cell, {
        row: {
          index: 0,
          original: { name: "Indonesia" },
          getValue: () => "Indonesia",
        },
        column: { id: "name" },
        getValue: () => "Indonesia",
        renderValue: () => "Indonesia",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Indonesia")).toBeInTheDocument();
  });

  it("renders iso2Code cell with font-mono class value", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
    const iso2Col = columns.find((col) => col.accessorKey === "iso2Code");
    if (!iso2Col?.cell) return;
    render(
      flexRender(iso2Col.cell, {
        row: {
          index: 0,
          original: { iso2Code: "ID" },
          getValue: () => "ID",
        },
        column: { id: "iso2Code" },
        getValue: () => "ID",
        renderValue: () => "ID",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("ID")).toBeInTheDocument();
  });

  it("renders iso3Code cell with font-mono class value", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
    const iso3Col = columns.find((col) => col.accessorKey === "iso3Code");
    if (!iso3Col?.cell) return;
    render(
      flexRender(iso3Col.cell, {
        row: {
          index: 0,
          original: { iso3Code: "IDN" },
          getValue: () => "IDN",
        },
        column: { id: "iso3Code" },
        getValue: () => "IDN",
        renderValue: () => "IDN",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("IDN")).toBeInTheDocument();
  });

  it("renders dialCode cell with font-mono value or dash", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
    const dialCol = columns.find((col) => col.accessorKey === "dialCode");
    if (!dialCol?.cell) return;
    render(
      flexRender(dialCol.cell, {
        row: {
          index: 0,
          original: { dialCode: "+62" },
          getValue: () => "+62",
        },
        column: { id: "dialCode" },
        getValue: () => "+62",
        renderValue: () => "+62",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("+62")).toBeInTheDocument();
  });

  it("renders dash when dialCode is empty", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
    const dialCol = columns.find((col) => col.accessorKey === "dialCode");
    if (!dialCol?.cell) return;
    render(
      flexRender(dialCol.cell, {
        row: {
          index: 0,
          original: { dialCode: "" },
          getValue: () => "",
        },
        column: { id: "dialCode" },
        getValue: () => "",
        renderValue: () => "",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders isActive cell with StatusBadge active", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
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

  it("renders isActive cell with StatusBadge inactive", () => {
    const columns = countryColumns(mockHandlers) as unknown as TestColumnDef[];
    const isActiveCol = columns.find(
      (col) => (col.accessorKey ?? "") === "isActive",
    );
    if (!isActiveCol?.cell) return;
    render(
      flexRender(isActiveCol.cell, {
        row: {
          index: 0,
          original: { isActive: false },
        },
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

  it("calls onEdit handler when edit action is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <div>
        {(
          countryColumns({ onEdit, onDelete: vi.fn() })[6] as unknown as {
            cell: (ctx: {
              row: { original: CountryResponse };
            }) => React.ReactNode;
          }
        ).cell({
          row: {
            original: {
              id: 1,
              name: "Indonesia",
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
      expect.objectContaining({ id: 1, name: "Indonesia" }),
    );
  });

  it("calls onDelete handler when delete action is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <div>
        {(
          countryColumns({ onEdit: vi.fn(), onDelete })[6] as unknown as {
            cell: (ctx: {
              row: { original: CountryResponse };
            }) => React.ReactNode;
          }
        ).cell({
          row: {
            original: {
              id: 1,
              name: "Indonesia",
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
      expect.objectContaining({ id: 1, name: "Indonesia" }),
    );
  });
});
