import type { VillageResponse } from "@/features/master-data";
import { villageColumns } from "@/features/master-data/village/components/village-columns";
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

const mockHandlers: TableActionHandlers<VillageResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

const mockDistrict = {
  id: 1,
  code: "DIST001",
  name: "Test District",
  provinceId: 1,
  regencyId: 1,
  isActive: true,
  createdAt: "2024-06-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const mockRow: VillageResponse = {
  id: 1,
  code: "VIL001",
  name: "Cihampelas",
  postalCode: "40141",
  provinceId: 1,
  regencyId: 1,
  districtId: 1,
  district: mockDistrict,
  isActive: true,
  createdAt: "2024-06-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

describe("villageColumns", () => {
  it("returns an array of 7 columns", () => {
    const columns = villageColumns(mockHandlers);
    expect(columns).toHaveLength(7);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "code",
      "name",
      "postalCode",
      "district",
      "isActive",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("isActive column has enableSorting not defined", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const isActiveCol = columns.find(
      (col) => (col.accessorKey ?? col.id) === "isActive",
    );
    expect(isActiveCol?.enableSorting).not.toBeDefined();
  });

  it("each column has a meta.title defined", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta).toBeDefined();
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("meta.title values match expected column labels", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Code",
      "Name",
      "Postal Code",
      "District",
      "Status",
      "Actions",
    ]);
  });

  it("renders number cell with row index + 1", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
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
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "number");
    if (!numberCol?.header) return;
    render(flexRender(numberCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders code column header with ColumnHeader component", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "code");
    if (!codeCol?.header) return;
    render(
      flexRender(codeCol.header, {
        column: { id: "code" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header-code")).toBeInTheDocument();
  });

  it("renders code column cell with mono font value or dash when empty", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "code");
    if (!codeCol?.cell) return;
    const { unmount } = render(
      flexRender(codeCol.cell, {
        row: { index: 0, original: mockRow, getValue: () => "VIL001" },
        column: { id: "code" },
        getValue: () => "VIL001",
        renderValue: () => "VIL001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("VIL001")).toBeInTheDocument();
    unmount();

    render(
      flexRender(codeCol.cell, {
        row: {
          index: 0,
          original: { ...mockRow, code: undefined },
          getValue: () => undefined,
        },
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

  it("renders name column header with ColumnHeader component", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "name");
    if (!nameCol?.header) return;
    render(
      flexRender(nameCol.header, {
        column: { id: "name" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header-name")).toBeInTheDocument();
  });

  it("renders name column cell with village name value", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "name");
    if (!nameCol?.cell) return;
    render(
      flexRender(nameCol.cell, {
        row: { index: 0, original: mockRow, getValue: () => "Cihampelas" },
        column: { id: "name" },
        getValue: () => "Cihampelas",
        renderValue: () => "Cihampelas",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Cihampelas")).toBeInTheDocument();
  });

  it("renders postalCode column header with ColumnHeader component", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const postalCodeCol = columns.find(
      (col) => col.accessorKey === "postalCode",
    );
    if (!postalCodeCol?.header) return;
    render(
      flexRender(postalCodeCol.header, {
        column: { id: "postalCode" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header-postalCode")).toBeInTheDocument();
  });

  it("renders postalCode column cell with value or dash when empty", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const postalCodeCol = columns.find(
      (col) => col.accessorKey === "postalCode",
    );
    if (!postalCodeCol?.cell) return;
    const { unmount } = render(
      flexRender(postalCodeCol.cell, {
        row: { index: 0, original: mockRow, getValue: () => "40141" },
        column: { id: "postalCode" },
        getValue: () => "40141",
        renderValue: () => "40141",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("40141")).toBeInTheDocument();
    unmount();

    render(
      flexRender(postalCodeCol.cell, {
        row: {
          index: 0,
          original: { ...mockRow, postalCode: undefined },
          getValue: () => undefined,
        },
        column: { id: "postalCode" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders district column header with ColumnHeader component", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const districtCol = columns.find((col) => col.accessorKey === "district");
    if (!districtCol?.header) return;
    render(
      flexRender(districtCol.header, {
        column: { id: "district" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header-district")).toBeInTheDocument();
  });

  it("renders district column cell with district name when district is present", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const districtCol = columns.find((col) => col.accessorKey === "district");
    if (!districtCol?.cell) return;
    render(
      flexRender(districtCol.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "district" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Test District")).toBeInTheDocument();
  });

  it("renders district column cell with dash when district is absent", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const districtCol = columns.find((col) => col.accessorKey === "district");
    if (!districtCol?.cell) return;
    render(
      flexRender(districtCol.cell, {
        row: { index: 0, original: { ...mockRow, district: undefined } },
        column: { id: "district" },
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
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
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
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
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
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
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
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.header) return;
    render(flexRender(actionsCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders actions cell with edit and delete buttons", () => {
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
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
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
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
    const columns = villageColumns(mockHandlers) as unknown as TestColumnDef[];
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
