import {
  closureDetailColumns,
  type VaultStationClosureDetail,
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
      formatDate: (date: string, format: string) => {
        if (format === "DD/MM/YYYY") {
          const d = new Date(date);
          return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
        }
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      },
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

const mockClosure: VaultStationClosureDetail = {
  id: 1,
  virtualAccountNumber: "1234567890",
  stationName: "Station A",
  companyCode: "C001",
  closureNumber: "CL-001",
  closureDate: "2025-06-15",
  depositDate: "2025-06-15T10:00:00Z",
  closureAmount: 10000000,
  totalDepositAmount: 9000000,
  bankCode: "BANK01",
  billingType: "CREDIT",
  paymentStatus: 1,
  postingA8Status: 2,
};

describe("closureDetailColumns", () => {
  it("should return 11 columns (10 data + 1 actions)", () => {
    const columns = closureDetailColumns();
    expect(columns).toHaveLength(11);
  });

  it("should have correct column ids/accessorKeys", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "no",
      "virtualAccountNumber",
      "companyCode",
      "closureNumber",
      "closureDate",
      "depositDate",
      "closureAmount",
      "totalDepositAmount",
      "bankCode",
      "billingType",
      "actions",
    ]);
  });

  it("should render No. cell with sequential number", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const col = columns[0];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow(mockClosure as unknown as Record<string, unknown>),
        table: { options: { meta: createTableMeta(0, 10) } },
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should render virtualAccountNumber cell with value", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const col = columns[1];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ virtualAccountNumber: "1234567890" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("1234567890")).toBeInTheDocument();
  });

  it("should render companyCode cell with value", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const col = columns[2];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ companyCode: "C001" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("C001")).toBeInTheDocument();
  });

  it("should render closureNumber cell with value", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const col = columns[3];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ closureNumber: "CL-001" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("CL-001")).toBeInTheDocument();
  });

  it("should render closureDate cell with formatted date", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const col = columns[4];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ closureDate: "2025-06-15" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("15/06/2025")).toBeInTheDocument();
  });

  it("should render depositDate cell with formatted date when present", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const col = columns[5];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ depositDate: "2025-06-15T10:00:00Z" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("15/06/2025")).toBeInTheDocument();
  });

  it("should render depositDate cell with dash when null", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const col = columns[5];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ depositDate: null }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should render closureAmount cell with formatted currency", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const col = columns[6];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ closureAmount: 10000000 }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Rp10.000.000")).toBeInTheDocument();
  });

  it("should render totalDepositAmount cell with formatted currency", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const col = columns[7];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ totalDepositAmount: 9000000 }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Rp9.000.000")).toBeInTheDocument();
  });

  it("should render bankCode cell with value", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const col = columns[8];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ bankCode: "BANK01" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("BANK01")).toBeInTheDocument();
  });

  it("should render billingType cell with badge for CREDIT", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const col = columns[9];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ billingType: "CREDIT" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Credit")).toBeInTheDocument();
  });

  it("should render billingType cell with badge for No Deposit", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const col = columns[9];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ billingType: "-" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("No Deposit")).toBeInTheDocument();
  });

  it("should render actions cell with view button", () => {
    const columns = closureDetailColumns() as unknown as TestColumnDef[];
    const col = columns[10];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow(mockClosure as unknown as Record<string, unknown>),
      } as never) as React.ReactElement,
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should call onView when actions button clicked", async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    const columns = closureDetailColumns({
      onView,
    }) as unknown as TestColumnDef[];
    const col = columns[10];
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow(mockClosure as unknown as Record<string, unknown>),
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByRole("button"));
    expect(onView).toHaveBeenCalledWith(mockClosure);
  });
});
