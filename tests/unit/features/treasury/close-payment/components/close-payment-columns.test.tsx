import type { ClosePaymentResponse } from "@/features/treasury";
import {
  closePaymentColumns,
  type ClosePaymentTableActionHandlers,
} from "@/features/treasury/close-payment/components/close-payment-columns";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
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
        disabled,
        title,
      }: {
        variant: string;
        onClick?: () => void;
        disabled?: boolean;
        title?: string;
      }) => (
        <button
          data-testid={`action-btn-${variant}`}
          onClick={onClick}
          disabled={disabled}
          title={title}
        >
          {variant}
        </button>
      ),
      ActionButton: ({
        variant,
        onClick,
        disabled,
        title,
      }: {
        variant: string;
        onClick?: () => void;
        disabled?: boolean;
        title?: string;
      }) => (
        <button
          data-testid={`action-btn-${variant}`}
          onClick={onClick}
          disabled={disabled}
          title={title}
        >
          {variant}
        </button>
      ),
      ColumnHeader: ({ column }: { column: { id: string } }) => (
        <div data-testid={`column-header-${column.id}`} />
      ),
      Checkbox: ({
        checked,
        onCheckedChange,
        "aria-label": ariaLabel,
      }: {
        checked?: boolean | "indeterminate";
        onCheckedChange?: (value: boolean) => void;
        "aria-label"?: string;
      }) => (
        <input
          type="checkbox"
          data-testid={`checkbox-${ariaLabel}`}
          checked={checked === true}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          aria-label={ariaLabel}
        />
      ),
      formatCurrency: (amount: number, currency: string) => {
        if (amount == null) return "-";
        if (currency === "IDR") {
          return `Rp ${Number(amount).toLocaleString("id-ID")}`;
        }
        return `${amount}`;
      },
      formatDate: (date: string) => date,
      cn: (...args: unknown[]) => args.filter(Boolean).join(" "),

      StatusBadge: ({ status, label }: { status: string; label: string }) => (
        <div data-testid={`status-badge-${status}`}>{label}</div>
      ),
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

const mockHandlers: ClosePaymentTableActionHandlers = {
  onDetail: vi.fn(),
  onEdit: vi.fn(),
  onReset: vi.fn(),
};

interface WrapperProps {
  data: Partial<ClosePaymentResponse>[];
}

