import {
  stationSummaryColumns,
  type VaultStationSummary,
} from "@/features/treasury";
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
      formatCurrency: (amount: number) => `Rp${amount.toLocaleString("id-ID")}`,
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/skeleton", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

function createRow(original: Record<string, unknown>, index = 0) {
  return {
    original,
    index,
    getValue: (key: string) => original[key],
  };
}

function createTableMeta(currentPage?: number, pageSize?: number) {
  return { currentPage, pageSize };
}

type TestColumnDef = {
  id?: string;
  accessorKey?: string;
  header?: React.ComponentType<never> | ((ctx: never) => React.ReactNode);
  cell?: React.ComponentType<never>;
};

const mockStation: VaultStationSummary = {
  stationName: "Station A",
  companyCode: "C001",
  closureCount: 5,
  totalClosureAmount: 50000000,
  totalDepositAmount: 45000000,
};

describe("stationSummaryColumns", () => {
  it("should return 9 columns (8 data + 1 actions)", () => {
    const columns = stationSummaryColumns();
    expect(columns).toHaveLength(9);
  });

  it("should have correct column ids/accessorKeys", () => {
    const columns = stationSummaryColumns() as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "no",
      "stationName",
      "companyCode",
      "closureCount",
      "totalClosureAmount",
      "totalCreditAmount",
      "totalDepositAmount",
      "totalCompleteAmount",
      "actions",
    ]);
  });

  it("should render No. cell with sequential number", () => {
    const columns = stationSummaryColumns() as unknown as TestColumnDef[];
    const col = columns[0];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow(mockStation as unknown as Record<string, unknown>),
        table: { options: { meta: createTableMeta(1, 10) } },
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("11")).toBeInTheDocument();
  });

  it("should render No. cell with 0-based offset when meta is undefined", () => {
    const columns = stationSummaryColumns() as unknown as TestColumnDef[];
    const col = columns[0];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow(mockStation as unknown as Record<string, unknown>),
        table: { options: { meta: undefined } },
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should render stationName cell with value", () => {
    const columns = stationSummaryColumns() as unknown as TestColumnDef[];
    const col = columns[1];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ stationName: "Station A" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Station A")).toBeInTheDocument();
  });

  it("should render companyCode cell with value", () => {
    const columns = stationSummaryColumns() as unknown as TestColumnDef[];
    const col = columns[2];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ companyCode: "C001" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("C001")).toBeInTheDocument();
  });

  it("should render closureCount cell with value", () => {
    const columns = stationSummaryColumns() as unknown as TestColumnDef[];
    const col = columns[3];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ closureCount: 5 }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should render totalClosureAmount cell with formatted currency", () => {
    const columns = stationSummaryColumns() as unknown as TestColumnDef[];
    const col = columns[4];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ totalClosureAmount: 50000000 }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Rp50.000.000")).toBeInTheDocument();
  });

  it("should render totalDepositAmount cell with formatted currency", () => {
    const columns = stationSummaryColumns() as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "totalDepositAmount");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ totalDepositAmount: 45000000 }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Rp45.000.000")).toBeInTheDocument();
  });

  it("should render actions cell with button", () => {
    const columns = stationSummaryColumns() as unknown as TestColumnDef[];
    const col = columns[8];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow(mockStation as unknown as Record<string, unknown>),
      } as never) as React.ReactElement,
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should call onView when actions button clicked", async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    const columns = stationSummaryColumns({
      onView,
    }) as unknown as TestColumnDef[];
    const col = columns[8];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow(mockStation as unknown as Record<string, unknown>),
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByRole("button"));
    expect(onView).toHaveBeenCalledWith(mockStation);
  });
});
