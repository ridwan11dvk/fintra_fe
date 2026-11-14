import { depositColumns, type DepositResponse } from "@/features/treasury";
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
        return date;
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

function createRow(original: Record<string, unknown>) {
  return {
    original,
    getValue: (key: string) => original[key],
  };
}

type TestColumnDef = {
  id?: string;
  accessorKey?: string;
  header?: React.ComponentType<never> | ((ctx: never) => React.ReactNode);
  cell?: React.ComponentType<never>;
};

describe("depositColumns", () => {
  const handlers = {
    onDetail: vi.fn(),
    onEdit: vi.fn(),
    onToggleSendStatus: vi.fn(),
  };

  const mockDeposit: DepositResponse = {
    id: 1,
    agentCode: "AGT001",
    virtualAccount: "1234567890",
    name: "John Doe",
    referenceNumber: "REF-001",
    depositDate: "2025-06-15T10:00:00Z",
    openingBalance: 5000000,
    amount: 1000000,
    closingBalance: 6000000,
    bankCode: "BANK01",
    documentPath: "/documents/test.pdf",
    sendStatus: 0,
    createdAt: "2025-06-15T10:00:00Z",
    updatedAt: "2025-06-15T10:00:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  };

  it("should return 11 columns (10 data + 1 actions)", () => {
    const columns = depositColumns(handlers);
    expect(columns).toHaveLength(11);
  });

  it("should have the correct column ids/accessorKeys", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "agentCode",
      "virtualAccount",
      "name",
      "referenceNumber",
      "depositDate",
      "amount",
      "openingBalance",
      "closingBalance",
      "bankCode",
      "sendStatus",
      "actions",
    ]);
  });

  it("should have correct header values in column definitions", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];

    const expectedHeaders = [
      "Agent Code",
      "Virtual Account",
      "Name",
      "Reference No.",
      "Deposit Date",
      "Amount",
      "Opening Balance",
      "Closing Balance",
      "Bank",
      "Send Status",
      "Actions",
    ];

    columns.forEach((col, index) => {
      expect(col.header).toBe(expectedHeaders[index]);
    });
  });

  it("should render actions cell with trigger button", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.id === "actions");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow(mockDeposit as unknown as Record<string, unknown>),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Open menu")).toBeInTheDocument();
  });

  it("should render agentCode cell with value", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "agentCode");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ agentCode: "AGT001" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("AGT001")).toBeInTheDocument();
  });

  it("should render agentCode cell with dash when undefined", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "agentCode");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({}),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should render name cell with value", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "name");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ name: "John Doe" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should render name cell with dash when undefined", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "name");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({}),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should render referenceNumber cell with value", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "referenceNumber");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ referenceNumber: "REF-001" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("REF-001")).toBeInTheDocument();
  });

  it("should render depositDate cell with formatted date", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "depositDate");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ depositDate: "2025-06-15T10:00:00Z" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("15/06/2025")).toBeInTheDocument();
  });

  it("should render depositDate cell with dash when undefined", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "depositDate");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({}),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should render amount cell with formatted currency", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "amount");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ amount: 1000000 }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Rp1.000.000")).toBeInTheDocument();
  });

  it("should render amount cell with dash when undefined", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "amount");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({}),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should render virtualAccount cell with value", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "virtualAccount");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ virtualAccount: "1234567890" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("1234567890")).toBeInTheDocument();
  });

  it("should render openingBalance cell with formatted currency", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "openingBalance");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ openingBalance: 5000000 }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Rp5.000.000")).toBeInTheDocument();
  });

  it("should render closingBalance cell with formatted currency", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "closingBalance");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ closingBalance: 6000000 }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Rp6.000.000")).toBeInTheDocument();
  });

  it("should render bankCode cell with value", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "bankCode");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ bankCode: "BANK01" }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("BANK01")).toBeInTheDocument();
  });

  it("should render sendStatus cell with Badge for Not Sent", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "sendStatus");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ sendStatus: 0 as 0 | 1 }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Not Sent")).toBeInTheDocument();
  });

  it("should render sendStatus cell with Badge for Sent", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "sendStatus");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ sendStatus: 1 as 0 | 1 }),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Sent")).toBeInTheDocument();
  });

  it("should render actions cell with DropdownMenu", async () => {
    const user = userEvent.setup();
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.id === "actions");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow(mockDeposit as unknown as Record<string, unknown>),
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByText("Open menu"));
    expect(await screen.findByText("Actions")).toBeInTheDocument();
  });

  it("should call onDetail when View Details clicked", async () => {
    const user = userEvent.setup();
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.id === "actions");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow(mockDeposit as unknown as Record<string, unknown>),
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByText("Open menu"));
    await user.click(screen.getByText("View Details"));
    expect(handlers.onDetail).toHaveBeenCalledWith(mockDeposit);
  });

  it("should call onEdit when Edit clicked", async () => {
    const user = userEvent.setup();
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.id === "actions");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow(mockDeposit as unknown as Record<string, unknown>),
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByText("Open menu"));
    await user.click(screen.getByText("Edit"));
    expect(handlers.onEdit).toHaveBeenCalledWith(mockDeposit);
  });

  it("should call onToggleSendStatus when Mark as Sent/Not Sent clicked", async () => {
    const user = userEvent.setup();
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.id === "actions");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow(mockDeposit as unknown as Record<string, unknown>),
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByText("Open menu"));
    await user.click(screen.getByText("Mark as Sent"));
    expect(handlers.onToggleSendStatus).toHaveBeenCalledWith(mockDeposit);
  });

  it("should show Mark as Sent in DropdownMenu when sendStatus is 0", async () => {
    const user = userEvent.setup();
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.id === "actions");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({
          ...mockDeposit,
          sendStatus: 0 as 0 | 1,
        } as unknown as Record<string, unknown>),
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByText("Open menu"));
    expect(await screen.findByText("Mark as Sent")).toBeInTheDocument();
  });

  it("should show Mark as Not Sent in DropdownMenu when sendStatus is 1", async () => {
    const user = userEvent.setup();
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.id === "actions");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({
          ...mockDeposit,
          sendStatus: 1 as 0 | 1,
        } as unknown as Record<string, unknown>),
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByText("Open menu"));
    expect(await screen.findByText("Mark as Not Sent")).toBeInTheDocument();
  });

  it("should render cell with dash for undefined optional fields", () => {
    const columns = depositColumns(handlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "virtualAccount");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({}),
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