function TableWrapper({ data }: WrapperProps) {
  const columns = closePaymentColumns(mockHandlers) as ColumnDef<
    Partial<ClosePaymentResponse>
  >[];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  return (
    <table>
      {headerGroups.map((hg) => (
        <thead key={hg.id}>
          <tr>
            {hg.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        </thead>
      ))}
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

describe("closePaymentColumns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 15 columns", () => {
    const columns = closePaymentColumns(mockHandlers);
    expect(columns).toHaveLength(15);
  });

  it("has correct column ids", () => {
    const columns = closePaymentColumns(mockHandlers);
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "select",
      "number",
      "custId",
      "name",
      "invoiceNumber",
      "transId",
      "ppfNumber",
      "paymentDate",
      "dueDate",
      "amount",
      "paymentAmount",
      "bankCode",
      "paymentStatus",
      "postingA8Status",
      "actions",
    ]);
  });

  it("renders select all checkbox in header", () => {
    render(<TableWrapper data={[]} />);
    expect(screen.getByLabelText("Select all")).toBeInTheDocument();
  });

  it("renders select row checkbox in each row", () => {
    render(<TableWrapper data={[{ custId: "CUST-001" }]} />);
    expect(screen.getByLabelText("Select row")).toBeInTheDocument();
  });

  it("renders row number as index + 1", () => {
    render(
      <TableWrapper
        data={[
          { custId: "CUST-001" },
          { custId: "CUST-002" },
          { custId: "CUST-003" },
        ]}
      />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders customer ID with font-medium text-sm", () => {
    render(<TableWrapper data={[{ custId: "CUST-001" }]} />);

    const custIdCell = screen.getByText("CUST-001");
    expect(custIdCell).toBeInTheDocument();
    expect(custIdCell.className).toContain("font-medium");
    expect(custIdCell.className).toContain("text-sm");
  });

  it("renders invoice number with font-mono", () => {
    render(<TableWrapper data={[{ invoiceNumber: "INV-001" }]} />);

    const invoiceCell = screen.getByText("INV-001");
    expect(invoiceCell).toBeInTheDocument();
    expect(invoiceCell.className).toContain("font-mono");
  });

  it("renders date fields with formatDate", () => {
    render(
      <TableWrapper
        data={[
          {
            paymentDate: "2025-01-15",
            dueDate: "2025-02-15",
          },
        ]}
      />,
    );

    expect(screen.getByText("2025-01-15")).toBeInTheDocument();
    expect(screen.getByText("2025-02-15")).toBeInTheDocument();
  });

  it("renders amount with IDR currency formatting", () => {
    render(
      <TableWrapper
        data={[
          {
            amount: 10000000,
            paymentAmount: 5000000,
          },
        ]}
      />,
    );

    expect(screen.getByText("Rp 10.000.000")).toBeInTheDocument();
    expect(screen.getByText("Rp 5.000.000")).toBeInTheDocument();
  });

  it("renders payment status badge as active for PAID", () => {
    render(
      <TableWrapper
        data={[
          {
            paymentStatus: 1,
          },
        ]}
      />,
    );

    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByTestId("status-badge-active")).toBeInTheDocument();
  });

  it("renders payment status badge as inactive for UNPAID", () => {
    render(
      <TableWrapper
        data={[
          {
            paymentStatus: 0,
          },
        ]}
      />,
    );

    expect(screen.getByText("Unpaid")).toBeInTheDocument();
    expect(
      screen.getAllByTestId("status-badge-inactive").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders posting A8 status badge with correct variant", () => {
    render(
      <TableWrapper
        data={[
          {
            postingA8Status: 0,
          },
        ]}
      />,
    );

    expect(screen.getByText("Not Generated")).toBeInTheDocument();
    expect(
      screen.getAllByTestId("status-badge-inactive").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders posting A8 status as warning for PARTIAL", () => {
    render(
      <TableWrapper
        data={[
          {
            postingA8Status: 1,
          },
        ]}
      />,
    );

    expect(screen.getByText("Partial")).toBeInTheDocument();
    expect(screen.getByTestId("status-badge-warning")).toBeInTheDocument();
  });

  it("renders posting A8 status as active for SUCCESS", () => {
    render(
      <TableWrapper
        data={[
          {
            postingA8Status: 2,
          },
        ]}
      />,
    );

    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByTestId("status-badge-active")).toBeInTheDocument();
  });

  it("renders posting A8 status as error for FAILED", () => {
    render(
      <TableWrapper
        data={[
          {
            postingA8Status: 5,
          },
        ]}
      />,
    );

    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByTestId("status-badge-error")).toBeInTheDocument();
  });

  it("renders action buttons: generate/reset, show, edit", () => {
    render(
      <TableWrapper
        data={[
          {
            custId: "CUST-001",
          },
        ]}
      />,
    );

    expect(screen.getByTestId("action-btn-generate")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-show")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-edit")).toBeInTheDocument();
  });

  it("calls onDetail when show button is clicked", async () => {
    const user = userEvent.setup();
    const mockRow: Partial<ClosePaymentResponse> = {
      custId: "CUST-001",
      name: "PT Example",
    };

    render(<TableWrapper data={[mockRow]} />);

    await user.click(screen.getByTestId("action-btn-show"));
    expect(mockHandlers.onDetail).toHaveBeenCalledWith(mockRow);
  });

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const mockRow: Partial<ClosePaymentResponse> = {
      custId: "CUST-001",
      paymentStatus: 0,
    };

    render(<TableWrapper data={[mockRow]} />);

    await user.click(screen.getByTestId("action-btn-edit"));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockRow);
  });

  it("calls onReset when reset button is clicked", async () => {
    const user = userEvent.setup();
    const mockRow: Partial<ClosePaymentResponse> = {
      custId: "CUST-001",
      postingA8Status: 1,
    };

    render(<TableWrapper data={[mockRow]} />);

    await user.click(screen.getByTestId("action-btn-generate"));
    expect(mockHandlers.onReset).toHaveBeenCalledWith(mockRow);
  });

  it("disables reset button when postingA8Status is NOT_GENERATED (0)", () => {
    render(
      <TableWrapper
        data={[
          {
            postingA8Status: 0,
          },
        ]}
      />,
    );

    expect(screen.getByTestId("action-btn-generate")).toBeDisabled();
  });

  it("enables reset button when postingA8Status is PARTIAL (1)", () => {
    render(
      <TableWrapper
        data={[
          {
            postingA8Status: 1,
          },
        ]}
      />,
    );

    expect(screen.getByTestId("action-btn-generate")).not.toBeDisabled();
  });

  it("enables reset button when postingA8Status is FAILED (5)", () => {
    render(
      <TableWrapper
        data={[
          {
            postingA8Status: 5,
          },
        ]}
      />,
    );

    expect(screen.getByTestId("action-btn-generate")).not.toBeDisabled();
  });

  it("disables edit button when paymentStatus is PAID (1)", () => {
    render(
      <TableWrapper
        data={[
          {
            paymentStatus: 1,
          },
        ]}
      />,
    );

    expect(screen.getByTestId("action-btn-edit")).toBeDisabled();
  });

  it("enables edit button when paymentStatus is UNPAID (0)", () => {
    render(
      <TableWrapper
        data={[
          {
            paymentStatus: 0,
          },
        ]}
      />,
    );

    expect(screen.getByTestId("action-btn-edit")).not.toBeDisabled();
  });

  it("disables reset when postingA8Status is SUCCESS (2)", () => {
    render(
      <TableWrapper
        data={[
          {
            postingA8Status: 2,
          },
        ]}
      />,
    );

    expect(screen.getByTestId("action-btn-generate")).toBeDisabled();
  });
});
