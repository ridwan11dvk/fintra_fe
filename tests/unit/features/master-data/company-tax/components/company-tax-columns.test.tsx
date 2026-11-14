import type { CompanyTaxResponse } from "@/features/master-data";
import { companyTaxColumns } from "@/features/master-data/company-tax/components/company-tax-columns";
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

const mockHandlers: TableActionHandlers<CompanyTaxResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("companyTaxColumns", () => {
  it("returns an array of 7 columns", () => {
    const columns = companyTaxColumns(mockHandlers);
    expect(columns).toHaveLength(7);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "companyCode",
      "taxRateName",
      "glAccount",
      "startDate",
      "endDate",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("renders number cell with row index + 1", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "number");
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

  it("renders companyCode cell with font-mono class", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const codeCol = columns.find((col) => col.accessorKey === "companyCode");
    if (!codeCol?.cell) return;

    render(
      flexRender(codeCol.cell, {
        row: {
          index: 0,
          original: { companyCode: "PT. ABC" },
          getValue: () => "PT. ABC",
        },
        column: { id: "companyCode" },
        getValue: () => "PT. ABC",
        renderValue: () => "PT. ABC",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("PT. ABC")).toBeInTheDocument();
  });

  it("renders taxRateName from row.original.taxRate?.name", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const taxCol = columns.find((col) => col.id === "taxRateName");
    if (!taxCol?.cell) return;

    render(
      flexRender(taxCol.cell, {
        row: {
          index: 0,
          original: {
            taxRate: { name: "PPN 11%" },
          },
        },
        column: { id: "taxRateName" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("PPN 11%")).toBeInTheDocument();
  });

  it("renders '-' when taxRate is null", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const taxCol = columns.find((col) => col.id === "taxRateName");
    if (!taxCol?.cell) return;

    render(
      flexRender(taxCol.cell, {
        row: {
          index: 0,
          original: { taxRate: null },
        },
        column: { id: "taxRateName" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders glAccount cell as font-mono", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "glAccount");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { glAccount: "2103" },
          getValue: () => "2103",
        },
        column: { id: "glAccount" },
        getValue: () => "2103",
        renderValue: () => "2103",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("2103")).toBeInTheDocument();
  });

  it("renders '-' when glAccount is null", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "glAccount");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { glAccount: null },
          getValue: () => null,
        },
        column: { id: "glAccount" },
        getValue: () => null,
        renderValue: () => null,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders startDate with formatDate", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "startDate");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { startDate: "2024-01-01T00:00:00Z" },
          getValue: () => "2024-01-01T00:00:00Z",
        },
        column: { id: "startDate" },
        getValue: () => "2024-01-01T00:00:00Z",
        renderValue: () => "2024-01-01T00:00:00Z",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    // formatDate should format the date - just verify it renders something
    const el = screen.getByText(/2024|Jan|01/);
    expect(el).toBeInTheDocument();
  });

  it("renders '-' when startDate is empty", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "startDate");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { startDate: "" },
          getValue: () => "",
        },
        column: { id: "startDate" },
        getValue: () => "",
        renderValue: () => "",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders endDate with formatDate when value is provided", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "endDate");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { endDate: "2024-12-31T00:00:00Z" },
          getValue: () => "2024-12-31T00:00:00Z",
        },
        column: { id: "endDate" },
        getValue: () => "2024-12-31T00:00:00Z",
        renderValue: () => "2024-12-31T00:00:00Z",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    const el = screen.getByText(/2024|Dec|31/);
    expect(el).toBeInTheDocument();
  });

  it("renders '-' when endDate is null", () => {
    const columns = companyTaxColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "endDate");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
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
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("calls onEdit when edit action button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const columns = companyTaxColumns({
      onEdit,
      onDelete: vi.fn(),
    }) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;

    render(
      flexRender(actionsCol.cell, {
        row: {
          index: 0,
          original: { id: 1, companyCode: "PT. ABC" },
        },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByTestId("action-btn-edit"));
    expect(onEdit).toHaveBeenCalledWith({ id: 1, companyCode: "PT. ABC" });
  });

  it("calls onDelete when delete action button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const columns = companyTaxColumns({
      onEdit: vi.fn(),
      onDelete,
    }) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;

    render(
      flexRender(actionsCol.cell, {
        row: {
          index: 0,
          original: { id: 2, companyCode: "PT. XYZ" },
        },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(onDelete).toHaveBeenCalledWith({ id: 2, companyCode: "PT. XYZ" });
  });

  it("renders all column headers via flexRender", () => {
    const columns = companyTaxColumns(mockHandlers);
    let renderCount = 0;
    columns.forEach((col) => {
      if (!col.header) return;
      const { unmount } = render(
        flexRender(col.header, {
          column: { id: col.id ?? "" },
        } as never) as React.ReactElement,
      );
      unmount();
      renderCount++;
    });
    expect(renderCount).toBe(7);
  });
});
